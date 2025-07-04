/// <reference types="miniprogram-api-typings" />
/// <reference types="miniprogram-api-typings" />
export type Request = <TResp>(options: IRequestOption) => Promise<TResp>;
export type IAnyObject = WechatMiniprogram.IAnyObject;
export interface IInitOption {
    codeToSession: ICodeToSessionOptions;
    sessionName?: Record<string, string>;
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
    successData?: (resData: string | IAnyObject | ArrayBuffer, res?: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.UploadFileSuccessCallbackResult) => string | IAnyObject | ArrayBuffer;
    errorTitle?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    errorContent?: string | ((res: string | IAnyObject | ArrayBuffer) => string);
    errorRetryBtn?: boolean;
    doNotUseQueryString?: boolean;
    errorHandler?: Function | null;
    beforeSend?: Function | null;
    systemErrorHandler?: Function | null;
    backupDomainList?: IAnyObject;
    backupDomainEnableCallback?: Function;
    domainChangeTrigger?: Function;
    maxQueueSize?: number;
    sessionDefaultPosition?: 'data' | 'header' | 'both';
    headerPrefix?: {
        [key: string]: string;
    };
    sessionKeyPosition?: {
        [key: string]: 'data' | 'header' | 'both';
    };
}
export interface ICodeToSessionOptions {
    url: string;
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
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
    dataLoad?: Function;
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
export interface IRequestObject extends WechatMiniprogram.RequestOption {
    tag?: string;
    notNeedSession?: boolean;
    aborted?: boolean;
    originUrl?: string;
    reLoginCount?: number;
    _reportStartTime?: number;
    _reportEndTime?: number;
    _resolve?: (value?: any) => void;
    _reject?: (reason?: any) => void;
}
export interface IUploadFileOption extends IUploadFileObject {
    dataLoad?: Function;
    beforeSend?: Function;
    showLoading?: boolean | string;
    report?: string;
    success?: (resData: string | IAnyObject | ArrayBuffer, cacheInfo?: object, res?: any) => void;
    complete?: () => void;
    fail?: (res: string | IAnyObject | ArrayBuffer) => void;
    catchError?: boolean;
}
export interface IUploadFileObject extends WechatMiniprogram.UploadFileOption {
    tag?: string;
    notNeedSession?: boolean;
    aborted?: boolean;
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
export interface IErrorObject {
    type: 'logic-error' | 'http-error' | 'system-error';
    res: WechatMiniprogram.RequestSuccessCallbackResult | WechatMiniprogram.GeneralCallbackResult;
}
export interface ILoginResult {
    redoSessionTask: boolean;
}
export interface ITaskQueueItem {
    task: WechatMiniprogram.RequestTask | WechatMiniprogram.UploadTask;
    obj: IRequestOption;
}
export interface TaskQueueItem {
    task: WechatMiniprogram.RequestTask;
    obj: IRequestOption;
}
