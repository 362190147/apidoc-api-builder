import axios, { AxiosInstance } from "axios"
import qs from "qs"

/**data*/

export class Api {
    private static api: Api;
    axios: AxiosInstance;
    constructor(axiosInstance: AxiosInstance) {
        this.axios = axiosInstance
    }

    get baseUrl() {
        return "http://" + window.location.hostname + ":3001"
    }

    get(url: string, postData?: any) {
        let data = postData ? "?" + qs.stringify(postData) : ""
        return this.axios.get(url + data).then(s => { return s.data });
    }

    post(url: string, postData: any) {
        return this.axios.post(url, qs.stringify(postData)).then(s => { return s.data });
    }

    put(url: string, postData: any) {
        return this.axios.put(url, qs.stringify(postData)).then(s => { return s.data });
    }

    delete(url: string, postData?: any) {
        let data = postData ? "?" + qs.stringify(postData) : ""
        return this.axios.delete(url + data).then(s => { return s.data});
    }
    /**fun*/
}