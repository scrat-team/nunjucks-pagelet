
1.4.1 / 2015-12-28
==================

  * bug: revert symbol due to nunjucks do not copy it

1.4.0 / 2015-12-27
==================

  * feat: support isolate-scope
  * feat: __resource -> symbol

1.3.0 / 2015-12-24
==================

  * feat: move resource to context.ctx.__resource

1.2.1 / 2015-12-22
==================

  * feat: html tag will output doctype

1.2.0 / 2015-12-21
==================

  * refactor: change exports
  * refactor: get attr object with last index
  * deps: update nunjucks-tag && fix ci
  * refactor: remove unnecessary code
  * refactor: separate tag to nunjuck-tag lib
  * style: =>

1.1.1 / 2015-12-09
==================

  * more const, use `instanceof` instead of typename comparation.
  * bug: parser num
  * docs: parser rule
  * Merge pull request #10 from scrat-team/test-utils
  * add test utils
  * Adjust attribute name of tags with following rules:
  * feat: 代码风格优化

1.0.0 / 2015-12-06
==================

  * 1.0.0
  * docs: readme
  * bug: manifest->file
  * feat: refact mannifest
  * feat: 移除Tag对Resource的依赖 && 优化mock && 补充README
  * feat: 提供register注册入口
  * deps: 移除nunjucks的依赖, 仅保留在helper类中
  * feat(parser): parser tests 独立出来
  * feat(parser): parser去掉nunjucks依赖
  * docs: 修订docs
  * feat(security) escape attrs
  * docs: 修订docs
  * clean code
  * Apply new rules of attribute key:
  * add custom `parseDignature` without comma detection.
  * bug: eslint
  * docs: 补充README等
  * feat(Tag): 完善单元测试
  * feat(Tag): 完善单元测试
  * feat(Tag): pagelet 单元测试
  * feat(Tag): pagelet 单元测试 && 代码风格修改
  * feat(Tag): require支持直接给url, 无需 $id
  * feat(Tag): 完成require的include && 重构测试
  * feat(Tag): 增强attrs的分析
  * refactor(Tag): refactor Tag
  * feat(core): uri && title
  * feat(core): ATF && body
  * feat(core): 优化Resource代码
  * feat(core): Resource配置文件读取改造
  * feat(core): 支持Resource变量
  * feat(core): import Resource
  * feat(core): BaseTag 代码优化
  * bug: fix travis
  * bug: fix deps
  * docs: travis status
  * feat(core): BaseTag
  * init project
