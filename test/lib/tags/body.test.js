'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const util = require('../../util');

describe('test/lib/tags/body.test.js', function() {
  let app, env;

  before(function() {
    app = util('general');
    env = app.env;
  });

  after(util.restore);

  it('should render body tag with JS_HOOK', function() {
    const tpl = '{% body %}test{% endbody %}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<body>test\n<!--PAGELET_JS_HOOK--></body>');
  });
});
