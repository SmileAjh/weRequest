import { IRequestOption, IUploadFileOption, IErrorObject } from "../interface";
import errorHandler from "./errorHandler";
import config from '../store/config'
import taskManager from './taskManager'

class ErrorWithData extends Error {
    public data: any;

    constructor(msg: string, data: any = {}) {
        super(msg);
        this.data = data;
    }
}
function catchHandler(e: IErrorObject, obj: IRequestOption | IUploadFileOption, reject: (reason?: any) => void) {
    const { type, res } = e
    if (obj.aborted) {
        return;
    }
    
    // 清理失败的任务，防止内存泄漏
    if (obj.tag) {
        taskManager.delSessionTask(obj.tag);
    }

    // 如果有配置统一错误回调函数，则执行它
    if (typeof config.errorCallback === "function") {
        config.errorCallback(obj, res);
    }

    if (obj.catchError) {
        if (type === 'http-error') {
            return reject(new Error((res as WechatMiniprogram.RequestSuccessCallbackResult).statusCode.toString()));
        } else if (type === 'logic-error') {
            const msg = errorHandler.getErrorMsg(res as WechatMiniprogram.RequestSuccessCallbackResult);
            return reject(new ErrorWithData(msg.content, (res as WechatMiniprogram.RequestSuccessCallbackResult).data));
        } else if (type === 'system-error') {
            return reject(new Error(res.errMsg));
        } else {
            // 其他js错误
            return reject(e);
        }
    } else {
        if (type === 'http-error' || type === 'logic-error') {
            return errorHandler.logicError(obj, res as WechatMiniprogram.RequestSuccessCallbackResult);
        } else if(type === 'system-error') {
            return errorHandler.systemError(obj, res as WechatMiniprogram.GeneralCallbackResult);
        } else {
            // 其他js错误
            return reject(e);
        }
    }
}

export { catchHandler }