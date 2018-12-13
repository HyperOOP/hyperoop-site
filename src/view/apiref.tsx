import * as ui from "hyperoop";
import scrollIntoView from "scroll-into-view";
import { IHTargetAttributes } from "../utils/hroute";
import { ISidebarSectionInfo, SideBar } from "./sidebar";

declare interface IPrism {
    languages: {[name in string]: any};
    highlight(text: string, grammar: any, language: string): string;
}

declare const Prism: IPrism;

export const APIRefSidebar = (info: ISidebarSectionInfo[]) => (a: IHTargetAttributes) => (
    <SideBar
        title = { "module" in a.match.params ? `${a.match.params.module} API` : null }
        sections = { "module" in a.match.params ? info : null }
        activeHash = { a.match.hashMatch }
    />
);

export interface IAPIRefContentSectionInfo {
    kind: string;
    name: string;
    decl: string;
    comment: string;
    hash?: string;
}

declare function marked(txt: string, options: { sanitize: boolean}): string;

const onCreateContentSection = (a: IAPIRefContentSectionInfo) => (el) => {
    if (a.hash === window.location.hash) { scrollIntoView(el); }
};

const onCreateMarkdownSection = (a: {comment: string}) => (el) => {
    el.innerHTML = marked(a.comment, { sanitize: true });
};

const highlightCode = (text: string) => (el) => {
    const lang = "tsx";
    el.innerHTML = Prism.highlight(text, Prism.languages[lang], lang);
};

const Code = (a: {decl: string}) => (
    <pre style="margin-left: 20px">
        <code
            oncreate = {highlightCode(a.decl)}
            onupdate = {highlightCode(a.decl)}
        >
        </code>
    </pre>
);

const Comment = (a: {comment: string}) => (
    <p
        oncreate = {onCreateMarkdownSection(a)}
        onupdate = {onCreateMarkdownSection(a)}
        style = "margin-left: 20px"
    >
    </p>
);

export const APIRefContentMajorSection = (a: IAPIRefContentSectionInfo) => (
    <div onupdate={onCreateContentSection(a)} class="ho-content-section">
        <h4
            class={a.hash === window.location.hash ?
                "ho-major-content-active-header" : "ho-major-content-header"}
        >
            {a.kind + " "}
            <a href={a.hash}>
                <span class="ho-header-identifier">{a.name}</span>
            </a>
        </h4>
        <Code decl = {a.decl}/>
        <Comment comment = {a.comment}/>
    </div>
);

export const APIRefContentSection = (a: IAPIRefContentSectionInfo) => (
    <div class="ho-content-section">
        <h4 class="ho-content-header">
            {a.kind.toLowerCase() + " "}<span class="ho-header-identifier">{a.name}</span>
        </h4>
        <Code decl = {a.decl}/>
        <Comment comment = {a.comment}/>
    </div>
);

export const APIRefContent = (a: {module: string, sections: IAPIRefContentSectionInfo[]}) => (
    <div onupdate={(el) => {
        if (window.location.hash.split("-").length < 3) {
            scrollIntoView(el, { align: { topOffset: 200 } as any });
        }
    }}>
        <h3 class="ho-h4" style="margin-bottom: 60px">{a.module} API</h3>
        { a.sections.map((x) => x.hash ?
            <APIRefContentMajorSection {...x}/>
            :
            <APIRefContentSection {...x}/>) }
    </div>
);
