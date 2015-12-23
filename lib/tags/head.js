'use strict';

const Tag = require('nunjucks-tag');

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
    const resource = context.ctx.__resource;
    return super.render(context, attrs, [body(), resource.CSS_HOOK].join('\n'));
  }
}

module.exports = HeadTag;
