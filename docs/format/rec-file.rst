.. _rec_file:

rec file
========

The rec file format was designed to capture the creation history of each
particular 4dfp image. This is accomplished automatically provided that each UNIX executable which creates 4dfp output also produces a corresponding rec file. Rec files are ASCII text with the following format ::

	rec <filename>.4dfp.img `date` `user`
	UNIX command line which created <filename>.4dfp.img
	rcs $Id$ (program revision code)
	image/program specific processing information
	...
	rec file[s] corresponding to antecedent input 4dfp images
	endrec `date` `user`

The critical feature of the rec file convention is inclusion of antecedent rec files at all stages of processing. It follows that rec files corresponding to averaged images may grow large. The key words "rec" (first field of first line) and "endrec" (first field of last line) guarantee secure parsing of the accumulated processing history. The following is a listing of the rec file corresponding to the above illustrated interfile header after being passed through rmspike_4dfp and deband_4dfp ::

	rec vm6c_b1_rmsp_dbnd.4dfp.img  Thu May 18 17:16:23 2000  avi
	/data/petsun4/data1/solaris/deband_4dfp -n4 vm6c_b1_rmsp
	$Id: deband_4dfp.c,v 1.8 1999/11/20 00:55:49 avi Exp $
	Frame          1 slice multipliers: even=0.837060 odd=1.162940
	Frame          2 slice multipliers: even=0.997099 odd=1.002901
	Frame          3 slice multipliers: even=0.985484 odd=1.014516
	Frame          4 slice multipliers: even=0.986583 odd=1.013417
	Functional frame slice multipliers: even=0.986982 odd=1.013018
	rec vm6c_b1_rmsp.4dfp.img  Thu May 18 17:16:13 2000 avi
	/data/petsun4/data1/solaris/rmspike_4dfp -n4 -x33 vm6c_b1
	$Header: /data/petsun4/src_solaris/rmspike_4dfp/RCS/rmspike_4dfp.c,v 2.6 1997/05/23 00:49:24 yang Exp $
	No spike found in vm6c_b1.4dfp.img
	rec vm6c_b1.4dfp.img  Thu May 18 17:15:18 2000  avi
	/data/petsun4/data1/solaris/imato4dfp2 -fy /data/petsun23/vm6c/siem_im/bold1/5250 7 7 vm6c_b1
	$Id: imato4dfp2.c,v 1.12 2000/05/05 00:56:18 avi Exp $
	patient_id:		vm6c
	institution:		Washington University
	manufacturer_model:	MAGNETOM VISION
	parameter_file_name:	Initialized by sequence
	sequence_file_name:	/usr/users/tec/nbea_uc_tg2.ekc
	sequence_description:	ep_fid   90	TR    135.2	TE   37.0/1
	tilts:			Cor>Tra -12
	4dfp_dimensions:	64        64        18        128
	voxel_dimensions:	3.000000  3.000000  3.000000
	scan_date:		22-FEB-1999
	scan_time:		14:06:33-14:06:33
	endrec Thu May 18 17:15:18 2000  avi
	endrec
	endrec Thu May 18 17:16:26 2000  avi

The :ref:`brec` (beautify rec file) utility parses rec files and writes to stdout a more easily readable version of the text. Here is the above rec file filtered through brec ::

	1rec vm6c_b1_rmsp_dbnd.4dfp.img  Thu May 18 17:16:23 2000  avi
	1      /data/petsun4/data1/solaris/deband_4dfp -n4 vm6c_b1_rmsp
	1      $Id: deband_4dfp.c,v 1.8 1999/11/20 00:55:49 avi Exp $
	1      Frame          1 slice multipliers: even=0.837060 odd=1.162940
	1      Frame          2 slice multipliers: even=0.997099 odd=1.002901
	1      Frame          3 slice multipliers: even=0.985484 odd=1.014516
	1      Frame          4 slice multipliers: even=0.986583 odd=1.013417
	1      Functional frame slice multipliers: even=0.986982 odd=1.013018
	2      rec vm6c_b1_rmsp.4dfp.img  Thu May 18 17:16:13 2000 avi
	2            /data/petsun4/data1/solaris/rmspike_4dfp -n4 -x33 vm6c_b1
	2            $Header: /data/petsun4/src_solaris/rmspike_4dfp/RCS/rmspike_4dfp.c,v 2.6 1997/05/23 00:49:24 yan
	2            No spike found in vm6c_b1.4dfp.img
	3            rec vm6c_b1.4dfp.img  Thu May 18 17:15:18 2000  avi
	3                  /data/petsun4/data1/solaris/imato4dfp2 -fy /data/petsun23/vm6c/siem_im/bold1/5250 7 7 vm6c
	3                  $Id: imato4dfp2.c,v 1.12 2000/05/05 00:56:18 avi Exp $
	3                  patient_id:	vm6c
	3                  institution:		Washington University
	3                  manufacturer_model:	 MAGNETOM VISION
	3                  parameter_file_name:	 Initialized by sequence
	3                  sequence_file_name:	/usr/users/tec/nbea_uc_tg2.ekc
	3                  sequence_description:	ep_fid   90     TR    135.2     TE   37.0/1
	3                  tilts:		Cor>Tra -12
	3                  4dfp_dimensions:		64        64        18        128
	3                  voxel_dimensions:	3.000000  3.000000  3.000000
	3                  scan_date:	22-FEB-1999
	3                  scan_time:	14:06:33-14:06:33
	3            endrec Thu May 18 17:15:18 2000  avi
	2      endrec
	1endrec Thu May 18 17:16:26 2000  avi