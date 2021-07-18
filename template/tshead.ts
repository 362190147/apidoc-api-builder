import axios from "axios"
import qs from "qs"
 
/**data*/

export class Api {
    private static api:Api
    vue:any
    constructor(){
        
    }
    get headers(){
        if(this.vue){
            return {"oxoxauth":this.vue.$cookies.get("logincode")};
        }else{
            return null
        }
    }

    static getApi(){
        if(!Api.api){
            Api.api=new Api()
            }
            return Api.api;
    }
        
    getBaseUrl() {
        return "http://" + window.location.hostname + ":3001"
    }
        
    getApidoc() {
        return this.getBaseUrl() + "/apidoc/index.html"
    }
        

    get(url: string, postData: any) {
        return axios.get(url + "?" +qs.stringify(postData),{ headers:this.headers }).then(s => {
            return s.data
        });
    }


    post(url: string, postData: any) {
        return axios.post(url, qs.stringify(postData), { headers:this.headers }).then(s => {
            return s.data
        });
    }
        
    put(url: string, postData: any) {
        return axios.put(url, qs.stringify(postData),{ headers:this.headers }).then(s => {
            return s.data
        });
    }
    delete(url: string, postData: any) {
        return axios.delete(url + "?" + qs.stringify(postData),{ headers:this.headers }).then(s => {
            return s.data
        });
    }
    /**fun*/

}