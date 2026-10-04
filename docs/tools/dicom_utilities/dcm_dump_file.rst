.. _dcm_dump_file:

DICOM Dump File
===============
.. rubric:: Tool: ``dcm_dump_file``

Synopsis
--------

dcm_dump_file [-b] [-e] [-E] [-f] [-g] [-l] [-L] [-m <mult>] [-t] [-v] [-w <flag>] [-z] <file_or_directory> [<file_or_directory> ...]

Description
-----------

Inspect and display the internal header metadata of DICOM files provided via absolute or relative paths. The tool accepts individual DICOM files, multiple files, or directory locations as input. When a directory path is provided, 
``dcm_dump_file`` recursively scans all sub-directories to process every file found.

This tool prints human-readable DICOM attributes—such as patient demographic data, scanner acquisition settings, and study/series identification tags—directly to stdout. Raw binary image pixel data is summarized by tag structure and byte length rather than printed in raw form.

.. important:: 
   Options used must be placed **before** any file or directory arguments. Options placed after will be ignored and treated as invalid file names.

Usage
-----

.. list-table::
   :widths: 15 60
   :header-rows: 1

   * - Flag
     - Description
   * - ``-b``
     - Read data using :term:`Big-Endian` byte order (common in legacy systems).
   * - ``-e``
     - Exit immediately on file open failure, skipping remaining files.
   * - ``-E``
     - Process files using :term:`DICOM Part 10` format with eFilm workstation compatibility.
   * - ``-f``
     - Format stdout into clean, aligned text columns for easier reading.
   * - ``-g``
     - Ignore group length attributes (useful for files with corrupted size markers).
   * - ``-l``
     - Use retired length-to-end attributes to calculate overall object size.
   * - ``-L``
     - Read data using :term:`Explicit Little-Endian` byte order (standard PC format).
   * - ``-m <mult>``
     - Limit displayed items for repeated data fields (e.g., ``-m 5`` displays first 5 entries).
   * - ``-t``
     - Parse files using :term:`DICOM Part 10` standards while ignoring minor type mismatches.
   * - ``-v``
     - Enable verbose logging to display detailed technical updates during processing.
   * - ``-w <flag>``
     - Enable advanced file opening options (e.g., ``-w REPEAT`` permits duplicate tags).
   * - ``-z``
     - Perform automated format conversion and data verification on header attributes.

.. note:: 
   Options that require values **MUST** have a space between the option and its value (e.g., ``-m 5``).

.. note:: 
   If a file fails to open initially, ``dcm_dump_file`` automatically retries parsing with the ``-t`` flag enabled.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 📁 Case 1: Dump Header Info

         .. card:: 📥 Input Data
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

              :card-help:`Hover over image or click to inspect DICOM source directory structure`

            DICOM files usually have a file extension of ``.dcm`` (or :term:`Siemens .IMA` when using Siemens scanners).

            .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/ddf_c1_source_data.png
               :alt: Source directory with nested sub-folders
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡ Command 1: Standard Display

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_dump_file <file_or_directory>

               **2. Terminal Output:**

               .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd1/normal_dump_file.png
                  :alt: Standard dcm_dump_file output
                  :align: center
                  :width: 70%

            .. tab-item:: ⚡ Command 2: Formatted Display

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

            .. tab-item:: ❌ Error Scenario 1: Not a DICOM File
               :class-label: tab-error

               **Cause:** Executing ``dcm_dump_file`` against a non-DICOM file:

               .. code-block:: bash

                  dcm_dump_file not_a_DICOM.txt

               **Error Output:**

               .. index:: 80092, 20092, readPreamble, Illegal Stream Length, DCM_OpenFile

               .. code-block:: text

                  80092 DCM Illegal Stream Length (x) (Not enough data to define a full element) in readPreamble
                  20092 DCM failed to open file: [file].[ext] in DCM_OpenFile

               .. image:: /_static/tools/dicom_utilities/dcm_dump_file/errors/not_a_dicom.png
                  :alt: Error output when trying to parse non-DICOM file
                  :align: center