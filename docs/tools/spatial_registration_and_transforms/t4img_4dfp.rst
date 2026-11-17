.. _t4img_4dfp:

Transform 4dfp Image (Single File)
==================================
.. rubric:: Tool: ``t4img_4dfp``

Synopsis
--------

::

   t4img_4dfp <t4file> <imgfile> [<outfile>] [-B] [-d] [-N] [-n] [-R] [-s] [-z] [-O<outspace>] [-@<endian>]

Description
-----------

Applies a spatial transformation matrix (:term:`t4file`) to resample a **single** :ref:`4dfp image<image_data>` into a target space or reference image grid [#wrapper]_. 

Rather than requiring a multi-image input list, ``t4img_4dfp`` automatically builds a single-entry resampling specification from your command-line inputs—pairing your input image with one spatial transformation matrix (or an identity transform when ``none`` is specified) without combining multiple scans.

* **Resampling Multiple Inputs Into a Single Output (n:1):** If you need to combine multiple separate images into a single output, or require custom per-scan weights, frame/slice selection, or input masks, use :ref:`t4imgs_4dfp<t4imgs_4dfp>`.
* **Resampling Multiple Inputs Into Multiple Outputs (n:n):** Neither ``t4img_4dfp`` nor :ref:`t4imgs_4dfp<t4imgs_4dfp>` outputs multiple separate files from a single command. To resample multiple images into their own output, run ``t4img_4dfp`` recursively inside a shell loop for each image (see :ref:`t4img_examples`).

By default, ``t4img_4dfp`` resamples voxels using :term:`Trilinear Interpolation` into :ref:`711-2B <atlas_711-2b>` ``333.0`` atlas space (:math:`48 \times 64 \times 48`, 3 mm isotropic) and writes the output image set (``.4dfp.img``, ``.4dfp.ifh``, and ``.4dfp.img.rec``) to ``<imgfile>t`` unless an ``<outfile>`` name is provided. 
Passing ``none`` for ``<t4file>`` applies an identity transform, allowing grid resampling, orientation conversion, or endianness conversion without spatial rotation or translation.

.. note::
  **File Extensions:** There is no need to pass the 4dfp file extensions like ``.4dfp.ifh`` or ``.4dfp.img``. Extensions are stripped automatically from ``<imgfile>`` and ``<outfile>``.

Usage
-----

.. list-table::
   :widths: 20 60
   :header-rows: 1

   * - Flag / Argument
     - Description
   * - ``-B``
     - :bdg-warning:`Legacy` Converts input transformation matrices from legacy Washington University :ref:`711-2A <atlas_711-2a>` atlas space to :ref:`711-2B <atlas_711-2b>` atlas space.
   * - ``-d``
     - Enables debugging output in the ``t4img_4dfp`` wrapper (ignored by ``t4imgs_4dfp``).
   * - ``-N``
     - Assigns ``NaN`` instead of ``0.0`` to output voxels with no valid input (e.g., out-of-FOV or masked).
   * - ``-n``
     - Uses :term:`Nearest-Neighbor Interpolation` instead of blending neighboring voxels—ideal for binary masks and integer ROI labels (ignores intensity scaling).
   * - ``-R``
     - Suppresses creation of the :ref:`rec_file`.
   * - ``-s``
     - Enables :term:`Cubic Spline Interpolation` for sharper anatomical resampling.
   * - ``-z``
     - Divides accumulated voxel sums by :math:`\sqrt{N}` rather than total weight :math:`N` (for combining inputs that are **already z-scored**). Has no effect on single-file ``t4img_4dfp`` runs (:math:`n = 1`); see :ref:`t4imgs_4dfp<t4imgs_4dfp>` for multi-image Z-map aggregation.
   * - ``-O<outspace>``
     - Sets the output space and voxel grid (defaults to ``333.0``; see :ref:`t4img_outspace`):

       * **711-2B shortcuts only** (``111``, ``222``, ``333[.n]``): Built-in resolution presets exclusively for WashU :ref:`711-2B <atlas_711-2b>` space.
       * **Reference image** (``<image>``): Root name of an existing :term:`4dfp` volume whose grid to match; required for :ref:`MNI152 <atlas_mni>`, native, or custom spaces.
   * - ``-@<endian>``
     - Forces output binary write format to :term:`Big-Endian` (``-@b``) or :term:`Little-Endian` (``-@l``); Defaults to native host CPU endianness.

.. note::    
  **Flag Syntax**: Pass single-letter flags separately (e.g., ``-n -R``, not ``-nR``). Values for ``-O<outspace>`` and ``-@<endian>`` must immediately follow the flag with no separating space (e.g., ``-O222``, ``-@b``); inserting a space causes the value to be misinterpreted as a positional file argument.

.. _t4img_outspace:

.. rubric:: Output Spaces & Target Grids

While :term:`t4file` defines the mathematical coordinate transformation from source space to target space, ``-O<outspace>`` defines the **target voxel grid** (matrix dimensions, voxel spacing, volume center, and anatomical orientation) onto which the image is resampled. 
Always match ``-O<outspace>`` to the coordinate system targeted by :term:`t4file`.

An output space does **not** have to be a stereotactic atlas. It can be any reference :ref:`4dfp image<image_data>`, such as:

- **A participants's native scan** (e.g., resampling a BOLD run onto that participant's native T1w grid).
- **A custom or study-specific template** (e.g., a cohort-averaged anatomical image).
- **A standard atlas** (see :ref:`atlases`).

