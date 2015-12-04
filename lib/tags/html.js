'use strict';

const Tag = require('../Tag');
const Resource = require('../Resource');

/**
 * HTML标签, 初始化一些该次渲染需用到的数据
 * 支持 cdn 参数.
 * @example
 * {% html cdn="http://cdn.cn" %}content{% endhtml %}
 */
class HtmlTag extends Tag {
  constructor() {
    super('html');
  }

  render(context, attrs, body) {
    const attrObj = attrs[0] || {};
    // 实例化 resource 对象, 生命周期为整个HTML标签
    const resource = new Resource();
    context.resource = resource;

    resource.usePagelet(context.ctx._pagelets);
    resource.setDomain(attrObj['cdn']);
    delete attrObj['cdn'];

    // 渲染子元素
    let html = super.render(context, attrs, body, true);
    html = context.resource.render(html);

    // 销毁
    delete context.resource;

    return this.safe(html);
  }
}

module.exports = HtmlTag;


