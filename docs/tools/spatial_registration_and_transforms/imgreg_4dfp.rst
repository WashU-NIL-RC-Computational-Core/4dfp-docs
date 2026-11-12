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

Separating matrix estimation from resampling prevents cumulative resolution loss from interpolation. Sequential alignments (e.g., motion correction, coregistration, and atlas normalization) can be combined into a single matrix and applied in one final resampling pass.

.. important::
   `imgreg_4dfp` assumes whatever is provided as the <t4file> parameter **should be a t4file**. If the file exists but is not a :term:`t4file`, **imgreg_4dfp will overwrite this file** and turn it into a :term:`t4file`. 

.. rubric:: Understanding Modes & Bitwise Addition

The alignment strategy is controlled by the ``<mode>`` argument, which toggles specific operational settings on or off.

Mode selection is equivalent to setting command-line flags in Linux tools (analogous to combining options like ``-v`` and ``-r``). Rather than passing separate switches, ``imgreg_4dfp`` uses :term:`Bitwise Addition` to create a single numerical "mode". To enable multiple settings simultaneously, simply sum their corresponding numbers together.

.. card:: Mode Calculation Example
   :class-card: sd-border-info sd-bg-light

   :octicon:`number;1em;sd-text-info` **Example: Mode 4099 (Coarse 3D Position Search)**

   * :bdg-primary:`1` Enable Alignment Calculation
   * :bdg-info:`2` 3D Alignment (X, Y, Z, pitch, roll, yaw)
   * :bdg-dark:`4096` Coarse Grid Shift Search

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
   * - :bdg-primary:`1`
     - Enable Alignment
     - **ENABLED:** Computes spatial updates and modifies the :term:`t4file` matrix.

       **DISABLED:** Evaluates the :term:`objective function <eta Alignment Score>` η without updating the :term:`t4file`.
   * - :bdg-info:`2`
     - 3D Rigid-Body 6-DOF Alignment
     - **ENABLED:** 3D registration (X, Y, Z translation + :term:`Nod`,  :term:`Roll`,  :term:`Squirm`).

       **DISABLED:** 2D in-plane registration (X, Y translation + :term:`Squirm`).
   * - :bdg-info:`4`
     - Affine Shearing & Stretch
     - **ENABLED:** Allows stretching and shearing to align overall image shape and angles.
   * - :bdg-info:`8`
     - Axis-Aligned Stretch & Shrink
     - **ENABLED:** Allows scaling along the main axes to correct voxel size differences **without shearing**.
   * - :bdg-warning:`16`
     - Lock X-Axis Scaling
     - **ENABLED:** Blocks scaling adjustments along the X axis.
   * - :bdg-warning:`32`
     - Lock Y-Axis Scaling
     - **ENABLED:** Blocks scaling adjustments along the Y axis.
   * - :bdg-warning:`64`
     - Lock Z-Axis Scaling
     - **ENABLED:** Blocks scaling adjustments along the Z axis.
   * - :bdg-success:`256`
     - Pearson Intensity Correlation
     - **ENABLED:** Uses :term:`Pearson Intensity Correlation` for same-contrast scans.

       **DISABLED:** Uses :term:`Vector Gradient Alignment` for cross-contrast scans. [1]_
   * - :bdg-danger:`512`
     - Superfine Precision Step
     - **ENABLED:** Dense 2.5 mm voxel sampling grid with a tight (0.5x) parameter search step.
   * - :bdg-danger:`1024`
     - Fast Coarse Step
     - **ENABLED:** Coarse 12.0 mm voxel sampling grid with a wide (1.2x) parameter search step.
   * - :bdg-danger:`2048`
     - Standard Fine Step
     - **ENABLED:** Locks voxel sampling to a fixed 5.0 mm grid without altering the parameter search step.
   * - :bdg-dark:`4096`
     - Grid Search Translation
     - **ENABLED:** Global 7.5mm translation grid search for initial positioning.
   * - :bdg-secondary:`8192`
     - Hessian Newton-Raphson Optimization
     - **ENABLED:** :term:`Hessian Matrix` inversion (:term:`Newton-Raphson Optimization`).

.. important::
   **Physical Units (mm) vs. Voxels:**
   All spatial translations, grid search steps (e.g., 7.5 mm), and sampling step sizes (e.g., 12.0 mm, 5.0 mm, 2.5 mm) are specified in **physical distance (mm)**, not in voxels.

.. rubric:: Advanced Strategy & Optimization Choices

