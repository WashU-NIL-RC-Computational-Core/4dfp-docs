.. 4dfp documentation master file, created by
   sphinx-quickstart on Fri Dec 29 12:26:26 2017.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

.. include:: ../README.rst

Contents
========

.. toctree::
   :caption: General
   :maxdepth: 2
   :hidden:

   format/index

.. toctree::
   :caption: Scripts
   :glob:
   :maxdepth: 2
   :hidden:

   scripts/dicom_utilities/index
   scripts/dti/*
   scripts/fcmri/*
   scripts/fmri/*
   scripts/misc/*
   scripts/registration/*
   scripts/_deprecated/*

.. toctree::
   :caption: Tools
   :glob:
   :maxdepth: 3
   :hidden:

   tools/dicom_utilities/index
   tools/dti/*
   tools/evaluate_and_roi/*
   tools/filter_in_space/*
   tools/filter_in_time/*
   tools/fmri/*
   tools/format_string/*
   tools/glm/*
   tools/image_algebra/*
   tools/img_segmentation_and_gfc/*
   tools/interconvert_formats/*
   tools/rearrange_voxels/*
   tools/register_in_space/*
   tools/spm_stats/*
   tools/threshold_and_mask/*

.. toctree::
   :caption: Worked Examples
   :glob:
   :maxdepth: 2
   :hidden:

   examples/*

.. toctree::
   :caption: Appendix
   :maxdepth: 2
   :hidden:

   params_inst


.. grid:: 1 2 3 3
   :gutter: 3

   .. grid-item-card:: 📄 General
      :link: format/index
      :link-type: doc
      :class-card: nav-card

      4dfp file formats, orientation rules, coordinate conventions, and target space definitions.

   .. grid-item-card:: 📜 Scripts
      :link: scripts/dicom_utilities/index
      :link-type: doc
      :class-card: nav-card

      Automation wrappers for DICOM sorting, fMRI preprocessing, registration, and DTI pipelines.

   .. grid-item-card:: 🛠️ Tools
      :link: tools/dicom_utilities/index
      :link-type: doc
      :class-card: nav-card

      Low-level C utilities for spatial/temporal filtering, image algebra, t4 transforms, and format conversion.

   .. grid-item-card:: 🧪 Worked Examples
      :link: examples/index
      :link-type: doc
      :class-card: nav-card

      Hands-on pipeline walkthroughs, command sequences, and execution guides for sample datasets.

   .. grid-item-card:: 📚 Appendix
      :link: params_inst
      :link-type: doc
      :class-card: nav-card

      Environment setup, build/install flags, .params file specifications, and reference tables.