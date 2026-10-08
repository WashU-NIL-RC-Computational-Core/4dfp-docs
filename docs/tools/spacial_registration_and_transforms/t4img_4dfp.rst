.. _t4img_4dfp:

t4img_4dfp
----------
single image wrapper for :ref:`t4imgs_4dfp`

Usage:	t4img_4dfp <t4file> <imgfile> [outfile]

Examples::

	t4img_4dfp vce1_mprS_to_711-2B_t4 vce1_mprS.4dfp.img -O222
	t4img_4dfp vce1_mprS_to_711-2B_t4 vce1_mprS vce_mprS_711-2B -O222
	t4img_4dfp none	vce1_mprS vce1_mprS_222 -O222

Options

==========	===================================================
-z			normalize by sqrt(n) rather than n (for z images)
-s			interpolate by 3D cubic spline (default is 3D linear)
-N			output NaN (default 0.0) for undefined values
-B			internally convert to_711-2A_t4->to_711-2B_t4
-n			use nearest neighbor interpolation
-R			suppress creation of rec file
-O111		output in 111 space instead of default 333.0 space
-O222		output in 222 space instead of default 333.0 space
-O333.n		output in 333.n space (y shifted up by n pixels)
-Omy_image	duplicate dimensions of my_image.4dfp.ifh
-@<b|l>		output big or little endian (default CPU endian)
outfile		specify name for output file (default is <imgfile>t)
==========	===================================================

N.B.:	4dfp filename extensions are optional |br|
N.B.:	option -n causes fidl ROI names to be copied to the output ifh