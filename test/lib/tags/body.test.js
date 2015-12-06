'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe('test/lib/tags/body.test.js', function() {
  let mm, env;

  before(function() {
    mm = util('general');
    env = mm.env;
    mm.mockContext({
      'JS_HOOK': '<!--PAGELET_JS_HOOK-->'
    });
  });

  after(util.restore);

  it('should render body tag with JS_HOOK', function() {
    const tpl = '{% mock %}{% body %}test{% endbody %}{% endmock %}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<body>test\n<!--PAGELET_JS_HOOK--></body>');
  });
});
