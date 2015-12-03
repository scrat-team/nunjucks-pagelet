'use strict';

const assert = require('assert');
const Tag = require('../Tag');

/**
 * render pagelet tag
 * @example
 * {% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}
 * {% html %}{% pagelet $id="main" $tag="section %}hello{% endpagelet %}{% endhtml %}
 */
class PageletTag extends Tag {
  constructor() {
    super('pagelet');
  }

  render(context, attrs, body) {
    const obj = attrs[0];
    const id = obj['$id'];

    assert.notEqual(id, undefined, 'missing pagelet $id, should use as {% pagelet $id="my_id"%}content{% endpagelet%}');

    let tag = obj['$tag'];
    if (!tag) {
      tag = 'div';
    } else if (tag === 'none') {
      tag = false;
    }

    delete obj['$id'];
    delete obj['$tag'];

    let attrStr = this._packAttrs(attrs);
    attrStr = attrStr ? ' ' + attrStr : '';
    const resource = context.resource;
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

    return this.safe(fragment.join(''));
  }
}

module.exports = PageletTag;
