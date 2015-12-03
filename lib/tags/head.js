'use strict';

const Tag = require('../Tag');
const Resource = require('../Resource');

/**
 * append CSS_HOOK to head
 * @example
 * {% head %}<meta charset="utf-8"/>{% endhead %}
 */
class HeadTag extends Tag {
  constructor() {
    super('head');
  }

  render(context, attrs, body) {
    return super.render(context, attrs, [body(), Resource.CSS_HOOK].join('\n'));
  }
}

module.exports = HeadTag;
