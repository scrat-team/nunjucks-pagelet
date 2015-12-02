'use strict';

const BaseTag = require('../BaseTag');
const Resource = require('../Resource');

class HtmlTag extends BaseTag {
  constructor() {
    super('html');
  }

  render(context, attrs, content) {
    // context.resource = new Resource();
    return super.render(context, attrs, content);
  }
}

module.exports = HtmlTag;


