'use strict';

const assert = require('assert');
const Tag = require('nunjucks-tag');
const symbol = require('../symbol');

/**
 * 转换资源地址为部署地址
 * @example
 * {% uri "/test.js" %}
 * {% uri $id="/test.js" %}
 */
class UriTag extends Tag {
  constructor() {
    super('uri');
    this.end = false;
  }

  render(context, attrs) {
    const resource = context.ctx[symbol.RESOURCE];
    let url = attrs[attrs.length - 1];
    if (typeof url === 'object') {
      url = url.$id;
    }
    assert.equal(typeof url, 'string', 'uri tag need $id attr, should use as {% uri "/path/to/sth"}');
    return resource.uri(url);
  }
}

module.exports = UriTag;
