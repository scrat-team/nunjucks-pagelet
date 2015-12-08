'use strict';

const util = require('../../util');

describe('test/lib/tags/head.test.js', function() {
  let mm;

  before(function() {
    mm = util('general');
    mm.mockContext({
      'CSS_HOOK': '<!--PAGELET_CSS_HOOK-->'
    });
  });

  after(util.restore);

  it('should render head tag with CSS_HOOK', function() {
    const tpl = '{% mock %}{% head %}<meta charset="utf-8"/>{% endhead %}{% endmock %}';
    mm.equal(tpl, '<head><meta charset="utf-8"/>\n<!--PAGELET_CSS_HOOK--></head>');
  });
});
