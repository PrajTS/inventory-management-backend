import fetch, { Response } from 'node-fetch';
import { authenticateMicroService, buildJwt } from './microServiceAuth';

const fetchReq = async (url: string, options: any = {}, microService: string) => {
    if (!options.headers) {
        options.headers = {};
    }
    options.headers.authorization = buildJwt();
    try {
        const res: Response = await fetch(url, options);
        const authorizationHeader = res.headers.get('authorization');
        let unauthorized = true;
        if (authorizationHeader) {
            if (authenticateMicroService(microService, authorizationHeader)) {
                unauthorized = false;
                res.headers.delete('authorization');
            }
        }
        if (unauthorized) {
            return {
                err: {
                    body: "Unauthorized",
                    status: 401
                }
            };
        }
        if (res.status >= 300) {
            return {
                err: {
                    body: res.body,
                    status: res.status
                }
            };
        }

    }
    catch (e) {
        return {
            err: {
                body: {
                    message: "Internal Server Error",
                    exception: e
                },
                status: 500
            }
        };
    }
}

export default fetchReq;