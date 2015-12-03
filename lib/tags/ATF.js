'use strict';

const Tag = require('../Tag');

class ATFTag extends Tag {
  constructor() {
    super('ATF', false);
  }

  render(context) {
    return this.safe(context.resource.useATF());
  }
}

module.exports = ATFTag;


