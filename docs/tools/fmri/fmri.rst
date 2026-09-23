.. include:: ../../global.rst

.. _fmri:

fMRI oriented programs
======================

.. _compute_defined_4dfp:

compute_defined_4dfp
--------------------
generate mask of voxels defined over all frames

Usage:	compute_defined_4dfp <4dfp|conc input>

Options

=======	==================================================
-z		count zero voxels as undefined (default defined)
-f<str>	specify frames-to-count format (default count all)
-F<str>	read frames-to-count format from specified file
=======	==================================================

cs2ap_4dfp
----------
Converts cosine and sine amplitude images to amplitude and phase. Primarily
used for phase-encoded retinotopy.

Usage:	cs2ap_4dfp <(4dfp) cos_img> <(4dfp) sin_img> <(4dfp) outroot>

Options

=======	============================================================
-t<flt>	specify amplitude threshold for phase map (default = 0.0000)
-w<flt>	specify pre-blur FWHM in mm (default = 0.0000)
-@<b|l>	output big or little endian (default input endian)
=======	============================================================

.. _normalize_4dfp:

normalize_4dfp
--------------
scale to achieve mode 1000

Usage:	normalize_4dfp <(4dfp) image>

Examples::

	normalize_4dfp -n3 my_run_4dfp
	normalize_4dfp -n3 -v2 my_run_4dfp

Options

=======	===============================================================
-n<int>	specify number of pre-functional frames
-v0		no frame to frame intensity stabilization
-v1		volume based frame to frame intensity stabilization (default)
-v2		slice  based frame to frame intensity stabilization
-s		disable mode=1000 normalization
-z		subtract mean volume from functional frames
-h		create <image>.hist file suitable for plotting, e.g., with xmgr
-a<str>	specify trailer (default="norm")
-m<str>	read specified 4dfp mask (default blur & threshold input image)
-@<b|l>	output big or little endian (default input endian)
=======	===============================================================

.. _deband_4dfp:

deband_4dfp
-----------
correct systematic odd vs. even slice  intensity banding

Usage:	deband_4dfp <(4dfp) image>

Examples::

	deband_4dfp -n3 mybold
 	deband_4dfp -F"3x125+" mybold

Options

=======	=========================================================
-e		deband by exponential gradient model (default flat model)
-g		deband by linear gradient model (default flat model)
-n<int>	specify number of pre-functional frames
-F<str>	specify complete functional/non-functional format
-@<b|l>	output big or little endian (default input endian)
=======	=========================================================

rmspike_4dfp
------------------
remove artifact due to k-space DC offset [1]_

Usage:	rmspike_4dfp <file_4dfp>

Examples::

	rmspike_4dfp -n3 -x33 test_b1.4dfp.img
	rmspike_4dfp -x33 -F"45(1x6+)" test_b1

Options

=======	==================================================
-n<int>	specify number of anatomy frames
-x<int>	restrict search to specified column
-y<int>	restrict search to specified row
-F<str>	specify whole run functional/non-functional format
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

.. _cross_realign3d_4dfp:

cross_realign3d_4dfp
--------------------
motion correct fMRI timeseries within and across runs

Usage: cross_realign3d_4dfp -l<4dfp_list_file> |br|
or: cross_realign3d_4dfp <run1_4dfp> <run2_4dfp> ...

Examples::

	cross_realign3d_4dfp run1_4dfp run2_4dfp run3_4dfp
	cross_realign3d_4dfp -sqwv -lruns_4dfp.lst
	cross_realign3d_4dfp -pwqsf -n3 -lruns_4dfp.lst

Options

=======	===================================================================
-d		debug mode
-@<b|l>	output big or little endian (default CPU endian)
-f		force recomputing even if output files exist
-g		enable linear intensity gradient compensation
-c		use cross-modal registration always
-l<str>	specify list file of 4dfp filenames
-m<str>	specify 4dfp mask to be applied to all runs (default compute)
-n<int>	specify number of pre-functional frames
-b<flt>	specify pre-blur in reciprocal mm (default=0.06)
-p		2D (planar) realignment (default 3D)
-q		minimize status reporting
-r<int>	specify non-default reference frame
-s		enable stretch
-v[0|1]	disable/enable per frame intensity normalization (default disabled)
-w		enable wrap addressing
-Z		output undefined voxels as 0.0 (default 1.0e-37)
-R		disable resampling
=======	===================================================================

.. _t4_xr3d_4dfp:

t4_xr3d_4dfp
------------
motion correct and resample in atlas space in one step

Usage:	t4_xr3d_4dfp [options] <t4file> <input_4dfp_stack>

