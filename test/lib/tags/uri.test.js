'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe('test/lib/tags/uri.test.js', function() {
  let mm, env;

  before(function() {
    mm = util('general');
    env = mm.env;
  });

  after(util.restore);

  it('should render uri tag', function() {
    const tpl = `{% html%}<img src="{% uri 'components/nav/nav.js' %}"/><img src="{% uri $id='components/nav/nav.js' %}"/>{% endhtml%}`;
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<html><img src="c/nav/nav.js"/><img src="c/nav/nav.js"/></html>');
  });
});
