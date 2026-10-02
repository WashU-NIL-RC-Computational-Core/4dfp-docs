.. include:: ../../global.rst

.. _pseudo_dcm_sort:

Pseudo DICOM Sort
=================
.. rubric:: Script: ``pseudo_dcm_sort.csh``

Synopsis
--------

pseudo_dcm_sort <DICOM_directory> [-d] [-s] [-e<ext>] [-r<str>] [-i] [-t]

Description
-----------

Will search sub-directories of the <DICOM_directory> path provided and sort. The DICOMs will be symbollically linked and sorted in $CWD/[study #].
A corresponding output file will be generated and named ``<DICOM_directory>.studies.txt``. Flat directory sorting is handled by :ref:`dcm_sort`.

This script makes use of :ref:`dcm_dump_file` to read the following:
  - ACQ Sequence Name
  - ID Series Description

.. important::	DICOM subdirectories must be numeric
.. important::	default subdirectory of numeric subdirectory is 'DICOM'

Usage
-----

.. list-table::
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-d``
     - Verbose debug mode.
   * - ``-e<ext>``
     - Filter files sorted by specified file extension before sorting. Do not include ".". **Defaulted to dcm**.
   * - ``-i``
     - Sorts files with Integer file names.
   * - ``-r<str>``
     - Sorts files by the "root" of the word. -rtest will find files starting with "test". **Defaulted to MR***.
   * - ``-s``
     - Searches for DICOM files 1 sub-directory below the numeric sub-directory. Looks for "DICOM" first. If "DICOM" does not exist, there must only be one sub-directory, but it can be any name.
   * - ``-t``
     - Toggle OFF use of -t in call to dcm_dump_file.

.. note::	Remove any whitespace between the option and the option's argument.

.. note:: Override the default ``-edcm`` with ``-eZZZ`` when using ``-i`` or ``-r`` to avoid sorting all ``.dcm`` files.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 📁 Case 1: DICOMs in Root Directory

         .. card:: 📥 Input Data Structure
            :class-card: sd-bg-light sd-border-1 mb-3

            Ensure your source files are located directly in the working folder:

            .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/pds_c1_source_data.png
               :alt: Source directory containing DICOM files directly
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡Command 1: Standard Sort

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_sort /path/to/DICOM_dir -d -c -t -i -rtest -pDOE^JOHN

               **2. Expected Output:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/studies_output.png
                  :alt: Expected terminal output for standard sort
                  :align: center

            .. tab-item:: ⚡Command 2: Tag Dump (`-e` Flag)

               **1. Execute Command:**

               .. code-block:: bash

                  dcm_sort /path/to/DICOM_dir -d -c -t -i -edcm -rtest -pDOE^JOHN

               **2. Expected Output:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/use_e_flag.png
                  :alt: Output showing formatted element fields
                  :align: center

      .. tab-item:: 📁 Case 2: DICOMs in Sub-directories

         .. card:: 📥 Input Data Structure
            :class-card: sd-bg-light sd-border-1 mb-3

            DICOM files are nested inside one or more sub-folders:

            .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/pds_c2_source_data.png
               :alt: Source directory with nested sub-folders
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡Command 1: Recursive Search (`-s`)

              **1. Execute Command:**

              .. code-block:: bash

                  pseudo_dcm_sort.csh -s DICOM

              **2. Terminal Output:**

              .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/run_command.png
                  :alt: Terminal stdout log
                  :align: center
                  :width: 70%

              .. note::

                  Look for ``1 DICOM files found in..`` to verify the operation succeeded.

              **3. Resulting Output Files:**

              .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 📂 Updated Directory

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/sorted_output.png
                        :alt: Updated folder tree
                        :align: center

                  .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/DICOM_studies_txt.png
                        :alt: Contents of DICOM.studies.txt
                        :align: center

      .. tab-item:: ⚠️ Common Errors
         :class-label: tab-error

         .. tab-set::

            .. tab-item:: ❌ Error Scenario 1: Missing -s Option
               :class-label: tab-error

                  **Cause:** Running without specifying matching Subject/Session tags returns incomplete sorts:

                  .. code-block:: bash

                     pseudo_dcm_sort.csh DICOM

                  **Error Output:**

                  .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/did_not_use_s_option.png
                     :alt: Missing -s flag
                     :align: center

                  .. admonition:: Resolution
                     :class: warning

                     When there are sub-directories nested within the numeric directories, you must use the ``-s`` option.

            .. tab-item:: ❌ Multiple Sub-directories Neither Named "DICOM"
               :class-label: tab-error

               **Cause:** Executing the sort command without the mandatory ``-p`` flag causes the script to abort:

               .. code-block:: bash

                  pseduo_dcm_sort -s DICOM

               **Error Input:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/multiple_dir_in_subdir.png
                  :alt: Multiple directories in sub-directory
                  :align: center

               **Error Output:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/multiple_sub_dir_under_numeric.png
                  :alt: Multiple directories in sub-directory Output
                  :align: center

               .. admonition:: Resolution
                  :class: warning

                  Rename the folder with the DICOMs to "DICOM".