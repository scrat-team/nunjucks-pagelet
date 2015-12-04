'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe('test/lib/tags/html.test.js', function() {
  let mm, env;

  before(function() {
    mm = util('general');
    env = mm.env;
  });

  after(util.restore);

  const locals = {attr1: 'some attr', content: 'this is content'};

  it('should render html tag', function() {
    const tpl = '{% html cdn="http://cdn.cn", "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<html data-attr1="some attr" attr2="a2">this is content</html>');
  });

  it('should render empty attrs', function() {
    const tpl = '{% html %}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<html>this is content</html>');
  });

  it('should render pagelet json', function() {
    const tpl = '{% html "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, {_pagelets: 'main', attr1: 'some attr', content: 'this is content'});
    const json = JSON.parse(html);
    expect(json).have.keys('html', 'data', 'js', 'css', 'title', 'script');
  });
});
