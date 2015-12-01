'use strict';

const nunjucks = require('nunjucks');
const expect = require('expect.js');
// const sinon = require('sinon');

const env = nunjucks.configure('test');
const BaseTag = require('../../lib/BaseTag');

describe('test/lib/BaseTag.test.js', function() {

  const locals = {attr1: 'some attr', content: 'this is content'};

  it('should render custom tag', function() {
    const tag = new BaseTag('custom');
    env.addExtension('custom', tag);
    const tpl = '{% custom "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endcustom %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.match(/^<custom data-attr1="some attr" attr2="a2">this is content<\/custom>$/);
  });

  it('should support not-block tag', function() {
    class SingleTag extends BaseTag {
      constructor() {
        super('single', false);
        this.outputTag = 'div';
      }
    }
    env.addExtension('single', new SingleTag());

    const tpl = '{% single "data-attr1"=attr1, attr2="a2" %}{{ content }}';
    const html = env.renderString(tpl, locals);
    expect(html).to.match(/^<div data-attr1="some attr" attr2="a2"><\/div>this is content$/);
  });

  it('should extend base tag', function() {
    class SubTag extends BaseTag {
      constructor() {
        super('sub');
        this.outputTag = 'div';
      }
      test() {
        return 'a';
      }
    }
    env.addExtension('sub', new SubTag());

    const tpl = '{% sub "data-attr1"=attr1, attr2="a2"%}{{ content }}{% endsub %}';
    const html = env.renderString(tpl, locals);
    expect(html).to.match(/^<div data-attr1="some attr" attr2="a2">this is content<\/div>$/);
  });
});
