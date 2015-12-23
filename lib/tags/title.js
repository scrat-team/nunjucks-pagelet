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
    const resource = context.ctx.__resource;
    const fragment = body();
    resource.pageletTitle(fragment);
    return super.render(context, attrs, fragment);
  }
}

module.exports = TitleTag;
