'use strict';

const delegate = require('delegates');
const BaseTag = require('./lib/Tag');
const Resource = require('./lib/Resource');
// const TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'datalet', 'ATF'];
const TagNames = ['head', 'html', 'ATF'];

module.exports = function(opt) {
  Resource.configure(opt);

  function register(env) {
    TagNames.forEach((tagName) => {
      let Tag = require('./lib/tags/' + tagName);
      let tag = new Tag();
      env.addExtension(tag.tagName, tag);
    });
  }

  const exports = {
    BaseTag: BaseTag,
    Resource: Resource,
    register: register
  };

  delegate(exports, 'Resource').getter('manifest');

  return exports;
};