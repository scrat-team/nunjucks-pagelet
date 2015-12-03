'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
const path = require('path');
// const sinon = require('sinon');

const util = require('../../util');

describe('test/lib/tags/uri.test.js', function() {
  let app, env;

  before(function() {
    app = util('general');
    env = app.env;
  });

  after(util.restore);

  it('should render uri tag', function() {
    const tpl = '{% html%}<img src=\"{% uri "components/nav/nav.js" %}\"/>{% endhtml%}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<html><img src="c/nav/nav.js"/></html>');
  });
});
