'use strict';

const assert = require('assert');
const Tag = require('nunjucks-tag');
const symbol = require('../symbol');

/**
 * render pagelet tag
 * 支持参数:
 *   - $id {String} 必须, pagelet id
 *   - $tag {String} 可选, 默认为 div , 设置为 none 则不输出实体标签, 输出注释包裹
 * @example
 * {% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}
 * {% html %}{% pagelet $id="main" $tag="section %}hello{% endpagelet %}{% endhtml %}
 */
class PageletTag extends Tag {
  constructor() {
    super('pagelet');
  }

  render(context, attrs, body) {
    const obj = attrs[attrs.length - 1];
    const id = obj['$id'];

    assert.notEqual(id, undefined, 'missing pagelet $id, should use as {% pagelet $id="my_id" %}content{% endpagelet %}');

    let tag = obj['$tag'];
    if (!tag) {
      tag = 'div';
    } else if (tag === 'none') {
      tag = false;
    }

    delete obj['$id'];
    delete obj['$tag'];

    let attrStr = this.convertAttrs(attrs);
    attrStr = attrStr ? ' ' + attrStr : '';
    const resource = context.ctx[symbol.RESOURCE];
    const pageletId = resource.pageletId(id);

    let fragment = [];

    // 开始标签
    if (tag) {
      attrStr += ' ' + `data-pagelet="${pageletId}"`;
      fragment.push(`<${tag}${attrStr}>`);
    } else {
      fragment.push(`<!-- pagelet[${pageletId}] start -->`);
    }

    // 内容
    if (resource.pageletStart(id)) {
      fragment.push(resource.pageletEnd(body()));
    }

    // 结束标签
    if (tag) {
      fragment.push(`</${tag}>`);
    } else {
      fragment.push(`<!-- pagelet[${pageletId}] end -->`);
    }

    return fragment.join('');
  }
}

module.exports = PageletTag;
