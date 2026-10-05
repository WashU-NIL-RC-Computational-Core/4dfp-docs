.. include:: ../../global.rst

.. _dcm_sort:

DICOM Sort
==========

.. rubric:: Script: ``dcm_sort``

Synopsis
--------

dcm_sort <DICOM_directory> [-d] [-c] [-t] [-i] [-e<ext>] [-r<str>] [-p<str>]

Description
-----------

Sorts DICOM files from the target directory into numbered subfolders named ``study<N>`` (such as ``study1``, ``study2``) in your current working directory (``$CWD``). 
The folder number **``<N>``** comes directly from the scan's **REL Series Number** (the acquisition sequence number assigned by the scanner). For example, DICOM files from Series 3 are placed into folder ``study3``. This ``study<N>`` folder layout is required by downstream 4dfp conversion tools.
You can provide either an absolute or relative directory path. By default, ``dcm_sort`` creates :term:`Symbolic Link` shortcuts to the original files rather than copying them.

.. note::
   This script only sorts files in the target directory. It does not search subdirectories recursively. For recursive sorting, see :ref:`pseudo_dcm_sort`.

This script uses :ref:`dcm_dump_file` to extract the following DICOM header fields:

* **ACQ Sequence Name**
* **ID Series Description**
* **PAT Patient Name** (used when filtering with the ``-p`` option)
* **REL Series Number** (scan sequence order number also used to name the ``study<N>`` folders)

This script generates :term:`\<dicom_directory\>.studies.txt` which uses the REL Series Number, ACQ Sequence Name, and ID Series Description.

.. important::
   * ``dcm_sort`` deletes existing single-study subdirectories (like ``study1``) in the current folder before sorting.
   * Files that cannot be classified are placed into the ``study0`` folder.

Usage
-----

