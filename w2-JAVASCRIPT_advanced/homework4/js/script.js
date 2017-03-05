/*

function createData(obj) {
 
    var data = obj;
 
}
 
var data = createData({});
 
data.set("name", "Janek");
 
console.log( data.get("name") );
*/
//----------------

function createData(obj) {

    var _data = obj;

    return {

      set: function(dat1, dat2) {
      	if ((!dat1) || (!dat2)) return console.log("za mało parametrów");
        _data[dat1] = dat2;
      },

      get: function(dat1) {
      	if(!dat1) return console.log("podaj klucz");
      	if (!_data[dat1]) return console.log("brak danych");
        return _data[dat1]
      }
    }

}

var data = createData({});

data.set("name", "Janek");
data.set("age", "35");

console.log(data.get("name"));
console.log(data.get("age"));
