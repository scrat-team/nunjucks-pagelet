'use strict';

const lexer = require('nunjucks/src/lexer');
const nodes = require('nunjucks/src/nodes');

function parseHyphenSymbol() {
  let tok = this.peekToken();
  const lineno = tok.lineno, colno = tok.colno;
  let val = '';

  do {
    tok = this.peekToken();

    if (tok.type === lexer.TOKEN_SYMBOL) {
      // 是符号
      tok = this.nextToken();
      val += tok.value + '-';
    } else {
      this.fail('parseAttributeName: expected attribute symbol',
                          tok.lineno,
                          tok.colno);
    }
  } while (this.skipValue(lexer.TOKEN_OPERATOR, '-')); // 无分隔符，结束解析
  // 截掉最后一个分隔符
  val = val.slice(0, val.length - 1);
  return new nodes.Literal(lineno, colno, val);
}

module.exports = function() {
  let tok = this.peekToken();
  const args = new nodes.NodeList(tok.lineno, tok.colno);
  const kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);

  while (tok.type !== lexer.TOKEN_BLOCK_END) { // 如果标签结束，则结束解析
    let arg;
    if (tok.type === lexer.TOKEN_SYMBOL) {
      // 解析 foo-bar 的情况
      arg = parseHyphenSymbol.call(this);
    } else if (tok.type === lexer.TOKEN_STRING) {
      // 解析 "foo-bar" 的情况
      arg = this.parseExpression();
    } else {
      this.fail('parseAttributes: expected attribute name or string',
                          tok.lineno,
                          tok.colno);
    }

    if (this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
      kwargs.addChild(
        new nodes.Pair(arg.lineno,
                 arg.colno,
                 arg,
                 this.parseExpression())
      );
    } else {
      args.addChild(arg);
    }

    // 跳过可能存在的逗号
    this.skip(lexer.TOKEN_COMMA);

    tok = this.peekToken();
  }

  if (kwargs.children.length) {
    args.addChild(kwargs);
  }

  return args;
};
