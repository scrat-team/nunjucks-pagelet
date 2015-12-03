'use strict';

const BaseTag = require('../Tag');

/**
 * collect script
 * @example
 * {% script %}var a = "b";{% endscript %}
 */
class ScriptTag extends BaseTag {
  constructor() {
    super('script');
  }

  render(context, attrs, body) {
    context.resource.addScript(body());
    return '';
  }
}

module.exports = ScriptTag;
