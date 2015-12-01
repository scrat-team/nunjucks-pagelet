'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const Tag = require('../../../lib/tags/html');
env.addExtension('html', new Tag());

describe('test/lib/tags/html.test.js', function() {

  it('should render html tag', function() {
    const tpl = '{% html "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, {
      attr1: 'some attr',
      content: 'this is content'
    });
    expect(html).to.match(/^<html data-attr1="some attr" attr2="a2">[\n\s]*this is content[\n\s]*<\/html>$/);
  });

  it('should render empty attrs', function() {
    const tpl = '{% html %}{{ content }}{% endhtml %}';
    const html = env.renderString(tpl, {
      attr1: 'some attr',
      content: 'this is content'
    });
    expect(html).to.match(/^<html>[\n\s]*this is content[\n\s]*<\/html>$/);
  });
});
