'use strict';

const Tag = require('../Tag');

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
    super('require', false);
  }

  render(context, attrs) {
    const obj = attrs[0];
    let file;
    let locals;
    // 支持单属性无 $id
    if (typeof obj === 'string') {
      file = obj;
      locals = context.ctx;
    } else {
      locals = Object.assign({}, context.ctx, obj);
      file = locals['$id'];
      delete locals['$id'];
    }
    const renderFn = context.env.render.bind(context.env);
    const html = context.resource.include(file, locals, renderFn);
    return this.safe(html);
  }
}

module.exports = RequireTag;
