'use strict';

const BaseTag = require('../Tag');

class ATFTag extends BaseTag {
  constructor() {
    super('ATF', false);
  }

  render(context) {
    return this.safe(context.resource.useATF());
  }
}

module.exports = ATFTag;


