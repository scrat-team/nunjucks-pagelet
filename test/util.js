'use strict';

const path = require('path');
const fs = require('fs');
const expect = require('expect.js');
const nunjucks = require('nunjucks');
const engine = require('../');

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
      foo: 'foo'
    },
    clz: 'test',
    foo: {
      bar: 'bar'
    },
    href: 'http://scrat.io',
    html: '<img src=>',
    jsonStr: JSON.stringify({a: 'b'})
  };

  engine.register(Object.assign({
    root: baseDir,
    manifest: manifestFile,
    nunjucks: nunjucks,
    env: env
  }, opt));

  function mountTag(Tags) {
    Tags = Array.prototype.slice.call(arguments);
    Tags.forEach((Tag) => {
      let tag = new Tag();
      env.addExtension(tag.tagName, tag);
    });
  }

  function mockContext(obj) {
    class Mock extends engine.Tag {
      constructor() {
        super('mock');
      }
      render(context, attrs, body) {
        if (typeof obj === 'function') {
          obj(context);
        } else {
          context.resource = Object.assign({}, context.resource, obj);
          return this.safe(body());
        }
      }
    }
    mountTag(Mock);
    return obj;
  }

  function equal(tpl, html, data) {
    // 去掉每行前面的空格
    expect(env.renderString(tpl, data || locals).replace(/^\s*/gm, '')).to.equal(html.replace(/^\s*/gm, ''));
  }

  return {
    baseDir: baseDir,
    manifestFile: manifestFile,
    manifestData: manifestData,
    env: env,
    engine: engine,
    locals: locals,
    equal: equal,
    mountTag: mountTag,
    mockContext: mockContext
  };
};

module.exports.restore = function() {

};