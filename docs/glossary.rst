.. _glossary:

Glossary
========

.. glossary::
   :sorted:

   t4file
      A plain text file containing a :math:`4 \times 4` coordinate transformation matrix used across the 4dfp software suite. It defines spatial affine or rigid alignments (translation, rotation, scale, shear) between coordinate spaces.

   4dfp
      Four-Dimensional Floating Point format; a neuroimaging file format standard developed at Washington University in St. Louis. It consists of a binary image payload (``.4dfp.img``) accompanied by an ASCII header file (``.4dfp.ifh``) specifying volume dimensions and orientation.

   Affine Transformation
      A 12-degree-of-freedom (12-DOF) linear spatial transformation that accounts for translation, rotation, scaling, and shearing between coordinate systems, preserving parallel lines.

   Big-Endian
      A way computers store data bytes in memory, placing the largest (most significant) byte first. It was standard in older Unix systems (like SPARC or SGI) and legacy 4dfp imaging files.

   Bitwise Addition
      A method of packing multiple on/off settings into a single number. Each setting is assigned a unique number that doubles every time (1, 2, 4, 8, etc.), which corresponds to a single "switch" in binary code. When you turn on multiple settings, their values are added together. Because every combination creates a completely unique total sum, the computer can look at that final number and instantly know exactly which options are enabled.

   Degrees of Freedom (DOF)
      The set of independent spatial transformation parameters estimated during image registration (e.g., 6 DOF for rigid registration comprising 3 translations and 3 rotations; 12 DOF for full affine alignment adding 3 scales and 3 shears).

   DICOM Header
      A metadata block at the beginning of a DICOM file. It stores information about the scan, patient, and scanner settings (such as sequence names and series numbers) before the raw image pixels.
      
   DICOM Part 10
      Section 10 of the NEMA DICOM standard (PS 3.10) that defines how DICOM files are saved on disk. Each file starts with a 128-byte preamble, followed by the 4-character code ``DICM`` and standard data tags.

   eta Alignment Score
      A similarity metric that quantifies how well two image volumes align in space. The score can be evaluated using two primary approaches depending on the registration method:

      * **Spatial Gradient Alignment:** (:ref:`imgreg_4dfp <imgreg_4dfp>` Mode: 256 **OFF**) Compares where tissue boundaries and structural edges occur across both images. Because it focuses on directional contours rather than raw brightness, it effectively lines up scans with different image contrasts (such as aligning a functional fMRI scan to a structural T1 scan).

      * **Intensity Correlation:** (:ref:`imgreg_4dfp <imgreg_4dfp>` Mode: 256 **ON**) Compares raw voxel brightness values directly between images. This works best when aligning scans from the same imaging modality (such as T1 to T1) where corresponding anatomical structures share identical brightness levels.

   Explicit Little-Endian
      The standard byte order used by modern PCs (x86/x64). It stores the smallest (least significant) byte first and explicitly includes a 2-character Value Representation (VR) tag that names the data type for each item.

   Hessian Matrix
      A square matrix of second-order partial derivatives of a scalar-valued cost function. In 4dfp registration, inversion of the :math:`6 \times 6` or :math:`12 \times 12` Hessian matrix enables fast sub-voxel convergence via Newton-Raphson optimization.

   <dicom_directory>.studies.txt
      A text summary file created by 4dfp DICOM sorting scripts (like :ref:`dcm_sort`). It lists every scan series in an MRI session across four space-separated columns:

      * **Column 1 (REL Series Number):** The sequence or order number of the scan in the session.
      * **Column 2 (ACQ Sequence Name):** The scanner's technical name for the scan protocol.
      * **Column 3 (ID Series Description):** A plain-text label describing the image series.
      * **Column 4 (File Count):** The total number of DICOM files saved in that scan series.

   Linear Alignment
      A spatial registration technique that applies uniform global transformations—such as translation (shifting), rotation (turning), scaling (resizing), and shearing (skewing)—across an entire image volume. It corrects overall brain orientation and size without deforming or warping local anatomical tissue structures.

   Local Maximum
      A false peak in an optimization score where the registration algorithm stops searching because nearby positions appear worse, even though a better overall alignment exists elsewhere.

   Newton-Raphson Optimization
      A second-order iterative numerical optimization algorithm that uses the gradient and Hessian matrix of the objective function to rapidly converge on optimal spatial registration parameters.

   Pearson Intensity Correlation
      An image alignment similarity metric that computes normalized cross-correlation (Pearson correlation) based on raw voxel brightness values across two image volumes.

   Pitch
      Spatial rotation around the Left–Right axis (:math:`X`-axis). In subject head motion, this corresponds to a forward or backward "nodding" movement in the sagittal plane.

   Rigid Transformation
      A 6-degree-of-freedom (6-DOF) spatial transformation limited to 3D translation (:math:`X, Y, Z`) and rotation (pitch, roll, yaw), preserving all inter-voxel distances and image geometry without scaling or deformation.

   Roll
      Spatial rotation around the Anterior–Posterior axis (:math:`Y`-axis). In subject head motion, this corresponds to a side-to-side "rolling" or tilting movement (ear toward shoulder) in the coronal plane.

   Siemens .IMA
      A file extension used by Siemens MRI scanners. These are standard DICOM files or raw headers saved with a Siemens-specific extension.

   Spatial Gradient Alignment
      An image alignment similarity metric that compares directional brightness gradients (:math:`\nabla I`) along tissue boundaries and anatomical edges. This default mode is robust against brightness and contrast variations across different scans.

   Symbolic Link
      A shortcut file that points directly to another file or folder on your computer without copying the original data.

   Yaw
      Spatial rotation around the Superior–Inferior axis (:math:`Z`-axis). In subject head motion, this corresponds to a turning or "squirming" movement (shaking the head side-to-side) in the axial plane. This represents the single in-plane rotational degree of freedom during 2D axial image registration.