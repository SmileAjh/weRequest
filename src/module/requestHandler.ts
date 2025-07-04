import loading from '../util/loading'
import config from '../store/config'
import status from '../store/status'
import mockManager from './mockManager'
import cacheManager from './cacheManager'
import sessionManager from './sessionManager'
import responseHandler from './responseHandler'
import durationReporter from "./durationReporter"
import url from '../util/url'
import { IRequestOption, IUploadFileOption, IErrorObject, ILoginResult } from "../interface"
import { catchHandler } from './catchHandler';
import taskManager from './taskManager'

// 优化的tag生成器
let requestTag = 0;
const MAX_SAFE_TAG = 1000000; // 安全阈值

function generateTag(): string {
    // 使用时间戳 + 计数器的方式，确保唯一性
    const timestamp = Date.now();
    const counter = requestTag++;
    
    // 当计数器达到安全阈值时重置
    if (requestTag >= MAX_SAFE_TAG) {
        requestTag = 0;
    }
    
    // 简单的字符串拼接，避免数值溢出
    return `${timestamp}-${counter}`;
}


// 格式化url
function format(originUrl: string) {
    if (originUrl.startsWith('http')) {
        return originUrl
    } else {
        let urlPerfix = config.urlPerfix;
        if (typeof config.urlPerfix === "function") {
            urlPerfix = config.urlPerfix()
        }
        return urlPerfix + originUrl;
    }
}

// 所有请求发出前需要做的事情
function preDo<T extends IRequestOption | IUploadFileOption>(obj: T, resolve: (value?: any) => void, reject?: (reason?: any) => void): T {
    // 登录态失效，重复登录计数
    if (typeof obj.reLoginCount === "undefined") {
        obj.reLoginCount = 0;
    } else {
        obj.reLoginCount++;
    }

    if (obj.reLoginCount === 0 && typeof obj.beforeSend === "function") {
        obj.beforeSend();
    }

    if (obj.showLoading) {
        loading.show(obj.showLoading);
    }

    if (!obj.originUrl) {
        obj.originUrl = obj.url;
        obj.url = format(obj.url);
    }

    obj._resolve = resolve;
    obj._reject = reject;

    // 如果tag不存在，则生成一个，重试保证tag唯一
    if (!obj.tag) {
        obj.tag = generateTag();
    }
    if (typeof obj.notNeedSession === "undefined") {
      obj.notNeedSession = false;
    }
    if (typeof obj.aborted === "undefined") {
      obj.aborted = false;
    }

    return obj;
}

// 格式化处理请求的obj内容
function initializeRequestObj(obj: IRequestOption) {

    if (!obj.data) {
        obj.data = {};
    }

    if (obj.dataLoad && typeof obj.dataLoad === 'function') {
      obj.data = obj.dataLoad(obj.data);
    }
    
    obj.header = obj.header ? obj.header : {};
    if (typeof config.setHeader === 'function') {
        let header = config.setHeader();
        if (typeof header === 'object') {
            obj.header = {...obj.header, ...header};
        }
    } else if (typeof config.setHeader === 'object') {
        obj.header = {...obj.header, ...config.setHeader};
    }

    // 根据配置决定 session 放在哪里
    if (obj.originUrl !== config.codeToSession.url && status.session) {
        // 默认位置
        const defaultPosition = config.sessionDefaultPosition || 'data';
        const headerSession: any = {};
        const dataSession: any = {};

        // 根据每个 key 的配置决定放在哪里
        Object.keys(status.session).forEach(key => {
            const position = config.sessionKeyPosition?.[key] || defaultPosition;
            
            if (position === 'data' || position === 'both') {
                dataSession[key] = status.session[key];
            }
            
            if (position === 'header' || position === 'both') {
                headerSession[key] = status.session[key];
            }
        });

        // 处理 data 中的 session
        if (Object.keys(dataSession).length > 0) {
            obj.data = { ...obj.data as object, ...dataSession };
            
            // 如果请求不是GET，将 data 中的 session 也放入 URL
            if (!config.doNotUseQueryString && obj.method !== "GET") {
                obj.url = url.setParams(obj.url, dataSession);
            }
        }

        // 处理 header 中的 session
        if (Object.keys(headerSession).length > 0) {
            // 添加配置的前缀
            if (config.headerPrefix) {
                Object.keys(headerSession).forEach(key => {
                    if (config.headerPrefix![key]) {
                        headerSession[key] = `${config.headerPrefix![key]}${headerSession[key]}`;
                    }
                });
            }
            obj.header = { ...obj.header, ...headerSession };
        }
    }

    // 如果有全局参数，则添加
    const gd = getGlobalData();
    obj.data = { ...gd, ...obj.data as object };

    obj.method = obj.method || 'GET';
    obj.dataType = obj.dataType || 'json';

    // 添加全局参数到 URL
    if (!config.doNotUseQueryString && obj.method !== "GET") {
        obj.url = url.setParams(obj.url, gd);
    }

    // 备用域名逻辑
    obj.url = url.replaceDomain(obj.url);

    durationReporter.start(obj);

    return obj;
}

// 格式化处理上传文件的obj内容
function initializeUploadFileObj(obj: IUploadFileOption) {
    if (!obj.formData) {
        obj.formData = {};
    }

    if (obj.dataLoad && typeof obj.dataLoad === 'function') {
      obj.formData = obj.dataLoad(obj.formData);
    }

    obj.header = obj.header ? obj.header : {};
    if (typeof config.setHeader === 'function') {
        let header = config.setHeader();
        if (typeof header === 'object') {
            obj.header = {...obj.header, ...header};
        }
    } else if (typeof config.setHeader === 'object') {
        obj.header = {...obj.header, ...config.setHeader};
    }

    if (obj.originUrl !== config.codeToSession.url && status.session) {
        obj.formData = { ...obj.formData as object, ...status.session };
    }

    // 如果有全局参数，则添加
    const gd = getGlobalData();
    obj.formData = { ...gd, ...obj.formData };

    if (!config.doNotUseQueryString) {
        // 将登陆态也带在url上
        if (status.session) {
            obj.url = url.setParams(obj.url, { ...status.session });
        }
        // 全局参数同时放在url上
        obj.url = url.setParams(obj.url, gd);
    }

    // 备用域名逻辑
    obj.url = url.replaceDomain(obj.url);

    durationReporter.start(obj);

    return obj;
}

