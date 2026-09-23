.. include:: ../../global.rst

.. _deprecated:

Deprecated scripts
==================

.. _cross_bold_pp:

cross_bold_pp
-------------
generic EPI (BOLD) pre-processing

Usage:	cross_bold_pp_<version>.csh <params file> [instructions_file]

Examples::

	cross_bold_pp_161012.csh VB16168.params
	generic_cross_bold_pp_090115.csh VB16168.params

cross_bold_pp_130702.csh
++++++++++++++++++++++++

**Required parameters**

.. list-table::
	:widths: 15	5 65
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
	*	- normode
		- |normode_vals|
		- |normode_desc|
	* 	- day1_patid
		- |day1_patid_vals|
		- |day1_patid_desc|
	* 	- day1_path
		- |day1_path_vals|
		- |day1_path_desc|
	*	- uwrp_cmnd
		- |uwrp_cmnd_vals|
		- |uwrp_cmnd_desc|
	* 	- rsam_cmnd
		- |rsam_cmnd_vals|
		- |rsam_cmnd_desc|

=============	===========================================================================================
Economy value	Files to be removed
=============	===========================================================================================
> 2				original bold run images
> 3				frame-aligned images (_faln)
> 4				cross-realigned avg images (_r3d_avg or xr3d_BC_avg if $BiasField) (only if $epi2atl == 0)
=============	===========================================================================================

**Field map correction variables (required)**

========    ==============  =======================
Variable    Values          Description
========    ==============  =======================
**Option 1** (:ref:`measured_fm` - gradient echo)
---------------------------------------------------
gre         |gre_vals|      |gre_desc|
delta       |delta_vals|    |delta_desc|
TE_vol      |TE_vol_vals|   |TE_vol_desc|

**Option 2** (:ref:`basis_opt_fm`)
---------------------------------------------------
FMmean      |FMmean_vals|   |FMmean_desc|
FMBases     |FMBases_vals|  |FMBases_desc|
========    ==============  =======================

**Optional parameters**

.. include:: ../../notes/cross-bold-optional-tip.rst

.. list-table::
	:widths: 15	5 5 60
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
		- |interleave_default|
		- |interleave_desc|
	* 	- MBfac
		- |MBfac_vals|
		- |MBfac_default|
		- |MBfac_desc|
	*	- anat_aveb
		- |anat_aveb_vals|
		- |anat_aveb_default|
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
	:widths: 15	65
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

* Convert bold run dicoms to 4dfp format (:ref:`dcm_to_4dfp`)
* Covert mosiac format to volume -- if not $nounpack (:ref:`unpack_4dfp`)
* Correct slice timing and odd/even slice intensities -- if not $MB (:ref:`frame_align_4dfp`, :ref:`deband_4dfp`)
* Motion correction via rigid body transform of each volume to reference frame (:ref:`cross_realign3d_4dfp`)
* Compute and apply mode 1000 normalization (:ref:`normalize_4dfp`, :ref:`scale_4dfp`)
* Extract/format movement data from on cross_realign3d_4dfp output (:ref:`mat2dat`)
* Extract EPI first frame (anatomy) image (:ref:`paste_4dfp`)
* Make func_vols_ave image with high movement frames removed (DVARS) (:ref:`actmapf_4dfp`)
* Compute cross-session BOLD atlas transform -- if $day1_patid specified for current patid (:ref:`cross_day_imgreg_4dfp`)
* Convert MPRAGE dicoms to 4dfp format (:ref:`dcm_to_4dfp`)
* Compute MPRAGE atlas transforms (:ref:`mpr2atl1_4dfp` with first mpr if $Gad, otherwise :ref:`avgmpr_4dfp`)
* Compute EPI atlas transform

.. container:: toggle

    .. container:: header

        **(Show/Hide Details)**

    |cross_bold_v16_epi2atl|

* Make atlas transformed EPI anat_ave and t2w in 111, 222, and 333 atlas space (:ref:`t4img_4dfp`)
* Compute field mapping correction ($uwrp_cmnd)
* Compute and apply unwarped epi to atlas transform (:ref:`imgreg_4dfp`, :ref:`t4_mul`, :ref:`t4img_4dfp`)
* Resample unwarped images ($rsam_cmnd)
* Make average atlas-aligned, unwarped image (:ref:`actmapf_4dfp`)

