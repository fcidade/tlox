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
    const currChar = this.advance();
    switch (currChar) {
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
        this.addToken(
          this.match("=") ? TokenType.GreaterEqual : TokenType.Greater,
        );
        break;
      }
      case "<": {
        this.addToken(this.match("=") ? TokenType.LessEqual : TokenType.Less);
        break;
      }
      case "=": {
        this.addToken(this.match("=") ? TokenType.EqualEqual : TokenType.Equal);
        break;
      }
      case "!": {
        this.addToken(this.match("=") ? TokenType.BangEqual : TokenType.Bang);
        break;
      }
    }

    if (this.isNumber(currChar)) {
      this.scanNumber();
    } else if (this.isAlphaNumeric(currChar)) {
      this.scanIdentifier();
    }

    this.scanString(currChar);
  }

  private scanString(currChar: string) {
    if (currChar === '"') {
      while (this.advance() !== '"');
      const literal = this.source.substring(this.start + 1, this.current - 1);
      this.addTokenWithLiteral(TokenType.String, literal);
    }
  }

  private scanIdentifier() {
    while (this.isAlphaNumeric(this.advance()));
    this.addToken(TokenType.Identifier);
  }

  private scanNumber() {
    while (this.isNumber(this.advance()));
    const literal = Number(this.source.substring(this.start, this.current));
    this.addTokenWithLiteral(TokenType.Number, literal);
  }

  private isAlphaNumeric(character: string): boolean {
    return this.isAlpha(character) || this.isNumber(character);
  }

  private isNumber(character: string): boolean {
    return (character >= "0" && character <= "9");
  }

  private isAlpha(character: string): boolean {
    return (character >= "a" && character <= "z") ||
      (character >= "A" && character <= "Z") ||
      character === "_";
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

  private addTokenWithLiteral(type: TokenType, literal: TokenLiteral) {
    const lexeme = this.source.substring(this.start, this.current);
    this.tokens.push(
      new Token(type, lexeme, literal, this.line),
    );
  }

  private addToken(type: TokenType) {
    this.addTokenWithLiteral(type, null);
  }

  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }
}
