'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
const fs = require('fs');
// const sinon = require('sinon');

const framework = require('../');
const baseDir = path.join('./test/fixtures/general');
const mapPath = path.join(baseDir, 'map.json');

describe('test/index.test.js', function() {
  it('should exports', function() {
    const target = framework({
      path: mapPath
    });
    expect(target.BaseTag).to.not.be(undefined);
    expect(target.Resource).to.not.be(undefined);
    expect(target.manifest).to.eql(JSON.parse(fs.readFileSync(mapPath, 'utf8')));
  });
});
