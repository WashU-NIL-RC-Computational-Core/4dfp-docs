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

Sort the DICOM files in the directory <DICOM_directory> path provided either by absolute or relative pathing. The DICOMs will be symbollically linked and sorted in $CWD/[study #]. 
A corresponding output file will be generated and named ``<DICOM_directory>.studies.txt``. This script does not recursively sort sub-directories; for recursive subdirectory sorting reference :ref:`pseudo_dcm_sort`

This script makes use of :ref:`dcm_dump_file` to read the following:
  - ACQ Sequence Name
  - ID Series Description
  - PAT Patient Name (if -p option is used)
  - REL Series Number

.. important::	dcm_sort removes existing single study subdirectories

.. important::	dcm_sort puts unclassifiable DICOMs into subdirectory study0

Usage
-----

.. list-table::
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-c``
     - Copy the files from <DICOM_directory> to $CWD/study/[Study #] instead of symbollically linking.
   * - ``-d``
     - Verbose debug mode.
   * - ``-e<ext>``
     - Filter files sorted by specified file extension before sorting. Do not include ".". **Defaulted to dcm**
   * - ``-i``
     - Sorts files with Integer file names.
   * - ``-p<str>``
     - Filters DICOMs by Patient Name in the 'PAT Patient Name' field before sorting.
   * - ``-r<str>``
     - Sorts files by the "root" of the word. -rtest will find files starting with "test".
   * - ``-t``
     - Toggle OFF use of -t in call to dcm_dump_file.

.. note::	Remove any whitespace between the option and the option's argument.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
  :animate: fade-in

  .. tab-set::

    .. tab-item:: 📁 Case 1: Sort DICOMs

      .. card:: 📥 Input Data Structure
        :class-card: sd-bg-light sd-border-1 mb-3

        .. div:: card-help-top-right

          :card-help:`Hover over image or click to inspect DICOM source directory structure`

        Ensure your source files are located directly in the working folder:

        .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/ds_c1_source_data.png
            :alt: Source directory containing DICOM files directly
            :align: center
            :width: 80%

      .. tab-set::

        .. tab-item:: ⚡Command 1: Standard Sort

          **1. Execute Command:**

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

                  :card-help:`term:DICOM.studies.txt`

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd1/dicom_studies_text.png
                    :alt: Contents of DICOM.studies.txt
                    :align: center

          .. note::

            ``dcm_sort`` did not sort the :term:`Siemens .IMA` file by default.

        .. tab-item:: ⚡Command 2: Sort By Extension (`-e` Flag)

          **1. Execute Command:**

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

                  :card-help:`term:DICOM.studies.txt`

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd2/dicom_studies_txt.png
                    :alt: Contents of DICOM.studies.txt
                    :align: center

        .. tab-item:: ⚡Command 3: Sort By Root (`-r` Flag)

          **1. Execute Command:**

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

                  :card-help:`term:DICOM.studies.txt`

                .. image:: /_static/scripts/dicom_utilities/dcm_sort/case1/cmd3/dicom_studies_txt.png
                    :alt: Contents of DICOM.studies.txt
                    :align: center

    .. tab-item:: ⚠️ Common Errors
        :class-label: tab-error

        .. tab-set::

          .. tab-item:: ❌ Error Scenario 1: Sorting Non-DICOM File
            :class-label: tab-error

              Running an attempt to sort files that are not DICOMs:

              .. code-block:: bash

                dcm_sort -etxt DICOM

              **Error Output:**

              .. image:: /_static/scripts/dicom_utilities/dcm_sort/errors/non_dicom.png
                :alt: Error output
                :align: center
