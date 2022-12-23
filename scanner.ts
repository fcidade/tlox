import { Lox } from "./lox.ts";
import { Token, TokenLiteral, TokenType } from "./token.ts";

export class Scanner {
  private tokens: Token[];
  private start: number;
  private current: number;
  private line: number;

  constructor(
    private readonly source: string,
  ) {
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  private scanToken() {
    switch (this.advance()) {
      case "[": {
        this.addToken(TokenType.LeftBrace);
        break;
      }
      case "]": {
        this.addToken(TokenType.RightBrace);
        break;
      }
      case "(": {
        this.addToken(TokenType.LeftParen);
        break;
      }
      case ")": {
        this.addToken(TokenType.RightParen);
        break;
      }
      case ",": {
        this.addToken(TokenType.Comma);
        break;
      }
      case ".": {
        this.addToken(TokenType.Dot);
        break;
      }
      case "-": {
        this.addToken(TokenType.Minus);
        break;
      }
      case "+": {
        this.addToken(TokenType.Plus);
        break;
      }
      case "*": {
        this.addToken(TokenType.Star);
        break;
      }
      case ";": {
        this.addToken(TokenType.Semicolon);
        break;
      }
      case ">": {
        this.addToken(this.match('=') ? TokenType.GreaterEqual : TokenType.Greater);
        break;
      }
      case "<": {
        this.addToken(this.match('=') ? TokenType.LessEqual : TokenType.Less);
        break;
      }
      case "=": {
        this.addToken(this.match('=') ? TokenType.EqualEqual : TokenType.Equal);
        break;
      }
      case "!": {
        this.addToken(this.match('=') ? TokenType.BangEqual : TokenType.Bang);
        break;
      }
    }
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;
    this.current++;
    return true;
  }

  private advance() {
    return this.source[this.current++];
  }

  private addToken(type: TokenType) {
    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push(
      new Token(type, lexeme, null, this.line),
    );
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }
}
