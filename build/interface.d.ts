/// <reference types="wx" />
export interface IInitOption {
    codeToSession: ICodeToSessionOptions;
    sessionName: any;
    setHeader?: (() => IAnyObject) | object;
    urlPerfix?: string | (() => string);
    doNotCheckSession?: boolean;
    reLoginLimit?: number;
    errorCallback?: ((obj: IAnyObject, res: string | IAnyObject | ArrayBuffer) => void) | null;
    reportCGI?: boolean | ((name: string, startTime: number, endTime: number, request: Function) => void);
    mockJson?: any;
    globalData?: boolean | object | Function;
    sessionExpireKey?: string;
    sessionExpireTime?: number;
    loginTrigger?: (res: string | IAnyObject | ArrayBuffer) => boolean;
    successTrigger: (res: string | IAnyObject | ArrayBuffer) => boolean;
    successData?: (resData: string | IAnyObject | ArrayBuffer, res?: wx.RequestSuccessCallbackResult | wx.UploadFileSuccessCallbackResult) => string | IAnyObject | ArrayBuffer;
    errorTitle?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    errorContent?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    errorRetryBtn?: boolean;
    doNotUseQueryString?: boolean;
    maxQueueSize?: number;
    sessionPosition?: 'data' | 'header' | 'both';
    headerPrefix?: {
        [key: string]: string;
    };
    sessionKeyPosition?: {
        [key: string]: 'data' | 'header' | 'both';
    };
}
export interface ICodeToSessionOptions {
    url: string;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'string';
    codeName?: string;
    data?: string | Function | IAnyObject | ArrayBuffer;
    success: Function;
    fail?: Function;
    report?: string;
    enableHttp2?: boolean;
    enableQuic?: boolean;
    enableCache?: boolean;
}
export interface IRequestOption extends IRequestObject {
    dataLoad: Function;
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
    cache?: boolean | ((res: string | IAnyObject | ArrayBuffer) => boolean);
    noCacheFlash?: boolean;
    success?: (resData: string | IAnyObject | ArrayBuffer, cacheInfo?: object, res?: any) => void;
    complete?: () => void;
    fail?: (res: string | IAnyObject | ArrayBuffer) => void;
    catchError?: boolean;
}
export interface IRequestObject extends wx.RequestOption {
    tag: string;
    notNeedSession: boolean;
    aborted: boolean;
    originUrl?: string;
    reLoginCount?: number;
    _reportStartTime?: number;
    _reportEndTime?: number;
    _resolve?: (value?: any) => void;
    _reject?: (reason?: any) => void;
}
export interface IUploadFileOption extends IUploadFileObject {
    dataLoad: Function;
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
    success?: (resData: string | IAnyObject | ArrayBuffer, cacheInfo?: object, res?: any) => void;
    complete?: () => void;
    fail?: (res: string | IAnyObject | ArrayBuffer) => void;
    catchError?: boolean;
}
export interface IUploadFileObject extends wx.UploadFileOption {
    tag: string;
    notNeedSession: boolean;
    aborted: boolean;
    originUrl?: string;
    reLoginCount?: number;
    _reportStartTime?: number;
    _reportEndTime?: number;
    _resolve?: (value?: any) => void;
    _reject?: (reason?: any) => void;
}
export interface IGetConfigResult {
    urlPerfix?: string | (() => string);
    sessionExpireTime?: number;
    sessionExpireKey?: string;
    sessionExpire?: number;
    maxQueueSize?: number;
}
export interface weRequest {
    init: (obj: IInitOption) => void;
    request: (option: IRequestOption) => Promise<object>;
    uploadFile: (option: IUploadFileOption) => Promise<object>;
    getSession: () => string;
    getConfig: () => IGetConfigResult;
    login: (callback: Function) => void;
    setSession: (x: string[]) => void;
    version: string;
}
