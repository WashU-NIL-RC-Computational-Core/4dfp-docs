.. _t4imgs_4dfp:

t4imgs_4dfp
-----------
apply transforms, resample and average (list directed)

Usage:	t4imgs_4dfp [options] <inlist> <outfile>

Example inlist::

	<imgfile1>	t4=<t4_file1>
	<imgfile2>	t4=<t4_file2>
	<imgfile3> 	t4=<t4_file3>


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
==========	===================================================