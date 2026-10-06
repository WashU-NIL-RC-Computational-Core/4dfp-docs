.. include:: ../../global.rst

.. _glm_and_related_operations:

GLM and related operations
==========================

.. _glm_4dfp:

glm_4dfp
--------
multivariate voxelwise regression/correlation

Usage:	glm_4dfp <format|fmtfile> <profile> <4dfp|conc input>

Examples::

	glm_4dfp "4x124+" doubletask.txt b1_rmsp_dbnd_xr3d_norm

Options

=======	===========================================================================
-Z		supress automatic removal of mean from input regressors
-C<str>	read  partial beta coefficients from specified 4dfp image (default compute)
-o[str]	save  partial beta images with specified trailer (default = "coeff")
-R   	compute  partial beta images as percent modulation
-b[str]	save  total   beta images with specified trailer (default = "tbeta")
-p[str]	save  partial corr images with specified trailer (default = "pcorr")
-t[str]	save  total   corr images with specified trailer (default = "tcorr")
-r[str]	save  residual timeseries with specified trailer (default = "resid")
-@<b|l>	output big or little endian (default input endian)
=======	===========================================================================

N.B.:	conc files must have extension "conc"  |br|
N.B.:	<profile> lists temporal profiles (ASCII npts x ncol; '#' introduces comments) |br|
N.B.:	<profile> line limits are 81920 chars and 8192 fields |br|
N.B.:	absent -C, options -o and -r require design matrix inversion; dimension limit 256

.. _actmapf_4dfp:

actmapf_4dfp
------------
voxelwise evaluate timeseries inner product against reference waveform

Usage:	actmapf_4dfp <format|fmtfile> <4dfp|conc input>

Examples::

	actmapf_4dfp -zu "3x3(11+4x15-)" b1_rmsp_dbnd_xr3d_norm
	actmapf_4dfp -aanatomy -c10 -u "+" ball_dbnd_xr3d.conc
	actmapf_4dfp -zu "4x124+" b1_rmsp_dbnd_xr3d -wweights.txt

Options

===============	=====================================================
-a<str>			specify 4dfp output root trailer (default = "actmap")
-c<flt>			scale output by specified factor
-u				scale weights to unit variance
-z				adjust weights to zero sum
-R				compute relative modulation (default absolute)
-w<weight file>	read (text) weights from specified filename
-@<b|l>			output big or little endian (default input endian)
===============	=====================================================

N.B.:	conc files must have extension "conc" |br|
N.B.:	when using weight files 'x' frames in format are not counted |br|
N.B.:	relative modulation images are zeroed where mean intensity < 0.5*whole_image_mode

GC_4dfp
-------
Granger causality mapping
Usage:	GC_4dfp <format> <4dfp|conc input> <order>

Examples::

	GC_4dfp "4(4x190+)" VB20579_rmsp_faln_dbnd_xr3d_atl.conc 2

Options

=======	=================================================================
-w<str>	specify timecourse profile file (one or more columns)
-i<int>	use only specified column (counting from 1) of timecourse profile
-a<str>	append specifed string to map output
-g		write lagged covariance (gamma) 4dfp stack
-D		write difference of directed influences (Fx->y - Fy->x) map
-Z		write Geweke "N(0,2)" measure (difference of square roots) map
-F		write Fx,y, Fx->y, Fy->x, Fx.y map stack
-@<b|l>	output big or little endian (default input endian)
=======	=================================================================

N.B.:	conc files must have extension "conc" |br|
N.B.:	effective frame count is determined by <format> |br|
N.B.:	'x' frames in format are not counted

GC_dat
------
Granger causality on ASCII column data

Usage:	GC_dat <format> <input_datafile> <order>

Examples::

	GC_dat "4x106+" ROI_timeseries.dat 2

Options

=======	==================================================
-d		debug mode
-v		verbose mode
-u		normalize all input timeseries to unit variance
-x<int>	specify dimensionality of x process (default = 1)
-m		create text listing of AR model
-w		write residual after full AR modeling
-P		format residual output suitable for plotting (xyy)
=======	==================================================

.. _covariance:

covariance
----------
covariance, correlation, coherence, etc. on ASCII column data

Usage:	covariance <format|fmtfile> <profile>

Examples::

	covariance "4x124+" doubletask.txt

Options

=======	===============================================================================
-q		quiet mode
-t		optionally remove trend (ramp) from input timeseries
-u		optionally normalize all input timeseries to unit variance
-o		output lagged CCV dat files (CCR with -u)
-a		output lagged ACV dat file  (ACR with -u)
-r		output Bartlett smoothed cross spectra (spectral density with -u)
-p		output Bartlett smoothed auto  spectra (spectral density with -u)
-e		compute eigenvectors of lag 0 CCV
-L		read ROI labels from <profile> (default ignore '#' commented lines)
-T<int>	additionally smooth spectra with Tukey window of specified width (in frames)
-d<flt>	specify frame TR in sec for Fourier analysis (default = 1.0000)
-m<int>	specify CCV function maxumum lag in frames (default = 32)
-D<flt>	SVD lag 0 CCV and output new profile with cndnum < specified value (implies -e)
-g<str>	regress timeseries in named file out of <profile>
=======	===============================================================================

N.B.:	all input timeseries are made zero mean as a first step |br|
N.B.:	region names can be specified on the first line of <profile> with '#' in the first column
