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
    // ... 其他配置 ...
    
    // [可选] 任务队列最大长度限制，超过限制时会移除最旧的任务
    // 默认值为100，可根据业务需求调整
    maxQueueSize: 200,
    
    // ... 其他配置 ...
});