(function() {
var partA = $(".grid.grid-12");
console.log(partA);

var partB = $("nav a[href^='http']");
console.log(partB);

var partC = $("input[type='checkbox']:not(:checked), input[type='radio']:not(:checked)");
console.log(partC);

var partD = $("div#text > p:first:empty");
console.log(partD);

var partE = $(".pagination-Item:not(span)");
console.log(partE);

$( "button" ).click(function() {
  partA.addClass("color");
  partB.addClass("color");
  partC.addClass("color");
  partD.addClass("color");
  partE.addClass("color");
});

function color(e) {
	$("i").removeClass("unselect");
	if($(e.target).attr('name')) {
		counter=$(e.target).attr('name');
		//console.log(counter);
	}

}

//$(document).ready(function(){
	//$("#bolts").on({
	$("i").on({
		"mousemove": function(e) {
			color(e);
			$(this).addClass("select");
			$(this).prevAll().addClass("select");
			//console.log($(e.target).attr('name'));
			//if($(e.target).attr('name'))
		}, 
		"mouseleave": function(e) {
			$("i").removeClass("select").addClass("unselect");
			//$(this).removeClass("select").addClass("unselect");
			//color(e);
			//console.log($(e.target).attr('name'));
		},
		"click": function() {
			$("i").off("mousemove");
			$("i").off("mouseleave");
			console.log("click");
		}
	});

//});


})();