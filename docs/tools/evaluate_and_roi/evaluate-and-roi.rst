.. include:: ../../global.rst

.. _evaluate_and_roi_oriented_programs:

Evaluate and ROI-oriented programs
==================================

peak_4dfp
---------
locate and consolidate maxima to generate ROI

Usage: peak_4dfp <file_4dfp>

Examples::

	peak_4dfp grand_average_222[.4dfp.img] -s10

Options

================	===========================================================================================
-s<flt>				preblur with hard sphere kernel of specified radius (invokes hsphere_4dfp)
-n<int>				limit initial pos and neg peak list lengths (default=1000)
-c<flt>[to<flt>]	specify sign inverted curvature thresholds (default none)
-v<flt>[to<flt>]	specify peak value thresholds (default none)
-d<flt>				consolidate extremum pairs closer than specified distance
-o<flt>				output a fidl compatible 4dfp format ROI file with regions of specified radius
-m<str>				apply named mask file to output ROIs
-N<int>				specify output ROI minimum voxel count (default = 1)
-a<str>				append specified string to ROI output filename
-q					quiet mode (suppress rec file listing)
-F					force preblur image creation even if hsphere_4dfp result exists (no effect without -s<flt>)
-@<b|l>				output big or little endian (default input endian)
================	===========================================================================================

N.B.:	operations controlled by options -s, -n, -c, -v, -d, -o, -m, -N are applied serially in listed order |br|
N.B.:	all distances are in mm

read_4dfp
---------
report value of image at specified real coordinate

Usage:	read_4dfp <flt x0> <flt y0> <flt z0> <4dfp imgroot> [options]

Examples::

	read_4dfp 33.1 -56.2 18. grand_average_222[.4dfp.img]

Options

==	============
-v	verbose mode
==	============

imgmax_4dfp
-----------
report maximum and minimum values

Usage:	imgmax_4dfp <my_image[.4dfp.img]>

Options

==	============================================
-m	report min as well as max
-e	report max/min values in scientific notation
-r	report root sum of squares
-v	verbose (time series) mode
==	============================================

img_hist_4dfp
-------------
construct voxel value histogram; evaluate moments

Usage:	img_hist_4dfp <(4dfp) image>

Options

================	============================================================================
-b<int>				specify number of bins (default = 100)
-f<int>				select volume (counting from 1) of 4dfp stack (default analyze all volumes)
-t<flt>				specify image intensity threshold
-r<flt>[to<flt>]	specify histogram range
-m<(4dfp) mask>		mask input using (non-zero voxels of) specified mask (only first frame used)
-h					create <image>.hist file suitable for plotting, e.g., with xmgr
-p					create <image>.dat  file suitable for input to numerical procedures
-x					create <image>.xtile percentile listing
-C					create output files in $cwd (default parallel to <(4dfp) image>)
-u					normalize output .hist and .dat distributions to unit area
-s					report moments
================	============================================================================

N.B.:	option -f causes selected volume to be reported in filename of -{hpx} created files

.. _qnt_4dfp:

qnt_4dfp
--------
report mean value within 3D ROI

Usage:	qnt_4dfp <(4dfp)|(conc) image> <(4dfp) mask>

Examples::

	qnt_4dfp -t23.2 va1234_mpr mask

Options

================	===============================================================================================
-s					time series mode
-d					include backwards differences (differentiated signal) in output (requires -f or -F, implies -s)
-D					count only defined (finite, non 0.0, non-NaN, non 1.e-37) <image> voxels
-A					apply threshold test to absolute value of <mask>
-W					interpret <mask> as spatial weights (negative values allowed) (disables mask threshold testing)
-v<flt>[to<flt>]	count only <image> voxels within specified range
-f<str>				specify frames to count format, e.g., "4x120+4x76+"
-F<str>				read frames-to-count format from specified file
-p<flt>				specify mask threshold as percent of <mask> max
-t<flt>				specify absolute <mask> threshold (default = 0.0)
-c<flt>				scale output mean values by specified constant (default = 1.0)
================	===============================================================================================

N.B.:	only the first frame of <mask> is used  |br|
N.B.:	<image> and <mask> may be the same |br|
N.B.:	conc files must have extension "conc"

.. _qntm_4dfp:

qntm_4dfp
---------
evaluate multiple volumes in multiple ROIs

