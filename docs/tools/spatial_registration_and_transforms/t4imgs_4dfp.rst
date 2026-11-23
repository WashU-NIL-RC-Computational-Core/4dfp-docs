.. _t4imgs_4dfp:

Transform and Combine Multiple 4dfp Images
==========================================
.. rubric:: Tool: ``t4imgs_4dfp``

Synopsis
--------

::

   t4imgs_4dfp <inlist> <outfile> [-B] [-N] [-n] [-R] [-s] [-z] [-O<outspace>] [-@<endian>]

Description
-----------

Resamples and combines multiple 3D or 4D images listed in a plain-text list file (``<inlist>``) into a single output :ref:`4dfp image<image_data>` (``<outfile>``) by applying their respective :term:`t4file`.

``t4imgs_4dfp`` processes the input list sequentially and pairs each image with its own :term:`t4file` to process each image independently onto the shared target grid (frame-by-frame for 4D inputs). 
As each image is interpolated, its values are then multiplied by its corresponding weight (and any intensity scaling factor), summed into a per-voxel accumulated intensity, and then normalized into the output image.

If you would like to resample each image into its own ``<outfile>``, please use :ref:`t4img_4dfp<t4img_4dfp>`.

.. tip::
   Output spaces (``-O<outspace>``) and spatial interpolation methods (trilinear ``default``, cubic spline ``-s``, nearest-neighbor ``-n``) work the same way as in :ref:`t4img_4dfp<t4img_4dfp>`; see :ref:`t4img_outspace` and :ref:`t4img_interpolation` for more guidance.

.. rubric:: Key Capabilities

- **Group Templates & Multi-Scan Averaging**: The ``<inlist>`` list of inputs allows users to build study-specific templates across participants or average repeated acquisitions from the same session in a single pass.
- **Weighted & Coverage-Aware Averaging**: ``weight=`` is a custom value that sets how much each images will contribute to the output while normalizing overlapping voxels from valid images.
- **Pre-Interpolation Masking & End-Slice Trimming**: Prior to resampling, ``mask=`` excludes non-brain tissue while ``slices=`` omits corrupted end-slices. Currently unavailable in :ref:`t4img_4dfp<t4img_4dfp>`

.. _t4imgs_inlist:

.. rubric:: Input List Format (``<inlist>``)

