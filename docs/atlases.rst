.. _atlases:

Atlases
=======

The 4dfp suite operates across several standard stereotactic coordinate systems (often referred to as atlas spaces). Because neuroimaging atlases differ in their historical construction, overall brain scaling, origin definitions, and voxel matrix dimensions, spatial transformations (:term:`t4file`) and target sampling grids in 4dfp are always tied to a specific coordinate space.

.. list-table::
   :widths: 22 38 40
   :header-rows: 1

   * - Atlas Space
     - Historical Basis & Scaling
     - Role in 4dfp
   * - **Talairach (1988)**
     - Post-mortem stereotactic print atlas defining AC-PC alignment and proportional brain dimensions.
     - Conceptual coordinate foundation for WashU stereotactic spaces.
   * - **711-2A**
     - Initial WashU 12-subject young-adult MPRAGE average scaled to 1988 Talairach proportions.
     - Legacy target superseded by ``711-2B``; supported via a fixed affine mapping for archival datasets.
   * - **711-2B**
     - Refined version of the 12-subject young-adult MPRAGE average anchored via 9-parameter Talairach scaling.
     - Primary native atlas space of 4dfp; defines the standard ``111``, ``222``, and ``333`` grids.
   * - **711-2 Family Variants** (``711-2C``, ``711-2Y``, ``TRIO_Y_NDC``)
     - Age-stratified and scanner-matched templates built directly within ``711-2B`` coordinate space.
     - Improves affine registration across lifespan cohorts and 3T scanners while landing directly in ``711-2B`` space.
   * - **MNI305 / MNI152**
     - Multi-subject Montreal Neurological Institute averages with a larger bounding box than Talairach.
     - Supported target space for cross-suite interoperability (FSL, SPM, FreeSurfer, BIDS, and CIFTI pipelines).

.. _atlas_talairach:

Talairach Space (1988)
----------------------

Defined by Jean Talairach and Pierre Tournoux in their 1988 stereotactic print atlas, this coordinate system establishes the anatomical conventions underlying 4dfp's native coordinate space. Talairach space orients the brain along the horizontal line passing through the superior edge of the **anterior commissure (AC)** and the inferior edge of the **posterior commissure (PC)**, placing the coordinate origin :math:`(0, 0, 0)` at the anterior commissure.

Because the 1988 atlas was constructed from a single post-mortem hemisphere (a 60-year-old French female), its overall bounding-box dimensions are notably compact compared to modern population MRI averages. Rather than requiring manual AC–PC landmarking on every individual scan, 4dfp relies on volumetric MRI templates that were linearly aligned and scaled to match 1988 Talairach brain proportions. As a result, stereotactic coordinates reported in 4dfp's native atlas space correspond directly to 1988 Talairach coordinates.

.. _atlas_711-2b:

Washington University 711-2B
----------------------------

**711-2B** is the primary atlas space reference space used throughout the 4dfp software suite [2]_. Developed at Washington University in St. Louis in the mid-1990s, ``711-2B`` was created to provide a high-contrast, automated 3D registration target that preserved compatibility with existing Talairach-referenced PET and fMRI literature.

To construct the target, high-resolution T1-weighted MPRAGE scans from **12 healthy young adults** were mutually coregistered using 12-parameter affine transformations [2]_. The resulting group-average brain was then aligned to the 1988 Talairach & Tournoux atlas using the **9-parameter Spatial Normalization (SN)** approach introduced by Fox and Lancaster [1]_, which applies 3 translations, 3 rotations, and **3 independent linear scaling factors along the X, Y, and Z axes** to compress ("squeeze") the average brain into the compact bounding-box dimensions of the 1988 Talairach atlas. ``711-2B`` is a slightly refined revision of an earlier iteration (:ref:`atlas_711-2a`) and serves as the enduring WashU reference standard [3]_.

Because ``711-2B`` serves as 4dfp's native coordinate system, the suite defines three canonical isotropic sampling grids tailored to its bounding box and AC-PC origin:

- **111** (1 mm isotropic, :math:`176 \times 208 \times 176` voxels): Standard high-resolution lattice for structural imaging (T1w/MPRAGE, T2w), anatomical segmentation, and cortical surface projection.
- **222** (2 mm isotropic, :math:`128 \times 128 \times 75` voxels): Intermediate lattice commonly used for group anatomical averages, PET imaging, diffusion workflows, and higher-resolution fMRI.
- **333[.n]** (3 mm isotropic, :math:`48 \times 64 \times 48` voxels): Default lattice for 4D BOLD fMRI time series. An optional decimal offset (such as ``333.8``) shifts the anterior-posterior (Y-axis) grid center upward by *n* voxels to prevent frontal or occipital clipping in subjects with elongated brains.

.. _atlas_711-2a:

Washington University 711-2A (Legacy)
-------------------------------------

**711-2A** was the initial release of Washington University's 12-subject young-adult MPRAGE stereotactic target. It was subsequently superseded by :ref:`atlas_711-2b`, which introduced a minor, fixed affine adjustment to the template's scaling and alignment.

