'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe.skip('test/lib/tags/ATF.test.js', function() {
  let app, env;

  before(function() {
    app = util('general');
    env = app.env;
  });

  after(util.restore);

  it('should render ATF tag', function() {
    const tpl = '{% html %}before{% ATF %}after{% endhtml %}';
    const html = env.renderString(tpl, {_pagelets: 'main'});
    expect(html).to.equal('<head><meta charset="utf-8"/>\n<!--PAGELET_CSS_HOOK--></head>');
  });
});
