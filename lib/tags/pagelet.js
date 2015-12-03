'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

/**
 * render pagelet tag
 * @example
 * {% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}
 * {% html %}{% pagelet $id="main" $tag="section %}hello{% endpagelet %}{% endhtml %}
 */
class PageletTag extends BaseTag {
  constructor() {
    super('pagelet');
  }

  render(context, attrs, body) {
    return super.render(context, attrs, [body(), Resource.CSS_HOOK].join('\n'));
  }
}

module.exports = PageletTag;
