.. _dcm_dump_file:

DICOM Dump File
====================
.. rubric:: Tool: ``dcm_dump_file``

Synopsis
--------

dcm_dump_file [[-b] [-e] [-E] [-f] [-g] [-l] [-L] [-m <mult>] [-t] [-v] [-w <flag>] [-z]] <file_or_directory> [<file_or_directory> ...]

Description
-----------

Inspect and display the internal header metadata of DICOM files provided via absolute or relative paths. The tool accepts individual DICOM files, multiple files, or directory locations as input. When a directory path is provided, 
dcm_dump_file recursively scans all sub-directories to process every file found.

This tool prints human-readable DICOM attributes—such as patient demographic data, scanner acquisition settings, and study/series identification tags—directly to the terminal screen (stdout). 
Raw binary image pixel data is summarized by tag structure and byte length rather than printed in raw form.

.. important::	Options used must be placed before any file, files, or directory provided. Options placed after will be ignored and treated as invalid file names.

Usage
-----

.. list-table::
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-b``
     - Read data using Big-Endian byte order (common in older Unix or Mac systems).
   * - ``-e``
     - Exit the program immediately if a file fails to open, skipping any remaining files.
   * - ``-E``
     - Process files using DICOM Part 10 format with eFilm workstation compatibility.
   * - ``-f``
     - Format the output into clean, aligned text columns for easier reading.
   * - ``-g``
     - Ignore group length attributes (useful when processing files with corrupted size markers).
   * - ``-l``
     - Use the retired length-to-end attribute to calculate overall object size.
   * - ``-L``
     - Read data using Explicit Little-Endian byte order (standard PC format with labeled data types).
   * - ``-m <mult>``
     - Limit the number of displayed items for repeated data fields (for example, ``-m 5`` shows only the first 5 entries).
   * - ``-t``
     - Parse files using DICOM Part 10 standards while ignoring minor data type mismatches.
   * - ``-v``
     - Enable verbose logging to display detailed technical updates during processing.
   * - ``-w <flag>``
     - Enable advanced file opening options (for example, ``-w REPEAT`` allows files containing duplicate tags).
   * - ``-z``
     - Perform automated format conversion and data verification on header attributes.

.. note::	Options that require values MUST have a space between the option and it's value.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. code-block:: bash

      dcm_sort /path/to/DICOM_dir -d -c -t -i -edcm -rtest -pDOE^JOHN

   .. image:: /_static/DICOM_utilities/test.png