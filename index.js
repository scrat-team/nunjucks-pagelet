'use strict';

const path = require('path');
const assert = require('assert');
const delegate = require('delegates');

class Pagelet {
  constructor() {
    this.Tag = require('nunjucks-tag');
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
   * @param {Object} opt.env nunjucks.Environment 实例, 用于扩展
   * @param {String|Object|Function} opt.manifest 资源映射表, 可以是文件路径/映射表对象/读取函数
   * @param {String} opt.root 静态文件的根目录
   * @param {Boolean} [opt.cache] 是否缓存资源映射表
   * @param {Object} [opt.logger] 日志对象
   * @return {void}
   */
  register(opt) {
    /* istanbul ignore next */
    const baseDir = opt.root || process.cwd();
    const env = opt.env;

    assert.notEqual(env, undefined, '必须提供 env 参数, nunjucks.Environment 的实例');

    this.Resource.configure(Object.assign({
      root: baseDir,
      manifest: path.join(baseDir, 'map.json')
    }, opt));

    this.tags.forEach((tag) => {
      env.addExtension(tag.tagName, tag);
    });
  }
}

module.exports = new Pagelet();