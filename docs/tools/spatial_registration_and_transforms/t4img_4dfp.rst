.. _t4img_4dfp:

Transform 4dfp Image (Single Volume)
===================================
.. rubric:: Tool: ``t4img_4dfp``

Synopsis
--------

t4img_4dfp <t4file> <imgfile> [<outfile>] [-B] [-d] [-N] [-n] [-R] [-s] [-z] [-O<outspace>] [-@<endian>]

Description
-----------

Convenience C-shell wrapper around :ref:`t4imgs_4dfp` designed for transforming a single 4dfp image volume. Instead of manually creating a list text file (``<inlist>``), ``t4img_4dfp`` automatically builds a temporary single-line list file, runs ``t4imgs_4dfp``, formats the provenance record log (``.rec`` file), and cleans up temporary files upon completion.

If no output root name (``<outfile>``) is specified, ``t4img_4dfp`` defaults to naming the output file ``<imgfile>t`` (appending a ``t`` to the input image root name). Setting ``<t4file>`` to ``none`` applies an identity transform (no spatial shift or rotation).

.. rubric:: Script Workflow & Header Preservation

1. **Automatic List Generation**: Creates a temporary list file containing ``<imgfile> t4=<t4file>``.
2. **Execution**: Invokes ``t4imgs_4dfp`` with all user-supplied command-line option flags.
3. **Record Log Update**: Formats ``<outfile>.4dfp.img.rec`` to log the exact wrapper command, execution timestamp, user account, version string, and full resampling history.
4. **ROI Region Name Transfer (``-n`` Flag)**: When nearest-neighbor mode (``-n``) is active, ``t4img_4dfp`` automatically extracts FIDL ROI region names (``grep "region names"``) from the input header file (``<imgfile>.4dfp.ifh``) and appends them to the output header file (``<outfile>.4dfp.ifh``).

.. note::
   Filename extensions (``.4dfp.img``, ``.img``, ``.4dfp``) are optional on positional command-line arguments and are stripped automatically.

Usage
-----

.. list-table::
   :widths: 18 62
   :header-rows: 1

   * - Flag / Argument
     - Description
   * - ``-B``
     - Converts input transformation matrix from Washington University 711-2A atlas space to 711-2B atlas space.
   * - ``-d``
     - Enables shell script debug mode (prints argument counts, active options, and flag statuses to terminal).
   * - ``-N``
     - Assigns IEEE 754 ``NaN`` (Not-a-Number) values to unmapped background voxels instead of ``0.0``.
   * - ``-n``
     - Enables 3D nearest-neighbor interpolation (preserves discrete region labels) and copies FIDL ROI region names from input ``.ifh`` header to output ``.ifh`` header.
   * - ``-R``
     - Suppresses creation of the ``.rec`` history log file.
   * - ``-s``
     - Enables 3D cubic spline interpolation for smooth voxel resampling.
   * - ``-z``
     - Normalizes voxel totals by :math:`\sqrt{N}` instead of total weight :math:`N` (for statistical Z-score maps).
   * - ``-O111``
     - Resamples output to 1mm isotropic atlas space (:math:`176 \times 208 \times 176` grid).
   * - ``-O222``
     - Resamples output to 2mm isotropic atlas space (:math:`128 \times 128 \times 75` grid).
   * - ``-O333[.n]``
     - Resamples output to 3mm isotropic atlas space (:math:`48 \times 64 \times 48` grid, default). Adding a decimal offset (e.g., ``-O333.8``) shifts the Y-axis center.
   * - ``-O<image>``
     - Copies spatial grid dimensions, voxel spacing, and origin centers from a reference image header (``<image>.4dfp.ifh``).
   * - ``-@<b|l>``
     - Forces output binary write format to Big-Endian (``-@b``) or Little-Endian (``-@l``).

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


