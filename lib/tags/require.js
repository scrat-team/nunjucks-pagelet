'use strict';

const Tag = require('../Tag');

/**
 * append CSS_HOOK to head
 * @example
 * {% require "news/detail" %}
 * {% require $id="news/detail" str="aa" "data-attr1"="another"%}
 */
class RequireTag extends Tag {
  constructor() {
    super('require', false);
  }

  render(context, attrs) {
    const obj = attrs[0];
    let file;
    let locals;
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
