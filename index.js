'use strict';

const delegate = require('delegates');
const BaseTag = require('./lib/Tag');
const Resource = require('./lib/Resource');

module.exports = function(opt) {
  Resource.configure(opt);

  const exports = {
    BaseTag: BaseTag,
    Resource: Resource
  };

  delegate(exports, 'Resource').getter('manifest');

  return exports;
};