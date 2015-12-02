'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
const fs = require('fs');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const HtmlTag = require('../../../lib/tags/html');
const UriTag = require('../../../lib/tags/uri');
env.addExtension('uri', new UriTag());
env.addExtension('html', new HtmlTag());

const framework = require('../../../');
const baseDir = path.join('./test/fixtures/general');
const mapFile = path.join(baseDir, 'map.json');

describe.only('test/lib/tags/uri.test.js', function() {
  let target;

  afterEach(function() {
    target && target.Resource && target.Resource.reset();
  });

  it('should render uri tag', function() {
    target = framework({file: mapFile});
    const tpl = '{% html%}<img src=\"{% uri "components/nav/nav.js" %}\"/>{% endhtml%}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<html><img src="c/nav/nav.js"/></html>');
  });
});
