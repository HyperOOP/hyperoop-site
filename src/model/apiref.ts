import ITree from "../../tools/documenter/tree";
import * as misc from "../utils/misc";

export type IReferenceTree = ITree;

type TopLevelSections = "Constants" | "Variables" | "Types" | "Interfaces" | "Functions" | "Classes";

export const TopLevelSectionsOrder: TopLevelSections[] = [
    "Classes", "Functions", "Constants", "Variables", "Types", "Interfaces"];

export type ITOC = {
    [name in TopLevelSections]: string[];
};

export type IndexingTable = {
    [name in string]: number;
};

export async function getAPIReference(name: string): Promise<IReferenceTree> {
    const fileName = misc.makeAPIReferenceFileName(name);
    return new Promise<IReferenceTree>((resolve) => {
        return fetch(`built/data/${fileName}`).then((resp) => resolve(resp.json()));
    });
}

export function getTOC(tree: IReferenceTree): [ITOC, IndexingTable] {
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

    for (const name in result) {
        result[name] = result[name].sort();
    }

    const tab: IndexingTable = {};
    let i = 1;
    for (const name of TopLevelSectionsOrder) {
        for (const ident of result[name]) {
            tab[ident] = i;
            i++;
        }
    }

    return [result, tab];
}
