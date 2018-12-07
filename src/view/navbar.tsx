import * as ui from "hyperoop";
import { Link } from "hyperoop-router";
import * as misc from "../misc";

export interface INavbarDropdownLiArgs {
    title: string;
}

export const NavbarDropdownLi = (a: INavbarDropdownLiArgs, children: ui.Child[]) => (
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

export interface INavbarArgs extends INavbarSearchLiArgs {
    hasTutorial:   boolean;
    hasDonatePage: boolean;
    reference:     INavbarLiArgs[];
    examples:      INavbarLiArgs[];
}

export const Navbar = (a: INavbarArgs) => (
    <div uk-sticky="media: 960" class="uk-container uk-container-expand ho-navbar">
    <nav uk-navbar class="uk-navbar-container">
        <div class="uk-navbar-left">
            <img src="../static/img/logo.png" alt="HyperOOP" class="uk-navbar-item ho-logo-image"/>
            <span class="ho-logo-text">HyperOOP</span>
        </div>
        <div class="uk-navbar-right uk-visible@m">
            <ul class="uk-navbar-nav">
                <NavbarSearchLi
                    onSearchInput={a.onSearchInput}
                    onSearch={a.onSearch}
                    searchValue={a.searchValue}
                />
                { a.hasTutorial ? <NavbarLi title="Tutorial" hash={misc.tutorialAddr}/> : "" }
                {
                    a.reference.length ?
                        <NavbarDropdownLi title="API Reference">
                            {
                                a.reference.map(({title, hash}) =>
                                    <NavbarLi title={title} hash={hash}/>)
                            }
                        </NavbarDropdownLi> :
                        ""
                }
                {
                    a.examples.length ?
                        <NavbarDropdownLi title="Examples">
                            {
                                a.examples.map(({title, hash}) =>
                                    <NavbarLi title={title} hash={hash}/>)
                            }
                        </NavbarDropdownLi> :
                        ""
                }
                { a.hasDonatePage ? <NavbarLi title="Donate" hash={misc.donateAddr}/> : "" }
            </ul>
        </div>
    </nav>
    </div>
);
