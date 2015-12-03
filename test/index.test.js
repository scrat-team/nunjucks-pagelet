'use strict';

const expect = require('expect.js');
const path = require('path');
// const sinon = require('sinon');

const util = require('./util');

describe('test/index.test.js', function() {
  let app, target;

  before(function() {
    app = util('general');
    target = app.target;
  });

  after(util.restore);

  it('should exports', function() {
    expect(target.Tag).to.not.be(undefined);
    expect(target.Resource).to.not.be(undefined);
    expect(target.manifest).to.eql(target.Resource.manifest);
  });
});
