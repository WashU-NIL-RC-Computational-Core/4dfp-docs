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