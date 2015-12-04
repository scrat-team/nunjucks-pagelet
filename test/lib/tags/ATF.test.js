'use strict';

const expect = require('expect.js');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');
const util = require('../../util');

describe('test/lib/tags/ATF.test.js', function() {
  let mm, env, framework, spy, locals;

  before(function() {
    mm = util('ATF');
    env = mm.env;
    framework = mm.framework;
    spy = sinon.spy(framework.Resource.prototype, 'useATF');
    locals = require(path.join(mm.baseDir, 'data.json'));
  });

  after(util.restore);

  it('should call ATF', function() {
    const tpl = '{% html %}before{% ATF %}after{% endhtml %}';
    const html = env.renderString(tpl, {});
    expect(html).to.equal('<html>beforeafter</html>');
    sinon.assert.called(spy);
    spy.reset();
  });

  it('should render ATF content', function() {
    const str = fs.readFileSync(path.join(mm.baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    expect(html.replace(/^\s*/gm, '')).to.equal(str.replace(/^\s*/gm, ''));
  });

  it('should render ATF combo content', function() {
    mm = util('ATF_combo');
    env = mm.env;
    framework = mm.framework;
    locals = require(path.join(mm.baseDir, 'data.json'));
    const str = fs.readFileSync(path.join(mm.baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    expect(html.replace(/^\s*/gm, '')).to.equal(str.replace(/^\s*/gm, ''));
  });

  it('should render ATF combo+domain content', function() {
    mm = util('ATF_combo_domain');
    env = mm.env;
    framework = mm.framework;
    locals = require(path.join(mm.baseDir, 'data.json'));
    const str = fs.readFileSync(path.join(mm.baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    expect(html.replace(/^\s*/gm, '')).to.equal(str.replace(/^\s*/gm, ''));
  });
});
