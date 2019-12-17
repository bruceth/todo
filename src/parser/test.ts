import { TokenStream } from "./tokenStream";
import { ValueExpression } from "./expression";

export function test() {
    let log = (text?:string) => {
        return false;
    };
    let ts = new TokenStream(log, '1+2');
    ts.readToken();
    let exp = new ValueExpression(ts);
    exp.parse();
    let s = null;
}
