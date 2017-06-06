'use strict';

module.exports = {
  write: true,
  prefix: '^',
  test: [
    'test',
    'benchmark',
  ],
  dep: [
    'delegates',
    'nunjucks-tag'
  ],
  devdep: [
    'egg-bin',
    'autod',
    'eslint',
    'nunjucks',
    'sinon',
    'eslint-config-egg'
  ],
  exclude: [
    './test/fixtures',
  ],
  semver: [
    'nunjucks@2'
  ],
};
