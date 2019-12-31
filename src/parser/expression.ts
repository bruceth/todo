import _ from 'lodash';
import { Token } from "./token";
import { TokenStream } from './tokenStream';
import { Atom, 
    OpAdd, OpSub, OpBitwiseOr, OpAnd, OpBitwiseAnd, 
    OpBrace, OpDiv, OpDollarVar, OpEQ, OpFunction, OpGE, OpGT, 
    OpLE, OpLT, OpMod, OpMul, OpNE, OpNeg, OpNot, OpOr,
    TextOperand, NumberOperand, HexOperand, VarOperand
} from './atom';

export abstract class Expression
{
    protected ts: TokenStream;
    protected at: number;
    protected line: number;
    protected sourceStart: number;
    private atoms: Atom[] = [];

    constructor(ts: TokenStream) {
        this.ts = ts;
    }
    run():string {
        let result:string = '';
        for (let atom of this.atoms) {
            result += atom.str() + ' ';
        }
        return result;
    }

    protected savePos() {
        this.at = this.ts.prevAt;
        this.line = this.ts.prevLine;
        this.sourceStart = this.ts.LastP - 1;
    }

    protected getSource() {
        return this.ts.getSourceAt(this.sourceStart);
    }

    private errorAt() {
        let line = this.ts.startLine+1;
        let at = this.ts.startAt + 1;
        return this.ts.file + ' 错误在'+line+'行'+at+'列: \n' + this.ts.getSourceNearby(this.sourceStart) + '\n';
    }

    log(...msg:string[]) {
        let err:string;
        if (this.line === undefined)
            err = msg.join('');
        else {
            let line = this.line + 1;
            let at = this.at + 1;
            err = this.ts.file + ' 错误在'+line+'行'+at+'列: \n'
                + this.ts.getSourceNearby(this.sourceStart) + '\n'
                + msg.join('\n');
        }
        this.ts.log(err);
    }

    msg(...msg:string[]) {
        let err:string;
        if (this.line === undefined)
            err = msg.join('');
        else {
            let line = this.line + 1;
            let at = this.at + 1;
            err = this.ts.file + ' 提醒在'+line+'行'+at+'列: '+msg.join('');
        }
        this.ts.log(err);
    }

    error(...msg:string[]) {
        let err = this.errorAt()+msg.join('');
        this.ts.log(err);
        throw err;
    }

    expectToken(...tokens:Token[]) {
        let err = this.errorAt()+'应该是'+tokens.map(v => Token[v]).join('或');
        this.ts.log(err);
        throw err;
    }

    expect(...msg:string[]) {
        let err = this.errorAt() + '应该是'+msg.join('或');
        this.ts.log(err);
        throw err;
    }

    private add(atom: Atom) {
        this.atoms.push(atom);
    }

    protected abstract entry():void;

    parse() {
        this._parse();
    }

    protected _parse() {
        this.entry();
    }

    protected expCompare()
    {
        this.B();
        for (; ; )
        {
            if (this.ts.token === Token.OR || this.ts.isKeyword('or') === true) {
                this.ts.readToken();
                this.B();
                this.add(new OpOr());
            }
            else break;
        }
    }

    private B()
    {
        this.C();
        for (; ; )
        {
            if (this.ts.token === Token.AND || this.ts.isKeyword('and') === true) {
                this.ts.readToken();
                this.C();
                this.add(new OpAnd());
            }
            else break;
        }
    }

    private C()
    {
        if (this.ts.token == Token.NOT ||
            this.ts.isKeyword('not'))
        {
            this.ts.readToken();
            this.C();
            this.add(new OpNot());
            return;
        }
        this.expValue();
        switch (this.ts.token)
        {
            default:
                break;
            case Token.LE:
                this.ts.readToken();
                this.expValue();
                this.add(new OpLE());
                break;
            case Token.LT:
                this.ts.readToken();
                this.expValue();
                this.add(new OpLT());
                break;
            case Token.EQU:
                this.ts.readToken();
                this.expValue();
                this.add(new OpEQ());
                break;
            case Token.NE:
                this.ts.readToken();
                this.expValue();
                this.add(new OpNE());
                break;
            case Token.GT:
                this.ts.readToken();
                this.expValue();
                this.add(new OpGT());
                break;
            case Token.GE:
                this.ts.readToken();
                this.expValue();
                this.add(new OpGE());
                break;
        }
    }

    protected expValue()
    {
        this.t();
        for (; ; )
        {
            switch (this.ts.token)
            {
                default:
                    return;
                case Token.ADD:
                    this.ts.readToken();
                    this.t();
                    this.add(new OpAdd());
                    break;
                case Token.SUB:
                    this.ts.readToken();
                    this.t();
                    this.add(new OpSub());
                    break;
            }
        }
    }

    private t()
    {
        this.bitWise();
        for (; ; )
        {
            switch (this.ts.token)
            {
                default:
                    return;
                case Token.MUL:
                    this.ts.readToken();
                    this.bitWise();
                    this.add(new OpMul());
                    break;
                case Token.DIV:
                    this.ts.readToken();
                    this.bitWise();
                    this.add(new OpDiv());
                    break;
                case Token.MOD:
                    this.ts.readToken();
                    this.bitWise();
                    this.add(new OpMod());
                    break;
            }
        }
    }

