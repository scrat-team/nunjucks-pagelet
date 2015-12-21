'use strict';

const delegate = require('delegates');
const Tag = require('nunjucks-tag');
const Resource = require('./lib/Resource');

const TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'datalet', 'ATF'];
const tags = TagNames.map((tagName) => {
  let Tag = require('./lib/tags/' + tagName);
  return new Tag();
});

exports.Tag = Tag;
exports.Resource = Resource;
exports.TagNames = TagNames;
exports.tags = tags;

exports.register = function(env) {
  this.tags.forEach((tag) => {
    env.addExtension(tag.tagName, tag);
  });
};

delegate(exports, 'Resource').getter('manifest');

/**
 * 初始化 pagelet tags
 * @method Pagelet#configure
 * @param {Object} opt 配置对象
 * @param {String|Object|Function} opt.manifest 资源映射表, 可以是文件路径/映射表对象/读取函数
 * @param {String} opt.root 静态文件的根目录
 * @param {Boolean} [opt.cache] 是否缓存资源映射表
 * @param {Object} [opt.logger] 日志对象
 * @return {void}
 */
delegate(exports, 'Resource').method('configure');