.. note::
   **Y-Axis Center Offset (``-O333.n``)**: When using the ``333`` preset, appending a decimal offset shifts the anterior-posterior (Y-axis) grid center upward by ``n`` voxels to prevent frontal or occipital clipping in acquisitions or templates with shifted centers.

.. _t4img_interpolation:

Interpolation Methods
---------------------

When resampling an image into a new grid, output voxel centers rarely land exactly on original input voxel points; instead, they often fall at fractional coordinates :math:`(x, y, z)` between neighbors. 
Both ``t4img_4dfp`` and :ref:`t4imgs_4dfp<t4imgs_4dfp>` support three 3D interpolation methods that trade off neighborhood size, edge sharpness, and intensity preservation.

.. rubric:: Choosing an Interpolation Method

.. mermaid::
   :align: center

   flowchart LR
       classDef neutral fill:#f8f9fa,stroke:#ced4da,stroke-width:1.25px,color:#212529
       classDef green fill:#e8f0eb,stroke:#215732,stroke-width:1.5px,color:#212529
       classDef teal fill:#eef6f7,stroke:#007D8A,stroke-width:1.5px,color:#212529
       classDef crimson fill:#fbebee,stroke:#BA0C2F,stroke-width:1.5px,color:#212529

       START["<b>Input 4dfp Volume</b>"]:::neutral --> Q1{"Is the image a<br/>mask or ROI map?"}:::neutral
       Q1 -->|"Yes (binary masks, labeled regions)"| OUT_N["<b>Nearest-Neighbor (<code>-n</code>)</b><br/>Keeps exact label numbers without blending"]:::green
       Q1 -->|"No (brain scan or statistical map)"| Q2{"What type of scan<br/>are you resampling?"}:::neutral
       Q2 -->|"Functional / Statistical (BOLD, Z-maps)"| OUT_DEF["<b>Trilinear (Default)</b><br/>Gentle smoothing, no overshoot"]:::teal
       Q2 -->|"High-Res Structural (T1w, MPRAGE, T2w)"| OUT_S["<b>Cubic Spline (<code>-s</code>)</b><br/>Preserves sharp tissue boundaries"]:::crimson

.. rubric:: How Each Method Samples the Input Grid

