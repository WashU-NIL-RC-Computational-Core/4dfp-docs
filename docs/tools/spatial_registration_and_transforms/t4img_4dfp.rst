.. _t4img_4dfp:

Transform 4dfp Image
====================
.. rubric:: Tool: ``t4img_4dfp``

Synopsis
--------

::

   t4img_4dfp <t4file> <imgfile> [<outfile>] [-B] [-d] [-N] [-n] [-R] [-s] [-z] [-O<outspace>] [-@<endian>]

Description
-----------

Applies a spatial transformation matrix (:term:`t4file`) to resample a 3D or 4D :ref:`4dfp image<image_data>` into a target space or reference image grid [#wrapper]_. For timeseries, the same transform is applied to every frame.

* **Resampling Multiple Inputs Into a Single Output (n:1):** If you need to combine multiple separate images into a single output, or require custom per-scan weights, frame/slice selection, or input masks, use :ref:`t4imgs_4dfp<t4imgs_4dfp>`.
* **Resampling Multiple Inputs Into Multiple Outputs (n:n):** Neither ``t4img_4dfp`` nor :ref:`t4imgs_4dfp<t4imgs_4dfp>` outputs multiple separate files from a single command. To resample multiple images into their own output, run ``t4img_4dfp`` iteratively (see :ref:`t4img_examples`).

By default, ``t4img_4dfp`` defaults the output image name as ``<imgfile>t`` unless an ``<outfile>`` is provided. 
Passing ``none`` for :term:`t4file` applies an identity transform, allowing grid resampling or orientation conversion without spatial rotation or translation.

.. note::
  **File Extensions:** There is no need to pass the 4dfp file extensions for :ref:`4dfp image<image_data>`. Extensions are stripped automatically from ``<imgfile>`` and ``<outfile>``.

Usage
-----

.. list-table::
   :widths: 20 60
   :header-rows: 1

   - - Flag / Argument
     - Description
   - - ``-B``
     - :bdg-warning:`Legacy` Converts input transformation matrices from legacy atlas :ref:`711-2A <atlas_711-2a>` to :ref:`711-2B <atlas_711-2b>`.
   - - ``-d``
     - Enables debugging output in the ``t4img_4dfp`` wrapper (ignored by ``t4imgs_4dfp``).
   - - ``-N``
     - Assigns ``NaN`` instead of ``0.0`` to output voxels with no valid input (out-of-FOV or masked).
   - - ``-n``
     - Uses :term:`Nearest-Neighbor Interpolation` (ignores intensity scaling within the :term:`t4file`).
   - - ``-R``
     - Disables creation of the output :ref:`rec_file` provenance file.
   - - ``-s``
     - Enables :term:`Cubic Spline Interpolation`.
   - - ``-z``
     - Divides accumulated voxel sums by the square root of the total weight (:math:`\sqrt{\sum w_i}`, or :math:`\sqrt{N}` for :math:`N` equally weighted scans) for combining inputs that are **already z-scored**. **Has no effect when processing one image.**
   - - ``-O<outspace>``
     - Sets the output space and voxel grid (defaults to ``333.0``; see :ref:`t4img_outspace`):

         - **711-2B shortcuts only** (``111``, ``222``, ``333[.n]``): Built-in resolution presets exclusively for WashU :ref:`711-2B <atlas_711-2b>` space.
         - **Reference image** (``<image>``): Root name of an existing :term:`4dfp` volume whose grid and orientation to match; required for :ref:`MNI152 <atlas_mni>`, native, or custom spaces.
   - - ``-@<endian>``
     - Forces output binary format to :term:`Big-Endian` (``-@b``) or :term:`Little-Endian` (``-@l``); defaults to computer's endianness.

.. note::    
  **Flag Syntax**: Pass single-letter flags separately (e.g., ``-n -R``, not ``-nR``). Values for ``-O<outspace>`` and ``-@<endian>`` must immediately follow the flag with no separating space (e.g., ``-O222``, ``-@b``); inserting a space causes the value to be misinterpreted as a positional file argument.

.. _t4img_outspace:

.. rubric:: Output Spaces & Target Grids

While :term:`t4file` defines the mathematical coordinate transformation from source space to target space, ``-O<outspace>`` defines the **target voxel grid** (matrix dimensions, voxel spacing, volume center, and anatomical orientation) onto which the image is sampled. 
Always match ``-O<outspace>`` to the target space of your :term:`t4file`.

**1. Built-In 711-2B Atlas Presets**

The numeric shortcuts hardcode axial (``orientation = 2``) grids specifically for :ref:`711-2B <atlas_711-2b>` space:

.. list-table::
   :widths: 15 18 22
   :header-rows: 1

   - - Preset
     - Voxel Size
     - Matrix Dimensions
   - - ``-O111``
     - :math:`1 \times 1 \times 1\text{ mm}`
     - :math:`176 \times 208 \times 176`
   - - ``-O222``
     - :math:`2 \times 2 \times 2\text{ mm}`
     - :math:`128 \times 128 \times 75`
   - - ``-O333`` *(Default)*
     - :math:`3 \times 3 \times 3\text{ mm}`
     - :math:`48 \times 64 \times 48` 

.. note::
   **Y-Axis Center Offset (``-O333.n``):** Appending an integer offset ``.n`` shifts the output grid along the anterior-posterior (Y) axis by ``n`` voxels.

   - **Positive ``.n``**: Shifts the field of view posteriorly to prevent **occipital** clipping.
   - **Negative ``.n``**: Shifts the field of view anteriorly to prevent **frontal** clipping.

**2. Reference Image Grids (``-O<outspace>``)**

Passing the root name of any existing :ref:`4dfp image<image_data>` copies its exact matrix dimensions, voxel size, center, and orientation from the :ref:`interfile_header` header. Choose ``-O<outspace>`` when resampling into:

- **A participant's native scan** (e.g., resampling a BOLD run onto that participant's native T1w grid).
- **A custom or study-specific template** (e.g., a cohort-averaged anatomical image).
- **A standard atlas** (see :ref:`atlases`).

