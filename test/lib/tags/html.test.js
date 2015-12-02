'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const Tag = require('../../../lib/tags/html');
env.addExtension('html', new Tag());

describe('test/lib/tags/html.test.js', function() {
  const locals = {attr1: 'some attr', content: 'this is content'};

  it('should render html tag', function() {
    const tpl = '{% html "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<html data-attr1="some attr" attr2="a2">this is content</html>');
  });

  it('should render empty attrs', function() {
    const tpl = '{% html %}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<html>this is content</html>');
  });
});