Usage:	qntm_4dfp <(4dfp)|(conc) image> <(4dfp) ROI>

Examples::

	qntm_4dfp TC30274_rmsp_faln_dbnd_xr3d_atl.conc iter10_roi_-02_-37_+27m_ROI

Options

=======	=======================================================
-Z		count zero voxels in <image> as defined
-V		force code_by_volume even if the number of volumes is 1
-N		create ROIs/voxel image
-o<str>	write output to specified text file (default stdout)
-h		suppress printing output header
=======	=======================================================

N.B.:	conc files must have extension "conc"  |br|
N.B.:	only defined voxels (not 0.0 and not NaN and not 1.e-37 and finite) are counted |br|
N.B.:	<(4dfp) ROI> may either a value-coded single volume ROI image or a multi-volume mask |br|
N.B.:	<(4dfp) ROI> coded values are integerized |br|
N.B.:	qntm_4dfp ignores <(4dfp) ROI> ifh center and mmppix fields

.. _qntv_4dfp:

qntv_4dfp
---------
evaluate multiple volumes in ROI subdivided into cubes

Usage:	qntv_4dfp <(4dfp)|(conc) image> <(4dfp) ROI>

Examples::

	qntv_4dfp TC30274_rmsp_faln_dbnd_xr3d_atl.conc iter10_roi_-02_-37_+27m_ROI

Options

=======	====================================================================================
-H		include header info in output
-V		print defined voxel counts per die
-D		create die image (voxels >= ncrit)
-K		create die (voxel) coordinate listing
-Z		count zero voxels in <image> as defined
-O<int>	select output type (see below)
-f<str>	specify frames-to-count format (default count all frames)
-F<str>	read frames-to-count format from specified file (supersedes option -f)
-l<int>	specify length of die in voxels (default 1)
-n<int>	specify minimum die voxel count (default 1)
-t<flt>	specify svd output tolerance - ratio of least to greatest eigenvalue (default 1e-06)
-o<str>	write output to specified text file (default stdout)
=======	====================================================================================

-O<int> options

=	==========================================================
1	timeseries directly extracted from dice
2	timeseries extracted from dice with mean removed
3	die timeseries passed through svd multiplied by eigenvalue
4	die timeseries passed through svd (unit variance)
=	==========================================================

N.B.:	conc files must have extension "conc" |br|
N.B.:	only defined voxels (not 0.0 and not NaN and not 1.e-37 and finite) are counted |br|
N.B.:	qntv_4dfp ignores <(4dfp) ROI> ifh center and mmppix fields |br|
N.B.:	to obtain a GLM condition number = X specificy sqrt(1/X) as tol with option -t

qntw_4dfp
---------
evaluate multiple volumes using weighted ROI

Usage:	qntw_4dfp <(4dfp)|(conc) image> <(4dfp) ROI>

Examples::

	qntw_4dfp TC30274_rmsp_faln_dbnd_xr3d_atl.conc iter10_roi_-02_-37_+27m_ROI

Options

=======	====================================================
-L<int>	specify ROI weight L-norm (default = 0)
-o<str>	write output to specified text file (default stdout)
-Z		count zero voxels in <image> as defined
-H		include heaer info in output
=======	====================================================

N.B.:	conc files must have extension "conc" |br|
N.B.:	<(4dfp) ROI> is interpreted as a multi-volume voxel-wise set of weights |br|
N.B.:	only defined voxels (not 0.0 and not NaN and not 1.e-37 and finite) are counted |br|
N.B.:	qntw_4dfp ignores <(4dfp) ROI> ifh center and mmppix fields

.. _var_4dfp:

var_4dfp
--------
evaluate variance or s.d. about mean over timeseries

Usage:	var_4dfp <(4dfp|conc) input>

Examples::

	var_4dfp -sn3 -c10 test_b1_rmsp_dbnd

Options

=======	==================================================================
-d		debug mode
-m		remove mean volume from stack
-s		compute s.d. about mean
-G		compute mean ignoring run boundaries (default within runs)
-v		compute variance about mean (default operation)
-z		output logical and of all defined voxels
-n<int>	specify number of pre-functional frames per run (default = 0)
-f<str>	specify frames to count format, e.g., "4x120+4x76+" (overrides -n)
-F<str>	read format from specified file
-c<flt>	scale output image values by specified factor
-N		output undefined voxels as NaN
-Z		output undefined voxels as 0
-E		output undefined voxels as 1.e-37 (default)
-@<b|l>	output big or little endian (default input endian)
=======	==================================================================

