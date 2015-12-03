'use strict';

/**
 * 给 nunjucks 的 parser.parseSignature 增加无逗号支持
 */

const lexer = require('nunjucks/src/lexer');
const nodes = require('nunjucks/src/nodes');

module.exports = function(tolerant, noParens) {
  var tok = this.peekToken();
  if(!noParens && tok.type !== lexer.TOKEN_LEFT_PAREN) {
    if(tolerant) {
      return null;
    }
    else {
      this.fail('expected arguments', tok.lineno, tok.colno);
    }
  }

  if(tok.type === lexer.TOKEN_LEFT_PAREN) {
    tok = this.nextToken();
  }

  var args = new nodes.NodeList(tok.lineno, tok.colno);
  var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
  // var checkComma = false;

  while(1) {
    tok = this.peekToken();
    if(!noParens && tok.type === lexer.TOKEN_RIGHT_PAREN) {
      this.nextToken();
      break;
    }
    else if(noParens && tok.type === lexer.TOKEN_BLOCK_END) {
      break;
    }

    // if(checkComma && !this.skip(lexer.TOKEN_COMMA)) {
    //  this.fail('parseSignature: expected comma after expression',
    //        tok.lineno,
    //        tok.colno);
    // }
    // else {
    this.skip(lexer.TOKEN_COMMA)

    var arg = this.parseExpression();

    if(this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
      kwargs.addChild(
        new nodes.Pair(arg.lineno,
                 arg.colno,
                 arg,
                 this.parseExpression())
      );
    }
    else {
      args.addChild(arg);
    }
    // }

    // checkComma = true;
  }

  if(kwargs.children.length) {
    args.addChild(kwargs);
  }

  return args;
}
