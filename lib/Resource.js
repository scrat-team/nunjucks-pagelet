'use strict';

const fs = require('fs');
const assert = require('assert');

const PAGELET_NO_MATCH = 0;
const PAGELET_PATH_MATCH = 1;
const PAGELET_ABS_MATCH = 2;
const PAGELET_IN_ABS_MATCH = 3;

let logger = console;
let cache = {};

class Resource {
  constructor() {
    // 在本生命周期里面缓存住
    this.manifest = Resource.manifest;
    assert.notEqual(this.manifest, undefined, '必须提供`资源映射表`, 需执行 Resource.configuare({path: "/path/to/map.json"})');

    this.domain = '';
    this._collect = {};
    this._collectATF = {};
    this._script = [];
    this._loaded = {};
    this._pageletsStack = [];
    this._pagelets = {};
    this._datalets = {};
    this._isPageletOpen = false;
    this._usePagelet = false;
    this._title = '';
    this._useATF = false;
  }

  destroy() {
    this.manifest = null;
    this._collect = null;
    this._collectATF = null;
    this._script = null;
    this._loaded = null;
    this._pageletsStack = null;
    this._pagelets = null;
    this._datalets = null;
    this._title = '';
    this._useATF = false;
  }

  /**
   * 收集 script 代码
   * @param {String} code 散落的 JS 代码
   * @return {void}
   */
  addScript(code) {
    if (this._usePagelet && !this._isPageletOpen) return;
    this._script.push(code);
  }

