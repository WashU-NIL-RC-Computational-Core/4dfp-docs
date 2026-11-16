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

Applies an :term:`affine <Affine Transformation>` or :term:`rigid <Rigid Transformation>` spatial transformation matrix (:term:`t4file`) to resample a single :term:`4dfp` file into a target atlas or reference image grid [#wrapper]_. Conceptually, ``t4img_4dfp`` performs **1:1** (one 3D volume :math:`\rightarrow` one 3D volume) or **n:n** (one 4D time series of :math:`n` frames :math:`\rightarrow` one 4D time series of :math:`n` frames) transformations; to combine **n:1** multiple separate files into a single averaged or summed output, use :ref:`t4imgs_4dfp`.

.. tip::
   **Batch Transforming Multiple Separate Files (File-Level n:n)**: Neither ``t4img_4dfp`` nor :ref:`t4imgs_4dfp` outputs multiple separate files from a single command (``t4imgs_4dfp`` always merges inputs into one combined output). To transform :math:`n` separate scan files into :math:`n` individual outputs, run ``t4img_4dfp`` inside a shell loop (see :ref:`t4img_examples`).

By default, ``t4img_4dfp`` resamples voxels using :term:`Trilinear Interpolation` into Washington University :ref:`711-2B <atlas_711-2b>` ``333.0`` atlas space (:math:`48 \times 64 \times 48`, 3 mm isotropic) and writes the output image set (``.4dfp.img``, ``.4dfp.ifh``, ``.4dfp.hdr``, and ``.4dfp.img.rec``) to ``<imgfile>t``. Passing ``none`` for ``<t4file>`` applies an identity transform, allowing grid resampling, orientation conversion, or endianness conversion without spatial rotation or translation.

.. note::
   * **Optional Extensions**: ``.4dfp.img``, ``.4dfp``, and ``.img`` extensions are stripped automatically from ``<imgfile>`` and ``<outfile>``. Do **not** pass ``.4dfp.ifh`` or ``.4dfp.hdr`` extensions, as they are not stripped.
   * **Flag Syntax**: Pass single-letter flags separately (e.g., ``-n -R``, not ``-nR``). Values for ``-O<outspace>`` and ``-@<endian>`` must immediately follow the flag with no separating space (e.g., ``-O222``, ``-@b``); inserting a space causes the value to be misinterpreted as a positional file argument.

.. rubric:: Execution & Header Behavior

1. **Temporary List Generation**: Writes a single-line list file (``<outfile>.lst`` containing ``<imgfile>  t4=<t4file>``, or ``t4=`` when ``none`` is specified) and invokes ``t4imgs_4dfp`` with all user-supplied flags.
2. **Header & Provenance Generation**: Writes ``<outfile>.4dfp.ifh``, generates ``<outfile>.4dfp.hdr`` via ``ifh2hdr``, and wraps the :ref:`rec_file` (``<outfile>.4dfp.img.rec``) with the exact ``t4img_4dfp`` command invocation, start/end timestamps, user account, script RCS version, and full resampling history.
3. **ROI Region Name Transfer (``-n`` Flag)**: When :term:`Nearest-Neighbor Interpolation` (``-n``) is active, ``t4img_4dfp`` extracts FIDL ROI region names (``grep "region names"``) from ``<imgfile>.4dfp.ifh`` and appends them to ``<outfile>.4dfp.ifh``.
4. **Cleanup & Error Handling**: Removes temporary files (``<outfile>.lst`` and ``temp$$``) upon successful completion. If ``t4imgs_4dfp`` exits with a non-zero status, execution aborts immediately and ``<outfile>.lst`` is retained on disk for debugging.

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
     - Enables :term:`Cubic Spline Interpolation` for sharper anatomical resampling (takes precedence over ``-n`` if both are passed).
   * - ``-z``
     - Normalizes accumulated voxel totals by :math:`\sqrt{n}` rather than :math:`n` (for combining statistical Z-score maps). Has no effect on single-file ``t4img_4dfp`` runs (:math:`n = 1`); see :ref:`t4imgs_4dfp` for multi-image Z-map aggregation.
   * - ``-O<outspace>``
     - Sets the output space and voxel grid (defaults to ``333.0``; see :ref:`t4img_outspace`):

       * **711-2B shortcuts only** (``111``, ``222``, ``333[.n]``): Built-in resolution presets exclusively for WashU :ref:`711-2B <atlas_711-2b>` space.
       * **Reference image** (``<image>``): Root name of an existing :term:`4dfp` volume whose grid to match; required for :ref:`MNI152 <atlas_mni>`, native, or custom spaces.
   * - ``-@<endian>``
     - Forces output binary write format to :term:`Big-Endian` (``-@b``) or :term:`Little-Endian` (``-@l``); Defaults to native host CPU endianness.

.. note:: Do not add spaces between an option flag and its argument (for example, use ``-O222``, not ``-O 222``).

.. _t4img_outspace:

.. rubric:: Output Spaces & Atlas Grids

While ``<t4file>`` defines the mathematical coordinate mapping from source space to target space, ``-O<outspace>`` defines the **output voxel grid** (matrix dimensions, voxel spacing, volume center, and anatomical orientation) onto which the image is sampled. Always match ``-O<outspace>`` to the coordinate system targeted by ``<t4file>`` (see :ref:`atlases` for a full comparison of coordinate systems).

.. list-table::
   :widths: 16 22 26 36
   :header-rows: 1

   * - Option
     - Coordinate Space
     - Voxel Size & Matrix
     - Typical Use Cases
   * - ``-O111``
     - :ref:`WashU 711-2B <atlas_711-2b>` (Transverse)
     - 1 mm isotropic (:math:`176 \times 208 \times 176`)
     - High-resolution structural imaging (T1w/MPRAGE, T2w), anatomical segmentation, and cortical surface workflows.
   * - ``-O222``
     - :ref:`WashU 711-2B <atlas_711-2b>` (Transverse)
     - 2 mm isotropic (:math:`128 \times 128 \times 75`)
     - Intermediate-resolution structural templates, PET imaging, diffusion/tractography targets, and high-resolution fMRI.
   * - ``-O333[.n]``
     - :ref:`WashU 711-2B <atlas_711-2b>` (Transverse)
     - 3 mm isotropic (:math:`48 \times 64 \times 48`)
     - Standard 4D BOLD fMRI time series (default). Balances spatial detail against memory/disk footprint for multi-frame runs.
   * - ``-O<image>``
     - Any (:ref:`MNI152 <atlas_mni>`, Native, Custom)
     - Copied from ``<image>.4dfp.ifh``
     - MNI152 atlas alignment, inverse transforms back to a subject's native scan grid, or study-specific templates.

.. rubric:: Choosing the Right Grid Option

* **711-2B Presets vs. Reference Images**: The numeric presets (``111``, ``222``, ``333``) hardcode Washington University :ref:`711-2B <atlas_711-2b>` stereotactic bounding boxes, origins, and transverse (``TRA``) orientation. If your :term:`t4file` transforms into :ref:`MNI152 <atlas_mni>` space or back into a subject's **native space**, do not use a numeric preset—pass the target template or native reference image via ``-O<image>`` (e.g., ``-OMNI152_T1_2mm``) so the output grid, origin, and orientation match the transform.
* **Legacy 711-2A Transforms (``-B`` Flag)**: If an older ``t4`` file was computed against the legacy :ref:`711-2A <atlas_711-2a>` atlas rather than :ref:`711-2B <atlas_711-2b>`, pass ``-B`` alongside ``-O111``, ``-O222``, or ``-O333`` to convert the transform into ``711-2B`` space during resampling.
* **Y-Axis Center Offset (``-O333.n``)**: The compact :math:`48 \times 64 \times 48` ``333`` grid has limited anterior-posterior padding. Appending a decimal offset (most commonly ``-O333.8``) shifts the Y-axis center upward by ``n`` pixels to prevent frontal or occipital clipping in acquisitions or templates with shifted centers.

.. _t4img_interpolation:

Interpolation Methods
---------------------

When resampling an image into a new grid, output voxel centers rarely land squarely on original input voxel centers—instead, they fall at fractional coordinates :math:`(x, y, z)` between neighbors. Both ``t4img_4dfp`` and :ref:`t4imgs_4dfp` support three 3D interpolation kernels that trade off neighborhood size, edge sharpness, and intensity preservation.

.. rubric:: Choosing an Interpolation Method

.. mermaid::
   :align: center

   flowchart LR
       classDef neutral fill:#f8f9fa,stroke:#ced4da,stroke-width:1.25px,color:#212529
       classDef green fill:#e8f0eb,stroke:#215732,stroke-width:1.5px,color:#212529
       classDef teal fill:#eef6f7,stroke:#007D8A,stroke-width:1.5px,color:#212529
       classDef crimson fill:#fbebee,stroke:#BA0C2F,stroke-width:1.5px,color:#212529

       START["<b>Input 4dfp Volume</b>"]:::neutral --> Q1{"Discrete integer<br/>labels or masks?"}:::neutral
       Q1 -->|"Yes (ROIs, segmentations)"| OUT_N["<b>Nearest-Neighbor (<code>-n</code>)</b><br/>Preserves exact integer values"]:::green
       Q1 -->|"No (continuous intensities)"| Q2{"High-res structural<br/>or smooth functional?"}:::neutral
       Q2 -->|"BOLD fMRI / Z-maps"| OUT_DEF["<b>Trilinear (Default)</b><br/>Balanced smoothing, no overshoot"]:::teal
       Q2 -->|"T1w / MPRAGE / T2w"| OUT_S["<b>Cubic Spline (<code>-s</code>)</b><br/>Crisp cortical & tissue borders"]:::crimson

.. rubric:: How Each Method Samples the Input Grid

.. mermaid::
   :align: center

   flowchart TB
       classDef neutral fill:#f8f9fa,stroke:#ced4da,stroke-width:1.25px,color:#212529
       classDef green fill:#e8f0eb,stroke:#215732,stroke-width:1.5px,color:#212529
       classDef teal fill:#eef6f7,stroke:#007D8A,stroke-width:1.5px,color:#212529
       classDef crimson fill:#fbebee,stroke:#BA0C2F,stroke-width:1.5px,color:#212529

       subgraph NN["Nearest-Neighbor (-n)"]
           direction LR
           NN1["Fractional<br/>(x, y, z)"]:::neutral --> NN2["<b>1 Voxel (1×1×1)</b><br/>Snaps to closest center"]:::green --> NN3["<b>Blocky / Stair-Stepped</b><br/>Zero blending; no new values invented"]:::green
       end

       subgraph TL["Trilinear (Default)"]
           direction LR
           TL1["Fractional<br/>(x, y, z)"]:::neutral --> TL2["<b>8 Voxels (2×2×2)</b><br/>Distance-weighted average"]:::teal --> TL3["<b>Mildly Smoothed</b><br/>Softens edges; bounded by min/max"]:::teal
       end

       subgraph CS["Cubic Spline (-s)"]
           direction LR
           CS1["Fractional<br/>(x, y, z)"]:::neutral --> CS2["<b>64 Voxels (4x4x4)</b><br/>Fits 3D piecewise cubic curve"]:::crimson --> CS3["<b>Sharp & Continuous</b><br/>Preserves fine folds; slight edge overshoot"]:::crimson
       end

.. list-table::
   :widths: 22 18 60
   :header-rows: 1

   * - Method
     - Neighborhood
     - Practical Trade-Offs & Pipeline Guidance
   * - **Trilinear** *(Default)*
     - :math:`2 \times 2 \times 2` (8 voxels)
     - Computes a linear weighted average of the 8 surrounding voxel corners. Never introduces intensities outside the local input range, making it ideal for BOLD time series and statistical maps where mild spatial smoothing is acceptable.
   * - **Cubic Spline** (``-s``)
     - :math:`4 \times 4 \times 4` (64 voxels)
     - Uses a wider 64-voxel neighborhood to estimate local intensity gradients and fit smooth third-degree polynomials. Best for high-resolution anatomical scans (T1w/MPRAGE) where preserving sharp gray/white matter boundaries matters. Can produce minor ringing (slight overshoot/undershoot, including small negative values) at steep brain/background edges.
   * - **Nearest-Neighbor** (``-n``)
     - :math:`1 \times 1 \times 1` (1 voxel)
     - Copies the value of the single nearest input voxel without blending. **Required for integer ROI masks, parcellations, and binary masks** so boundary labels are never averaged into invalid intermediate integers. Also ignores any multiplicative intensity scale stored in ``<t4file>``.

.. note::
   If both ``-s`` and ``-n`` are passed on the same command line, ``-s`` (cubic spline) takes precedence.
   
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
