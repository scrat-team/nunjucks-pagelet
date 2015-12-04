'use strict';

const expect = require('expect.js');
const sinon = require('sinon');
const util = require('../../util');

describe('test/lib/tags/datalet.test.js', function() {
  let mm, env, engine, spy;

  before(function() {
    mm = util('general');
    env = mm.env;
    engine = mm.engine;
    spy = sinon.spy(engine.Resource.prototype, 'addDatalet');
  });

  after(util.restore);

  it('should exec datalet', function() {
    const tpl = '{% html %}{% datalet test="a", test2=test2%}{% endhtml %}';
    const html = env.renderString(tpl, {test2: 'test222', _pagelets: 'main'});
    expect(JSON.parse(html).data).to.eql({test: 'a', test2: 'test222'});
    sinon.assert.calledWith(spy, {test: 'a', test2: 'test222'});
    spy.reset();
  });
});
