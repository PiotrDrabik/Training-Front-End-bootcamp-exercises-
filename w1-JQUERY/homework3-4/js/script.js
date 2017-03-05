(function () {

	var hamb = $("i");
	var nav = $("#navi");
	hamb.on({
		"click": function() {	
			if(nav.is(":hidden")) {
				nav.slideDown(200);
			} else {
				nav.slideUp(200);
			}
		},
		"mouseover": function() {
			console.log("mouseover");
		}
	});

	var button = $("button");
	var takeName = $("input");
	button.on("click", function(event) {
		event.preventDefault();
		if (takeName.val()) {
			$("#list").append("<li></li>");
			$("#list > li:last-child").text(takeName.val());
		} else {
			alert("Wprowadź swoje imię");
		}
	});


})();