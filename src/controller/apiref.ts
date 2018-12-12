import * as ui from "hyperoop";
import { Router } from "hyperoop-router";
import { getAPIReference, getTOC, IReferenceTree, ITOC } from "../model/apiref";
import * as misc from "../utils/misc";
import { IAPIRefContentSectionInfo } from "../view/apiref";
import { ISidebarSectionInfo } from "../view/sidebar";

interface IModuleRefData {
    tree: IReferenceTree;
    toc: ITOC;
}

type APIRefData = {
    [modName in string]: IModuleRefData;
};

export interface IMainController {
    loading(on: boolean);
}

export class APIRefController {
    public readonly Router: Router;
    public readonly TOCCtrl: APIRefTOCController;
    public readonly TreeCtrl: APIRefContentController;

    private ready: APIRefData = {};
    private fresh: boolean = true;

    constructor(private mainCtrl: IMainController) {
        this.Router = new Router(this, ui.h);
        this.TOCCtrl = new APIRefTOCController();
        this.TreeCtrl = new APIRefContentController();
    }

    get Fresh() { return this.fresh; }

    public async onLocationChange(data: any) {
        this.fresh = false;
        const loc = window.location;
        const hashRe = /\#apiref\-([a-zA-Z_][a-zA-Z0-9_]*)(\-.*)?/;
        const m = loc.hash.match(hashRe);
        if (!m) { return; }
        const modname = m[1];
        if (modname in this.ready) {
            this.setModule(modname);
            return;
        }
        let tree: IReferenceTree = null;
        try {
            this.mainCtrl.loading(true);
            tree = await getAPIReference(modname);
        } finally {
            this.mainCtrl.loading(false);
        }
        if (!tree) { return; }
        this.ready[modname] = {
            toc: getTOC(tree),
            tree,
        };
        this.setModule(modname);
    }

    private setModule(modname: string) {
        this.TOCCtrl.setTOC(modname, this.ready[modname].toc);
        this.TreeCtrl.setTree(modname, this.ready[modname].tree);
    }
}

type ContentItemKind =
| "Constant"
| "Variable"
| "Type"
| "Interface"
| "Function"
| "Class"
| "Property"
| "Constructor"
| "Method";

function getKind(ch: IReferenceTree): ContentItemKind {
    switch (ch.kind) {
        case "VariableStatement":
            if (ch.keyword && ch.keyword === "const") {
                return "Constant";
            } else {
                return "Variable";
            }
        case "InterfaceDeclaration":
            return "Interface";
        case "TypeAliasDeclaration":
            return "Type";
        case "ClassDeclaration":
            return "Class";
        case "Constructor":
            return "Constructor";
        case "FunctionDeclaration":
            return "Function";
        case "MethodDeclaration":
            return "Method";
        case "PropertySignature":
        case "PropertyDeclaration":
            return "Property";
        default:
            throw new Error(`Mom, what is it ${ch.kind}?`);
        }
}

function makeAPIRefContentSections(
    tree: IReferenceTree,
    s: IAPIRefContentSectionInfo[] = [],
    prefix: string = null): IAPIRefContentSectionInfo[] {

    for (const ch of tree.children) {
        const kind = getKind(ch);
        let name = kind === "Constructor" ? "" : ch.name;
        if (prefix) { name = `${prefix}.${name}`}
        s.push({
            comment: ch.commentText,
            decl: ch.decl,
            kind,
            name,
        });

        if (ch.children && ch.children.length) {
            makeAPIRefContentSections(ch, s, name);
        }
    }
    return s;
}

interface IAPIRefContentData {
    modName: string;
    tree: IReferenceTree;
    sections: IAPIRefContentSectionInfo[];
}

export class APIRefContentController extends ui.Actions<IAPIRefContentData> {
    constructor() {
        super({
            modName: "",
            sections: [],
            tree: {} as IReferenceTree,
        });
    }

    public async setTree(modname: string, tree: IReferenceTree) {
        this.set({
            modName: modname,
            sections: makeAPIRefContentSections(tree),
            tree,
        });
    }
}

type sectionName = keyof ITOC;

function makeSidebarSections(modName: string, toc: ITOC): ISidebarSectionInfo[] {
    const result: ISidebarSectionInfo[] = [];
    const sections: sectionName[] = [
        "Constants", "Variables", "Types", "Interfaces", "Functions", "Classes"];
    for (const sectName of sections) {
        const tocItems = toc[sectName];
        if (tocItems.length < 1) {
            continue;
        }
        const info: ISidebarSectionInfo = {
            items: tocItems.map((name) =>
                ({ active: false, title: name, hash: misc.makeAPIReferenceItemHash(modName, name)})),
            section: { title: sectName },
        };
        result.push(info);
    }
    return result;
}

interface IAPIRefTOCData {
    toc:      ITOC;
    sections: ISidebarSectionInfo[];
}

export class APIRefTOCController extends ui.Actions<IAPIRefTOCData> {
    constructor() {
        super({
            sections: [],
            toc: {} as ITOC,
        });
    }

    public async setTOC(modName: string, toc: ITOC) {
        this.set({toc, sections: makeSidebarSections(modName, toc)});
    }
}
