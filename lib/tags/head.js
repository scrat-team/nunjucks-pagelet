'use strict';

const BaseTag = require('../BaseTag');
const Resource = require('../Resource');

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
    return super.render(context, attrs, [content, Resource.CSS_HOOK].join('\n'));
  }
}

module.exports = HeadTag;
