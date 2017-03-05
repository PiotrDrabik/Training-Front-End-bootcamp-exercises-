function EventEmitter() {
 
    this.events = {};
 
}
 
EventEmitter.prototype.on = function(type, fn) {
 
    if(!type || !fn) return;
 
    this.events[type] = this.events[type] || [];
    this.events[type].push(fn);
 
}
 
EventEmitter.prototype.emit = function(type, data) {
 
    var fns = this.events[type];
 
    if(!fns || !fns.length) return;
 
    for(var i = 0; i < fns.length; i++) {
        fns[i](data);
    }
 
};
 
function Database(url) {
    EventEmitter.call(this,url),
    this.url = url;
 
}
//EventEmitter.prototype.connect = function() {
Database.prototype.connect = function() {
 
    // fikcyjne podłączenie do bazy
 
    this.emit("connect", this.url);
 
}
 


Database.prototype.disconnect = function() {
 
    // fikcyjne zakończenie połączenia z bazą

    this.emit("disconnect", this.url);
 
}
 

// Użycie EventEmittera
var ev = new EventEmitter();
 
ev.on("hello", function(message) {
    console.log("Witaj " + message + "!");
});
 
ev.on("hello", function(message) {
    console.log("Siema " + message + ".");
});
 
ev.on("goodbye", function() {
    console.log("Do widzenia!");
});
 
ev.emit("hello", "Marek");
ev.emit("goodbye");
ev.emit("custom"); // nic się nie wydarzy
 
// DO ZROBIENIA!
// Docelowe użycie klasy Database
EventEmitter.prototype.connect = Database.prototype.connect;
EventEmitter.prototype.disconnect = Database.prototype.disconnect;

Database.prototype = Object.create(EventEmitter.prototype);
Database.prototype.constructor = Database;

/**/
var db = new Database("db://localhost:3000"); // fikcyjny adres


/*db.prototype.on = function() {
    EventEmitter.call(this);
}*/

db.prototype = Object.create(EventEmitter.prototype);
db.prototype.constructor = db;
//db.prototype.on = ev.on;
//var db = Database.bind(EventEmitter, "db://localhost:3000");
//db = call(EventEmitter, "db://localhost:3000");
db.on("connect", function(url) {
    console.log("Połączenie z bazą pod adresem " + url + " zostało ustanowione.");
});
 
db.on("disconnect", function(url) {
    console.log("Połączenie z bazą pod adresem " + url + " zostało zakończone.");
});
 
db.connect();
 
// po 5 sekundach rozłączamy się
setTimeout(function() {
    db.disconnect();
}, 5000);