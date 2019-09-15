
export class Mock {
    constructor(
        public path: string,
        public data: object | object[],
        public options: Options
    ) {
        this.path = path;
        this.data = data;
        if (options) {
            this.options.failRate =
                options.failRate > 1 ? 1 : options.failRate;
        }
    }
}

export interface Options {
    delay?: number;
    failRate?: number;
}
