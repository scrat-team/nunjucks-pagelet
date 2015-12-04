'use strict';

const lexer = require('nunjucks/src/lexer');
const nodes = require('nunjucks/src/nodes');

function parseHyphenSymbol() {
  var tok = this.peekToken();
  var lineno = tok.lineno, colno = tok.colno;
  var val = '';

  while (1) {
    tok = this.peekToken();

    if (tok.type === lexer.TOKEN_SYMBOL) {
      // 是符号
      tok = this.nextToken();
      val += (tok.value + '-');
    } else {
      this.fail('parseAttributeName: expected attribute symbol',
                          tok.lineno,
                          tok.colno);
    }

    if (!this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
      // 非分隔符，结束解析
      break;
    }
  }
  // 截掉最后一个分隔符
  val = val.slice(0, val.length - 1);
  return new nodes.Literal(lineno, colno, val);
}

module.exports = function() {
  var tok = this.peekToken();
  var args = new nodes.NodeList(tok.lineno, tok.colno);
  var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);

  while(1) {
    tok = this.peekToken();

    // 如果标签结束，则结束解析
    if(tok.type === lexer.TOKEN_BLOCK_END) {
      break;
    }

    if (tok.type === lexer.TOKEN_SYMBOL) {
      // 解析 foo-bar 的情况
      var arg = parseHyphenSymbol.call(this);
    } else if (tok.type === lexer.TOKEN_STRING) {
      // 解析 "foo-bar" 的情况
      var arg = this.parseExpression();
    } else {
      this.fail('parseAttributes: expected attribute name or string',
                          tok.lineno,
                          tok.colno);
    }

    if(this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
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
  }

  if(kwargs.children.length) {
    args.addChild(kwargs);
  }

  return args;
};
