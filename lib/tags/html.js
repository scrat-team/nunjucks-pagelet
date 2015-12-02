'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

class HtmlTag extends BaseTag {
  constructor() {
    super('html');
  }

   beforeRender(context, attrs) {
     // TODO: 检查这里取值对不对
     const locals = context.ctx;
     const resource = new Resource();
     context.resource = resource;
     resource.usePagelet(locals._pagelets);
     resource.setDomain(attrs.cdn);
     delete attrs.cdn;
   }

  afterRender(context) {
    delete context.resource;
  }

  render(context, attrs, fragment) {
    let html = super.render(context, attrs, fragment, true);
    html = context.resource.render(html);
    return this.safe(html);
  }
}

module.exports = HtmlTag;


