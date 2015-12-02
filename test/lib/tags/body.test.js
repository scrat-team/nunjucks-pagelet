'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const Tag = require('../../../lib/tags/body');
env.addExtension('body', new Tag());

describe('test/lib/tags/body.test.js', function() {
  it('should render body tag with JS_HOOK', function() {
    const tpl = '{% body %}test{% endbody %}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<body>test\n<!--PAGELET_JS_HOOK--></body>');
  });
});
