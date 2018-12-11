import * as ui from "hyperoop";
import * as misc from "../misc";
import { ITOC } from "../model/apiref";
import { SiteInfo } from "../model/site";
import { IHTargetAttributes } from "../utils/hroute";
import { INavbarLiArgs } from "./navbar";
import { ISidebarSectionInfo, SideBar } from "./sidebar";

export function makeNavbarReferenceArgs(): INavbarLiArgs[] {
    const result: INavbarLiArgs[] = [];
    for (const modName in SiteInfo.apiReference) {
        result.push({title: modName, hash: misc.makeAPIReferenceHash(modName)});
    }
    return result;
}

type sectionName = keyof ITOC;

function makeSidebarSections(modName: string): ISidebarSectionInfo[] {
    const result: ISidebarSectionInfo[] = [];
    const sections: sectionName[] = ["Constants", "Variables", "Types", "Interfaces", "Functions", "Classes"];
    const toc: ITOC = SiteInfo.apiReference[modName].toc;
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

export const APIRefSidebar = (a: IHTargetAttributes) => () => (
    <SideBar
        title = { "module" in a.match.params ? `${a.match.params.module} API` : null }
        sections = { "module" in a.match.params ? makeSidebarSections(a.match.params.module) : null }
    />
);
