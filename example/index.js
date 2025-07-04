const weRequest = require('./request');

Page({
    data: {},
    onLoad: function (option) {
        this.getData(option.orderid);
    },
    getData: function (id) {
        weRequest.request({
            url: 'order/detail',
            data: {
                id: id
            },
            showLoading: true,
            success: function (data) {
                console.log(data);
            },
            codeToSessionFail: function() {

            },
            fail:function(obj, res) {
                if(codeToSessionFail) {

                } else {

                }
                // code to session

                // ...
            }
        })
    },
    upload: function() {
        weRequest.uploadFile({
            url: 'user/setapplyinfo',
            filePath: 'xxxxx.png',
            name: 'pic',
            formData: {
                'other': 'params'
            },
            success: function (data) {
                console.log(data);
            }
        })
    }
})

// 初始化配置
weRequest.init({
    // 用code换取session的CGI配置
    codeToSession: {
        url: 'auth/login',
        success: function(res) {
            return {
                token: res.token,
                userId: res.userId
            };
        }
    },
    
    // session配置
    sessionName: {
        token: 'userToken',
        userId: 'uid'
    },
    
    // [可选] session的默认位置，可选值：'data'|'header'|'both'
    // 默认为 'data'，将session放在请求的data中
    sessionDefaultPosition: 'data',
    
    // [可选] 针对特定key的位置配置，优先级高于sessionDefaultPosition
    sessionKeyPosition: {
        'token': 'header',    // token放在header中
        'userId': 'both'      // userId同时放在data和header中
    },
    
    // [可选] header中字段的前缀配置
    headerPrefix: {
        'token': 'Bearer ',   // token字段会添加 'Bearer ' 前缀
        'userId': 'X-User-'   // userId字段会添加 'X-User-' 前缀
    },
    
    // [可选] 任务队列最大长度限制，超过限制时会移除最旧的任务
    // 默认值为20，可根据业务需求调整
    maxQueueSize: 30,
    
    // 请求成功的判断条件
    successTrigger: function(res) {
        return res.code === 0;
    },
    
    // 需要重新登录的判断条件
    loginTrigger: function(res) {
        return res.code === 401;
    }
});

// 不同场景的session位置配置示例：

// 1. 最简单配置 - 只在data中传递session
weRequest.init({
    codeToSession: {
        url: 'auth/login',
        success: function(res) {
            return {
                session: res.sessionId
            };
        }
    },
    sessionName: {
        session: 'userSession'
    },
    // session默认就放在data中，可以省略此配置
    // sessionDefaultPosition: 'data',
    successTrigger: function(res) {
        return res.code === 0;
    }
});

// 2. 全部放在data中（显式配置），可不配置
weRequest.init({
    sessionDefaultPosition: 'data'
});

// 2. 全部放在header中
weRequest.init({
    sessionDefaultPosition: 'header',
    headerPrefix: {
        'token': 'Bearer '
    }
});

// 3. 混合配置 - 根据不同字段设置不同位置
weRequest.init({
    sessionDefaultPosition: 'data',      // 默认放data中
    sessionKeyPosition: {
        'token': 'header',               // token单独放header
        'sessionId': 'both'              // sessionId同时放data和header
    },
    headerPrefix: {
        'token': 'Bearer '
    }
});