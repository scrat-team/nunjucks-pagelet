'use strict';

const BaseTag = require('../Tag');
// const Resource = require('../Resource');

class HtmlTag extends BaseTag {
  constructor() {
    super('html');
  }

  // beforeRender(context) {
    // context.resource = new Resource();
  // }

  render(context, attrs, content) {
    return super.render(context, attrs, content);
  }
}

module.exports = HtmlTag;


