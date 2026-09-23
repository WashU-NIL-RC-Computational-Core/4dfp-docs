.. include:: ../../global.rst

.. _image_algebra:

Image algebra
=============

sqrt_4dfp
---------
:math:`\sqrt{A}`

Examples::

	sqrt_4dfp vce20_mpr

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
-E		output undefined voxels as 1.0e-37 (default 0.0)
=======	==================================================

N.B.:	default output filename = <image>_sqrt

.. _scale_4dfp:

scale_4dfp
----------
m*A + b

Usage:	scale_4dfp <image_4dfp> <scale_factor> [options]

Examples::

	scale_4dfp b2_xfrm_avg 12
	scale_4dfp b2_xfrm_avg 12 -b5 -ax12+5

Options

=======	==================================================
-E		preserve 1.0e-37 values (fidl NaN convention)
-a<str>	append trailer to output file name
-b<flt>	add specified constant to each voxel
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	<image_4dfp> is overwritten unless the trailer option is used |br|
N.B.:	<scale_factor> must be specified for proper operation

.. _imgopr_4dfp:

imgopr_4dfp
-----------
A+B, A-B, A*B, A/B, various special operations

Usage:	imgopr_4dfp -<operation><(4dfp) outroot> <(4dfp) image1> <(4dfp) image2> ...

Operations

=	====================================================================
a	add
s	subtract (image1 - image2)
p	product
r	ratio (image1 / image2)
e	mean (expectation)
v	variance
g	geometric mean
n	count defined (see -u option) voxels
x	voxelwize maximum
y	voxelwize minimum
G	report serial number (counting from 1) of image with greatest value
P	unsplit multiple ROIs into fidl compatible ROI file
=	====================================================================

Options

=======	========================================================
-u		count only defined (not NaN or 1.e-37 or 0.0) voxels
-R		suppress creation of rec file
-N		output undefined voxels as NaN
-Z		output undefined voxels as 0
-E		output undefined voxels as 1.E-37 (default)
-c<flt>	multiply output by specified scaling factor
-l<lst>	read input file names from specified list file
-@<b|l>	output big or little endian (default first input endian)
=======	========================================================

N.B.:	image dimensions must match except for binary operations {aspr} in which a 1 volume second image may be paired with a multi-volume first image
