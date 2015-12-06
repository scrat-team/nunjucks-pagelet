'use strict';

/**
 * patch nunjucks parser with rules:
 *  - Comma between attributes is optional.
 *  - Attribute keys should only match 1 of the following 2 patterns:
 *    - String ("data-key"="value" key="value")
 *    - Symbol with hyphen (data-key="value")
 *
 * thanks to @Gerhut
 */

module.exports = function(parser, nodes, lexer) {
  let tok = parser.peekToken();
  const args = new nodes.NodeList(tok.lineno, tok.colno);
  const kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);

  while (tok.type !== lexer.TOKEN_BLOCK_END) { // 如果标签结束，则结束解析
    let arg;
    if (tok.type === lexer.TOKEN_SYMBOL) {
      // 解析 foo-bar 的情况
      arg = parseHyphenSymbol(parser, nodes, lexer);
    } else if (tok.type === lexer.TOKEN_STRING) {
      // 解析 "foo-bar" 的情况
      arg = parser.parseExpression();
    } else {
      parser.fail('parseAttributes: expected attribute name or string', tok.lineno, tok.colno);
    }

    if (parser.skipValue(lexer.TOKEN_OPERATOR, '=')) {
      kwargs.addChild(
        new nodes.Pair(arg.lineno, arg.colno, arg, parser.parseExpression())
      );
    } else {
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

function parseHyphenSymbol(parser, nodes, lexer) {
  let tok = parser.peekToken();
  const lineno = tok.lineno;
  const colno = tok.colno;
  let val = '';

  do {
    tok = parser.peekToken();

    if (tok.type === lexer.TOKEN_SYMBOL) {
      // 是符号
      tok = parser.nextToken();
      val += tok.value + '-';
    } else {
      parser.fail('parseAttributeName: expected attribute symbol', tok.lineno, tok.colno);
    }
  } while (parser.skipValue(lexer.TOKEN_OPERATOR, '-')); // 无分隔符，结束解析
  // 截掉最后一个分隔符
  val = val.slice(0, val.length - 1);
  return new nodes.Literal(lineno, colno, val);
}