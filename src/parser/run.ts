import { Atom, RunStack } from "./atom";


export function run(atoms: Atom[]):string {
    let runStack = new RunStack();

    let result:string = '';
    for (let atom of atoms) {
        result += atom.str();
    }
    return result;
}
