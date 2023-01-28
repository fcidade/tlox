import { Parser } from "./parser/parser.ts";
import { Scanner } from "./scanner/scanner.ts";
import { Token } from "./token.ts";
import {AstPrinter} from "./parser/ast_printer.ts"

export class Lox {
  static hadError: boolean;

  static error(line: number, message: string) {
    Lox.report(line, "", message);
  }

  static parserError(token: Token, message: string) {
    if (token.type) {
      this.report(token.line, " at end", message);
    } else {
      this.report(token.line, ` at '${token.lexeme}'`, message);
    }
  }

  private static report(line: number, where: string, message: string) {
    console.log(
      `[line ${line}] Error${where}: ${message}`,
    );
    Lox.hadError = true;
  }

  run(source: string) {
    const scanner = new Scanner(Lox, source);
    const tokens = scanner.scanTokens();

    console.log(tokens);

    const parser = new Parser(tokens);
    const expression = parser.parse();

    

    if (Lox.hadError || !expression) return;

    console.log(new AstPrinter().print(expression));
  }

  runFile(filePath: string) {
    const source = Deno.readFileSync(filePath);
    this.run(source.toString());
    if (Lox.hadError) {
      Deno.exit(65);
    }
  }

  runPrompt() {
    while (true) {
      const line = prompt("> ");
      if (!line) {
        break;
      }
      this.run(line);
      Lox.hadError = false;
    }
  }
}
