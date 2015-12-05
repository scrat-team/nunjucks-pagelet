'use strict';

exports.isSafeString = function(str) {
  return str instanceof require('nunjucks').runtime.SafeString;
};

exports.escape = undefined;

exports.safe = undefined;