'use strict';

const Tag = require('nunjucks-tag');

/**
 * update document.title
 * @example
 * {% title %}{{some_var}}{% endtitle %}
 */
class TitleTag extends Tag {
  constructor() {
    super('title');
  }

  render(context, attrs, body) {
    const fragment = body();
    context.resource.pageletTitle(fragment);
    return super.render(context, attrs, fragment);
  }
}

module.exports = TitleTag;
