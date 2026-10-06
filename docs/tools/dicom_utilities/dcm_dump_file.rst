.. _dcm_dump_file:

DICOM Dump File
===============
.. rubric:: Tool: ``dcm_dump_file``

Synopsis
--------

dcm_dump_file [-b] [-e] [-E] [-f] [-g] [-l] [-L] [-m <mult>] [-t] [-v] [-w <flag>] [-z] <file_or_directory> [<file_or_directory> ...]

Description
-----------

Inspects and prints the internal :term:`DICOM Header` metadata of DICOM files. You can provide paths to single files, multiple files, or entire directories. When given a directory path, ``dcm_dump_file`` searches through all subdirectories to process every file it finds.

This tool prints readable scanner information (such as patient details, scanner acquisition settings, and study or series numbers) directly to your terminal screen. Instead of printing raw image pixels, it displays a summary of the image data size and structure.

Higher-level 4dfp scripts, like :ref:`dcm_sort`, use ``dcm_dump_file`` behind the scenes to read image header tags.

.. important::
   Place all option flags **before** any file or directory arguments. Flags placed after file names are ignored and treated as invalid file paths.

Usage
-----

.. list-table::
   :widths: 15 60
   :header-rows: 1

   * - Flag
     - Description
   * - ``-b``
     - Reads data using :term:`Big-Endian` byte order (used in older imaging systems).
   * - ``-e``
     - Exits immediately on file open failure, skipping remaining files.
   * - ``-E``
     - Processes files using :term:`DICOM Part 10` format with eFilm workstation compatibility.
   * - ``-f``
     - Formats stdout into clean, aligned text columns for easier reading.
   * - ``-g``
     - Ignores group length attributes (useful for files with corrupted size markers).
   * - ``-l``
     - Uses retired length-to-end attributes to calculate overall file size.
   * - ``-L``
     - Reads data using :term:`Explicit Little-Endian` byte order (standard PC format).
   * - ``-m <mult>``
     - Limits displayed items for repeated data fields (e.g., ``-m 5`` displays first 5 entries).
   * - ``-t``
     - Parses files using :term:`DICOM Part 10` standards while ignoring minor type mismatches.
   * - ``-v``
     - Enables verbose logging to display detailed technical updates during processing.
   * - ``-w <flag>``
     - Enables advanced file opening options (e.g., ``-w REPEAT`` permits duplicate tags).
   * - ``-z``
     - Performs automated format conversion and data verification on header attributes.

.. note:: 
   If a file fails to open initially, ``dcm_dump_file`` automatically retries parsing with the ``-t`` flag enabled.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 📁 Case 1: Dump Header Info

         Use ``dcm_dump_file`` when you need to inspect raw DICOM metadata, verify scanner settings (such as sequence names or TE/TR times), or troubleshoot files before running 4dfp conversion scripts.

         .. note::
            In all commands below, replace ``<file_or_directory>`` with your actual file path or directory name (for example, ``/data/scan1.dcm`` or ``/data/DICOM``).

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

              :card-help:`You can inspect a single DICOM file or an entire directory. When given a directory, the tool recursively scans all subdirectories.`

            DICOM files usually have a file extension of ``.dcm`` (or :term:`Siemens IMA` when using Siemens scanners).

            .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/ddf_c1_source_data.png
               :alt: Source directory with nested sub-folders
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡ Command 1: Standard Display

               Run the tool without flags to print all DICOM header tags directly to your terminal screen.

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_dump_file <file_or_directory>

               **2. Terminal Output:**

               .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd1/normal_dump_file.png
                  :alt: Standard dcm_dump_file output
                  :align: center
                  :width: 70%

            .. tab-item:: ⚡ Command 2: Formatted Display

               Use the ``-f`` flag to format the output into clean, aligned text columns. This makes reading tag group numbers, descriptions, and values much easier.

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_dump_file -f <file_or_directory>

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