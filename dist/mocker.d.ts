import { Options } from './mock';
export declare class Mocker {
    private mocks;
    constructor(options?: IServerOptions);
    api(path: string, response: Partial<object | object[]>, options?: Options): void;
    private getMockByPath;
    get(path: string): Promise<MockData>;
    post(path: string, data: object): Promise<MockResponse>;
    private toResponse;
    private apiResponse;
}
interface IServerOptions extends Options {
    port: number;
}
interface MockResponse {
    status: number;
    message?: string;
    data?: MockData | MockData[];
}
interface MockData {
    [key: string]: any;
}
export {};
