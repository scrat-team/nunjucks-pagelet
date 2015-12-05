'use strict';

const expect = require('expect.js');
// const sinon = require('sinon');

const util = require('../util');

describe('test/lib/parseAttributes.test.js', function() {
  let app, env, engine, Tag;

  before(function() {
    app = util('general');
    env = app.env;
    engine = app.engine;
    Tag = engine.Tag;
  });

  after(util.restore);

  const locals = {
    attr1: 'some attr',
    attr2: 'a2',
    content: 'this is content',
    bool: true,
    deep: {foo: 'foo'},
    clz: 'test',
    foo: {
      bar: 'bar'
    },
    html: '<img src=>',
    jsonStr: JSON.stringify({a: 'b'})
  };

  it('should parse attrs', function() {
    const tag = new Tag('custom');
    let attrs = [
      'enabled',
      'checked',
      'checked',
      'a',
      undefined,
      ['a', 'b'],
      {
        attr1: 'a',
        attr2: 'b'
      },
      {
        attr1: 'b',
        attr3: 'c',
        class: ['a', 'b'],
        style: {a: true, b: false, c: 'test'},
        __keywords: true
      }
    ];
    let html = tag._packAttrs(attrs);
    expect(html).to.equal('enabled checked a b attr1="a" attr2="b" attr1="b" attr3="c" class="a b" style="a c"');
  });

  let testCases = [
    ['class="test"', 'class="test"'],
    ['class="test" style="test"', 'class="test" style="test"'],
    ['class=clz', 'class="test"'],
    ['class=foo.bar', 'class="bar"'],
    ['data-attr=clz', 'data-attr="test"'],
    ['"data-attr"=clz', 'data-attr="test"'],
    ['"data-attr-1-a"=clz', 'data-attr-1-a="test"'],
    ['disabled', 'disabled'],
    ['"checked"', 'checked'],
    ['class=["test1", clz]', 'class="test1 test"'],
    ['class=["test1"], style=clz', 'class="test1" style="test"'],
    ['class=["test1"] style=clz "checked"', 'checked class="test1" style="test"'],
    // 转义
    ['class="<script>alert(1)</script>"', 'class="&lt;script&gt;alert(1)&lt;/script&gt;"'],
    ['class="<"', 'class="&lt;"'],
    ['class=">"', 'class="&gt;"'],
    ['class="&"', 'class="&amp;"'],
    ['class="\'"', 'class="&#39;"'],
    ['class=jsonStr', 'class="{&quot;a&quot;:&quot;b&quot;}"'],
    ['class=html', 'class="&lt;img src=&gt;"']
  ];
  testCases.forEach((item) => {
    it('should parse: ' + item[0], function() {
      const tag = new Tag('test');
      env.addExtension('test', tag);
      let tpl = '{%test ' + item[0] + '%}content{% endtest %}';
      expect(env.renderString(tpl, locals)).to.be.equal('<test ' + item[1] + '>content</test>');
    });
  });

  it('should render custom tag', function() {
    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    let tpl = '{% custom data-attr1=attr1 "data-attr2"=2+3 class=["a1", attr2, "a1", deep.foo] style={a: true, b: false, c: bool}, "readonly", attr2, undefinedVar, undefinedValue=aaa%}{{ content }}{% endcustom %}';
    let html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom readonly attr2 undefinedVar data-attr1="some attr" data-attr2="5" class="a1 a2 foo" style="a c" undefinedValue="">this is content</custom>');

    // without attrs
    tpl = '{% custom %}{{ content }}{% endcustom %}';
    html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom>this is content</custom>');

    // without body
    tpl = '{% custom "data-attr1"=attr1, attr2="a2", "attr1"%}{% endcustom %}';
    html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom attr1 data-attr1="some attr" attr2="a2"></custom>');
  });
});
