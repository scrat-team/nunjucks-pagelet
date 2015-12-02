'use strict';

const BaseTag = require('../Tag');
const Resource = require('../Resource');

class ATFTag extends BaseTag {
  constructor() {
    super('ATF', false);
  }

  beforeRender(context) {
    context._ATF_OUTPUT = context.resource.useATF();
  }

  afterRender(context) {
    delete context._ATF_OUTPUT;
  }

  render(context) {
    return this.safe(context._ATF_OUTPUT);
  }
}

module.exports = ATFTag;


