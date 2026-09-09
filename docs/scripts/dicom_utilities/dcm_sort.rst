.. _dcm_sort:

DICOM Sort (`dcm_sort`)
=======================
Sort flat directory of DICOM files by study series.

Synopsis
--------

dcm_sort <DICOM_directory> [[-d] [-c] [-t] [-i] [-e<ext>] [-r<str>] [-p<str>]]

Description
-----------

Sort the DICOM files in the directory <DICOM_directory> path provided either by absolute or relative pathing. The DICOMs will be symbollically linked and sorted in $CWD/study/[study #]
This script does not recursively sort sub-directories; for recursive subdirectory sorting reference :ref:`pseudo_dcm_sort`

This script makes use of DICOM Dump File (:ref:`dcm_dump_file`) to get the header information.. add more information about what is used here.

.. important::	dcm_sort removes existing single study subdirectories

.. important::	dcm_sort puts unclassifiable DICOMs into subdirectory study0

Usage
-----

.. list-table:: Options
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-c``
     - Copy the files from <DICOM_directory> to $CWD/study/[Study #] instead of symbollically linking.
   * - ``-d``
     - Verbose debug mode.
   * - ``-e<ext>``
     - Filter files sorted by specified file extension before sorting. Do not include ".".
   * - ``-i``
     - Sorts files with Integer file names.
   * - ``-p<str>``
     - Filters DICOMs by Patient Name in the 'PAT Patient Name' field before sorting.
   * - ``-r<str>``
     - Sorts files by the "root" of the word. -rtest will find files starting with "test".
   * - ``-t``
     - Toggle OFF use of -t in call to dcm_dump_file.

.. note::	Remove any whitespace between the option and the option's value.

Examples
--------

.. code-block:: bash

	dcm_sort /path/to/DICOM_dir -d -c -t -i -edcm -rtest -pDOE^JOHN

.. image:: /_static/DICOM_utilities/test.png