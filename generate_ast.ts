#!/usr/bin/env -S deno run --allow-env
import { join } from "https://deno.land/std@0.170.0/path/posix.ts";

const defineAst = (outputDir: string, basename: string, types: string[]) => {
  const path = join(outputDir, `${basename}.ts`);
  let generated = `
import { Token } from "../token.ts";
export abstract class ${basename} {
}
`;

  Deno.writeTextFileSync(path, generated);
};

const main = () => {
  if (Deno.args.length !== 1) {
    console.log("Usage: generate_ast.ts");
    Deno.exit(64);
  }

  const outputDir = Deno.args[0];
  defineAst(outputDir, "Expr", [
    "Binary   : Expr left, Token operator, Expr right",
    "Grouping : Expr expression",
    "Literal  : Object value",
    "Unary    : Token operator, Expr right",
  ]);
};

main();
