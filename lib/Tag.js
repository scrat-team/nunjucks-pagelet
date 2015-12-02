'use strict';

const assert = require('assert');

/**
 * 自定义标签的基类，封装 tag 的通用逻辑。
 * 你可以通过继承此基类来编写 tag
 *
 * @class Tag
 *
 * @example
 * ```js
 *
 * class CustomTag extends Tag {
 *   constructor() {
 *     super('custom');
 *   }
 *
 *   render(context, attrs, fragment) {
 *     //自定义输出HTML的逻辑
 *     return super.render(context, attrs, fragment);
 *   }
 *
 * }
 * ```
 */
class Tag {
  constructor(tagName, isBlock) {
    assert.notEqual(tagName, undefined, 'tagName 不能为空');

    this.tagName = this.outputTag = tagName;
    this.tags = [tagName];
    this.isBlock = isBlock !== false;
  }

  /**
   * 渲染 HTML, 你可以覆盖它来实现自己的渲染逻辑
   * 注意: 该函数执行的时候, 子模板已经被渲染了, 所以才拿到 fragment
   * @member Tag#render
   * @protected
   * @param {Object} context nunjucks的上下文环境, 其中 context.ctx 为 locals , context.env 为 nunjucks 的 env
   * @param {Object} attrs 标签里面解析出来的属性键值对
   * @param {String} fragment 包含的子元素内容
   * @param {Boolean} [noSafe] 是否禁止 HTML 转义
   * @return {String} 生成的 HTML 字符串
   */
  render(context, attrs, fragment, noSafe) {
    const tagName = this.outputTag;
    const attrStr = this._obj2Attrs(attrs);
    const html = `<${tagName}${attrStr ? ' ' + attrStr : ''}>${fragment}</${tagName}>`;
    return noSafe ? html : this.safe(html);
  }

  /**
   * 渲染之前, 一般用于往 context 中添加变量
   * 传递 context 和 attrs
   * @member Tag#beforeRender
   * @protected
   * @param {Object} context nunjucks的上下文环境, 其中 context.ctx 为 locals , context.env 为 nunjucks 的 env
   * @param {Object} attrs 标签里面解析出来的属性键值对
   * @return {Tag} 链式调用
   */
  beforeRender(context, attrs) { // eslint-disable-line no-unused-vars
    assert.notEqual(context, undefined, 'context 不能为空');
    return this;
  }

  /**
   * 渲染之后, 一般用于恢复现场
   * 传递 context 和 attrs
   * @member Tag#afterRender
   * @protected
   * @param {Object} context nunjucks的上下文环境, 其中 context.ctx 为 locals , context.env 为 nunjucks 的 env
   * @param {Object} attrs 标签里面解析出来的属性键值对
   * @return {Tag} 链式调用
   */
  afterRender(context, attrs) { // eslint-disable-line no-unused-vars
    assert.notEqual(context, undefined, 'context 不能为空');
    return this;
  }

  // 提供给 nunjucks 使用的 parse 函数
  parse(parser, nodes) {
    // TODO: 还无法识别 checked test=['a', 'b'] 等场景
    // get the tag token
    let token = parser.nextToken();

    // parse the args and move after the block end. passing true
    // as the second arg is required if there are no parentheses
    let args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(token.value);

    let body;
    if (this.isBlock) {
      // parse the body and possibly the error block, which is optional
      body = parser.parseUntilBlocks('end' + token.value);

      parser.advanceAfterBlockEnd();
    }

    // See above for notes about CallExtension
    return new nodes.CallExtension(this, '_run', args, [body]);
  }

  // 解析参数
  _run() {
    // nunjucks sends our "body" as the last argument
    const args = Array.prototype.slice.call(arguments);
    const context = args.shift();
    const body = args.pop();
    const attrs = args.pop() || {};
    // before hook
    this.beforeRender(context, attrs);
    // render
    const fragment = typeof body === 'function' ? body() : '';
    const html = this.render(context, attrs, fragment);
    // after hook
    this.afterRender(context, attrs);
    return html;
  }

  safe(html) {
    const nunjucks = require('nunjucks');
    return new nunjucks.runtime.SafeString(html);
  }

  /**
   * 把对象转换为HTML的属性  {attr1: 'a', attr2: 'b'} => attr1="a" attr2="b"
   * @param {Object} [obj] 待转换的对象
   * @return {String} 返回HTML属性字符串
   */
  _obj2Attrs(obj) {
    if (!obj) {
      return '';
    }

    return Object.keys(obj).reduce((collect, key) => {
      if (key.indexOf('_') !== 0) {
        collect.push(`${key}="${obj[key] || ''}"`);
      }
      return collect;
    }, []).join(' ');
  }
}

module.exports = Tag;
