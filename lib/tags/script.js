'use strict';

const Tag = require('nunjucks-tag');

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
    const resource = context.ctx.__resource;
    resource.addScript(body());
    return '';
  }
}

module.exports = ScriptTag;
