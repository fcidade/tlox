export enum TokenType  {
    // Single Character Tokens
    LeftBrace, RightBrace,
    LeftParen, RightParen,
    Comma, Dot,
    Minus, Plus,
    Star, Slash,
    Semicolon,

    // One Or TWo Character Tokens
    Greater, GreaterEqual,
    Less, LessEqual,
    Equal, EqualEqual,
    Bang, BangEqual,

    // Literals
    Identifier,
    String,
    Number,

    // Keywords]
    Nil,
    This,
    Super,
    True,
    False,
    And,
    Or,
    Var,
    If,
    Else,
    For,
    While,
    Function,
    Return,
    Class,
    Print,

    // End of File
    EOF
}

export class Token {
    constructor(
        private readonly type: TokenType,
        private readonly value: string,
    ){}
}