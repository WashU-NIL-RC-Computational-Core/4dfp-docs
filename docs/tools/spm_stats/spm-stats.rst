.. include:: ../../global.rst

.. _spm_voxelwise_statistical_operations:

SPM-like voxelwise statistical operations
=========================================

t2z_4dfp
--------
t-map :math:`\rightarrow` Z-map

Usage:	t2z_4dfp <(4dfp) t-image>

Examples::

	t2z_4dfp NP705_cond1_zfrm_RFX -nNP705_cond1_N

Options

=======	==================================================
-l		output -log10(prob(t))
-N<flt>	specify global n
-n<str>	specify 4dfp n-image (up to two allowed)
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	undefined (1.e-37, NaN) voxels in input are output as 1.e-37 |br|
N.B.:	output values are assigned the same sign as the input t value |br|
N.B.:	the same n values apply to all volumes the input <t-image>

z2logp_4dfp
-----------
Z-map :math:`\rightarrow` log\ :sub:`10`\ p-map

Usage:	z2logp_4dfp <(4dfp) Z-image>

Examples::

	z2logp_4dfp vce20_z[.4dfp[.img]]

Options

=======	==================================================
-2		two sided test (default one sided)
-p		output p-values (default output -log10(p))
-@<b|l>	output big or little endian (default input endian)
=======	==================================================

N.B.:	probability computed on assumption that voxel values are N(0,1) |br|
N.B.:	undefined (1.e-37, NaN, Inf) voxels in input are output as 1.e-37

.. _rho2z_4dfp:

rho2z_4dfp
----------
r-map :math:`\leftrightarrow` Fisher z-map

Usage:	rho2z_4dfp <(4dfp) image> [outroot]

Examples::

	rho2z_4dfp vce20_rho[.4dfp[.img]]

Options

=======	==================================================
-r		reverse (convert z to r) (output trailer = _corr)
-E		output undefined voxels as 1.0e-37 (default 0.0)
-@<b|l>	output big or little endian (default input-endian)
=======	==================================================

N.B.:	default r to z output filename = <image>_zfrm
