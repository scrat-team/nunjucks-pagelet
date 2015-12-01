# 代码贡献规范

有任何疑问，欢迎提交 [issue](https://github.com/scrat-team/nunjucks-pagelet/issues)，
或者直接修改提交 [PR](https://github.com/scrat-team/nunjucks-pagelet/pulls)!

## 提交 issue

- 请确定 issue 的类型。
- 请避免提交重复的 issue，在提交之前搜索现有的 issue。
- 在标签(分类参考__标签分类__), 标题 或者内容中体现明确的意图。

随后 scrat-team 负责人会确认 issue 意图，更新合适的标签，关联 milestone，指派开发者。

标签可分为两类，type 和 scope

- type: issue 的类型，如 `feature`, `bug`, `documentation`, `performance`, `support` ...
- scope: 修改文件的范围，如 `core: xx`，`plugin: xx`，`deps: xx`

### 常用标签说明

- `support`: issue 提出的问题需要开发者协作排查，咨询，调试等等日常技术支持。
- `bug`: 一旦发现可能是 bug 的问题，请打上 `bug`，然后等待确认，一旦确认是 bug，此 issue 会被再打上 `confirmed`。
  - 此时 issue 会被非常高的优先级进行处理。
  - 如果此 bug 是正在影响线上应用正常运行，会再打上 `critical`，代表是最高优先级，需要马上立刻处理！
  - bug 会在最低需要修复的版本进行修复，如是在 `0.9.x` 要修复的，而当前最新版本是 `1.1.x`，
  那么此 issue 还会被打上 `0.9`，`0.10`，`1.0`，`1.1`，代表需要修复到这些版本。
- `core: xx`: 代表 issue 跟 core 内核相关，如 `core: antx` 代表跟 `antx` 配置相关。
- `plugin: xx`: 代表 issue 跟插件相关，如 `deps: session` 代表跟 `session` 插件相关。
- `deps: xx`: 代表 issue 跟 `dependencies` 模块相关，如 `deps: egg-cors` 代表跟 `egg-cors` 模块相关。
- `chore: documentation`: 代表发现了文档相关问题，需要修复文档说明。
- `cbd`: 代表跟服务器部署相关

## 编写文档

所有功能点必须提交配套文档，文档须满足以下要求

- 必须说清楚问题的几个方面：what（是什么），why（为什么），how（怎么做），可根据问题的特性有所侧重。
- how 部分必须包含详尽完整的操作步骤，必要时附上 **足够简单，可运行** 的范例代码，
- 提供必要的链接，如申请流程，术语解释和参考文档等。

## 提交代码

### 提交 Pull Request

如果你希望贡献代码，那么你可以 fork 仓库, 修改代码提交 PR，开发团队会 review 代码合并到主干。

```bash
// 先创建开发分支开发，分支名应该有含义，避免使用 update、tmp 之类的
$ git checkout -b feature/branch-name

// 开发完成后跑下测试是否通过，必要时需要新增或修改测试用例
$ npm test

// 测试通过后，提交代码，message 见下面的规范

$ git add . // git add -u 删除文件
$ git commit -m "fix(role): role.use must xxx"
$ git push origin branch-name
```

提交后就可以在 [nut](https://github.com/scrat-team/nunjucks-pagelet/pulls) 创建 PR 了。

由于谁也无法保证过了多久之后还记得多少，为了后期回溯历史的方便，请在提交 PR 时确保提供了以下信息。

1. 需求点（一般关联 issue 或者注释都算）
2. 升级原因（不同于 issue，可以简要描述下为什么要处理）
3. 框架测试点（可以关联到测试文件，不用详细描述，关键点即可）
4. 关注点（针对用户而言，可以没有，一般是不兼容更新等，需要额外提示）

### 代码风格

你的代码风格必须通过 eslint，你可以运行 `$ npm run lint` 本地测试。

### Commit 提交规范

根据 [angular 规范](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format)提交 commit，
这样 history 看起来更加清晰，还可以自动生成 changelog。

```xml
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

（1）type

提交 commit 的类型，包括以下几种

- feat: 新功能
- fix: 修复问题
- docs: 修改文档
- style: 修改代码格式，不影响代码逻辑
- refactor: 重构代码，理论上不影响现有功能
- perf: 提升性能
- test: 增加修改测试用例
- chore: 修改工具相关（包括但不限于文档、代码生成等）
- deps: 升级依赖

（2）scope

修改文件的范围（包括但不限于 doc, middleware, proxy, core, config, plugin）

（3）subject

用一句话清楚的描述这次提交做了什么

（4）body

补充 subject，适当增加原因、目的等相关因素，也可不写。

（5）footer

- 当有非兼容修改时可在这里描述清楚
- 关联相关 issue，如 `Closes #1, Closes #2, #3`
- 如果功能点有新增或修改的，还需要关联文档 `doc` 和 `egg-init` 的 MR，如 `egg/doc!123`

示例

```
fix($compile): couple of unit tests for IE9

Older IEs serialize html uppercased, but IE9 does not...
Would be better to expect case insensitive, unfortunately jasmine does
not allow to user regexps for throw expectations.

Document change on egg/doc!123

Closes #392
Breaks foo.bar api, foo.baz should be used instead
```

查看具体[文档](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit)

## 发布管理

### 分支策略

不是 master 集中化开发策略，而是分支开发策略（无 master，并行版本分支）。

- 完全执行 [semver] 标准，每个开发分支都是 minor 版本（比如 1.0.x, 1.1.x），开发周期一般为一个月。
- 多分支并不是串行的，而是并行的。一般情况下分支发布稳定版后只做 bug 修复，新需求会放到下一个里程碑中。
  如果老版本有一个 bugfix，需要 cherry-pick 之后的所有版本。
- 一般情况下，只要是在使用的版本 egg 都会保证 bug 修复，但 egg 建议快速升级版本以减少升级成本。
- 持续维护的版本以 Milestone 为准，只要是开着的版本都会进行修复。