.. list-table::
   :widths: 20 18 62
   :header-rows: 1

   * - Method
     - Neighborhood
     - Practical Trade-Offs & Pipeline Guidance
   * - **Trilinear** *(Default)*
     - :math:`2 \times 2 \times 2` (8 voxels)
     - * **Behavior:** Computes a distance-weighted average of the 8 surrounding voxels.
       * **Best for:** BOLD fMRI time series and statistical maps where mild spatial smoothing is acceptable.
       * **Trade-off:** Softens sharp edges slightly, but strictly stays within the local input range (no overshoot).
   * - **Cubic Spline** (``-s``)
     - :math:`4 \times 4 \times 4` (64 voxels)
     - * **Behavior:** Uses a wider 64-voxel neighborhood to estimate local intensity gradients and fit a smooth 3D curve.
       * **Best for:** High-resolution structural scans (T1w/MPRAGE, T2w) where crisp gray/white matter borders matter.
       * **Trade-off:** Can introduce minor ringing (slight overshoot or undershoot, including small negative values) along sharp brain/background edges.
   * - **Nearest-Neighbor** (``-n``)
     - :math:`1 \times 1 \times 1` (1 voxel)
     - * **Behavior:** Copies the value of the single closest input voxel without blending.
       * **Best for:** Binary masks, ROI labels, and parcellations where boundary values must stay exact integers.
       * **Note:** Ignores any multiplicative intensity scale stored in ``<t4file>``.

.. note::
   * **ROI Region Names (``-n``)**: Trilinear and cubic spline interpolation blend integer labels into fractional values, so ROI region names are dropped from the new ``.4dfp.ifh`` header. Passing ``-n`` copies those names to the output header so anatomical labels stay intact for tools like FIDL.
   * **Flag Precedence**: If both ``-s`` and ``-n`` are passed together, ``-s`` takes precedence for interpolation.

.. _t4img_examples:

Examples
--------

.. .. dropdown:: 💡 Click to show/hide usage examples
..    :animate: fade-in

..    .. tab-set::

..       .. tab-item:: 🧠 Case 1: Structural Scan to 711-2B

..          Use ``t4img_4dfp`` with cubic spline interpolation (``-s``) and ``-O111`` when resampling a high-resolution anatomical scan (such as a T1w MPRAGE) into standard 1 mm WashU :ref:`711-2B <atlas_711-2b>` atlas space.

..          .. note::
..             In the commands below, replace ``sub01_mpr`` and ``sub01_mpr_to_711-2B_t4`` with your own file prefixes and transform paths.

..          .. card:: 📥 Input Data
..             :class-card: sd-bg-light sd-border-1 mb-3

..             .. div:: card-help-top-right

..                :card-help:`Every 4dfp volume requires both its binary .4dfp.img file and its ASCII .4dfp.ifh header in the same directory.`

..             You need two inputs: the source :term:`4dfp` image and the :term:`t4file` mapping that image into ``711-2B`` space.

..             .. image:: /_static/tools/registration/t4img_4dfp/case1/t4img_c1_input_files.png
..                :alt: Directory listing showing sub01_mpr.4dfp.img, sub01_mpr.4dfp.ifh, and t4 file
..                :align: center
..                :width: 80%

..          .. tab-set::

..             .. tab-item:: ⚡ Command 1: Resample to 111 Space

..                Run ``t4img_4dfp`` with ``-s`` for crisp tissue boundaries and ``-O111`` for the 1 mm isotropic ``711-2B`` grid.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   t4img_4dfp -s -O111 sub01_mpr_to_711-2B_t4 sub01_mpr sub01_mpr_111

..                **2. Terminal Output:**

..                Notice that ``t4img_4dfp`` builds a temporary single-line list and calls :ref:`t4imgs_4dfp <t4imgs_4dfp>` to perform the resampling and update the header range:

..                .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd1/t4img_c1_terminal.png
..                   :alt: Terminal output showing t4imgs_4dfp reading the input image and t4 file and writing 111 output
..                   :align: center
..                   :width: 75%

..                **3. Visual Comparison:**

..                .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd1/t4img_c1_result.png
..                   :alt: Side-by-side comparison of native T1w scan and resampled 711-2B 111 volume
..                   :align: center
..                   :width: 80%

..             .. tab-item:: ⚡ Command 2: Resample to MNI152 Space

