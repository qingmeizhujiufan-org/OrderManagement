// 'use strict';
import _ from 'lodash';
import sa from 'superagent';
//封装ajax的相关方法
var ajax = {
    /**
     * 通过get方法请求json数据
     * @param url 请求的URL
     * @param data 请求的参数
     * @param success 请求成功的回调
     * @param error 请求失败的回调
     * @param complete 请求完成时的回调，无论成功还是失败。
     * @param cookies 请求是否携带cookies
     */
    getJSON: function getJSON(url, data, success, error, complete, cookies) {
        if (_.isFunction(data)) {
            //此时的data实际是success函数
            this.request({ url: url, success: arguments[1], error: arguments[2], complete: arguments[3], cookies: arguments[4] });
        } else {
            this.request({ url: url, query: data, success: success, error: error, complete: complete, cookies: cookies });
        }
    }
    //请求携带Cookies信息
    ,
    getJSONWithCookies: function getJSONWithCookies(url, data, success, error, complete) {
        if (_.isFunction(data)) {
            this.getJSON(url, arguments[1], arguments[2], arguments[3], true);
        } else {
            this.getJSON(url, data, success, error, complete, true);
        }
    }
    //通过post方法请求json数据
    ,
    postJSON: function postJSON(url, data, success, error, complete, cookies) {
        if (_.isFunction(data)) {
            this.request({ url: url, success: arguments[1], error: arguments[2], complete: arguments[3], cookies: arguments[4], method: 'POST' });
        } else {
            this.request({ url: url, send: data, success: success, error: error, complete: complete, cookies: cookies, method: 'POST' });
        }
    }
    //请求携带Cookies信息
    ,
    postJSONWithCookies: function postJSONWithCookies(url, data, success, error, complete) {
        if (_.isFunction(data)) {
            this.postJSON(url, arguments[1], arguments[2], arguments[3], true);
        } else {
            this.postJSON(url, data, success, error, complete, true);
        }
    }
    //通过delete方法请求json数据
    ,
    delJSON: function delJSON(url, data, success, error, complete, cookies) {
        if (_.isFunction(data)) {
            this.request({ url: url, success: arguments[1], error: arguments[2], complete: arguments[3], cookies: arguments[4], method: 'DELETE' });
        } else {
            this.request({ url: url, send: data, success: success, error: success, complete: complete, cookies: cookies, method: 'DELETE' });
        }
    }
    //请求携带Cookies信息
    ,
    delJSONWithCookies: function delJSONWithCookies(url, data, success, error, complete) {
        if (_.isFunction(data)) {
            this.delJSON(url, arguments[1], arguments[2], arguments[3], true);
        } else {
            this.delJSON(url, data, success, error, complete, true);
        }
    }
    //通过get方法请求text数据
    ,
    getText: function getText(url, data, success, error, complete, cookies) {
        if (_.isFunction(data)) {
            this.request({ url: url, success: arguments[1], error: arguments[2], complete: arguments[3], cookies: arguments[4], accept: 'text' });
        } else {
            this.request({ url: url, query: data, success: success, error: error, complete: complete, cookies: cookies, accept: 'text' });
        }
    }
    //通过post方法请求text数据
    ,
    postText: function postText(url, data, success, error, complete, cookies) {
        if (_.isFunction(data)) {
            this.request({ url: url, success: arguments[1], error: arguments[2], complete: arguments[3], cookies: arguments[4], method: 'POST', accept: 'text' });
        } else {
            this.request({ url: url, send: data, success: success, error: error, complete: complete, cookies: cookies, method: 'POST', accept: 'text' });
        }
    }
    //设置全局header信息
    ,
    _defaultHeader: {}
    /**
     * 设置缺省的全局header
     * @param key
     * @param value 当值为undefined时则移除本key信息
     */
    , setDefaultHeader: function setDefaultHeader(key, value) {
        if (key) {
            if (value) {
                this._defaultHeader[key] = value;
            } else {
                delete this._defaultHeader[key];
            }
        }
    }
    //发送http请求
    , request: function request(options) {
        var _defaults = {
            method: 'GET', // 默认请求方法
            type: 'json', // 请求体发送方式 application/json|json|png
            url: '', // 请求url
            header: null, //{object}设置当前请求的header信息
            cookies: false, //是否携带cookies信息
            noToken: false, // 是否在请求中禁用token信息
            //reloginIfTokenExpired: true, // 是否token失效自动跳转到登录界面
            send: '', //POST请求参数，即参数不会拼接在URL后面。
            query: '', //GET请求参数，即参数拼接在URL后面。
            // type : '', // 默认content-type，支持text/html|application/x-www-form-urlencoded|application/json|multipart/form-data
            // accept : '', // 默认接受类型application/json|json|text|text/plain
            success: null, // 请求成功的回调函数
            error: null, // 请求失败的回调函数，包括http客户端错误、服务端错误、以及接口调用成功但存在业务错误
            complete: null // 请求完成的回调函数(不管成功还是失败)
        };
        _.assign(_defaults, options);
        // 禁用token
        if (options.query && options.query.noToken !== undefined) {
            _defaults.noToken = options.query.noToken;
        }
        // 发送ajax请求
        var contentType = 'application/json;charset=UTF-8';
        if (_defaults.type === 'form') {
            contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        var req = sa(_defaults.method, _defaults.url).set('Content-Type', contentType);
        //设置全局的header信息
        for (var header in this._defaultHeader) {
            if (this._defaultHeader[header] !== undefined) {
                req.set(header, this._defaultHeader[header]);
            }
        }
        //设置当前请求的header信息
        if (_defaults.header && _.isPlainObject(_defaults.header)) {
            for (var headerKey in _defaults.header) {
                if (_defaults.header[headerKey] !== undefined) {
                    req.set(headerKey, _defaults.header[headerKey]);
                }
            }
        }
        //存在token则携带全局token到header里面
        var token = sessionStorage.token;
        if(token){
            req.set('Token', token);
        }else {
            window.location.hash = '/login';
        }
        req.query(_defaults.query).send(_defaults.send).end(function (err, res) {
            if (err && err.status === 401) {
                window.location.hash = '/login';
            }
            if (res && res.ok) {
                if (res.headers && res.headers['icop-content-type']) {
                    if (typeof _defaults.error === 'function') {
                        //如果有外部的错误异常处理则使用外部的
                        _defaults.error(res);
                    } else {
                        //如果没有则使用内部默认的异常处理
                        //捕获服务端包装的异常消息
                        // Toast.fail(res.text && res.text.length > 0 ? res.text : res.body, 3);
                    }
                    return;
                } else {
                    if (typeof _defaults.success === 'function') {
                        if (_defaults.accept === 'text') {
                            _defaults.success(res.text);
                        } else {
                            _defaults.success(res.body);
                        }
                    }
                }
            }
            if (_defaults.complete) {
                _defaults.complete(res);
            }
        });
    }
};

export default ajax;