.. list-table::
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-c``
     - Copies DICOM files to ``$CWD/[study #]`` instead of creating symbolic links.
   * - ``-d``
     - Enables verbose debug mode to display detailed log information.
   * - ``-e<ext>``
     - Filters DICOM files by extension before sorting. Do not include a period. Defaults to ``dcm``.
   * - ``-i``
     - Sorts DICOM files with integer file names.
   * - ``-p<str>``
     - Filters DICOM files by patient name in the ``PAT Patient Name`` field before sorting.
   * - ``-r<str>``
     - Filters DICOM files by matching the beginning of the filename. For example, ``-rtest`` matches files starting with "test".
   * - ``-t``
     - Disables the ``-t`` option when calling :ref:`dcm_dump_file`.

.. note::
   Do not add spaces between an option flag and its argument (for example, use ``-edcm``, not ``-e dcm``).

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
  :animate: fade-in

  .. tab-set::

    .. tab-item:: 📁 Case 1: Sort DICOMs

      When you receive raw DICOM data from an MRI scanner, the files are often placed together in a single folder. Before starting 4dfp image processing, use ``dcm_sort`` to organize these files into structured study directories.

      .. note::
         In all commands below, ``DICOM`` is used as an example folder name. Replace ``DICOM`` with your actual folder name or path (for example, ``raw_scans`` or ``/data/sub-01/mri``).
      
      .. card:: 📥 Input Data Structure
        :class-card: sd-bg-light sd-border-1 mb-3

        .. div:: card-help-top-right

          :card-help:`This test dataset mixes .dcm and .IMA files with custom prefixes to demonstrate command flags. Real scanner exports typically use only one file extension.`

        Ensure your source files are located directly in the working folder:

        .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/ds_c1_source_data.png
            :alt: Source directory containing DICOM files directly
            :align: center
            :width: 80%

      .. tab-set::

        .. tab-item:: ⚡Command 1: Standard Sort

          **1. Execute Command:**

          Run the standard command on your DICOM directory. By default, ``dcm_sort`` looks for files ending in ``.dcm``.

          .. code-block:: bash

              dcm_sort DICOM

          **2. Expected Output:**

          .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd1/dcm_sort_standard_run.png
              :alt: Expected terminal output for standard sort
              :align: center

          **3. Resulting Output Files:**

          .. grid:: 1 2 2 2
              :gutter: 2

              .. grid-item-card:: 📂 Updated Directory

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd1/parent_folder_output.png
                    :alt: Updated folder tree
                    :align: center

              .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                .. div:: card-help-top-right

                  :card-help:`term:<dicom_directory>.studies.txt`

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd1/dicom_studies_text.png
                    :alt: Contents of DICOM.studies.txt
                    :align: center

          .. note::

            By default, ``dcm_sort`` only processes ``.dcm`` files. It left the :term:`Siemens .IMA` file unsorted in the source folder.

        .. tab-item:: ⚡Command 2: Sort By Extension (`-e` Flag)

          **1. Execute Command:**

          If your scanner outputs files with a different extension (such as ``.IMA`` from a Siemens scanner), specify that extension using the ``-e`` flag.

          .. code-block:: bash

            dcm_sort -eIMA DICOM

          **2. Expected Output:**

          .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd2/e_flag_output.png
              :alt: Output showing formatted element fields
              :align: center

          .. grid:: 1 2 2 2
              :gutter: 2

              .. grid-item-card:: 📂 Updated Directory

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd2/e_flag_files.png
                    :alt: Updated folder tree
                    :align: center

              .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                .. div:: card-help-top-right

                  :card-help:`term:<dicom_directory>.studies.txt`

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd2/dicom_studies_txt.png
                    :alt: Contents of DICOM.studies.txt
                    :align: center

        .. tab-item:: ⚡Command 3: Sort By Root (`-r` Flag)

          **1. Execute Command:**

          If you only want to sort a specific set of files that start with a shared prefix (such as ``TEST``), use the ``-r`` flag.

          .. code-block:: bash

            dcm_sort -rTEST DICOM

          **2. Expected Output:**

          .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd3/r_flag_output.png
              :alt: Output showing formatted element fields
              :align: center

          .. grid:: 1 2 2 2
              :gutter: 2

              .. grid-item-card:: 📂 Updated Directory

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd3/r_flag_files.png
                    :alt: Updated folder tree
                    :align: center

              .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                .. div:: card-help-top-right

                  :card-help:`term:<dicom_directory>.studies.txt`

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd3/dicom_studies_txt.png
                    :alt: Contents of DICOM.studies.txt
                    :align: center

    .. tab-item:: ⚠️ Common Errors
        :class-label: tab-error

        .. tab-set::

          .. tab-item:: ❌ Files Placed into `study0` Folder
               :class-label: tab-error

               **Cause:** The script finds DICOM files that cannot be sorted into standard scan series. This usually happens when files are missing essential header tags (like the ``REL Series Number``) or when non-image files (such as secondary capture reports, screen grabs, or scanner logs) are saved in DICOM format.

               **Observed Behavior:**

               The script creates a subfolder named ``study0`` alongside your normal ``study1``, ``study2``, etc. folders, and moves all unclassifiable or unreadable files into it.

               .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 📂 Standard Series
                     :class-card: sd-bg-light sd-border-1

                     Valid scan series are placed into ``study1/``, ``study2/``, etc.

                  .. grid-item-card:: 📂 Unclassifiable Files
                     :class-card: sd-bg-light sd-border-1

                     Secondary reports, logs, or corrupted header files go into ``study0/``.

               .. admonition:: Resolution
                  :class: warning

                  Inspect the contents of ``study0``. If the files are secondary reports or log files, you can safely ignore or remove them. If they are actual scan images, inspect their headers using :ref:`dcm_dump_file` to determine why required header tags are missing.

          .. tab-item:: ❌ Sorting Non-DICOM File
            :class-label: tab-error

              This error happens if you try to sort non-DICOM files (such as text files or PDF reports) or pass an extension flag for files that do not contain valid DICOM headers.

              .. code-block:: bash

                dcm_sort -etxt DICOM

              **Error Output:**

              .. code-block:: text

                  string: Subscript out of range.

              .. image:: /_static/scripts/dicom_utilities/dcm_sort/errors/non_dicom.png
                :alt: Error output
                :align: center

          .. tab-item:: ❌ Incomplete Sort: Target Directory Contains Subfolders
            :class-label: tab-error

              **Cause:** Running ``dcm_sort`` on a directory where DICOM files are stored inside subfolders (such as ``DICOM/001/`` or ``DICOM/series1/``) rather than directly in the target folder.

              **Command Attempt:**

              .. code-block:: bash

                dcm_sort DICOM

              **Observed Behavior:**

              Because ``dcm_sort`` only checks for files sitting directly inside the target directory, it skips all subdirectories. It finds zero DICOM files to process, creates an empty ``DICOM.studies.txt`` file, and creates no ``study<N>`` folders.

              .. code-block:: text

                  total number of dicom files=0
                  number of studies=0
                  sorting 0 dicom files
              
              .. image:: /_static/scripts/dicom_utilities/dcm_sort/errors/sort_dir_that_is_not_flat.png
                :alt: Terminal output showing skipped subdirectories and zero DICOM files sorted
                :align: center

              .. admonition:: Resolution
                :class: warning

                If your DICOM files are stored inside subdirectories, use :ref:`pseudo_dcm_sort` to handle nested folder structures.

          .. tab-item:: ❌ Syntax Error: Space Between Flag and Argument
                :class-label: tab-error

                  **Cause:** Adding a space between an option flag and its argument value (for example, typing ``-e IMA`` instead of ``-eIMA``).

                  **Command Attempt:**

                  .. code-block:: bash

                      dcm_sort -e IMA DICOM

                  **Observed Behavior:**

                  The script fails to parse the file extension correctly. It treats ``IMA`` as a separate directory argument rather than an extension filter, causing an error when it cannot locate a folder named ``IMA``.

                  .. image:: /_static/scripts/dicom_utilities/dcm_sort/errors/space_in_flag_error.png
                      :alt: Terminal error message caused by adding a space between flag and argument
                      :align: center

                  .. admonition:: Resolution
                      :class: warning

                      Remove any space between the flag letter and its value (use ``-eIMA``, not ``-e IMA``). Note that this is the opposite of :ref:`dcm_dump_file`, which requires a space before flag arguments.

          .. tab-item:: ⚠️ Existing Study Folders Overwritten
            :class-label: tab-error

              **Cause:** Running a sort script in a directory where you previously ran a sort and saved custom files, converted 4dfp images, or analysis notes inside the ``study<N>`` folders.

              **Observed Behavior:**

              The sorting scripts automatically delete existing single-study subdirectories (such as ``study1`` or ``study2``) before creating new links. Any non-DICOM files or converted data stored inside those subfolders will be deleted.

              .. danger::
                Always move converted 4dfp files, analysis outputs, or notes outside of the ``study<N>`` folders before re-running a DICOM sort.

              .. admonition:: Resolution
                :class: warning

                If you need to re-sort your DICOM files, copy any custom files or converted data to a safe backup directory outside of the target folder first.
