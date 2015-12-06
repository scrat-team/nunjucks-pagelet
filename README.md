# [scrat](https://github.com/scrat-team/scrat) 后端渲染解决方案的模板扩展

scrat后端渲染组件化开发模式通过扩展 [nunjucks](http://mozilla.github.io/nunjucks) 模板引擎实现了组件资源管理方案。

[![NPM Version](https://img.shields.io/npm/v/nunjucks-pagelet.svg?style=flat)](https://www.npmjs.org/package/nunjucks-pagelet)
[![Build Status](https://img.shields.io/travis/scrat-team/nunjucks-pagelet.svg?style=flat)](https://travis-ci.org/scrat-team/nunjucks-pagelet)

## 用法

```js
const path = require('path');
const nunjucks = require('nunjucks');
const engine = require('nujucks-pagelet');

const baseDir = path.join(process.cwd(), './test/fixtures/general');
const env = nunjucks.configure(baseDir, {});

/**
 * 初始化入口
 * @method Engine#register
 * @param {Object} opt 配置对象
 * @param {Object} opt.nunjucks nunjucks对象, 用于扩展
 * @param {Object} opt.env nunjucks.Environment 实例, 用于扩展
 * @param {String|Object|Function} opt.manifest 资源映射表, 可以是文件路径/映射表对象/读取函数
 * @param {String} opt.root 静态文件的根目录
 * @param {Boolean} [opt.cache] 是否缓存资源映射表
 * @param {Object} [opt.helper] 辅助方法, 覆盖helper类的 safe , escape,  SafeString, comboURI 等
 * @param {Object} [opt.logger] 日志对象
 * @return {void}
 */
engine.register({
  root: baseDir,
  manifest: path.join(baseDir, 'manifest.json'),
  cache: true,
  nunjucks: nunjucks,
  env: env
});

// 渲染
const locals = {};
const html = env.render('test.tpl', locals);

// use in express
const express = require('express');
const app = express();
app.set('view engine', 'tpl');
env.express(app);

// 注册中间件, 读取 Pagelet 的参数
app.use(function(req, res, next) {
  res.locals._query = req.query;
  res.locals._body = req.body;
  var pagelets = req.get('X-Pagelets');
  if(pagelets){
      res.set('Content-Type', 'application/json');
      // res.set('Cache-Control', 'no-cache, no-store');
      // res.set('Pragma', 'no-cache');
      // res.set('Expires', 0);
      res.locals._pagelets = pagelets;
  }
  next();
});

app.get('/', function(req, res) {
  res.render('test.tpl', res.locals);
});

```

## 资源依赖表

manifest 文件是通过构建工具生成的, 主要描述了资源的依赖关系.

```
{
  "combo": false,
  "comboPattern": "/co??%s",
  "hash": "f0ab3c",
  "res": {
    "components/nav/nav.js": {
      "uri": "c/nav/nav.js",
      "type": "js",
      "deps": [
        "views/jquery/jquery.js",
        "components/nav/nav.css"
      ]
    },
    "components/nav/nav.css": {
      "uri": "c/nav/nav.css",
      "type": "css",
      "deps": [
        "views/reset/reset.css"
      ]
    },
    "components/bar/bar.tpl": {
      "uri": "c/bar/bar.tpl",
      "type": "tpl",
      "deps": [
        "nav",
        "components/bar/bar.css"
      ]
    },
    "components/bar/bar.css": {
      "uri": "c/bar/bar.css",
      "type": "css"
    },
    "components/foo/foo.tpl": {
      "uri": "c/foo/foo.tpl",
      "type": "tpl",
      "deps": [
        "nav",
        "components/foo/foo.css"
      ]
    },
    "components/foo/foo.css": {
      "uri": "c/foo/foo.css",
      "type": "css"
    },
    "views/jquery/jquery.js": {
      "uri": "v/jquery/jquery.js",
      "type": "js"
    },
    "views/reset/reset.css": {
      "uri": "v/reset/reset.css",
      "type": "css"
    },
    "views/index/index.tpl": {
      "uri": "views/test.tpl",
      "type": "tpl",
      "deps": [
        "foo"
      ]
    }
  }
}
```

## 新增规则

- 对`nunjucks`的自定义标签语法进行了修订:
  - 属性分隔符增加对空格的支持, 原逗号仍保留支持, 但建议使用空格
  - `data-src` 这类的属性名, 无需双引号包裹
  - `disabled` 这类的没有赋值的属性, 无需双引号包裹, 不再支持变量
  - 示例:
    - `{% body cdn="asd", data-src="http://", disabled %}{% endbody %}`
    - `{% pagelet $id="asd" class=["a", "b"] style={a: true, b: someVar} %}{% endpagelet %}`
- swig版本传送门: [scrat-swig](https://github.com/scrat-team/scrat-swig), Base on Latest commit 6cdcb1f on 20 Oct .

## 新增模板标签

### require

* 功能：资源/组件引用接口，调用后只是收集资源，并不会有内容输出。
* 闭合：NO
* 参数：
    * $id：字符串或模板变量。要引用的组件id或相对路径
    * 其他参数: 作为子组件的局部变量, 继承并覆盖上层变量
* 示例：

    ```twig
    {% require $id="header" %}    {# 组件id #}
    {% require $id="./lib.js" %}  {# 工程路径 #}
    {% for val in obj %}
      {% require $id=val %}     {# 模板变量 #}
    {% endfor %}
    ```

### html

* 功能：替代原生的 `<html>` 标签包裹页面主体部分，用于实现资源url输出时替换页面占位
* 闭合：YES
* 参数：
    * cdn: 指定pagelet加载时所用的域名,可以是字符串字面量,也可以是模板变量
    * 任何其他参数都将转换为输出的html标签的属性。
* 示例：

    ```twig
    {% html class="abc" data-value="bcd" %}
      ...
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html class="abc" data-value="bcd">
      ...
    </html>
    ```

### head

* 功能：替代原生的 `<head>` 标签包裹页面head部分，用于实现资源CSS输出占位
* 闭合：YES
* 参数：任何参数都将转换为输出的head标签的属性。
* 示例：

    ```twig
    {% html%}
      {% head class="abc" data-xxx="bcd" %}
        ...
      {% endhead %}
      ...
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html>
      <head class="abc" "data-xxx"="bcd">
        ...
      </head>
      ...
    </html>
    ```

### body

* 功能：替代原生的 `<body>` 标签包裹页面body部分，用于实现资源JS输出占位
* 闭合：YES
* 参数：任何参数都将转换为输出的body标签的属性。
* 示例：

    ```twig
    {% html%}
      {% head %}
        ...
      {% endhead %}
      {% body class="main" id="main" "data-ooo"="abc" %}
        ...
      {% endbody %}
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html>
      <head>
        ...
      </head>
      <body class="main" id="main" data-ooo="abc">
        ...
      </body>
    </html>
    ```

### script

* 功能：替代原生的 ``script`` 标签，收集页面中散落的script脚本统一放到页面尾部输出。
* 闭合：YES
* 参数：无
* 示例：

    ```twig
    {% html%}
      {% head %}
        ...
        {% require $id="../lib/jquery.js" %}  {# 引用资源 #}
      {% endhead %}
      {% body %}
        ...
        {% script %}
          var header = require('header');
          header.init();
        {% endscript %}
        {% require $id="./index.js" %}  {# 引用资源 #}
      {% endbody %}
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html>
      <head>
        ...
      </head>
      <body>
        ...
        <script src="/views/lib/jquery.js"></script>
        <script src="/views/index/index.js"></script>
        <script>
          !function(){
            var header = require('header');
            header.init();
          }();
        </script>
      </body>
    </html>
    ```

* 注意：在body闭合标签之前，js输出的顺序是：
  1. require标签加载的外链js
  2. script标签收集的内联js

### pagelet

* 功能：页面区域划分，用于quickling加载页面
* 闭合：YES
* 注意：pagelet默认会生成一个dom结构，如果希望不生成任何结构，须设置 ``$tag`` 属性值为字符串 ``"none"``
* 参数：
    * $id：字符串|模板变量。定义pagelet的id
    * $tag：字符串|模板变量|"none"。要生成的占位标签的标签名，可以不指定，默认是 ``div``。如果指定为none，框架会输出一个注释来标注pagelet的范围。
    * 任何其他参数都将转换为输出的pagelet占位标签的属性。
* 示例：

    ```twig
    {% html%}
      {% head %}
        ...
      {% endhead %}
      {% body %}
        ...
        {% pagelet $id="main" class="main" %}
          <ul>
            {% pagelet $id="list" $tag="none" %}
              {% for item in list %}
              <li>{{ loop.index }} - {{ loop.key }}: {{ x }}</li>
              {% endfor %}
            {% endpagelet %}
          </ul>
          {% pagelet $id="form" $tag="form" id="my-form" class="form-control" %}
            <input type="text" name="username">
          {% endpagelet %}
        {% endpagelet %}
        ...
      {% endbody %}
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html>
      <head>
        ...
      </head>
      <body>
        ...
        <div class="main" data-pagelet="main">
          <ul>
            <!-- pagelet [main.list] start -->
            <li>0 - a: 123</li>
            <li>0 - b: 456</li>
            <!-- pagelet [main.list] end -->
          </ul>
          <form id="my-form" class="form-control" data-pagelet="main.form">
            <input type="text" name="username">
          </form>
        </div>
        ...
      </body>
    </html>
    ```

### title

* 功能：如果使用 quickling 切换页面，你的页面此标签替代原生的 `<title>` 标签用以收集页面标题数据，这样页面切换后框架可以自动修改页面的title显示。
* 闭合：YES
* 参数：无
* 示例：

    ```twig
    {% html%}
      {% head %}
        ...
        {% title %}首页{% endtitle %}
      {% endhead %}
      {% body %}
        ...
      {% endbody %}
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html>
      <head>
        ...
        <title>首页</title>
      </head>
      <body>
        ...
      </body>
    </html>
    ```

### datalet

* 功能：在pagelet区域内收集模板数据将来在quickling加载时可以传递给前端框架。
* 闭合：NO
* 示例：

    ```twig
    {% html%}
      {% head %}
        ...
        {% title %} 列表页 - 第{{ offset }}页 {% endtitle %}
      {% endhead %}
      {% body %}
        ...
        {% pagelet $id="main" class="main" %}
          {% pagelet $id="list" $tag="ul" %}
            {% for item in list %}
            <li>{{ loop.index }} - {{ loop.key }}: {{ x }}</li>
            {% endfor %}
            {% datalet page=offset %}
          {% endpagelet %}
        {% endpagelet %}
        ...
      {% endbody %}
    {% endhtml %}
    ```

    假设前端获取main.list的pagelet数据：

    ```js
    {
      "title": "列表页 - 第5页",   // title收集
      "html": {
        "main.list": "..."      // pagelet的html内容
      },
      "data": {
        page: 5                 // datalet收集
      },
      "js": [ ... ],            // js依赖
      "css": [ ... ],           // css依赖
      "script": [ ... ]         // script收集
    }
    ```

### ATF

* 功能：收集位于`ATF`标签以上的css资源，并内嵌到主文档的head标签中。只会收集使用`require`标签加载的css资源，并不会收集link标签的css资源。用于加快首屏渲染速度的优化。
* 闭合：NO
* 参数：无
* 示例：

    ```twig
    {% html%}
      {% head %}
        ...
      {% endhead %}
      {% body %}
        ...
        {% require $id="header" %}
        {% require $id="./index.css" %}
        {% ATF %}
        {% require $id="footer" %}
        ...
      {% endbody %}
    {% endhtml %}
    ```

    渲染后的html：

    ```html
    <html>
      <head>
        ...
        <style>
          .header {...}
          .index {...}
        </style>
      </head>
      <body>
        ...
        <link rel="stylesheet" href="/co??c/footer/footer.css" data-defer>
        ...
      </body>
    </html>
    ```
