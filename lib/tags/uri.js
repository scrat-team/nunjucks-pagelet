'use strict';

const assert = require('assert');
const Tag = require('../Tag');

/**
 * 转换资源地址为部署地址
 * @example
 * {% uri "/test.js" %}
 * {% uri $id="/test.js" %}
 */
class UriTag extends Tag {
  constructor() {
    super('uri', false);
  }

  render(context, attrs) {
    let url = attrs[0];
    if (typeof url === 'object') {
      url = url['$id'];
    }
    assert.equal(typeof url, 'string', 'uri 格式错误, 示例: {% uri "/path/to/sth"}');
    return context.resource.uri(url);
  }
}

module.exports = UriTag;
