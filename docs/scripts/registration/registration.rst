.. include:: ../../global.rst

.. _registration:

Registration scripts
====================

mpr2atl_4dfp
------------
single T1W :math:`\rightarrow` atlas

Usage:	mpr2atl_4dfp <mpr_anat> [options]

Examples::

	mpr2atl_4dfp vc1234_654-3[.4dfp.img]
	mpr2atl_4dfp vc1234_654-3[.4dfp.img] -T/data/petsun23/data1/atlas/NP345_111[.4dfp.img] -S711-2B

Options

===========================		=======================================================
711-2<C|O|Y|K|L|G|H|V|F> 		specify 711-2? series atlas representative target image
-T<target including path>		specify arbitrary atlas representative target image
-S<atlas space>*				specify atlas space (default=711-2B space)
crossmodal						use cross-modal mpr->target registration
useold							suppress recomputation  of existing t4 file
redo							suppress initialization of existing t4 file
setecho							set echo
===========================		=======================================================

N.B.:	<mpr_anat> may include a path, e.g., /data/petmr1/data7/stem9/scout/654-3 |br|
N.B.:	<mpr_anat> must be in either ANALYZE short int or 4dfp format; ANALYZE will be converted to 4dfp |br|

.. _mpr2atl1_4dfp:

mpr2atl1_4dfp
-------------
T1W :math:`\rightarrow` atlas

Usage:	mpr2atl1_4dfp <mpr_anat> [options]

Examples::

	mpr2atl1_4dfp vc1234_654-3[.4dfp.img]
	mpr2atl1_4dfp vc1234_654-3[.4dfp.img] -T/data/petsun23/data1/atlas/NP345[.4dfp.img]

Options

=========================	===================================================
-T<target including path>	specify arbitrary atlas representative target image
crossmodal					use cross-modal mpr->target registration
useold						suppress recomputation of existing t4 file
redo						suppress t4 file initialization
setecho						set echo
=========================	===================================================

.. _avgmpr_4dfp:

avgmpr_4dfp
-----------
multiple T1W :math:`\rightarrow` atlas

Usage:	avgmpr_4dfp <img1> <img2> ... <avgout> [useold] [711-2<B-Z> OR -T<Target including path>]

Examples::

	avgmpr_4dfp va2345_mpr1 va2345_mpr2 va2345_mpr3 va2345_mpr4 va2345_mpr_n4
	avgmpr_4dfp va2345_mpr1 va2345_mpr2 va2345_mpr3 va2345_mpr4 none

Options

======	=======================================================================================
useold	suppresses unnecessary recomputation of atlas transformation, e.g., <img1>_to_711-2B_t4
======	=======================================================================================

N.B.:	Each named image must be in 4dfp format and acquired in the same subject. Mixed orientations are allowed. Any component image filename may include a unix path.

N.B.:	If <avgout> = "none", t4 and lst files will be generated but averaged images will not.

t2w2mpr_4dfp
----------------------
T2W :math:`\rightarrow` T1W :math:`\rightarrow` atlas [1]_

Usage:	t2w2mpr_4dfp <4dfp mprage> <4dfp t2w> [options]

Examples::

	t2w2mpr_4dfp vc6383_130-4 vc6383_130-5

Options

==========	=========================================================
-T<target>	specify atlas target (<target> may include absolute path)
nostretch	disable stretch
setecho		set echo
debug		debug mode
==========	=========================================================

N.B.:	t2w2mpr_4dfp assumes that <4dfp mprage> is in the current working directory
and that its atlas transform, e.g., vc6383_130-4_to_711-2V_t4 exists and is in the current working directory

epi2t1w_4dfp
----------------------
EPI :math:`\rightarrow` T1W  [1]_

Usage:	epi2t1w_4dfp <4dfp epi> <4dfp t1w> <tarstr>

Examples::

	epi2t1w_4dfp 070630_4TT00280_t1w 070630_4TT00280_anat_ave -T/data/cninds01/data2/atlas/TRIO_Y_NDC

N.B.:	epi2t1w_4dfp assumes that the <4dfp t1w> atlas transform, e.g.,070630_4TT00280_t1w_to_TRIO_Y_NDC_t4
exists and is in the current working directory

N.B.:	<tarstr> is either '711-2?' or '-T/targetpath/target'

