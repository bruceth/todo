import { TokenStream } from "./tokenStream";
import { ValueExpression } from "./expression";

export function test():string {
    try {
        let log = (text?:string) => {
            return false;
        };
        let ts = new TokenStream(log, 'a + 2 * [b] * 3');
        ts.readToken();
        let exp = new ValueExpression(ts);
        exp.parse();
        let s = null;
        return exp.run();
    }
    catch (err) {
        return 'error: ' + err;
    }
}
