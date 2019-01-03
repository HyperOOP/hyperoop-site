import * as ui from "hyperoop";
import { Link } from "hyperoop-router";
import * as misc from "../utils/misc";

export interface INavbarDropdownLiArgs {
    title:    string;
    visible?: string;
    hidden?:  string;
}

export const NavbarDropdownLi = (a: INavbarDropdownLiArgs, children) => (
    <li class={a.visible ? `uk-visible@${a.visible}` : ""}>
        <a href="#">{a.title}</a>
        <div class="uk-navbar-dropdown">
            <ul class="uk-nav uk-navbar-dropdown-nav">
            { children }
            </ul>
        </div>
    </li>
);

export const NavbarDropdownIconLi = (a: INavbarDropdownLiArgs, children) => (
    <li
        class = {
            a.visible ? `uk-visible@${a.visible} ` : "" +
            a.hidden ? `uk-hidden@${a.hidden}` : ""
        }
    >
        <a href="#" class="uk-icon-link" uk-icon={a.title}></a>
        <div class="uk-navbar-dropdown">
            <ul class="uk-nav uk-navbar-dropdown-nav">
            { children }
            </ul>
        </div>
    </li>
);

export interface INavbarLiArgs {
    title:    string;
    hash:     string;
    visible?: string;
}

export const NavbarLi = (a: INavbarLiArgs) => (
    <li class={a.visible ? `uk-visible@${a.visible}` : ""}>
        <Link to={a.hash}>{a.title}</Link>
    </li>
);

export interface INavbarSearchLiArgs {
    onSearchInput:  (input: string) => void;
    onSearch:       () => void;
    searchValue:    string;
    visible?:       string;
}

export const NavbarSearchLi = (a: INavbarSearchLiArgs) => (
    <li class={a.visible ? `uk-visible@${a.visible}` : ""}>
        <div class="uk-navbar-item">
            <form class="uk-search uk-search-navbar">
                <span uk-search-icon class="ho-scaled-search-icon"></span>
                <input class="uk-search-input" type="search"
                    onkeyup = {(e) => (e.keyCode === 13 ? a.onSearch() : "")}
                    oninput = {(e) => a.onSearchInput(e.target.value)}
                    value   = {a.searchValue}
                />
            </form>
        </div>
    </li>
);

export interface INavbarArgs {
    searchArgs:       INavbarSearchLiArgs;
    hasTutorial:      boolean;
    hasDonationsPage: boolean;
    reference:        INavbarLiArgs[];
    examples:         INavbarLiArgs[];
}

const hyperoopGithub = "https://github.com/hyperoop/";

export const NavbarMenuUl = (a: INavbarArgs) => (
    <ul class="uk-navbar-nav">
        { a.searchArgs ?
            <NavbarSearchLi
                onSearchInput={a.searchArgs.onSearchInput}
                onSearch={a.searchArgs.onSearch}
                searchValue={a.searchArgs.searchValue}
                visible="m"
            /> : ""}
        { a.hasTutorial ? <NavbarLi title="Tutorial" hash={misc.tutorialAddr} visible="m"/> : "" }
        { a.reference.length ?
                <NavbarDropdownLi title="API Reference" visible="m">
                    { a.reference.map(({title, hash}) =>
                            <NavbarLi title={title} hash={hash}/>) }
                </NavbarDropdownLi> :
                "" }
        { a.examples.length ?
                <NavbarDropdownLi title="Examples" visible="m">
                    { a.examples.map(({title, hash}) =>
                            <NavbarLi title={title} hash={hash}/>) }
                </NavbarDropdownLi> :
                "" }
        { a.hasDonationsPage ? <NavbarLi title="Donate" hash={misc.donateAddr} visible="m"/> : "" }
        <li class="uk-visible@m">
            <a
                href={hyperoopGithub}
                target="_blank"
                rel="noopener noreferrer"
                class="uk-icon-link"
                uk-icon="github"
            ></a>
        </li>
        <li class="uk-visible@m">
            <a
                href="https://gitter.im/hyper-oop"
                target="_blank"
                rel="noopener noreferrer"
                class="uk-icon-link"
                uk-icon="gitter"
            ></a>
        </li>
        <NavbarDropdownIconLi title="table" hidden="m">
            <li class="uk-nav-header">API</li>
            { a.reference.map(({title, hash}) =>
                            <NavbarLi title={title} hash={hash}/>) }
            <li class="uk-nav-header">Community</li>
            <li>
                <a
                    href={hyperoopGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span uk-icon="icon: github; ratio: 0.8"> </span> GitHub
                </a>
            </li>
            <li>
                <a
                    href="https://gitter.im/hyper-oop"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span uk-icon="icon: gitter; ratio: 0.8"> </span> Gitter
                </a>
            </li>
        </NavbarDropdownIconLi>
    </ul>
);
