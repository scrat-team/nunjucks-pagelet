'use strict';

const Tag = require('nunjucks-tag');

/**
 * ATF 首屏标签, 该标签上部的样式将被内嵌.
 * @example
 * {% ATF %}
 */
class ATFTag extends Tag {
  constructor() {
    super('ATF');
    this.end = false;
  }

  render(context) {
    return context.resource.useATF();
  }
}

module.exports = ATFTag;


