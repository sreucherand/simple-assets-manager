'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');

var env = process.env.NODE_ENV || 'development';

var Asset = (function () {
  
  function Asset (name, content) {
    this.name = name;
    this.type = this.name.split('.').pop();
    this.files = content.files || [];
  };
  
  Asset.prototype.template = function (url) {
    switch (this.type) {
      case 'css':
        return '<link rel="stylesheet" href="'+url+'">';
      case 'js':
        return '<script src="'+url+'"></script>';
    }
    return;
  };
  
  Asset.prototype.render = function () {
    var files = [];
    
    if ('development' === env) {
      for (var i=0; i<this.files.length; i++) {
        files.push(this.template(this.files[i]));
      }
    } else {
      files.push(this.template(this.name));
    }
    
    return files.join('\n');
  };
  
  return Asset;
  
})();

module.exports.express = function (assets) {
  var assets = assets || {};
  var options = options || {};
  
  for (var name in assets) {
    assets[name] = new Asset(name, assets[name]);
  }
  
  return function (req, res, next) {
    res.locals.assets = function (name) {
      if (!assets[name]) {
        return;
      }
      return assets[name].render();
    };
    
    if (next) next();
  };
};

module.exports.gulp = function (options) {
  options.path = options.path || __dirname;
  
  return through.obj(function (file, encoding, callback) {
    var assets = JSON.parse(file.contents.toString());
    var asset = null;
    
    for (var name in assets) {
      asset = assets[name];
      asset.srcPath = asset.srcPath || '';
      
      this.push(new gutil.File({
        cwd: __dirname,
        base: options.path,
        path: path.join(options.path, name),
        contents: new Buffer(asset.files.map(function (file) {
          return fs.readFileSync(path.join(asset.srcPath, file), {
            encoding: 'utf8'
          });
        }).join(''))
      }));
    }
    
    if (typeof callback === 'function') {
      callback();
    }
  });
};
