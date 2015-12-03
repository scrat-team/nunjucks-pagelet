'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const util = require('../../util');

describe('test/lib/tags/require.test.js', function() {
  let app, env;

  before(function() {
    app = util('general');
    env = app.env;
  });

  after(util.restore);

  it('should render require tag ', function() {
    const tpl = '{% html %}{% require $id="foo", title="this is title", href=href, deep=deep.foo %}{% endhtml %}';
    const html = env.renderString(tpl, {title: 'this is title', href: 'http://t.cn', deep: {foo: 'foo'}});
    expect(html).to.equal('<html><h1>this is title</h1>\n<a href="http://t.cn">ucweb</a>\n<span>foo</span></html>');
  });
});

