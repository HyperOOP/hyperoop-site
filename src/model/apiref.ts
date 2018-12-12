import ITree from "../../tools/documenter/tree";
import * as misc from "../utils/misc";

export type IReferenceTree = ITree;

export interface ITOC {
    Constants:  string[];
    Variables:  string[];
    Types:      string[];
    Interfaces: string[];
    Functions:  string[];
    Classes:    string[];
}

export async function getAPIReference(name: string): Promise<IReferenceTree> {
    const fileName = misc.makeAPIReferenceFileName(name);
    return new Promise<IReferenceTree>((resolve) => {
        return fetch(`static/data/${fileName}`).then((resp) => resolve(resp.json()));
    });
}

export function getTOC(tree: IReferenceTree): ITOC {
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
