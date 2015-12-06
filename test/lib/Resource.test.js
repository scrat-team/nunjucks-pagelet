'use strict';

const expect = require('expect.js');
const fs = require('fs');
const sinon = require('sinon');

const util = require('../util');

const spy = sinon.spy(fs, 'readFileSync');

describe('test/Resource.test.js', function() {
  let app, engine, baseDir, Resource;

  before(function() {
    app = util('general');
    baseDir = app.baseDir;
    engine = app.engine;
    Resource = engine.Resource;
  });

  after(util.restore);

  afterEach(function() {
    spy.reset();
  });

  it('should read manifest file', function() {
    Resource.configure({
      cache: true,
      manifest: app.manifestFile,
      root: baseDir
    });
    expect(Resource.manifest).to.eql(app.manifestData);
  });

  it('should use manifest object', function() {
    Resource.configure({
      cache: true,
      manifest: {res: {}},
      root: baseDir
    });
    expect(Resource.manifest).to.eql({res: {}});
  });

  it('should use manifest function', function() {
    Resource.configure({
      cache: true,
      manifest: function() {
        return {res: {}, combo: true};
      },
      root: baseDir
    });
    expect(Resource.manifest).to.eql({res: {}, combo: true});
  });

  it('should cache manifest', function() {
    Resource.configure({
      cache: true,
      manifest: app.manifestFile,
      root: baseDir
    });
    Resource.manifest;
    Resource.manifest;
    Resource.manifest;
    expect(spy.callCount).to.be(1);
  });

  it('should not cache manifest', function() {
    Resource.configure({
      manifest: app.manifestFile,
      root: baseDir
    });
    Resource.manifest;
    Resource.manifest;
    expect(spy.callCount).to.be(2);
  });
});
