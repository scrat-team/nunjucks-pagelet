'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const framework = require('../');

module.exports = function(targetDir, opt){
  const baseDir = path.join('./test/fixtures/', targetDir);
  const env = nunjucks.configure(baseDir);
  const mapFile = path.join(baseDir, 'map.json');
  const mapData = JSON.parse(fs.readFileSync(mapFile, 'utf8'));
  opt = opt || {};
  opt.file = opt.file || mapFile;
  const target = framework(opt);
  target.register(env);

  function mount(Tags) {
    Tags = Array.prototype.slice.call(arguments);
    Tags.forEach((Tag) => {
      let tag = new Tag();
      env.addExtension(tag.tagName, tag);
    });
  }

  return {
    baseDir: baseDir,
    mapFile: mapFile,
    mapData: mapData,
    env: env,
    target: target,
    mount: mount
  };
};

module.exports.restore = function() {

};