.. include:: ../../global.rst

.. _scripts_fmri:

fMRI oriented scripts
=====================

.. include:: ../../notes/params-file-tip.rst

.. _cross_bold_pp_161012:

cross_bold_pp_161012.csh
------------------------
generic EPI (BOLD) pre-processing

Usage:	cross_bold_pp_161012.csh <params file> [instructions_file]

Examples::

	cross_bold_pp_161012.csh VB16168.params

**Required parameters**

.. list-table::
	:widths: 15 15 60
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- irun
		- |irun_vals|
		- |irun_desc|
	* 	- fstd
		- |fstd_vals|
		- |fstd_desc|
	*	- mprs
		- |mprs_vals|
		- |mprs_desc|
	*	- inpath
		- |inpath_vals|
		- |inpath_desc|
	* 	- target
		- |target_vals|
		- |target_desc|
	*	- go
		- |go_vals|
		- |go_desc|
	*	- nx
		- |nx_vals|
		- |nx_desc|
	* 	- ny
		- |ny_vals|
		- |ny_desc|
	*	- skip
		- |skip_vals|
		- |skip_desc|
	*	- TR_vol
		- |TR_vol_vals|
		- |TR_vol_desc|
	*	- TR_slc
		- |TR_slc_vals|
		- |TR_slc_desc|
	*	- epidir
		- |epidir_vals|
		- |epidir_desc|
	* 	- economy
		- |economy_vals|
		- |economy_desc|
	*	- epi2atl
		- |epi2atl_vals|
		- |epi2atl_desc|
	*	- FDthresh
		- |FDthresh_vals|
		- |FDthresh_desc|
	*	- normode
		- |normode_vals|
		- |normode_desc|
	*	- dwell
		- |dwell_vals|
		- |dwell_desc|
	*	- ped
		- |ped_vals|
		- |ped_desc|
	* 	- rsam_cmnd
		- |rsam_cmnd_vals|
		- |rsam_cmnd_desc| (recommended: :ref:`one_step_resample`)

=============	===========================================================================================
Economy value	Files to be removed
=============	===========================================================================================
> 2				original bold run images
> 3				frame-aligned images (_faln)
> 4				cross-realigned avg images (_r3d_avg or xr3d_BC_avg if $BiasField) (only if $epi2atl == 0)
=============	===========================================================================================

**Field map correction parameters (required)**

========    ==============  =======================
Variable    Values          Description
========    ==============  =======================
**Option 1** (:ref:`measured_fm` - gradient echo)
---------------------------------------------------
gre         |gre_vals|      |gre_desc|
delta       |delta_vals|    |delta_desc|
TE_vol      |TE_vol_vals|   |TE_vol_desc|
**Option 2** (:ref:`measured_fm` - spin echo)
---------------------------------------------------
sefm        |sefm_vals|     |sefm_desc|
TE_vol      |TE_vol_vals|   |TE_vol_desc|
**Option 3** (:ref:`mean_fm`)
---------------------------------------------------
FMmean      |FMmean_vals|   |FMmean_desc|
**Option 4** (:ref:`basis_opt_fm`)
---------------------------------------------------
FMmean      |FMmean_vals|   |FMmean_desc|
FMBases     |FMBases_vals|  |FMBases_desc|
========    ==============  =======================

**Optional parameters**

.. include:: ../../notes/cross-bold-optional-tip.rst

