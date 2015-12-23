'use strict';

const Tag = require('nunjucks-tag');

/**
 * append JS_HOOK to body
 * @example
 * {% body %}test{% endbody %}
 */
class BodyTag extends Tag {
  constructor() {
    super('body');
  }

  render(context, attrs, body) {
    const resource = context.ctx.__resource;
    return super.render(context, attrs, [body(), resource.JS_HOOK].join('\n'));
  }
}

module.exports = BodyTag;
