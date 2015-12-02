'use strict';

/**
 * 自定义标签的基类，封装 tag 的通用逻辑。
 * 你可以通过继承此基类来编写 tag
 *
 * @class BaseTag
 *
 * @example
 * ```js
 *
 * class CustomTag extends BaseTag {
 *   constructor() {
 *     super('custom');
 *   }
 *
 *   render(context, attrs, content) {
 *     //自定义输出HTML的逻辑
 *     return super.render(context, attrs, content);
 *   }
 *
 * }
 * ```
 */
class BaseTag {
  constructor(tagName, isBlock) {
    this.tagName = this.outputTag = tagName;
    this.tags = [tagName];
    this.isBlock = isBlock !== false;
  }

  /**
   * 渲染 HTML, 你可以覆盖它来实现自己的渲染逻辑
   * @member BaseTag#render
   * @protected
   * @param {Object} context nunjucks的上下文环境, 其中 context.ctx 为 locals , context.env 为 nunjucks 的 env
   * @param {Object} attrs 标签里面解析出来的属性键值对
   * @param {String} content 包含的子内容
   * @return {String} 生成的 HTML 字符串
   */
  render(context, attrs, content) {
    const tagName = this.outputTag;
    const attrStr = this._obj2Attrs(attrs);
    const html = `<${tagName}${attrStr ? ' ' + attrStr : ''}>${content}</${tagName}>`;
    return this.safe(html);
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
    const content = typeof body === 'function' ? body() : '';
    return this.render(context, attrs, content);
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

module.exports = BaseTag;
