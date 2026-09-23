.. include:: ../../global.rst

.. _tools_dti:

DTI
===

dwi_xalign3d_4dfp
-----------------
motion compensation for dwi data (single run)

Usage:	dwi_xalign3d_4dfp <(4dfp) dwi> <(4dfp) mask>

Examples::

	dwi_xalign3d_4dfp hbo08a_dwi1 hbo08a_dwi1_mskt -s -g2-4 -g5,13,18,23

Options

=====================================	==============================================================
-p										planar (2D; disable cross-slice) alignment
-w										enable wrap addressing
-s										enable cross DWI voxel size adjust (principal axis stretch)
-a										compute group arithmeric mean volume (default geometric mean)
-n										zero negative values in output image
-I<int>									specify volume number of I0 counting from 1 (default 1)
-f<flt>									specify pre-blur filter half freq (1/mm) (default none)
-d<flt>									specify sampling interval in mm (default=5.0000)
-i<flt>									specify displacment search radius in mm (default=3.0000)
-j<flt>									specify parameter search object radius in mm (default=40.0000)
-c<int>									specify number of within-group cycles (default=3)
-g<int>[-<int>][,<int>[-<int>]][,...]	program alignment group
=====================================	==============================================================

N.B.:	<(4dfp) mask> may be "none" |br|
N.B.:	I0 should not be named in any programmed alignent group

dwi_cross_xalign3d_4dfp
-----------------------
cross-run motion compensation and averaging of dwi data

Usage:	dwi_cross_xalign3d_4dfp <(4dfp) dwi1> <(4dfp) dwi2> <(4dfp) dwin> ... <(4dfp) dwi_out>

Examples::

	dwi_cross_xalign3d_4dfp -sgmjo_sub2-dwi1_mskt jo_sub2-dwi1 jo_sub2-dwi2 jo_sub2-dwi_all
	dwi_cross_xalign3d_4dfp -sgmjo_sub2-dwi1_mskt -ljo_sub2_dwi.lst jo_sub2-dwi_all

Options

===============	====================================================================
-p				planar (2D; disable cross-slice) alignment
-w				enable wrap addressing
-s				enable cross DWI voxel size adjust (principal axis stretch)
-n				zero negative values in output image
-z<x|y|z><flt>	zoom output x y or z dimension by specified factor
-g				use group geometric mean (\*_geom) volumes for cross-run registration
-a				append successive runs in output (default average)
-m<(4dfp) mask>	specify first volume mask
-I<int>			specify volume number of I0 counting from 1 (default 1)
-f<flt>			specify pre-blur filter half freq (1/mm) (default none)
-d<flt>			specify sampling interval in mm (default=5.0000)
-i<flt>			specify displacment search radius in mm (default=3.0000)
-j<flt>			specify parameter search object radius in mm (default=40.0000)
-l<lst>			read input file names from specified file (use before naming output)
-@<b|l>			output big or little endian (default input endian)
===============	====================================================================

N.B.:	option -I (non-default I0 volume) must be matched according to use of option -g

diff_4dfp
---------
diffusion tensor computation given dwi

Usage:	diff_4dfp <prm_file> <file_4dfp> <opt mask_file> <opt CO_file>

Examples::

	diff_4dfp tp7_params.dat /data/emotion/data3/track_sub3/track_sub3_DTI_avg

Options

