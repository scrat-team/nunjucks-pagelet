'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const Tag = require('../../lib/Tag');

function mount(Tags) {
  Tags = Array.prototype.slice.call(arguments);
  Tags.forEach((Tag) => {
    let tag = new Tag();
    env.addExtension(tag.tagName, tag);
  });
}

describe('test/lib/Tag.test.js', function() {

  const locals = {attr1: 'some attr', attr2: 'a2', content: 'this is content', bool: true};

  it('should output attrs', function() {
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

  it('should render custom tag', function() {
    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    let tpl = '{% custom "data-attr1"=attr1, class=["a1", attr2, "a1"], style={a: true, b: false, c: bool}, "readonly", attr2, undefinedVar, undefinedValue=aaa, ["test", attr2], {a:"test"}%}{{ content }}{% endcustom %}';
    let html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom readonly a2 test a="test" data-attr1="some attr" class="a1 a2" style="a c" undefinedValue="">this is content</custom>');

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
    mount(SingleTag);

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
      test() {
        return 'a';
      }
    }
    mount(SubTag);

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

    mount(ParentTag, ChildTag, NextTag);

    const tpl = '{% parent %}{% child %}{% endchild %}{% endparent %}{% next %}{% endnext %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<parent><child>abc</child></parent><next>undefined</next>');
  });
});
