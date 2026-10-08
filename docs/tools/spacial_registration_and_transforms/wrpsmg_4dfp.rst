.. _wrpsmg_4dfp:

wrpsmg_4dfp
-----------
apply transforms, resample and average difference images (list directed)

Usage:	wrpsmg_4dfp [options] <inlist> <outfile>

Options

==========	================================================
-N			output NaN (default 0.0) for undefined values
-w			create sum of weights image
-s			create square root variance (sd) image
-O111		output in 111 space
-O222		output in 222 space (default)
-O333.n		output in 333.n space (y shifted up by n pixels)
-Omy_image	duplicate dimensions of my_image.4dfp.ifh
-@<b|l>		output big or little endian (default CPU endian)
==========	================================================