Examples::

	t4_xr3d_4dfp -aatl anat_ave_to_711-2B_t4 b1_rmsp_dbnd

Options

=======	===============================================================
-a<str>	specify outfile name trailer (default = "xr3d")
-c<flt>	scale output by specified factor
-N		output undefined voxels as NaN
-Z		output undefined voxels as 0
-E		output undefined voxels as 1.e-37 (default)
-v[0|1]	set per frame intensity equalization mode (default = OFF)
-@<b|l>	output big or little endian (default input endian)
-f		fast (linear interpolation resample instead of 3D cubic spline)
-e		echo mat file to stdout frame by frame (verbose mode)
-O111	output in 111 space
-O222	output in 222 space
-O333.n	output in 333.n space (y shifted up by n pixels)
-O<str>	output image dimensions according to <str>.4dfp.ifh
=======	===============================================================

N.B.:	default output format = 333.0

.. _mat2dat:

mat2dat
-------
convert cross_realign3d_4dfp mat files to spread sheet format
Usage:	mat2dat <mat_file>

Examples::

	mat2dat atten5_b1_rms4_dbnd_xr3d[.mat]

Options

=============	======================================================================
-I				save trajectory as 4dfp
-R				save trajectory relative to run mean (remove accumulated movememnt)
-D				save differentiated trajectory
-L				write local (in $cwd) (default write parallel to <mat_file>)
-n<int>			specify number of pre steady state frames (default=0)
-l<int>			lowpass filter (< 0.1 Hz) specified motion parameter (counting from 1)
 TR_vol=<flt>	specify TR_vol in sec (required only with option -l)
-r<flt>			specify head radius in mm for total motion computation (default=50mm)
-f<str>			specify frames to count format, e.g., "4x120+4x76+"
=============	======================================================================

N.B.:	-f option overrides -n

.. _frame_align_4dfp:

frame_align_4dfp
----------------
correct asynchronous slice acquisition

Usage: frame_align_4dfp <(4dfp) input> <frames_to_skip> [options]

Examples::

	frame_align_4dfp bold_run.4dfp.img 4 -TR_vol 2.5 -TR_slc .136 -d 1
	frame_align_4dfp bold_run.4dfp.img 4 -TR_vol 2.5 -TR_slc .136 -seqstr 1,8,5,2,9,6,3,10,7,4


Options

=============	==============================================================================================
-N				enable interleaved order 2,4,6,...,1,3,5,... for even total slice counts
-S				specify sequential slice acquisition (default interleaved)
-d <0|1>		specify slice acquisition direction (0:Inf->Sup; 1:Sup->Inf) (default=0)
-m <int>		specify multi-band factor) (default=1)
-seqstr <str>   specify [MB] slice sequence (counting from 1) as a comma-separated (no spaces) integer string
-TR_vol <flt>	specify frame TR in sec (default=2.36)
-TR_slc <flt>	specify slice TR in sec (default=TR_vol/nslice)
=============	==============================================================================================

N.B.:	space between option and value

interp_4dfp
-----------
correct asynchronous slice acquisition and resample in time

Usage:	interp_4dfp <(4dfp) image> <TR_vol_in> <TR_slice_in> <TR_vol_out>

Examples::

	interp_4dfp bold_run[.4dfp[.img]] 2.25 .136 2.5

Options

=======	========================================================================
-d<0|1> specify slice acquisition direction (0:Inf->Sup; 1:Sup->Inf) (default=1)
-@<b|l>	output big or little endian (default input endian)
=======	========================================================================

N.B.: if <TR_slice_in> is input as 0 slices are spaced evenly on TR_vol

jitter
------
optimally distribute n events on m frames

.. TODO: add Avi's thoughts on randomization

Usage:	jitter <(int) nevent> <(int) nframe> <(flt) tr_vol>

Examples::

	jitter 20 100 2.0 -s4

Options

=======	=============================================================================
-r<int>	specify randomization seed (default=0)
-s<int>	add specified number of skip frames to output event series (default=0)
-g<flt>	specify max interval in sec (t_max; default=30.00) (ignored when -F specfied)
-m<flt>	specify min interval in sec (t_min; default=tr_vol)
-o<str>	output named fidl-type event file
-v		verbose mode
-F		use flat distribution of delay intervals (default Poisson process)
=======	=============================================================================

N.B:	nevent must be at least 3 |br|
N.B:	first event is ALWAYS on frame skip; last  event is ALWAYS on frame skip + nframe, duration = Inf; fMRI run should include additional frames at end |br|

.. [1] Only needed for older sequences
