elf2ihex
--------

Dumps .text and .data objects (or others) to Intel Hex format.

usage
-----
```
  var e2i = elf2ihex();
  var rs = fs.createReadStream(path.join(__dirname, "data", "a.out"));
  rs.pipe(e2i);

  e2i.on("data", function(data) {
    console.log(data);
  });

  e2i.on("end", function(data) {
    console.log("upload.");
  });
```