function getGlobalData() {
    let gd: any = {};
    if (typeof config.globalData === "function") {
        gd = config.globalData();
    } else if (typeof config.globalData === "object") {
        gd = config.globalData;
    }
    return gd;
}

function doRequest(obj: IRequestOption) {
    // 真正发请求时，再次判断一次是否有登陆态
    if(!status.session) {
        return request(obj) as Promise<WechatMiniprogram.RequestSuccessCallbackResult>;
    }
    obj = initializeRequestObj(obj);
    if (obj.reLoginCount === 0 && typeof config.beforeSend === "function") {
        obj = config.beforeSend(obj, status.session);
    }
    return new Promise<WechatMiniprogram.RequestSuccessCallbackResult>((resolve, reject) => {
        const requestTask = wx.request({
            ...obj,
            success(res) {
                return resolve(res);
            },
            fail(res) {
                if (res && res.errMsg == 'request:fail abort') {
                  return;
                }
                // 如果主域名不可用，且配置了备份域名，且本次请求未使用备份域名
                if ((config.domainChangeTrigger && config.domainChangeTrigger(res)) && url.isInBackupDomainList(obj.url)) {
                    // 开启备份域名
                    enableBackupDomain(obj.url);
                    // 重试一次
                    return doRequest(obj).then((res)=> resolve(res));
                }
                return reject({ type: 'system-error', res });
            },
            complete() {
                setTimeout(()=>{
                    if (typeof obj.complete === "function") {
                        obj.complete();
                    }
                    if (obj.showLoading) {
                        loading.hide();
                    }
                }, 0)
                
            }
        });
        taskManager.addSessionTask(requestTask, obj);
    })
}

function doUploadFile(obj: IUploadFileOption) {
    // 真正发请求时，再次判断一次是否有登陆态
    if(!status.session) {
        return uploadFile(obj) as Promise<WechatMiniprogram.UploadFileSuccessCallbackResult>;
    }
    obj = initializeUploadFileObj(obj);
    if (obj.reLoginCount === 0 && typeof config.beforeSend === "function") {
        obj = config.beforeSend(obj, status.session);
    }
    return new Promise<WechatMiniprogram.UploadFileSuccessCallbackResult>((resolve, reject) => {
        wx.uploadFile({
            ...obj,
            success(res) {
                return resolve(res);
            },
            fail(res) {
                // 如果主域名不可用，且配置了备份域名，且本次请求未使用备份域名
                if ((config.domainChangeTrigger && config.domainChangeTrigger(res)) && url.isInBackupDomainList(obj.url)) {
                    // 开启备份域名
                    enableBackupDomain(obj.url);
                    // 重试一次
                    return doUploadFile(obj).then((res)=> resolve(res));
                }
                return reject({ type: 'system-error', res });
            },
            complete() {
                setTimeout(()=>{
                    if (typeof obj.complete === "function") {
                        obj.complete();
                    }
                    if (obj.showLoading) {
                        loading.hide();
                    }
                }, 0)
            }
        })
    })
}

function request<TResp>(obj: IRequestOption): Promise<TResp> {
    return new Promise((resolve, reject) => {
        obj = preDo(obj, resolve, reject);

        if (config.mockJson) {
            let mockResponse = mockManager.get(obj);
            if (mockResponse) {
                let response = responseHandler.responseForRequest(mockResponse, obj);
                return resolve(response);
            }
        }

        if (obj.cache) {
            cacheManager.get(obj);
        }

        sessionManager.main().then((res: ILoginResult|void) => {
          const promise = doRequest(obj);
          if (res && res.redoSessionTask) {
            // 登录成功后重试之前等待登录态的请求
            taskManager.redoSessionTask();
          }
          return promise;
        }).then((res: WechatMiniprogram.RequestSuccessCallbackResult) => {
            let response = responseHandler.responseForRequest(res, obj);
            if (response != null) {
                return resolve(response);
            }
        }).catch((e: IErrorObject) => {
            return catchHandler(e, obj, reject)
        })
    })
}

function uploadFile(obj: IUploadFileOption): any {
    return new Promise((resolve, reject) => {
        obj = preDo(obj, resolve, reject);

        if (config.mockJson) {
            let mockResponse = mockManager.get(obj);
            if (mockResponse) {
                let response = responseHandler.responseForUploadFile(mockResponse, obj);
                return resolve(response);
            }
        }

        sessionManager.main().then(() => {
            return doUploadFile(obj)
        }).then((res: WechatMiniprogram.UploadFileSuccessCallbackResult) => {
            let response = responseHandler.responseForUploadFile(res, obj);
            if (response != null) {
                return resolve(response);
            }
        }).catch((e: IErrorObject) => {
            catchHandler(e, obj, reject)
        })
    })
}

function enableBackupDomain(url: string = "") {
    if (!status.isEnableBackupDomain) {
        status.isEnableBackupDomain = true;
        if (typeof config.backupDomainEnableCallback === 'function') {
            config.backupDomainEnableCallback(url);
        }
    }
}

export default {
    format,
    request,
    uploadFile,
    enableBackupDomain
}
