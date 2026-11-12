=================================
Spatial Registration & Transforms
=================================

.. toctree::
   :maxdepth: 1
   :hidden:

   imgreg_4dfp <imgreg_4dfp>
   t4img_4dfp <t4img_4dfp>
   t4imgs_4dfp <t4imgs_4dfp>
   wrpsmg_4dfp <wrpsmg_4dfp>
   t4_mul <t4_mul>
   t4_inv <t4_inv>
   t4_factor <t4_factor>
   t4_null <t4_null>
   t4_resolve <t4_resolve>
   t4_pts <t4_pts>
   stretch_out <stretch_out>


.. rubric:: Image Registration & Resampling

.. grid:: 1 2 2 2
   :gutter: 3

   .. grid-item-card:: 🎯 imgreg_4dfp
      :link: imgreg_4dfp
      :link-type: doc
      :class-card: nav-card

      Calculate 2D or 3D affine registration between source and target scans to output t4 transformation matrices.

   .. grid-item-card:: 🖼️ t4img_4dfp
      :link: t4img_4dfp
      :link-type: doc
      :class-card: nav-card

      Resample a single 4dfp image using a t4 transformation matrix into a target coordinate space.

   .. grid-item-card:: 🖼️ t4imgs_4dfp
      :link: t4imgs_4dfp
      :link-type: doc
      :class-card: nav-card

      Apply t4 transformation matrices to a list of 4dfp images to resample and average them into a target coordinate space.

   .. grid-item-card:: 📊 wrpsmg_4dfp
      :link: wrpsmg_4dfp
      :link-type: doc
      :class-card: nav-card

      Apply t4 transforms to resample and average difference images specified in an input list into a target coordinate space.


.. rubric:: Transform & Coordinate Utilities

.. grid:: 1 2 2 2
   :gutter: 3

   .. grid-item-card:: ✖️ t4_mul
      :link: t4_mul
      :link-type: doc
      :class-card: nav-card

      Compose two sequential t4 transformation matrices into a single combined product transform.

   .. grid-item-card:: 🔄 t4_inv
      :link: t4_inv
      :link-type: doc
      :class-card: nav-card

      Invert a t4 transformation matrix to reverse coordinate mapping between source and target spaces.

   .. grid-item-card:: 📐 t4_factor
      :link: t4_factor
      :link-type: doc
      :class-card: nav-card

      Decompose a t4 transformation matrix into fundamental affine components, including translation, rotation, and stretch/scaling.

   .. grid-item-card:: ⭕ t4_null
      :link: t4_null
      :link-type: doc
      :class-card: nav-card

      Generate an identity t4 transformation matrix file representing zero spatial transformation.

   .. grid-item-card:: 🧩 t4_resolve
      :link: t4_resolve
      :link-type: doc
      :class-card: nav-card

      Compute optimal rigid-body transforms across a set of images to establish globally consistent alignment.

   .. grid-item-card:: 📍 t4_pts
      :link: t4_pts
      :link-type: doc
      :class-card: nav-card

      Transform point coordinates between reference spaces using a t4 transformation matrix.

   .. grid-item-card:: 📏 stretch_out
      :link: stretch_out
      :link-type: doc
      :class-card: nav-card

      Remove scale and stretch parameters from a t4 transformation matrix to yield a rigid-body transform.