import axios from "axios"
import qs from "qs"

/**data*/

let instance = axios.create();

instance.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token')
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.oxoxauth = token  //请求头加上token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    });

// instance.interceptors.response.use(
//     res => {
//      return res.data.data
//   },
//   err=>{
//     return Promise.reject(err)
//   }
// );

export class Api {
    private static api: Api
    constructor() {

    }
    static getApi() {
        if (!Api.api) {
            Api.api = new Api()
        }
        return Api.api;
    }

    get baseUrl() {
        return "http://" + window.location.hostname + ":3001"
    }

    getApidoc() {
        return this.baseUrl + "/apidoc/index.html"
    }


    get(url: string, postData?: any) {
        let data = postData ? "?" + qs.stringify(postData) : ""
        return instance.get(url + data).then(s => {
            return s.data
        });
    }


    post(url: string, postData: any) {
        return instance.post(url, qs.stringify(postData)).then(s => {
            return s.data
        });
    }

    put(url: string, postData: any) {
        return instance.put(url, qs.stringify(postData)).then(s => {
            return s.data
        });
    }
    delete(url: string, postData?: any) {
        let data = postData ? "?" + qs.stringify(postData) : ""
        return instance.delete(url + data ).then(s => {
            return s.data
        });
    }
    /**fun*/

}