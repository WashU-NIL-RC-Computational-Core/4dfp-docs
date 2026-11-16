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

..       .. tab-item:: 📁 Case 1: Dump Header Info

..          Use ``dcm_dump_file`` when you need to inspect raw DICOM metadata, verify scanner settings (such as sequence names or TE/TR times), or troubleshoot files before running 4dfp conversion scripts.

..          .. note::
..             In all commands below, replace ``IM_0013.dcm`` with your actual file path or directory name (for example, ``/data/scan1.dcm`` or ``/data/DICOM``).

..          .. card:: 📥 Input Data
..             :class-card: sd-bg-light sd-border-1 mb-3

..             .. div:: card-help-top-right

..               :card-help:`You can inspect a single DICOM file or an entire directory. When given a directory, the tool recursively scans all subdirectories.`

..             DICOM files usually have a file extension of ``.dcm`` (or :term:`Siemens .IMA` when using Siemens scanners).

..             .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/ddf_c1_source_data.png
..                :alt: Source directory with nested sub-folders
..                :align: center
..                :width: 80%

..          .. tab-set::

..             .. tab-item:: ⚡ Command 1: Standard Display

..                Run the tool without flags to print all DICOM header tags directly to your terminal screen.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   dcm_dump_file IM_0013.dcm

..                **2. Terminal Output:**

..                .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd1/normal_dump_file.png
..                   :alt: Standard dcm_dump_file output
..                   :align: center
..                   :width: 70%

..             .. tab-item:: ⚡ Command 2: Formatted Display

..                Use the ``-f`` flag to format the output into clean, aligned text columns. This makes reading tag group numbers, descriptions, and values much easier.

..                **1. Execute Command:**

..                .. code-block:: bash

..                   dcm_dump_file -f IM_0013.dcm

..                **2. Terminal Output:**

..                .. image:: /_static/tools/dicom_utilities/dcm_dump_file/case1/cmd2/f_option.png
..                   :alt: Formatted dcm_dump_file output
..                   :align: center
..                   :width: 70%

..       .. tab-item:: ⚠️ Common Errors
..          :class-label: tab-error

..          .. tab-set::

..             .. tab-item:: ❌ Not a DICOM File
..                :class-label: tab-error

..                This error occurs if you try to inspect a file that is not in DICOM format (such as a text log file, PDF report, or non-DICOM image).

..                **1. Execute Command:**

..                .. code-block:: bash

..                   dcm_dump_file not_a_DICOM.txt

..                **Error Output:**

..                The tool attempts to read the standard 128-byte preamble header. When it cannot find valid DICOM tags, it fails to open the file:

..                .. code-block:: text

..                   80092 DCM Illegal Stream Length (x) (Not enough data to define a full element) in readPreamble
..                   20092 DCM failed to open file: [file].[ext] in DCM_OpenFile

..                .. image:: /_static/tools/dicom_utilities/dcm_dump_file/errors/not_a_dicom.png
..                   :alt: Error output when trying to parse non-DICOM file
..                   :align: center

..             .. tab-item:: ❌ Path Does Not Exist
..                :class-label: tab-error

..                **Cause:** Providing a file or directory path that does not exist or contains a typo.

..                **Command Attempt:**

..                .. code-block:: bash

..                   dcm_dump_file raw_scan_folder

..                **Error Output:**

..                The tool attempts to locate the specified path. When it cannot find the directory, it outputs a failure message to the terminal screen and stops execution.

..                .. index:: DCM_OpenFile, failed to open file

..                .. code-block:: text

..                   20092 DCM failed to open file: raw_scan_folder in DCM_OpenFile

..                .. admonition:: Resolution
..                   :class: warning

..                   Check your file path for typos and confirm the directory exists before re-running the command. You can use ``ls`` to list folder contents in your current directory.

..             .. tab-item:: ❌ Flags Placed After Directory Arguments
..                :class-label: tab-error

..                **Cause:** Placing option flags (such as ``-f`` or ``-v``) after file or directory arguments instead of before them.

..                **Command Attempt:**

..                .. code-block:: bash

..                   dcm_dump_file DICOM -f

..                **Observed Behavior:**

..                The tool processes options from left to right. Any flag placed after a directory path is ignored as a flag and treated as an invalid file name. The script tries to open a file literally named ``-f`` and throws an open failure error.

..                .. code-block:: text

..                   20092 DCM failed to open file: -f in DCM_OpenFile

..                .. admonition:: Resolution
..                   :class: warning

..                   Always place option flags **before** any file or directory paths (use ``dcm_dump_file -f DICOM``).


.. rubric:: Footnotes

.. [#wrapper] ``t4img_4dfp`` is a C-shell wrapper around :ref:`t4imgs_4dfp`. It automates single-file transformations by generating a temporary one-line input list, invoking ``t4imgs_4dfp``, formatting the ``.rec`` history log, transferring ``.ifh`` ROI metadata, and cleaning up temporary files upon completion.
