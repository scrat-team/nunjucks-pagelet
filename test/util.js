'use strict';

const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');
const engine = require('../');

module.exports = function(targetDir, opt) {
  const baseDir = path.join(process.cwd(), './test/fixtures/', targetDir);
  const env = nunjucks.configure(baseDir, {autoescape: true});
  const mapFile = path.join(baseDir, 'map.json');
  const mapData = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

  engine.configure(Object.assign({
    root: baseDir,
    file: mapFile
  }, opt));

  engine.tags.forEach((tag) => {
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
    engine: engine,
    mount: mount
  };
};

module.exports.restore = function() {

};