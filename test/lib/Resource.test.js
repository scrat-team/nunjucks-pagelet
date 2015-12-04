'use strict';

const expect = require('expect.js');
const fs = require('fs');
const sinon = require('sinon');

const util = require('../util');

const spy = sinon.spy(fs, 'readFileSync');

describe('test/Resource.test.js', function() {
  let app, framework, baseDir, Resource;

  before(function() {
    app = util('general');
    baseDir = app.baseDir;
    framework = app.framework;
    Resource = framework.Resource;
  });

  after(util.restore);

  afterEach(function() {
    spy.reset();
  });

  it('should read map', function() {
    Resource.configure({
      cache: true,
      file: app.mapFile,
      root: baseDir
    });
    expect(Resource.manifest).to.eql(app.mapData);
  });

  it('should cache map', function() {
    Resource.configure({
      cache: true,
      file: app.mapFile,
      root: baseDir
    });
    Resource.manifest;
    Resource.manifest;
    Resource.manifest;
    expect(spy.callCount).to.be(1);
  });

  it('should not cache map', function() {
    Resource.configure({
      file: app.mapFile,
      root: baseDir
    });
    Resource.manifest;
    Resource.manifest;
    expect(spy.callCount).to.be(2);
  });
});
