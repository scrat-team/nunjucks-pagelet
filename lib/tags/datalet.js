'use strict';

const Tag = require('../Tag');

/**
 * collect datalet
 * @example
 * {% datalet test="a1", test2=someVar %}
 */
class DataletTag extends Tag {
  constructor() {
    super('datalet', false);
  }

  render(context, attrs) {
    const attrObj = attrs[0];
    delete attrObj['__keywords'];
    context.resource.addDatalet(attrObj);
    return '';
  }
}

module.exports = DataletTag;