.. list-table::
    :widths: 15	5 5 75
    :header-rows: 1

    *	- Variable
    	- Values
    	- Default
    	- Description
    *	- tse
    	- |tse_vals|
        -
    	- |tse_desc|
    *	- pdt2
    	- |pdt2_vals|
        -
    	- |pdt2_desc|
    * 	- day1_patid
    	- |day1_patid_vals|
        -
    	- |day1_patid_desc|
    *   - day1_path
        - |day1_path_vals|
        -
        - |day1_path_desc|
    *	- scrdir
    	- |scrdir_vals|
        -
    	- |scrdir_desc|
    * 	- sorted
        - |sorted_vals|
        - |sorted_default|
        - |sorted_desc|
    * 	- MB
    	- |MB_skip_vals|
        - |MB_skip_default|
    	- |MB_skip_desc|
    *	- sx
    	- |sx_vals|
        - |sx_default|
    	- |sx_desc|
    * 	- sy
    	- |sy_vals|
        - |sy_default|
    	- |sy_desc|
    * 	- E4dfp
    	- |E4dfp_vals|
        - |E4dfp_default|
    	- |E4dfp_desc|
    *	- use_anat_ave
    	- |use_anat_ave_vals|
        - |use_anat_ave_default|
    	- |use_anat_ave_desc|
    *	- min_frames
    	- |min_frames_vals|
        - |min_frames_crossbold_default|
    	- |min_frames_desc|
    *	- interleave
    	- |interleave_vals|
        -
    	- |interleave_desc|
    *	- seqstr
    	- |seqstr_vals|
        -
    	- |seqstr_desc|
    * 	- MBfac
    	- |MBfac_vals|
        - |MBfac_default|
    	- |MBfac_desc|
    * 	- lomotil
    	- |lomotil_vals|
        -
    	- |lomotil_desc|
    *	- BiasField
    	- |BiasField_vals|
        - |BiasField_default|
    	- |BiasField_desc|
    *	- FDtype
    	- |FDtype_vals|
        - |FDType_default|
    	- |FDtype_desc|
    *	- anat_aveb
    	- |anat_aveb_vals|
        -
    	- |anat_aveb_desc|
    *	- anat_avet
    	- |anat_avet_vals|
        - |anat_avet_default|
    	- |anat_avet_desc| (set excessively high to skip DVARS censoring)
    *	- cross_day_nostretch
    	- |cross_day_nostretch_vals|
        - |cross_day_nostretch_default|
    	- |cross_day_nostretch_desc|
    *	- Gad
    	- |Gad_vals|
        - |Gad_default|
    	- |Gad_desc|

**Additional optional parameters**

.. include:: ../../notes/any-value-warning.rst

.. list-table::
	:widths: 10 90
	:header-rows: 1

	*	- Variable
		- Description
	*	- goto_UNWARP
		- |goto_UNWARP_desc|
	*	- epi_zflip
		- |epi_zflip_desc|
	*	- Siemens_interleave
		- |Siemens_interleave_desc|
	*	- nounpack
		- |nounpack_desc|


**Processing steps**