make_mprage_avg_4dfp
------------------------------
compute T1W anatomical average for group (list directed) [1]_

Usage:	make_mprage_avg_4dfp <study_id> <t4file_list>

Examples::

	make_mprage_avg_4dfp NP659_all NP659_mpr_t4.lst

N.B.:	the output average will be named <study_id>_mpr_avg

N.B.:	make_mprage_avg_4dfp assumes that the MP-RAGE 4dfp image files are in the same directories together their atlas transform t4files

N.B.:	<t4file_list> should list the t4files including path (e.g.:
vc12605c/PROCESSED/vc12605c_949-3_to_711-2Y_t4)

Inputs

t4file_list
	ls vc?????c/PROCESSED/\*t4 | awk '$1 !~/anat/' >! <t4file_list>


msktgen_4dfp
----------------------
create tailored mask (by inversion of atlas transform) [1]_

Usage:	msktgen_4dfp <(4dfp) image> [threshold] -T<target including path>  -S<atlas space>

Examples::

	msktgen_4dfp 4859-5_mpr
	msktgen_4dfp 4859-5_mpr -T/data/petsun29/data1/atlas/NP345_111[.4dfp.img] -S711-2B

Options

===============	======================================================================================================
threshold		specify threshold for mask (default is 200) - use a higher threshold for a tighter mask and vice versa
-S<atlas space>	specify atlas space (default=711-2B space)
-T<target>		specify atlas target
===============	======================================================================================================

N.B.:	msktgen_4dfp uses the first legitimate atlas transform t4 file it sees in
	the current working directory, i.e., one of <image>_to_711-2*_t4 or  one of <image>_to_<target>_t4

cross_mpr_imgreg_4dfp
-------------------------------
compute cross-session T1W atlas transform [1]_

Usage:	cross_mpr_imgreg_4dfp <session1_abspath> <session2_abspath> <target>

Examples::
	cross_mpr_imgreg_4dfp /data/disk1/P44W_16800_L1 /data/disk2/P44W_16800_L2 711-2L
	cross_mpr_imgreg_4dfp /data/disk1/P44W_16800_L1 /data/disk2/P44W_16800_L2 /bmr01/01/nmrgrp/avi/P44W_C_111

N.B.:	<target> may be of the form '711-2[B-Z]' OR '-T[mypath/]mytarget'

N.B.:	cross_mpr_imgreg_4dfp assumes that each session patid is <sessionpath>:t

newatl_init_4dfp
--------------------------
initialize creation of a cohort-specific atlas-representative target image [1]_

.. Attention:: After successful execution, execute newatl_refine_4dfp

Usage:	newatl_init_4dfp <t4list> <newatl>

Examples::

	newatl_init_4dfp symph-mpr_to_711-2B_t4.lst 711-2S

Options

==	=================================================================================================
-m	mask all input images (each input image must be paired with a 4dfp mask named <input_image>_mask)
==	=================================================================================================

N.B.:	<t4list> is a text file listing the absolute addresses of extant atlas transform
	t4files corresponding to a set of structural images

N.B.:	<newatl> specifies the name of the new atlas representative target image

N.B.:	<t4list> itself and the t4files named in it may exist in other directories

N.B.:	all images (\*.4dfp.img and \*.4dfp.ifh) referred to in <t4list> must exist
	either in their original directory or in the current working directory -
	newatl_init_4dfp will copy these images into the cwd as necessary

newatl_refine_4dfp
----------------------------
refine cohort-specific atlas-representative target image [1]_

.. Attention:: Execute after successful completion of newatl_init_4dfp

Usage:	newatl_refine_4dfp	<newatl>

Examples::

	newatl_refine_4dfp 711-2S

Options

=======	==================================================================================================
-b		suppress gauss 1.1 pre-blur of component images
-m		mask all input images ((each input image must be paired with a 4dfp mask named <input_image>_mask)
-T<str>	set reference target to specified image (default = /data/petsun43/data1/atlas/711-2B)
=======	==================================================================================================

N.B.:	<newatl> specifies the name of the new atlas representative target image

N.B.:	all images (\*.4dfp.img and \*.4dfp.ifh) referred to in <newatl>.lst must exist in the working directory

.. [1] Assumes pre-existing atlas-transform t4 file