.. _t4img_interpolation:

Interpolation Methods
---------------------

When resampling onto a new grid, output voxel centers almost always land between input voxel coordinates :math:`(x, y, z)` rather than lining up directly.
Both ``t4img_4dfp`` and :ref:`t4imgs_4dfp<t4imgs_4dfp>` can use 3 interpolation methods to estimate the intensities of the output voxels based on the neighboring input voxels.

.. list-table::
   :widths: 20 18 62
   :header-rows: 1

   * - Method
     - Neighborhood
     - Behaviors & Trade Offs
   * - **Trilinear** *(Default)*
     - 8 surrounding voxels
     - * **Behavior:** Computes a distance-weighted average of the 8 surrounding voxels.
       * **Trade-off:** Softens sharp edges slightly, but strictly stays within the local input range (no overshoot).
   * - **Cubic Spline** (``-s``)
     - 1D axis curves + 8 surrounding voxels
     - * **Behavior:** Precomputes smooth curvature along the X, Y, and Z axes, then uses the 8 surrounding voxels (and their stored curvatures) to evaluate the output intensity along that smooth curve.
       * **Trade-off:** Can introduce minor ringing (slight overshoot or undershoot, including small negative values) along sharp brain/background edges.
   * - **Nearest-Neighbor** (``-n``)
     - 1 closest voxel
     - * **Behavior:** Copies the value of the single closest input voxel without blending.
       * **Note:** Ignores any multiplicative intensity scale stored in :term:`t4file`.

.. note::
   * **ROI Region Names (``-n``)**: :term:`Trilinear Interpolation` and :term:`Cubic Spline Interpolation` drop ROI region names from the output :ref:`interfile_header`. Nearest-Neighbor copies those names to the output :ref:`interfile_header` so anatomical labels stay intact.
   * **Using -s & -n Together**: ``-s`` and ``-n`` are not intended to be used together. Using them both together can lead to inaccurate results. It is best to avoid combining them.

