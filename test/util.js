'use strict';

const path = require('path');
const fs = require('fs');
const assert = require('assert');
const nunjucks = require('nunjucks');
const pagelet = require('../');
const symbol = require('../lib/symbol');

module.exports = function(targetDir, opt) {
  const baseDir = path.join(process.cwd(), './test/fixtures/', targetDir);
  const env = nunjucks.configure(baseDir, {autoescape: true});
  const manifestFile = path.join(baseDir, 'map.json');
  const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
  const locals = {
    attr1: 'some attr',
    attr2: 'a2',
    content: 'this is content',
    bool: true,
    deep: {
      foo: 'foo',
    },
    clz: 'test',
    foo: {
      bar: 'bar',
    },
    href: 'http://scrat.io',
    html: '<img src=>',
    jsonStr: JSON.stringify({a: 'b'}),
  };

  pagelet.configure(Object.assign({
    root: baseDir,
    manifest: manifestFile,
  }, opt));

  pagelet.tags.forEach((tag) => {
    env.addExtension(tag.tagName, tag);
  });

  function mountTag(Tags) {
    Tags = Array.prototype.slice.call(arguments);
    Tags.forEach(Tag => {
      let tag = new Tag();
      env.addExtension(tag.tagName, tag);
    });
  }

  function mockContext(obj) {
    class Mock extends pagelet.Tag {
      constructor() {
        super('mock');
      }
      render(context, attrs, body) {
        if (typeof obj === 'function') {
          obj(context);
        } else {
          context.ctx[symbol.RESOURCE] = Object.assign({}, context.ctx[symbol.RESOURCE], obj);
          return this.safe(body());
        }
      }
    }
    mountTag(Mock);
    return obj;
  }

  function equal(tpl, html, data) {
    // 去掉每行前面的空格
    assert(env.renderString(tpl, data || locals).replace(/^\s*/gm, '') === html.replace(/^\s*/gm, ''));
  }

  return {
    baseDir: baseDir,
    manifestFile: manifestFile,
    manifestData: manifestData,
    env: env,
    engine: pagelet,
    locals: locals,
    equal: equal,
    mountTag: mountTag,
    mockContext: mockContext,
  };
};

module.exports.restore = function() {

};
