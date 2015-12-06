'use strict';

const path = require('path');
const assert = require('assert');
const delegate = require('delegates');

class Engine {
  constructor() {
    this.helper = require('./lib/helper');
    this.Tag = require('./lib/Tag');
    this.Resource = require('./lib/Resource');

    this.TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'datalet', 'ATF'];
    this.tags = this.TagNames.map((tagName) => {
      let Tag = require('./lib/tags/' + tagName);
      return new Tag();
    });

    delegate(this, 'Resource').getter('manifest');
  }

  /**
   * 初始化入口
   * @method Engine#register
   * @param {Object} opt 配置对象
   * @param {Object} opt.nunjucks nunjucks对象, 用于扩展
   * @param {Object} opt.env nunjucks.Environment 实例, 用于扩展
   * @param {String|Object|Function} opt.manifest 资源映射表, 可以是文件路径/映射表对象/读取函数
   * @param {String} opt.root 静态文件的根目录
   * @param {Boolean} [opt.cache] 是否缓存资源映射表
   * @param {Object} [opt.helper] 辅助方法, 覆盖helper类的 safe , escape,  SafeString, comboURI 等
   * @param {Object} [opt.logger] 日志对象
   * @return {void}
   */
  register(opt) {
    const baseDir = opt.root || process.cwd();
    const env = opt.env;
    const nunjucks = opt.nunjucks;

    assert.notEqual(nunjucks, undefined, '必须提供 nunjucks 参数');
    assert.notEqual(env, undefined, '必须提供 env 参数, nunjucks.Environment 的实例');

    opt.helper = Object.assign({
      isSafeString: function(str) {
        return str instanceof nunjucks.runtime.SafeString;
      }
    }, opt.helper);

    this.Resource.configure(Object.assign({
      root: baseDir,
      manifest: path.join(baseDir, 'map.json')
    }, opt));

    this.tags.forEach((tag) => {
      env.addExtension(tag.tagName, tag);
    });
  }
}

module.exports = new Engine();