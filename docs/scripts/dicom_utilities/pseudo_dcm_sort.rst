.. _pseudo_dcm_sort:

Pseudo DICOM Sort (`pseudo_dcm_sort`)
=====================================
Sort DICOM files by study series (used for nested directory structures)

**Usage**::

	pseudo_dcm_sort.csh <DICOM directory>

.. list-table:: Options
   :widths: 15 85
   :header-rows: 1

   * - Flag
     - Description
   * - ``-d``
     - Verbose debug mode
   * - ``-e<ext>``
     - Take files with specified extension
   * - ``-i``
     - Take files with integer filenames
   * - ``-r<str>``
     - Take files with filenames containing specified string
   * - ``-s``
     - DICOM files are within a subdirectory of numeric subdirectories
   * - ``-t``
     - Toggle OFF use of -t in call to dcm_dump_file

.. important::	DICOM subdirectories must be numeric
.. important::	default subdirectory of numeric subdirectory is 'DICOM'

**Examples**::

	pseudo_dcm_sort.csh RAW

.. image:: ../../_static/DICOM_utilities/test.png