cross_bold_pp_121215.csh
++++++++++++++++++++++++

**Required parameters**

.. list-table::
	:widths: 15	5 65
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- target
		- |target_vals|
		- |target_desc|
	* 	- irun
		- |irun_vals|
		- |irun_desc|
	* 	- fstd
		- |fstd_vals|
		- |fstd_desc|
	*	- mprs
		- |mprs_vals|
		- |mprs_desc|
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
	*	- normode
		- |normode_vals|
		- |normode_desc|

=============	=======================================================
Economy value	Files to be removed
=============	=======================================================
> 2				original bold images
> 3				frame-aligned images (_faln)
> 4				debanded images (_faln_dbnd) (only if $epi2atl == 0)
> 6				normalized images (_norm)
=============	=======================================================

**Optional parameters**

.. include:: ../../notes/cross-bold-optional-tip.rst

.. list-table::
	:widths: 15	5 5 60
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
	*	- t1w
		- |t1w_vals|
		-
		- |t1w_desc|
	*	- scrdir
		- |scrdir_vals|
		-
		- |scrdir_desc|
	*	- to_MNI152
		- |to_MNI152_vals|
		- |to_MNI152_default|
		- |to_MNI152_desc|
	* 	- day1_patid
		- |day1_patid_vals|
		-
		- |day1_patid_desc|
	*	- day1_path
		- |day1_path_vals|
		-
		- |day1_path_desc|
	* 	- sorted
		- |sorted_vals|
		- |sorted_default|
		- |sorted_desc|

**Additional optional parameters**

.. include:: ../../notes/any-value-warning.rst

.. list-table::
	:widths: 15	65
	:header-rows: 1

	*	- Variable
		- Description
	*	- Siemens_interleave
		- |Siemens_interleave_desc|

**Processing steps**

* Convert bold run dicoms to 4dfp format (:ref:`dcm_to_4dfp`)
* Covert mosiac format to volume (:ref:`unpack_4dfp`)
* Correct slice timing and odd/even slice intensities (:ref:`frame_align_4dfp`, :ref:`deband_4dfp`)
* Motion correction via rigid body transform of each volume to reference frame (:ref:`cross_realign3d_4dfp`)
* Compute and apply mode 1000 normalization (:ref:`normalize_4dfp`, :ref:`scale_4dfp`)
* Extract/format movement data from on cross_realign3d_4dfp output (:ref:`mat2dat`)
* Extract EPI first frame (anatomy) image (:ref:`paste_4dfp`)
* Move anatomy image (anat_ave) to atlas directory
* Compute cross-session BOLD atlas transform if $day1_patid specified for current patid (:ref:`cross_day_imgreg_4dfp`)
* Convert MPRAGE dicoms to 4dfp format (:ref:`dcm_to_4dfp`)
* Compute MPRAGE atlas transforms (:ref:`avgmpr_4dfp`)
* Compute EPI atlas transform

.. container:: toggle

    .. container:: header

        **(Show/Hide Details)**

    |cross_bold_v12_epi2atl|

* Make atlas transformed EPI anat_ave in 111, 222, and 333 (711-2B or MNI152 if $to_MNI152) atlas space (:ref:`t4img_4dfp`)
* Make cross-realigned atlas-transformed resampled BOLD 4dfp stacks (:ref:`t4_xr3d_4dfp`)

generic_cross_bold_pp_090115
++++++++++++++++++++++++++++

**Required parameters**

.. list-table::
	:widths: 15	5 65
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
	*	- normode
		- |normode_vals|
		- |normode_desc|

=============	=======================================================
Economy value	Files to be removed
=============	=======================================================
> 2				original bold images
> 3				frame-aligned images (_faln)
> 4				debanded images (_faln_dbnd) (only if $epi2atl == 0)
> 6				normalized images (_norm)
=============	=======================================================

**Optional parameters**

.. include:: ../../notes/cross-bold-optional-tip.rst

