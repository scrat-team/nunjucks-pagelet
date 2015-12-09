'use strict';

/**
 * patch nunjucks parser with rules:
 *  - Comma between attributes is optional.
 *  - Attribute keys should only match 1 of the following 2 patterns:
 *    - String ("data-key"="value" key="value")
 *    - Symbol with hyphen (data-key="value")
 *  - Attributes without value must be a simple symbol or an expression
 *
 * thanks to @Gerhut
 */

module.exports = function(parser, nodes, lexer) {
  let tok = parser.peekToken();
  const args = new nodes.NodeList(tok.lineno, tok.colno);
  const kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);

  while (tok.type !== lexer.TOKEN_BLOCK_END) { // 如果标签结束，则结束解析
    let arg = parser.parseExpression();

    if (parser.skipValue(lexer.TOKEN_OPERATOR, '=')) {
      // 有等于号，确保左值符合 foo-bar 格式，转为字符串处理
      const attrName = toAttributeName(arg, nodes, true);
      if (attrName === null) {
        parser.fail('parseAttributes: invalid key name.');
      }
      arg = new nodes.Literal(arg.lineno, arg.colno, attrName);
      kwargs.addChild(
        new nodes.Pair(arg.lineno, arg.colno, arg, parser.parseExpression())
      );
    } else {
      // 无等于号：左值当表达式处理
      args.addChild(arg);
    }

    // 跳过可能存在的逗号
    parser.skip(lexer.TOKEN_COMMA);

    tok = parser.peekToken();
  }

  if (kwargs.children.length) {
    args.addChild(kwargs);
  }

  return args;
};

function toAttributeName(arg, nodes, acceptLiteral) {
  if (acceptLiteral && arg instanceof nodes.Literal
      || arg instanceof nodes.Symbol) {
    return arg.value;
  }

  if (arg instanceof nodes.Sub) {
    const left = toAttributeName(arg.left, nodes);
    const right = toAttributeName(arg.right, nodes);

    if (left === null || right === null) {
      return null;
    }

    return `${left}-${right}`;
  }

  return null;
}
