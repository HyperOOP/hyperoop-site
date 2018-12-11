import * as ui from "hyperoop";
import { Link } from "hyperoop-router";
import * as misc from "../misc";

export interface INavbarDropdownLiArgs {
    title: string;
}

export const NavbarDropdownLi = (a: INavbarDropdownLiArgs, children) => (
    <li>
        <a href="#">{a.title}</a>
        <div class="uk-navbar-dropdown">
            <ul class="uk-nav uk-navbar-dropdown-nav">
            { children }
            </ul>
        </div>
    </li>
);

export interface INavbarLiArgs {
    title: string;
    hash:  string;
}

export const NavbarLi = (a: INavbarLiArgs) => (
    <li>
        <Link to={a.hash}>{a.title}</Link>
    </li>
);

export interface INavbarSearchLiArgs {
    onSearchInput:  (input: string) => void;
    onSearch:       () => void;
    searchValue:    string;
}

export const NavbarSearchLi = (a: INavbarSearchLiArgs) => (
    <li>
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

export const NavbarMenuUl = (a: INavbarArgs) => (
    <ul class="uk-navbar-nav">
        { a.searchArgs ?
            <NavbarSearchLi
                onSearchInput={a.searchArgs.onSearchInput}
                onSearch={a.searchArgs.onSearch}
                searchValue={a.searchArgs.searchValue}
            /> : ""}
        { a.hasTutorial ? <NavbarLi title="Tutorial" hash={misc.tutorialAddr}/> : "" }
        { a.reference.length ?
                <NavbarDropdownLi title="API Reference">
                    { a.reference.map(({title, hash}) =>
                            <NavbarLi title={title} hash={hash}/>) }
                </NavbarDropdownLi> :
                "" }
        { a.examples.length ?
                <NavbarDropdownLi title="Examples">
                    { a.examples.map(({title, hash}) =>
                            <NavbarLi title={title} hash={hash}/>) }
                </NavbarDropdownLi> :
                "" }
        { a.hasDonationsPage ? <NavbarLi title="Donate" hash={misc.donateAddr}/> : "" }
    </ul>
);
