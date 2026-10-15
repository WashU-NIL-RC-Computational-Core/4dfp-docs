.. _imgreg_4dfp:

Image Registration
==================
.. rubric:: Tool: ``imgreg_4dfp``

Synopsis
--------

imgreg_4dfp target_imag target_mask source_imag source_mask t4file mode
	imgreg_4dfp target_imag        none source_imag source_mask t4file mode
	imgreg_4dfp target_imag        none source_imag        none t4file mode

Description
-----------

compute transform (various modes)

Usage
-----

1		enable coordinate transform
2		enable 3D alignment
4		enable affine warp (12 parameters in 3D 6 parameters in 2D)
8		enable voxel size adjust
16		disable x voxel size adjust
32		disable y voxel size adjust
64		disable z voxel size adjust
128		unassigned
256		when set use difference image minimization (for similar contrast mechanisms)
512		superfine mode (2 mm cubic grid metric sampling)
1024	fast mode (12 mm cubic grid metric sampling)
2048	fine mode (5 mm cubic grid metric sampling)
4096	[T] restricted to translation explored at 7.5 mm intervals
8192	enable parameter optimization by computation of the metric gradient in parameter space and inversion of the Hessian

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