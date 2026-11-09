.. _t4imgs_4dfp:

t4imgs_4dfp
===========

.. rubric:: Tool: ``t4imgs_4dfp``

Synopsis
--------

t4imgs_4dfp <inlist> <outroot> [-B] [-N] [-n] [-R] [-s] [-z] [-O<space>] [-@<endian>]

Description
-----------

Resamples, spatially aligns, and combines 4dfp image volumes using 3D affine transformation matrices (``.t4`` files). It can transform a single 3D or 4D volume, or calculate a normalized, weighted average across a stack of multiple images specified in an input text file (``<inlist>``).

During execution, ``t4imgs_4dfp`` reads each input image frame-by-frame, maps its voxel coordinates into the chosen target space, applies optional spatial masks and slice bounds, and interpolates pixel intensities onto the target grid.

.. rubric:: Input List File Syntax

The input list file (``<inlist>``) is a plain text file containing target image specifications, one per line. Blank lines and text following a ``#`` symbol are ignored as comments. Each line supports the following key-value tokens:

* ``<image>`` or ``img=<file>`` — Root name of the 4dfp input image (appends ``.4dfp.img``).
* ``t4=<file>`` — Path to the 3D affine transformation matrix file (e.g., ``T4_file.t4``). If omitted, an identity matrix (no spatial shift/rotation) is used.
* ``mask=<file>`` — Path to a binary mask image used to isolate valid brain voxels.
* ``scale=<val>`` — Intensity multiplier applied to voxel values (default is ``1.0``).
* ``weight=<val>`` — Averaging weight factor applied when combining stacked images (default is ``1.0``).
* ``slices=<lo>to<hi>`` or ``slices=<val>`` — Restricts spatial processing to a specific Z-slice range (voxels outside this range are zeroed out).

.. rubric:: Resampling & Interpolation Engines

``t4imgs_4dfp`` supports three distinct spatial interpolation modes:

1. **Trilinear Interpolation (Default)**: Evaluates non-integer sub-voxel coordinates using standard 8-neighbor 3D linear weighting (via ``ft4imgo``).
2. **3D Cubic Spline (``-s``)**: Computes smooth third-order polynomial interpolations using pre-calculated 2nd-derivative tables along the X, Y, and Z axes (via ``ft4ixyz`` and ``spline3d``).
3. **Nearest-Neighbor (``-n``)**: Maps points directly to the closest discrete source voxel index without spatial blending (via ``ft4imgn``). This preserves exact integer region IDs when transforming categorical atlas masks or ROI label maps.

.. rubric:: Outputs & Generated Files

* **Binary Image Data**: Writes ``<outroot>.4dfp.img`` containing single-precision floating-point voxel data.
* **Header Metadata**: Automatically calls ``writeifhmce`` to output the accompanying ``<outroot>.4dfp.ifh`` header file.
* **Analyze Conversion**: Executes the system utility ``ifh2hdr`` to generate paired Analyze standard format headers (``.hdr``).
* **Provenance Record**: Unless suppressed with ``-R``, creates ``<outroot>.4dfp.img.rec``, logging runtime options, coordinate parameters, and the complete text contents of ``<inlist>``.

.. important::
   Place all option flags **before** positional arguments (``<inlist>`` and ``<outroot>``). Options combined directly with other arguments or placed after file parameters will fail to parse correctly.

Usage
-----

.. list-table::
   :widths: 18 62
   :header-rows: 1

   * - Flag
     - Description
   * - ``-B``
     - Converts input transformation matrices from Washington University 711-2A atlas space to 711-2B atlas space prior to resampling.
   * - ``-N``
     - Assigns IEEE 754 ``NaN`` (Not-a-Number) values to unmapped or background voxels (weight = 0) instead of the default value ``0.0``.
   * - ``-n``
     - Enables 3D nearest-neighbor interpolation instead of linear blending. Preserves discrete integer values for label maps and binary masks.
   * - ``-R``
     - Suppresses creation of the ``.rec`` history log file.
   * - ``-s``
     - Enables 3D cubic spline interpolation for smooth voxel resampling.
   * - ``-z``
     - Normalizes accumulated voxel totals by :math:`\sqrt{\sum w}` instead of total weight :math:`\sum w`. Designed specifically for combining statistical Z-score maps.
   * - ``-O111``
     - Resamples output to 1mm isotropic atlas space (:math:`176 \times 208 \times 176` grid, :math:`1.0\text{ mm}^3` voxels).
   * - ``-O222``
     - Resamples output to 2mm isotropic atlas space (:math:`128 \times 128 \times 75` grid, :math:`2.0\text{ mm}^3` voxels).
   * - ``-O333[.n]``
     - Resamples output to 3mm isotropic atlas space (:math:`48 \times 64 \times 48` grid, :math:`3.0\text{ mm}^3` voxels, default). Adding a decimal offset (e.g., ``-O333.8``) shifts the Y-axis center by :math:`n` voxels.
   * - ``-O<image>``
     - Adopts spatial grid dimensions, voxel dimensions, origin centers, and orientation directly from a reference header file (``<image>.4dfp.ifh``).
   * - ``-@<endian>``
     - Forces output binary write format to Big-Endian (``-@b``) or Little-Endian (``-@l``), overriding CPU hardware auto-detection.

