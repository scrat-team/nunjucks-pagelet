'use strict';

const expect = require('expect.js');
const util = require('./util');

describe('test/index.test.js', function() {
  let app, framework;

  before(function() {
    app = util('general');
    framework = app.framework;
  });

  after(util.restore);

  it('should exports', function() {
    expect(framework.Tag).to.not.be(undefined);
    expect(framework.Resource).to.not.be(undefined);
    expect(framework.manifest).to.eql(framework.Resource.manifest);
  });
});
