
if (String.prototype.repeeat) {
	console.log("jest prototyp");
	} else {
		console.log("brak prototypu, więc tworzę go");
		String.prototype.repeeat = function(x) {
			var temp="";
			for (var i=0; i<x;i++) {temp+=this;} //w this jest string, którym będziemy manipulować
			return temp;
		}
	}

var test="sprawdzenie ";
$('h3').html(test.repeeat(3));
console.log(String.prototype.constructor.arguments);
//console.log("dir(String)"); - wyświetla zawartość