.. note::
   When nearest-neighbor interpolation (``-n``) is active, intensity scaling parameters stored inside ``.t4`` header comments are automatically ignored to protect integer label integrity.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 📁 Case 1: Dump Header Info

         Use ``dcm_dump_file`` when you need to inspect raw DICOM metadata, verify scanner settings (such as sequence names or TE/TR times), or troubleshoot files before running 4dfp conversion scripts.

         .. note::
            In all commands below, replace ``IM_0013.dcm`` with your actual file path or directory name (for example, ``/data/scan1.dcm`` or ``/data/DICOM``).

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

              :card-help:`You can inspect a single DICOM file or an entire directory. When given a directory, the tool recursively scans all subdirectories.`

            DICOM files usually have a file extension of ``.dcm`` (or :term:`Siemens .IMA` when using Siemens scanners).

            .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/ddf_c1_source_data.png
               :alt: Source directory with nested sub-folders
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡ Command 1: Standard Display

               Run the tool without flags to print all DICOM header tags directly to your terminal screen.

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_dump_file IM_0013.dcm

               **2. Terminal Output:**

               .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd1/normal_dump_file.png
                  :alt: Standard dcm_dump_file output
                  :align: center
                  :width: 70%

            .. tab-item:: ⚡ Command 2: Formatted Display

               Use the ``-f`` flag to format the output into clean, aligned text columns. This makes reading tag group numbers, descriptions, and values much easier.

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_dump_file -f IM_0013.dcm

               **2. Terminal Output:**

               .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd2/f_option.png
                  :alt: Formatted dcm_dump_file output
                  :align: center
                  :width: 70%

      .. tab-item:: ⚠️ Common Errors
         :class-label: tab-error

         .. tab-set::

            .. tab-item:: ❌ Not a DICOM File
               :class-label: tab-error

               This error occurs if you try to inspect a file that is not in DICOM format (such as a text log file, PDF report, or non-DICOM image).

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_dump_file not_a_DICOM.txt

               **Error Output:**

               The tool attempts to read the standard 128-byte preamble header. When it cannot find valid DICOM tags, it fails to open the file:

               .. code-block:: text

                  80092 DCM Illegal Stream Length (x) (Not enough data to define a full element) in readPreamble
                  20092 DCM failed to open file: [file].[ext] in DCM_OpenFile

               .. image:: /_static/tools/dicom_utilities/dcm_dump_file/errors/not_a_dicom.png
                  :alt: Error output when trying to parse non-DICOM file
                  :align: center

            .. tab-item:: ❌ Path Does Not Exist
               :class-label: tab-error

               **Cause:** Providing a file or directory path that does not exist or contains a typo.

               **Command Attempt:**

               .. code-block:: bash

                  dcm_dump_file raw_scan_folder

               **Error Output:**

               The tool attempts to locate the specified path. When it cannot find the directory, it outputs a failure message to the terminal screen and stops execution.

               .. index:: DCM_OpenFile, failed to open file

               .. code-block:: text

                  20092 DCM failed to open file: raw_scan_folder in DCM_OpenFile

               .. admonition:: Resolution
                  :class: warning

                  Check your file path for typos and confirm the directory exists before re-running the command. You can use ``ls`` to list folder contents in your current directory.

            .. tab-item:: ❌ Flags Placed After Directory Arguments
               :class-label: tab-error

               **Cause:** Placing option flags (such as ``-f`` or ``-v``) after file or directory arguments instead of before them.

               **Command Attempt:**

               .. code-block:: bash

                  dcm_dump_file DICOM -f

               **Observed Behavior:**

               The tool processes options from left to right. Any flag placed after a directory path is ignored as a flag and treated as an invalid file name. The script tries to open a file literally named ``-f`` and throws an open failure error.

               .. code-block:: text

                  20092 DCM failed to open file: -f in DCM_OpenFile

               .. admonition:: Resolution
                  :class: warning

                  Always place option flags **before** any file or directory paths (use ``dcm_dump_file -f DICOM``).


