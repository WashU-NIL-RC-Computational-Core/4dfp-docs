.. _imgreg_4dfp:

Image Registration
==================
.. rubric:: Tool: ``imgreg_4dfp``

Synopsis
--------

imgreg_4dfp <target_img> <target_mask> <source_img> <source_mask> <t4file> <mode>

Description
-----------

Calculates the 2D or 3D :term:`Linear Alignment` needed to line up a moving scan (**source**) with a reference scan (**target**). 

The resulting alignment parameters are saved as a ``4 x 4`` matrix inside the provided text-based :term:`t4 File`. Downstream 4dfp tools (such as :ref:`t4img_4dfp` and :ref:`t4imgs_4dfp`) read this file to apply the calculated spatial adjustments and resample the image volume.

The alignment workflow is controlled by the ``<mode>`` argument, which you construct by adding together individual feature bit values. Depending on your chosen mode, the tool can perform anything from broad grid searches (for recovering large spatial offsets) to high-precision mathematical polishing (for sub-voxel accuracy).

.. important::
   **Physical Units (mm) vs. Voxels:**
   All spatial translations, grid search steps (e.g., 7.5 mm), and sampling step sizes (e.g., 12.0 mm, 5.0 mm, 2.5 mm) are defined in **millimeters (mm)** in physical world space, **not in voxel or pixel units**.

.. _imgreg_4dfp_usage_table:

Usage
-----

.. list-table::
   :widths: 15 60 60
   :header-rows: 1

   * - Mode
     - Name
     - Description
   * - ``1``
     - Enable Alignment
     - **ON:** Computes alignment update.


       **OFF:** Evaluates overlap score (:term:`Eta Alignment Score`) without updating parameters.
   * - ``2``
     - 3D Rigid Search
     - **ON:** 3D registration (X, Y, Z, pitch, roll, yaw). 
     
       **OFF:** 2D registration (X, Y, yaw).
   * - ``4``
     - 12-DOF Affine Alignment
     - **ON:** Performs :term:`Affine Transformation`.

       **OFF:** Performs :term:`Rigid Transformation`.
   * - ``8``
     - Voxel Scaling
     - **ON:** Enable independent voxel scaling along axes.

       **OFF:** Enforces identical scaling across all axes.
   * - ``256``
     - Direct Intensity Matching
     - **ON:** Enables matching raw voxel brightness shades.. 

       **OFF:** Matches anatomical boundary edges.
   * - ``512``
     - Superfine Precision
     - **ON:** Uses :math:`2.5\text{ mm}` grid sampling for high-precision tuning.

       **OFF:** Uses standard sampling steps.
   * - ``1024``
     - Fast Coarse Step
     - **ON:** Uses wide :math:`12.0\text{ mm}` grid sampling for fast-tuning.

       **OFF:** Uses standard sampling steps.
   * - ``2048``
     - Standard Precision
     - **ON:** Uses standard :math:`5.0\text{ mm}` grid sampling steps for local fine-tuning.

       **OFF:** Step size changes dynamically per iteration.
   * - ``4096``
     - Grid Search Translation
     - **ON:** Performs a translational 3D position grid search (:math:`7.5\text{ mm}` steps).

       **OFF:** Skips position search.
   * - ``8192``
     - Newton-Raphson Optimization
     - **ON:** Uses 2nd-order :term:`Hessian Matrix` inversion (:term:`Newton-Raphson Optimization` method).

       **OFF:** Uses sequential 1D parabolic coordinate descent.

.. rubric:: How Modes Work

The ``<mode>`` parameter combines search options into a single integer using bitwise addition. Select your desired flag values from the :ref:`imgreg_4dfp_usage_table` below and sum them together.

.. card:: Mode Calculation Example
   :class-card: sd-border-info sd-bg-light

   :octicon:`number;1em;sd-text-info` **Example: Mode 4099 (Coarse 3D Alignment)**

   * :bdg-primary:`1` Enable Alignment
   * :bdg-secondary:`2` 3D Alignment
   * :bdg-warning:`4096` Coarse Position Search

   .. math::

      1 + 2 + 4096 = 4099


.. rubric:: Quick Mode Builder

To build a mode, select **at most one** option per functional category:

