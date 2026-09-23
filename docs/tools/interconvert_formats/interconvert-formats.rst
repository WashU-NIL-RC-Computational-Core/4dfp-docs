.. include:: ../../global.rst

.. _interconvert_image_formats:

Interconvert image formats
==========================

.. _dcm_to_4dfp:

dcm_to_4dfp
-----------
DICOM :math:`\rightarrow` 4dfp

Usage:	dcm_to_4dfp [-b base] [-d gggg eeee] [-f] [-g] [-u] file(s)

Slice Spacing Options: [-c] [-t <flt> or S or T]

Slice Position Options: [-X] [-Y] [-Z]

Examples::

 	dcm_to_4dfp *
   	dcm_to_4dfp -b ID101 -f -g -u *IMA
   	dcm_to_4dfp -d 0008 0030 -t 4.98 -g *.dcm
   	dcm_to_4dfp -b P0089 -t T -g mydir/*

Options

==============	===============================================================================
[-b base] 		Output base filename follows the -b
[-c]	    	Slice Spacing: By Image Position (0020 0032)
[-d gggg eeee] 	Divide series by group and element number (Default: ID series time (0008 0031))
[-f]	    	Directories will be created, and dicom files will be moved
[-g]	    	Add image name, XYZ relative position, and number to rec file
[-q]      		 Slice Spacing: Do not compute by Image Position
[-r]       		Rescale: Use the rescale slope and intercept fields
[-t <flt>] 		Slice Spacing: Use input value.[-t <flt>]
[-t T]     		Slice Spacing: Use Slice Thickness 0018 0050.[-t T]
[-t S]     		Slice Spacing: Use Slice Spacing 0018 0088 [-t S]
[-u]			Output files named using sequence tag 0018 0024 plus number
==============	===============================================================================

4dfp Coordinant System is determined by Image Position (0020 0032).
Multivolume and BOLD images are ordered by REL Image Number (0020 0013).
[-X]	Sagittal:	image positions will be ordered low to high
[-Y]	Coronal:	image positions will be high to low
[-Z]	Transverse:	image positions will be high to low
[-@ <b|l>]	output big or little endian (default CPU endian)

N.B.: -t S is the default slice spacing |br|
N.B.: Default slice position is transverse ordered by REL Image Number (0020 0013)

endian_4dfp
-----------
report status and interconvert big :math:`\leftrightarrow` little endian

Usage:	endian_4dfp <(4dfp) image>

Options

=========	=============================================
-@<b|l|c> 	make <(4dfp) image> big, little or CPU endian
-t			perform var(log(fabs(.))) test
=========	=============================================

N.B.:	<(4dfp) image> may be overwritten |br|
N.B.:	absent option -@ endian_4dfp only reports state of <(4dfp) image>

4dfptoanalyze
-------------
4dfp :math:`\rightarrow` analyze 7.5

Usage:	4dfptoanalyze <(4dfp) filename>

Options

=======	===================================================================================
-c<flt>	scale output values by specified factor
-8		output 8 bit unsigned char
-SPM99	include origin and scale in hdr (http:/wideman-one.com/gw/brain/analyze/format.doc)
-@<b|l>	output big or little endian (default CPU endian)
=======	===================================================================================

analyzeto4dfp
-------------
analyze 7.5 (int or char) :math:`\rightarrow` 4dfp

Usage: analyzeto4dfp <analyze_image>

Options

=======	=================================================
-s		apply SPM2 ROIScaleFactor
-x		flip first  axis
-y		flip second axis
-z		flip third  axis
-@<b|l>	toutput big or little endian (default CPU endian)
-O<int>	supply orientation code (in range [0-5])
=======	=================================================

N.B.:	to convert SPM2 use options -x and -s

ifh2hdr
-------
create analyze 7.5 header

Usage:	ifh2hdr <(4dfp) file>

examples::

	ifh2hdr vc654_mpr_atl -r-500to1500

Options

================	=========
-r<flt>[to<flt>]	set range
================	=========

hdr2txt
-------
dump analyze 7.5 header info

Usage: hdr2txt <analyze_image>

Examples::

	hdr2txt brain_asig[.hdr]

index2atl
---------
convert atlas indices (ASCII text) to mm (e.g. atlas coordinates)

Usage: index2atl <(4dfp) ifhroot> <index_list_file>

Examples::

	index2atl -af time_BOXzstat_333_t88.4dfp.ifh time_BOXzstat_333_t88_index.lst

Options

=======	============================================================================
-f		input indices use FORTRAN convention (first index=1) (default first index=0)
-a		indices were read under orientation-specific 4dfp<->analyze flips
-o<str>	output coordinates to specified file
=======	============================================================================

N.B.:	<(4dfp) ifhroot> corresponds to the 4dfp image from which the indices were read

asciito4dfp
-----------
convert text columns to 4dfp format timeseries

Usage:	asciito4dfp <text file> <(4dfp) out>

Options

=======	================================================
-@<b|l> output big or little endian (default CPU endian)
=======	================================================

N.B.:	columns in <text file> map to voxels in <(4dfp) out> |br|
N.B.:	'#' in <text file> introduce comments |br|
N.B.:	<text file> lines beginning with '#' are included in <(4dfp) out>.img.rec

mpetto4dfp
----------
convert microPET images  4dfp

Usage:	mpetto4dfp <microPET_data>

Examples::

	mpetto4dfp m1042-cft1_v1

Options

=======	===============================================================
-x		flip x
-y		flip y
-z		flip z
-w		create frame duration listing for use with actmapf_4dfp -w
-c<flt>	scale all voxel values by specified factor
-o<str>	name 4dfp output using specified string (default same as input)
-@<b|l> output big or little endian (default input endian)
=======	===============================================================

vto4dfp
-------
Varian fid/procpar :math:`\rightarrow` 4dfp

Usage:	vto4dfp <varian file path>

Examples::

	vto4dfp /home/usr/shimonyj/vto4dfp/hard_010703 -odwi_010703

Options

=======	====================================================================
-v		verbose mode
-D		suppress subtraction of k-space DC offset
-I		perform Fourier interpolation; output voxel count will be quadrupled
-F		phase reverse odd echos in multi-echo data
-o<str>	specify 4dfp outroot (default="fid")
-c<flt>	intensity scale output (mag) image by specified constant
-m<flt>	scale voxel dimensions by specified constant
-@<b|l>	output big or little endian (default CPU endian)
=======	====================================================================

N.B.:	vto4dfp expects <varian file path> to contain files "fid" and "procpar"

.. _nifti_4dfp:

nifti_4dfp
----------
interconvert nii :math:`\leftrightarrow` 4dfp

Usage: nifti_4dfp -<4|n> <infile> <outfile> [options]

Examples::

	nifti_4dfp -n time_BOXzstat_333_t88.4dfp.ifh time_BOXzstat_333_t88.nii

Options

============	================================================================
-T <t4 file>	specify a t4 file to use converting TO NIfTI from 4dfp
-n				convert TO NIfTI from 4dfp
-4				convert TO 4dfp from NIfTI
-N				suppress saving of mmppix and center fields in output ifh
-@<val>			specify endianness for output, b or B for big, l or L for little
============	================================================================

N.B.:	exactly one of -4 or -n must be specified |br|
N.B.:	".4dfp.ifh" or ".nii" are appended to filenames specified without extension |br|
N.B.:	option -N has effect only on converting nii->4dfp |br|
N.B.:	option -T has effect only on converting 4dfp->nii

niftigz_4dfp
------------
interconvert nii.gz :math:`\leftrightarrow` 4dfp (:ref:`nifti_4dfp` wrapper)

Usage:	niftigz_4dfp -<4|n> <infile> <outfile> [options]

Examples::

	niftigz_4dfp -4 VB18896_mpr_n1_333_t88.nii.gz VB18896_mpr_n1_333_t88

Options (for more options, see :ref:`nifti_4dfp`)

=======	=====================================================================
-v		verbose mode
-s<int>	skip specified number of frames at run start on 4dfp->NIfTI coversion
=======	=====================================================================

N.B.:	niftigz_4dfp always gzips NIfTI output but unzipped NIfTI input is left unchanged |br|
