import * as express from 'express';
import { Mock, Options } from './mock';

export class Mocker {
    private mocks: Mock[] = [];

    constructor(options: IServerOptions = { port: 3000 }) {
        const app = express();
        const port = options.port;

        app.get('*', (req, res) => {
            const mock = this.getMockByPath(req.path);

            let failed = false;

            if (mock.options && mock.options.failRate) {
                if (mock.options.failRate >= Math.random()) {
                    failed = true;
                }
            }

            if (!mock || failed) {
                return res.sendStatus(404);
            }
            else {
                res.send(this.toResponse(mock.data));
            }
        })

        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    }

    api(
        path: string,
        response: Partial<object | object[]>,
        options?: Options
    ) {
        this.mocks.forEach(mock => {
            if (mock.path === path) {
                throw new Error('A mocked API endpoint with that path already exists.');
            }
        });
        this.mocks.push(new Mock(path, response, options));
    }

    private getMockByPath(path: string): Mock {
        const mock = this.mocks.find((mock: Mock) => path === mock.path);
        if (!mock) {
            throw new Error('Could not find any mocked API with path: ' + path);
        }
        return mock;
    }

    async get(path: string): Promise<MockData> {
        const mock = this.getMockByPath(path);

        return new Promise<MockResponse>((resolve, reject) =>
            this.apiResponse(resolve, reject, mock)
        );
    }

    async post(path: string, data: object): Promise<MockResponse> {
        const mock = this.getMockByPath(path);

        if (Array.isArray(mock.data)) {
            mock.data.push({ ...data });
        } else {
            mock.data = { ...data };
        }

        return new Promise<MockResponse>((resolve, reject) =>
            this.apiResponse(resolve, reject, mock)
        );
    }

    private toResponse(data: object, error?: boolean): MockResponse {
        if (error) {
            return {
                status: HttpStatusCode.ERROR,
                message: 'An error has occurred.'
            };
        }
        return { status: HttpStatusCode.OK, data };
    }

    private async apiResponse(resolve: any, reject: any, mock: Mock) {
        await sleep(mock.options && mock.options.delay);
        if (mock.options && mock.options.failRate) {
            if (mock.options.failRate >= Math.random()) {
                reject(this.toResponse(mock.data, true));
            }
        }
        resolve(this.toResponse(mock.data));
    }
}

interface IServerOptions extends Options {
    port: number;
}

async function sleep(time = 0): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, time));
}

enum HttpStatusCode {
    OK = 200,
    ERROR = 400,
    SERVER_ERROR = 500
}

interface MockResponse {
    status: number;
    message?: string;
    data?: MockData | MockData[];
}

interface MockData {
    [key: string]: any;
}