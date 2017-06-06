'use strict';

const util = require('../../util');

describe('test/lib/tags/uri.test.js', function() {
  let mm;

  before(function() {
    mm = util('general');
  });

  after(util.restore);

  it('should render uri tag', function() {
    const tpl = `{% html%}<img data-src="{% uri 'component/nav/nav.js' %}"/><img data-src="{% uri $id='component/nav/nav.js' %}"/>{% endhtml%}`;
    mm.equal(tpl, '<!DOCTYPE html>\n<html><img data-src="c/nav/nav.js"/><img data-src="c/nav/nav.js"/></html>');
  });
});
