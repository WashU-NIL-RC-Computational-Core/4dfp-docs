.. include:: ../../global.rst

.. _misc:

Miscellaneous scripts
=====================

.. _freesurfer2mpr_4dfp:

freesurfer2mpr_4dfp
-------------------
transform freesurfer generated images back to atlas space

Usage:	freesurfer2mpr_4dfp <(4dfp) mpr> <(4dfp) orig> [options]

Examples::

	freesurfer2mpr_4dfp vc1234_654-3[.4dfp.img] vc1234_orig
	freesurfer2mpr_4dfp vc1234_654-3 vc1234_orig -T711-2V -alh.ribbon.mgz -arh.ribbon apply

Options

==========	=============================================================================
-skew		general affine orig->mpr registeration (default 6 parameter rigid body)
-T<target>	specify atlas representative target
-a<segimg>	add named (4dfp format) freesurfer segemntation result to "apply" list
apply		proceed directly to transform (4dfp format) segmentations
force		force atlas transformation of segmentation results even if it already exists
setecho		set echo
==========	=============================================================================

N.B.:	<(4dfp) orig> is the freesurfer-resampled 256x256x256 coronal mpr |br|
N.B.:	the default "apply" list includes (4dfp format) images named \*parc\* and \*aseg\* |br|

.. tip:: You must convert the freesurfer-created mgz (i.e. orig, aparc+aseg) images to 4dfp before running this script. For more details, see :ref:`fs-roi-example`.

split_ROIs
----------
split peak_4dfp ROI image into multiple mask images

Usage:	split_ROIs <4dfp ROI file> [start_ROI_number] [end_ROI_number] [options]

Examples::

	split_ROIs sum_condition_time_anova_ROI[.4dfp[.img]] 0 82

Options

========================	===================================================================
[<start|end>_ROI_number]	ROI numbers count from 0 (fidl convention) (defaults are 0, nROI-1)
-x							flip ROI to contralateral hemisphere
-0							name output mask file by ROI number (default name as in ifh)
-d<int>						specify difference between ROI number and voxel value (default 2)
========================	===================================================================

N.B.:	split_ROIs output files are put into the subdirectory ./single_ROIs

.. _brec:

brec
----
parse rec file by procedure depth

Usage:	brec <my_file[.rec]> [-depth_limit]
