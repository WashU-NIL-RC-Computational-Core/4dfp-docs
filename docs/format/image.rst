.. _image_data:

Image data
===========

The 4dfp file format was developed to manage human head images acquired with a Siemens MRI scanner. The imato4dfp utility converts Siemens slice-based image (.ima) files into 4dfp format. This is accomplished by extracting (without reordering) the stored pixel values, converting short int to to float and writing the results to the 4dfp image file. Within each 3D volume the Siemens .ima files are read in order of decreasing image number.

Certain 4dfp conventions, especially regarding image orientation, reflect the Siemens Numaris operating system. For all acquisitions, including
oblique and double oblique, Numaris determines the principal orientation.
It is this orientation that appears in the interfile header and to which following table refers. The orientation-dependent axis flips required to display 4dfp image data in conventional radiologic orientation are tabulated below. It is assumed that the display is written left-to-right and bottom-to-top as in analyze_avw. It is also assumed that the image was acquired with the subject positioned in the scanner head-first and supine.

====================	=========	============================
Acquired orientation	Flip axes	First voxel (after flipping)
====================	=========	============================
2 (axial)		y		right occipital skull-base
3 (coronal)		y z		right skull-base occipital
4 (sagittal)		x y z		occipital skull-base right
====================	=========	============================

The above enumerated axis flips may be effected in analyze_avw at 4dfp image load time. Alternatively, 4dfp format may be converted to ANALYZE 7.5 format using the 4dfptoanalyze utility which automatically performs the indicated axis flips as it converts the voxel value number format from float to short int. 4dfp image data loaded into analyze_avw as prescribed above will be consistently resliced by analyze_avw. That is, all Siemens acquisition orientations will be consistently displayed in all analyze orientations (transverse, coronal, sagittal).

.. note:: x, y, and z denote voxel indices as ordered in memory. That is, if the x, y, and z indices run from 0 to nx-1, 0 to ny-1, and 0 to nz-1, then coordinate (x,y,z) is stored relative to the first voxel of each frame at offset x + nx*(y + ny*z).
