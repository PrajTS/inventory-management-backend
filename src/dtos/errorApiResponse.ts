export interface IErrorAPI {
    errorCode: string;
    errorMessage: string;
    errorType: string;
    errorPayload?: any;
}

export class ErrorAPIResp {
    error: IErrorAPI;

    constructor(errorCode: string | number, errorMessage: string,
        errorType: string, errorPayload?: any) {
        this.error = {
            errorCode,
            errorMessage,
            errorType,
            ...errorPayload && { errorPayload }
        }
    }
}