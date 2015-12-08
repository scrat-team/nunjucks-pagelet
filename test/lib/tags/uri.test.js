'use strict';

const util = require('../../util');

describe('test/lib/tags/uri.test.js', function() {
  let mm;

  before(function() {
    mm = util('general');
  });

  after(util.restore);

  it('should render uri tag', function() {
    const tpl = `{% html%}<img data-src="{% uri 'components/nav/nav.js' %}"/><img src="{% uri $id='components/nav/nav.js' %}"/>{% endhtml%}`;
    mm.equal(tpl, '<html><img data-src="c/nav/nav.js"/><img src="c/nav/nav.js"/></html>');
  });
});
