'use strict';

const Tag = require('nunjucks-tag');
const symbol = require('../symbol');

/**
 * collect script
 * @example
 * {% script %}var a = "b";{% endscript %}
 */
class ScriptTag extends Tag {
  constructor() {
    super('script');
  }

  render(context, attrs, body) {
    const resource = context.ctx[symbol.RESOURCE];
    resource.addScript(body());
    return '';
  }
}

module.exports = ScriptTag;
