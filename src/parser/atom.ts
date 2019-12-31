export interface Stack {
    or():void;
    and():void;
    not():void;
    le():void;
    lt():void;
    eq():void;
    ne():void;
    gt():void;
    ge():void;
    neg():void;
    add():void;
    sub():void;
    mul():void;
    div():void;
    mod():void;
    bitAnd():void;
    bitOr():void;
    str(val:string):void;
    num(val:number):void;
    star():void;
    hex(val:string):void;
    datePart(part:string):void;
    isNull():void;
    isNotNull():void;
    exists():void;
    in(params:number):void;
    like():void;
    searchCase(whenCount:number, hasElse:boolean):void;
    simpleCase(whenCount:number, hasElse:boolean):void;
    func(func:string, n:number):void;

    var(name:string):void;
    field(name:string, tbl?:string):void;
    dollarVar(name:string):void;
}

export class RunStack implements Stack {
    private stack:string[] = [];
    private queue:string[] = [];

    getResult():string {return this.stack[0]}

    or():void {}
    and():void {}
    not():void {}
    le():void {}
    lt():void {}
    eq():void {}
    ne():void {}
    gt():void {}
    ge():void {}
    neg():void {}
    add():void {}
    sub():void {}
    mul():void {}
    div():void {}
    mod():void {}
    bitAnd():void {}
    bitOr():void {}
    str(val:string):void {}
    num(val:number):void {this.stack.push('#'+val);}
    star():void {}
    hex(val:string):void {}
    datePart(part:string):void {}
    isNull():void {}
    isNotNull():void {}
    exists():void {}
    in(params:number):void {}
    like():void {}
    searchCase(whenCount:number, hasElse:boolean):void {}
    simpleCase(whenCount:number, hasElse:boolean):void {}
    func(func:string, n:number):void {}

    var(name:string):void {}
    field(name:string, tbl?:string):void {}
    dollarVar(name:string):void {}
}

export abstract class Atom {
    abstract to(stack: Stack):void;
    abstract str():string;
}

