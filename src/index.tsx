import * as ui from "hyperoop";
import { Main } from "./controller/main";
import { HRoute } from "./utils/hroute";
import { APIRefPage } from "./view/apiref";

const view = () =>
    HRoute({exact: true, hash: "#apiref-:module", component: APIRefPage})();

const actions = new Main();
actions.Router.go({hash: "#apiref-HyperOOP", state: null});
ui.init(document.body, view, actions);
