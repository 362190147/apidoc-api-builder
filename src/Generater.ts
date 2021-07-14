import { ApiData, Field } from "./apidata";


export class Generater {

    protected apiDatas: ApiData[]
    constructor(api_data: string) {
        this.apiDatas = JSON.parse(api_data)
    }

    // 下划线转驼峰
   underlineToHump(s: string) {
        var a = s.split("_");
        var result = a[0];
        for (var i = 1; i < a.length; i++) {
            result = result + a[i].slice(0, 1).toUpperCase() + a[i].slice(1);
        }
        return result
    }

    // 驼峰转下划线
    humpToUnderline(str: string) {
        return str.replace(/([A-Z])/g, "_$1").toLowerCase()
    }

    getFields(fieldData:any){
        let fields:Field[] = [];
        if(!fieldData) return null;
        
        for(let key in fieldData){
            for(let o of fieldData[key]){
                fields.push(o)
            }
        }
        console.log(fields);
        return fields;
    }

    getSuccess(apiData:ApiData){
        let params:Field[] = [];
        if(!apiData.success) return null;
        
        for(let key in apiData.success.fields){
            for(let o of apiData.success.fields[key]){
                params.push(o)
            }
        }
       
        console.log(params);
        return params;
    }
}