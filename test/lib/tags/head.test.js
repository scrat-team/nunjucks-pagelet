'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const Tag = require('../../../lib/tags/head');
env.addExtension('head', new Tag());

describe('test/lib/tags/head.test.js', function() {
  it('should render head tag with CSS_HOOK', function() {
    const tpl = '{% head %}<meta charset="utf-8"/>{% endhead %}';
    const html = env.renderString(tpl, {});
    expect(html).to.match(/^<head\s*>[\n\s]*<meta charset="utf-8"\/>[\n\s]*<!--SCRAT_CSS_HOOK--><\/head>/);
  });
});
