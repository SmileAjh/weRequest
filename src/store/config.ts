import { IInitOption } from '../interface'

const defaultConfig: IInitOption = {
    sessionName: {
      session: 'session',
    },
    loginTrigger() {
        return false
    },
    codeToSession: {
        url: "",
        success: ()=> {}
    },
    successTrigger() {
        return true
    },
    setHeader: {},
    urlPerfix: "",
    doNotCheckSession: false,
    errorTitle: "操作失败",
    errorContent(res: any) {
        return res
    },
    errorRetryBtn: false,
    reLoginLimit: 3,
    errorCallback: null,
    reportCGI: false,
    mockJson: false,
    globalData: false,
    // session在本地缓存的key
    sessionExpireKey: "sessionExpireKey",
    // 自定义错误处理函数
    errorHandler: null,
    // 请求发送前，提供hook给开发者自定义修改发送内容
    beforeSend: null,
    // 自定义系统错误处理函数（网络错误）
    systemErrorHandler: null,
    // 默认降级处理函数
    domainChangeTrigger: (res: WechatMiniprogram.GeneralCallbackResult) => {
        // -101 和 -102 默认自动降级
        if ((res?.errMsg?.indexOf('CONNECTION_REFUSED') >= 0 || res?.errMsg?.indexOf('ERR_CONNECTION_RESET') >= 0)) {
            return true;
        }
        return false;
    },
     // 任务队列最大长度限制
     maxQueueSize: 20,
     // session 默认放在 data 中
     sessionDefaultPosition: 'data',
     // header 中字段的前缀配置
     headerPrefix: {},
     // session key 的位置配置，默认都放在 data 中
     sessionKeyPosition: {},
};

export default defaultConfig;
