export declare class Mock {
    path: string;
    data: object | object[];
    options: Options;
    constructor(path: string, data: object | object[], options: Options);
}
export interface Options {
    delay?: number;
    failRate?: number;
}
