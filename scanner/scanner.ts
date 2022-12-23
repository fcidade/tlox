import { Token, TokenLiteral, TokenType } from "../token.ts";

export interface ErrorHandler {
  error(line: number, message: string): void;
}

export class Scanner {
  private tokens: Token[];
  private start: number;
  private current: number;
  private line: number;

  constructor(
    private readonly errorHandler: ErrorHandler,
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
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n": {
        this.line++;
        break;
      }
      case "/": {
        if (this.match("/")) {
          this.ignoreSingleLineComment();
        } else if (this.match("*")) {
          this.ignoreMultiLineComment();
        } else {
          this.addToken(TokenType.Slash);
        }
        break;
      }
      case '"': {
        this.scanString();
        break;
      }
      default: {
        if (this.isNumber(currChar)) {
          this.scanNumber();
        } else if (this.isAlphaNumeric(currChar)) {
          this.scanIdentifier();
        } else {
          this.errorHandler.error(
            this.line,
            "unexpected character: " + currChar,
          );
        }
      }
    }
  }

  private ignoreMultiLineComment() {
    while(this.peek() !== "*" && this.peekNext() !== "/") {
      if(this.peek() === "\n")
        this.line++;
      this.advance();
    }
    this.advance();
    this.advance();
  }

  private ignoreSingleLineComment() {
    while (this.peek() !== "\n" && !this.isAtEnd()) {
      this.advance();
    }
  }

  private scanString() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.line++;
      this.advance();
    }

    if (this.peek() !== '"') {
      this.errorHandler.error(this.line, "unterminated string");
    }
    this.advance(); // Closing "

    const literal = this.source.substring(this.start + 1, this.current - 1);
    this.addTokenWithLiteral(TokenType.String, literal);
  }

  private scanIdentifier() {
    while (this.isAlphaNumeric(this.advance()));

    const keywords: Record<string, TokenType> = {
      nil: TokenType.Nil,
      this: TokenType.This,
      super: TokenType.Super,
      true: TokenType.True,
      false: TokenType.False,
      and: TokenType.And,
      or: TokenType.Or,
      var: TokenType.Var,
      if: TokenType.If,
      else: TokenType.Else,
      for: TokenType.For,
      while: TokenType.While,
      fun: TokenType.Function,
      return: TokenType.Return,
      class: TokenType.Class,
      print: TokenType.Print,
    };

    const identifier = this.source.substring(this.start, this.current);
    if (identifier in keywords) {
      this.addToken(keywords[identifier]);
    } else {
      this.addToken(TokenType.Identifier);
    }
  }

  private scanNumber() {
    while (this.isNumber(this.peek())) this.advance();
    if (this.peek() === "." && this.isNumber(this.peekNext())) {
      this.advance();
      while (this.isNumber(this.advance()));
    }

    const literal = Number(this.source.substring(this.start, this.current));
    this.addTokenWithLiteral(TokenType.Number, literal);
  }

  // Helpers --

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

  private peek() {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current];
  }

  private peekNext() {
    if (this.current + 1 > this.source.length) return "\0";
    return this.source[this.current + 1];
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
