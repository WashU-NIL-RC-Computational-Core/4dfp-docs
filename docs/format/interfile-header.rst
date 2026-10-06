.. _interfile_header:

Interfile header
================

The following is a listing of a 4dfp interfile header file (vm6c_b1.4dfp.ifh).
The image data (vm6c_b1.4dfp.img) were acquired in one 128 frame fMRI run.
Each frame has dimensions 64 x 64 x 18, The acquired voxels are 3 mm cubic. ::

	version of keys			:= 3.3
	number format			:= float
	conversion program		:= nifti_4dfp
	name of data file		:= T1w_acpc_dc.4dfp.ifh
	number of bytes per pixel	:= 4
	imagedata byte order 		:= littleendian
	orientation 			:= 2
	number of dimensions		:= 4
	matrix size [1]			:= 260
	matrix size [2] 		:= 311
	matrix size [3] 		:= 260
	matrix size [4] 		:= 1
	scaling factor (mm/pixel) [1]	:= 0.700000
	scaling factor (mm/pixel) [2]	:= 0.700000
	scaling factor (mm/pixel) [3]	:= 0.700000
	mmppix				:= 0.700000	-0.700000 	-0.700000
	center				:= 92.0000	-91.7000	-110.0000


Various image analysis programs may make use of additional interfile header fields. The minimal set of fields required to interpret the voxel data is listed below::

	number format			:= float
	number of bytes per pixel	:= 4
	orientation			:= 3
	number of dimensions		:= 4
	scaling factor (mm/pixel) [1]	:= 3.000000
	scaling factor (mm/pixel) [2]	:= 3.000000
	scaling factor (mm/pixel) [3]	:= 3.000000
	matrix size [1]			:= 64
	matrix size [2]			:= 64
	matrix size [3]			:= 18
	matrix size [4]			:= 128

