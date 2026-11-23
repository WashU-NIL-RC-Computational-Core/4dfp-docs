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

Resamples and combines multiple 3D or 4D images listed in a plain-text list file (``<inlist>``) into a single output image (``<outfile>``) by applying their respective :term:`t4file`.

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

.. .. dropdown:: 💡 Click to show/hide usage examples
..    :animate: fade-in

..    .. tab-set::

..       .. tab-item:: 🧠 Case 1: Multi-Scan Anatomical Average

..          Use ``t4imgs_4dfp`` with cubic spline interpolation (``-s``) to resample and average multiple structural acquisitions (such as repeated T1w MPRAGE scans) directly into target space in a single step.

..          .. note::
..             In the commands below, replace ``mpr_scans.lst`` and the file prefixes inside it with your own list and scan names.

..          .. card:: 📥 Input Data
..             :class-card: sd-bg-light sd-border-1 mb-3

..             .. div:: card-help-top-right

..                :card-help:`Every image listed in your .lst file must have both its .4dfp.img and .4dfp.ifh files in the specified path.`

..             A plain-text list file (``mpr_scans.lst``) pairing each T1w scan with its corresponding :term:`t4file`:

..             .. code-block:: text

..                # mpr_scans.lst
..                sub01_mpr1 t4=sub01_mpr1_to_711-2B_t4
..                sub01_mpr2 t4=sub01_mpr2_to_711-2B_t4

..             .. image:: /_static/tools/registration/t4imgs_4dfp/case1/t4imgs_c1_input_files.png
..                :alt: Directory listing showing mpr_scans.lst, MPRAGE 4dfp pairs, and t4 files
..                :align: center
..                :width: 80%

..          .. tab-set::

..             .. tab-item:: ⚡ Command 1: Average into 711-2B (111)

..                Run ``t4imgs_4dfp`` with ``-s`` and ``-O111`` to resample both scans onto the 1 mm WashU :ref:`711-2B <atlas_711-2b>` grid and average them without creating intermediate files:

..                **1. Execute Command:**

..                .. code-block:: bash

..                   t4imgs_4dfp -s -O111 mpr_scans.lst sub01_mpr_avg_111

..                **2. Terminal Output:**

..                ``t4imgs_4dfp`` reads each image and transform sequentially, accumulates weighted voxel intensities, and writes the normalized average volume:

..                .. image:: /_static/tools/registration/t4imgs_4dfp/case1/cmd1/t4imgs_c1_terminal.png
..                   :alt: Terminal output showing t4imgs_4dfp reading two MPRAGE stacks and writing normalized output
..                   :align: center
..                   :width: 75%

..                **3. Visual Comparison:**

..                .. image:: /_static/tools/registration/t4imgs_4dfp/case1/cmd1/t4imgs_c1_result.png
..                   :alt: Comparison of single T1w scan versus two-scan average in 711-2B 111 space
..                   :align: center
..                   :width: 80%

..             .. tab-item:: ⚡ Command 2: Partial-FOV Scans (No Edge Darkening)

..                When combining scans with slightly shifted fields of view, ``t4imgs_4dfp`` normalizes each voxel only by the scans that cover it. This avoids the darkened overlap borders produced when averaging separate :ref:`t4img_4dfp <t4img_4dfp>` outputs.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   t4imgs_4dfp -s -O111 partial_fov_scans.lst cohort_avg_111

..                **2. Visual Comparison:**

..                .. image:: /_static/tools/registration/t4imgs_4dfp/case1/cmd2/t4imgs_c1_fov_comparison.png
..                   :alt: Comparison showing clean per-voxel normalization in t4imgs_4dfp versus darkened edges from naive averaging
..                   :align: center
..                   :width: 80%

..       .. tab-item:: 📊 Case 2: Combining Functional Z-Maps

..          Use ``-z`` together with per-scan ``mask=``, ``weight=``, and ``slices=`` tokens in ``<inlist>`` to combine statistical Z-maps across runs while excluding outer end-slice artifacts before interpolation.

..          .. card:: 📥 Input Data
..             :class-card: sd-bg-light sd-border-1 mb-3

..             .. div:: card-help-top-right

..                :card-help:`Masks and slice ranges in the .lst file are applied in each scan's native space before resampling.`

..             A list file (``run_zmaps.lst``) combining three functional runs with native brain masks, run-duration weights, and end-slice trimming (keeping slices 2 through 34):

..             .. code-block:: text

..                # run_zmaps.lst
..                run1_zmap t4=run1_to_711-2B_t4 mask=run1_mask weight=1.0 slices=2to34
..                run2_zmap t4=run2_to_711-2B_t4 mask=run2_mask weight=1.0 slices=2to34
..                run3_zmap t4=run3_to_711-2B_t4 mask=run3_mask weight=0.8 slices=2to34

..             .. image:: /_static/tools/registration/t4imgs_4dfp/case2/t4imgs_c2_input_list.png
..                :alt: List file and native Z-map and mask inputs
..                :align: center
..                :width: 80%

..          **1. Execute Command:**

..          Pass ``-z`` so voxel sums are divided by :math:`\sqrt{\sum w_i}` instead of :math:`\sum w_i`, preserving unit-variance Z-score scaling:

