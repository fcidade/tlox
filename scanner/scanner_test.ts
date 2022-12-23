import { Scanner } from "./scanner.ts";
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std@0.167.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import {
  assertSpyCall,
  assertSpyCalls,
  Spy,
  spy,
} from "https://deno.land/std@0.165.0/testing/mock.ts";
import { Token, TokenType } from "../token.ts";

const errorHandlerStub = {
  error: () => {},
};

const testCase = (
  program: string,
  expectedTokensExceptEOF: Token[],
): [string, Token[]] => {
  return [program, [
    ...expectedTokensExceptEOF,
    new Token(TokenType.EOF, "", null, 1),
  ]];
};

describe("Scanner", () => {
  let errorHandlerSpy: Spy | null = null;

  beforeEach(() => {
    errorHandlerSpy = spy(errorHandlerStub, "error");
  });

  afterEach(() => {
    errorHandlerSpy?.restore();
  });

  it("Should parse single or double character tokens", () => {
    const cases: Array<[string, Token[]]> = [
      testCase("[", [new Token(TokenType.LeftBrace, "[", null, 1)]),
      testCase("]", [new Token(TokenType.RightBrace, "]", null, 1)]),
      testCase("(", [new Token(TokenType.LeftParen, "(", null, 1)]),
      testCase(")", [new Token(TokenType.RightParen, ")", null, 1)]),
      testCase(",", [new Token(TokenType.Comma, ",", null, 1)]),
      testCase(".", [new Token(TokenType.Dot, ".", null, 1)]),
      testCase("-", [new Token(TokenType.Minus, "-", null, 1)]),
      testCase("+", [new Token(TokenType.Plus, "+", null, 1)]),
      testCase("*", [new Token(TokenType.Star, "*", null, 1)]),
      testCase("/", [new Token(TokenType.Slash, "/", null, 1)]),
      testCase(";", [new Token(TokenType.Semicolon, ";", null, 1)]),
      testCase(">", [new Token(TokenType.Greater, ">", null, 1)]),
      testCase(">=", [new Token(TokenType.GreaterEqual, ">=", null, 1)]),
      testCase("<", [new Token(TokenType.Less, "<", null, 1)]),
      testCase("<=", [new Token(TokenType.LessEqual, "<=", null, 1)]),
      testCase("=", [new Token(TokenType.Equal, "=", null, 1)]),
      testCase("==", [new Token(TokenType.EqualEqual, "==", null, 1)]),
      testCase("!", [new Token(TokenType.Bang, "!", null, 1)]),
      testCase("!=", [new Token(TokenType.BangEqual, "!=", null, 1)]),
    ];

    cases.forEach(([program, expectedTokens]) => {
      const scanner = new Scanner(errorHandlerStub, program);
      const tokens = scanner.scanTokens();

      assertEquals(tokens, expectedTokens);
    });

    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should parse identifiers", () => {
    const program = "iAmA_identifier";

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.Identifier, "iAmA_identifier", null, 1),
      new Token(TokenType.EOF, "", null, 1),
    ]);

    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should ignore single line comments", () => {
    const program = "// I'm a comment and i'll be ignored";

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.EOF, "", null, 1),
    ]);

    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should ignore multi line comments", () => {
    const program = `
/*
    I'm a multilien comment, just like in C
    And i should be completelly ignored!!!
*/
    `;

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.EOF, "", null, 6),
    ]);

    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should parse strings", () => {
    const program = '"i am a string"';

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.String, '"i am a string"', "i am a string", 1),
      new Token(TokenType.EOF, "", null, 1),
    ]);

    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should parse multiline strings", () => {
    const stringContent = `
    i am
     a 
     
     m
     u
     l
     t
     i
     liiiiiii
     ne
     
     
     string
    `;
    const program = `"${stringContent}"`;

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.String, `"${stringContent}"`, stringContent, 15),
      new Token(TokenType.EOF, "", null, 15),
    ]);
    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should parse integer numbers", () => {
    const program = "1977";

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.Number, "1977", 1977, 1),
      new Token(TokenType.EOF, "", null, 1),
    ]);
    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should parse decimal numbers", () => {
    const program = "1957.1234";

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.Number, "1957.1234", 1957.1234, 1),
      new Token(TokenType.EOF, "", null, 1),
    ]);
    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should parse keywords", () => {
    const cases: Array<[string, Token[]]> = [
      testCase("nil", [new Token(TokenType.Nil, "nil", null, 1)]),
      testCase("this", [new Token(TokenType.This, "this", null, 1)]),
      testCase("super", [new Token(TokenType.Super, "super", null, 1)]),
      testCase("true", [new Token(TokenType.True, "true", null, 1)]),
      testCase("false", [new Token(TokenType.False, "false", null, 1)]),
      testCase("and", [new Token(TokenType.And, "and", null, 1)]),
      testCase("or", [new Token(TokenType.Or, "or", null, 1)]),
      testCase("var", [new Token(TokenType.Var, "var", null, 1)]),
      testCase("if", [new Token(TokenType.If, "if", null, 1)]),
      testCase("else", [new Token(TokenType.Else, "else", null, 1)]),
      testCase("for", [new Token(TokenType.For, "for", null, 1)]),
      testCase("while", [new Token(TokenType.While, "while", null, 1)]),
      testCase("fun", [new Token(TokenType.Function, "fun", null, 1)]),
      testCase("return", [new Token(TokenType.Return, "return", null, 1)]),
      testCase("class", [new Token(TokenType.Class, "class", null, 1)]),
      testCase("print", [new Token(TokenType.Print, "print", null, 1)]),
    ];

    cases.forEach(([program, expectedTokens]) => {
      const scanner = new Scanner(errorHandlerStub, program);
      const tokens = scanner.scanTokens();

      assertEquals(tokens, expectedTokens);
    });
    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should always append a EOF to the end of the token list", () => {
    const program = "";
    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.EOF, "", null, 1),
    ]);
    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should increase line counter everytime a line breaks", () => {
    const program = Array.from({ length: 15 }).fill("\n").join("");

    const scanner = new Scanner(errorHandlerStub, program);
    const tokens = scanner.scanTokens();

    assertEquals(tokens, [
      new Token(TokenType.EOF, "", null, 16),
    ]);
    assertSpyCalls(errorHandlerSpy!, 0);
  });

  it("Should report error if a string is unterminated", () => {
    const program = '"unterminated string';
    const scanner = new Scanner(errorHandlerStub, program);

    scanner.scanTokens();

    assertSpyCall(errorHandlerSpy!, 0, { args: [1, "unterminated string"] });
  });

  it("Should report error if a character is unexpected", () => {
    const program = "$";
    const scanner = new Scanner(errorHandlerStub, program);

    scanner.scanTokens();

    assertSpyCall(errorHandlerSpy!, 0, {
      args: [1, "unexpected character: $"],
    });
  });

  /*
    - Multi line comments
    - Increase line counters
  */
});
