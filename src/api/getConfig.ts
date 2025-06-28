import config from '../store/config'
import status from '../store/status'
import taskManager from '../module/taskManager'

export default () => {
    return {
        urlPerfix: config.urlPerfix,
        sessionExpireTime: config.sessionExpireTime,
        sessionExpireKey: config.sessionExpireKey,
        sessionExpire: status.sessionExpire,
        maxQueueSize: taskManager.getMaxQueueSize()
    }
};