.. dropdown:: Optimization Rules & Step-Size Precedence
  :animate: fade-in
  :icon: arrow-switch

   Mode integers in ``imgreg_4dfp`` combine bitwise flags to control registration behavior across three main operational modes: **Grid Search Translation**, **Standard Mode**, and **Hessian Newton-Raphson Optimization**.

  .. grid:: 1 1 1 1
    :gutter: 3

    .. grid-item-card:: Grid Search Mode (:bdg-dark:`4096`)
      :class-header: sd-bg-warning-subtle sd-font-weight-bold

      :octicon:`alert;1em;sd-text-warning` **Standalone Search Pass**

      **Compatible Modes**
      
      * :bdg-primary:`1` to modify the :term:`t4file`.
      * :bdg-info:`2` to choose 2D or 3D registration.
      * :bdg-success:`256` for :term:`Pearson Intensity Correlation` or :term:`Vector Gradient Alignment`.

      **Incompatible Modes**

      * Overrides :bdg-danger:`512`, :bdg-danger:`1024`, and :bdg-danger:`2048`.
      * Ignores :bdg-secondary:`8192`.
      * Does not perform Affine (:bdg-info:`4`) or Scaling (:bdg-info:`8`) transformations.

    .. grid-item-card:: Standard Optimization (Non-Hessian)
      :class-header: sd-bg-light sd-font-weight-bold

      :octicon:`arrow-switch;1em;sd-text-primary` **Iterative Step Search**

      **Parameter Search Step Size**

      * :bdg-danger:`1024` **Fast:** Fixed wide (**1.2x** multiplier).
      * :bdg-danger:`512` **Superfine:** Fixed narrow (**0.5x** multiplier).
      * *Default:* Dynamic (**0.8x → 0.4x**, expanding up to **1.1x** if steps overshoot).
      * *Note:* Bit :bdg-danger:`2048` does not affect search step size.

      **Spatial Voxel Sampling Grid**

      * :bdg-danger:`2048` **Fine:** Fixed **5.0 mm** grid (*overrides Fast & default*).
      * :bdg-danger:`1024` **Fast:** Coarse **12.0 mm** grid.
      * :bdg-danger:`512` **Superfine:** Dense **2.5 mm** grid.
      * *Default:* Dynamic **9.0 mm → 5.0 mm** grid (coarsening up to **12.0 mm** if steps overshoot).

    .. grid-item-card:: Hessian Newton-Raphson Optimization (:bdg-secondary:`8192`)
      :class-header: sd-bg-light sd-font-weight-bold

      :octicon:`graph;1em;sd-text-primary` **Joint Parameter Optimization**

      **Parameter Search Step Size**

      * :bdg-danger:`512` **Superfine:** Tightened to **0.5x** multiplier.
      * *Default:* Fixed **1.0x** multiplier.
      * *Note:* Bit :bdg-danger:`2048` does not affect search step size.

      **Spatial Voxel Sampling Grid**

      * :bdg-danger:`512` **Superfine:** Dense **2.5 mm** grid (*overrides Fine & default*).
      * :bdg-danger:`2048` **Fine:** Tight **5.0 mm** grid.
      * *Default:* Medium **7.5 mm** grid.

      *Ignored:* :bdg-danger:`1024` **Fast (12.0 mm)**.

  .. note::

    When multiple bits are enabled in a single mode integer, ``imgreg_4dfp`` configures two independent variables:

    * **Voxel Grid Size:** The voxel grid sampling resolution in millimeters (e.g., 12.0 mm coarse vs. 5.0 mm fine grid).
    * **Parameter Step Scale:** The parameter step size multiplier (e.g., 1.2x wide search vs. 0.5x narrow search).

    **Important:** Review the bitwise precedence order to confirm the exact **Voxel Grid Size** and **Parameter Step Scale** resulting from combined mode bits.

.. dropdown:: Transformation Models: Affine Shearing & Stretch :bdg-info:`4` vs. Axis-Aligned Stretch & Shrink :bdg-info:`8`
   :animate: fade-in
   :icon: iterations

   When non-rigid spatial adjustments are needed beyond basic 6-DOF (or 3-DOF in 2D) rigid-body registration, ``imgreg_4dfp`` provides two distinct transformation models:

   .. grid:: 1 1 2 2
      :gutter: 3

      .. grid-item-card:: :bdg-info:`4`: Affine Shearing & Stretch
         :class-header: sd-bg-info-subtle sd-font-weight-bold

         * **Degrees of Freedom:** 12 in 3D (6 in 2D).
         * **Behavior:** Allows images to stretch along any axis **and shear angles** (non-orthogonal warping).
         * **Primary Use Case:** Uncorrected spatial skew/gantry distortions.

      .. grid-item-card:: :bdg-info:`8`: Axis-Aligned Stretch & Shrink
         :class-header: sd-bg-success-subtle sd-font-weight-bold

         * **Degrees of Freedom:** Up to 9 in 3D (up to 5 in 2D).
         * **Behavior:** Stretches or shrinks dimensions independently along X, Y, and Z **without skewing image angles**.
         * **Primary Use Case:** Correcting uneven voxel sizes (like thick slice gaps) or minor scanner size rounding differences.

   .. note::
      **Dependencies & Precedence:**

      **Axis Lock Dependency (Bits 16, 32, 64):** Axis locking flags **only modify Bit 8 scaling**. They have no effect during standard rigid-body alignment and are ignored by Bit :bdg-info:`4`.
      
      **Precedence:** If Bit :bdg-info:`4` and Bit :bdg-info:`8` are set together, Bit :bdg-info:`4` supersedes Bit :bdg-info:`8`.

