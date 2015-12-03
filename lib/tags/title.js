'use strict';

const BaseTag = require('../Tag');

/**
 * update document.title
 * @example
 * {% title %}{{some_var}}{% endtitle %}
 */
class TitleTag extends BaseTag {
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
