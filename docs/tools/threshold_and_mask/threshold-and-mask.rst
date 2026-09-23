.. include:: ../../global.rst

.. _threshold_and_mask:

Threshold and mask
==================

zero_slice_4dfp
---------------
zero specified range of slices in selected direction

Usage:	zero_slice_4dfp <4dfp image>

Examples::

		zero_slice_4dfp vce20_mpr -z1to3
		zero_slice_4dfp vce20_mpr <x|y|z> istart iend [outroot]

Options

====================	====================================================
-<x|y|z><int>to<int>	specify x y z limits (single required argument mode)
-f						interpret slice numbers using 4dfp<->analyze flips
-o						specify output fileroot (default = <image>z)
-@<b|l>					output big or little endian (default input endian)
====================	====================================================

N.B.:	slices count from 1 |br|
N.B.:	two usages are supported: 1 or 4 required arguments

zero_lt_4dfp
------------
threshold by voxel value

Usage:	zero_lt_4dfp <flt> <file_4dfp> [outroot]

Examples::

	zero_lt_4dfp 90 pt349_study9to9
	zero_lt_4dfp 90 pt349_study9to9 pt349_study9to9z

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output 4dfp root is <file_4dfp>"z"

zero_gt_4dfp
------------
threshold by voxel value

Usage:	zero_gt_4dfp <flt> <(4dfp) image> [outroot] [options]

Examples::

 	zero_gt_4dfp 90 pt349_study9to9
 	zero_gt_4dfp 90 pt349_study9to9 pt349_study9to9z

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output 4dfp root is <(4dfp) image>"z" |br|
N.B.:	first field can't be used for options because threshold might be negative

.. _zero_ltgt_4dfp:

zero_ltgt_4dfp
--------------
zero voxels **outside** specified range

Usage:	zero_ltgt_4dfp <flt[to<flt>]> <(4dfp) image> [outroot] [options]

Examples::

	zero_ltgt_4dfp -30to90 pt349_study9to9

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	default output 4dfp root is <(4dfp) image>"z" |br|
N.B.:	first field can't be used for options because lower range might be negative

zero_gtlt_4dfp
--------------
zero voxels **within** specified range

Usage:	zero_gtlt_4dfp <flt[to<flt>]> <(4dfp) image> [outroot] [options]

Examples::

	zero_gtlt_4dfp -30to90 pt349_study9to9

Options

=======	==================================================
-@<b|l>	output big or little endian (default input endian)
======= ==================================================

N.B.:	default output 4dfp root is <(4dfp) image>"z" |br|
N.B.:	first field can't be used for options because lower range might be negative

.. _maskimg_4dfp:

maskimg_4dfp
------------
apply 4dfp mask to 4dfp image

Usage:	maskimg_4dfp <(4dfp) imgfile> <(4dfp) mskfile> <(4dfp) outfile>

Examples::

	maskimg_4dfp -t23.2 va1234_mpr mask va1234_mpr_msk

Options

=======	===========================================================
-N		replace NaN in <imgfile> with corresponding <mskfile> value
-e		report to stdout mean <imgfile> within-mask value
-1		apply first frame of <mskfile> to all frames of <imgfile>
-R		suppress creation of rec file
-v<flt>	specify <outfile> uniform within-mask value
-p<flt>	specify <mskfile> threshold as percent of <mskfile> max
-t<flt>	specify <mskfile> threshold directly (default = 0.0)
-A		threshold mask by absolute value of <mskfile>
-@<b|l>	output big or little endian (default <imgfile> endian)
=======	===========================================================

N.B.:	<imgfile> and <mskfile> may be the same

cluster_4dfp
------------
sort/count/zero (above threshold) contiguous voxels into clusters

Usage:	cluster_4dfp <(4dfp) root>

Examples::

	cluster_4dfp my_timage -At3.5

Options

=======	============================================================================================
-n<int>	zero out clusters with voxel count below specified criterion (output image trailer = 'clus')
-f<int>	address specified volume (counting from 1) of multi-volume stack (default is first volume)
-t<flt>	specify image value threshold (default = 0)
-a<str>	append specified string (preceded by "_") to all output filenames
-@<b|l>	output big or little endian (default input endian)
-A		apply threshold test to image absolute value
-R		convert clusters to (fidl compliant) ROI image (output image trailer = 'ROI')
-l		create list file of region center of mass indices
-v		verbose mode
=======	============================================================================================

N.B.:	-l center of mass indices can be converted to atlas coordinates using index2atl -af
