var elf2ihex = require("../");
var fs = require("fs");
var test = require("tape");
var path = require("path");

var fixture = fs.readFileSync(path.join(__dirname, "data", "a.hex")).toString();

test(function(t) {
  t.plan(1);

  var b = "";
  var e2i = elf2ihex();
  var rs = fs.createReadStream(path.join(__dirname, "data", "a.out"));

  rs.pipe(e2i);
  e2i.on("data", function(data) {
    b += (data + "\r\n");
  });

  e2i.on("end", function(data) {
    t.equal(b, fixture, "matching output");
  });
}, "test against known output");
