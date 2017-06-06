'use strict';

const assert = require('assert');
const fs = require('fs');
const sinon = require('sinon');

const util = require('../util');

const spy = sinon.spy(fs, 'readFileSync');

describe('test/Resource.test.js', function() {
  let mm, engine, baseDir, Resource;

  before(function() {
    mm = util('general');
    baseDir = mm.baseDir;
    engine = mm.engine;
    Resource = engine.Resource;
  });

  after(util.restore);

  afterEach(function() {
    spy.reset();
  });

  it('should read manifest file', function() {
    Resource.configure({
      cache: true,
      manifest: mm.manifestFile,
      root: baseDir,
    });
    assert.deepEqual(Resource.manifest, mm.manifestData);
  });

  it('should use manifest object', function() {
    Resource.configure({
      cache: true,
      manifest: {res: {}},
      root: baseDir,
    });
    assert.deepEqual(Resource.manifest, {res: {}});
  });

  it('should use manifest function', function() {
    Resource.configure({
      cache: true,
      manifest: function() {
        return {res: {}, combo: true};
      },
      root: baseDir,
    });
    assert.deepEqual(Resource.manifest, {res: {}, combo: true});
  });

  it('should cache manifest', function() {
    Resource.configure({
      cache: true,
      manifest: mm.manifestFile,
      root: baseDir,
    });
    Resource.manifest;
    Resource.manifest;
    Resource.manifest;
    assert(spy.callCount === 1);
  });

  it('should not cache manifest', function() {
    Resource.configure({
      manifest: mm.manifestFile,
      root: baseDir,
    });
    Resource.manifest;
    Resource.manifest;
    assert(spy.callCount === 2);
  });
});