.. grid:: 1 2 2 2
   :gutter: 3

   .. grid-item-card:: 1. Core Setup
      :class-header: sd-bg-light sd-font-weight-bold

      * :bdg-primary:`1` **Enable Alignment** *(Master switch)*
      * :bdg-secondary:`2` **3D Mode** *(OFF = 2D)*

   .. grid-item-card:: 2. Stage Engine (Select 1)
      :class-header: sd-bg-light sd-font-weight-bold

      * :bdg-warning:`4096` **Coarse Search** *(Standalone shift)*
      * :bdg-dark:`8192` **Hessian Solver** *(Newton-Raphson)*

      *Default: Standard optimization*

   .. grid-item-card:: 3. Step Size (Select 1)
      :class-header: sd-bg-light sd-font-weight-bold

      * :bdg-info:`1024` **Fast** *(12.0 mm)*
      * :bdg-info:`2048` **Fine** *(5.0 mm)*
      * :bdg-info:`512` **Superfine** *(2.5 mm)*

      *Default: Dynamic (9.0 → 5.0 mm)*

   .. grid-item-card:: 4. Model & Metric
      :class-header: sd-bg-light sd-font-weight-bold

      * :bdg-light:`4` **12-DOF Affine** *(OFF = Rigid)*
      * :bdg-light:`8` **Voxel Scaling** *(OFF = Uniform)*
      * :bdg-light:`256` **Direct Intensity** *(OFF = Edge)*


.. rubric:: Engine Rules & Step-Size Precedence

Passing a mode string executes a **single command pass**. If conflicting step sizes or engines are set in the same integer, the tool resolves them in the following order:

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Coarse Search Rules (:bdg-warning:`4096`)
      :class-header: sd-bg-warning-subtle sd-font-weight-bold

      :octicon:`alert;1em;sd-text-warning` **Standalone Engine Pass**

      When Coarse Search (:bdg-warning:`4096`) is enabled:

      * **Ignores Step Sizes:** Bypasses :bdg-info:`1024`, :bdg-info:`2048`, and :bdg-info:`512`.
      * **Incompatible with Hessian:** Bypasses :bdg-dark:`8192`.
      * **Ignores Model Mods:** Affine (:bdg-light:`4`) and Scaling (:bdg-light:`8`) are not searched.

      .. note::
         Always run :bdg-warning:`4096` as an initial standalone command before local optimization passes.

   .. grid-item-card:: Step-Size Resolution Order
      :class-header: sd-bg-light sd-font-weight-bold

      :octicon:`arrow-switch;1em;sd-text-primary` **Precedence Matrix**

      When multiple step flags are combined, higher priority overrides lower:

      **Standard Optimization:**

      1. :bdg-info:`2048` **Fine (5.0 mm)** *(Overrides Fast & Superfine)*

      2. :bdg-info:`1024` **Fast (12.0 mm)** *(Overrides Superfine)*

      3. :bdg-info:`512` **Superfine (2.5 mm)**

      4. *Default:* Dynamic scaling (9.0 mm → 5.0 mm)


      **Hessian Mode (8192):**

      1. :bdg-info:`512` **Superfine (2.5 mm)** *(Overrides Fine)*

      2. :bdg-info:`2048` **Fine (5.0 mm)** *(Recommended pair)*

      3. *Ignored:* :bdg-info:`1024` **Fast (12.0 mm)**

      4. *Default:* Fixed 7.5 mm step

.. rubric:: Common Mode Sequences

In typical processing workflows, registration is executed sequentially across multiple mode passes. Each pass uses the output ``.t4`` matrix from the previous run as its starting point, moving from coarse searches to fine local optimization.

.. rubric:: Standard Multi-Pass Pipeline

A standard progressive alignment pass runs the following modes in succession:

1. **Mode 4099** (``1 + 2 + 4096``): Coarse 3D translational search (:math:`7.5\text{ mm}` grid step).
2. **Mode 4099** (``1 + 2 + 4096``): Repeated coarse search to ensure overlap convergence.
3. **Mode 1027** (``1 + 2 + 1024``): Fast local optimization (:math:`12.0\text{ mm}` sampling step).
4. **Mode 2051** (``1 + 2 + 2048``): Standard fine local optimization (:math:`5.0\text{ mm}` sampling step).
5. **Mode 2051** (``1 + 2 + 2048``): Second fine pass to stabilize parameters.
6. **Mode 10243** (``1 + 2 + 2048 + 8192``): Newton-Raphson Hessian matrix polishing.

.. code-block:: bash

   for mode in 4099 4099 1027 2051 2051 10243; do
       imgreg_4dfp target_frame none source_frame none output_trans.t4 $mode
   done