.. list-table::
	:widths: 15	5 5 60
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
	*	- t1w
		- |t1w_vals|
		-
		- |t1w_desc|
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
	*	- interleave
		- |interleave_vals|
		-
		- |interleave_desc|
	* 	- MBfac
		- |MBfac_vals|
		- |MBfac_default|
		- |MBfac_desc|
	* 	- day1_patid
		- |day1_patid_vals|
		-
		- |day1_patid_desc|
	*	- day1_path
		- |day1_path_vals|
		-
		- |day1_path_desc|
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
	:widths: 15 60
	:header-rows: 1

	*	- Variable
		- Description
	*	- epi_zflip
		- |epi_zflip_desc|
	*	- Siemens_interleave
		- |Siemens_interleave_desc|
	*	- nounpack
		- |nounpack_desc|


**Processing steps**

* Convert bold run dicoms to 4dfp format (:ref:`dcm_to_4dfp`)
* Covert mosiac format to volume -- if not $nounpack (:ref:`unpack_4dfp`)
* Correct slice timing and odd/even slice intensities -- if not $MB (:ref:`frame_align_4dfp`, :ref:`deband_4dfp`)
* Motion correction via rigid body transform of each volume to reference frame (:ref:`cross_realign3d_4dfp`)
* Compute and apply mode 1000 normalization (:ref:`normalize_4dfp`, :ref:`scale_4dfp`)
* Extract/format movement data from on cross_realign3d_4dfp output (:ref:`mat2dat`)
* Extract EPI first frame (anatomy) image (:ref:`paste_4dfp`)
* Move anatomy image (anat_ave) to atlas directory
* Compute cross-session BOLD atlas transform if $day1_patid specified for current patid (:ref:`cross_day_imgreg_4dfp`)
* Convert MPRAGE dicoms to 4dfp format (:ref:`dcm_to_4dfp`)
* Compute MPRAGE atlas transforms (:ref:`mpr2atl1_4dfp` with first mpr if $Gad, otherwise :ref:`avgmpr_4dfp`)
* Compute EPI to atlas transform
* Compute EPI atlas transform

.. container:: toggle

    .. container:: header

        **(Show/Hide Details)**

    |cross_bold_v12_epi2atl|
	
* Make atlas transformed EPI anat_ave in 111, 222, and 333 atlas space (:ref:`t4img_4dfp`)
* Make cross-realigned atlas-transformed resampled BOLD 4dfp stacks (:ref:`t4_xr3d_4dfp`)

.. _fcMRI_preproc:

fcMRI_preproc
-------------
fcMRI preprocessing including nuisance variable regression.

.. attention:: :code:`fcMRI_preproc` assumes successful completion of BOLD preprocessing (:ref:`cross_bold_pp`).

Usage:	fcMRI_preproc_<version>.csh <params file> [instructions file]

Examples::

	fcMRI_preproc_161012.csh VB16168.params
	fcMRI_preproc_090115.csh VB16168.params

fcMRI_preproc_140413.csh
++++++++++++++++++++++++

**Required parameters**

.. list-table::
	:widths: 15	5 60
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- srcdir
		- |srcdir_vals|
		- |srcdir_desc|
	*	- workdir
		- |workdir_vals|
		- |workdir_desc|
	* 	- TR_vol
		- |TR_vol_vals|
		- |TR_vol_desc|
	*	- skip
		- |skip_vals|
		- |skip_desc|
	* 	- fcbolds
		- |fcbolds_vals|
		- |fcbolds_desc|


**Optional parameters**

.. list-table::
	:widths: 15	5 5 65
	:header-rows: 1

	*	- Variable
		- Values
		- Default
		- Description
	* 	- FCdir
		- |FCdir_vals|
		- |FCdir_default|
		- |FCdir_desc|
	* 	- anat_aveb
		- |anat_aveb_vals|
		- 10
		- |anat_aveb_desc|
	* 	- anat_avet
		- |anat_avet_vals|
		- 7
		- |anat_avet_desc|
	* 	- FWHM
	  	- |FWHM_vals|
		- |FWHM_default|
	  	- |FWHM_desc|
	* 	- MB
	  	- |MB_skip_vals|
		- |MB_skip_default|
	  	- |MB_skip_desc|
	* 	- conc
		- |conc_vals|
		-
		- |conc_desc|
	* 	- task_regressor
	  	- |task_regressor_vals|
		-
	  	- |task_regressor_desc|
	* 	- noGSR
		- |noGSR_vals|
		- |noGSR_default|
		- |noGSR_desc|

**Processing steps**

