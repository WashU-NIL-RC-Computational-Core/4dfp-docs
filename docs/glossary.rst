.. _glossary:

Glossary
========

.. glossary::
   :sorted:

   t4file
      A plain text file containing a 4 x 4 coordinate transformation matrix used across the 4dfp software suite. It defines spatial affine or rigid alignments (translation, rotation, scale, shear) between coordinate spaces.
      
      .. code-block:: text

         imgreg_4dfp SUBJ_MSC01_func01_mpr \
            SUBJ_MSC01_func01_mpr_brain_mask \
            SUBJ_MSC01_func01_t2w none \
            SUBJ_MSC01_func01_mpr_to_SUBJ_MSC01_func01_t2w_t4 10243
         freesurfer imgreg_4dfp.c
         t4
         0.999921 -0.009917 -0.007725    0.0720
         0.010118  0.999601  0.026355   -0.2149
         0.007461 -0.026431  0.999623   -1.1119
         0.000000  0.000000  0.000000    1.0000

   4dfp
      Four-Dimensional Floating Point format; a neuroimaging file format standard developed at Washington University in St. Louis. It consists of a binary image payload (``.4dfp.img``) accompanied by an ASCII header file (``.4dfp.ifh``) specifying volume dimensions and orientation.

   Affine Transformation
      A 12-degree-of-freedom (12-DOF) linear spatial transformation that accounts for translation, rotation, scaling, and shearing between coordinate systems while preserving parallel lines.

   Big-Endian
      A way computers store data bytes in memory, placing the largest (most significant) byte first. It was standard in older Unix systems (like SPARC or SGI) and legacy 4dfp imaging files.

   Bitwise Addition
      Adding power-of-two values (1, 2, 4, 8...) to toggle execution settings in 4dfp commands (for example, adding 256 enables spatial gradient mode in ``imgreg_4dfp``).

   Degrees of Freedom (DOF)
      The set of independent spatial transformation parameters estimated during image registration (e.g., 6 DOF for rigid registration comprising 3 translations and 3 rotations; 12 DOF for full affine alignment adding 3 scales and 3 shears).

   DICOM Header
      A metadata block at the beginning of a DICOM file. It stores information about the scan, patient, and scanner settings (such as sequence names and series numbers) before the raw image pixels.
      
   DICOM Part 10
      Section 10 of the NEMA DICOM standard (PS 3.10) that defines how DICOM files are saved on disk. Each file starts with a 128-byte preamble, followed by the 4-character code ``DICM`` and standard data tags.

   eta Alignment Score
      A score from ``0.0`` (no match) to ``1.0`` (identical match) that measures how well two images are aligned. It is calculated by evaluating the :term:`Objective Function` for the current position. How η is calculated depends on whether Bit ``256`` is turned on:

      * Pearson Intensity Correlation (:ref:`imgreg_4dfp <imgreg_4dfp>` Mode: 256 ON): Measures how closely raw pixel brightness matches across both images. Ideal for same-contrast scans where corresponding brain structures share the exact same brightness levels.

      * Spatial Gradient Alignment (:ref:`imgreg_4dfp <imgreg_4dfp>` Mode: 256 OFF): Measures how well tissue boundaries and structural edges line up. Ideal for cross-contrast scans.

   Explicit Little-Endian
      The standard byte order used by modern PCs (x86/x64). It stores the smallest (least significant) byte first and explicitly includes a 2-character Value Representation (VR) tag that names the data type for each item.

   Hessian Matrix
      A matrix of second-order partial derivatives used by registration optimizers (like Newton-Raphson) for fast sub-voxel convergence.

   <dicom_directory>.studies.txt
      A text summary file created by 4dfp DICOM sorting scripts (like :ref:`dcm_sort`). It lists every scan series in an MRI session across four space-separated columns:

      * Column 1 (REL Series Number): The sequence or order number of the scan in the session.
      * Column 2 (ACQ Sequence Name): The scanner's technical name for the scan protocol.
      * Column 3 (ID Series Description): A plain-text label describing the image series.
      * Column 4 (File Count): The total number of DICOM files saved in that scan series.

   Linear Alignment
      Global registration that applies uniform translation, rotation, scaling, and shearing across an image volume without warping local brain structures.

   Local Maximum
      A false peak in an optimization score where the registration algorithm stops searching because nearby positions appear worse, even though a better overall alignment exists elsewhere.

   Newton-Raphson Optimization
      An iterative mathematical solver using gradient and Hessian calculations to rapidly find optimal registration parameters.

   Nod
      *Also known as "Pitch".*

      Forward and backward head nodding (rotation around the Left–Right or X-axis in the sagittal plane).
   
   Objective Function
      The mathematical function (similarity metric) evaluated and maximized by the registration engine to quantify spatial alignment.

   Pearson Intensity Correlation
      An alignment metric calculating normalized cross-correlation based on raw voxel brightness values across two volumes.

   Rigid Transformation
      A 6-degree-of-freedom (6-DOF) spatial transformation limited to 3D translation (X, Y, Z) and rotation (pitch, roll, yaw), preserving all inter-voxel distances and image geometry without scaling or deformation.

   Roll
      Head tilting side-to-side toward the shoulders (rotation around the Anterior–Posterior or Y-axis in the coronal plane).

   Siemens .IMA
      A file extension used by Siemens MRI scanners. These are standard DICOM files or raw headers saved with a Siemens-specific extension.

   Spatial Gradient Alignment
      An image alignment similarity metric that compares directional brightness gradients (∇ I) along tissue boundaries and anatomical edges, making it resistant to contrast differences between scan types.

   Squirm
      *Also known as "Yaw".*

      Side-to-side head turning (rotation around the Superior–Inferior or Z-axis in the axial plane). Represents the single in-plane rotation during 2D slice alignment.
   
   Symbolic Link
      A shortcut file that points directly to another file or folder on your computer without copying the original data.