.. include:: ../../global.rst

.. _filter_in_time:

Filter in time
==============

.. _bandpass_4dfp:

bandpass_4dfp
-------------
Independent specification of low and high ends; remove linear trends; remove DC

Usage:	bandpass_4dfp <(4dfp|conc) input> <TR_vol>

Examples::

	bandpass_4dfp qst1_b1_rmsp_dbnd_xr3d[.4dfp.img] 2.36 -bl0.01 -ol1 -bh0.15 -oh2

Options

============	=================================================================================
-b[l|h]<flt>	specify low end or high end half frequency in hz
-o[l|h]<int>	specify low end or high end Butterworth filter order
-n<int>			specify number of pre-functional frames (default = 0)
-I<int>			specify interpolation mode (0 = none; 1 = linear; 2 = cubic spline) (default = 1)
-f<string>		specify frames-to-count format (overrides option -n)
-F<string>		read frames-to-count format from specified file (overrides options -n and -f)
-t<str>			change output filename trailer (default="_bpss")
-a				retain DC (constant) component
-r				retain linear trend
-E				code undefined voxels as 1.e-37
-M				disable undefined mask computation
-B				compute gain using correct Butterworth formula (default squared Butterworth gain)
-@<b|l>			output big or little endian (default input endian)
============	=================================================================================

N.B.:	undefined values are zero, NaN, or 1.e-37 |br|
N.B.:	input conc files must have extension "conc" |br|
N.B.:	omitting low  end order specification disables high pass component |br|
N.B.:	omitting high end order specification disables low  pass component
