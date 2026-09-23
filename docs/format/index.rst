===========
4dfp format
===========

The 4dfp (4-dimensional floating point) format was designed for functional neuroimaging. The four dimensions typically correspond to x, y, z, and time. Three dimensional structural images can be represented in 4dfp format by setting the depth of the fourth dimension to 1.

.. TODO: add info about why 4dfp is different from other image formats

.. note:: NIfTI and 4dfp images are ALWAYS y-flipped to each other. Be sure to use 4dfp tools to convert back and forth, so that this is accounted for.

The voxel data are stored in the form of a binary image as one UNIX file.
Consequently, 4dfp images may be directly loaded and viewed using IDL, matlab, fsleyes, etc. Information critical to interpreting the binary data (e.g., orientation, image dimensions, voxel dimensions) are stored in separate header file(s).
The 4dfp UNIX file name convention is demonstrated below, where filename is any valid filename string::

	<filename>.4dfp.img		# binary float voxel data
	<filename>.4dfp.ifh		# interfile header (ASCII text)
	<filename>.4dfp.hdr		# ANALYZE 7.5 header (binary)
	<filename>.4dfp.img.rec		# creation history

All 4dfp based image analysis programs used at the Washington University School of Medicine Neuroimaging Laboratory (NIL) read/write interfile headers. The minimal 4dfp format is comprised of the binary image data (.img) and the interfile header (.ifh). All NIL image analysis programs maintain an additional rec file (.img.rec), which records the image creation history.

The voxel data are stored in the form of a binary image as one UNIX file.
Consequently, 4dfp images may be directly loaded and viewed using IDL, matlab, fsleyes, etc. Information critical to interpreting the binary data (e.g., orientation, image dimensions, voxel dimensions) are stored in separate header file(s).
The 4dfp UNIX file name convention is demonstrated below, where filename is any valid filename string::

	<filename>.4dfp.img		# binary float voxel data
	<filename>.4dfp.ifh		# interfile header (ASCII text)
	<filename>.4dfp.hdr		# ANALYZE 7.5 header (binary)
	<filename>.4dfp.img.rec		# creation history

All 4dfp based image analysis programs used at the Washington University School of Medicine Neuroimaging Laboratory (NIL) read/write interfile headers. The minimal 4dfp format is comprised of the binary image data (.img) and the interfile header (.ifh). All NIL image analysis programs maintain an additional rec file (.img.rec), which records the image creation history.

.. toctree::
   :maxdepth: 1
   :hidden:

   Image data <image>
   Interfile header <interfile-header>
   rec file <rec-file>


.. grid:: 1 2 3 3
   :gutter: 3

   .. grid-item-card:: 🖼️ Image Data
      :link: image
      :link-type: doc
      :class-card: nav-card

      Voxel layout, short-to-float conversion, memory indexing, and orientation flip rules for Siemens-derived 4dfp volumes.

   .. grid-item-card:: 📄 Interfile Header
      :link: interfile-header
      :link-type: doc
      :class-card: nav-card

      Annotated .ifh file listing, parameter field definitions, and the minimal set of metadata required to interpret voxel data.

   .. grid-item-card:: 📝 REC File
      :link: rec-file
      :link-type: doc
      :class-card: nav-card

      ASCII creation history structure, nested antecedent tracking (rec/endrec), UNIX command logging, and brec output formatting.
