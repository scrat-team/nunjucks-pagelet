'use strict';

const Tag = require('nunjucks-tag');
const Resource = require('../Resource');

/**
 * HTML标签, 初始化一些该次渲染需用到的数据
 * 支持 cdn / doctype 参数.
 * @example
 * {% html cdn="http://cdn.cn" %}content{% endhtml %}
 */
class HtmlTag extends Tag {
  constructor() {
    super('html');
  }

  render(context, attrs, body) {
    const attrObj = attrs[attrs.length - 1] || {};
    // 实例化 resource 对象, 生命周期为整个HTML标签
    const resource = new Resource();
    context.ctx.__resource = resource;

    resource.usePagelet(context.ctx._pagelets);
    resource.setDomain(attrObj['cdn']);
    delete attrObj['cdn'];

    const doctype = attrObj['doctype'] || 'html';
    delete attrObj['doctype'];

    // 渲染子元素
    let html = super.render(context, attrs, body);
    html = `<!DOCTYPE ${doctype}>\n` + html;
    html = resource.render(html);

    // 销毁
    delete context.ctx.__resource;

    return html;
  }
}

module.exports = HtmlTag;