=======	==================================================================================
**Computational**
------------------------------------------------------------------------------------------
-N		compute D using nonlinear Levenberg-Marquardt (default log linear LS)
-Z		use nonlinear approach to repair bad voxels from log linear LS
-c		estimate non-mobile diffusion term (applies only to Levenberg-Marquardt algorithm)
-s<int>	compute only selected slice for debugging
-v<int>	compute only selected voxel for debugging
-B<flt>	ignore bad encoding at specified threshold (units = s.d.) (default=3.0)
-b<flt>	ignore encodings with noisy background at specified threshold (default=3.0)
-S<flt>	subtract a fraction of S0 image from data (def=0.1), not compatible with B,b
-C		subtract a CO fraction from data using an imported file, not compatible with B,b
-G<int>	Correct tbi data, =1 CCIR remove encode 1, =2 SLCH remove encode 10,22
------------------------------------------------------------------------------------------
**Masking**
------------------------------------------------------------------------------------------
-m		Use external mask included as third input file
-M		compute threshold mask without holes
-t<flt>	specify mask threshold as fraction of I0 mode (default=0.1000)
-h<flt>	specify minimum I0 mode (default=100.00)
-n<int>	specify number of I0 histogram smoothings (default=4)
------------------------------------------------------------------------------------------
**Output**
------------------------------------------------------------------------------------------
-a<str>	append specified trailer to output fileroots
-p		print out pixel numbers for debugging
-D		output D tensor
-F		output FA (fractional anisotropy)
-E		output eigenvalues
-V[int]	output [specified number of (default=1)] eigenvectors (principal first)
-P		output prolaticity
-R		output single residue volume for model
-r		output squared residue values for all encodings in a separate file
-o		output extra full LM output files (applies only to LM algorithm) (implies -N)
-d		debug mode, provide extra volume of output as needed
-@<b|l>	output big or little endian (default input endian)
=======	==================================================================================

N.B.:	the first data volume must have high SNR from b=0 or low b value |br|
N.B.:	optional output volumes are appended to MD and RA |br|
N.B.:	output order: MD,RA,(Dxx,Dyy,Dzz,Dxy,Dxz,Dyz),(FA),(E123,RD),(CO),(Res),(Evecs),(Prol) |br|
N.B.:	-b and -B are independent but can both be applied |br|
N.B.:	-b requires -m and mask dimensions must match image dimensions |br|
N.B.:	-B, -b parameter useful range is 1.5 to 3 |br|
N.B.:	eigenvalue ordering is = Eval1 < Eval2 < Eval3 |br|
N.B.:	-c produces an franctional constant output CO = C/(C+S0)

diffRGB_4dfp
------------
dwi :math:`\rightarrow` RGB map

Usage:	diffRGB_4dfp <prm_file> <file_4dfp>

Examples::

	diffRGB_4dfp -t0.5 -qc1.7 tp7_params.dat /data/DTI_avg

Options

=======	==========================================================================
-q		scale intesity by sqrt(Asig) instead of Asig
-G		change color coding to bgr (default rgb)
-c<flt>	specify the intensity scale value (default=1.0000)
-t<flt>	specify mask threshold as fraction of I0 mode (default=0.1000)
-T<str>	specify t4 file used to transform DWI data
-h<flt>	specify minimum I0 mode (default=100.00)
-n<int>	specify number of I0 histogram smoothings (default=4)
-D		input <file_4dfp> is 8 volume diff_4dfp -D output (Dbar, Asigma, D tensor)
-@<b|l>	output big or little endian (default input endian)
=======	==========================================================================

N.B.:	<prm_file> is ignored with -D option

whisker_4dfp
------------
dwi :math:`\rightarrow` whiskers (visualized in Matlab)

Usage:	whisker_4dfp <prm_file> <file_4dfp>

Examples::

	whisker_4dfp tp7_params.dat -dz3 /data/emotion/data3/track_sub3/track_sub3_DTI_avg

Options

==============	==============================================================
-h<flt>			specify minimum I0 mode (default=100.00)
-n<int>			specify number of I0 histogram smoothings (default=4)
-t<flt>			specify mask threshold as fraction of I0 mode (default=0.1000)
-T<str>			specify t4 file used to transform DWI data
-E				additionally output eigenvalues
-3				output 3 eigenvectors scaled by eigenvalue
-d<x|y|z><int>	specify quiver spacing in pixels (default=1)
==============	==============================================================

N.B.:	default output is first two eigenvectors scaled by Asigma
