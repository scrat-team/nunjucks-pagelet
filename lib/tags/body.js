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

  render(context, attrs, fragment) {
    return super.render(context, attrs, [fragment, Resource.JS_HOOK].join('\n'));
  }
}

module.exports = BodyTag;
