'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const util = require('../util');

describe('test/lib/Tag.test.js', function() {
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

  it('should render custom tag', function() {
    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    let tpl = '{% custom data-attr1=attr1 "readonly" %}{{ content }}{% endcustom %}';
    let html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom readonly data-attr1="some attr">this is content</custom>');

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
