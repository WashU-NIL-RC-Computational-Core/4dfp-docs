.. include:: ../../global.rst

.. _register_in_space:

Register in space (and other t4 oriented programs)
==================================================

.. _imgreg_4dfp:

imgreg_4dfp
-----------
compute transform (various modes)

Usage::

	imgreg_4dfp target_imag target_mask source_imag source_mask t4file mode
	imgreg_4dfp target_imag        none source_imag source_mask t4file mode
	imgreg_4dfp target_imag        none source_imag        none t4file mode

Mode options

====	====================================================================================================================
1		enable coordinate transform
2		enable 3D alignment
4		enable affine warp (12 parameters in 3D 6 parameters in 2D)
8		enable voxel size adjust
16		disable x voxel size adjust
32		disable y voxel size adjust
64		disable z voxel size adjust
128		unassigned
256		when set use difference image minimization (for similar contrast mechanisms)
512		superfine mode (2 mm cubic grid metric sampling)
1024	fast mode (12 mm cubic grid metric sampling)
2048	fine mode (5 mm cubic grid metric sampling)
4096	[T] restricted to translation explored at 7.5 mm intervals
8192	enable parameter optimization by computation of the metric gradient in parameter space and inversion of the Hessian
====	====================================================================================================================

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

stretch_out
-----------
remove transform stretch

Usage:	stretch_out <t4file> [t4file_new]

N.B.:	default output filename is <t4file>"r"

.. _t4_mul:

t4_mul
------
compose transforms

Usage:	t4_mul <left_t4file> <right_t4file> [product_t4file]

Examples::

	t4_mul vm11b_anat_ave_to_vm11b_234-3_t4 vm11b_234-3_to_711-2B_t4 [vm11b_anat_ave_to_711-2B_t4]

t4_inv
------
invert transform

Usage: 	t4_inv <t4file> [inv_t4file]

Examples::

	t4_inv vm11b_anat_ave_to_vm11b_234-3_t4 [vm11b_234-3_to_vm11b_anat_ave_t4]

Options

==	==========================================
-u	suppress (intensity) scale field in output
==	==========================================

t4_factor
---------
decompose affine transform into components (translation, rotation, stretch)

Usage: 	t4_factor <t4file>

Examples::

	t4_factor vm11b_anat_ave_to_vm11b_234-3_t4

t4_null
-------
create an identity transform t4 file

Usage:	t4_null <t4file>

Examples::

	t4_null vm11b_mpr1_to_711-2B_t4

t4_resolve
----------
compute optimal rigid body transforms connecting a set of images

Usage:	t4_resolve <image1> <image2> ...

Options

=======	=============================================================================
-v		verbose mode
-m		generate mat file output
-s		include intensity scale factor in t4 file output
-w		weight inversely in proportion to scale in sub file output (sum counts mode)
-o<str>	write resolved output with specified fileroot
-r<flt>	set VOI rms radius in mm (default=50)
=======	=============================================================================

N.B.:	t4_resolve looks for t4 files <image1>_to_<image2>_t4, <image1>_to_<image3>_t4, ... |br|
N.B.:	t4_resolve automatically strips filename extensions when constructing t4 filenames

t4_pts
------
inter-convert coordinates, e.g., 711-2B :math:`\leftrightarrow` MNI152

Usage:	t4_pts <t4file> <pts.lst> [new pts.lst]

Examples::

	t4_pts 711-2B_to_MNI152lin_T1_t4 711-2B_coords MNI152_coords
