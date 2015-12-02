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

  render(context, attrs, fragment) {
    context.resource.addScript(fragment);
    return '';
  }
}

module.exports = ScriptTag;
