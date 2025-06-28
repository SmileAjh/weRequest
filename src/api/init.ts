import config from '../store/config'
import status from '../store/status'
import taskManager from '../module/taskManager'
import { IInitOption } from '../interface'

export default (params: IInitOption) => {
    Object.assign(config, params);
    
    // 设置任务队列最大长度
    if (config.maxQueueSize) {
        taskManager.setMaxQueueSize(config.maxQueueSize);
    }
    
    try {
        let data : any = {};
        for (const key in config.sessionName!) {
          const storageKey = config.sessionName![key];
          let value = wx.getStorageSync(storageKey) || '';
          if (value) {
            data[key] = value;
          }
        }
        status.session = data;
    } catch (e) {
        console.error('wx.getStorageSync:fail, can not get session.')
    }
    try {
        status.sessionExpire = wx.getStorageSync(config.sessionExpireKey || "sessionExpireKey") || Infinity;
    } catch (e) {
        console.error('wx.getStorageSync:fail, can not get sessionExpire.')
    }
}