* Create conc file (:ref:`conc_4dfp`) and move it to FCdir
* Compute defined mask and apply it (:ref:`compute_defined_4dfp`, :ref:`maskimg_4dfp`)
* Compute frame censoring (DVARS) (:ref:`run_dvar_4dfp`)
* Compute initial sd1 mean (:ref:`var_4dfp`, :ref:`qnt_4dfp`)
* Make movement regressors for each bold run (:ref:`mat2dat`)
* Make whole brain regressors including the 1st derivative (:ref:`qnt_4dfp`)
* Make ventricle and bilateral white matter regressors and their derivatives (:ref:`qnt_4dfp`)
* Paste nuisance regressors together (including task_regressor if supplied)
* Remove nuisance regressors out of volumetric time series (:ref:`glm_4dfp`)
* Temporal bandpass filter with bh = .1 and oh = 2 (:ref:`bandpass_4dfp`)
* Spatial blur with f_half = 4.413/$FWHM (:ref:`gauss_4dfp`)

.. _fcMRI_preproc_130715:

fcMRI_preproc_130715.csh
++++++++++++++++++++++++

|params_header|

.. list-table::
	:widths: 15	5 65
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- srcdir
		- |srcdir_vals|
		- |srcdir_desc|
	* 	- fcbolds
		- |fcbolds_vals|
		- |fcbolds_desc|

|inst_header|

.. list-table::
	:widths: 15	5 65
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- FCdir
		- |FCdir_vals|
		- |FCdir_desc|
	*	- FSdir
		- |FSdir_vals|
		- |FSdir_desc|
	* 	- MB
		- |MB_skip_vals|
		- |MB_skip_desc|
	* 	- conc
		- |conc_vals|
		- |conc_desc|
	* 	- task_regressor
		- |task_regressor_vals|
		- |task_regressor_desc|
	* 	- noGSR
		- |noGSR_vals|
		- |noGSR_desc|
	* 	- anat_aveb
		- |anat_aveb_vals|
		- |anat_aveb_desc|
	* 	- anat_avet
		- |anat_avet_vals|
		- |anat_avet_desc|
	*	- CSF_lcube
		- |CSF_lcube_vals|
		- |CSF_lcube_desc|
	* 	- CSF_sd1t
		- |CSF_sd1t_vals|
		- |CSF_sd1t_desc|
	*	- CSF_svdt
		- |CSF_svdt_vals|
		- |CSF_svdt_desc|
	*	- WM_lcube
		- |WM_lcube_vals|
		- |WM_lcube_desc|
	*	- WM_svdt
		- |WM_svdt_vals|
		- |WM_svdt_desc|
	* 	- fmtfile
		- |fmtfile_vals|
		- |fmtfile_desc|
	* 	- bpss_params
		- |bpss_params_vals|
		- |bpss_params_desc|
	*	- blur
		- |blur_vals|
		- |blur_desc|

**Processing steps**

* Generate FS masks (results in ../atlas) (:ref:`Generate_FS_Masks_AZS`)
* Create conc file (:ref:`conc_4dfp`) and move it to FCdir
* Compute frame censoring (DVARS) (:ref:`run_dvar_4dfp`) and create avg censored image -- only if no $fmtfile specified
* Compute defined mask and apply it (:ref:`compute_defined_4dfp`, :ref:`maskimg_4dfp`)
* Compute initial sd1 mean (:ref:`var_4dfp`, :ref:`qnt_4dfp`)
* Make timeseries zero mean (:ref:`var_4dfp`)
* Make movement regressors for each bold run (:ref:`mat2dat`)
* Temporal bandpass filter using $bpss_params (:ref:`bandpass_4dfp`)
* Make whole brain regressors including the 1st derivative (:ref:`qnt_4dfp`)
* Make extra-axial CSF regressors (:ref:`maskimg_4dfp`)
* Make venticle movement_regressors (:ref:`qntv_4dfp`)
* Make white matter regressors (:ref:`qntv_4dfp`)
* Paste nuisance regressors together (including task_regressor if supplied)
* Pass final set of nuisance regressors (omitting WB and WB derivative) through :ref:`covariance` -D250
* Remove nuisance regressors out of volumetric time series (:ref:`glm_4dfp`)
* Spatial blur with f_half = $blur if specified (:ref:`gauss_4dfp`)

fcMRI_preproc_090115H.csh
+++++++++++++++++++++++++
Hallquist compliant version of :ref:`fcMRI_preproc_090115`

