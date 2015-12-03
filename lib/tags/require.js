'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

/**
 * append CSS_HOOK to head
 * @example
 * {% require "news/detail" %}
 * {% require $id="news/detail" str="aa" "data-attr1"="another"%}
 */
class RequireTag extends BaseTag {
  constructor() {
    super('require', false);
  }

  render(context, attrs) {
    let file;
    let locals;
    let obj = attrs[0];
    if (typeof obj === 'string') {
      file = obj;
      locals = context.ctx;
    } else {
      locals = Object.assign({}, context.ctx, obj);
      file = locals['$id'];
      delete locals['$id'];
    }
    const html = context.resource.include(file, context, locals);
    return this.safe(html);
  }
}

module.exports = RequireTag;
