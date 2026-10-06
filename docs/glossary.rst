.. _glossary:

Glossary
========

.. glossary::
   :sorted:

   Big-Endian
      A way computers store data bytes in memory, placing the largest (most significant) byte first. It was standard in older Unix systems (like SPARC or SGI) and legacy 4dfp imaging files.

   DICOM Header
      A metadata block at the beginning of a DICOM file. It stores information about the scan, patient, and scanner settings (such as sequence names and series numbers) before the raw image pixels.
      
   DICOM Part 10
      Section 10 of the NEMA DICOM standard (PS 3.10) that defines how DICOM files are saved on disk. Each file starts with a 128-byte preamble, followed by the 4-character code ``DICM`` and standard data tags.

   \<dicom_directory\>.studies.txt
      A text summary file created by 4dfp DICOM sorting scripts (like ``dcm_sort``). It lists every scan series in an MRI session across four space-separated columns:

      * **Column 1 (REL Series Number):** The sequence or order number of the scan in the session.
      * **Column 2 (ACQ Sequence Name):** The scanner's technical name for the scan protocol.
      * **Column 3 (ID Series Description):** A plain-text label describing the image series.
      * **Column 4 (File Count):** The total number of DICOM files saved in that scan series.

   Explicit Little-Endian
      The standard byte order used by modern PCs (x86/x64). It stores the smallest (least significant) byte first and explicitly includes a 2-character Value Representation (VR) tag that names the data type for each item.

   Siemens IMA
      A file extension used by Siemens MRI scanners. These are standard DICOM files or raw headers saved with a Siemens-specific extension.

   Symbolic Link
      A shortcut file that points directly to another file or folder on your computer without copying the original data.