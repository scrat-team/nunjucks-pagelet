'use strict';

const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const expect = require('expect.js');
const util = require('./util');

describe('test/index.test.js', function() {
  let mm, pagelet;

  before(function() {
    mm = util('general');
    pagelet = mm.engine;
  });

  after(util.restore);

  it('should exports', function() {
    expect(pagelet.Tag).to.not.be(undefined);
    expect(pagelet.Resource).to.not.be(undefined);
    expect(pagelet.manifest).to.eql(pagelet.Resource.manifest);
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
    expect(html.replace(/^\s*/gm, '')).to.equal(str.replace(/^\s*/gm, ''));
  });
});
