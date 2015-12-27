'use strict';

const Tag = require('nunjucks-tag');
const symbol = require('../symbol');

/**
 * require resource
 * 参数:
 *  - $id {String} 必须, 需依赖的组件ID
 *  - $scope {Boolean} 可选, 隔离上层变量, 仅在属性上设置的才传递进去
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
    const resource = context.ctx[symbol.RESOURCE];
    const obj = attrs[attrs.length - 1];
    let file;
    let locals;
    // 支持单属性无 $id
    if (typeof obj === 'string') {
      file = obj;
      locals = context.ctx;
    } else if (obj && obj['$id']) {
      file = obj['$id'];
      delete obj['$id'];
      // 隔离作用域
      if (obj['$scope']) {
        delete obj['$scope'];
        locals = obj;
        locals[symbol.RESOURCE] = resource;
      } else {
        locals = Object.assign({}, context.ctx, obj);
      }
    } else {
      throw 'require tag need $id attr, should use as {% require $id="/path/to/sth"}';
    }
    const renderFn = context.env.render.bind(context.env);
    return resource.include(file, locals, renderFn);
  }
}

module.exports = RequireTag;
