import * as ui from "hyperoop";
import { Link } from "hyperoop-router";

export interface ISidebarSectionLiArgs {
    title: string;
}

export const SidebarSectionLi = (a: ISidebarSectionLiArgs) => (
    <li class="uk-nav-header">{a.title}</li>
);

export interface ISidebarLiArgs {
    active: boolean;
    title:  string;
    hash:   string;

    refreshContent: () => void;
}

export const SidebarLi = (a: ISidebarLiArgs) => {
    return a.active ?
        <li class="uk-active"><Link to={"./" + a.hash} onclick={a.refreshContent}>{a.title}</Link></li>
        :
        <li><Link to={"./" + a.hash}>{a.title}</Link></li>;
};

export interface ISidebarSectionInfo {
    section: ISidebarSectionLiArgs;
    items:   ISidebarLiArgs[];
}

export interface ISidebarDivArgs {
    activeHash: string;
    title: string;
    sections: ISidebarSectionInfo[];
}

const makeSection = (info: ISidebarSectionInfo, activeHash: string): ui.VNode[] => {
    const result: ui.VNode[] = [SidebarSectionLi(info.section)];
    return result.concat(info.items.map((item) => (
        <SidebarLi {...{...item, active: item.hash === activeHash}}/>
    )));
};

export const SideBar = (a: ISidebarDivArgs) => (
    <div key="Sidebar" class="ho-sidebar-left uk-visible@m">
        <h4 class="ho-h4" key="SidebarTitle">{a.title}</h4>
        <ul class="uk-nav uk-nav-default" key="SidebarUl">
            {a.sections.map((info) => makeSection(info, a.activeHash)) }
        </ul>
    </div>
);
