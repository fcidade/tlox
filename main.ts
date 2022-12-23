import { Lox } from "./lox.ts";

const main = () => {
  const lox = new Lox();
  if (Deno.args.length > 1) {
    console.log("Usage: tlox [sourcefile.tlox]");
    Deno.exit(64);
  } else if (Deno.args.length == 1) {
    lox.runFile(Deno.args[0]);
  } else {
    lox.runPrompt();
  }
};

main();
