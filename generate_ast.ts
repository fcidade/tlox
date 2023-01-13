#!/usr/bin/env -S deno run --allow-write
import { join } from "https://deno.land/std@0.170.0/path/posix.ts";

class AstGenerator {
  private generatedString = "";

  generate(outputDir: string) {
    this.defineAst(outputDir, "Expr", [
      "Binary   ; left: Expr, operator: Token, right: Expr",
      "Grouping ; expression: Expr",
      "Literal  ; value: any",
      "Unary    ; operator: Token, right: Expr",
    ]);
  }

  defineAst(outputDir: string, baseName: string, types: string[]) {
    const path = join(outputDir, `${baseName.toLowerCase()}.ts`);

    this.appendln('import { Token } from "../token.ts";\n');

    this.appendln(`export abstract class ${baseName} {`);
    this.appendln("  abstract accept<R>(visitor: Visitor<R>): R;");
    this.appendln("}\n");

    this.defineVisitor(baseName, types);

    types.forEach((type) => {
      const className = type.split(";")[0].trim();
      const fields = type.split(";")[1].trim();
      this.defineType(baseName, className, fields);
    });

    Deno.writeTextFileSync(path, this.generatedString);
  }

  defineVisitor(baseName: string, types: string[]) {
    this.appendln("export interface Visitor<R> {");
    types.forEach((type) => {
      const typeName = type.split(";")[0].trim();
      this.appendln(
        `  visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}): R;`,
      );
    });
    this.appendln("}\n");
  }

  defineType(baseName: string, className: string, fields: string) {
    this.appendln(`export class ${className} extends ${baseName} {`);

    this.appendln(`  constructor(`);
    fields.split(", ").forEach((field) => {
      const name = field.split(" ")[0];
      const type = field.split(" ")[1];
      this.appendln(`    readonly ${name} ${type},`);
    });
    this.appendln(`  ) {`);
    this.appendln(`    super();`);
    this.appendln("  }\n");

    this.appendln("  accept<R>(visitor: Visitor<R>): R {");
    this.appendln(`    return visitor.visit${className}${baseName}(this);`);
    this.appendln("  }\n}\n");
  }

  append(text: string) {
    this.generatedString += text;
  }

  appendln(text: string) {
    this.append(text + "\n");
  }
}

const main = () => {
  if (Deno.args.length !== 1) {
    console.log("Usage: generate_ast.ts");
    Deno.exit(64);
  }

  const outputDir = Deno.args[0];
  const astGenerator = new AstGenerator();
  astGenerator.generate(outputDir);
};

main();
