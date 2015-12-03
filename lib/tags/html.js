'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

class HtmlTag extends BaseTag {
  constructor() {
    super('html');
  }

  render(context, attrs, body) {
    // 实例化 resource 对象, 生命周期为整个HTML标签
    const resource = new Resource();
    context.resource = resource;

    // TODO: 检查这里取值对不对
    resource.usePagelet(context.ctx._pagelets);
    resource.setDomain(attrs.cdn);
    delete attrs.cdn;

    let html = super.render(context, attrs, body, true);
    html = context.resource.render(html);

    // 销毁
    delete context.resource;

    return this.safe(html);
  }
}

module.exports = HtmlTag;


