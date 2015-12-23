'use strict';

const assert = require('assert');
const Tag = require('nunjucks-tag');

/**
 * collect datalet
 * @example
 * {% datalet test="a1", test2=someVar %}
 */
class DataletTag extends Tag {
  constructor() {
    super('datalet');
    this.end = false;
  }

  render(context, attrs) {
    const resource = context.ctx.__resource;
    const attrObj = attrs[attrs.length - 1];
    assert(typeof attrObj === 'object' && attrObj && attrObj['__keywords'], 'unexpected attr, should use as {% datalet test="a", test2=someVar %}');
    delete attrObj['__keywords'];
    resource.addDatalet(attrObj);
    return '';
  }
}

module.exports = DataletTag;
