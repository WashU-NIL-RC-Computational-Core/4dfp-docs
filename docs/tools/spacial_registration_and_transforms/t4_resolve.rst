.. _t4_resolve:

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