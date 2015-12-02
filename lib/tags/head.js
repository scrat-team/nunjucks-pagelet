'use strict';

const BaseTag = require('../Tag');
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

  render(context, attrs, fragment) {
    return super.render(context, attrs, [fragment, Resource.CSS_HOOK].join('\n'));
  }
}

module.exports = HeadTag;
