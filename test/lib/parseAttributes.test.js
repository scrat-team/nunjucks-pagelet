'use strict';

const expect = require('expect.js');
// const sinon = require('sinon');

const util = require('../util');

describe('test/lib/parseAttributes.test.js', function() {
  let mm, env, engine, Tag;

  before(function() {
    mm = util('general');
    env = mm.env;
    engine = mm.engine;
    Tag = engine.Tag;
  });

  after(util.restore);

  let testCases = [
    [11, '11'],
    ['12', '12'],
    ['class="test"', 'class="test"'],
    ['class="test" count=1', 'class="test" count="1"'],
    ['class="test" style="test"', 'class="test" style="test"'],
    ['class=clz', 'class="test"'],
    ['class=foo.bar', 'class="bar"'],
    ['data-attr=clz', 'data-attr="test"'],
    ['"data-attr"=clz', 'data-attr="test"'],
    ['"data-attr-1-a"=clz', 'data-attr-1-a="test"'],
    ['"checked"', 'checked'],
    ['class=["test1", clz]', 'class="test1 test"'],
    ['class=["test1"], style=clz', 'class="test1" style="test"'],
    ['class=["test1"] style=clz "checked"', 'checked class="test1" style="test"'],
    // 转义
    ['class="<script>alert(1)</script>"', 'class="&lt;script&gt;alert(1)&lt;/script&gt;"'],
    ['class="<"', 'class="&lt;"'],
    ['"<"', '&lt;'],
    ['class=">"', 'class="&gt;"'],
    ['class="&"', 'class="&amp;"'],
    ['class="\'"', 'class="&#39;"'],
    ['class=jsonStr', 'class="{&quot;a&quot;:&quot;b&quot;}"'],
    ['class=html', 'class="&lt;img src=&gt;"'],
    ['class=html|safe', 'class="<img src=>"'],
    ['clz + "_"+foo.bar', 'test_bar']
  ];
  testCases.forEach(item => {
    it('should parse: ' + item[0], function() {
      const tag = new Tag('test');
      env.addExtension('test', tag);
      mm.equal(`{% test ${item[0]} %}content{% endtest %}`, `<test ${item[1]}>content</test>`);
    });
  });

  it('should parse attrs', function() {
    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    let tpl = '{% custom data-attr1=attr1 "data-attr2"=2+3 class=["a1", attr2, "a1", deep.foo] style={a: true, b: false, c: bool}, "readonly", attr2, undefinedVar, undefinedValue=aaa%}{{ content }}{% endcustom %}';
    mm.equal(tpl, '<custom readonly a2 data-attr1="some attr" data-attr2="5" class="a1 a2 foo" style="a c" undefinedValue="">this is content</custom>');

    // without attrs
    tpl = '{% custom %}{{ content }}{% endcustom %}';
    mm.equal(tpl, '<custom>this is content</custom>');

    // without body
    tpl = '{% custom "data-attr1"=attr1, attr2="a2", "attr1"%}{% endcustom %}';
    mm.equal(tpl, '<custom attr1 data-attr1="some attr" attr2="a2"></custom>');
  });

  it('escape', function() {
    let tpl = '{% if ("<a"|first|safe == "<") %}a{% endif %}';
    mm.equal(tpl, 'a');

    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    tpl = '{% custom a=("<script"|safe) b="<" %}{{ content }}{% endcustom %}';
    mm.equal(tpl, '<custom a="<script" b="&lt;">this is content</custom>');
  });

  it('throw error', function() {
    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    expect(function() {
      env.renderString('{% custom <script>="as" %}{{ content }}{% endcustom %}', mm.locals);
    }).to.throwError(/unexpected token/);

    expect(function() {
      env.renderString('{% custom data-src-="as" %}{{ content }}{% endcustom %}', mm.locals);
    }).to.throwError(/unexpected token/);

    expect(function() {
      env.renderString('{% custom a-"f"="a" %}{{ content }}{% endcustom %}', mm.locals);
    }).to.throwError(/invalid key name/);
  });
});
