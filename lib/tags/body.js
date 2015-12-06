'use strict';

const Tag = require('../Tag');

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
    return super.render(context, attrs, [body(), context.resource.JS_HOOK].join('\n'));
  }
}

module.exports = BodyTag;