``<inlist>`` is a plain-text file with one input scan per line. Each line starts with an image root name followed by optional space-separated ``var=value`` tokens (blank lines and ``#`` comments are ignored):

.. code-block:: text

   # Syntax:
   # <imgfile> [t4=<t4file>] [mask=<mskfile>] [scale=<float>] [weight=<float>] [slices=<low>to<high>]

   sub01_run1_zmap  t4=run1_to_711-2B_t4  mask=run1_mask  weight=1.0  slices=2to34
   sub01_run2_zmap  t4=run2_to_711-2B_t4  mask=run2_mask  weight=1.0  slices=2to34

``<imgfile>`` *(or ``img=<imgfile>``)*
   Input :ref:`4dfp image<image_data>` root name (extensions optional).

``t4=<t4file>``
   :term:`t4file` to be applied to this image. Defaults to an identity transform matrix if omitted.

``mask=<mskfile>``
   Native-space mask matching ``<imgfile>``'s grid. Voxels where ``mask <= 0.0`` are excluded prior to resampling.

``scale=<float>``
   Multiplies all voxel intensities in this image by a constant factor (defaults to ``1.0``), this value is also multiplied with any intensity scale factor from the ``t4file`` (unless ``-n`` is used).

``weight=<float>``
   Relative weight (or contribution) of this image in the weighted average (defaults to ``1.0``).

``slices=<low>to<high>``
   Keeps only slices ``<low>`` through ``<high>`` (``slices=3to28``), excludes outer slices prior to resampling.

Usage
-----

.. list-table::
   :widths: 20 60
   :header-rows: 1

   - - Flag
     - Description
   - - ``-B``
     - :bdg-warning:`Legacy` Converts input transformation matrices from legacy atlas :ref:`711-2A <atlas_711-2a>` to :ref:`711-2B <atlas_711-2b>`.
   - - ``-N``
     - Assigns ``NaN`` instead of ``0.0`` to output voxels with no valid input (out-of-FOV or masked).
   - - ``-n``
     - Uses :term:`Nearest-Neighbor Interpolation` (ignores intensity scaling within the t4file).
   - - ``-R``
     - Suppresses creation of the :ref:`rec_file`.
   - - ``-s``
     - Enables :term:`Cubic Spline Interpolation`.
   - - ``-z``
     - Divides accumulated voxel sums by the square root of the total weight (:math:`\sqrt{\sum w_i}`, or :math:`\sqrt{N}` for :math:`N` equally weighted scans) for combining inputs that are **already z-scored**.
   - - ``-O<outspace>``
     - Sets the output space and voxel grid (defaults to ``333.0``; see :ref:`t4img_outspace`):

         - **711-2B shortcuts only** (``111``, ``222``, ``333[.n]``): Built-in resolution presets exclusively for WashU :ref:`711-2B <atlas_711-2b>` space.
         - **Reference image** (``<image>``): Root name of an existing :term:`4dfp` volume whose grid and orientation to match; required for :ref:`MNI152 <atlas_mni>`, native, or custom spaces.
   - - ``-@<endian>``
     - Forces output binary format to :term:`Big-Endian` (``-@b``) or :term:`Little-Endian` (``-@l``); defaults to computer's endianness.

.. _t4imgs_examples:

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 🧠 Case 1: Multi-Scan Anatomical Average

          When resampling multiple high-resolution images (such as a T1w MPRAGE) into atlas space, we can use the :term:`Trilinear Interpolation` to resample and average multiple structural acquisitions directly into target space in a single pass.

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`Every image listed in your inlist file must have both its .4dfp.img and .4dfp.ifh files in the specified path.`

            ``mpr_inlist`` to relate our images with their corresponding :term:`t4file`

            .. code-block:: text

               # mpr_inlist
               sub01_mpr1 t4=sub01_mpr1_to_711-2B_t4
               sub01_mpr2 t4=sub01_mpr2_to_711-2B_t4

            .. image:: /_static/tools/registration/t4imgs_4dfp/case1/t4imgs_c1_input_files.png
               :alt: Directory listing showing mpr_inlist, MPRAGE 4dfp pairs, and t4 files
               :align: center
               :width: 80%

         **1. Execute Command:**

         .. code-block:: bash

            t4imgs_4dfp -O111 inlist sub01_mpr_avg_111

         **2. Terminal Output:**

         .. image:: /_static/tools/registration/t4imgs_4dfp/case1/cmd1/t4imgs_c1_terminal.png
            :alt: Terminal output
            :align: center
            :width: 75%

         **3. Visual Comparison:**

         .. image:: /_static/tools/registration/t4imgs_4dfp/case1/cmd1/t4imgs_c1_result.png
            :alt: Comparison
            :align: center
            :width: 80%

      .. tab-item:: 📈 Case 2: Weighted Functional Average (-s)

        The native Midnight Scan Club BOLD runs we are working with were captured at :math:`4\text{ mm}` across multiple sessions with slightly different global signal baselines and usable frame counts. For this example, we want to transform, intensity-normalize, and compute a weighted average of those runs onto a :math:`2\text{ mm}` :ref:`711-2B <atlas_711-2b>` grid (``-O222``) in a single pass. We enable 3D cubic spline interpolation (``-s``) to preserve sub-voxel contrast during upsampling and pass ``-N`` so out-of-FOV voxels are excluded as ``NaN`` rather than zero-padded.

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`weight= scales both the sum and normalization denominator; scale= adjusts intensity amplitude only.`

            First, define the input runs, transforms, and per-run ``weight`` and ``scale`` factors in a plain-text list file (``msc01_bold_runs_list``):

            .. code-block:: text

               sub-MSC01_ses-01_bold_4mm t4=sub-MSC01_ses-01_bold_to_711-2b_t4 weight=1.00 scale=0.98 mask=sub-MSC01_ses-01_bold_4mm_mask
               sub-MSC01_ses-02_bold_4mm t4=sub-MSC01_ses-02_bold_to_711-2b_t4 weight=0.85 scale=1.03 mask=sub-MSC01_ses-02_bold_4mm_mask
               sub-MSC01_ses-03_bold_4mm t4=sub-MSC01_ses-03_bold_to_711-2b_t4 weight=1.15 scale=0.99 mask=sub-MSC01_ses-03_bold_4mm_mask

            .. image:: /_static/tools/registration/t4imgs_4dfp/case2/t4imgs_c2_input_list.png
               :alt: List file
               :align: center
               :width: 80%

         **1. Execute Command:**

         .. code-block:: bash

            t4imgs_4dfp msc01_bold_runs_list sub-MSC01_bold_weighted_222 -O222 -s -N

         **2. Terminal Output & Visual Result:**

         .. image:: /_static/tools/registration/t4imgs_4dfp/case2/t4imgs_c2_result.png
            :alt: Terminal log of scale and weight parameters and visual comparison of cubic spline vs linear resampling
            :align: center
            :width: 80%

      .. tab-item:: 📊 Case 3: Combining Functional Z-Maps (-z)

         Use ``-z`` together with per-scan ``mask=`` and ``slices=`` tokens in ``<inlist>`` to combine statistical Z-maps across runs while excluding outer end-slice artifacts in native space before resampling.

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`Use slices=<lo>to<hi> for a slice range or slices=<n> to project a single native slice.`

            .. code-block:: text

               # run_zmaps_list
               run1_zmap t4=run1_to_711-2B_t4 mask=run1_mask weight=1.0 slices=2to34
               run2_zmap t4=run2_to_711-2B_t4 mask=run2_mask weight=1.0 slices=2to34
               run3_zmap t4=run3_to_711-2B_t4 mask=run3_mask weight=1.0 slices=2to34

            .. image:: /_static/tools/registration/t4imgs_4dfp/case3/t4imgs_c3_input_list.png
               :alt: List file and native Z-map and mask inputs with slice trimming
               :align: center
               :width: 80%

         **1. Execute Command:**

         Pass ``-z`` so voxel sums are divided by :math:`\sqrt{\sum w_i}` instead of :math:`\sum w_i`:

         .. code-block:: bash

            t4imgs_4dfp -z -O333.8 run_zmaps_list sub01_combined_zmap_333

         **2. Visual Comparison:**

         .. image:: /_static/tools/registration/t4imgs_4dfp/case3/t4imgs_c3_result.png
            :alt: Combined Z-map output
            :align: center
            :width: 80%

      .. tab-item:: ⚠️ Common Errors
         :class-label: tab-error

         .. tab-set::

            .. tab-item:: ❌ Mask Dimension Mismatch
               :class-label: tab-error

               **Cause:** Specifying a ``mask=<mskfile>`` in ``<inlist>`` whose matrix dimensions, voxel sizes, or anatomical orientation do not match the corresponding input ``<imgfile>``.

               **Error Output:**

               Note error here..

               .. code-block:: text

                  Exact error in terminal

               .. admonition:: Resolution
                  :class: warning

                  Ensure every ``mask=`` file in ``<inlist>`` is in the **same native space and grid** as its respective ``<imgfile>``.

            .. tab-item:: ❌ Spaces Around ``=`` in List (Silent Failure)
               :class-label: tab-error

               **Cause:** Inserting spaces around ``=`` in ``<inlist>`` options.

               **Observed Behavior:**

               Add observed behavior

               .. admonition:: Resolution
                  :class: warning

                  Always write ``key=value`` tokens without spaces around ``=``, and confirm in the terminal log that each expected ``t4file=`` and ``maskfile=`` prints correctly.