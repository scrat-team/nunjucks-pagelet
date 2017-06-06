'use strict';

const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const util = require('./util');

describe('test/index.test.js', function() {
  let mm, pagelet;

  before(function() {
    mm = util('general');
    pagelet = mm.engine;
  });

  after(util.restore);

  it('should exports', function() {
    assert(pagelet.Tag !== undefined);
    assert(pagelet.Resource !== undefined);
    assert.deepEqual(pagelet.manifest, pagelet.Resource.manifest);
  });

  it('should use with nunjucks', function() {
    // 初始化资源
    const baseDir = path.join(process.cwd(), './test/fixtures/general');
    const env = nunjucks.configure(baseDir);
    pagelet.configure({
      root: baseDir,
      manifest: path.join(baseDir, 'map.json')
    });

    pagelet.register(env);

    const locals = JSON.parse(fs.readFileSync(path.join(baseDir, 'data.json'), 'utf8'));
    const str = fs.readFileSync(path.join(baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    assert(html.replace(/^\s*/gm, '') === str.replace(/^\s*/gm, ''));
  });
});
