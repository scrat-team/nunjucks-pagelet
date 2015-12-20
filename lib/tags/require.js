'use strict';

const assert = require('assert');
const Tag = require('nunjucks-tag');

/**
 * require resource
 * 参数:
 *  - $id {String} 必须, 需依赖的组件ID
 *  - 其他变量, 作为子组件的局部变量, 会在子scope里覆盖上层变量
 * @example
 * {% require "news/detail" %}
 * {% require $id="news/detail" str="aa" "data-attr1"="another"%}
 */
class RequireTag extends Tag {
  constructor() {
    super('require');
    this.end = false;
  }

  render(context, attrs) {
    const obj = attrs[0];
    let file;
    let locals;
    // 支持单属性无 $id
    if (typeof obj === 'string') {
      file = obj;
      locals = context.ctx;
    } else if (obj['$id']) {
      locals = Object.assign({}, context.ctx, obj);
      file = locals['$id'];
      delete locals['$id'];
    } else {
      throw 'require tag need $id attr';
    }
    assert.ok(file, 'require 格式错误, 示例: {% require "/path/to/sth"}');
    const renderFn = context.env.render.bind(context.env);
    return context.resource.include(file, locals, renderFn);
  }
}

module.exports = RequireTag;
