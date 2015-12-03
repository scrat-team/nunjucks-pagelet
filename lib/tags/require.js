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
    super('require');
  }

  render(context, attrs, body) {
    // return super.render(context, attrs, [fragment, Resource.CSS_HOOK].join('\n'));
  }
}

module.exports = RequireTag;
