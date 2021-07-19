"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
var axios_1 = __importDefault(require("axios"));
var qs_1 = __importDefault(require("qs"));
/**data*/
var instance = axios_1.default.create();
instance.interceptors.request.use(function (config) {
    var token = sessionStorage.getItem('token');
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.oxoxauth = token; //请求头加上token
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});
// instance.interceptors.response.use(
//     res => {
//      return res.data.data
//   },
//   err=>{
//     return Promise.reject(err)
//   }
// );
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.getApi = function () {
        if (!Api.api) {
            Api.api = new Api();
        }
        return Api.api;
    };
    Api.prototype.getBaseUrl = function () {
        return "http://" + window.location.hostname + ":3001";
    };
    Api.prototype.getApidoc = function () {
        return this.getBaseUrl() + "/apidoc/index.html";
    };
    Api.prototype.get = function (url, postData) {
        return instance.get(url + "?" + qs_1.default.stringify(postData)).then(function (s) {
            return s.data;
        });
    };
    Api.prototype.post = function (url, postData) {
        return instance.post(url, qs_1.default.stringify(postData)).then(function (s) {
            return s.data;
        });
    };
    Api.prototype.put = function (url, postData) {
        return instance.put(url, qs_1.default.stringify(postData)).then(function (s) {
            return s.data;
        });
    };
    Api.prototype.delete = function (url, postData) {
        return instance.delete(url + "?" + qs_1.default.stringify(postData)).then(function (s) {
            return s.data;
        });
    };
    return Api;
}());
exports.Api = Api;
