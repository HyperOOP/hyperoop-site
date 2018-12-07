import ITree from "../../tools/documenter/tree";
import * as misc from "../misc";

export interface ITOC {
    Constants:  string[];
    Variables:  string[];
    Types:      string[];
    Interfaces: string[];
    Functions:  string[];
    Classes:    string[];
}

export function getAPIReference(name: string): ITree {
    const funcName = misc.makeAPIReferenceGetterName(name);
    if (!(funcName in window)) { return null; }
    const func = window[funcName] as () => ITree;
    if (!func) { return null; }
    return func();
}

export function getTOC(name: string): ITOC {
    const tree = getAPIReference(name);
    if (!tree.children) { return null; }
    const result: ITOC = {
        Classes:    [],
        Constants:  [],
        Functions:  [],
        Interfaces: [],
        Types:      [],
        Variables:  [],
    };
    for (const ch of tree.children) {
        switch (ch.kind) {
        case "VariableStatement":
            if (ch.keyword && ch.keyword === "const") {
                result.Constants.push(ch.name);
            } else {
                result.Variables.push(ch.name);
            }
            break;
        case "InterfaceDeclaration":
            result.Interfaces.push(ch.name);
            break;
        case "TypeAliasDeclaration":
            result.Types.push(ch.name);
            break;
        case "ClassDeclaration":
            result.Classes.push(ch.name);
            break;
        case "FunctionDeclaration":
            result.Functions.push(ch.name);
            break;
        default:
            throw new Error(`Mom, what is it ${ch.kind}?`);
        }
    }
    return result;
}
