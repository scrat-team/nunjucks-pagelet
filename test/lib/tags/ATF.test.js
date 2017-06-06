'use strict';

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const sinon = require('sinon');
const util = require('../../util');

describe('test/lib/tags/ATF.test.js', function() {
  let mm,
    env,
    engine,
    spy,
    locals;

  before(function() {
    mm = util('ATF');
    env = mm.env;
    engine = mm.engine;
    spy = sinon.spy(engine.Resource.prototype, 'useATF');
    locals = require(path.join(mm.baseDir, 'data.json'));
  });

  after(util.restore);

  it('should call ATF', function() {
    const tpl = '{% html %}before{% ATF %}after{% endhtml %}';
    const html = env.renderString(tpl, {});
    assert(html === '<!DOCTYPE html>\n<html>beforeafter</html>');
    sinon.assert.called(spy);
    spy.reset();
  });

  it('should render ATF content', function() {
    const str = fs.readFileSync(path.join(mm.baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    assert(html.replace(/^\s*/gm, '') === str.replace(/^\s*/gm, ''));
  });

  it('should render ATF combo content', function() {
    mm = util('ATF_combo');
    env = mm.env;
    engine = mm.engine;
    locals = require(path.join(mm.baseDir, 'data.json'));
    const str = fs.readFileSync(path.join(mm.baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    assert(html.replace(/^\s*/gm, '') === str.replace(/^\s*/gm, ''));
  });

  it('should render ATF combo+domain content', function() {
    mm = util('ATF_combo_domain');
    env = mm.env;
    engine = mm.engine;
    locals = require(path.join(mm.baseDir, 'data.json'));
    const str = fs.readFileSync(path.join(mm.baseDir, 'expect.html'), 'utf8');
    const html = env.render('test.tpl', locals);
    // 去掉每行前面的空格
    assert(html.replace(/^\s*/gm, '') === str.replace(/^\s*/gm, ''));
  });
});
