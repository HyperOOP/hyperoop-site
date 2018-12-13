import * as ui from "hyperoop";
import scrollIntoView from "scroll-into-view";
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
    if (a.hash === window.location.hash) { scrollIntoView(el); }
};

const onCreateMarkdownSection = (a: IAPIRefContentSectionInfo) => (el) => {
    el.innerHTML = marked(a.comment, { sanitize: true });
};

export const APIRefContentMajorSection = (a: IAPIRefContentSectionInfo) => (
    <div
        oncreate={onCreateContentSection(a)}
        onupdate={onCreateContentSection(a)}
    >
        <h4
            class={a.hash === window.location.hash ?
                "ho-major-content-active-header" : "ho-major-content-header"}
        >
            {a.kind + " "}
            <a href={a.hash}>
                <span class="ho-identifier">{a.name}</span>
            </a>
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

export const APIRefContentSection = (a: IAPIRefContentSectionInfo) => (
    <div>
        <h4>
            {a.kind + " "}<span class="ho-identifier">{a.name}</span>
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

export const APIRefContent = (a: {module: string, sections: IAPIRefContentSectionInfo[]}) => (
    <div>
        <h3 class="ho-h4">{a.module} API</h3>
        { a.sections.map((x) => x.hash ? <APIRefContentMajorSection {...x}/> : <APIRefContentSection {...x}/>) }
    </div>
);
