'use strict';

const Tag = require('../Tag');

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
    context.resource.addScript(body());
    return '';
  }
}

module.exports = ScriptTag;
