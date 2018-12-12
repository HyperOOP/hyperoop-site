import * as ui from "hyperoop";
import { IHTargetAttributes } from "../utils/hroute";
import { ISidebarSectionInfo, SideBar } from "./sidebar";

export const APIRefSidebar = (info: ISidebarSectionInfo[]) => (a: IHTargetAttributes) => (
    <SideBar
        title = { "module" in a.match.params ? `${a.match.params.module} API` : null }
        sections = { "module" in a.match.params ? info : null }
    />
);

export interface IAPIRefContentSectionInfo {
    kind: string;
    name: string;
    decl: string;
    comment: string;
}

declare function marked(txt: string, options: { sanitize: boolean}): string;

export const APIRefContentSection = (a: IAPIRefContentSectionInfo) => (
    <div style="margin-top: 50px">
        <h4>{a.kind} <span class="ho-identifier">{a.name}</span></h4>
        <pre><code class="typescript">{a.decl}</code></pre>
        <p
            oncreate={(el) => el.innerHTML = marked(a.comment, { sanitize: true })}
            onupdate={(el) => el.innerHTML = marked(a.comment, { sanitize: true })}
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