.. list-table::
	:widths: 25 15 30
	:class: wrap-rows
	:header-rows: 1

	*	- Step description
		- Function
		- Output
	*	- Convert bold run DICOM data to 4dfp format
		- :ref:`dcm_to_4dfp`
		-
	* 	- Convert mosaic format to volume (if not $nounpack)
		- :ref:`unpack_4dfp`
		- **bold<irun>/** |br| <patid>_b<irun>.4dfp.img
	*	- Correct slice timing and odd/even slice intensities (if not $MB)
		- :ref:`frame_align_4dfp`, :ref:`deband_4dfp`
		-  **bold<irun>/** |br| <patid>_b<irun>_faln.4dfp.img |br| <patid>_b<irun>_faln_dbnd.4dfp.img
	*	- Motion correction via rigid body transform of each volume to reference frame
		- :ref:`cross_realign3d_4dfp`
		- **bold<irun>/** |br| <patid>_b<irun>[_faln_dbnd]_xr3d.4dfp.img |br| <patid>_b<irun>[_faln_dbnd]_r3d_avg.4dfp.img |br| <patid>_b<irun>[_faln_dbnd]_xr3d.mat
	*	- Bias field correction (if $BiasField)
		- FSL bet, FSL fast, extend_fast_4dfp
		- **bold<irun>/** |br| <patid>_b<irun>[_faln_dbnd]_xr3d_BC_avg.4dfp.img |br| **atlas/** |br| <patid>[_faln_dbnd]_xr3d_avg_brain.nii.gz |br| <patid>[_faln_dbnd]_xr3d_avg_brain_restore(.4dfp.img, .nii.gz)
	*	- Compute and apply within-run mode 1000 normalization
		- :ref:`normalize_4dfp`, :ref:`scale_4dfp`
		- **bold<irun>/** |br| <patid>_b<irun>[_faln_dbnd]_xr3d[_BC]_norm.4dfp.img
	*	- Extract/format movement data from cross-realign output
		- :ref:`mat2dat`
		- **movement/** |br| <patid>_b<irun>[_faln_dbnd]_xr3d(.dat, .ddat, .rdat)
	*	- Extract EPI first frame (anatomy) image and create functional volume conc file
		- :ref:`paste_4dfp`, :ref:`conc_4dfp`
		- **atlas/** |br| <patid>_anat_ave.4dfp.img |br| <patid>_func_vols.conc
	* 	- Compute high movement frames using FD (if $FDthresh specified) and DVARS (stops here if $min_frames criteria not met)
		- FD.awk (using .ddat movement file), :ref:`run_dvar_4dfp`
		- **movement/** |br| <patid>[_faln_dbnd]_xr3d.FD |br| **atlas/** |br| <patid>[_faln_dbnd]_xr3d.FD.format (if $FDthresh) |br| <patid>_func_vols(.vals, .dat, .crit, .xmgr, .format)
	* 	- Make func_vols_ave image with high movement frames removed
		- :ref:`actmapf_4dfp`
		- **atlas/** |br| <patid>_func_vols_ave.4dfp.img
	*	- Compute cross-session BOLD atlas transform if $day1_patid specified (then skips to applying EPI transform step)
		- :ref:`cross_day_imgreg_4dfp`, :ref:`t4_mul`
		- **atlas/** |br| <patid>_anat_ave_to_<target>_t4 |br| (and other intermediate t4 files)
	*	- Convert MPRAGE DICOM data to 4dfp format (if not $E4dfp)
	 	- :ref:`dcm_to_4dfp`
		- **atlas/** |br| <patid>_mpr#.4dfp.img
	*	- Convert MPRAGE images to tranverse orientation (if not already)
		- :ref:`c2t_4dfp` or :ref:`s2t_4dfp`
		- **atlas/** |br| <patid>_mpr#T.4dfp.img
	*	- Compute MPRAGE average
		- :ref:`avgmpr_4dfp`
		- **atlas/** |br| <patid>_mpr_n#.4dfp.img
	*	- Create transverse t2w image (if $tse or $pdt)
		- :ref:`collate_slice_4dfp` if $tse, :ref:`extract_frame_4dfp` (second frame) if $pdt, :ref:`c2t_4dfp` or :ref:`s2t_4dfp`
		- **atlas/** |br| <patid>_t2w[T].4dfp.img
	* 	- Compute EPI to atlas transform
		- epi2mpr2atl2_4dfp if neither $tse nor $pdt, otherwise :ref:`epi2t2w2mpr2atl2_4dfp`
		- **atlas/** |br| <patid>_anat_ave_to_<target>_t4 |br| (and other intermediate t4 files)
	*	- Make atlas transformed EPI average image and t2w in 111, 222, and 333 atlas space
		- :ref:`t4img_4dfp`
		- **atlas/** |br| <patid>_(anat\|func_vols)_ave_on_<target>_111.4dfp.img |br| <patid>_(anat\|func_vols)_ave_on_<target>_222.4dfp.img |br| <patid>_(anat\|func_vols)_ave_on_<target>_333.4dfp.img
	* 	- Compute field mapping correction
		- :ref:`fmri_unwarp_170616`
		- **unwarp/** |br| <patid>_(anat|func_vols)_ave_uwrp.4dfp.img
	* 	- Compute and apply unwarped epi to atlas transform
		- :ref:`imgreg_4dfp`, :ref:`t4_mul`, :ref:`t4img_4dfp`
		- **unwarp/** |br| <patid>_(anat\|func_vols)_ave_uwrp_on_<target>_111.4dfp.img |br| <patid>_(anat\|func_vols)_ave_uwrp_on_<target>_222.4dfp.img |br| <patid>_(anat\|func_vols)_ave_uwrp_on_<target>_333.4dfp.img
	* 	- One-step resample unwarped images
		- $rsam_cmnd
		- **bold<irun>/** |br| <patid>_[_faln_dbnd]_xr3d_uwrp_atl.4dfp.img

.. _fmri_unwarp_170616:

fmri_unwarp_170616.tcsh
-----------------------
distortion correction wrapper script for fMRI preprocessing

.. _measured_fm:

Measured field map
++++++++++++++++++

Usage: fmri_unwarp_170616.tcsh -map	<patid> <epi> <mag> <phase> <dwell> <te> <ped> <delta>

.. list-table::
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- epi
		- |epi_vals|
		- |epi_desc|
	*	- mag
		- |mag_vals|
		- |mag_desc|
	*	- phase
		- |phase_vals|
		- |phase_desc|
	* 	- dwell
		- |dwell_vals|
		- |dwell_desc|
	*	- te
		- |TE_vol_vals|
		- |TE_vol_desc|
	*	- ped
		- |ped_vals|
		- |ped_desc|
	*	- delta
		- |delta_vals|
		- |delta_desc| (required only for gradient-echo field map)

.. _mean_fm:

Mean field map
++++++++++++++
Usage: fmri_unwarp_170616.tcsh -mean	<epi> <FMmean> <epi_to_atl_t4> <dwell> <ped>

.. list-table::
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- epi
		- |epi_vals|
		- |epi_desc|
	* 	- FMmean
		- |FMmean_vals|
		- |FMmean_desc|
	*	- epi_to_atl_t4
		- |epi2atl_t4_vals|
		- |epi2atl_t4_desc|
	* 	- dwell
		- |dwell_vals|
		- |dwell_desc|
	*	- ped
		- |ped_vals|
		- |ped_desc|

.. _basis_opt_fm:

basis_opt field map
+++++++++++++++++++

Usage: fmri_unwarp_170616.tcsh -basis <epi> <t2w> <FMmean> <FMbases> <epi_to_t2w_t4> <epi_to_atl_t4> <dwell> <ped> <nbasis> [t2w brain mask]

.. list-table::
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- epi
		- |epi_vals|
		- |epi_desc|
	* 	- t2w
		- |t2w_vals|
		- |t2w_desc|
	* 	- FMmean
		- |FMmean_vals|
		- |FMmean_desc|
	* 	- epi_to_t2w_t4
		- |epi2t2w_t4_vals|
		- |epi2t2w_t4_desc|
	*	- epi_to_atl_t4
		- |epi2atl_t4_vals|
		- |epi2atl_t4_desc|
	* 	- dwell
		- |dwell_vals|
		- |dwell_desc|
	*	- ped
		- |ped_vals|
		- |ped_desc|
	* 	- nbasis
		- |nbasis_vals|
		- |nbasis_desc|

N.B.:	with option -basis, basis_opt optimizes the <dwell> value (aka, echo spacing) by default |br|

.. _sefm_pp_AZS:

sefm_pp_AZS.csh
---------------
merge AP/PA into one image and run topup to derive field map

Usage:	sefm_pp_AZS.csh <params file> [instructions file]

Examples::

	sefm_pp_AZS.csh PSQ0001_s1.params ../PSQ_study.params

.. list-table::
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	*	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- sefm
		- |sefm_vals|
		- |sefm_desc|
	* 	- sorted
		- 1
		- |sorted_desc| (must be sorted)

.. _one_step_resample:

one_step_resample.csh
---------------------
one step resampling with support for bias field correction

Usage:	one_step_resample.csh <parameters file> [instructions]

Examples::

	one_step_resample.csh VB16168.params

Params variables

.. list-table::
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	*	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- day1_patid
		- |day1_patid_vals|
		- |day1_patid_desc|
	*	- day1_path
		- |day1_path_vals|
		- |day1_path_desc|
	* 	- irun
		- |irun_vals|
		- |irun_desc|

Instructions variables

.. list-table::
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- use_anat_ave
		- |use_anat_ave_vals|
		- |use_anat_ave_desc|
	*	- outres
		- |outres_vals|
		- |outres_desc|
	*	- target
		- |target_vals|
		- |target_desc|
	*	- MB
		- |MB_skip_vals|
		- |MB_skip_desc|
	* 	- BiasField
		- |BiasField_vals|
		- |BiasField_desc|



epi2mpr2atlv_4dfp
-----------------
EPI :math:`\rightarrow` T1W :math:`\rightarrow` atlas

Usage:	epi2mpr2atlv_4dfp <epi_anat> <mpr_anat> [useold] [atlas target [711-2? OR -T<target including path>] [-S<atlas space>] [noinit]

Examples::

	epi2mpr2atlv_4dfp stem9_anat_ave stem9_654-3 useold 711-2C
	epi2mpr2atlv_4dfp stem9_anat_ave stem9_654-3 useold -T/data/cninds01/atlas/NP765 -S711-2B

Options

=======	============================================================================
useold	inhibits re-computation of all t4 files
noinit	inhibits reinitialization of epi->mpr t4 files
-T<str>	atlas target (specified string should include path) (default is 711-2B)
-S		specifies the atlas space (requires -T) (currently only 711-2B is supported)
=======	============================================================================

N.B.:	Any image argument may include a path, e.g., /data/petmr1/data7/stem/96_06_14_stem9/stem9_654-3

N.B.:	All named images must be in either ANALYZE or 4dfp format. ANALYZE will be converted to 4dfp


epi2t2w2mpr2atlv_4dfp
---------------------
EPI :math:`\rightarrow` T2W :math:`\rightarrow` T1W :math:`\rightarrow` atlas (8 parameter cross-modal; for “low”  res fMRI)

Usage:	epi2t2w2mpr2atlv_4dfp <epi_anat> <t2w_anat> <mpr_anat> [useold] [atlas_target]

Examples::

	epi2t2w2mpr2atlv_4dfp stem9_anat_ave stem9_643-2 stem9_654-3 useold 711-2Y

.. list-table::
	:widths: 15 15 25 10
	:class: wrap-rows
	:header-rows: 1

	*	- Step description
		- Function
		- Inputs
		- Output
	* 	- Compute MPR to atlas transform
		- mpr2atl_4dfp
		-
		- ${mpr}_to_${target}_t4
	* 	- Blur images
		- :ref:`gauss_4dfp`
		- t_half = 1.1
		- ${mpr}_g11 |br| ${t2w}_g11 |br| ${epi}_g11
	* 	- Compute MPR brain mask
		- msktgen_4dfp
		-
		- ${mpr}_mskt
	*	- Compute (iteratively) T2w to MPR transform
		- :ref:`imgreg_4dfp`, using blurred (\*_g11) images as source/target
		- **w/ unmasked mpr** (source_mask = none) |br| modes[1] = 1024 + 3 |br| **w/ masked mpr** (source_mask = ${mpr}_mskt) |br| modes[2] = 1024 + 3 |br| modes[3] = 2048 + 3 + 8 + 64 |br| modes[4] = 8192 + 2048 + 3 + 8 + 64
		- ${t2w}_to_${mpr}_t4
	* 	- Compute EPI brain mask
		- :ref:`gauss_4dfp`, imgmax_4dfp, img2msk_4dfp, :ref:`maskimg_4dfp`
		- f_half = .3 |br| threshold = .2 * max(blurred epi)
		- ${epi}_msk
	*	- Compute EPI (iteratively) to T2w transform
		- :ref:`imgreg_4dfp`, using blurred (\*_g11) images as source/target
		- **w/ original epi** (source_msk = none) |br| modes[1] = 1024 + 3 |br| **w/ masked epi** (source_msk=${epi}_msk) |br| modes[2] = 1024 + 3 |br| modes[3] = 3072 + 3 + 8 + 64 |br| modes[4] = 8192 + 2048 + 3 + 8 + 64
		- ${epi}_to_${t2w}_t4
	* 	- Combine transforms
		- :ref:`t4_mul`
		- ${t2w}_to_${mpr}_t4, ${mpr}_to_${target}_t4 |br| ${epi}_to_${t2w}_t4, ${t2w}_to_${target}_t4 |br| ${epi}_to_${t2w}_t4, ${t2w}_to_${mpr}_t4
		- ${t2w}_to_${target}_t4 |br| ${epi}_to_${target}_t4 |br| ${epi}_to_${mpr}_t4

N.B.:	Any argument may include a path, e.g., /data/petmr1/data7/stem/96_06_14_stem9/stem9_654-3

N.B.:	All named images must be in either ANALYZE or 4dfp format. ANALYZE will be converted to 4dfp

N.B.:	'useold' instructs epi2t2w2mpr2atlv_4dfp to use existing t4 files

N.B.:	The default atlas_target is 711-2B

.. _epi2t2w2mpr2atl1_4dfp:

epi2t2w2mpr2atl1_4dfp
---------------------
EPI :math:`\rightarrow` T2W :math:`\rightarrow` T1W :math:`\rightarrow` atlas (9 parameter cross-modal; for “high” res fMRI)

Usage:	epi2t2w2mpr2atl1_4dfp <epi_anat> <t2w_anat> <mpr_anat> [useold] [711-2? OR -T<Target including path>] [-S<atlas space>]

Examples::

	epi2t2w2mpr2atl1_4dfp stem9_anat_ave stem9_643-2 stem9_654-3 711-2B
	epi2t2w2mpr2atl1_4dfp stem9_anat_ave stem9_654-3 useold -T/data/cninds01/atlas/NP765 -S711-2B

.. list-table::
	:widths: 15 15 25 10
	:class: wrap-rows
	:header-rows: 1

	*	- Step description
		- Function
		- Inputs
		- Output
	* 	- Compute MPR to atlas transform
		- mpr2atl_4dfp
		-
		- ${mpr}_to_${target}_t4
	* 	- Compute MPR brain mask
		- msktgen_4dfp
		-
		- ${mpr}_mskt
	*	- Compute (iteratively) T2w to MPR transform
		- :ref:`imgreg_4dfp`
		- **w/ original mpr** (source_mask = none) |br| modes[1] = 1024 + 3 |br| **w/ masked mpr** (source_mask = ${mpr}_mskt) |br| modes[2] = 1024 + 3 |br| modes[3] = 2048 + 3 + 8 + 64 |br| modes[4] = 8192 + 2048 + 3 + 8
		- ${t2w}_to_${mpr}_t4
	* 	- Compute EPI brain mask
		- :ref:`gauss_4dfp`, imgmax_4dfp, img2msk_4dfp, :ref:`maskimg_4dfp`
		- f_half = .3 |br| threshold = .2 * max(blurred epi)
		- ${epi}_msk
	*	- Compute EPI (iteratively) to T2w transform
		- :ref:`imgreg_4dfp`
		- **w/ original epi** (source_msk = none) |br| modes[1] = 1024 + 3 |br| **w/ masked epi** (source_msk=${epi}_msk) |br| modes[2] = 1024 + 3 |br| modes[3] = 3072 + 3 + 8 |br| modes[4] = 8192 + 2048 + 3 + 8
		- ${epi}_to_${t2w}_t4
	* 	- Combine transforms
		- :ref:`t4_mul`
		- ${t2w}_to_${mpr}_t4, ${mpr}_to_${target}_t4 |br| ${epi}_to_${t2w}_t4, ${t2w}_to_${target}_t4 |br| ${epi}_to_${t2w}_t4, ${t2w}_to_${mpr}_t4
		- ${t2w}_to_${target}_t4 |br| ${epi}_to_${target}_t4 |br| ${epi}_to_${mpr}_t4


N.B.:	Any image argument may include a path, e.g., /data/petmr1/data7/stem/96_06_14_stem9/stem9_654-3

N.B.:	All named images must be in 4dfp format

N.B.:	-S specifies the atlas space. The only currently supported atlas space is 711-2B

.. _epi2t2w2mpr2atl2_4dfp:

epi2t2w2mpr2atl2_4dfp
---------------------
EPI :math:`\rightarrow` T2W :math:`\rightarrow` T1W :math:`\rightarrow` atlas (6 parameter cross-modal; best for distorted fMRI)

Usage:	epi2t2w2mpr2atl2_4dfp <epi_anat> <t2w_anat> <mpr_anat> [useold] [711-2? OR -T<Target including path>] [-S<atlas space>]

Examples::

	epi2t2w2mpr2atl2_4dfp stem9_anat_ave stem9_643-2 stem9_654-3 711-2B
	epi2t2w2mpr2atl2_4dfp stem9_anat_ave stem9_654-3 useold -T/data/cninds01/atlas/NP765 -S711-2B


**Processing steps**

.. list-table::
	:widths: 15 15 25 10
	:class: wrap-rows
	:header-rows: 1

	*	- Step description
		- Function
		- Inputs
		- Output
	* 	- Compute MPR to atlas transform
		- mpr2atl_4dfp
		-
		- ${mpr}_to_${target}_t4
	*	- Compute T2w to MPR transform
		- :ref:`imgreg_4dfp`
		- modes[1] = 4096 + 3 |br| modes[2] = 1024 + 3 |br| modes[3] = 2048 + 3 |br| modes[4] = 2048 + 3 [+ 8 + 64 if thin t2w] |br| modes[5] = modes[4] + 8192
		- ${t2w}_to_${mpr}_t4
	* 	- Compute EPI brain mask
		- :ref:`gauss_4dfp`, imgmax_4dfp, img2msk_4dfp, :ref:`maskimg_4dfp`
		- f_half = .3 |br| threshold = .2 * max(blurred epi)
		- ${epi}_msk
	*	- Compute (iteratively) EPI to T2w transform
		- :ref:`imgreg_4dfp`
		- **w/ original epi** (source_msk = none) |br| modes[1] = 4096 + 3 |br| modes[2] = 1024 + 3 |br| **w/ masked epi** (source_msk = ${epi}_msk) |br| modes[3] = 1024 + 3 |br| modes[4] = 3072 + 3 |br| modes[5] = 8192 + 2048 + 3
		- ${epi}_to_${t2w}_t4
	* 	- Combine transforms
		- :ref:`t4_mul`
		- ${t2w}_to_${mpr}_t4, ${mpr}_to_${target}_t4 |br| ${epi}_to_${t2w}_t4, ${t2w}_to_${target}_t4 |br| ${epi}_to_${t2w}_t4, ${t2w}_to_${mpr}_t4
		- ${t2w}_to_${target}_t4 |br| ${epi}_to_${target}_t4 |br| ${epi}_to_${mpr}_t4


N.B.:	Any image argument may include a path, e.g., /data/petmr1/data7/stem/96_06_14_stem9/stem9_654-3

N.B.:	All named images must be in 4dfp format

N.B.:	-S specifies the atlas space. The only currently supported atlas space is 711-2B

.. _cross_day_imgreg_4dfp:

cross_day_imgreg_4dfp
---------------------
link first session atlas transform to subsequent sessions via EPI “anat_ave”

Usage:	cross_day_imgreg_4dfp <curr_patid> <day1_atlas_path> <day1_patid> <atlas_representative_target> [options]

Examples::

	cross_day_imgreg_4dfp tpj0202 /data/petsun24/data1/tpj0201/atlas tpj0201 711-2Y
	cross_day_imgreg_4dfp tpj0202 /data/petsun24/data1/tpj0201/atlas tpj0201 -T/data/cninds01/data2/ATLAS/ALLEGRA_Y_111

Options

==========	=====================================================
-a<str>		specify image filename trailer (default = "anat_ave")
-nostretch	disable stretch in transform
-setecho	set echo
-S<str>		specify atlas space (default=711-2B)
==========	=====================================================

N.B.:	cross_day_imgreg_4dfp must be run in the current atlas directory

N.B.:	<atlas_representative_target> may be of form 711-2? OR -T/path/image

compute_run_sd1.csh
-------------------
run var_4dfp -sn4 on all bold directories (\*xr3d_norm and \*xr3d_atl) and makes movies

Usage:	compute_run_sd1.csh <patid>

Examples::

	compute_run_sd1.csh VB15792

cross_day_imgreg_4dfp
---------------------
compute cross-session BOLD atlas transform

Usage:	cross_day_imgreg_4dfp <curr_patid> <day1_atlas_path> <day1_patid> <atlas_representative_target> [options]

Examples::

	cross_day_imgreg_4dfp tpj0202 /data/petsun24/data1/tpj0201/atlas tpj0201 711-2Y
	cross_day_imgreg_4dfp tpj0202 /data/petsun24/data1/tpj0201/atlas tpj0201 -T/data/cninds01/data2/ATLAS/ALLEGRA_Y_111

Options

==========	=====================================================
-a<str>		specify image filename trailer (default = "anat_ave")
-nostretch	disable stretch in transform
-setecho	set echo
-S<str>		specify atlas space (default=711-2B)
==========	=====================================================

N.B.:	cross_day_imgreg_4dfp must be run in the current atlas directory

N.B.:	<atlas_representative_target> may be of form 711-2? OR -T/path/image

.. _run_dvar_4dfp:

run_dvar_4dfp
-------------
compute format (identify frames with too much motion) (:ref:`dvar_4dfp` wrapper)

Usage:	run_dvar_4dfp <(conc) concfile> [options]

Options

=======	=========================================================================================
-d 		debug mode
-v 		verbose mode
-p<str> specify printer on which to plot generated .dat.ps file
-P<str>	print previously generated results on specified printer (run on SunOS)
-x<flt>	set frame rejection threshold (default = mode + 2.5*(left s.d.) over non-skipped frames)
=======	=========================================================================================

N.B.:	run_dvar_4dfp is a wrapper for dvar_4dfp

N.B.:	options -b -m -n -t are passed to dvar_4dfp

N.B.:	option  -s is always passed to dvar_4dfp

.. _conc_4dfp:

conc_4dfp
---------
create conc file

Usage:	conc_4dfp <(conc) outroot> <(4dfp) 1> <(4dfp) 2> ...

Examples::

	conc_4dfp vb13157_faln_dbnd_xr3d_atl vb13157_b?_faln_dbnd_xr3d_atl.4dfp.img

Options

=======	==================================================================
-w		supress inclusion of current working directory in listed file path
-l<str>	read input 4dfp list
=======	==================================================================

N.B.:	output conc file always has extension "conc"

N.B.:	only files in or below the current working directory can be correctly addressed

conc_mv
-------
update conc file 4dfp image pointers

Usage:	conc_mv <conc file> <from> <to>

Examples::

	conc_mv TC26851_rmsp_faln_dbnd_xr3d_atl.conc /data/nil-bluearc/raichle/gusnard/np751 auto_evolve/AVI_TEST

Options

==	=======================================
-v 	verbose mode
-t	practice mode (<conc file> not changed)
==	=======================================

conc2format
-----------
compute conc-specific format using a fixed number of pre-steady state frames

Examples::

	conc2format vb13157_faln_dbnd_xr3d_atl.conc 4

Options

==	=================================
-v	verbose mode
-X	label first frame of each run 'X'
==	=================================

RFX2.csh
--------
random effects analysis (1 or 2 groups)

Usage:	RFX2.csh <list_group1> <Nimage_group1> [<list_group2> <Nimage_group2>]

Options

==	=====================================================
-d	debug mode
-R	suppress creation of large rec files (bootstrap mode)
==	=====================================================

N.B.:	<list_group[12]> name 4dfp images on which to run the t-test

N.B.:	<Nimage_group[12]> are 4dfp 'n' images (number of subjects for which each voxel is defined)

N.B.:	If one group is entered a t-test will be run on this group against the null hypothesis of 0

N.B.:	If two groups are entered a t-test will be run comparing the two groups and the computed statistic is Welch's approximate t' (Eqn. 8.11, p. 129 in Zar.)
