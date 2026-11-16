.. _t4imgs_4dfp:

Transform and Combine 4dfp Images (Multi-File List)
===================================================
.. rubric:: Tool: ``t4imgs_4dfp``

Synopsis
--------

::

   t4imgs_4dfp <inlist> <outfile> [-B] [-N] [-n] [-R] [-s] [-z] [-O<outspace>] [-@<endian>]

Description
-----------

Resamples (by applying the :term:`t4file`) and combines multiple images listed in a plain-text list file (``<inlist>``) into a single output image (``<outfile>``). 

``t4imgs_4dfp`` processes the input list sequentially and pairs each image with its own :term:`t4file` to resample and interpolate it independently onto the shared target grid. As each scan is interpolated, its values are multiplied by its assigned weight (and any intensity scaling factor) and accumulated into running intensity and per-voxel weights, which are then normalized into a single volume.

If you would like to resample each image into its own ``<outfile>``, please use :ref:`t4img_4dfp<t4img_4dfp>`.

.. tip::
   Output spaces (``-O<outspace>``) and spatial interpolation methods (trilinear ``default``, cubic spline ``-s``, nearest-neighbor ``-n``) work the same way as in :ref:`t4img_4dfp<t4img_4dfp>`; see :ref:`t4img_outspace` and :ref:`t4img_interpolation` for more guidance.

.. rubric:: Key Capabilities (Why Use ``t4imgs_4dfp`` Over ``t4img_4dfp``)

* **Group Templates & Multi-Scan Averaging**: Build study-specific anatomical templates across subjects or average repeated acquisitions from the same session (such as multiple T1w/MPRAGE scans) directly into target space—avoiding intermediate files and the blurring caused by multi-step resampling.
* **No Darkened Borders on Partial-FOV Scans**: Averaging separate :ref:`t4img_4dfp<t4img_4dfp>` outputs darkens edges whenever scans have slightly shifted or clipped fields of view. ``t4imgs_4dfp`` prevents this automatically by normalizing each voxel only by the scans that actually cover it.
* **Artifact-Free Masking & End-Slice Trimming**: Exclude non-brain tissue (``mask=``), or corrupted end-slices (``slices=``) *before* interpolation so bad signal does not bleed into neighboring voxels (unavailable in :ref:`t4img_4dfp<t4img_4dfp>`).
* **Z-Score Map Aggregation (``-z``)**: Combine multiple statistical Z-maps across runs or participants via :math:`\sum w_i Z_i / \sqrt{\sum w_i}` so the combined output retains valid unit-variance Z-scores rather than being diluted by a standard average.

.. _t4imgs_inlist:

.. rubric:: Input List Format (``<inlist>``)

