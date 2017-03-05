require('style!css!./style.css');
  document.write(require("./content.js"));
  document.write(require("./content2.js"));

  var test2 = () => 'test2';

  console.log(test2());

