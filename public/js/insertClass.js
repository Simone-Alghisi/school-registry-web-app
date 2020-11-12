(function ($) {
	"use strict";
	
	//datatables
	$('#studentsTable').DataTable({
		'scrollY': 250,
		'paging': false,
		'searching': false,
		'info': false
	});

	$('#professorsTable').DataTable({
		'scrollY': 250,
		'paging': false,
		'searching': false,
		'info': false
	});


})(jQuery);