..                When transforming into :ref:`MNI152 <atlas_mni>` space (or back into a subject's native space), pass the reference template image to ``-O`` instead of a ``711-2B`` numeric shortcut.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   t4img_4dfp -s -OMNI152_T1_1mm sub01_mpr_to_MNI152_t4 sub01_mpr sub01_mpr_MNI

..                **2. Terminal Output:**

..                ``t4imgs_4dfp`` copies the matrix dimensions, voxel spacing, and volume center directly from ``MNI152_T1_1mm.4dfp.ifh``:

..                .. image:: /_static/tools/registration/t4img_4dfp/case1/cmd2/t4img_c1_mni_terminal.png
..                   :alt: Terminal output showing output dimensions copied from MNI152_T1_1mm
..                   :align: center
..                   :width: 75%

..       .. tab-item:: 🎯 Case 2: ROI Mask & Region Labels

..          Use nearest-neighbor interpolation (``-n``) when resampling binary masks, parcellations, or labeled ROI volumes so integer region IDs are not blended and ``region names`` are preserved in the output ``.4dfp.ifh`` header.

..          .. card:: 📥 Input Data
..             :class-card: sd-bg-light sd-border-1 mb-3

..             .. div:: card-help-top-right

..                :card-help:`Check your input .4dfp.ifh file for "region names :=" entries if you rely on anatomical labels in downstream tools like FIDL.`

..             An integer ROI volume (``sub01_rois.4dfp.img``) whose ``.4dfp.ifh`` header maps voxel integers to anatomical region names.

..             .. image:: /_static/tools/registration/t4img_4dfp/case2/t4img_c2_input_ifh.png
..                :alt: Input .4dfp.ifh header showing region names entries
..                :align: center
..                :width: 80%

..          **1. Execute Command:**

..          Here, ``-n`` preserves discrete integer labels and ``-O333.8`` resamples onto a 3 mm ``711-2B`` functional grid shifted upward by 8 voxels along the Y-axis:

..          .. code-block:: bash

..             t4img_4dfp -n -O333.8 sub01_rois_to_711-2B_t4 sub01_rois sub01_rois_333

..          **2. Output Comparison (``-n`` vs. Default Trilinear):**

..          With ``-n``, region boundaries remain crisp integers and ``region names`` carry over into ``sub01_rois_333.4dfp.ifh``. Without ``-n``, boundary voxels are averaged into fractional values and region labels are dropped:

..          .. image:: /_static/tools/registration/t4img_4dfp/case2/t4img_c2_comparison.png
..             :alt: Comparison of ROI mask resampled with -n versus default trilinear interpolation
..             :align: center
..             :width: 80%

..       .. tab-item:: 📚 Case 3: Single Image vs. Multi-Image Stacking

..          ``t4img_4dfp`` is a single-image wrapper around :ref:`t4imgs_4dfp <t4imgs_4dfp>`. If you need to resample and average multiple runs (or apply per-image weights, intensity scaling, or slice cropping) in one step, call ``t4imgs_4dfp`` directly with a ``.lst`` file.

..          .. tab-set::

..             .. tab-item:: ⚡ Single Image (t4img_4dfp)

..                Pass one transform, one input image, and one output name directly on the command line:

..                .. code-block:: bash

..                   t4img_4dfp -O333.8 bold_run1_to_711-2B_t4 bold_run1 bold_run1_333

..             .. tab-item:: ⚡ Multiple Images (t4imgs_4dfp)

..                Create a plain-text list file (``bold_runs.lst``) pairing each image with its transform, then pass that list to ``t4imgs_4dfp`` to resample and average all runs into a single output volume:

..                .. code-block:: text

..                   # bold_runs.lst
..                   bold_run1 t4=bold_run1_to_711-2B_t4
..                   bold_run2 t4=bold_run2_to_711-2B_t4
..                   bold_run3 t4=bold_run3_to_711-2B_t4

..                .. code-block:: bash

..                   t4imgs_4dfp -O333.8 bold_runs.lst bold_mean_333

..                .. image:: /_static/tools/registration/t4img_4dfp/case3/t4imgs_stack_terminal.png
..                   :alt: Terminal output of t4imgs_4dfp processing a multi-line list file
..                   :align: center
..                   :width: 75%

..       .. tab-item:: ⚠️ Common Errors
..          :class-label: tab-error

..          .. tab-set::

..             .. tab-item:: ❌ Swapped Argument Order
..                :class-label: tab-error

..                **Cause:** Passing ``<infile>`` before ``<t4file>`` on the command line. Unlike ``t4imgs_4dfp``, ``t4img_4dfp`` expects the transform file **first**.

..                **Command Attempt:**

..                .. code-block:: bash

..                   t4img_4dfp -O111 sub01_mpr sub01_mpr_to_711-2B_t4 sub01_mpr_111

..                **Error Output:**

..                The wrapper writes the first positional argument into the ``img=`` field of its temporary list, causing ``t4imgs_4dfp`` to look for a non-existent ``.4dfp.img`` file named after your transform:

..                .. code-block:: text

..                   t4imgs_4dfp: sub01_mpr_to_711-2B_t4.4dfp.img read error

..                .. admonition:: Resolution
..                   :class: warning

..                   Always pass positional arguments in the order ``<t4file> <infile> <outfile>`` (for example, ``t4img_4dfp -O111 sub01_mpr_to_711-2B_t4 sub01_mpr sub01_mpr_111``).

..             .. tab-item:: ❌ Missing Input File or Reference Grid
..                :class-label: tab-error

..                **Cause:** Providing a misspelled path, omitting a paired ``.4dfp.ifh`` header, passing a NIfTI (``.nii``) file directly, or specifying a reference image with ``-O<image>`` that does not exist.

..                **Command Attempt:**

..                .. code-block:: bash

..                   t4img_4dfp -O111 sub01_mpr_to_711-2B_t4 missing_scan out_111

..                **Error Output:**

..                ``t4imgs_4dfp`` checks readability of the input image, ``t4`` file, and target ``-O`` header before resampling and exits immediately if any file cannot be read:

..                .. code-block:: text

..                   t4imgs_4dfp: missing_scan.4dfp.img read error

..                .. admonition:: Resolution
..                   :class: warning

..                   Verify that your input files are in :term:`4dfp` format (both ``.4dfp.img`` and ``.4dfp.ifh`` exist) and check file paths with ``ls`` before re-running.

..             .. tab-item:: ❌ Clipped or Empty Output Volume
..                :class-label: tab-error

..                **Cause:** Using a ``711-2B`` numeric shortcut (``-O111``, ``-O222``, or ``-O333``) with a transform targeting :ref:`MNI152 <atlas_mni>` or native scanner space, or forgetting a Y-axis shift (``-O333.8``) on an elongated brain.

..                **Observed Behavior:**

..                The command finishes without a terminal error, but the output image appears severely shifted, cut off at the front/back, or completely blank because the target grid's bounding box and origin do not match the transformed coordinates.

..                .. image:: /_static/tools/registration/t4img_4dfp/errors/clipped_output.png
..                   :alt: Clipped brain output caused by mismatched output grid space
..                   :align: center
..                   :width: 75%

..                .. admonition:: Resolution
..                   :class: warning

..                   Match ``-O<outspace>`` to your transform's target space: pass the target template or native image via ``-O<image>`` for MNI152 or native transforms, and use ``-O333.8`` when ``333`` clips frontal or occipital cortex.

..             .. tab-item:: ❌ Blurred ROI Labels & Lost Region Names
..                :class-label: tab-error

..                **Cause:** Resampling an integer ROI mask or parcellation without passing the ``-n`` flag.

..                **Observed Behavior:**

..                Default trilinear interpolation averages neighboring labels along region borders into decimal values (such as ``1.5`` or ``2.3``), and all ``region names`` entries are omitted from the output ``.4dfp.ifh`` header.

..                .. admonition:: Resolution
..                   :class: warning

..                   Re-run the command with ``-n`` (for example, ``t4img_4dfp -n -O333.8 ...``) to preserve exact integer values and copy ``region names`` to the output header.


.. rubric:: Footnotes

.. [#wrapper] ``t4img_4dfp`` is a C-shell wrapper around :ref:`t4imgs_4dfp`. It automates single-file transformations by generating a temporary one-line input list, invoking ``t4imgs_4dfp``, formatting the ``.rec`` history log, transferring ``.ifh`` ROI metadata, and cleaning up temporary files upon completion.
