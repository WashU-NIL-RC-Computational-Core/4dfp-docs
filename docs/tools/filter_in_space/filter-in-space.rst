.. include:: ../../global.rst

.. _filter_in_space:

Filter in space
===============

.. _gauss_4dfp:

gauss_4dfp
----------
spatial frequency domain

Usage:	gauss_4dfp <4dfp|conc input> f_half [outroot]

Examples::

	gauss_4dfp pt349_study9to9 0.1
	gauss_4dfp p1234ho5 0.7 p1234ho5_g7

Options

=======	========================================================================
outroot	output file name (default = <inroot>_g<10*f_half>) (only for 4dfp input)
-@<b|l>	output big or little endian (default input endian)
-w		(wrap) suppress x and y padding
-d		differentiate
=======	========================================================================

N.B.:	f_half is half frequency in 1/cm |br|
N.B.:	FWHM*f_half = (2ln2/pi) = 0.4412712 |br|
N.B.:	conc files must have extension "conc"

imgblur_4dfp
------------
spatial domain

Usage:	imgblur_4dfp [options] <image_file> <FWHM_in_mm>

Examples::

	imgblur_4dfp -yz vc345 5.5

Options

=======	==================================================
-x		selective x blur
-y		selective y blur
-z		selective z blur
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default blur is 3D isotropic

hsphere_4dfp
------------
convolve image with hard sphere kernel

Usage:	hsphere_4dfp <file_4dfp> <flt>

Examples::

	hsphere_4dfp np1234_zmap_222 5

N.B.:	second argument specifies hard sphere radius in mm
