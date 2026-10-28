.. _imgreg_4dfp:

Image Registration
==================
.. rubric:: Tool: ``imgreg_4dfp``

Synopsis
--------

imgreg_4dfp <target_img> <target_mask> <source_img> <source_mask> <t4file> <mode>

Description
-----------

Calculates the 2D or 3D :term:`Affine Transformation` needed to line up a moving scan (**source**) with a reference scan (**target**). 

The calculated alignment parameters are saved as a :math:`4 \times 4` matrix inside the specified :term:`t4file` (initialized via :ref:`t4_null` if missing).

**Example t4file with an identity matrix**

.. code-block:: text

      t4
        1.000000  0.000000  0.000000    0.0000
        0.000000  1.000000  0.000000    0.0000
        0.000000  0.000000  1.000000    0.0000
        0.000000  0.000000  0.000000    1.0000

Note that ``imgreg_4dfp`` only calculates this matrix and updates the :term:`t4file`; it does not resample the image data itself. Actual resampling is handled downstream by tools like :ref:`t4imgs_4dfp` or :ref:`t4img_4dfp`.

Separating matrix estimation from resampling prevents cumulative resolution loss caused by repeatedly filling gaps. Sequential alignments (e.g., motion correction, coregistration, and atlas normalization) can be combined into a single matrix and applied in one final resampling pass.

.. important::
   `imgreg_4dfp` assumes whatever is provided as the <t4file> parameter **should be a t4file**. If the file exists but is not a :term:`t4file`, **imgreg_4dfp will overwrite this file** and turn it into a :term:`t4file`. 

.. rubric:: Understanding Modes & Bitwise Addition

The alignment strategy is controlled by the ``<mode>`` argument, which toggles specific operational settings on or off.

Mode selection is equivalent to setting command-line flags in Linux tools (analogous to combining options like ``-v`` and ``-r``). Rather than passing separate switches, ``imgreg_4dfp`` uses :term:`Bitwise Addition` to create a single numerical "mode". To enable multiple settings simultaneously, simply sum their corresponding numbers together.

.. card:: Mode Calculation Example
   :class-card: sd-border-info sd-bg-light

   :octicon:`number;1em;sd-text-info` **Example: Mode 4099 (Coarse 3D Position Search)**

   * :bdg-primary:`1` Enable Alignment Calculation
   * :bdg-secondary:`2` 3D Alignment (X, Y, Z, pitch, roll, yaw)
   * :bdg-warning:`4096` Coarse Grid Shift Search

   .. math::

      1 + 2 + 4096 = 4099


.. _imgreg_4dfp_usage_table:

Usage
-----

.. list-table::
   :widths: 15 35 70
   :header-rows: 1

   * - Bit
     - Name
     - Description
   * - ``1``
     - Enable Alignment
     - **ON:** Computes spatial updates and modifies the :term:`t4file` matrix.

       **OFF:** Evaluates the :term:`objective function <eta Alignment Score>` η without updating the :term:`t4file`.
   * - ``2``
     - 3D Rigid-Body 6-DOF Alignment
     - **ON:** 3D registration (X, Y, Z translation + :term:`Nod`,  :term:`Roll`,  :term:`Squirm`).

       **OFF:** 2D in-plane registration (X, Y translation + :term:`Squirm`).
   * - ``4``
     - 12-DOF Affine Alignment
     - **ON:** Enables :term:`Affine Transformation` (adds scaling and shearing).

       **OFF:** Enforces :term:`Rigid Transformation` (preserves shape and size).
   * - ``8``
     - Independent Voxel Scaling
     - **ON:** Allows independent scaling factors along X, Y, and Z axes.

       **OFF:** Enforces uniform scaling across all directions.
   * - ``256``
     - Pearson Intensity Correlation
     - **ON:** Uses :term:`Pearson Intensity Correlation` for same-contrast scans.

       **OFF:** Uses :term:`Spatial Gradient Alignment` for cross-contrast scans. [1]_
   * - ``512``
     - Superfine Precision Step
     - **ENABLE:** High-precision 2.5 mm sampling steps for final tuning.
   * - ``1024``
     - Fast Coarse Step
     - **ENABLE:** Wide 12.0 mm sampling steps for rapid initial local search.
   * - ``2048``
     - Standard Fine Step
     - **ENABLE:** Standard 5.0 mm sampling steps for local optimization.
   * - ``4096``
     - Grid Search Translation
     - **ENABLE:** Global 7.5mm translation grid search for initial positioning.
   * - ``8192``
     - Hessian Newton-Raphson
     - **ENABLE:** :term:`Hessian Matrix` inversion (:term:`Newton-Raphson Optimization`).

