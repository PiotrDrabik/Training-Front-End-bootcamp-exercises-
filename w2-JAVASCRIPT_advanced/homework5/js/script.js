
function Toggler(selector) {
	this.getElem = function() {
		var select = document.querySelector(selector);
		return select;
	};
	this.show = function() {
		console.log("show");
		this.getElem().style.display = "block";
	};
	this.hide = function() {
		console.log("hide");
		this.getElem().style.display = "none";
	};
}

var elem = new Toggler("#section");
var button = document.querySelector("#button");
 
button.addEventListener("click", function() {
 
    if(elem.getElem().style.display == "none") {
        elem.show();
    } else {
        elem.hide();
    }
 
}, false);