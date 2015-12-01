'use strict';

const BaseTag = require('../BaseTag');
const CSS_HOOK = '<!--SCRAT_CSS_HOOK-->';

/**
 * append CSS_HOOK to head
 *
 * @alias head
 *
 * @example
 * {% head %}<meta charset="utf-8"/>{% endhead %}
 */
class HeadTag extends BaseTag {
  constructor() {
    super('head');
  }

  render(context, attrs, content) {
    content += `\n${CSS_HOOK}`;
    return super.render(context, attrs, content);
  }
}

module.exports = HeadTag;
