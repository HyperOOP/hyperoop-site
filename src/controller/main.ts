import * as ui from "hyperoop";
import { IMainController } from "./apiref";

export class MainController extends ui.Actions<{loading: number}> implements IMainController {
    constructor() {
        super({loading: 0});
    }
    public loading(on: boolean) {
        this.State.loading += on ? 1 : -1;
    }
}
