'use strict';

var fs          = require("fs");
var browserify  = require("browserify");
var less        = require('less');
var filewatcher = require('filewatcher');

/*
var less_source = fs.readFileSync('./style.less', { encoding: 'utf8' });
console.time("LESS compilation");
less.render(less_source, function (e, output) {
  console.timeEnd("LESS compilation");
  fs.writeFileSync('./content.css', output.css);
});
*/

var watcher = filewatcher();


function build() {
  console.log("Transpiling");
  browserify("./client.js")
    .transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(fs.createWriteStream("./build/client-bundle.js"));
}

build();

watcher.add('./client.js');
watcher.add('./frontend');

watcher.on('change', function(file, stat) {
  console.log('File modified: %s', file);
  if (!stat) {
    console.log('deleted');
  }
  build();
});

