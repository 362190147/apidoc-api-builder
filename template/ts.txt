import axios, { AxiosInstance } from "axios"
import qs from "qs"

/**data*/

export class Api {
    private static api: Api;
    axios: AxiosInstance;
    constructor(axiosInstance: AxiosInstance) {
        this.axios = axiosInstance
    }

    public baseUrl = ""
    
    get(url: string, data?: any) {
        return this.axios.get(url +  (data ? "?" + qs.stringify(data) : "") )
    }

    post(url: string, data: any) {
        return this.axios.post(url, qs.stringify(data))
    }

    put(url: string, data: any) {
        return this.axios.put(url, qs.stringify(data))
    }

    delete(url: string, data?: any) {
        return this.axios.delete(url +  (data ? "?" + qs.stringify(data) : "") )
    }
    /**fun*/
}