  /**
   * 处理 uri
   * @param {String} uri 需处理的URL
   * @return {String} 转换后的URL
   */
  comboURI(uri) {
    return uri.replace(/^\/public\//g, '');
  }

  /**
   * 根据 id 获取资源
   * @param {String} id 资源ID
   * @return {Object} 资源信息
   */
  getResById(id) {
    if (this.manifest) {
      if (this.manifest.res) {
        if (this.manifest.res.hasOwnProperty(id)) {
          return this.manifest.res[id];
        } else {
          // TODO
        }
      } else {
        logger.error('missing resource map');
      }
    } else {
      logger.error('missing resource map');
    }
  }

  setDomain(url) {
    if (typeof url === 'string' && url.length) {
      this.domain = url.replace(/\/$/, '');
    }
  }

  normalize(id, ext) {
    ext = ext || '';
    if (id.indexOf('.') === -1) {
      id += '/' + id.substring(id.lastIndexOf('/') + 1) + ext;
    }
    return id.replace(/^(?!(views|components)\/)/, 'components/');
  }

  /**
   * 收集资源
   * @param {String} id 资源ID
   * @return {Boolean} // TODO: 含义?
   */
  require(id) {
    if (this._usePagelet && !this._isPageletOpen) return true;
    let rId = this.normalize(id, '.js');
    if (this._loaded.hasOwnProperty(rId)) return true;
    let res = this.getResById(rId);
    if (!res) {
      rId = this.normalize(id, '.css');
      if (this._loaded.hasOwnProperty(rId)) return true;
      res = this.getResById(rId);
    }
    if (res) {
      this._loaded[rId] = true;
      if (res.deps && res.deps.length) {
        res.deps.forEach(this.require.bind(this));
      }
      let _collect;
      if (this._useATF && res.type === 'css') {
        _collect = this._collectATF;
      } else {
        _collect = this._collect;
      }
      if (!_collect[res.type]) {
        _collect[res.type] = [];
      }
      _collect[res.type].push(res.uri);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 加载组件
   * @param {String} file 引入的文件路径
   * @param {Object} ctx 数据上下文
   * @return {String} 引入的文件的 HTML
   */
  include(file, ctx) {
    let id = file;
    let html = '';
    let got = false;
    if (file.indexOf('.') === -1) {
      file = this.normalize(file, '.tpl');
      const res = this.getResById(file);
      if (res) {
        got = true;
        id = file;

        // TODO: compile
        ctx;
        // var opt = {};
        // if (root) {
        //  opt.resolveFrom = root + '/index.tpl';
        // }
        // html = swig.compileFile(res.uri, opt)(ctx);
      }
    }
    got = this.require(id) || got;
    if (!got) {
      logger.error('unable to load resource [' + id + ']');
    }
    return html;
  }

  /**
   * 根据 id 获取资源的URI
   * @param {String} id 资源ID
   * @return {String} 资源URI
   */
  uri(id) {
    const res = this.getResById(id);
    if (res) {
      return res.uri;
    }
  }

  genComboURI(collect) {
    const url = this.getComboPattern();
    let combo = '';
    collect.forEach((uri) => {
      combo += ',' + this.comboURI(uri);
    });
    return url.replace('%s', combo.substring(1));
  }

  getComboPattern() {
    return this.domain + (this.manifest.comboPattern || '/co??%s');
  }

  renderJs() {
    let html = '';
    let used = [];
    if (this._collect.js && this._collect.js.length) {
      const left = '<script src="';
      const right = '"></script>\n';
      if (this.manifest.combo) {
        html += left + this.genComboURI(this._collect.js) + right;
      } else {
        html += join(this._collect.js, left, right);
      }
      used = this._collect.js;
    }
    if (this._collect.css && this._collect.css.length) {
      used = used.concat(this._collect.css);
    }
    if (this._collectATF.css && this._collectATF.css.length) {
      used = used.concat(this._collectATF.css);
    }
    if (this.manifest.combo && used.length) {
      for (let i = 0, len = used.length; i < len; i++) {
        used[i] = this.comboURI(used[i]);
      }
    }
    const args = [
      this.manifest.combo ? 1 : 0,
      '"' + this.getComboPattern() + '"',
      '["' + used.join('","') + '"]',
      '"' + (this.manifest.hash ? this.manifest.hash : '0000000') + '"'
    ];
    const code = 'pagelet.init(' + args.join(',') + ');';
    html += '<script>' + code + '</script>\n';
    if (this._script.length) {
      if (this.manifest.combo) {
        html += '<script>' + join(this._script, '!function(){', '}();') + '</script>\n';
      } else {
        html += join(this._script, '<script>' + '!function(){', '}();</script>\n');
      }
    }
    return html;
  }

  genLinkTag(collect, defer) {
    let html = '';
    if (collect && collect.length) {
      const left = '<link rel="stylesheet" href="';
      const right = '"' + (defer ? ' data-defer' : '') + '>\n';
      if (this.manifest.combo) {
        html += left + this.genComboURI(collect) + right;
      } else {
        html += join(collect, left, right);
      }
    }
    return html;
  }

  renderCss() {
    return this.genLinkTag(this._collect.css);
  }

  renderATFCss() {
    let html = '';
    if (this._collect.css && this._collect.css.length) {
      this._collect.css.forEach(this.manifest.combo ? function(uri) {
        let content = '';
        if (cache.hasOwnProperty(uri)) {
          content = cache[uri];
        } else {
          let path;
          if (uri[0] === '/') {
            path = Resource.root + uri;
          } else {
            path = Resource.root + '/' + uri;
          }
          try {
            content = fs.readFileSync(path);
            cache[uri] = content;
          } catch (e) {
            logger.error('unable inline file [' + path + ']');
          }
        }
        html += content + '\n';
      } : function(uri) {
        html += '<link rel="stylesheet" href="' + uri + '">\n';
      });
      if (this.manifest.combo) {
        html = '<style>' + html + '</style>';
      }
    }
    return html;
  }

  renderBTFCss() {
    let html = this.genLinkTag(this._collectATF.css, true);
    if (html) {
      html += '<script>(function(d,l,h,i,n,e){' +
        'l=d.getElementsByTagName("link");' +
        'h=d.head||d.getElementsByTagName("head")[0];' +
        'for(i=0,n=l.length;i<n;i++){' +
        'e=l[i];' +
        'if(e.hasAttribute("data-defer"))' +
        'h.appendChild(e);' +
        '}' +
        '})(document);</script>';
    }
    return html;
  }

  render(out) {
    if (this._usePagelet) {
      let js = this._collect.js || [];
      let css = this._collect.css || [];
      if (this.manifest.combo && js.length) {
        js.forEach((uri, index) => {
          js[index] = this.comboURI(uri);
        });
      }
      if (this.manifest.combo && css.length) {
        css.forEach((uri, index) => {
          css[index] = this.comboURI(uri);
        });
      }
      out = JSON.stringify({
        html: this._pagelets,
        data: this._datalets,
        js: js,
        css: css,
        title: this._title,
        script: this._script,
        hash: this.manifest.hash || '0000000'
      });
    } else {
      if (this._useATF) {
        out = replace(out, Resource.CSS_HOOK, this.renderATFCss());
        out = replace(out, Resource.ATF_HOOK, this.renderBTFCss());
      } else {
        out = replace(out, Resource.CSS_HOOK, this.renderCss());
      }
      out = replace(out, Resource.JS_HOOK, this.renderJs(), true);
    }
    this.destroy();
    return out;
  }

  usePagelet(ids) {
    if (ids) {
      this._usePagelet = true;
      ids.split(/\s*,\s*/).forEach((id) => {
        this._pagelets[id] = '';
      });
    }
  }

  pageletId(id) {
    let arr = [];
    this._pageletsStack.forEach((item) => {
      arr.push(item.id);
    });
    arr.push(id);
    return arr.join('.');
  }

  pageletCheck(id) {
    for (let path in this._pagelets) {
      if (id === path) {
        return PAGELET_ABS_MATCH;
      } else if (path.indexOf(id + '.') === 0) {
        return PAGELET_PATH_MATCH;
      }
    }
    return PAGELET_NO_MATCH;
  }

  pageletStart(id) {
    const fullId = this.pageletId(id);
    let ret = PAGELET_NO_MATCH;
    let stack = this._pageletsStack;
    if (this._usePagelet) {
      const parent = stack[stack.length - 1];
      if (parent && (parent.state === PAGELET_ABS_MATCH || parent.state === PAGELET_IN_ABS_MATCH)) {
        ret = PAGELET_IN_ABS_MATCH;
      } else {
        ret = this.pageletCheck(fullId);
      }
    } else {
      ret = PAGELET_IN_ABS_MATCH;
    }
    if (ret) {
      if (ret === PAGELET_ABS_MATCH) {
        this._isPageletOpen = true;
      }
      this._pageletsStack.push({
        id: id,
        fullId: fullId,
        state: ret
      });
    }
    return ret;
  }

  pageletEnd(html) {
    const last = this._pageletsStack.pop();
    if (last.state === PAGELET_ABS_MATCH) {
      this._pagelets[last.fullId] = html;
      this._isPageletOpen = false;
    }
    return html;
  }

  pageletTitle(title) {
    if (this._usePagelet) {
      this._title = title;
    }
    return title;
  }

  useATF() {
    let html = '';
    if (!this._usePagelet) {
      this._useATF = true;
      html = Resource.ATF_HOOK;
    }
    return html;
  }

}

/**
 * JS 占位符
 */
Resource.JS_HOOK = '<!--PAGELET_JS_HOOK-->';

/**
 * CSS 占位符
 */
Resource.CSS_HOOK = '<!--PAGELET_CSS_HOOK-->';

/**
 * 首屏占位符
 */
Resource.ATF_HOOK = '<!--PAGELET_ATF_HOOK-->';

/**
 * 配置
 * @param {Object} opt 配置对象
 * @param {String} opt.file 资源映射表的文件路径
 * @param {String} [opt.root] 静态文件的根目录, 默认为 process.cwd()
 * @param {Boolean} [opt.cache] 是否缓存资源映射表
 * @param {Object} [opt.logger] 日志对象
 * @return {void}
 */
Resource.configure = function configure(opt) {
  const file = opt.file;
  const cache = opt.cache;
  assert.notEqual(file, undefined, '必须提供`资源映射表`的文件路径');

  logger = opt.logger || console;
  Resource.root = opt.root || process.cwd();

  if (Resource.hasOwnProperty('manifest')) {
    logger.warn('Resource.manifest exist, configure multi time?');
  }

  let manifest;
  Object.defineProperty(Resource, 'manifest', {
    configurable: true,
    get: function() {
      if (!cache || !manifest) {
        manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
      }
      return manifest;
    }
  });
};

Resource.reset = function() {
  delete Resource.root;
  delete Resource.manifest;
};

module.exports = Resource;

// 字符串替换
function replace(str, from, to, b2f) {
  if (b2f) {
    const p = str.lastIndexOf(from);
    if (p !== -1) {
      str = str.substring(0, p) + to + str.substring(p + from.length);
    }
  } else {
    str = str.replace(from, to);
  }
  return str;
}

// 字符串拼接
function join(arr, left, right, split) {
  left = left || '';
  right = right || '';
  if (typeof split === 'string') {
    return left + arr.join(split) + right;
  } else {
    return left + arr.join(right + left) + right;
  }
}
