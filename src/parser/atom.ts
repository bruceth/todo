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

class RunStack implements Stack {
    private stack:string[] = [];
    private queue:string[] = [];

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
    num(val:number):void {}
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
}

export class OpOr extends Atom {
    to(stack: Stack) {stack.or();}
}
export class OpAnd extends Atom {
    to(stack: Stack) {stack.and();}
}
export class OpNot extends Atom {
    to(stack: Stack) {stack.not();}
}
export class OpLE extends Atom {
    to(stack: Stack) {stack.le();}
}
export class OpLT extends Atom {
    to(stack: Stack) {stack.lt();}
}
export class OpEQ extends Atom {
    to(stack: Stack) {stack.eq();}
}
export class OpNE extends Atom {
    to(stack: Stack) {stack.ne();}
}
export class OpGT extends Atom {
    to(stack: Stack) {stack.gt();}
}
export class OpGE extends Atom {
    to(stack: Stack) {stack.ge();}
}
export class OpAdd extends Atom {
    to(stack: Stack) {stack.add();}
}
export class OpSub extends Atom {
    to(stack: Stack) {stack.sub();}
}
export class OpMul extends Atom {
    to(stack: Stack) {stack.mul();}
}
export class OpDiv extends Atom {
    to(stack: Stack) {stack.div();}
}
export class OpMod extends Atom {
    to(stack: Stack) {stack.mod();}
}
export class OpBitwiseAnd extends Atom {
    to(stack: Stack) {stack.bitAnd();}
}
export class OpBitwiseOr extends Atom {
    to(stack: Stack) {stack.bitOr();}
}
export class OpNeg extends Atom {
    to(stack: Stack) {stack.neg();}
}
export class OpBrace extends Atom {
    to(stack: Stack) {}
}
export class TextOperand extends Atom {
    text:string;
    constructor(text:string) {
        super();
        this.text = text;
    }
    to(stack: Stack) {stack.str(this.text);}
}
export class NumberOperand extends Atom {
    num:number;
    constructor(num:number) {
        super();
        this.num = num;
    }
    to(stack: Stack) {stack.num(this.num);}
}
export class HexOperand extends Atom {
    text:string;
    constructor(text:string) {
        super();
        this.text = text;
    }
    to(stack: Stack) {stack.hex(this.text);}
}
export class NullOperand extends Atom {
    to(stack: Stack) { stack.hex('null'); }
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
}
export class StarOperand extends Atom {
    to(stack: Stack) {stack.star();}
}
export class DatePartOperand extends Atom {
    datePart: string;
    constructor(datePart: string) {
        super();
        this.datePart = datePart;
    }
    to(stack: Stack) {stack.datePart(this.datePart)}
}
export class ExistsSubOperand extends Atom {
    to(stack: Stack) {stack.exists();}
}
export class OpIsNull extends Atom {
    to(stack: Stack) {stack.isNull()}
}
export class OpIsNotNull extends Atom {
    to(stack: Stack) {stack.isNotNull()}
}
export class OpIn extends Atom {
    private params:number;
    constructor(params:number) {
        super();
        this.params = params;
    }
    to(stack: Stack) {stack.in(this.params)}
}
export class OpLike extends Atom {
    to(stack: Stack) {stack.like()}
}
export class OpBetween extends Atom {
    to(stack: Stack) {}
}
export class OpNotBetween extends Atom {
    to(stack: Stack) {}
}
const dollarVars = ['unit', 'user', 
    'pagestart', 'pagesize',
    'date', 'id', 'state', 'row', 'sheet_date', 'sheet_no', 'sheet_discription'];
export class OpDollarVar extends Atom {
    static isValid(name:string):boolean { return dollarVars.find(v=>v===name) !== undefined }
    _var: string;
    constructor(_var:string) {super(); this._var = _var;}
    to(stack: Stack) {stack.dollarVar(this._var)}
}
