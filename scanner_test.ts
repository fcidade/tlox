import { Scanner } from "./scanner.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { Token, TokenType } from "./token.ts";

const makeTestCase = (
  program: string,
  expectedTokensExceptEOF: Token[],
): [string, Token[]] => {
  return [program, [
    ...expectedTokensExceptEOF,
    new Token(TokenType.EOF, "", null, 1),
  ]];
};

Deno.test("Should parse single character tokens", () => {
  const cases: Array<[string, Token[]]> = [
    makeTestCase("[", [new Token(TokenType.LeftBrace, "[", null, 1)]),
    makeTestCase("]", [new Token(TokenType.RightBrace, "]", null, 1)]),
    makeTestCase("(", [new Token(TokenType.LeftParen, "(", null, 1)]),
    makeTestCase(")", [new Token(TokenType.RightParen, ")", null, 1)]),
    makeTestCase(",", [new Token(TokenType.Comma, ",", null, 1)]),
    makeTestCase(".", [new Token(TokenType.Dot, ".", null, 1)]),
    makeTestCase("-", [new Token(TokenType.Minus, "-", null, 1)]),
    makeTestCase("+", [new Token(TokenType.Plus, "+", null, 1)]),
    makeTestCase("*", [new Token(TokenType.Star, "*", null, 1)]),
    makeTestCase(";", [new Token(TokenType.Semicolon, ";", null, 1)]),
  ];

  cases.forEach(([program, expectedTokens]) => {
    const scanner = new Scanner(program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, expectedTokens);
  });
});

Deno.test("Should parse 'one or two' character tokens", () => {
  const cases: Array<[string, Token[]]> = [
    makeTestCase(">", [new Token(TokenType.Greater, ">", null, 1)]),
    makeTestCase(">=", [new Token(TokenType.GreaterEqual, ">=", null, 1)]),
    makeTestCase("<", [new Token(TokenType.Less, "<", null, 1)]),
    makeTestCase("<=", [new Token(TokenType.LessEqual, "<=", null, 1)]),
    makeTestCase("=", [new Token(TokenType.Equal, "=", null, 1)]),
    makeTestCase("==", [new Token(TokenType.EqualEqual, "==", null, 1)]),
    makeTestCase("!", [new Token(TokenType.Bang, "!", null, 1)]),
    makeTestCase("!=", [new Token(TokenType.BangEqual, "!=", null, 1)]),
  ];

  cases.forEach(([program, expectedTokens]) => {
    const scanner = new Scanner(program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, expectedTokens);
  });
});
