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