.. dropdown:: Role of Spatial Masks (<target_mask> and <source_mask>)
   :animate: fade-in
   :icon: file-binary

   Masks are spatial volume files (or the keyword ``none``) that define which voxels are evaluated by the registration objective function. While masks function conceptually as binary region selectors, input files do not necessarily need to be binary images. ``imgreg_4dfp`` treats any positive intensity value as an active mask voxel (effectively treating non-zero values as 1).

   Inside ``imgreg_4dfp``, alignment is computed **strictly on the intersection** of both volumes. A voxel is evaluated only if it falls inside valid tissue boundaries on both images simultaneously.

   .. card:: Mask Usage Guidelines
      :class-header: sd-bg-light sd-font-weight-bold

      :octicon:`check-circle;1em;sd-text-success` **Typical Scenarios for Applying Masks**

      * Shape & Stretch/Shrink Transformations (:bdg-info:`4` & :bdg-info:`8`).
      * High-Precision Hessian Fine-Tuning (:bdg-secondary:`8192`).
      * Pathology & Artifact Exclusion.

      :octicon:`x-circle;1em;sd-text-danger` **Typical Scenarios for Omitting Masks (Passing ``none``)**

      * Large Initial Position Offsets.
      * Global Coarse Searches (:bdg-dark:`4096`).

      .. note::
         **Target vs. Source Masking Priority:** Masking the **target** volume usually provides the greatest benefit. Because the target image sets the stationary sampling grid, a target mask can restrict the objective function evaluation to valid brain tissue.

   .. tip::
      Pass the keyword ``none`` for either argument if you do not have a mask file or want to evaluate the entire image matrix. Passing ``none`` is similar to using a mask with every coordinate "on".

.. rubric:: Evaluating Alignment Quality: The eta Score (η)

At the end of each pass, ``imgreg_4dfp`` evaluates its internal :term:`Objective Function` to report an :term:`eta alignment score<eta Alignment Score>` (η).

**Inter- vs. Intra-Modal Expectations ("Common Mode"):**

  * **Bit 256 ON (Common Mode):** Uses :term:`Pearson Intensity Correlation` for same-contrast (intra-modal) scans to match raw voxel intensities. Enabling Bit :bdg-success:`256` also calculates ``q``, the relative scan brightness multiplier (:math:`\bar{I}_{\text{target}} / \bar{I}_{\text{source}}`).
  * **Bit 256 OFF (Default):** Uses :term:`Vector Gradient Alignment` along tissue edges for cross-contrast (inter-modal) scans. It compares directional edge vectors rather than raw contrast, and ``q`` remains ``0.0000``.

**Output Formats across Pass Types:**

  * **Standard Optimization Passes (Modes** :bdg-danger:`512`, :bdg-danger:`1024`, :bdg-danger:`2048`, :bdg-secondary:`8192` **or Default):** Results are printed as summary lines formatted as ``eta,q [eta] [q]`` (e.g., ``eta,q 0.32523 0.00000``). The normalized score (:math:`\eta \in [0.0, 1.0]`) is reported first, followed by the intensity scale ratio (``q``).
  * **Grid Search Translation (Bit** :bdg-dark:`4096` **):** Evaluates a coarse translation grid. Candidates are output as 5-column table rows, where the volume-weighted score (:math:`\eta_{\text{search}} = \eta \times N_{\text{voxels}}`) appears in the **4th column** and ``q`` appears in the **5th column** (e.g., ``7.5000   37.5000   45.0000  1096.0754   0.0000``).

.. warning::
   **Do not compare η scores between Bit 256 ON vs. OFF, or when using Bit 4096.**
   Toggling Bit 256 switches the underlying optimization metric, while Bit 4096 scales scores by volume overlap.
   
**Interpreting Score Deltas (Δη):**
  Track the change in score (:math:`\Delta\eta`) between consecutive runs:
  
  * :math:`\Delta\eta > 0`: The optimization function is actively improving alignment. Continue optimizing at the current resolution.
  * :math:`\Delta\eta \approx 0.00`: The current pass has plateaued. 

**The Decision Rule: Advance vs. Finish:**

  * **Advance:** If :math:`\Delta\eta \approx 0.00` on an intermediate mode (e.g., Coarse or Fast), switch your mode to a finer step size or optimization function.
  * **Finish:** If :math:`\Delta\eta \approx 0.00` on your final target mode (e.g., ``2051`` or ``10243``), parameter optimization is complete.

**Fine-Tuning Polish: Engaging Bit 8192 (Hessian Optimization):**
  When standard step searches plateau, you can activate Bit :bdg-secondary:`8192` for maximum precision.

* **Why Use It:** Standard passes adjust one parameter at a time. Bit :bdg-secondary:`8192` computes the full :term:`Hessian Matrix` to optimize all parameters simultaneously, accounting for parameter interference by solving transformations jointly (e.g., balancing pitch rotation and z-translation together).
  
  * **Controlling Search Granularity:** By default, Bit :bdg-secondary:`8192` evaluates derivative gradients on a 7.5 mm grid. Adding bit :bdg-info:`2048` (Fine) tightens spatial sampling to 5.0 mm. Bit :bdg-info:`512` (Superfine) pushes it to 2.5 mm, enabling sub-voxel precision on fine anatomical boundaries.
  
  * **When to Choose It:** Bit :bdg-secondary:`8192` is typically used as a final pass once coarse/intermediate alignment is already close to the solution. Running it on unaligned images will cause matrix divergence or solvers to fail.

* **Visual Verification (The Gold Standard):**
  Never rely on the η score alone. Always visually inspect the final fit by resampling the source image onto target space (using :ref:`t4img_4dfp`) and utilizing a visualizer tool (like FSLeyes) to overlay anatomical contours.

.. tip::
   **Evaluate Quality Without Modifying Files:**
   To check the current objective function score (η) without altering your existing :term:`t4file`, disable Bit :bdg-primary:`1`.
   
.. rubric:: Common Multi-Pass Algorithms

Image registration relies on multi-pass workflows executed through external loops. 
Because ``imgreg_4dfp`` executes only a single pass per command and updates the transformation matrix in place, each run uses the output :term:`t4file` from the previous pass as its new starting baseline.

