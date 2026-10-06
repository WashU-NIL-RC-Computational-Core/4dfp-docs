.. include:: ../../global.rst

.. _format_string:

"Format" string manipulation
============================

condense
--------
generate maximally compact format string

Usage:	condense <format_str>

Examples::

	condense "4x86+4x86+4x86+4x86+4x86+4x86+4x86+4x86+4x86+"
	# output: 9(4x86+)

Options

=======	===================================================================
-v		verbose mode
-f<str>	read input format string from specified file (default command line)
=======	===================================================================

format2lst
----------
expand format string

Usage:	format2lst <format|fmtfile>

Examples::

	format2lst "2x3-2+1-2+2-2+1-1+2-1+1-1+1-1+2-1+1-1+1-2+2-1+1-1+2-2+1-2+2-" -e
	# output: xx---++-++--++-+--+-+-+--+-+-++--+-+--++--

Options

==	=======================================
-w	convert {'x' '+' '-'} to {0.0 1.0 -1.0}
-e	expand on single line
==	=======================================