``<inlist>`` is a plain-text file with one input scan per line. Each line starts with an image root name followed by optional space-separated ``key=value`` tokens (blank lines and ``#`` comments are ignored):

.. code-block:: text

   # Syntax:
   # <imgfile> [t4=<t4file>] [mask=<mskfile>] [scale=<float>] [weight=<float>] [slices=<lo>to<hi>]

   sub01_run1_zmap  t4=run1_to_711-2B_t4  mask=run1_mask  weight=1.0  slices=2to34
   sub01_run2_zmap  t4=run2_to_711-2B_t4  mask=run2_mask  weight=1.0  slices=2to34

``<imgfile>`` *(or ``img=<imgfile>``)*
   Input :term:`4dfp` image root name (extensions optional).

``t4=<t4file>``
   :term:`t4file` to be applied to this image. Defaults to an identity transform matrix if omitted.

``mask=<mskfile>``
   Native-space mask matching ``<imgfile>``'s grid. Voxels where ``mask <= 0`` are excluded *before* interpolation.

``scale=<float>``
   Multiplies all voxel intensities in this image by a constant factor (defaults to ``1.0``; combined with any scale factor stored inside ``<t4file>``, unless ``-n`` is used).

``weight=<float>``
   Relative weight of this image when averaging across scans (defaults to ``1.0``)—useful for weighting functional runs by frame count or duration.

``slices=<lo>to<hi>``
   Keeps only slices ``<lo>`` through ``<hi>`` (1-based indexing, e.g., ``slices=3to28``), excluding outer end-slices *before* interpolation.

Usage
-----

.. list-table::
   :widths: 20 60
   :header-rows: 1

   * - Flag
     - Description
   * - ``-B``
     - :bdg-warning:`Legacy` Converts input transformation matrices from legacy Washington University :ref:`711-2A <atlas_711-2a>` atlas space to :ref:`711-2B <atlas_711-2b>` atlas space.
   * - ``-N``
     - Assigns ``NaN`` instead of ``0.0`` to output voxels with no valid input (e.g., out-of-FOV or masked).
   * - ``-n``
     - Uses :term:`Nearest-Neighbor Interpolation` instead of blending neighboring voxels—ideal for binary masks and integer ROI labels (ignores intensity scaling).
   * - ``-R``
     - Suppresses creation of the :ref:`rec_file`.
   * - ``-s``
     - Enables :term:`Cubic Spline Interpolation` for sharper anatomical resampling (takes precedence over ``-n`` if both are passed).
   * - ``-z``
     - Divides accumulated voxel sums by :math:`\sqrt{N}` rather than total weight :math:`N` (for combining inputs that are **already z-scored**).
   * - ``-O<outspace>``
     - Sets the output space and voxel grid (defaults to ``333.0``; see :ref:`t4img_outspace`):

       * **711-2B shortcuts only** (``111``, ``222``, ``333[.n]``): Built-in resolution presets exclusively for WashU :ref:`711-2B <atlas_711-2b>` space.
       * **Reference image** (``<image>``): Root name of an existing :term:`4dfp` volume whose grid to match; required for :ref:`MNI152 <atlas_mni>`, native, or custom spaces.
   * - ``-@<endian>``
     - Forces output binary write format to :term:`Big-Endian` (``-@b``) or :term:`Little-Endian` (``-@l``); Defaults to native host CPU endianness.

.. note:: Do not add spaces between an option flag and its argument (for example, use ``-O333>``, not ``-O 333``).

Examples
--------

.. .. dropdown:: 💡 Click to show/hide usage examples
..    :animate: fade-in

..    .. tab-set::

..       .. tab-item:: 📁 Case 1: Dump Header Info

..          Use ``dcm_dump_file`` when you need to inspect raw DICOM metadata, verify scanner settings (such as sequence names or TE/TR times), or troubleshoot files before running 4dfp conversion scripts.

..          .. note::
..             In all commands below, replace ``IM_0013.dcm`` with your actual file path or directory name (for example, ``/data/scan1.dcm`` or ``/data/DICOM``).

..          .. card:: 📥 Input Data
..             :class-card: sd-bg-light sd-border-1 mb-3

..             .. div:: card-help-top-right

..               :card-help:`You can inspect a single DICOM file or an entire directory. When given a directory, the tool recursively scans all subdirectories.`

..             DICOM files usually have a file extension of ``.dcm`` (or :term:`Siemens .IMA` when using Siemens scanners).

..             .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/ddf_c1_source_data.png
..                :alt: Source directory with nested sub-folders
..                :align: center
..                :width: 80%

..          .. tab-set::

..             .. tab-item:: ⚡ Command 1: Standard Display

..                Run the tool without flags to print all DICOM header tags directly to your terminal screen.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   dcm_dump_file IM_0013.dcm

..                **2. Terminal Output:**

..                .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd1/normal_dump_file.png
..                   :alt: Standard dcm_dump_file output
..                   :align: center
..                   :width: 70%

..             .. tab-item:: ⚡ Command 2: Formatted Display

..                Use the ``-f`` flag to format the output into clean, aligned text columns. This makes reading tag group numbers, descriptions, and values much easier.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   dcm_dump_file -f IM_0013.dcm

..                **2. Terminal Output:**

..                .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd2/f_option.png
..                   :alt: Formatted dcm_dump_file output
..                   :align: center
..                   :width: 70%

..       .. tab-item:: ⚠️ Common Errors
..          :class-label: tab-error

..          .. tab-set::

..             .. tab-item:: ❌ Not a DICOM File
..                :class-label: tab-error

..                This error occurs if you try to inspect a file that is not in DICOM format (such as a text log file, PDF report, or non-DICOM image).

..                **1. Execute Command:**

..                .. code-block:: bash

..                   dcm_dump_file not_a_DICOM.txt

..                **Error Output:**

..                The tool attempts to read the standard 128-byte preamble header. When it cannot find valid DICOM tags, it fails to open the file:

..                .. code-block:: text

..                   80092 DCM Illegal Stream Length (x) (Not enough data to define a full element) in readPreamble
..                   20092 DCM failed to open file: [file].[ext] in DCM_OpenFile

..                .. image:: /_static/tools/dicom_utilities/dcm_dump_file/errors/not_a_dicom.png
..                   :alt: Error output when trying to parse non-DICOM file
..                   :align: center

..             .. tab-item:: ❌ Path Does Not Exist
..                :class-label: tab-error

..                **Cause:** Providing a file or directory path that does not exist or contains a typo.

..                **Command Attempt:**

..                .. code-block:: bash

..                   dcm_dump_file raw_scan_folder

..                **Error Output:**

..                The tool attempts to locate the specified path. When it cannot find the directory, it outputs a failure message to the terminal screen and stops execution.

..                .. index:: DCM_OpenFile, failed to open file

..                .. code-block:: text

..                   20092 DCM failed to open file: raw_scan_folder in DCM_OpenFile

..                .. admonition:: Resolution
..                   :class: warning

..                   Check your file path for typos and confirm the directory exists before re-running the command. You can use ``ls`` to list folder contents in your current directory.

..             .. tab-item:: ❌ Flags Placed After Directory Arguments
..                :class-label: tab-error

..                **Cause:** Placing option flags (such as ``-f`` or ``-v``) after file or directory arguments instead of before them.

..                **Command Attempt:**

..                .. code-block:: bash

..                   dcm_dump_file DICOM -f

..                **Observed Behavior:**

..                The tool processes options from left to right. Any flag placed after a directory path is ignored as a flag and treated as an invalid file name. The script tries to open a file literally named ``-f`` and throws an open failure error.

..                .. code-block:: text

..                   20092 DCM failed to open file: -f in DCM_OpenFile

..                .. admonition:: Resolution
..                   :class: warning

..                   Always place option flags **before** any file or directory paths (use ``dcm_dump_file -f DICOM``).


