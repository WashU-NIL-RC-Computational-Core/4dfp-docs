.. include:: ../../global.rst

.. _scripts_dti:

DTI
===

.. include:: ../../notes/params-file-tip.rst

generic_DWI_script_090219
-------------------------
generic DTI processing

Usage:	generic_DWI_script_090219 params_file [instructions_file]

cross_DWI_imgreg_4dfp
---------------------
atlas transform new data based on previous session results

Usage:	cross_DWI_imgreg_4dfp <curr_dwi> <day1_dwi_path> <day1_dwi> <atlas_representative_target> [options]

Examples::

	cross_DWI_imgreg_4dfp 6770_dwi /data/petsun24/data1/5575 5575_dwi [abspath/]711-2Y

N.B.:	cross_DWI_imgreg_4dfp must be run in the current DWI directory
