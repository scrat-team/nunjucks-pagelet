'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe('test/lib/tags/head.test.js', function() {
  let mm, env;

  before(function() {
    mm = util('general');
    env = mm.env;
  });

  after(util.restore);

  it('should render head tag with CSS_HOOK', function() {
    const tpl = '{% head %}<meta charset="utf-8"/>{% endhead %}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<head><meta charset="utf-8"/>\n<!--PAGELET_CSS_HOOK--></head>');
  });
});
