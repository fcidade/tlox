import { Lox } from "../lox.ts";
import { Token, TokenType } from "../token.ts";
import { Binary, Expr, Grouping, Literal, Unary } from "./expr.ts";

export class ParseError extends Error {
  constructor() {
    super();
  }
}

export class Parser {
  current = 0;

  constructor(
    private readonly tokens: Token[],
  ) {}

  parse(): Expr | null {
    try {
      return this.expression();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  expression(): Expr {
    return this.equality();
  }

  equality(): Expr {
    let expr = this.comparison();
    while (this.match(TokenType.BangEqual, TokenType.EqualEqual)) {
      const operator = this.previous();
      const right = this.comparison();
      expr = new Binary(expr, operator, right);
    }
    return expr;
  }

  comparison(): Expr {
    let expr = this.term();

    while (
      this.match(
        TokenType.Greater,
        TokenType.GreaterEqual,
        TokenType.Less,
        TokenType.LessEqual,
      )
    ) {
      const operator = this.previous();
      const right = this.term();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type == TokenType.Semicolon) return;
      switch (this.peek().type) {
        case TokenType.Class:
        case TokenType.Fun:
        case TokenType.Var:
        case TokenType.For:
        case TokenType.If:
        case TokenType.While:
        case TokenType.Print:
        case TokenType.Return:
          return;
      }
      this.advance();
    }
  }

  term(): Expr {
    let expr = this.factor();

    while (
      this.match(
        TokenType.Minus,
        TokenType.Plus,
      )
    ) {
      const operator = this.previous();
      const right = this.factor();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  factor(): Expr {
    let expr = this.unary();

    while (
      this.match(
        TokenType.Slash,
        TokenType.Star,
      )
    ) {
      const operator = this.previous();
      const right = this.unary();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  unary(): Expr {
    while (
      this.match(
        TokenType.Bang,
        TokenType.Minus,
      )
    ) {
      const operator = this.previous();
      const right = this.unary();
      return new Unary(operator, right);
    }

    return this.primary();
  }

  primary(): Expr {
    if (this.match(TokenType.False)) return new Literal(false);
    if (this.match(TokenType.True)) return new Literal(true);
    if (this.match(TokenType.Nil)) return new Literal(null);

    if (this.match(TokenType.Number, TokenType.String)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.LeftParen)) {
      const expr = this.expression();
      this.consume(TokenType.RightParen, "Expect ')' after expression.");
      return new Grouping(expr);
    }
    console.log("teste", this.peek());

    throw this.error(this.peek(), "Expect expression.");
  }

  consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw this.error(this.peek(), message);
  }

  error(token: Token, message: string): ParseError {
    Lox.parserError(token, message);
    return new ParseError();
  }

  match(...types: TokenType[]): boolean {
    return types.some((type) => {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    });
  }

  check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type == type;
  }

  advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd(): boolean {
    return this.peek().type == TokenType.EOF;
  }

  peek(): Token {
    return this.tokens[this.current];
  }

  previous(): Token {
    return this.tokens[this.current - 1];
  }
}
