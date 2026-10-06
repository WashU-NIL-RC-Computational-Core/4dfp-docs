.. include:: ../../global.rst

.. _rearrange_voxels_in_space_or_time:

Rearrange voxels in space or time
=================================

.. _collate_slice_4dfp:

collate_slice_4dfp
------------------
collate interleaved datasets

Usage:	collate_slice_4dfp <4dfp img1> <4dfp img2> ... <4dfp imgn> <4dfp imgout>

Options

=======	================================================
-v		verbose mode
-@<b|l>	output big or little endian (default CPU endian)
=======	================================================

.. _paste_4dfp:

paste_4dfp
----------
append or average selected frames from multiple files (list directed)

Usage:	paste_4dfp <inlist> <outfile>


:code:`inlist` is a file containing rows of 1 to 3 columns: filename, starting frame (counting from 1), number of frames.

	.. note::

		* If a starting frame (column 2) is not specified, the first frame will be used.
		* Column 3 is only applied during append mode (-a). The period value (-p) will be used otherwise.
		* In append mode, column 3 has priority over the -p flag. The period value (-p) will only be used for rows that do not specify column 3.

Options

=======	==========================================================
-a		append successive epochs (default average)
-p<int>	specify period in frames (default=1)
-@<b|l>	output big or little endian (default initial input endian)
=======	==========================================================

.. _extract_frame_4dfp:

extract_frame_4dfp
------------------
extract single frame from stack (:ref:`paste_4dfp` wrapper)

Usage:	extract_frame_4dfp <(4dfp) stack> <(int) frame>

Examples::

	extract_frame_4dfp CDR.5to1+ 3

Options

=======	==============================================================
-o<str>	specifiy output 4dfp fileroot (default = <stack>_frame<frame>)
=======	==============================================================

chop_4dfp
---------
extract contiguous frames from stack (:ref:`paste_4dfp` wrapper)

usage:	chop_4dfp <(4dfp) stack> <(int) frame0> <(int) frame1>

Examples::

	chop_4dfp vb12345_b5_dbnd_xr3d[.4dfp[.img]] 4 68

Options

=======	=========================================================================
-o<str>	specify output 4dfp fileroot (default = <stack>_frames<frame0>to<frame1>)
=======	=========================================================================

crop_4dfp
---------
crop or roll (correct image wrap)

Usage:	crop_4dfp <(4dfp) inroot> [(4dfp) outroot]

Options

=======================	==============================================================================
-<x|y|z><int>[to[<int>]	specify x y z crop/expand limits (1-indexed)
-s<x|y|z><int>			scroll specified axis by specified number of pixels (after cropping/expanding)
-f						interpret specifications under 4dfp<->analyze flips
-Z						zero voxels instead of physically cropping
-@<b|l>					output big or little endian (default input endian)
=======================	==============================================================================

N.B.:	if upper crop limit exceeds input dimension undefined voxels will be set to 1.e-37 |br|
N.B.:	default (4dfp) output root is <(4dfp) inroot>"_crop"

reindex_4dfp
------------
.. FIXME: figure out what these symbols are supposed to be

xy, slicevolume

Usage:	reindex_4dfp <(4dfp> input> <index1> <index2> [options]

Examples::

	reindex_4dfp my4Dstack 3 4

Options

=======	==============================================================
-v		verbose mode
-o<str>	specify 4dfp output root (default = <input>_r<index1><index2>)
-@<b|l>	output big or little endian (default input endian)
=======	==============================================================

N.B.:	reindex_4dfp swaps specified indices |br|
N.B.: <index1> and <index2> must be unequal integers in the range 1-4 except as follows: |br|
<index1> == 4 and <index2> == 0: right rotate indices (first index <-  last index) |br|
<index1> == 0 and <index2> == 4:  left rotate indices ( last index <- first index)

.. _unpack_4dfp:

unpack_4dfp
-----------
mosaic :math:`\rightarrow` volume

Usage:	unpack_4dfp <(4dfp) input> <(4dfp) output>

Examples::

	unpack_4dfp 030211_EL_b_1 030211_EL_b1

Options

========	==================================================
-V			read frame count from input ifh slice count
-R			multiply output x and y voxsiz by pack factor
-z			flipz (unpack slices in reverse order)
-y			flipy
-nx<int>	specify unpacked nx (default=64)
-ny<int>	specify unpacked ny (default=64)
-sx<int>	squeeze unpacked x dimension by specified factor
-sy<int>	squeeze unpacked y dimension by specified factor
-@<b|l>		output big or little endian (default input endian)
========	==================================================

multipack_4dfp
--------------
volume :math:`\rightarrow` mosaic

flip_4dfp
---------
flip x, y, z

Usage:	flip_4dfp <(4dfp) image> [(4dfp) output]

Examples::

	flip_4dfp -yz vc345 vc345_flipyz

Options

=======	==================================================
-x		flip x
-y		flip y
-z		flip z
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output fileroot = <image>_flip[xyz]

split_4dfp
----------
split assembled volumes

T2S_4dfp
--------
transverse :math:`\rightarrow` sagittal

Usage:	T2S_4dfp <(4dfp) imgroot> [(4dfp) outroot]

Examples::
	T2S_4dfp vm6c_mpr
	T2S_4dfp vm6c_mpr vm6c_mprS

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output root = <imgroot>"S"

.. _s2t_4dfp:

S2T_4dfp
--------
sagittal :math:`\rightarrow` transverse

Usage:	S2T_4dfp <(4dfp) imgroot> [(4dfp) outroot]

Examples::

	S2T_4dfp vm6c_mpr
	S2T_4dfp vm6c_mpr vm6c_mprT

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output root = <imgroot>"T"

.. _c2t_4dfp:

C2T_4dfp
--------
coronal :math:`\rightarrow` transverse

Usage:	C2T_4dfp <(4dfp) image> [(4dfp) outroot]

Examples::

	C2T_4dfp vm6c_b1
 	C2T_4dfp vm6c_b1 vm6c_b1T

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output root = <imgroot>"T"

T2C_4dfp
--------
transverse :math:`\rightarrow` coronal

Usage:	T2C_4dfp <(4dfp) imgroot> [(4dfp) outroot]

Examples::

	T2C_4dfp vc12345_b1
	T2C_4dfp vc12345_b1 vc12345_b1C

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output root = <imgroot>"C"
