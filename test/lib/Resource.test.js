'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');

const Resource = require('../../lib/Resource');
const baseDir = path.join('./test/fixtures/general');
const mapPath = path.join(baseDir, 'map.json');
const mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const spy = sinon.spy(fs, 'readFileSync');

describe('test/Resource.test.js', function() {
  afterEach(function() {
    spy.reset();
  });

  it('should read map', function() {
    Resource.configure({
      cache: true,
      path: mapPath
    });
    expect(Resource.manifest).to.eql(mapData);
  });

  it('should cache map', function() {
    Resource.configure({
      cache: true,
      path: mapPath
    });
    Resource.manifest;
    Resource.manifest;
    Resource.manifest;
    expect(spy.callCount).to.be(1);
  });

  it('should not cache map', function() {
    Resource.configure({
      path: mapPath
    });
    Resource.manifest
    Resource.manifest;
    expect(spy.callCount).to.be(2);
  });
});
