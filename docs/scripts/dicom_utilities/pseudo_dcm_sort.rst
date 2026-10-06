.. _pseudo_dcm_sort:

Pseudo DICOM Sort
=================
.. rubric:: Script: ``pseudo_dcm_sort.csh``

Synopsis
--------

pseudo_dcm_sort.csh <DICOM_directory> [-d] [-s] [-e<ext>] [-r<str>] [-i] [-t]

Description
-----------

Searches nested subdirectories inside the target directory and sorts DICOM files into numbered ``study<N>`` subfolders in your current working directory.
Use ``pseudo_dcm_sort.csh`` when your raw data is organized into numeric subject or session folders (such as ``001/DICOM/`` or ``002/DICOM/``). 
This script was originally developed to process unzipped DICOM datasets downloaded direclty from the Central Neuroimaging Data Archive (CNDA), an platform utilized by WashU. For flat directories where all DICOM files sit in a single folder, use :ref:`dcm_sort` instead.
By default, ``pseudo_dcm_sort.csh`` creates :term:`Symbolic Link` shortcuts to the original files rather than copying them.

This script uses :ref:`dcm_dump_file` to read the following DICOM header fields:

* **ACQ Sequence Name** (scanner protocol name)
* **ID Series Description** (series label)
* **REL Series Number** (scan sequence order number used to name the ``study<N>`` folders)

This script generates :term:`\<dicom_directory\>.studies.txt` which uses the REL Series Number, ACQ Sequence Name, and ID Series Description.

.. important::
   * Top-level subdirectories inside ``<DICOM_directory>`` must use numeric names (such as ``001``, ``002``).
   * By default, the script looks inside a subfolder named ``DICOM`` inside each numeric directory.

Usage
-----

.. list-table::
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-d``
     - Enables verbose debug mode to display detailed log information.
   * - ``-e<ext>``
     - Filters DICOM files by extension before sorting. Do not include a period. Defaults to ``dcm``.
   * - ``-i``
     - Sorts DICOM files with integer file names.
   * - ``-r<str>``
     - Filters DICOM files by matching the beginning of the filename. For example, ``-rtest`` matches files starting with "test". Defaults to matching files starting with ``MR*``.
   * - ``-s``
     - Searches one level deeper below the numeric directory. Looks for a folder named ``DICOM`` first. If ``DICOM`` does not exist, it searches the single subfolder present regardless of its name.
   * - ``-t``
     - Disables the ``-t`` option when calling :ref:`dcm_dump_file`.

