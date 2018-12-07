import * as ui from "hyperoop";

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
}

export const SidebarLi = (a: ISidebarLiArgs) => {
    return a.active ?
        <li class="uk-active"><a href={a.hash}>{a.title}</a></li>
        :
        <li><a href={a.hash}>{a.title}</a></li>;
};

export interface ISidebarSectionInfo {
    section: ISidebarSectionLiArgs;
    items:   ISidebarLiArgs[];
}

export interface ISidebarDivArgs {
    title: string;
    sections: ISidebarSectionInfo[];
}

const makeSection = (info: ISidebarSectionInfo): ui.VNode[] => {
    const result: ui.VNode[] = [SidebarSectionLi(info.section)];
    return result.concat(info.items.map((item) => (
        <SidebarLi {...item}/>
    )));
};

export const SideBar = (a: ISidebarDivArgs) => (
    <div class="ho-sidebar-left uk-visible@m">
        <h4 class="ho-h4">{a.title}</h4>
        <ul class="uk-nav uk-nav-default">
            {a.sections.map((info) => makeSection(info)) }
        </ul>
    </div>
);
