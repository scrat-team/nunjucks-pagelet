'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
// const sinon = require('sinon');

const framework = require('../');
const baseDir = path.join('./test/fixtures/general');
const mapFile = path.join(baseDir, 'map.json');

describe('test/index.test.js', function() {
  let target;

  afterEach(function() {
    target && target.Resource && target.Resource.reset();
  });

  it('should exports', function() {
    target = framework({
      file: mapFile
    });
    expect(target.BaseTag).to.not.be(undefined);
    expect(target.Resource).to.not.be(undefined);
    expect(target.manifest).to.eql(target.Resource.manifest);
    target.Resource.reset();
  });
});
