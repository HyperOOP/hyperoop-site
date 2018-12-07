import * as ui from "hyperoop";
import { Router } from "hyperoop-router";

export class Main extends ui.Actions<{}> {
    public readonly Router: Router;
    constructor() {
        super({});
        this.Router = new Router(this, ui.h);
    }
}
