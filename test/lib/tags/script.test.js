'use strict';

const expect = require('expect.js');
const sinon = require('sinon');
const util = require('../../util');

describe('test/lib/tags/script.test.js', function() {
  let mm, env, engine, spy;

  before(function() {
    mm = util('general');
    env = mm.env;
    engine = mm.engine;
    spy = sinon.spy(engine.Resource.prototype, 'addScript');
  });

  after(util.restore);

  it('should collect script', function() {
    const tpl = '{% html %}{% script %}var a = "b\" + {{clz}};{% endscript %}{% endhtml%}';
    const html = env.renderString(tpl, {clz: 'test'});
    expect(html).to.equal('<html></html>');
    sinon.assert.calledWith(spy, 'var a = "b" + test;');
    spy.reset();
  });
});