Although ``711-2A`` is no longer used for new acquisitions, archival studies and legacy datasets still contain transformation matrices computed against ``711-2A``. Because the exact affine relationship between ``711-2A`` and ``711-2B`` is known, 4dfp natively supports converting legacy ``711-2A`` transforms into ``711-2B`` space so historical data can be resampled onto standard ``111``, ``222``, or ``333`` grids alongside modern cohorts.

.. _atlas_711-2_variants:

Age- and Scanner-Specific Targets in 711-2 Space
------------------------------------------------

While ``711-2B`` was built from young adults, applying a young-adult template directly to older adults—or to scans acquired with substantially different T1-weighted tissue contrast—can introduce systematic affine scaling biases due to age-related cortical atrophy and ventricular expansion [3]_. To address this without abandoning the ``711-2B`` coordinate system, Washington University researchers created several specialized population templates aligned directly to ``711-2B`` space [3]_:

- **711-2Y**: A young-adult T1-weighted target aligned to ``711-2B`` space [3]_.
- **711-2C**: A combined lifespan template averaging young and older adults (including healthy aging cohorts) in ``711-2B`` space [3]_. In addition to aging and dementia studies at WashU, ``711-2C`` was adopted by FreeSurfer for affine Talairach registration and estimated total intracranial volume (eTIV) normalization.
- **711-2L**: An additional age-stratified template constructed within the same ``711-2B`` coordinate framework.
- **TRIO_Y_NDC**: A young-adult target built in ``711-2B`` space from 3T Siemens Trio acquisitions, providing improved intensity and contrast matching for modern 3T structural scans.

Because all of these templates share the exact coordinate origin, orientation, and proportional scaling of ``711-2B``, any subject registered to one of these targets is automatically aligned to standard ``711-2B`` space and compatible with its ``111``, ``222``, and ``333`` grids.

.. _atlas_mni:

MNI305 and MNI152 Space
-----------------------

Developed at the Montreal Neurological Institute by the International Consortium for Brain Mapping (ICBM) [4]_ [5]_, **MNI305** and its successor **MNI152** are the standard template spaces across FSL, SPM, FreeSurfer, BIDS, and Human Connectome Project (HCP/CIFTI) workflows. MNI305 was constructed by averaging 305 young adult MRI scans linearly aligned to a manually landmarked target, and MNI152 was subsequently generated by registering 152 higher-resolution T1-weighted scans onto MNI305 [5]_.

- **Structural Differences from 711-2B**: Unlike ``711-2B``, which was scaled down to match the 1988 Talairach print atlas, MNI templates retained a noticeably larger overall brain volume—particularly along the superior–inferior and anterior–posterior axes—as well as a shifted coordinate origin.
- **Role in 4dfp**: While ``711-2B`` remains 4dfp's native coordinate system, 4dfp supports MNI152 (and MNI305) as an interoperable output space for multi-site studies and surface-based pipelines. Transformations into MNI space can either be estimated directly against an MNI template or composed from ``711-2B`` space using calibrated affine mappings between ``711-2B`` and MNI152/MNI305. Because MNI space has a larger bounding box and different origin than ``711-2B``, MNI-aligned volumes must always use an MNI template grid (such as 1 mm or 2 mm isotropic MNI152) rather than ``711-2B``'s ``111``, ``222``, or ``333`` grid definitions.

.. rubric:: References

.. [1] Fox, P. T., Perlmutter, J. S., & Raichle, M. E. (1985). `A Stereotactic Method of Anatomical Localization for Positron Emission Tomography <https://doi.org/10.1097/00004728-198501000-00025>`_. *Journal of Computer Assisted Tomography*, 9(1), 141-153.

.. [2] Ojemann, J. G., Akbudak, E., Snyder, A. Z., McKinstry, R. C., Raichle, M. E., & Conturo, T. E. (1997). `Anatomic Localization and Quantitative Analysis of Gradient Refocused Echo-Planar fMRI Susceptibility Artifacts <https://doi.org/10.1006/nimg.1997.0289>`_. *NeuroImage*, 6(3), 156–167.

.. [3] Buckner, R. L., Head, D., Parker, J., Fotenos, A. F., Marcus, D., Morris, J. C., & Snyder, A. Z. (2004). `A unified approach for morphometric and functional data analysis in young, old, and demented adults using automated atlas-based head size normalization: reliability and validation against manual measurement of total intracranial volume <https://doi.org/10.1016/j.neuroimage.2004.06.018>`_. *NeuroImage*, 23(2), 724-738.

.. [4] Mazziotta, J. C., Toga, A. W., Evans, A., Fox, P., & Lancaster, J. (1995). `A Probabilistic Atlas of the Human Brain: Theory and Rationale for Its Development <https://doi.org/10.1006/nimg.1995.1012>`_. *NeuroImage*, 2(2), 89-101.

.. [5] Mazziotta, J., Toga, A., Evans, A., Fox, P., Lancaster, J., et al. (2001). `A probabilistic atlas and reference system for the human brain: International Consortium for Brain Mapping (ICBM) <https://doi.org/10.1098/rstb.2001.0915>`_. *Philosophical Transactions of the Royal Society of London. Series B: Biological Sciences*, 356(1412), 1293-1322.