import * as ts from "typescript";
import { readFileSync, writeFileSync } from "fs";

if (process.argv.length < 4) {
    console.log("not enough parameters");
    process.exit(1);
}
const fname = process.argv[2];
const oname = process.argv[3];
const code = readFileSync(fname).toString();

let sourceFile = ts.createSourceFile(
    fname,
    code,
    ts.ScriptTarget.ES2015,
    true
);

const cmtRe = /\/\*\*((\*(?!\/)|[^*])*)\*\//;

interface ITree {
    kind: string;
    comment?: string;
    decl?: string;
    children?: ITree[];
    name?: string;
}

const complexNode = (n: ITree): boolean =>
    n.kind === "ClassDeclaration" || n.kind==='InterfaceDeclaration'

const nodeName = (node: ts.Node): string => {
    const nnode = node as ts.NamedDeclaration;
    if (!nnode.name) return null;
    const id = nnode.name as ts.Identifier;
    return id.escapedText ? `${id.escapedText}` : null;
}

function showNodes(ast: ts.Node, source: string, tree: ITree) {
    ts.forEachChild(ast, (node)=>{
        if (node.kind === ts.SyntaxKind.ExportKeyword) return;
        const n: any = {}
        const start = node.getFullStart();
        const end = start + node.getFullWidth();
        const decl = source.slice(start, end).trim();
        if (decl.slice(0, 3) == '/**') {
            const match = cmtRe.exec(decl);
            if (!match) return;
            n.comment = match[0];
        } else {
            return;
        }
        n.kind = ts.SyntaxKind[node.kind];
        if (complexNode(n)) {
            let d = decl.slice(n.comment.length).trim();
            let m = /^(export\s+declare|export)?(.*)\{\s*\n/.exec(d);
            if (m) {
                n.decl = m[2].trim();
            } else {
                n.decl = decl;
            }
        } else {
            let d = decl.slice(n.comment.length).trim();
            let m = /^(export\s+declare|export)?(.*)$/.exec(d);
            if (m) {
                n.decl = m[2].trim();
            } else {
                n.decl = decl;
            }
        }
        
        const nname = nodeName(node);
        if (nname !== null) {
            n.name = nname;
        }
        tree.children.push(n);
        if (complexNode(n)) {
            n.children = [];
            showNodes(node, source, n);
        }
    })
}


let tree = {kind: "ModuleDeclaration", children: []};
showNodes(sourceFile, code, tree);

writeFileSync(oname, JSON.stringify(tree, null, 2), { encoding: "utf8"});  