N.B.:	input conc files must have extension "conc" |br|
N.B.:	identically zero input voxels are counted as defined |br|
N.B.:	options {-v -s -m -z} are mutually exclusive |br|
N.B.:	absent -G voxelwise mean is individually computed over each run in conc |br|
N.B.:	-f option overrides -n

.. _dvar_4dfp:

dvar_4dfp
---------
evaluate variance or s.d. about mean over differentiated timeseries

Usage:	dvar_4dfp [options] <stack_4dfp>

Examples::

	dvar_4dfp -n3 test_b1_rmsp_dbnd -mtest_anat_ave_mskt

Options

===============	==================================================
-m<(4dfp) mask>	use specified 4dfp mask
-n<int>			specify number of pre-functional (anatomy) frames
-t<flt>			specify maskfile threshold (default = 0.0)
-b<flt>			specify preblur FWHM in mm (default none)
-s				output sqrt(dvar) (default dvar)
-@<b|l>			output big or little endian (default input endian)
===============	==================================================

burn_sphere_4dfp
----------------
“burn in” sphere at specified real coordinates

Usage:	burn_sphere_4dfp <flt x0> <flt y0> <flt z0> <4dfp imgroot> <4dfp outroot> [options]

Examples::

	burn_sphere_4dfp 33.1 -56.2 18. grand_average_222[.4dfp.img] -v2 -o7.5
	burn_sphere_4dfp 33.1 -56.2 18. 222 -v2 -o7.5

Options

=======	====================================================================================
-a		superimpose sphere on image (default duplicate input format with zero background)
-s		sum overlapping spheres (default overwrite)
-v<flt>	specify burn in value (default=1.0000)
-o<flt>	specify sphere radius in mm (default=6.0000) (radius of 0 creates single pixel burn)
-l<lst>	read sphere coordinates from specified list (command line coords ignored)
-@<b|l>	output big or little endian (default input endian)
=======	====================================================================================

N.B.:	without -a only the input ifh (or standard atlas string) is required |br|
N.B.:	specifying <4dfp imgroot> as "333[.n]" "222" or "111" generates standard atlas space output |br|
N.B.:	if the 4dfp image does not exist the default output endianness is CPU endian

ROI_resolve_4dfp
----------------
resolve a set of possibly overlapping ROIs into a disjoint set

Usage:	ROI_resolve_4dfp <(4dfp) ROI1> <(4dfp) ROI2> <(4dfp) ROI3> ...

Options

=======	================================================
-l<lst>	read input file names from specified list file
-@<b|l>	output big or little endian (default CPU endian)
=======	================================================

N.B.:	output 4dfp fileroots are same as inputs with appended "z"

imgsurf_4dfp
------------
move ROI coordinates to nearest surface

Usage:	imgsurf_4dfp <(4dfp) image> <point_list>

N.B.:	<point_list> lists loci in atlas coordinates (X Y Z) in mm

spatial_corr_4dfp
-----------------
compute image similarity as correlation over space

Usage:	spatial_corr_4dfp <image_x> <mask_x> <image_y> <mask_y> [output_text_file]

Options

=======	=========================================================
-C		compute covariance (default correlation)
-M		suppress removal of patial means
-c<flt>	scale output covariance matrix values by specified factor
=======	=========================================================

N.B.:	image dimensions must match |br|
N.B.:	spatial_corr_4dfp counts only defined (not NaN or 1.e-37 or 0.0) voxels

spatial_cov_multivol_4dfp
-------------------------
compute volume-pair covariance over space

Usage:	spatial_cov_multivol_4dfp <(4dfp) image> <(4dfp) mask>

Options

=======	================================================================
-Z		compute covariance with respect to zero (default wrt image mean)
-p<int>	generate specified number of PCs (default none)
-c<flt>	scale text output covariance matrix values by specified factor
=======	================================================================

N.B.:	spatial_cov_multivol_4dfp counts only defined (not NaN or 1.e-37) voxels |br|
N.B.:	zero voxels are counted as defined in <(4dfp) image> in cov computation |br|
N.B.:	zero voxels are counted as undefined in <(4dfp) image> in <(4dfp) mask> |br|
N.B.:	all zero or all undefined <(4dfp) image> volumes are ignored
