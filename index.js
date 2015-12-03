'use strict';

const delegate = require('delegates');
const Tag = require('./lib/Tag');
const Resource = require('./lib/Resource');
// const TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'datalet', 'ATF'];
const TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'ATF'];

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
    Tag: Tag,
    Resource: Resource,
    register: register
  };

  delegate(exports, 'Resource').getter('manifest');

  return exports;
};