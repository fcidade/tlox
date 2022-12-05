import { Token, TokenType } from "./token.ts";

export class Scanner {
  private cursor: number;
  private tokens: Token[];

  constructor(
    private readonly source: string,
  ) {
    this.cursor = 0;
    this.tokens = [];
  }

  tokenize(): Token[] {
    while (this.cursor < this.source.length) {
      if (this.getCurrentChar() === "/" && this.peekNextChar() === "/") {
        while (this.getCurrentChar() !== "\n") {
          this.cursor++;
        }
        this.cursor++;
      }

      if (this.getCurrentChar() === '"') {
        this.cursor++;
        const stringStart = this.cursor;
        while (this.peekNextChar() !== '"') {
          this.cursor++;
        }
        this.tokens.push(
          new Token(
            TokenType.String,
            this.source.substring(stringStart, this.cursor + 1),
          ),
        );
        this.cursor++;
      }

      if (this.getCurrentChar().match(/[a-zA-Z]/)) {
        const identifierStart = this.cursor;
        this.cursor++;
        while (this.getCurrentChar().match(/[a-zA-Z0-9]/)) {
          this.cursor++;
        }

        const keywordsMap: Record<string, TokenType> = {
          "nil": TokenType.Nil,
          "this": TokenType.This,
          "super": TokenType.Super,
          "true": TokenType.True,
          "false": TokenType.False,
          "and": TokenType.And,
          "or": TokenType.Or,
          "var": TokenType.Var,
          "if": TokenType.If,
          "else": TokenType.Else,
          "for": TokenType.For,
          "while": TokenType.While,
          "function": TokenType.Function,
          "return": TokenType.Return,
          "class": TokenType.Class,
          "print": TokenType.Print,
        };

        const identifier = this.source.substring(identifierStart, this.cursor);

        const tokenType = keywordsMap[identifier] ?? TokenType.Identifier;
        
        this.tokens.push(
          new Token(
            tokenType,
            identifier,
          ),
        );
      }

      const singleCharacterToken =
        singleCharacterTokensMap[this.getCurrentChar()];
      if (singleCharacterToken) {
        const doubleChar =
          doubleCharMap[this.getCurrentChar() + this.peekNextChar()];

        if (doubleChar) {
          this.doubleCharacterToken(doubleChar);
          this.cursor++;
        } else {
          this.singleCharacterToken(singleCharacterToken);
        }
      }

      this.cursor++;
    }
    this.tokens.push(
      new Token(
        TokenType.EOF,
        "EOF",
      ),
    );

    return this.tokens;
  }

  private singleCharacterToken(tokenType: TokenType) {
    this.tokens.push(new Token(tokenType, this.getCurrentChar()));
  }

  private doubleCharacterToken(tokenType: TokenType) {
    this.tokens.push(
      new Token(tokenType, this.getCurrentChar() + this.peekNextChar()),
    );
  }

  private getCurrentChar(): string {
    return this.source[this.cursor];
  }

  private peekNextChar(): string {
    return this.source[this.cursor + 1];
  }
}

const singleCharacterTokensMap: Record<string, TokenType> = {
  "{": TokenType.LeftBrace,
  "}": TokenType.RightBrace,
  "(": TokenType.LeftParen,
  ")": TokenType.RightParen,
  ",": TokenType.Comma,
  ".": TokenType.Dot,
  "+": TokenType.Plus,
  "-": TokenType.Minus,
  "*": TokenType.Star,
  "/": TokenType.Slash,
  ";": TokenType.Semicolon,
  "<": TokenType.Slash,
  ">": TokenType.Semicolon,
  "=": TokenType.Slash,
  "!": TokenType.Semicolon,
};

const doubleCharMap: Record<string, TokenType> = {
  ">=": TokenType.GreaterEqual,
  "<=": TokenType.LessEqual,
  "==": TokenType.EqualEqual,
  "!=": TokenType.BangEqual,
};
