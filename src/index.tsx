import * as ui from "hyperoop";
import { Main } from "./controller/main";
import { HRoute } from "./utils/hroute";
import { APIRefSidebar, makeNavbarReferenceArgs } from "./view/apiref";
import { NavbarMenuUl } from "./view/navbar";

const view1 = () => (
    <NavbarMenuUl
        hasTutorial={false}
        hasDonationsPage={false}
        examples={[]}
        reference={makeNavbarReferenceArgs()}
        searchArgs = {null}
    />
);

const view2 = () => (
    <HRoute exact={true} hash="#apiref-:module" component={APIRefSidebar}/>
);

const navbar = new Main();
const sidebar = new Main();

navbar.Router.go({hash: "#apiref-HyperOOP", state: null});

ui.init(document.getElementById("navbarPlace"), view1, navbar);
ui.init(document.getElementById("sidebarPlace"), view2, sidebar);