.. important::
   **Physical Units (mm) vs. Voxels:**
   All spatial translations, grid search steps (e.g., 7.5 mm), and sampling step sizes (e.g., 12.0 mm, 5.0 mm, 2.5 mm) are specified in **physical distance (mm)**, not in voxels.

.. rubric:: Engine Rules & Step-Size Precedence

When multiple flags are set in a single mode integer, ``imgreg_4dfp`` resolves conflicts according to fixed engine rules:

.. grid:: 1 1 2 2
   :gutter: 3

   .. grid-item-card:: Grid Search Rules (:bdg-warning:`4096`)
      :class-header: sd-bg-warning-subtle sd-font-weight-bold

      :octicon:`alert;1em;sd-text-warning` **Standalone Engine Pass**

      **Compatible Modes**
      
      * :bdg-light:`1` to modify the :term:`t4file`.
      * :bdg-light:`2` to choose 2D or 3D registration.
      * :bdg-info:`256` for :term:`Pearson Intensity Correlation` or :term:`Spatial Gradient Alignment`

      **Incompatible Modes**

      * Overrides :bdg-info:`1024`, :bdg-info:`2048`, and :bdg-info:`512`.
      * Ignores :bdg-dark:`8192`.
      * Does not perform Affine (:bdg-light:`4`) or Scaling (:bdg-light:`8`) transformations.

   .. grid-item-card:: Step-Size Resolution Order
      :class-header: sd-bg-light sd-font-weight-bold

      :octicon:`arrow-switch;1em;sd-text-primary` **Precedence Order**

      If multiple step size flags are combined, priority is evaluated in this order:

      **Standard Optimization Mode:**

      1. :bdg-info:`2048` **Fine (5.0 mm)** *(Overrides Fast & Superfine)*
      2. :bdg-info:`1024` **Fast (12.0 mm)** *(Overrides Superfine)*
      3. :bdg-info:`512` **Superfine (2.5 mm)**
      4. *Default:* Dynamic step (11.0 mm → 5.0 mm)

      **Hessian Mode (8192):**

      1. :bdg-info:`512` **Superfine (2.5 mm)** *(Overrides Fine)*
      2. :bdg-info:`2048` **Fine (5.0 mm)** *(Recommended pairing)*
      3. *Ignored:* :bdg-info:`1024` **Fast (12.0 mm)**
      4. *Default:* Fixed 7.5 mm step


.. rubric:: Evaluating Alignment Quality: The eta Score (η)

At the end of each pass, ``imgreg_4dfp`` evaluates its internal :term:`Objective Function` to report an :term:`eta alignment score<eta Alignment Score>` (:math:`\eta`). The resulting score is normalized between :math:`0.0` (no structural overlap) and :math:`1.0` (identical alignment).

* **Inter- vs. Intra-Modal Expectations ("Common Mode"):**
  Enabling Bit :bdg-info:`256` engages **"common mode"**, which uses :term:`Pearson Intensity Correlation` for same-contrast (intra-modal) scans. Common mode matches raw voxel intensities directly, yielding higher baseline :math:`\eta` scores. Leaving Bit :bdg-info:`256` OFF uses Spatial Gradient Alignment along tissue edges for cross-contrast (inter-modal) scans, which yields lower baseline scores because it compares directional edge vectors rather than raw contrast.

* **Interpreting Score Deltas (Δη):**
  Track the change in score (:math:`\Delta\eta`) between consecutive runs:
  
  * :math:`\Delta\eta > 0`: The solver is actively improving alignment. Continue optimizing at the current resolution.
  * :math:`\Delta\eta \approx 0.00`: The current pass has plateaued. 

* **The Decision Rule: Advance vs. Finish:**

  * **Advance:** If :math:`\Delta\eta \approx 0.00` on an intermediate mode (e.g., Coarse or Fast), switch your mode to a finer step size or solver.
  * **Finish:** If :math:`\Delta\eta \approx 0.00` on your final target mode (e.g., ``2051`` or ``10243``), parameter optimization is complete.

* **Visual Verification (The Gold Standard):**
  Never rely on the :math:`\eta` score alone. Always visually inspect the final fit by resampling the source image onto target space (using :ref:`t4img_4dfp`) and utilizing a visualizer tool (like FSLeyes) to overlay anatomical contours.

.. tip::
   **Evaluate Quality Without Modifying Files:**
   To check the current objective function score (:math:`\eta`) without altering your existing :term:`t4file`, turn off Bit ``1`` (for example, run mode ``0`` or ``2``).
   
