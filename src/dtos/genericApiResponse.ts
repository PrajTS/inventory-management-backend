import { IErrorAPI } from "./errorApiResponse";

export type IApiResponse = ISuccessApiResponse | IErrorApiResponse;

interface ISuccessApiResponse {
    status: 'success',
    data: any,
}

interface IErrorApiResponse {
    status: 'error',
    error: IErrorAPI,
}
