'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const framework = require('../');

module.exports = function(targetDir, opt) {
  const baseDir = path.join(process.cwd(), './test/fixtures/', targetDir);
  const env = nunjucks.configure(baseDir);
  const mapFile = path.join(baseDir, 'map.json');
  const mapData = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

  framework.configure(Object.assign({
    root: baseDir,
    file: mapFile
  }, opt));

  framework.tags.forEach((tag) => {
    env.addExtension(tag.tagName, tag);
  });

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
    framework: framework,
    mount: mount
  };
};

module.exports.restore = function() {

};