'use strict';

const Tag = require('../Tag');

/**
 * update document.title
 * @example
 * {% uri "/test.js"%}
 */
class UriTag extends Tag {
  constructor() {
    super('uri', false);
  }

  render(context, attrs) {
    // TODO: 属性读取
    return context.resource.uri(attrs);
  }
}

module.exports = UriTag;