.. _t4img_examples:

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 🧠 Case 1: Structural Scan to Atlas Space

         When resampling high-resolution images (such as a T1w MPRAGE) into atlas space, we can use the default :term:`Trilinear Interpolation`. Since the images are higher resolution, :term:`Trilinear Interpolation` will give us a good enough result while avoiding potential ringing along sharp tissue boundaries.

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`Every 4dfp volume requires both its binary .4dfp.img file and its ASCII .4dfp.ifh header in the same directory.`


            .. image:: /_static/tools/registration/t4img_4dfp/case1/t4img_c1_input_files.png
               :alt: Directory listing showing sub01_mpr.4dfp.img, sub01_mpr.4dfp.ifh, and t4 file
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡ 711-2B Preset (-O111)

               We can use the built-in ``-O111`` shortcut to resample our high-resolution image onto the standard :math:`1\text{ mm}` :ref:`711-2B <atlas_711-2b>` grid.

               **1. Execute Command:**

               .. code-block:: bash

                  t4img_4dfp -O111

               **2. Terminal Output:**

               .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd1/t4img_c1_terminal.png
                  :alt: Terminal output
                  :align: center
                  :width: 75%

               **3. Visual Comparison:**

               .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd1/t4img_c1_result.png
                  :alt: Visual Compare
                  :align: center
                  :width: 80%

            .. tab-item:: ⚡ MNI152 Reference Grid (-O<outspace>)

               If we instead want to transform our image into :ref:`MNI152 <atlas_mni>` space (or into a participant's native scan), pass the target template's root name to ``-O``.

               **1. Execute Command:**

               .. code-block:: bash

                  t4img_4dfp -OMNI152_T1_1mm

               **2. Terminal Output:**

               .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd2/t4img_c1_mni_terminal.png
                  :alt: Terminal output
                  :align: center
                  :width: 75%
              
              **3. Visual Comparison:**

               .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd1/t4img_c1_result.png
                  :alt: Visual Compare
                  :align: center
                  :width: 80%

      .. tab-item:: 🎯 Case 2: Resampling a Binary Mask

         When resampling masks, since the mask only has binary (1 or 0) intensities, we can use the :term:`Nearest-Neighbor Interpolation`. This interpolation method is the best for binary voxel intensities and will save us time due to its simplicity.
         
         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`Inspect your input .4dfp.ifh file for "region names :=" entries if downstream tools like FIDL rely on anatomical labels.`

            .. image:: /_static/tools/registration/t4img_4dfp/case2/t4img_c2_input_ifh.png
               :alt: Input mask
               :align: center
               :width: 80%

         **1. Execute Command:**

         In this example we are wanting to resample our mask from native space to the same space as its associated image; this will allow us to continue to use the mask against our data if it also has been resampled into the same space.

         A couple of considerations:
          * We can use the mask on its respective image prior to resampling to avoid needing it post resampling.
          * We can use the same ``-O<outspace>`` that we used for the associated image's resampling and it will produce the same result.

         .. code-block:: bash

            t4img_4dfp -n -O<outspace> 

         **2. Output Comparison (``-n`` vs. Default Trilinear):**

         .. image:: /_static/tools/registration/t4img_4dfp/case2/t4img_c2_comparison.png
            :alt: Comparison of mask resampled with -n versus default :term:`Trilinear Interpolation`
            :align: center
            :width: 80%

      .. tab-item:: 🔄 Case 3: BOLD To Atlas (-s)
      
         The native Midnight Scan Club BOLD images we are working with were captured at :math:`4\text{ mm}`, and for this example we want to transform and upsample them onto a :math:`2\text{ mm}` :ref:`711-2B <atlas_711-2b>` grid (``-O222``). Because we are upsampling coarse functional voxels onto a finer lattice, we enable :term:`Cubic Spline Interpolation` (``-s``) to reconstruct smooth sub-voxel contrast without excessive blurring. 
         
         We also pass ``-N`` so that any target voxels falling outside the original scanner field of view are recorded as ``NaN`` rather than zero-padded.

         **1. Execute Command:**

         .. code-block:: bash

            t4img_4dfp -s -N

        **2. Output Comparison (``-n`` vs. Default Trilinear):**

         .. image:: /_static/tools/registration/t4img_4dfp/case2/t4img_c2_comparison.png
            :alt: Comparison of mask resampled with -n versus default :term:`Trilinear Interpolation`
            :align: center
            :width: 80%

      .. tab-item:: ⚠️ Common Errors
         :class-label: tab-error

         .. tab-set::

            .. tab-item:: ❌ Swapped Argument Order
               :class-label: tab-error

               **Cause:** Passing ``<imgfile>`` before ``<t4file>``. Unlike ``t4imgs_4dfp``, ``t4img_4dfp`` requires the transform file **first**.

               **Command Attempt:**

               .. code-block:: bash

                  t4img_4dfp -O111 sub01_mpr sub01_mpr_to_711-2B_t4 sub01_mpr_111

               **Error Output:**

               Because ``sub01_mpr_to_711-2B_t4`` is in the second positional slot (``<imgfile>``), ``t4imgs_4dfp`` attempts to open it as a 4dfp volume:

               .. code-block:: text

                  Error output

               .. admonition:: Resolution
                  :class: warning

                  Always pass positional arguments in the order ``<t4file> <imgfile> [<outfile>]``.

            .. tab-item:: ❌ Space After ``-O`` or Missing Header File
               :class-label: tab-error

               **Cause:** Inserting a space between ``-O`` and its value (e.g., ``-O 111``), passing a NIfTI file (``.nii``) instead of :term:`4dfp`, or omitting a paired ``.4dfp.ifh`` header.

               **Command Attempt:**

               .. code-block:: bash

                  t4img_4dfp sub01_mpr_to_711-2B_t4 sub01_mpr -O 111

               **Error Output:**

               ``t4imgs_4dfp`` parses ``-O`` with an empty reference name and treats ``111`` as ``<outfile>``, failing when attempting to open the output grid header:

               .. code-block:: text

                  Output error

               .. admonition:: Resolution
                  :class: warning

                  Attach values directly to ``-O`` with no space, and verify with ``ls`` that both ``.4dfp.img`` and ``.4dfp.ifh`` exist for all input and reference files.

            .. tab-item:: ❌ Blurred ROI Labels & Dropped Region Names
               :class-label: tab-error

               **Cause:** Resampling a mask without passing the ``-n`` flag.

               **Observed Behavior:**

               The command succeeds, but default :term:`Trilinear Interpolation` averages neighboring integer labels along region boundaries into fractional values and drops all ``region names`` entries from the output ``.4dfp.ifh`` header.

               .. admonition:: Resolution
                  :class: warning

                  Re-run with ``-n`` (e.g., ``t4img_4dfp -n -O333.0 ...``).

.. rubric:: Footnotes

.. [#wrapper] ``t4img_4dfp`` is a C-shell wrapper around :ref:`t4imgs_4dfp`. It automates single-file transformations by generating a temporary one-line input list, invoking ``t4imgs_4dfp``.
