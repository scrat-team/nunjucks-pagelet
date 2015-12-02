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

describe('test/lib/BaseTag.test.js', function() {

  const locals = {attr1: 'some attr', content: 'this is content'};

  it('should render custom tag', function() {
    const tag = new Tag('custom');
    env.addExtension('custom', tag);
    const tpl = '{% custom "data-attr1"=attr1, attr2="a2", "attr1"%}{{ content }}{% endcustom %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<custom data-attr1="some attr" attr2="a2">this is content</custom>');
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

      beforeRender(context) {
        context.model = new Model('abc');
      }

      afterRender(context) {
        delete context.model;
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

    env.addGlobal('test', 'aaa');

    mount(ParentTag, ChildTag, NextTag);

    const tpl = '{% parent %}{% child %}{% endchild %}{% endparent %}{% next %}{% endnext %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.equal('<parent><child>abc</child></parent><next>undefined</next>');
  });
});
