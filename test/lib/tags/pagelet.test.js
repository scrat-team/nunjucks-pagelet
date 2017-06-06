'use strict';

const assert = require('assert');
const util = require('../../util');

describe('test/lib/tags/pagelet.test.js', function() {
  let mm,
    env,
    tpl;

  before(function() {
    mm = util('general');
    env = mm.env;
  });

  after(util.restore);

  it('should render pagelet tag attribute ', function() {
    tpl = '{% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><div data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id="main" %}hello{% pagelet $id="sub" %}world{% endpagelet %}{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><div data-pagelet="main">hello<div data-pagelet="main.sub">world</div></div></html>');

    tpl = '{% html %}{% pagelet $id=main %}hello{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { main: 'main' }) === '<!DOCTYPE html>\n<html><div data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id="main", class="a" %}hello{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><div class="a" data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id=\'main\', class=["a", b, c.e] | join(" ") %}hello{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { b: 'b', c: { e: 'c.e' } }) === '<!DOCTYPE html>\n<html><div class="a b c.e" data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag="ul", class=\'a\' %}hello{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><ul class="a" data-pagelet="main">hello</ul></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag="ul", class="a" %}hello{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><ul class="a" data-pagelet="main">hello</ul></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag="none", class="a" %}hello{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><!-- pagelet[main] start -->hello<!-- pagelet[main] end --></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag=\'none\', class="a" %}hello{% endpagelet %}{% endhtml %}';
    mm.equal(tpl, '<!DOCTYPE html>\n<html><!-- pagelet[main] start -->hello<!-- pagelet[main] end --></html>');
  });

  it('use pagelet', function() {
    tpl = '{% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'main' }) === '{"html":{"main":"hello"},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'x' }) === '{"html":{"x":""},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="main" %}hello{% pagelet $id="foo" %}world{% endpagelet %}ok{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'main' }) === '{"html":{"main":"hello<div data-pagelet=\\"main.foo\\">world</div>ok"},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="main" %}hello{% pagelet $id="foo" %}world{% endpagelet %}ok{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'main.foo' }) === '{"html":{"main.foo":"world"},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="foo" %}foo{% endpagelet %}{% pagelet $id="bar" %}bar{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'foo,bar' }) === '{"html":{"foo":"foo","bar":"bar"},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="foo" %}foo{% endpagelet %}{% pagelet $id="bar" %}bar{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'foo,   bar' }) === '{"html":{"foo":"foo","bar":"bar"},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="foo" %}foo{% endpagelet %}{% pagelet $id="bar" %}bar{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'foo,x' }) === '{"html":{"foo":"foo","x":""},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');
  });

  it('scripts', function() {
    tpl = '{% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% script %}world{% endscript %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'main' }) === '{"html":{"main":"hello"},"data":{},"js":[],"css":[],"title":"","script":[],"hash":"0000000"}');

    tpl = '{% html %}{% pagelet $id="main" %}hello{% script %}world{% endscript %}{% endpagelet %}{% endhtml %}';
    assert(env.renderString(tpl, { _pagelets: 'main' }) === '{"html":{"main":"hello"},"data":{},"js":[],"css":[],"title":"","script":["world"],"hash":"0000000"}');
  });
});

