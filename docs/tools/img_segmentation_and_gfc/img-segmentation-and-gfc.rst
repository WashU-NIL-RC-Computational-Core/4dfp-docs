.. include:: ../../global.rst

.. _image_segmentation_and_gain_field_correction:

Image segmentation and gain field correction
============================================

partitiond_gfc_4dfp
-------------------
intensity inhomogeneity  correction assuming 3D parabolic gain field

Usage:	partitiond_gfc_4dfp <imgroot>

Examples::

	partitiond_gfc_4dfp vc1440_mpr_n4_111_t88.4dfp

Options

================	=====================================================
-g					freeze initial gain field
-n					force negative definite quadratic gain field
-v					verbose mode
-p<flt> 			pre-blur by specified FWHM in mm
-b<flt>				specify bandwidth in intensity units (default=200.0)
-e<flt>				specify drms convergence criterion (default=0.000200)
-i<flt>				specify sigma (default=1.000000)
-l<int>				specify iteration limit (default=8)
-m<flt>				specify gfc computation region count (default=24)
-s<flt>				specify space constant in mm (default=4.000000)
-z<flt>				specify background threshold (default=180.0)
-M<flt>				specify maximum correction factor
-r<flt>[to<flt>]	specify gfc range (default=0.0to10000.0)
================	=====================================================
