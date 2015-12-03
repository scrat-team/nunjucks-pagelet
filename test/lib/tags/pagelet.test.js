'use strict';

const expect = require('expect.js');
const util = require('../../util');

describe('test/lib/tags/pagelet.test.js', function() {
  let app, env;

  // const locals = {title: 'this is title', href: 'http://t.cn', deep: {foo: 'foo'}, override: {foo: 'override'}};

  before(function() {
    app = util('general');
    env = app.env;
  });

  after(util.restore);

  it('should render pagelet tag attribute ', function() {
    let tpl = '{% html %}{% pagelet $id="main" %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><div data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id="main" %}hello{% pagelet $id="sub" %}world{% endpagelet %}{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><div data-pagelet="main">hello<div data-pagelet="main.sub">world</div></div></html>');

    tpl = '{% html %}{% pagelet $id=main %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {main: 'main'})).to.equal('<html><div data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id="main", class="a" %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><div class="a" data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id=\'main\', class=["a", b, c.e] %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {b: 'b', c: {e: 'c.e'}})).to.equal('<html><div class="a b c.e" data-pagelet="main">hello</div></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag="ul", class=\'a\' %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><ul class="a" data-pagelet="main">hello</ul></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag="ul", class="a" %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><ul class="a" data-pagelet="main">hello</ul></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag="none", class="a" %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><!-- pagelet[main] start -->hello<!-- pagelet[main] end --></html>');

    tpl = '{% html %}{% pagelet $id="main", $tag=\'none\', class="a" %}hello{% endpagelet %}{% endhtml %}';
    expect(env.renderString(tpl, {})).to.equal('<html><!-- pagelet[main] start -->hello<!-- pagelet[main] end --></html>');
  });
});

