
import { ApiData } from "./apidata";
import { Generater } from "./Generater";

/**
 * 通过apidoc生成 api调用函数的工具
 * @param api_data apidoc生成文件的路径下的 api_data.json 文件内容
 * @returns string  生成ts代码
 */
export class TsBuilder extends Generater {

    constructor(api_data: string) {
        super(api_data);
    }


    toTsType(apiType: string) {
        switch (apiType) {
            case "String":
            case "string":
                return "string";
            case "number":
            case "Number":
                return "number"
            case "Boolean":
            case "boolean":
            case "float":
                return "number"
            default:
                break;
        }
        let matched = apiType.match(/(\w+)\[\]/)
        if (matched) {
            let t: string = this.toTsType(matched[1])
            return t + "[]"
        }
        return "any";
    }

    build() {
        let code = `// 自动生成代码，不建议修改，因为再次生成时候被覆盖，除非你确定不会再次自动生成或者是不关心修改内容
import axios from "axios"
import qs from "qs"

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
        return axios.get(url + qs.stringify(postData),{ headers:this.headers }).then(s => {
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
    deleteUrl(url: string, postData: any) {
        return axios.delete(url + qs.stringify(postData),{ headers:this.headers }).then(s => {
            return s.data
        });
    }
            
`
        this.apiDatas.forEach((el, i: number) => {
            let params = ""
            let setData = ""

            el.parameter?.fields?.Parameter.forEach((param, i: number) => {
                if (i !== 0) params += `, `
                let field = this.underlineToHump(param.field)
                let tstype = this.toTsType(param.type)
                params += `${field}: ${tstype}${param.optional ? " | null" : ""}`
                setData += `\n    postData.${param.field} = ${field};`
            });

            let name = this.underlineToHump(el.name);
            code += `
  ${name}(${params}) {
    let postData: any = {};${setData}
    return this.${el.type}(this.getBaseUrl() + "${el.url}", postData);
}
`
        });
        code += "\n}"
        return code;
    }
}


