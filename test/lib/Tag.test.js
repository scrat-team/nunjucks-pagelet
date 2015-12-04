'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const util = require('../util');

describe('test/lib/Tag.test.js', function() {
  let app, env, framework, Tag;

  before(function() {
    app = util('general');
    env = app.env;
    framework = app.framework;
    Tag = framework.Tag;
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
    expect(html).to.equal('enabled checked a attr1="a" attr2="b" attr1="b" attr3="c" class="a b" style="a c"');
  });

  let testCases = [
    ['class="test"', 'class="test"'],
    ['class=clz', 'class="test"'],
    ['class=foo.bar', 'class="bar"'],
    ['"data-attr"=clz', 'data-attr="test"'],
    ['"data-attr-1-a"=clz', 'data-attr-1-a="test"'],
    ['"disabled"', 'disabled'],
    ['class=["test1", clz]', 'class="test1 test"'],
    ['class=["test1"], style=clz', 'class="test1" style="test"'],
    ['class=["test1"], style=clz, "checked"', 'checked class="test1" style="test"']
    // TODO: 是否需要转义?
    // ['class="<"', 'class="&lt;"'],
    // ['class=">"', 'class="&gt;"'],
    // ['class="&"', 'class="&amp;"'],
    // ['class="\'"', 'class="&#39;"'],
    // ['class=jsonStr', 'class="{&quot;a&quot;:&quot;b&quot;}"'],
    // ['class=html', 'class="&lt;img src=&gt;"']
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
    let tpl = '{% custom "data-attr1"=attr1, class=["a1", attr2, "a1", deep.foo], style={a: true, b: false, c: bool}, "readonly", attr2, undefinedVar, undefinedValue=aaa, ["test", attr2], {a:"test"}%}{{ content }}{% endcustom %}';
    let html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom readonly a2 test a="test" data-attr1="some attr" class="a1 a2 foo" style="a c" undefinedValue="">this is content</custom>');

    // without attrs
    tpl = '{% custom %}{{ content }}{% endcustom %}';
    html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom>this is content</custom>');

    // without body
    tpl = '{% custom "data-attr1"=attr1, attr2="a2", "attr1"%}{% endcustom %}';
    html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom attr1 data-attr1="some attr" attr2="a2"></custom>');
  });

  it('should support not-block tag', function() {
    class SingleTag extends Tag {
      constructor() {
        super('single', false);
        this.outputTag = 'div';
      }
    }
    app.mount(SingleTag);

    let tpl = '{% single "data-attr1"=attr1, attr2="a2" %}{{ content }}';
    let html = env.renderString(tpl, locals);
    expect(html).to.equal('<div data-attr1="some attr" attr2="a2"></div>this is content');

    // without attrs
    tpl = '{% single %}{{ content }}';
    html = env.renderString(tpl, locals);
    expect(html).to.equal('<div></div>this is content');
  });

  it('should extend base tag', function() {
    class SubTag extends Tag {
      constructor() {
        super('sub');
        this.outputTag = 'div';
      }
    }
    app.mount(SubTag);

    const tpl = '{% sub "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endsub %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<div data-attr1="some attr" attr2="a2">this is content</div>');
  });

  it('should use ext context', function() {
    class Model {
      constructor(str) {
        this.data = str;
      }
      getData() {
        return this.data;
      }
    }

    class ParentTag extends Tag {
      constructor() {
        super('parent');
      }

      render(context, attrs, body, noSafe) {  // eslint-disable-line no-unused-vars
        context.model = new Model('abc');
        const html = super.render.apply(this, arguments);
        delete context.model;
        return html;
      }
    }

    class ChildTag extends Tag {
      constructor() {
        super('child');
      }

      render(context, attrs, fragment) {
        fragment = context.model.getData();
        return super.render(context, attrs, fragment);
      }
    }

    class NextTag extends Tag {
      constructor() {
        super('next');
      }

      render(context, attrs, fragment) {
        fragment = context.model ? context.model.getData() : 'undefined';
        return super.render(context, attrs, fragment);
      }
    }

    app.mount(ParentTag, ChildTag, NextTag);

    const tpl = '{% parent %}{% child %}{% endchild %}{% endparent %}{% next %}{% endnext %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<parent><child>abc</child></parent><next>undefined</next>');
  });

  it('should include', function() {
    const env = nunjucks.configure('./test/fixtures/include');
    function TestTag() {
      this.tags = ['test'];
      this.parse = function(parser, nodes) {
        // get the tag token
        let token = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        let args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        // See above for notes about CallExtension
        return new nodes.CallExtension(this, 'run', args);
      };
      this.run = function(context, args) {
        return new nunjucks.runtime.SafeString(context.env.render(args, context.ctx));
      };
    }

    env.addExtension('test', new TestTag());

    const html = env.render('parent.tpl', {title: 'this is title', deep: {foo: 'foo'}});
    expect(html).to.equal('this is title\nfoo');
  });
});
