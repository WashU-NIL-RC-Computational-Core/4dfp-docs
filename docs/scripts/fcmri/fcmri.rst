.. include:: ../../global.rst

.. _fcmri:

fcMRI oriented scripts
======================

.. include:: ../../notes/params-file-tip.rst

.. _fcMRI_preproc_161012:

fcMRI_preproc_161012.csh
-------------------------
fcMRI preprocessing including nuisance variable regression

.. attention:: :code:`fcMRI_preproc_161012` assumes successful completion of BOLD preprocessing (:ref:`cross_bold_pp_161012`).

Usage:	fcMRI_preproc_<version>.csh <params file> [instructions file]

Examples::

	fcMRI_preproc_161012.csh VB16168.params

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
	*	- target
		- |target_vals|
		- |target_desc|
	*	- FSdir
		- |FSdir_vals|
		- |FSdir_desc|
	* 	- srcdir
		- |srcdir_vals|
		- |srcdir_desc|
	* 	- fcbolds
		- |fcbolds_vals|
		- |fcbolds_desc|
	* 	- TR_vol
		- |TR_vol_vals|
		- |TR_vol_desc|
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

**Optional parameters**

.. list-table::
	:widths: 15	5 5 60
	:header-rows: 1

	*	- Variable
		- Values
		- Default
		- Description
	*	- FCdir
		- |FCdir_vals|
		- |FCdir_default|
		- |FCdir_desc|
	*	- day1_patid
		- |day1_patid_vals|
		-
		- |day1_patid_desc|
	*	- MB
		- |MB_skip_vals|
		- |MB_skip_default|
		- |MB_skip_desc|
	* 	- blur
		- |blur_vals|
		- |blur_default|
		- |blur_desc|
	*	- bpss_params
		- |bpss_params_vals|
		-
		- |bpss_params_desc|
	*	- conc
		- |conc_vals|
		-
		- |conc_desc|
	* 	- fmtfile
		- |fmtfile_vals|
		-
		- |fmtfile_desc|
	*	- FDthresh
		- |FDthresh_vals|
		-
		- |FDthresh_desc|
	* 	- FDtype
		- |FDtype_vals|
		- |FDType_default|
		- |FDtype_desc|
	* 	- anat_aveb
		- |anat_aveb_vals|
		- |anat_aveb_default|
		- |anat_aveb_desc|
	* 	- anat_avet
		- |anat_avet_vals|
		- |anat_avet_default|
		- |anat_avet_desc|
	* 	- min_frames
		- |min_frames_vals|
		- |min_frames_fcpreproc_default|
		- |min_frames_desc|
	*	- CSF_excl_lim
		- |CSF_excl_lim_vals|
		- |CSF_excl_lim_default|
		- |CSF_excl_lim_desc|
	* 	- task_regressor
	  	- |task_regressor_vals|
		-
	  	- |task_regressor_desc|
  	* 	- noGSR
		- |noGSR_vals|
		- |noGSR_default|
		- |noGSR_desc|

**Processing steps**