.. note:: Do not add spaces between an option flag and its argument (for example, use ``-eIMA``, not ``-e IMA``).

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. tab-set::

      .. tab-item:: 📁 Case 1: DICOMs in Root Directory

         Use Case 1 when your DICOM files are stored directly inside numeric subfolders (for example, ``DICOM/001/`` or ``DICOM/002/``).

         .. note::
            In all commands below, ``DICOM`` is used as an example parent folder name. Replace ``DICOM`` with your actual folder path.

         .. card:: 📥 Input Data Structure
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`This test dataset mixes .dcm and .IMA files with custom prefixes to demonstrate command flags. Real scanner exports typically use only one file extension.`

            Ensure your numeric subfolders sit directly inside your working target directory:

            .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/pds_c1_source_data.png
               :alt: Source directory containing DICOM files directly
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡Command 1: Standard Sort

               Run the script on your target directory. By default, it processes files ending in ``.dcm``.

               **1. Execute Command:**

               .. code-block:: bash

                  pseudo_dcm_sort.csh DICOM

               **2. Expected Output:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/cmd1/pds_c1_cmd1_output.png
                  :alt: Expected terminal output for standard sort
                  :align: center

               **3. Resulting Output Files:**

              .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 📂 Updated Directory

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/cmd1/pds_c1_cmd1_sorted_folders.png
                        :alt: Updated folder tree
                        :align: center

                  .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                     .. div:: card-help-top-right

                        :card-help:`term:<dicom_directory>.studies.txt`

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/cmd1/pds_c1_cmd1_studies_txt.png
                        :alt: Contents of DICOM.studies.txt
                        :align: center

            .. tab-item:: ⚡ Command 2: Sort By Extension (`-e` Flag)

               If your DICOM files use a different file extension (such as Siemens ``.IMA`` files), specify that extension using the ``-e`` flag.

               **1. Execute Command:**

               .. code-block:: bash

                  pseudo_dcm_sort.csh -eIMA DICOM

               **2. Expected Output:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/cmd2/pds_c1_cmd2_output.png
                  :alt: Output showing formatted element fields
                  :align: center

               **3. Resulting Output Files:**

              .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 📂 Updated Directory

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/cmd2/pds_c1_cmd2_sorted_folders.png
                        :alt: Updated folder tree
                        :align: center

                  .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                     .. div:: card-help-top-right

                        :card-help:`term:<dicom_directory>.studies.txt`

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case1/cmd2/pds_c1_cmd2_studies_txt.png
                        :alt: Contents of DICOM.studies.txt
                        :align: center

      .. tab-item:: 📁 Case 2: DICOMs in Sub-directories

         Use Case 2 when DICOM files are nested inside an extra subfolder below each numeric directory (for example, ``DICOM/001/DICOM/`` or ``DICOM/001/scans/``).

         .. note::
            In all commands below, ``DICOM`` is used as an example parent folder name. Replace ``DICOM`` with your actual folder path.

         .. card:: 📥 Input Data Structure
            :class-card: sd-bg-light sd-border-1 mb-3

            .. div:: card-help-top-right

               :card-help:`This test dataset mixes .dcm and .IMA files with custom prefixes to demonstrate command flags. Real scanner exports typically use only one file extension.`

            DICOM files sit inside nested subfolders under each numeric folder:

            .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/pds_c2_source_data.png
               :alt: Source directory with nested sub-folders
               :align: center
               :width: 80%

         .. tab-set::

            .. tab-item:: ⚡Command 1: Recursive Search (`-s`)

               Use the ``-s`` flag to instruct the script to search one level deeper inside each numeric folder.

              **1. Execute Command:**

              .. code-block:: bash

                  pseudo_dcm_sort.csh -s DICOM

              **2. Terminal Output:**

              .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/cmd1/pds_c2_cmd1_output.png
                  :alt: Terminal stdout log
                  :align: center
                  :width: 70%

              .. note::

                  Look for ``1 DICOM files found in..`` to verify the operation succeeded.

              **3. Resulting Output Files:**

              .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 📂 Updated Directory

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/cmd1/pds_c2_cmd1_sorted_folders.png
                        :alt: Updated folder tree
                        :align: center

                  .. grid-item-card:: 📄 `DICOM.studies.txt` Breakdown

                     .. div:: card-help-top-right

                        :card-help:`term:\<dicom_directory\>.studies.txt`

                    .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/case2/cmd1/pds_c2_cmd1_studies_txt.png
                        :alt: Contents of DICOM.studies.txt
                        :align: center

      .. tab-item:: ⚠️ Common Errors
         :class-label: tab-error

         .. tab-set::

            .. tab-item:: ❌ Incomplete Sort: Running on a Flat Directory
               :class-label: tab-error

               **Cause:** Running ``pseudo_dcm_sort.csh`` on a flat directory where DICOM files sit directly in the target folder without numeric subdirectories (such as ``001/`` or ``002/``).

               **Command Attempt:**

               .. code-block:: bash

                  pseudo_dcm_sort.csh DICOM

               **Observed Output:**

               The script runs silently and prints no terminal output. It creates an empty summary file named ``DICOM.studies.txt`` and creates no ``study<N>`` folders.

               .. grid:: 1 2 2 2
                  :gutter: 2

                  .. grid-item-card:: 💻 Terminal Output
                     :class-card: sd-bg-light sd-border-1

                     *(No output displayed in terminal)*

                  .. grid-item-card:: 📄 Generated `DICOM.studies.txt`
                     :class-card: sd-bg-light sd-border-1

                     *(File is created, but contains 0 lines of text)*

               .. admonition:: Resolution
                  :class: warning

                  If your DICOM files sit directly inside a single folder without numeric subdirectories, use :ref:`dcm_sort` instead.

            .. tab-item:: ❌ Missing -s Option
               :class-label: tab-error

                  **Cause:** Running the script on nested subdirectories without passing the ``-s`` flag. The script only checks the top numeric folders, finds no DICOM files, and creates empty or incomplete outputs.

                  **Command Attempt:**

                  .. code-block:: bash

                     pseudo_dcm_sort.csh DICOM

                  **Error Output:**

                  .. code-block:: text

                     0 DICOM files found in ...

                  .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/errors/did_not_use_s_option.png
                     :alt: Missing -s flag
                     :align: center

                  .. admonition:: Resolution
                     :class: warning

                     When DICOM files sit inside nested subfolders beneath numeric directories, you must include the ``-s`` flag.

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

            .. tab-item:: ❌ Non-Numeric Subdirectory Names
               :class-label: tab-error

               **Cause:** Providing ``pseudo_dcm_sort.csh`` with a target directory that contains subfolders named with text labels (such as ``sub-01`` or ``session1``) instead of numbers (such as ``001`` or ``002``).

               **Command Attempt:**

               .. code-block:: bash

                  pseudo_dcm_sort.csh DICOM

               **Error Output:**

               The script ignores top-level subfolders that do not use numeric names, resulting in skipped files or an empty output.

               .. code-block:: text

                     non-numeric subdirectory <path_to_DICOM_directory> skipped

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/errors/non_numeric_folder_error.png
                  :alt: Terminal output showing skipped non-numeric subdirectories
                  :align: center

               .. admonition:: Resolution
                  :class: warning

                  Rename top-level subject or session subfolders to numeric values (for example, rename ``sub-01`` to ``001``) before running ``pseudo_dcm_sort.csh``.
            
            .. tab-item:: ❌ Multiple Sub-directories Neither Named "DICOM"
               :class-label: tab-error

               **Cause:** This error happens when a numeric directory contains multiple subfolders and none of them is named ``DICOM``. The script cannot automatically determine which folder contains the DICOM files.

               **Command Attempt:**

               .. code-block:: bash

                  pseudo_dcm_sort.csh -s DICOM

               **Error Input:**

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/errors/multiple_dir_in_subdir.png
                  :alt: Multiple directories in sub-directory
                  :align: center

               **Error Output:**

               .. code-block:: text

                  pseudo_dcm_sort.csh: numeric subdirectory has more than one subdirectory

               .. image:: /_static/scripts/dicom_utilities/pseudo_dcm_sort/errors/multiple_sub_dir_under_numeric.png
                  :alt: Multiple directories in sub-directory Output
                  :align: center

               .. admonition:: Resolution
                  :class: warning

                  Rename the subfolder containing your DICOM files to ``DICOM`` so the script knows which directory to process.

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