export class OpOr extends Atom {
    to(stack: Stack) {stack.or();}
    str():string {return '||'}
}
export class OpAnd extends Atom {
    to(stack: Stack) {stack.and();}
    str():string {return '&&'}
}
export class OpNot extends Atom {
    to(stack: Stack) {stack.not();}
    str():string {return '!'}
}
export class OpLE extends Atom {
    to(stack: Stack) {stack.le();}
    str():string {return '<='}
}
export class OpLT extends Atom {
    to(stack: Stack) {stack.lt();}
    str():string {return '<'}
}
export class OpEQ extends Atom {
    to(stack: Stack) {stack.eq();}
    str():string {return '='}
}
export class OpNE extends Atom {
    to(stack: Stack) {stack.ne();}
    str():string {return '<>'}
}
export class OpGT extends Atom {
    to(stack: Stack) {stack.gt();}
    str():string {return '>'}
}
export class OpGE extends Atom {
    to(stack: Stack) {stack.ge();}
    str():string {return '>='}
}
export class OpAdd extends Atom {
    to(stack: Stack) {stack.add();}
    str():string {return '+'}
}
export class OpSub extends Atom {
    to(stack: Stack) {stack.sub();}
    str():string {return '-'}
}
export class OpMul extends Atom {
    to(stack: Stack) {stack.mul();}
    str():string {return '*'}
}
export class OpDiv extends Atom {
    to(stack: Stack) {stack.div();}
    str():string {return '/'}
}
export class OpMod extends Atom {
    to(stack: Stack) {stack.mod();}
    str():string {return '%'}
}
export class OpBitwiseAnd extends Atom {
    to(stack: Stack) {stack.bitAnd();}
    str():string {return '&'}
}
export class OpBitwiseOr extends Atom {
    to(stack: Stack) {stack.bitOr();}
    str():string {return '|'}
}
export class OpNeg extends Atom {
    to(stack: Stack) {stack.neg();}
    str():string {return '-'}
}
export class OpBrace extends Atom {
    to(stack: Stack) {}
    str():string {return '()'}
}
export class TextOperand extends Atom {
    text:string;
    constructor(text:string) {
        super();
        this.text = text;
    }
    to(stack: Stack) {stack.str(this.text);}
    str():string {return '\'' + this.text + '\''}
}
export class NumberOperand extends Atom {
    num:number;
    constructor(num:number) {
        super();
        this.num = num;
    }
    to(stack: Stack) {stack.num(this.num);}
    str():string {return String(this.num)}
}
export class HexOperand extends Atom {
    text:string;
    constructor(text:string) {
        super();
        this.text = text;
    }
    to(stack: Stack) {stack.hex(this.text);}
    str():string {return '#h'}
}
export class NullOperand extends Atom {
    to(stack: Stack) { stack.hex('null'); }
    str():string {return 'null'}
}
export class VarOperand extends Atom {
    get type():string {return 'var';}
    dotFirst: boolean = false;
    _var: string[] = [];
    to(stack: Stack) {}
    str():string {return this._var.join('.')}
}
export class OpSearchCase extends Atom {
    whenCount: number;
    hasElse: boolean;
    constructor(whenCount: number, hasElse: boolean) {
        super();
        this.whenCount = whenCount;
        this.hasElse = hasElse;
    }
    to(stack: Stack) { stack.searchCase(this.whenCount, this.hasElse); }
    str():string {return 'case'}
}
export class OpSimpleCase extends Atom {
    whenCount: number;
    hasElse: boolean;
    constructor(whenCount: number, hasElse: boolean) {
        super();
        this.whenCount = whenCount;
        this.hasElse = hasElse;
    }
    to(stack: Stack) { stack.simpleCase(this.whenCount, this.hasElse); }
    str():string {return 'case'}
}
export class OpFunction extends Atom {
    func: string;
    paramCount: number;
    constructor(func: string, paramCount: number) {
        super();
        this.func = func;
        this.paramCount = paramCount;
    }
    to(stack: Stack) {stack.func(this.func, this.paramCount)}
    str():string {return this.func}
}
export class StarOperand extends Atom {
    to(stack: Stack) {stack.star();}
    str():string {return '*'}
}
export class DatePartOperand extends Atom {
    datePart: string;
    constructor(datePart: string) {
        super();
        this.datePart = datePart;
    }
    to(stack: Stack) {stack.datePart(this.datePart)}
    str():string {return this.datePart}
}
export class ExistsSubOperand extends Atom {
    to(stack: Stack) {stack.exists();}
    str():string {return 'exists'}
}
export class OpIsNull extends Atom {
    to(stack: Stack) {stack.isNull()}
    str():string {return 'is null'}
}
export class OpIsNotNull extends Atom {
    to(stack: Stack) {stack.isNotNull()}
    str():string {return 'is not null'}
}
export class OpIn extends Atom {
    private params:number;
    constructor(params:number) {
        super();
        this.params = params;
    }
    to(stack: Stack) {stack.in(this.params)}
    str():string {return 'in'}
}
export class OpLike extends Atom {
    to(stack: Stack) {stack.like()}
    str():string {return 'like'}
}
export class OpBetween extends Atom {
    to(stack: Stack) {}
    str():string {return 'between'}
}
export class OpNotBetween extends Atom {
    to(stack: Stack) {}
    str():string {return 'not between'}
}
const dollarVars = ['unit', 'user', 
    'pagestart', 'pagesize',
    'date', 'id', 'state', 'row', 'sheet_date', 'sheet_no', 'sheet_discription'];
export class OpDollarVar extends Atom {
    static isValid(name:string):boolean { return dollarVars.find(v=>v===name) !== undefined }
    _var: string;
    constructor(_var:string) {super(); this._var = _var;}
    to(stack: Stack) {stack.dollarVar(this._var)}
    str():string {return '$' + this._var}
}
