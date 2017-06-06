'use strict';

const Tag = require('nunjucks-tag');
const symbol = require('../symbol');

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
    const resource = context.ctx[symbol.RESOURCE];
    return resource.useATF();
  }
}

module.exports = ATFTag;