.. rubric:: Common Multi-Pass Sequences

Image registration relies on multi-pass workflows executed through external loops. 
Because ``imgreg_4dfp`` executes only a single pass per command and updates the transformation matrix in place, each run uses the output :term:`t4file` from the previous pass as its new starting baseline.

Progressing from coarse searches to fine optimizations prevents the algorithm from getting trapped in a :term:`Local Maximum`. 
Initial coarse passes evaluate broad spatial steps to move scans into the correct global neighborhood, before fine-grained local optimizers take over. 

Repeating identical modes in succession allows solvers to re-center sampling grids around the updated matrix baseline and continue optimizing toward true convergence.

*The C code below illustrates a few registration sequences. Actual script implementations may differ in exact syntax.*

.. tab-set::

   .. tab-item:: T1 to Atlas

      .. card::
         :class-header: sd-bg-light sd-font-weight-bold

         :octicon:`file-code;1em;sd-text-primary` Pipeline Script: :bdg-secondary:`cross_bold_pp_2019.csh`

         .. code-block:: csh

            @ j = 1
            set mode = (4099 4099 3075 2051 2051)
            while ( $j <= $#mode )
                imgreg_4dfp <target_frame> <target_mask> <source_frame> <source_mask> <t4file> $mode[$j]
                @ j++
            end

   .. tab-item:: T2w to Atlas

      .. card::
         :class-header: sd-bg-light sd-font-weight-bold

         :octicon:`file-code;1em;sd-text-primary` Pipeline Script: :bdg-secondary:`cross_bold_pp_2019.csh`

         .. code-block:: csh

            @ j = 1
            set mode = (4099 1027 2051 2051 10243)
            while ( $j <= $#mode )
                imgreg_4dfp <target_frame> <target_mask> <source_frame> <source_mask> <t4file> $mode[$j]
                @ j++
            end

   .. tab-item:: T2w to T1

      .. card::
         :class-header: sd-bg-light sd-font-weight-bold

         :octicon:`file-code;1em;sd-text-primary` Pipeline Script: :bdg-secondary:`cross_bold_pp_2019.csh`

         .. code-block:: csh

            @ j = 1
            set msk = (none none none <target_mask> <target_mask> <target_mask>)
            set mode = (4099 4099 1027 2051 2051 10243)
            while ( $j <= $#mode )
                imgreg_4dfp <target_frame> $msk[$j] <source_frame> <source_mask> <t4file> $mode[$j]
                @ j++
            end

.. important::
   **External Loop Requirement:**
   Combining flags into a single mode integer (e.g., ``4608 = 4096 + 512``) will **not** run sequential steps—precedence rules will simply override conflicting flags. Sequential pipelines require an external script that calls ``imgreg_4dfp`` repeatedly.
            
Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

    .. tab-item:: 📁 Case 1: T2w to T1

        In standard processing pipelines, registration is performed progressively by looping over a sequence of refining modes: ``4099`` → ``4099`` → ``1027`` → ``2051`` → ``2051`` → ``10243``.

        * **4099** (``1 + 2 + 4096``): Coarse 3D translational search (7.5 mm grid steps). Run twice to guarantee convergence.
        * **1027** (``1 + 2 + 1024``): Fast 3D local optimization (12.0 mm sampling steps).
        * **2051** (``1 + 2 + 2048``): Standard fine 3D local optimization (5.0 mm sampling steps). Run twice to refine parameters.
        * **10243** (``1 + 2 + 2048 + 8192``): Fine 3D Newton-Raphson optimization using Hessian matrix inversion.

        .. card:: 📥 Input Data Overview
          :class-card: sd-bg-light sd-border-1 mb-3

          .. grid:: 1 2 2 2
              :gutter: 3

              .. grid-item::

                **Target (Reference) Image:**

                * **Root Name:** ``SUBJ_MSC01_func01_mpr``
                * **Mask:** ``SUBJ_MSC01_func01_mpr_brain_mask``

              .. grid-item::

                **Source (Moving) Image:**

                * **Root Name:** ``SUBJ_MSC01_func01_t2w``
                * **Mask:** ``none``
                * **t4file:** ``SUBJ_MSC01_func01_mpr_to_SUBJ_MSC01_func01_t2w_t4``
                * **Initial Score:** η = 0.38 (Unregistered baseline)

          .. figure:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/imgreg_c1_source_data.png
            :alt: Unaligned source image
            :align: center 
            :width: 80%

        .. tab-set::

          .. tab-item:: Coarse Search (Mode 4099)
              :sync: pass-4099

              **Engine:** Brute-force grid search translation | **Step Size:** Fixed 7.5 mm grid | **Bits:** ``1 + 2 + 4096``

              **Purpose:** Recovers large initial translational offsets between the target and source images before local optimization begins.

              .. code-block:: bash

                # Pass 1 & 2: Run twice to recover large spatial shifts
                imgreg_4dfp SUBJ_MSC01_func01_mpr none SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_PRISMA_TRIO_PIB_NL_MNI152_T1_3mm_t4 4099
                imgreg_4dfp SUBJ_MSC01_func01_mpr none SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_PRISMA_TRIO_PIB_NL_MNI152_T1_3mm_t4 4099

              **What Happens Under the Hood:**

              * Executes a 3D translation grid search across X, Y, and Z axes.
              * Updates translational parameters in :term:`t4file` while leaving rotational parameters unchanged.
              * Bypasses step size flags and Hessian solver logic entirely.

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd1/imgreg_c1_cmd1_output.png
                      :alt: 10243 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd1/imgreg_c1_cmd1_t4file.png
                      :alt: 10243 t4file output
                      :align: center

              **Mode 4099 Output (η = 0.38):** Coarse translation grid search aligns center-of-mass positions between source and target volumes.

          .. tab-item:: Fast Local Pass (Mode 1027)
              :sync: pass-1027

              **Engine:** Local optimization | **Step Size:** 12.0 mm (Fast) | **Bits:** ``1 + 2 + 1024``

              **Purpose:** Establishes initial 6-DOF (translation + rotation) local spatial alignment across a broad search radius.

              .. code-block:: bash

                # Pass 3: Rapid local adjustment
                imgreg_4dfp SUBJ_MSC01_func01_mpr none SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_PRISMA_TRIO_PIB_NL_MNI152_T1_3mm_t4 1027

              **What Happens Under the Hood:**

              * Switches execution to the local gradient optimization engine.
              * Begins evaluating 3D rotations alongside translations using a wide 12.0 mm step size.
              * Rapidly brings major anatomical landmarks into approximate orientation.

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd2/imgreg_c1_cmd2_output.png
                      :alt: 10243 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd2/imgreg_c1_cmd2_t4file.png
                      :alt: 10243 t4file output
                      :align: center

              **Mode 1027 Output (η = 0.44):** Initial 6-DOF orientation aligns pitch, roll, and yaw angles across wide sampling steps.

          .. tab-item:: Fine Local Alignment (Mode 2051)
              :sync: pass-2051

              **Engine:** Local optimization | **Step Size:** 5.0 mm (Fine) | **Bits:** ``1 + 2 + 2048``

              **Purpose:** Performs main sub-voxel registration, narrowing step sizes to refine spatial parameters.

              .. code-block:: bash

                # Pass 4 & 5: Run twice for standard sub-voxel convergence
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_PRISMA_TRIO_PIB_NL_MNI152_T1_3mm_t4 2051
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_PRISMA_TRIO_PIB_NL_MNI152_T1_3mm_t4 2051

              **What Happens Under the Hood:**

              * Overrides Fast step size and restricts parameter adjustments to 5.0 mm increments.
              * Fine-tunes slice-by-slice overlap and corrects residual rotational angles.
              * Prepares matrix parameters for final second-order solver convergence.

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd3/imgreg_c1_cmd3_output.png
                      :alt: 10243 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd3/imgreg_c1_cmd3_t4file.png
                      :alt: 10243 t4file output
                      :align: center

              **Mode 2051 Output (η = 0.46):** Fine local optimization achieves high structural agreement along cortical boundaries.

          .. tab-item:: Hessian Polishing (Mode 10243)
              :sync: pass-10243

              **Engine:** ``fimgreg_`` + Newton-Raphson | **Step Size:** 5.0 mm (Fine) | **Bits:** ``1 + 2 + 2048 + 8192``

              **Purpose:** Executes second-order Hessian matrix optimization for final high-precision parameter convergence.

              .. code-block:: bash

                # Pass 6: Final 2nd-order Newton-Raphson polishing
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_PRISMA_TRIO_PIB_NL_MNI152_T1_3mm_t4 10243

              **What Happens Under the Hood:**

              * Activates the Newton-Raphson solver (:bdg-dark:`8192`) using the 5.0 mm step size (:bdg-info:`2048`).
              * Computes second-order derivatives to find the exact peak of the cost function surface.
              * Writes out the final fully-converged :math:`4 \times 4` transformation matrix to :term:`t4file`.

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd4/imgreg_c1_cmd4_output.png
                      :alt: 10243 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spacial_registration_and_transforms/imgreg_4dfp/case1/cmd4/imgreg_c1_cmd4_t4file.png
                      :alt: 10243 t4file output
                      :align: center

              **Mode 10243 Output (η = 0.47):** Final Hessian matrix Newton-Raphson polishing yields full convergence.


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

                imgreg_4dfp missing_target none source_frame none transform_t4 2051

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

          .. tab-item:: ❌ Missing or Malformed t4file
            :class-label: tab-error

            **Cause:** Passing a path to a :term:`t4file` that does not exist, or specifying a corrupted text file that cannot be parsed into a valid :math:`4 \times 4` transformation matrix.

            **Command Attempt:**

            .. code-block:: bash

                imgreg_4dfp target_frame none source_frame none missing_matrix_t4 2051

            **Observed Behavior:**

            The tool attempts to load the transformation matrix and throws an I/O error when reading matrix parameters, exiting before registration optimization starts.

            .. code-block:: text

                rft4: error reading missing_matrix_t4
                imgreg_4dfp: t4 matrix read error

            .. image:: /_static/tools/imgreg_4dfp/errors/missing_t4_file.png
                :alt: Terminal output displaying t4 matrix read error
                :align: center

            .. admonition:: Resolution
                :class: warning

                If starting a registration sequence from scratch, initialize a new identity matrix using ``t4_null transform_t4`` prior to calling ``imgreg_4dfp``.

          .. tab-item:: ❌ 2D Slice Dimension Mismatch with 3D Mode Flag
            :class-label: tab-error

            **Cause:** Setting 3D Mode (:bdg-secondary:`2`) when attempting to align single-slice 2D planar images (:math:`NZ < 2`).

            **Command Attempt:**

            .. code-block:: bash

                imgreg_4dfp target_2d_slice none source_2d_slice none transform_t4 2051

            **Observed Behavior:**

            The program detects :math:`NZ < 2` in the image volume header, automatically strips Bit ``2`` from the mode bitmask to prevent invalid 3D spatial operations, and outputs a warning before proceeding in 2D mode.

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

                imgreg_4dfp target_frame none source_frame none transform_t4 0

            **Observed Behavior:**

            The subroutine initializes, computes the initial overlap score (:term:`eta Alignment Score`), and immediately returns without updating parameter arrays or modifying the output :term:`t4file`.

            .. code-block:: text

                image alignment mode     0 decimal        0 hex
                transform update disabled (mode 1 bit off)

            .. image:: /_static/tools/imgreg_4dfp/errors/disabled_mode_zero.png
                :alt: Terminal output showing transform update disabled due to mode 0
                :align: center

            .. admonition:: Resolution
                :class: warning

                Always ensure Bit ``1`` is added to your mode integer whenever parameter calculation and matrix updating are required.

          .. tab-item:: ⚠️ Alignment Score Plateaus Low
            :class-label: tab-error

            **Cause:** The optimization engine converged locally, but spatial overlap failed to achieve a high correlation score. This occurs when structural or parameter mismatches prevent the local search engine from finding global convergence.

            **Observed Behavior:**

            Subsequent optimization passes (``2051``, ``10243``) exit normally, but the printed correlation score (η) stays trapped with a low score.

            .. code-block:: text

                mode 2051:  eta,q 0.2941    0.8120
                mode 10243: eta,q 0.2941    0.8210  (plateaued)

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

                1. **Visually inspect current alignment:** Resample the source image using your current t4file file and overlay it on the target:
                  
                  .. code-block:: bash

                      t4img_4dfp t4file source_frame source_aligned -Otarget_space

                2. **If rotated or flipped:** Use ``flip_4dfp`` or apply a manual starting reorientation :term:`t4file` before running ``imgreg_4dfp``.
                3. **If unmasked:** Pass explicit brain mask files for ``<target_mask>`` and ``<source_mask>`` instead of ``none``.
                4. **If same modality with soft edges:** Add Bit :bdg-light:`256` to enable Direct Intensity Matching (e.g., use **Mode 2307** instead of **Mode 2051**).
            

.. rubric:: References

.. [1] Rowland, D. J., Garbow, J. R., Laforest, R., & Snyder, A. Z. (2005). `Registration of [18F]FDG microPET and small-animal MRI <https://www.sciencedirect.com/science/article/pii/S0969805105001253>`_. *Nuclear Medicine and Biology*, 32(7), 663–670.