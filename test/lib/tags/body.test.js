'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe('test/lib/tags/body.test.js', function() {
  let mm, env;

  before(function() {
    mm = util('general');
    env = mm.env;
  });

  after(util.restore);

  it('should render body tag with JS_HOOK', function() {
    const tpl = '{% body %}test{% endbody %}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<body>test\n<!--PAGELET_JS_HOOK--></body>');
  });
});
