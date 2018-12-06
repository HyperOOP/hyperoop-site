
export interface ITree {
    kind:      string;
    comment?:  string;
    decl?:     string;
    children?: ITree[];
    name?:     string;
    keyword?:  string;
}
