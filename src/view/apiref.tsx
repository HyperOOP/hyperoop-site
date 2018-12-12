import * as ui from "hyperoop";
import { IHTargetAttributes } from "../utils/hroute";
import { ISidebarSectionInfo, SideBar } from "./sidebar";

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
    if (a.hash && a.hash === window.location.hash) {
        el.scrollIntoView();
        window.scrollBy(0, -100);
    }
};

const onCreateMarkdownSection = (a: IAPIRefContentSectionInfo) => (el) => {
    el.innerHTML = marked(a.comment, { sanitize: true });
};

export const APIRefContentSection = (a: IAPIRefContentSectionInfo) => (
    <div class="uk-card" oncreate={onCreateContentSection(a)} onupdate={onCreateContentSection(a)}>
        <h4>
            {a.kind + " "}
            { a.hash ?
                <a href={a.hash}>
                    <span class="ho-identifier">{a.name}</span>
                </a>
                :
                <span class="ho-identifier">{a.name}</span> }
        </h4>
        <pre><code class="typescript">{a.decl}</code></pre>
        <p
            oncreate={onCreateMarkdownSection(a)}
            onupdate={onCreateMarkdownSection(a)}
        >
            {a.comment}
        </p>
    </div>
);

interface IHljs {
    initHighlightingOnLoad();
}

declare const hljs: IHljs;

export const APIRefContent = (a: {module: string, sections: IAPIRefContentSectionInfo[]}) => (
    <div
        oncreate={ hljs.initHighlightingOnLoad() }
        onupdate={ hljs.initHighlightingOnLoad() }
    >
        <h3 class="ho-h4">{a.module} API</h3>
        { a.sections.map((x) => <APIRefContentSection {...x}/>) }
    </div>
);