    private bitWise()
    {
        this.f();
        for (; ; )
        {
            switch (this.ts.token)
            {
                default: return;
                case Token.BITWISEAND:
                    this.ts.readToken();
                    this.f();
                    this.add(new OpBitwiseAnd());
                    break;
                case Token.BITWISEOR:
                    this.ts.readToken();
                    this.f();
                    this.add(new OpBitwiseOr());
                    break;
            }
        }
    }

    private f()
    {
        let lowerVar:string;
        switch (this.ts.token) {
            case Token.SUB:
                this.ts.readToken();
                this.f();
                this.add(new OpNeg());
                return;
            case Token.LPARENTHESE:
                this.ts.readToken();
                this.entry();
                if (this.ts.token === Token.RPARENTHESE as any)
                {
                    let op = new OpBrace();
                    this.add(op);
                    this.ts.readToken();
                    return;
                }
                this.expectToken(Token.RPARENTHESE);
                return;
            case Token.STRING:
                this.add(new TextOperand(this.ts.text));
                this.ts.readToken();
                return;
            case Token.NUM:
                this.add(new NumberOperand(this.ts.dec));
                this.ts.readToken();
                return;
            case Token.HEX:
                this.add(new HexOperand(this.ts.text));
                this.ts.readToken();
                return;
            case Token.DOLLARVAR:
                //this.ts.readToken();
                //if (this.ts.token !== Token.VAR as any) this.expect('变量名');
                lowerVar = this.ts.lowerVar.substr(1);
                if (OpDollarVar.isValid(lowerVar) === false) {
                    this.error(lowerVar + '不是系统变量');
                }
                this.add(new OpDollarVar(lowerVar));
                this.ts.readToken();
                return;
            case Token.VAR:
                lowerVar = this.ts.lowerVar;
                this.ts.readToken();
                switch (this.ts.token as any) {
                    default:
                        let op = new VarOperand();
                        op._var.push(lowerVar);
                        this.add(op);
                        return;
                    case Token.LPARENTHESE:
                        this.func(lowerVar);
                        return;
                }
            default:
                this.error('语法错误', this.ts._var);
                return;
        }
    }

    static funcs:{[name:string]:number|number[]} = {
        concat: -1,
        concat_ws: -1,
        now: 0,
        substr: [2,3],
        unix_timestamp: [0,1],
    };
    private func(func:string) {
        this.ts.readToken();
        if (this.predefinedFunc(func) === true) return;
        
        let v = Expression.funcs[func];
        if (v === undefined) {
            this.error('未知的函数 ' + func);
        }
        let paramCount = this.readFuncParameters();
        this.add(new OpFunction(func, paramCount));
        if (Array.isArray(v)) {
            let min = v[0], max = v[1];
            if (paramCount < min) {
                this.error('函数 ' + func + ' 至少 ' + min + '个参数');
            }
            else if (paramCount > max) {
                this.error('函数 ' + func + ' 最多 ' + max + '个参数');
            }
        }
        else if (v >= 0 && v !== paramCount) {
            this.error('函数 ' + func + ' 只能是 ' + v + '个参数');
        }
    }
    private predefinedFunc(func:string):boolean
    {
        let paramCount = 0;
        switch (func)
        {
            default:
                return false;
            case 'year':
            case 'month':
            case 'day':
            case 'len':
            case 'ltrim':
            case 'rtrim':
            case 'from_unixtime':
                this.ReadFixCountFunc(func, 1);
                break;
            case 'rand':
                this.ReadFixCountFunc(func, 0);
                break;
            case 'left':
            case 'right':
            case 'ifnull':
            case 'round':
                this.ReadFixCountFunc(func, 2);
                break;
            case 'replace':
            case 'substring':
                this.ReadFixCountFunc(func, 3);
                break;
            case 'charindex':
                this.ReadVariableParameters(func, 2, 3);
                break;
        }
        return true;
    }

    ReadFixCountFunc(func:string, count:number)
    {
        let paramCount = this.readFuncParameters();
        if (count != paramCount) this.error('函数'+func+'需要'+count+'个参数');
        this.add(new OpFunction(func, count));
    }

    ReadVariableParameters(func:string, min:number, max:number)
    {
        let paramCount = this.readFuncParameters();
        if (paramCount < min) this.error('函数'+func+'至少需要'+min+'个参数');
        if (paramCount > max) this.error('函数'+func+'最多需要'+max+'个参数');
        this.add(new OpFunction(func, paramCount));
    }

    private readFuncParameters():number
    {
        if (this.ts.token == Token.RPARENTHESE)
        {
            this.ts.readToken();
            return 0;
        }
        let n = 0;
        for (; ; )
        {
            this.expValue();
            n++;
            if (this.ts.token == Token.COMMA)
            {
                this.ts.readToken();
                continue;
            }
            if (this.ts.token as any == Token.RPARENTHESE)
            {
                this.ts.readToken();
                break;
            }
            this.expectToken(Token.COMMA, Token.RPARENTHESE);
        }
        return n;
    }

    static OperationExpression()
    {
        // Array.Sort<string>(DATEPARTS, StringComparer.CurrentCultureIgnoreCase);
    }
}

export class ValueExpression extends Expression {
    entry() {
        this.expValue();
    }
}

export class CompareExpression extends Expression {
    entry() {
        this.expCompare();
    }
}
