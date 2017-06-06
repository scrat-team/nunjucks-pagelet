'use strict';

const assert = require('assert');
const util = require('../../util');

describe('test/lib/tags/require.test.js', function() {
  let mm,
    env;

  const locals = { title: 'this is title', href: 'http://scrat.io', deep: { foo: 'foo' }, override: { foo: 'override' } };

  before(function() {
    mm = util('general');
    env = mm.env;
  });

  after(util.restore);

  it('should render require tag ', function() {
    const tpl = '{% html %}{% require $id="foo", title="this is title", href=href, deep=override %}{{deep.foo}}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    assert(html === '<!DOCTYPE html>\n<html><h1>this is title</h1>\n<a href="http://scrat.io">scrat</a>\n<span>override</span>foo</html>');
  });

  it('should render require tag with single url ', function() {
    const tpl = '{% html %}{% require "foo" %}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    assert(html === '<!DOCTYPE html>\n<html><h1>this is title</h1>\n<a href="http://scrat.io">scrat</a>\n<span>foo</span></html>');
  });

  it('should isolate scope', function() {
    const tpl = '{% html %}{% require $id="foo" $scope=true href=href %}{% endhtml %}';
    const html = env.renderString(tpl, locals);
    assert(html === '<!DOCTYPE html>\n<html><h1></h1>\n<a href="http://scrat.io">scrat</a>\n<span></span></html>');
  });

  it('should provide $id attr', function() {
    assert.throws(() => mm.env.renderString('{% require %}', mm.locals), /require tag need \$id attr/);
    assert.throws(() => mm.env.renderString('{% require a="b" %}', mm.locals), /require tag need \$id attr/);
  });
});

