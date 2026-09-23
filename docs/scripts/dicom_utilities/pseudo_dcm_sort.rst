.. include:: ../../global.rst

.. _pseudo_dcm_sort:

Pseudo DICOM Sort
=================
.. rubric:: Script: ``pseudo_dcm_sort.csh``

Synopsis
--------

pseudo_dcm_sort <DICOM_directory> [[-d] [-s] [-e<ext>] [-r<str>] [-i] [-t]]

Description
-----------

Will search sub-directories of the <DICOM_directory> path provided and sort. The DICOMs will be symbollically linked and sorted in $CWD/study/[study #].
Flat directory sorting is handled by :ref:`dcm_sort`.

This script makes use of :ref:`dcm_dump_file` to read the following:
  - ACQ Sequence Name
  - ID Series Description

.. important::	DICOM subdirectories must be numeric |br|
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
     - Filter files sorted by specified file extension before sorting. Do not include ".".
   * - ``-i``
     - Sorts files with Integer file names.
   * - ``-r<str>``
     - Sorts files by the "root" of the word. -rtest will find files starting with "test". **Defaulted to MR***
   * - ``-s``
     - Searches for DICOM files 1 sub-directory below the numeric sub-directory. There can only be one folder. The folder can have any name but it is usually "DICOM".
   * - ``-t``
     - Toggle OFF use of -t in call to dcm_dump_file.

.. note::	Remove any whitespace between the option and the option's value.

Examples
--------

.. dropdown:: 💡 Click to show/hide usage examples
   :animate: fade-in

   .. code-block:: bash

      dcm_sort /path/to/DICOM_dir -d -c -t -i -edcm -rtest -pDOE^JOHN

   .. image:: /_static/DICOM_utilities/test.png