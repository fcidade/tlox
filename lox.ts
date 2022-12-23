import { Scanner } from "./scanner.ts";


export class Lox {
  static hadError: boolean;

  static error(line: number, message: string) {
    Lox.report(line, "", message);
  }

  private static report(line: number, where: string, message: string) {
    console.log(
      `[line ${line}] Error${where}: ${message}`
    );
    Lox.hadError = true;
  }

  run(source: string) {
    const scanner = new Scanner(Lox, source);
    const tokens = scanner.scanTokens();
    console.log(tokens);
  }

  runFile(filePath: string) {
    const source = Deno.readFileSync(filePath);
    this.run(source.toString());
    if(Lox.hadError) {
      Deno.exit(65);
    }
  }

  runPrompt() {
    while(true) {
      const line = prompt("> ");
      if(!line)
        break;
      this.run(line);
      Lox.hadError = false;
    }
  }
}
