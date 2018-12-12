import * as ui from "hyperoop";
import { Router } from "hyperoop-router";
import * as misc from "../utils/misc";
import { INavbarLiArgs } from "../view/navbar";

interface INavbarData {
    apiModNames: string[];
    apirefData: INavbarLiArgs[];
}

function makeNavbarReferenceArgs(apiModNames: string[]): INavbarLiArgs[] {
    const result: INavbarLiArgs[] = [];
    for (const modName of apiModNames) {
        result.push({title: modName, hash: misc.makeAPIReferenceHash(modName)});
    }
    return result;
}

export class NavbarController extends ui.Actions<INavbarData> {
    public readonly Router: Router;

    constructor(apiModNames: string[]) {
        super({
            apiModNames,
            apirefData: makeNavbarReferenceArgs(apiModNames),
        });
        this.Router = new Router(this, ui.h);
    }
}