Progressing from coarse searches to fine optimizations prevents the algorithm from getting trapped in a :term:`Local Maximum`. 
Initial coarse passes evaluate broad spatial steps to move scans into the correct global neighborhood, before fine-grained local optimizers take over. 

Repeating identical modes in succession allows solvers to re-center sampling grids around the updated matrix baseline and continue optimizing toward true convergence.

*The C Shell code below illustrates a few registration sequences. Actual script implementations may differ in exact syntax.*

.. tab-set::

   .. tab-item:: T2w to T1w

      .. card::
         :class-header: sd-bg-light sd-font-weight-bold

         :octicon:`file-code;1em;sd-text-primary` Pipeline Script: :bdg-secondary:`cross_bold_pp_2019.csh`

         .. code-block:: csh

            @ j = 1
            set masks = (none none none <target_mask> <target_mask> <target_mask>)
            set modes = (4099 4099 3075 2051 2051 10243)
            while ( $j <= $#modes )
                imgreg_4dfp <target_frame> $masks[$j] <source_frame> <source_mask> <t4file> $modes[$j]
                @ j++
            end

   .. tab-item:: BOLD to T2w

      .. card::
         :class-header: sd-bg-light sd-font-weight-bold

         :octicon:`file-code;1em;sd-text-primary` Pipeline Script: :bdg-secondary:`cross_bold_pp_2019.csh`

         .. code-block:: csh

            @ j = 1
            set masks = (none none <target_mask> <target_mask> <target_mask>)
            set modes = (4099 1027 2051 2051 10243)
            while ( $j <= $#modes )
                imgreg_4dfp <target_frame> <target_mask> <source_frame> masks[$j] <t4file> $modes[$j]
                @ j++
            end

   .. tab-item:: BOLD to T1w

      .. card::
         :class-header: sd-bg-light sd-font-weight-bold

         :octicon:`file-code;1em;sd-text-primary` Pipeline Script: :bdg-secondary:`cross_bold_pp_2019.csh`

         .. code-block:: csh

            @ j = 1
            set masks = (none none <target_mask> <target_mask> <target_mask>)
            set modes = (4099 4099 3075 2051 2051)
            while ( $j <= $#modes )
                imgreg_4dfp <target_frame> <target_mask> <source_frame> masks[$j] <t4file> $modes[$j]
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

      In standard processing pipelines, registration between T2w and T1w is performed progressively by looping over a list of refining modes, e.g. ``4099`` → ``4099`` → ``1027`` → ``2051`` → ``2051`` → ``10243``.

      * **4099** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-dark:`4096`): Grid Search Translation (7.5 mm grid steps). Run twice to guarantee initial overlap.
      * **1027** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`1024`): Fast Coarse Step (12.0 mm sampling steps).
      * **2051** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048`): Standard Fine Step (5.0 mm sampling steps). Run twice to refine parameters.
      * **10243** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048` + :bdg-secondary:`8192`): Hessian Newton-Raphson + Standard Fine Step.

      .. card:: 📥 Input Data Overview
        :class-card: sd-bg-light sd-border-1 mb-3

        .. div:: card-help-top-right

          :card-help:`Image Generation Steps: | 1. Initialize (t4_null) & solve transform matrix (imgreg_4dfp) | 2. Resample image & mask to target space (t4img_4dfp) | 3. Skull-strip resampled volume (maskimg_4dfp) | 4. Render target & masked source overlay (fsleyes)`

        .. grid:: 1 2 2 2
            :gutter: 3

            .. grid-item-card:: 🎯 Target (Reference) Image: T1w
                :class-header: sd-bg-light sd-font-weight-bold

                * **Root Name:** ``SUBJ_MSC01_func01_mpr``
                * **Mask:** ``SUBJ_MSC01_func01_mpr_brain_mask``

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/imgreg_c1_t1_source_data.png
                  :alt: T1 Target Image
                  :align: center
                  :width: 100%

            .. grid-item-card:: 📦 Source (Moving) Image: T2w
                :class-header: sd-bg-light sd-font-weight-bold

                * **Root Name:** ``SUBJ_MSC01_func01_t2w``
                * **Mask:** ``SUBJ_MSC01_func01_t2w_brain_mask``
                * **t4file:** ``SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4``

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/imgreg_c1_t2_source_data.png
                  :alt: T2w Source Image
                  :align: center
                  :width: 100%

        .. grid:: 1 1 1 1
            :gutter: 3

            .. grid-item-card:: 🔀 Initial Overlay (Unregistered Baseline)
                :class-header: sd-bg-light sd-font-weight-bold

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/imgreg_c1_combined_source_data.png
                  :alt: Unaligned combined source image overlay
                  :align: center
                  :width: 85%

        .. tab-set::

          .. tab-item:: Coarse Search (Mode 4099)
              :sync: pass-4099

              **Optimization Function:** Grid Search Translation | **Step Size:** Fixed 7.5 mm grid | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-dark:`4096`

              .. code-block:: bash

                # Pass 1 & 2
                imgreg_4dfp SUBJ_MSC01_func01_mpr none SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4 4099
                imgreg_4dfp SUBJ_MSC01_func01_mpr none SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4 4099

              **What Happens Under the Hood:**

              * Executes a broad 3D (:bdg-info:`2`) translation grid search across X, Y, and Z axes.
              * Omits spatial masks (passing ``none``) to prevent mask clipping during initial wide translations.
              * Updates translational parameters in :term:`t4file` while leaving rotational parameters unchanged.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              **Output:**
              
              :math:`\eta \approx 2008.55`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. div:: card-help-top-right

                    :card-help:`Image Generation Steps: | 1. Initialize (t4_null) & solve transform matrix (imgreg_4dfp) | 2. Resample image & mask to target space (t4img_4dfp) | 3. Skull-strip resampled volume (maskimg_4dfp) | 4. Render target & masked source overlay (fsleyes)`

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd1/imgreg_c1_cmd1_output.png
                      :alt: 4099 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd1/imgreg_c1_cmd1_t4file.png
                      :alt: 4099 t4file output
                      :align: center

          .. tab-item:: Fast Local Pass (Mode 1027)
              :sync: pass-1027

              **Optimization Function:** Fast Coarse Step | **Step Size:** 12.0 mm (Fast) | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`1024`

              .. code-block:: bash

                # Pass 3
                imgreg_4dfp SUBJ_MSC01_func01_mpr none SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4 1027

              **What Happens Under the Hood:**

              * Switches execution from global grid searching to local gradient-driven optimization.
              * Employs a wide 12.0 mm sampling step size for rapid, large-scale rotational convergence.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd2/imgreg_c1_cmd2_output.png
                      :alt: 1027 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd2/imgreg_c1_cmd2_t4file.png
                      :alt: 1027 t4file output
                      :align: center

              :math:`\eta \approx 0.37`

          .. tab-item:: Fine Local Alignment (Mode 2051)
              :sync: pass-2051

              **Optimization Function:** Standard Fine Step | **Step Size:** 5.0 mm (Fine) | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048`

              .. code-block:: bash

                # Pass 4 & 5
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4 2051
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4 2051

              **What Happens Under the Hood:**

              * Narrows sampling step size from 12.0 mm to 5.0 mm for fine-grained local gradient evaluation.
              * Introduces the target brain mask (``SUBJ_MSC01_func01_mpr_brain_mask``) to restrict voxel evaluation to brain tissue.
              * Executes two sequential passes to achieve full parameter stability across all 6 rigid-body DOF.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd3/imgreg_c1_cmd3_output.png
                      :alt: 2051 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd3/imgreg_c1_cmd3_t4file.png
                      :alt: 2051 t4file output
                      :align: center

              :math:`\eta \approx 0.43`

          .. tab-item:: Hessian Polishing (Mode 10243)
              :sync: pass-10243

              **Optimization Function:** Standard Fine Step + Hessian Newton-Raphson | **Step Size:** 5.0 mm (Fine) | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048` + :bdg-secondary:`8192`

              .. code-block:: bash

                # Pass 6
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_t2w_to_SUBJ_MSC01_func01_mpr_t4 10243

              **What Happens Under the Hood:**

              * Activates the Newton-Raphson optimization function (:bdg-secondary:`8192`) using a fixed 5.0 mm step size (:bdg-info:`2048`).
              * Computes the :term:`Hessian Matrix` of partial second derivatives to map the curvature of the objective function landscape.
              * Restricts objective evaluation strictly to valid brain tissue using the target brain mask (``SUBJ_MSC01_func01_mpr_brain_mask``).
              * Writes the final, fully converged :math:`4 \times 4` rigid transformation matrix to the output :term:`t4file`.

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd4/imgreg_c1_cmd4_output.png
                      :alt: 10243 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd4/imgreg_c1_cmd4_t4file.png
                      :alt: 10243 t4file output
                      :align: center

              :math:`\eta \approx 0.43`

      .. dropdown:: 🎞️ Click to view progressive registration animation (All Passes)
        :animate: fade-in
        :class-container: mt-3 mb-3

        **Animation Sequence:** :bdg-secondary:`Baseline` → :bdg-dark:`4099` (after second run) → :bdg-danger:`1027` → :bdg-danger:`2051` (after second run) → :bdg-secondary:`10243`

        .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/imgreg_c1_output.gif
            :alt: Case 1 progressive registration animation across all modes
            :align: center
            :width: 85%

    .. tab-item:: 📁 Case 2: BOLD to T2w

      In standard processing pipelines, registration between BOLD and T2w is performed progressively by looping over a list of refining modes, e.g. ``4099`` → ``1027`` → ``2051`` → ``2051`` → ``10243``.

      * **4099** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-dark:`4096`): Grid Search Translation (7.5 mm grid steps).
      * **1027** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`1024`): Fast Coarse Step (12.0 mm sampling steps).
      * **2051** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048`): Standard Fine Step (5.0 mm sampling steps). Run twice to refine parameters.
      * **10243** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048` + :bdg-secondary:`8192`): Hessian Newton-Raphson + Standard Fine Step.

      .. card:: 📥 Input Data Overview
        :class-card: sd-bg-light sd-border-1 mb-3

        .. div:: card-help-top-right

          :card-help:`Image Generation Steps: | 1. Initialize (t4_null) & solve transform matrix (imgreg_4dfp) | 2. Resample image & mask to target space (t4img_4dfp) | 3. Skull-strip resampled volume (maskimg_4dfp) | 4. Render target & masked source overlay (fsleyes)`

        .. grid:: 1 2 2 2
            :gutter: 3

            .. grid-item-card:: 🎯 Target (Reference) Image: T2w
                :class-header: sd-bg-light sd-font-weight-bold

                * **Root Name:** ``SUBJ_MSC01_func01_t2w``
                * **Mask:** ``SUBJ_MSC01_func01_t2w_brain_mask``

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/imgreg_c2_t2_source_data.png
                  :alt: T2 Target Image
                  :align: center
                  :width: 100%

            .. grid-item-card:: 📦 Source (Moving) Image: BOLD EPI
                :class-header: sd-bg-light sd-font-weight-bold

                * **Root Name:** ``SUBJ_MSC01_func01_anat_Grp1_uwrp``
                * **Mask:** ``SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask``
                * **t4file:** ``SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_t2w_t4``

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/imgreg_c2_anat_source_data.png
                  :alt: BOLD Source Image
                  :align: center
                  :width: 100%

        .. grid:: 1 1 1 1
            :gutter: 3

            .. grid-item-card:: 🔀 Initial Overlay (Unregistered Baseline)
                :class-header: sd-bg-light sd-font-weight-bold

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/imgreg_c2_combined_source_data.png
                  :alt: Unaligned combined source image overlay
                  :align: center
                  :width: 85%

        .. tab-set::

          .. tab-item:: Coarse Search (Mode 4099)
              :sync: pass-4099

              **Optimization Function:** Grid Search Translation | **Step Size:** Fixed 7.5 mm grid | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-dark:`4096`

              .. code-block:: bash

                # Pass 1
                imgreg_4dfp SUBJ_MSC01_func01_t2w SUBJ_MSC01_func01_t2w_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp none SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_t2w_t4 4099

              **What Happens Under the Hood:**

              * Executes a broad 3D (:bdg-info:`2`) translation grid search across X, Y, and Z axes.
              * Omits spatial masks (passing ``none``) to prevent mask clipping during initial wide translations.
              * Updates translational parameters in :term:`t4file` while leaving rotational parameters unchanged.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              **Output:**
              
              :math:`\eta \approx 656.12`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. div:: card-help-top-right

                    :card-help:`Image Generation Steps: | 1. Initialize (t4_null) & solve transform matrix (imgreg_4dfp) | 2. Resample image & mask to target space (t4img_4dfp) | 3. Skull-strip resampled volume (maskimg_4dfp) | 4. Render target & masked source overlay (fsleyes)`

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd1/imgreg_c2_cmd1_output.png
                      :alt: 4099 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd1/imgreg_c2_cmd1_t4file.png
                      :alt: 4099 t4file output
                      :align: center

          .. tab-item:: Fast Local Pass (Mode 1027)
              :sync: pass-1027

              **Optimization Function:** Fast Coarse Step | **Step Size:** 12.0 mm (Fast) | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`1024`

              .. code-block:: bash

                # Pass 2
                imgreg_4dfp SUBJ_MSC01_func01_t2w SUBJ_MSC01_func01_t2w_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp none SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_t2w_t4 1027

              **What Happens Under the Hood:**

              * Switches execution from global grid searching to local gradient-driven optimization.
              * Employs a wide 12.0 mm sampling step size for rapid, large-scale rotational convergence.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              **Output:**

              :math:`\eta \approx 0.38`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd2/imgreg_c2_cmd2_output.png
                      :alt: 1027 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd2/imgreg_c2_cmd2_t4file.png
                      :alt: 1027 t4file output
                      :align: center

          .. tab-item:: Fine Local Alignment (Mode 2051)
              :sync: pass-2051

              **Optimization Function:** Standard Fine Step | **Step Size:** 5.0 mm (Fine) | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048`

              .. code-block:: bash

                # Pass 3 & 4
                imgreg_4dfp SUBJ_MSC01_func01_t2w SUBJ_MSC01_func01_t2w_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_t2w_t4 2051
                imgreg_4dfp SUBJ_MSC01_func01_t2w SUBJ_MSC01_func01_t2w_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_t2w_t4 2051

              **What Happens Under the Hood:**

              * Narrows sampling step size from 12.0 mm to 5.0 mm for fine-grained local gradient evaluation.
              * Introduces the target brain mask (``SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask``) to restrict voxel evaluation to brain tissue.
              * Executes two sequential passes to achieve full parameter stability across all 6 rigid-body DOF.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              **Output:**

              :math:`\eta \approx 0.38`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd3/imgreg_c2_cmd3_output.png
                      :alt: 2051 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd3/imgreg_c2_cmd3_t4file.png
                      :alt: 2051 t4file output
                      :align: center

          .. tab-item:: Hessian Polishing (Mode 10243)
              :sync: pass-10243

              **Optimization Function:** Standard Fine Step + Hessian Newton-Raphson | **Step Size:** 5.0 mm (Fine) | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048` + :bdg-secondary:`8192`

              .. code-block:: bash

                # Pass 5
                imgreg_4dfp SUBJ_MSC01_func01_t2w SUBJ_MSC01_func01_t2w_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_t2w_t4 10243

              **What Happens Under the Hood:**

              * Activates the Newton-Raphson optimization function (:bdg-secondary:`8192`) using a fixed 5.0 mm step size (:bdg-info:`2048`).
              * Computes the :term:`Hessian Matrix` of partial second derivatives to map the curvature of the objective function landscape.
              * Restricts objective evaluation strictly to valid brain tissue using the target brain mask (``SUBJ_MSC01_func01_t2w_brain_mask``).
              * Writes the final, fully converged :math:`4 \times 4` rigid transformation matrix to the output :term:`t4file`.

              **Output:**

              :math:`\eta \approx 0.38`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd4/imgreg_c2_cmd4_output.png
                      :alt: 10243 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/cmd4/imgreg_c2_cmd4_t4file.png
                      :alt: 10243 t4file output
                      :align: center

      .. dropdown:: 🎞️ Click to view progressive registration animation (All Passes)
        :animate: fade-in
        :class-container: mt-3 mb-3

          **Animation Sequence:** :bdg-secondary:`Baseline` → :bdg-dark:`4099` → :bdg-danger:`1027` → :bdg-danger:`2051` (after second run) → :bdg-secondary:`10243`

          .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case2/imgreg_c2_output.gif
              :alt: Case 2 progressive registration animation across all modes
              :align: center
              :width: 85%

    .. tab-item:: 📁 Case 3: BOLD to T1w

        In standard processing pipelines, registration between BOLD and T1w is performed progressively by looping over a list of refining modes, e.g. ``4099`` → ``4099`` → ``3075`` → ``2051`` → ``2051``.

        * **4099** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-dark:`4096`): Grid Search Translation (7.5 mm grid steps). Run twice to guarantee initial overlap.
        * **3075** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`1024` + :bdg-danger:`2048`): Fast Search / Fine Grid (1.2x parameter step radius, 5.0 mm voxel grid).
        * **2051** (:bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048`): Standard Fine Step (5.0 mm sampling steps). Run twice to reach final convergence.

        .. card:: 📥 Input Data Overview
          :class-card: sd-bg-light sd-border-1 mb-3

          .. div:: card-help-top-right

            :card-help:`Image Generation Steps: | 1. Initialize (t4_null) & solve transform matrix (imgreg_4dfp) | 2. Resample image & mask to target space (t4img_4dfp) | 3. Skull-strip resampled volume (maskimg_4dfp) | 4. Render target & masked source overlay (fsleyes)`


          .. grid:: 1 2 2 2
              :gutter: 3

              .. grid-item-card:: 🎯 Target (Reference) Image: T1w
                 :class-header: sd-bg-light sd-font-weight-bold

                 * **Root Name:** ``SUBJ_MSC01_func01_mpr``
                 * **Mask:** ``SUBJ_MSC01_func01_mpr_brain_mask``

                 .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case3/imgreg_c3_t1_source_data.png
                    :alt: T1 Target Image
                    :align: center
                    :width: 100%

              .. grid-item-card:: 📦 Source (Moving) Image: BOLD EPI
                 :class-header: sd-bg-light sd-font-weight-bold

                 * **Root Name:** ``SUBJ_MSC01_func01_anat_Grp1_uwrp``
                 * **Mask:** ``SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask``
                 * **t4file:** ``SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_mpr_t4``

                 .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case3/imgreg_c3_anat_source_data.png
                    :alt: BOLD Source Image
                    :align: center
                    :width: 100%

          .. grid:: 1 1 1 1
              :gutter: 3

              .. grid-item-card:: 🔀 Initial Overlay (Unregistered Baseline)
                :class-header: sd-bg-light sd-font-weight-bold

                .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case3/imgreg_c3_combined_source_data.png
                    :alt: Unaligned combined source image overlay
                    :align: center
                    :width: 85%

        .. tab-set::

          .. tab-item:: Coarse Search (Mode 4099)
              :sync: pass-4099

              **Optimization Function:** Grid Search Translation | **Step Size:** Fixed 7.5 mm grid | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-dark:`4096`

              .. code-block:: bash

                # Pass 1 & 2
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp none SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_mpr_t4 4099
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp none SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_mpr_t4 4099

              **What Happens Under the Hood:**

              * Executes a broad 3D (:bdg-info:`2`) translation grid search across X, Y, and Z axes.
              * Omits spatial masks (passing ``none``) to prevent mask clipping during initial wide translations.
              * Updates translational parameters in :term:`t4file` while leaving rotational parameters unchanged.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED)

              **Output:**
              
              :math:`\eta \approx 527.85`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. div:: card-help-top-right

                    :card-help:`Image Generation Steps: | 1. Initialize (t4_null) & solve transform matrix (imgreg_4dfp) | 2. Resample image & mask to target space (t4img_4dfp) | 3. Skull-strip resampled volume (maskimg_4dfp) | 4. Render target & masked source overlay (fsleyes)`

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd1/imgreg_c1_cmd1_output.png
                      :alt: 4099 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd1/imgreg_c1_cmd1_t4file.png
                      :alt: 4099 t4file output
                      :align: center

          .. tab-item:: Fast Local Pass (Mode 3075)
              :sync: pass-3075

              **Optimization Function:** Fast Search / Fine Grid | **Step Size:** 1.2x parameter step / 5.0 mm voxel grid | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`1024` + :bdg-danger:`2048`

              .. code-block:: bash

                # Pass 3
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_mpr_t4 3075

              **What Happens Under the Hood:**

              * Switches execution from global grid searching to local parabolic gradient optimization across all 6 rigid-body degrees of freedom.
              * Combines a wide parameter search radius (1.2x multiplier via Bit :bdg-danger:`1024`) for broad rotational capture with a tight 5.0 mm spatial sampling grid (via Bit :bdg-danger:`2048`).
              * Introduces the source brain mask (``SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask``) now that initial translation is established.
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED).

              **Output:**

              :math:`\eta \approx 0.31`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd2/imgreg_c1_cmd2_output.png
                      :alt: 3075 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd2/imgreg_c1_cmd2_t4file.png
                      :alt: 3075 t4file output
                      :align: center

          .. tab-item:: Fine Local Alignment (Mode 2051)
              :sync: pass-2051

              **Optimization Function:** Standard Fine Step | **Step Size:** 5.0 mm voxel grid | **Bits:** :bdg-primary:`1` + :bdg-info:`2` + :bdg-danger:`2048`

              .. code-block:: bash

                # Pass 4 & 5
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_mpr_t4 2051
                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp SUBJ_MSC01_func01_anat_Grp1_uwrp_brain_mask SUBJ_MSC01_func01_anat_Grp1_uwrp_to_SUBJ_MSC01_func01_mpr_t4 2051


              **What Happens Under the Hood:**

              * Drops Bit :bdg-danger:`1024` to transition from a wide search radius (1.2x) to a narrowing dynamic search step (0.8x → 0.4x) while maintaining the 5.0 mm spatial sampling grid.
              * Refines rigid-body alignment around the local minimum identified during Pass 3.
              * Executes two sequential passes to guarantee parameter stability and complete convergence (:math:`\Delta\eta \approx 0.00`).
              * Uses :term:`Vector Gradient Alignment` (Bit :bdg-success:`256` DISABLED).

              **Output:**

              :math:`\eta \approx 0.32`

              .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: 🧠 Transformed Images

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd3/imgreg_c1_cmd3_output.png
                      :alt: 2051 output
                      :align: center

                .. grid-item-card:: 📄 t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case1/cmd3/imgreg_c1_cmd3_t4file.png
                      :alt: 2051 t4file output
                      :align: center

        .. dropdown:: 🎞️ Click to view progressive registration animation (All Passes)
          :animate: fade-in
          :class-container: mt-3 mb-3

          **Animation Sequence:** :bdg-secondary:`Baseline` → :bdg-dark:`4099` (after second run) → :bdg-danger:`3075` → :bdg-danger:`2051` (after second run)

          .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/case3/imgreg_c3_output.gif
              :alt: Case 3 progressive registration animation across all modes
              :align: center
              :width: 85%

    .. tab-item:: ⚠️ Common Errors
      :class-label: tab-error

      .. tab-set::

          .. tab-item:: ❌ Non-Existent Target or Source Image
            :class-label: tab-error

            **Cause:** Specifying a target or source image root name that does not exist in the working directory or is missing its corresponding ``.4dfp.ifh`` header file.

            **Command Attempt:**

            .. code-block:: bash

                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_SUBJ_MSC01_func01_t2w_t4 2051

            **Observed Behavior:**

            The application fails when attempting to read the missing image header or binary payload, outputting an file open error and aborting execution.

            .. code-block:: text

                Getifh: SUBJ_MSC01_func01_mpr.4dfp.ifh read error, imgfile='SUBJ_MSC01_func01_mpr.4dfp.img'
                get_4dfp_dimoe: SUBJ_MSC01_func01_mpr.4dfp.img read error

            .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/errors/imgreg_missing_ifh.png
                :alt: Terminal output showing file opening error for missing image
                :align: center

            .. admonition:: Resolution
                :class: warning

                Verify that both the ``.4dfp.img`` binary file and ``.4dfp.ifh`` header file exist in the working path. Do not include the ``.4dfp.img`` extension in the command line argument; supply only the root file name.

          .. tab-item:: ❌ Malformed t4file
            :class-label: tab-error

            **Cause:** Passing a path to a :term:`t4file` that cannot be parsed into a valid :math:`4 \times 4` transformation matrix.

            **Command Attempt:**

            .. code-block:: bash

                imgreg_4dfp SUBJ_MSC01_func01_mpr SUBJ_MSC01_func01_mpr_brain_mask SUBJ_MSC01_func01_t2w none SUBJ_MSC01_func01_mpr_to_SUBJ_MSC01_func01_t2w_t4 2051

            **Observed Behavior:**

            The tool attempts to load the transformation matrix and throws an I/O error.

            .. code-block:: text

                At line 110 of file /home/rd521/space_freesurfer/build/docker_ubuntu20/trunk/rd521-7.4.0/talairach_avi/t4_sub.f (unit = 8, file = 'SUBJ_MSC01_func01_mpr_to_SUBJ_MSC01_func01_t2w_t4')
                Fortran runtime error: End of file

            .. grid:: 1 2 2 2
                :gutter: 2

                .. grid-item-card:: ❌ Error Output

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/errors/imgreg_malformed_t4_output.png
                      :alt: imgreg malformed t4 file
                      :align: center

                .. grid-item-card:: 📄 Malformed t4file

                  .. image:: /_static/tools/spatial_registration_and_transforms/imgreg_4dfp/errors/imgreg_malformed_t4_file.png
                      :alt: imgreg malformed t4 output
                      :align: center

            .. admonition:: Resolution
                :class: warning

                If starting a registration from scratch, initialize a new identity matrix using :ref:`t4_null` prior to calling ``imgreg_4dfp``.
            
.. rubric:: References

.. [1] Rowland, D. J., Garbow, J. R., Laforest, R., & Snyder, A. Z. (2005). `Registration of [18F]FDG microPET and small-animal MRI <https://www.sciencedirect.com/science/article/pii/S0969805105001253>`_. *Nuclear Medicine and Biology*, 32(7), 663–670.