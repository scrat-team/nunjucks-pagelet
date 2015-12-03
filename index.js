'use strict';

const delegate = require('delegates');

exports.Tag = require('./lib/Tag');
exports.Resource = require('./lib/Resource');
delegate(exports, 'Resource').method('configure');
delegate(exports, 'Resource').getter('manifest');

// const TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'datalet', 'ATF'];
const TagNames = ['body', 'head', 'html', 'pagelet', 'require', 'script', 'uri', 'title', 'ATF'];
exports.TagNames = TagNames;
exports.tags = TagNames.map((tagName) => {
  let Tag = require('./lib/tags/' + tagName);
  return new Tag();
});