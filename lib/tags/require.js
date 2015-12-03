'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

/**
 * append CSS_HOOK to head
 * @example
 * {% require $id="news/detail" str="aa" "data-attr1"="another"%}
 */
class RequireTag extends BaseTag {
  constructor() {
    super('require', false);
  }

  render(context, attrs) {
    const locals = Object.assign({}, context.ctx, attrs[0]);
    const file = locals['$id'];
    delete locals['$id'];
    const html = context.resource.include(file, context, locals);
    return this.safe(html);
  }
}

module.exports = RequireTag;
