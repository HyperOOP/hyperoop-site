import { Component, LazyVNode } from "hyperoop";

export interface IHashMatch {
    isExact:     boolean;
    hashPattern: string;
    hashMatch:   string;
    params?: {
        [K in string]: string
    };
}

const decodeParam = (val: string): string => {
    try {
        return decodeURIComponent(val);
    } catch {
        return val;
    }
};

function parseHRoute(hashPattern: string, hashMatch: string, exact: boolean): IHashMatch {
    if (hashPattern === hashMatch || !hashPattern) {
        return { isExact: hashPattern === hashMatch, hashPattern, hashMatch };
    }

    const parts = hashPattern.slice(1).split("-");
    const mparts = hashMatch.slice(1).split("-");

    if (parts.length > mparts.length || (exact && parts.length < mparts.length)) {
        return null;
    }

    const result: IHashMatch = {
        hashMatch: "#",
        hashPattern,
        isExact: false,
        params: {},
    };

    const len = parts.length;
    for (let i = 0; i < len; i++) {
        let [p, u] = [parts[i], mparts[i]];
        if (":" === p[0]) {
            p = p.slice(1);
            result.params[p] = u = decodeParam(u);
        } else if (p !== u) {
            return null;
        }
        result.hashMatch += u + "-";
    }

    return result;
}

export interface IHTargetAttributes {
    match: IHashMatch;
}

export type HTargetComponent = Component<IHTargetAttributes>;
export type HTargetNode = LazyVNode<IHTargetAttributes>;

export interface IHRouteAttributes {
    hash:      string;
    exact:     boolean;
    component: HTargetComponent;
}

export const HRoute = (a: IHRouteAttributes): HTargetNode => () => {
    const loc = window.location;
    const match = parseHRoute(a.hash, loc.hash, a.exact);
    if (!match) { return null; }
    const c = a.component({match}, []);
    if (typeof c === "function") { return c(); }
    return c;
};
