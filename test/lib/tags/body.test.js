'use strict';

const util = require('../../util');

describe('test/lib/tags/body.test.js', function() {
  let mm;

  before(function() {
    mm = util('general');
    mm.mockContext({
      'JS_HOOK': '<!--PAGELET_JS_HOOK-->'
    });
  });

  after(util.restore);

  it('should render body tag with JS_HOOK', function() {
    const tpl = '{% mock %}{% body %}test{% endbody %}{% endmock %}';
    mm.equal(tpl, '<body>test\n<!--PAGELET_JS_HOOK--></body>');
  });
});
