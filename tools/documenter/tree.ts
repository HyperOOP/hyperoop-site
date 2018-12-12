
export default interface ITree {
    kind:         string;
    comment?:     string;
    commentText?: string;
    decl?:        string;
    children?:    ITree[];
    name?:        string;
    keyword?:     string;
}
