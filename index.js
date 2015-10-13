"use strict";

var elfy = require("elfy");
var fs = require("fs");
var through = require("through2");

function pad(d, len) {
  var r = d.toString(16);
  while(r.length < len) {
    r = "0" + r;
  }

  return r;
}

function twoComp(v) {
  var inv = (0 + v).toString(2).split("").map(function(p) {
    return p === "0" ? "1" : "0";
  }).join("");

  v = parseInt(inv, 2) + 1;

  return v & 255;
}

module.exports = function(opts) {
  var addr = 0;
  var byteCount = 16;
  var crcSum = 0;
  var sections = opts && opts.sections ? opts.sections : [ ".text", ".data" ];

  var b = new Buffer([]);

  var tr = through(function(chunk, enc, cb) {
    b = Buffer.concat([b, chunk]);
    cb(null);
  }, function(cb) {
    var bin = elfy.parse(b);
    var self = this;

    bin.body.sections.forEach(function(section) {
      if(sections.indexOf(section.name) === -1) {
        return;
      }

      var data = section.data;
      var line = "";

      function push(s) {
        line += s;
      }

      function writeNum(n) {
        push(n.toString(16).toUpperCase());
      }


      while(addr < data.length) {
        if(addr % byteCount === 0) {
          var dataLen = data.length - addr > byteCount ? byteCount : (data.length - addr);
          crcSum += (0 + dataLen);
          crcSum += (0 + addr);

          push(":");
          writeNum(pad(dataLen, 2));
          push(pad(addr, 4));
          push("00");
        }

        crcSum += (0 + data[addr]);

        writeNum(data[addr]);

        if(addr % byteCount === 15 || addr === data.length - 1) {
          writeNum(twoComp(crcSum));
          crcSum = 0;

          self.push(line);
          line = "";
        }

        addr++;
      }
    });

    self.push(":00000001FF");
    self.push(null);
  });

  return tr;
}
