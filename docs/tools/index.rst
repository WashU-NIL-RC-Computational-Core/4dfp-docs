:orphan:

==========
4dfp Tools
==========

.. grid:: 1 2 2 2
   :gutter: 3

   .. grid-item-card:: 📥 DICOM Utilities
      :link: dicom_utilities/index
      :link-type: doc
      :class-card: nav-card

      Low-level C utilities for inspecting DICOM tags, extracting metadata headers, and parsing DICOM data.

   .. grid-item-card:: 🌐 DTI
      :link: dti/dti
      :link-type: doc
      :class-card: nav-card

      Single- and cross-run DWI motion compensation, tensor fitting (MD, FA, eigenvalues/eigenvectors), directional RGB color mapping, and vector whisker exports.

   .. grid-item-card:: 📍 Evaluate and ROI
      :link: evaluate_and_roi/evaluate-and-roi
      :link-type: doc
      :class-card: nav-card

      Peak detection, spherical ROI burning, multi-region sampling (mean, dice, weighted), coordinate lookups, histograms, spatial covariance/PCA, and temporal variance (DVARS).

   .. grid-item-card:: 🌀 Filter In Space
      :link: filter_in_space/filter-in-space
      :link-type: doc
      :class-card: nav-card

      Frequency- and spatial-domain 3D Gaussian smoothing (isotropic or axis-selective x/y/z), spatial differentiation, and hard-sphere kernel convolution.

   .. grid-item-card:: ⏳ Filter In Time
      :link: filter_in_time/filter-in-time
      :link-type: doc
      :class-card: nav-card

      Butterworth temporal filtering (bandpass, low-pass, high-pass), linear trend and DC removal, and frame interpolation across 4dfp/conc timeseries.

   .. grid-item-card:: ⚡ fMRI Oriented Tools
      :link: fmri/fmri
      :link-type: doc
      :class-card: nav-card

      Within- and cross-run motion correction, motion trajectory reporting, slice-timing correction, mode 1000 normalization, artifact removal (debanding, k-space spikes), retinotopy phase mapping, and event-jitter design.

   .. grid-item-card:: 🏷️ Format String Manipulation
      :link: format_string/format-string
      :link-type: doc
      :class-card: nav-card

      Utilities for condensing, expanding, and parsing frame-selection format strings that specify functional run states, skipped frames, and frame weighting.

   .. grid-item-card:: 📈 GLM and Related Operations
      :link: glm/glm
      :link-type: doc
      :class-card: nav-card

      Voxelwise GLM regression (partial/total beta coefficients, percent modulation, residuals), cross-correlation inner-product maps, Granger causality analysis, and cross-spectral/lagged covariance tools.

   .. grid-item-card:: 🧮 Image Algebra
      :link: image_algebra/image-algebra
      :link-type: doc
      :class-card: nav-card

      Voxelwise arithmetic (addition, subtraction, multiplication, division), linear scaling ($mA + b$), square root transforms, and multi-volume statistical reductions (mean, variance, geometric mean, min/max).

   .. grid-item-card:: 🧩 Image Segmentation and Gain Field Correction
      :link: img_segmentation_and_gfc/img-segmentation-and-gfc
      :link-type: doc
      :class-card: nav-card

      Intensity inhomogeneity correction, 3D parabolic gain field estimation, and spatial tissue background partitioning.

   .. grid-item-card:: 🔄 Interconvert Image Formats
      :link: interconvert_formats/interconvert-formats
      :link-type: doc
      :class-card: nav-card

      Bidirectional conversion between 4dfp, DICOM, NIfTI, Analyze, microPET, Varian, and ASCII text formats, alongside endianness and header operations.

   .. grid-item-card:: 🔀 Rearrange Voxels In Space or Time
      :link: rearrange_voxels/rearrange-voxels
      :link-type: doc
      :class-card: nav-card

      Spatial orientation conversions (transverse, sagittal, coronal), coordinate flipping, axis reindexing, spatial cropping, frame extraction, temporal averaging/appending, and mosaic-to-volume unpacking.

   .. grid-item-card:: 🎯 Spatial Registration & Transforms
      :link: spacial_registration_and_transforms/index
      :link-type: doc
      :class-card: nav-card

      Rigid-body and affine spatial registration, matrix manipulation (composition, inversion, decomposition), image resampling with flexible interpolation options, and point-coordinate transformations between atlas spaces.

   .. grid-item-card:: 📊 SPM-like Voxelwise Statistical Operations
      :link: spm_stats/spm-stats
      :link-type: doc
      :class-card: nav-card

      Voxelwise statistical map transformations, including t-statistic to Z-score conversions, Z-score to p-value mapping, and bidirectional correlation r to Fisher z transformations.

   .. grid-item-card:: 🔲 Threshold and Mask
      :link: threshold_and_mask/threshold-and-mask
      :link-type: doc
      :class-card: nav-card

      Voxel intensity thresholding, range-based zeroing, slice-wise masking, binary mask application, and contiguous cluster identification and filtering.