.. _header:

4dfp Header File (.hdr)
=======================

Summary
-------

The **.hdr file** is a fixed-size, 348-byte binary metadata file that defines the spatial geometry and numerical formatting of a 4dfp brain image volume. 
While 4dfp tools natively rely on text-based Interfile headers (``.ifh``), external neuroimaging software (such as FSLeyes, as well as legacy software FSLView and ANALYZE) often requires headers formatted according to the legacy Mayo Clinic ANALYZE 7.5 standard.

Technical Details
-----------------

.. list-table::
   :widths: 15 75
   :header-rows: 1

   * - Feature
     - Value
   * - Full Name
     - 4dfp Header (ANALYZE 7.5 Format)
   * - File extension
     - .hdr (or .4dfp.hdr)
   * - MIME type
     - application/x-dbt
   * - Format type
     - Binary (Metadata)
   * - Developer
     - Avi Snyder
   * - Introduced
     - 1995
   * - Byte order
     - Bi-endian (Little-endian or Big-endian; defined in paired .ifh file)

What is an HDR File?
--------------------

An ANALYZE 7.5 ``.hdr`` file contains 348 bytes split into three sections:

* **Header Key**
* **Image Dimension**
* **Data History**

More information: `ANALYZE 7.5 File Format Specification <https://afni.nimh.nih.gov/pub/dist/doc/nifti/ANALYZE75.pdf>`_

.. note::	Because the ``.hdr`` file is written in raw binary, it cannot be edited directly in a standard text editor.

Related Tools
-------------

* :ref:`ifh2hdr`: Generates or updates an ANALYZE 7.5 ``.hdr`` binary header file using spatial and dimension metadata parsed directly from the paired ``.ifh`` text header.
* :ref:`hdr2txt`: Reads the 348-byte binary structure of an ANALYZE ``.hdr`` file and dumps its metadata into a human-readable ASCII text format for inspection.