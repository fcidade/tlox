import { Scanner } from "./scanner.ts"
import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";

Deno.test("TODO", () => {
    const program = `
class Brunch < Breakfast {
    init(meat, bread, drink) {
        super.init(meat, bread);
        this.drink = drink;
        this.astrng = "HELLO I AM A STRING"
        if (1 == 2) {
            if (2 != 3 and 2 < 2 and 5 > 10 or 20 <= 2 and 30 >= 12) {
                print "YES"
            }
            // hey iam a comment and should not be printed
        }
        this.anotherstrng = "HELLO Iaa a a another AM A STRING"
    }
}
    `
    console.log(program)
    const scanner = new Scanner(program)
    const tokens = scanner.tokenize()
    console.log(tokens)
})