|params_header|

.. list-table::
	:widths: 15	5 65
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- srcdir
		- |srcdir_vals|
		- |srcdir_desc|
	*	- workdir
		- |workdir_vals|
		- |workdir_desc|
	* 	- fcbolds
		- |fcbolds_vals|
		- |fcbolds_desc|

|inst_header|

.. list-table::
	:widths: 15	5 65
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- FCdir
		- |FCdir_vals|
		- |FCdir_desc|
	* 	- MB
		- |MB_skip_vals|
		- |MB_skip_desc|
	* 	- conc
		- |conc_vals|
		- |conc_desc|
	* 	- task_regressor
		- |task_regressor_vals|
		- |task_regressor_desc|
	* 	- noGSR
		- |noGSR_vals|
		- |noGSR_desc|
	* 	- noWM
		- |noWM_vals|
		- |noWM_desc|
	*	- movement_regressors
		- |movement_regressors_vals|
		- |movement_regressors_desc|

**Processing steps**

* Create conc file (:ref:`conc_4dfp`) and move it to FCdir
* Compute defined mask and apply it (:ref:`compute_defined_4dfp`, :ref:`maskimg_4dfp`)
* Compute initial sd1 mean (:ref:`var_4dfp`, :ref:`qnt_4dfp`)
* Spatial blur with f_half = .735452 (:ref:`gauss_4dfp`)
* Temporal bandpass filter with bh = .1 and oh = 2 (:ref:`bandpass_4dfp`)
* Make movement regressors for each bold run (:ref:`mat2dat`) (if $movement_regressors is not "none")
* Make whole brain, ventricle, and bilateral white matter regressors (:ref:`qnt_4dfp`)
* Paste nuisance regressors together (including task_regressor if supplied)
* Pass final set of nuisance regressors (omitting WB and WB derivative) through :ref:`covariance` -D500
* Remove nuisance regressors out of volumetric time series (:ref:`glm_4dfp`)

.. _fcMRI_preproc_090115:

fcMRI_preproc_090115.csh
++++++++++++++++++++++++
|params_header|

.. list-table::
	:widths: 15	5 65
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	* 	- srcdir
		- |srcdir_vals|
		- |srcdir_desc|
	*	- workdir
		- |workdir_vals|
		- |workdir_desc|
	* 	- fcbolds
		- |fcbolds_vals|
		- |fcbolds_desc|

|inst_header|

.. list-table::
	:widths: 15	5 65
	:class: wrap-row
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- FCdir
		- |FCdir_vals|
		- |FCdir_desc|
	* 	- MB
		- |MB_skip_vals|
		- |MB_skip_desc|
	* 	- conc
		- |conc_vals|
		- |conc_desc|
	* 	- task_regressor
		- |task_regressor_vals|
		- |task_regressor_desc|
	* 	- noGSR
		- |noGSR_vals|
		- |noGSR_desc|

**Processing steps**

* Create conc file (:ref:`conc_4dfp`) and move it to FCdir
* Compute defined mask and apply it (:ref:`compute_defined_4dfp`, :ref:`maskimg_4dfp`)
* Compute initial sd1 mean (:ref:`var_4dfp`, :ref:`qnt_4dfp`)
* Spatial blur with f_half = .735452 (:ref:`gauss_4dfp`)
* Temporal bandpass filter with bh = .1 and oh = 2 (:ref:`bandpass_4dfp`)
* Make movement regressors for each bold run (:ref:`mat2dat`)
* Make whole brain, ventricle, and bilateral white matter regressors (:ref:`qnt_4dfp`)
* Paste nuisance regressors together (including task_regressor if supplied)
* Remove nuisance regressors out of volumetric time series (:ref:`glm_4dfp`)

.. _seed_correl:

seed_correl
-----------
compute multi-volume correlation maps

.. attention:: :code:`seed_correl` assumes successful completion of BOLD preprocessing (:ref:`cross_bold_pp`) and fcMRI preprocessing (:ref:`fcMRI_preproc`).

Usage:	seed_correl_<version>.csh <parameters file> [instructions] [options]

seed_correl_140413.csh
++++++++++++++++++++++

seed_correl_130715.csh
++++++++++++++++++++++

seed_correl_090115.csh
++++++++++++++++++++++
