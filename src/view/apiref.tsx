import * as ui from "hyperoop";
import { IHTargetAttributes } from "../utils/hroute";
import { ISidebarSectionInfo, SideBar } from "./sidebar";

export const APIRefSidebar = (info: ISidebarSectionInfo[]) => (a: IHTargetAttributes) => (
    <SideBar
        title = { "module" in a.match.params ? `${a.match.params.module} API` : null }
        sections = { "module" in a.match.params ? info : null }
    />
);