..          .. code-block:: bash

..             t4imgs_4dfp -z -O333.8 run_zmaps.lst sub01_combined_zmap_333

..          **2. Terminal Output & Visual Result:**

..          .. image:: /_static/tools/registration/t4imgs_4dfp/case2/t4imgs_c2_result.png
..             :alt: Combined Z-map output in 333.8 space with edge slices excluded
..             :align: center
..             :width: 80%

..       .. tab-item:: 🧩 Case 3: Cohort Coverage Mask (-n and -N)

..          Use ``-n`` (nearest-neighbor) and ``-N`` (assign ``NaN`` to uncovered voxels) to resample and combine binary subject masks into a group coverage map without interpolating mask boundaries.

..          **1. Input List (``subject_masks.lst``):**

..          .. code-block:: text

..             # subject_masks.lst
..             sub01_brainmask t4=sub01_to_711-2B_t4
..             sub02_brainmask t4=sub02_to_711-2B_t4
..             sub03_brainmask t4=sub03_to_711-2B_t4

..          **2. Execute Command:**

..          .. code-block:: bash

..             t4imgs_4dfp -n -N -O333.8 subject_masks.lst group_coverage_333

..          **3. Visual Result:**

..          Voxels covered by all subjects equal ``1.0``, partially covered edge voxels reflect the exact fraction of overlapping masks, and voxels outside every subject's mask are set to ``NaN`` instead of ``0.0``:

..          .. image:: /_static/tools/registration/t4imgs_4dfp/case3/t4imgs_c3_coverage.png
..             :alt: Cohort coverage map showing NaN background and fractional overlap along edges
..             :align: center
..             :width: 75%

..       .. tab-item:: ⚠️ Common Errors
..          :class-label: tab-error

..          .. tab-set::

..             .. tab-item:: ❌ Mask Dimension Mismatch
..                :class-label: tab-error

..                **Cause:** Specifying a ``mask=<mskfile>`` in ``<inlist>`` whose matrix dimensions, voxel sizes, or anatomical orientation do not match the corresponding input ``<imgfile>`` (for example, passing an atlas-space mask instead of a native-space mask).

..                **Error Output:**

..                ``t4imgs_4dfp`` validates each mask's header against its paired input image before resampling and exits immediately on any mismatch:

..                .. code-block:: text

..                   t4imgs_4dfp: atlas_mask.4dfp.img run1_zmap.4dfp.img dimension mismatch

..                .. admonition:: Resolution
..                   :class: warning

..                   Ensure every ``mask=`` file in ``<inlist>`` is in the **same native space and grid** as the ``<imgfile>`` on that line.

..             .. tab-item:: ❌ Missing File or Spaces Around ``=`` in List
..                :class-label: tab-error

..                **Cause:** A misspelled image, transform, or mask path in ``<inlist>``, or inserting spaces around ``=`` in ``key=value`` tokens (such as ``t4 = run1_t4`` instead of ``t4=run1_t4``).

..                **Error Output:**

..                Because ``t4imgs_4dfp`` splits list lines on whitespace, spaces around ``=`` prevent the token from being recognized, and any unreadable file triggers an immediate read error:

..                .. code-block:: text

..                   t4imgs_4dfp: run1_zmap.4dfp.img read error

..                .. admonition:: Resolution
..                   :class: warning

..                   Verify that all referenced ``.4dfp.img``, ``.4dfp.ifh``, and ``_t4`` files exist, and write ``key=value`` tokens without spaces around ``=``.

..             .. tab-item:: ❌ Missing Reference Grid Header (-O)
..                :class-label: tab-error

..                **Cause:** Passing a custom or :ref:`MNI152 <atlas_mni>` reference volume to ``-O<image>`` whose ``.4dfp.ifh`` header does not exist or cannot be opened.

..                **Command Attempt:**

..                .. code-block:: bash

..                   t4imgs_4dfp -s -OMNI152_T1_2mm mpr_scans.lst sub01_mpr_MNI

..                **Error Output:**

..                ``t4imgs_4dfp`` reads ``<image>.4dfp.ifh`` to configure the output matrix before scanning the input list and terminates if the header is missing:

..                .. code-block:: text

..                   Getifh: MNI152_T1_2mm.4dfp.ifh read error

..                .. admonition:: Resolution
..                   :class: warning

..                   Confirm that ``<image>.4dfp.ifh`` exists in your working directory (or provide the full path to the reference template).

..             .. tab-item:: ❌ Diluted Z-Scores (Omitting ``-z``)
..                :class-label: tab-error

..                **Cause:** Combining statistical Z-maps without passing the ``-z`` flag.

..                **Observed Behavior:**

..                The command completes without a terminal error, but ``t4imgs_4dfp`` divides voxel sums by the total weight :math:`\sum w_i` (computing a standard mean) rather than :math:`\sqrt{\sum w_i}`. Across :math:`N` equal-weight runs, peak Z-scores shrink by a factor of :math:`\sqrt{N}`.

..                .. admonition:: Resolution
..                   :class: warning

..                   Always include ``-z`` when aggregating Z-score maps so the combined volume maintains valid unit-variance Z-score scaling.