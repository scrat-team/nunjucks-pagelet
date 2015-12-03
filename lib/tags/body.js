'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

/**
 * append JS_HOOK to head
 * @example
 * {% body %}test{% endbody %}
 */
class BodyTag extends BaseTag {
  constructor() {
    super('body');
  }

  render(context, attrs, body) {
    return super.render(context, attrs, [body(), Resource.JS_HOOK].join('\n'));
  }
}

module.exports = BodyTag;
