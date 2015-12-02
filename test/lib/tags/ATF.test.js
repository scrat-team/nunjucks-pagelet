'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
// const sinon = require('sinon');

const baseDir = path.join('./test/fixtures/general');
const mapFile = path.join(baseDir, 'map.json');

const env = nunjucks.configure('test');
const framework = require('../../../index');

describe.skip('test/lib/tags/ATF.test.js', function() {
  let target;

  afterEach(function() {
    target && target.Resource && target.Resource.reset();
  });

  it('should render ATF tag', function() {
    target = framework({
      file: mapFile
    });
    target.register(env);
    const tpl = '{% html %}before{% ATF %}after{% endhtml %}';
    const html = env.renderString(tpl, {_pagelets: 'main'});
    expect(html).to.equal('<head><meta charset="utf-8"/>\n<!--PAGELET_CSS_HOOK--></head>');
  });
});