.. list-table::
	:widths: 25 15 30
	:class: wrap-rows
	:header-rows: 1

	*	- Step description
		- Function
		- Output
	* 	- Generate FS masks if they don't already exist
		- :ref:`Generate_FS_Masks_AZS`
		- **atlas/** |br| <patid>_orig_to_<target>_t4 |br| <patid>_FSWB_on_<target>_333.4dfp.img |br| <patid>_GM_on_<target>_333_comp_b60.4dfp.img |br| <patid>_(WM,CS)_erode_on_<target>_333_clus.4dfp.img
	*	- Create conc file
		- :ref:`conc_4dfp`
		- **<FCdir>/** |br| $conc |br| or, <patid>[_faln_dbnd]_xr3d_uwrp_atl.conc
	* 	- Compute frame censoring using FD (if $FDthresh specified) and DVARS -- skipped if $fmtfile is specified
		-  FD.awk, :ref:`run_dvar_4dfp`
		- **movement/** |br| <patid>[_faln_dbnd]_xr3d.FD |br| **atlas/** |br| <patid>[_faln_dbnd]_xr3d.FD.format (if $FDthresh) |br| <patid>_func_vols(.vals, .dat, .crit, .xmgr, .format)
	*	- Create average censored image
		- :ref:`actmapf_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_ave.4dfp.img
	*	- Compute defined mask and apply it
		- :ref:`compute_defined_4dfp`, :ref:`maskimg_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_dfnd.4dfp.img |br| **atlas/** |br|  <patid>[_faln_dbnd]_xr3d_uwrp_atl_dfndm.4dfp.img
	*	- Compute initial sd1 mean
		- :ref:`var_4dfp`, :ref:`qnt_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_sd1.4dfp.img
	* 	- Make timeseries zero mean
		- :ref:`var_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_uout.conc
	*	- Make movement regressors for each bold run
		- :ref:`mat2dat`, :ref:`conc_4dfp`, :ref:`bandpass_4dfp`,  4dfptoascii
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_dat.conc |br| <patid>[_faln_dbnd]_xr3d_dat_bpss.conc |br| <patid>_<patid>_mov_regressors.dat
	* 	- Temporal bandpass filter using $bpss_params
		- :ref:`bandpass_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss.conc
	*	- Make whole brain regressors including the 1st derivative
		- :ref:`qnt_4dfp`
		- **<FCdir>/** |br| <patid>_WB_regressors_dt.dat
	* 	- Make extra-axial CSF regressors (thresholded at $CSF_excl_lim)
		- :ref:`maskimg_4dfp`, :ref:`qntv_4dfp`
		- **<FCdir>/** |br| <patid>_CSF_mask.4dfp.img |br| <patid>_CSF_dies.4dfp.img |br| <patid>_CSF_regressors.dat
	*	-  Make venticle regressors
		- :ref:`maskimg_4dfp`, :ref:`qntv_4dfp`
		- **<FCdir>/** |br| <patid>_vent_mask.4dfp.img |br| <patid>_vent_dies.4dfp.img |br| <patid>_vent_regressors.dat
	*	- Make white matter regressors
		- :ref:`maskimg_4dfp`, :ref:`qntv_4dfp`
		- **<FCdir>/** |br| <patid>_WM_mask.4dfp.img |br| <patid>_WM_dies.4dfp.img |br| <patid>_WM_regressors.dat
	*	- Paste nuisance regressors (mov, CSF, vent, WM, task) together and run covariance analysis
		- :ref:`covariance` (-D250)
		-
	* 	- Paste together WB and WB derivative, and covaried nuissance regressors
		-
		- **<FCdir>/** |br| <patid>_nuisance_regressors.dat
	*	- Remove nuisance regressors out of volumetric time series
		- :ref:`glm_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid.conc |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_coeff.4dfp.img
	*	- Compute sd1 mean for bandpass-filtered and nuisance regressed data
		- :ref:`var_4dfp`, :ref:`qnt_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid_sd1.4dfp.img |br| (comparison to initial WB mean reported to stdout)
	*	- Spatial blur with f_half = $blur if specified
		- :ref:`gauss_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid_g<blur>.conc
	*	- Compute sd1 mean for blurred data if $blur
		- :ref:`var_4dfp`, :ref:`qnt_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid_g<blur>_sd1.4dfp.img |br| (mean reported to stdout)

.. _seed_correl_161012:

seed_correl_161012.csh
-----------------------
compute multi-volume correlation maps

.. attention:: :code:`seed_correl_161012` assumes successful completion of BOLD preprocessing (:ref:`cross_bold_pp_161012`) and fcMRI preprocessing (:ref:`fcMRI_preproc_161012`).

Usage:	seed_correl_161012.csh <parameters file> [instructions] [options]

Examples::

	seed_correl_161012.csh VB16168.params

**Options**

=======	===========================================================
-noblur	analyze unblurred version of preprocessed data
-A		use format in atlas subdirectory (default FCmaps directory)
=======	===========================================================

**Required variables**

.. list-table::
	:widths: 15	5 65
	:header-rows: 1

	*	- Variable
		- Values
		- Description
	* 	- patid
		- |patid_vals|
		- |patid_desc|
	*	- ROIdir
		- |ROIdir_vals|
		- |ROIdir_desc|
	* 	- skip
		- |skip_vals|
		- |skip_desc|

**ROI specification variables (required)**

===========    ==================   =================================================================================
Variable       Values               Description
===========    ==================   =================================================================================
**Option 1**
---------------------------------------------------------------------------------------------------------------------
ROIimg         |ROIimg_vals|        |ROIimg_desc|
**Option 2**
---------------------------------------------------------------------------------------------------------------------
ROIlist        |ROIlist_vals|       |ROIlist_desc|
**Option 3**
---------------------------------------------------------------------------------------------------------------------
ROIlistfile    |ROIlistfile_vals|   |ROIlistfile_desc|
===========    ==================   =================================================================================

**Optional variables**

.. list-table::
	:widths: 15	5 5 60
	:header-rows: 1

	*	- Variable
		- Values
		- Default
		- Description
	*	- FCdir
		- |FCdir_vals|
		- |FCdir_default|
		- |FCdir_desc|
	* 	- MB
		- |MB_skip_vals|
		- |MB_skip_default|
		- |MB_skip_desc|
	*	- blur
		- |blur_vals|
		- |blur_default|
		- |blur_desc|
	*	- bpss_params
		- |bpss_params_vals|
		-
		- |bpss_params_desc|
	* 	- conc
		- |conc_vals|
		-
		- |conc_desc|
	* 	- fmtfile
		- |fmtfile_vals|
		-
		- |fmtfile_desc|

**Processing Steps**

.. list-table::
	:widths: 25 15 30
	:class: wrap-rows
	:header-rows: 1

	*	- Step description
		- Function
		- Output
	* 	- Create (multi-volume) ROI image if $ROIlistfile or $ROIlist specified
		- :ref:`paste_4dfp`
		-
	*	- Calculate seed (ROI) regressors
		- :ref:`qntm_4dfp`
		- **<FCdir>/** |br| <patid>_seed_regressors.dat |br| <patid>_seed_regressors.rec
	*	- Compute total correlations
		- :ref:`glm_4dfp` (-t)
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid[_g<blur>]_tcorr.4dfp.img
	*	- Mask total correlation image by defined voxels
		- :ref:`maskimg_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid[_g<blur>]_tcorr_dfnd.4dfp.img
	*	- Fisher z transform total correlation
		- :ref:`rho2z_4dfp`
		- **<FCdir>/** |br| <patid>[_faln_dbnd]_xr3d_uwrp_atl_bpss_resid[_g<blur>]_tcorr_dfnd_zfrm.4dfp.img
	*	- Compute zero-lag ROI-ROI correlation matrix (if number of ROIs <= 256)
		- :ref:`covariance` (-u, -o, -m0)
		- **<FCdir>/** |br| <patid>_seed_regressors_CCR.dat


.. _Generate_FS_Masks_AZS:

Generate_FS_Masks_AZS.csh
--------------------------
generate Freesurfer masks for whole brain, WM, GM, CSF

Usage:	Generate_FS_Masks_AZS.csh <parameters file> [instructions]

Examples::

	Generate_FS_Masks_AZS.csh FCS_039_A_1.params ../uwrp_process_Stroke_SMG_Subjects.params

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
	*	- FSdir
		- |FSdir_vals|
		- |FSdir_desc|
	*	- target
		- |target_vals|
		- |target_desc|
