'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
const fs = require('fs');
// const sinon = require('sinon');

const Resource = require('../../../lib/Resource');
const baseDir = path.join('./test/fixtures/general');
const mapFile = path.join(baseDir, 'map.json');
const mapData = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

const env = nunjucks.configure('test');
const Tag = require('../../../lib/tags/html');
env.addExtension('html', new Tag());

describe('test/lib/tags/html.test.js', function() {
  const locals = {attr1: 'some attr', content: 'this is content'};

  before(function() {
    Resource.configure({file: mapFile});
  });

  after(function() {
    Resource.reset();
  });

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

  it('should render pagelet json', function() {
    const tpl = '{% html "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, {_pagelets: 'main', attr1: 'some attr', content: 'this is content'});
    const json = JSON.parse(html);
    expect(json).have.keys('html', 'data', 'js', 'css', 'title', 'script');
  });
});