.. rubric:: [ Additional Workflow Sequences Placeholder ]

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 📁 Case 1: Standard Progressive Alignment Loop

         In standard processing pipelines, registration is performed progressively by looping over a sequence of refining modes: ``4099`` $\rightarrow$ ``4099`` $\rightarrow$ ``1027`` $\rightarrow$ ``2051`` $\rightarrow$ ``2051`` $\rightarrow$ ``10243``.

         * **4099** (``1 + 2 + 4096``): Coarse 3D translational search ($7.5\text{ mm}$ grid steps). Run twice to guarantee convergence.
         * **1027** (``1 + 2 + 1024``): Fast 3D local optimization ($12.0\text{ mm}$ sampling steps).
         * **2051** (``1 + 2 + 2048``): Standard fine 3D local optimization ($5.0\text{ mm}$ sampling steps). Run twice to refine parameters.
         * **10243** (``1 + 2 + 2048 + 8192``): Fine 3D Newton-Raphson optimization using Hessian matrix inversion.

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            Target image ``target_frame.4dfp.img`` and source image ``source_frame.4dfp.img``.

         .. tab-set::

            .. tab-item:: Coarse Search (Mode 4099)
              :sync: pass-4099

              **Engine:** ``ffind_`` (Brute-force grid search) | **Step Size:** Fixed 7.5 mm grid | **Bits:** ``1 + 2 + 4096``

              **Purpose:** Recovers large initial translational offsets between the target and source images before local optimization begins.

              .. code-block:: bash

                  # Pass 1 & 2: Run twice to recover large spatial shifts
                  imgreg_4dfp target_frame target_mask source_frame source_mask transform.t4 4099
                  imgreg_4dfp target_frame target_mask source_frame source_mask transform.t4 4099

              **What Happens Under the Hood:**

              * Executes a 3D translation grid search across X, Y, and Z axes.
              * Updates translational parameters in ``transform.t4`` while leaving rotational parameters unchanged.
              * Bypasses local step size flags and Hessian solver logic entirely.

              **Expected Alignment Score:** Initial jump from baseline (e.g., η = 0.10 → η ≈ 0.45 - 0.55).

              .. image:: /_static/tools/imgreg_4dfp/workflow/step1_mode4099.png
                  :alt: Terminal output and spatial overlay after Mode 4099 coarse search
                  :align: center

            .. tab-item:: Fast Local Pass (Mode 1027)
              :sync: pass-1027

              **Engine:** ``fimgreg_`` (Local optimization) | **Step Size:** 12.0 mm (Fast) | **Bits:** ``1 + 2 + 1024``

              **Purpose:** Establishes initial 6-DOF (translation + rotation) local spatial alignment across a broad search radius.

              .. code-block:: bash

                  # Pass 3: Rapid local adjustment
                  imgreg_4dfp target_frame target_mask source_frame source_mask transform.t4 1027

              **What Happens Under the Hood:**

              * Switches execution to the local gradient optimization engine.
              * Begins evaluating 3D rotations alongside translations using a wide 12.0 mm step size.
              * Rapidly brings major anatomical landmarks into approximate orientation.

              **Expected Alignment Score:** Moderate improvement in spatial fit (e.g., η ≈ 0.55 → η ≈ 0.68 - 0.75).

              .. image:: /_static/tools/imgreg_4dfp/workflow/step2_mode1027.png
                  :alt: Terminal output and spatial overlay after Mode 1027 fast local pass
                  :align: center

            .. tab-item:: Fine Local Alignment (Mode 2051)
              :sync: pass-2051

              **Engine:** ``fimgreg_`` (Local optimization) | **Step Size:** 5.0 mm (Fine) | **Bits:** ``1 + 2 + 2048``

              **Purpose:** Performs main sub-voxel registration, narrowing step sizes to refine spatial parameters.

              .. code-block:: bash

                  # Pass 4 & 5: Run twice for standard sub-voxel convergence
                  imgreg_4dfp target_frame target_mask source_frame source_mask transform.t4 2051
                  imgreg_4dfp target_frame target_mask source_frame source_mask transform.t4 2051

              **What Happens Under the Hood:**

              * Overrides Fast step size and restricts parameter adjustments to 5.0 mm increments.
              * Fine-tunes slice-by-slice overlap and corrects residual rotational angles.
              * Prepares matrix parameters for final second-order solver convergence.

              **Expected Alignment Score:** High correlation score achievement (e.g., η ≈ 0.75 → η ≈ 0.85 - 0.90).

              .. image:: /_static/tools/imgreg_4dfp/workflow/step3_mode2051.png
                  :alt: Terminal output and spatial overlay after Mode 2051 fine local pass
                  :align: center

            .. tab-item:: Hessian Polishing (Mode 10243)
              :sync: pass-10243

              **Engine:** ``fimgreg_`` + Newton-Raphson | **Step Size:** 5.0 mm (Fine) | **Bits:** ``1 + 2 + 2048 + 8192``

              **Purpose:** Executes second-order Hessian matrix optimization for final high-precision parameter convergence.

              .. code-block:: bash

                  # Pass 6: Final 2nd-order Newton-Raphson polishing
                  imgreg_4dfp target_frame target_mask source_frame source_mask transform.t4 10243

              **What Happens Under the Hood:**

              * Activates the Newton-Raphson solver (:bdg-dark:`8192`) using the 5.0 mm step size (:bdg-info:`2048`).
              * Computes second-order derivatives to find the exact peak of the cost function surface.
              * Writes out the final fully-converged $4 \times 4$ transformation matrix to ``transform.t4``.

              **Expected Alignment Score:** Final peak score plateau (e.g., η ≈ 0.90 - 0.95).

              .. image:: /_static/tools/imgreg_4dfp/workflow/step4_mode10243.png
                  :alt: Terminal output and final spatial overlay after Mode 10243 Hessian polishing
                  :align: center


      .. tab-item:: ⚠️ Common Errors
        :class-label: tab-error

        .. tab-set::

            .. tab-item:: ❌ Insufficient Arguments (Missing Parameters)
              :class-label: tab-error

              **Cause:** Running ``imgreg_4dfp`` without specifying all 6 required positional arguments: ``<target_img>``, ``<target_mask>``, ``<source_img>``, ``<source_mask>``, ``<t4file>``, and ``<mode>``.

              **Command Attempt:**

              .. code-block:: bash

                  imgreg_4dfp

              **Observed Behavior:**

              The program prints standard usage instructions and terminates without performing any image registration or modifying matrix files.

              .. code-block:: text

                  Usage: imgreg_4dfp <target> <tmask> <source> <smask> <t4file> <mode>

              .. image:: /_static/tools/imgreg_4dfp/errors/insufficient_args.png
                  :alt: Terminal output showing usage syntax due to missing arguments
                  :align: center

              .. admonition:: Resolution
                  :class: warning

                  Ensure all 6 positional arguments are supplied in order. If masks are not needed, pass ``none`` for ``<target_mask>`` and ``<source_mask>``.

            .. tab-item:: ❌ Non-Existent Target or Source Image
              :class-label: tab-error

              **Cause:** Specifying a target or source image root name that does not exist in the working directory or is missing its corresponding ``.4dfp.ifh`` header file.

              **Command Attempt:**

              .. code-block:: bash

                  imgreg_4dfp missing_target none source_frame none transform.t4 2051

              **Observed Behavior:**

              The application fails when attempting to read the missing image header or binary payload, outputting an file open error and aborting execution.

              .. code-block:: text

                  GetIFH: error opening missing_target.4dfp.ifh
                  imgreg_4dfp error: read error on target image

              .. image:: /_static/tools/imgreg_4dfp/errors/missing_image_file.png
                  :alt: Terminal output showing file opening error for missing image
                  :align: center

              .. admonition:: Resolution
                  :class: warning

                  Verify that both the ``.4dfp.img`` binary file and ``.4dfp.ifh`` header file exist in the working path. Do not include the ``.4dfp.img`` extension in the command line argument; supply only the root file name.

            .. tab-item:: ❌ Missing or Malformed .t4 Matrix File
              :class-label: tab-error

              **Cause:** Passing a path to a ``.t4`` file that does not exist, or specifying a corrupted text file that cannot be parsed into a valid $4 \times 4$ transformation matrix.

              **Command Attempt:**

              .. code-block:: bash

                  imgreg_4dfp target_frame none source_frame none missing_matrix.t4 2051

              **Observed Behavior:**

              The tool attempts to load the transformation matrix and throws an I/O error when reading matrix parameters, exiting before registration optimization starts.

              .. code-block:: text

                  rft4: error reading missing_matrix.t4
                  imgreg_4dfp: t4 matrix read error

              .. image:: /_static/tools/imgreg_4dfp/errors/missing_t4_file.png
                  :alt: Terminal output displaying t4 matrix read error
                  :align: center

              .. admonition:: Resolution
                  :class: warning

                  If starting a registration sequence from scratch, initialize a new identity matrix using ``t4_null transform.t4`` prior to calling ``imgreg_4dfp``.

            .. tab-item:: ❌ 2D Slice Dimension Mismatch with 3D Mode Flag
              :class-label: tab-error

              **Cause:** Setting 3D Mode (:bdg-secondary:`2`) when attempting to align single-slice 2D planar images ($NZ < 2$).

              **Command Attempt:**

              .. code-block:: bash

                  imgreg_4dfp target_2d_slice none source_2d_slice none transform.t4 2051

              **Observed Behavior:**

              The program detects $NZ < 2$ in the image volume header, automatically strips Bit ``2`` from the mode bitmask to prevent invalid 3D spatial operations, and outputs a warning before proceeding in 2D mode.

              .. code-block:: text

                  nz < 2: disabling 3D alignment mode
                  image alignment mode  2049 decimal     0801 hex

              .. image:: /_static/tools/imgreg_4dfp/errors/dimension_mismatch.png
                  :alt: Terminal output showing automatic disabling of 3D mode for 2D slice
                  :align: center

              .. admonition:: Resolution
                  :class: warning

                  For single-slice 2D images, explicitly omit Bit ``2`` from the ``<mode>`` integer (e.g., use **Mode 2049** instead of **2051**) to prevent unintended parameter overrides.

            .. tab-item:: ❌ Alignment Disabled (Mode Flag Missing Bit 1)
              :class-label: tab-error

              **Cause:** Passing a mode integer where the Enable Alignment master switch (:bdg-primary:`1`) is not set (e.g., Mode ``0`` or Mode ``2050``).

              **Command Attempt:**

              .. code-block:: bash

                  imgreg_4dfp target_frame none source_frame none transform.t4 0

              **Observed Behavior:**

              The subroutine initializes, computes the initial overlap score (:term:`Eta Alignment Score`), and immediately returns without updating parameter arrays or modifying the output ``.t4`` file.

              .. code-block:: text

                  image alignment mode     0 decimal        0 hex
                  transform update disabled (mode 1 bit off)

              .. image:: /_static/tools/imgreg_4dfp/errors/disabled_mode_zero.png
                  :alt: Terminal output showing transform update disabled due to mode 0
                  :align: center

              .. admonition:: Resolution
                  :class: warning

                  Always ensure Bit ``1`` is added to your mode integer whenever parameter calculation and matrix updating are required.

            .. tab-item:: ⚠️ Alignment Score Plateaus Low (η ≤ 0.35)
              :class-label: tab-error

              **Cause:** The optimization engine converged locally, but spatial overlap failed to achieve a high correlation score (η > 0.70). This occurs when structural or parameter mismatches prevent the local search engine from finding global convergence.

              **Observed Behavior:**

              Subsequent optimization passes (``2051``, ``10243``) exit normally, but the printed correlation score (η) stays trapped between 0.20 and 0.35.

              .. code-block:: text

                  mode 2051:  eta,q 0.2941    0.8120
                  mode 10243: eta,q 0.3012    0.8210  (plateaued)

              .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 🛑 Gross Rotation / Axis Flip
                    :class-card: sd-bg-light sd-border-1

                    Coarse mode (``4099``) only searches translation. If images are rotated > 20° or mirrored, translation alone cannot fix alignment.

                  .. grid-item-card:: 🛑 Unmasked Neck / Skull Noise
                    :class-card: sd-bg-light sd-border-1

                    Passing ``none`` for masks forces evaluation of non-brain tissue, neck muscle, and FOV cutoffs, capping max η.

                  .. grid-item-card:: 🛑 Sub-Optimal Similarity Metric
                    :class-card: sd-bg-light sd-border-1

                    Default mode aligns image edges. Cross-modality or low-contrast images may require Direct Intensity Matching (:bdg-light:`256`).

                  .. grid-item-card:: 🛑 Incorrect Header Center
                    :class-card: sd-bg-light sd-border-1

                    Mismatched origins in the ``.ifh`` header (``center`` field) place the initial 7.5 mm grid search outside the brain volume.

              .. admonition:: Diagnostic & Resolution Protocol
                  :class: warning

                  1. **Visually inspect current alignment:** Resample the source image using your current ``.t4`` file and overlay it on the target:
                    
                    .. code-block:: bash

                        t4img_4dfp transform.t4 source_frame source_aligned -Otarget_frame

                  2. **If rotated or flipped:** Use ``flip_4dfp`` or apply a manual starting reorientation ``.t4`` before running ``imgreg_4dfp``.
                  3. **If unmasked:** Pass explicit brain mask files for ``<target_mask>`` and ``<source_mask>`` instead of ``none``.
                  4. **If same modality with soft edges:** Add Bit :bdg-light:`256` to enable Direct Intensity Matching (e.g., use **Mode 2307** instead of **Mode 2051**).
              