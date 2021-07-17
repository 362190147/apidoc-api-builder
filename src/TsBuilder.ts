
import { ApiData, Field } from "./apidata";
import { Generater } from "./Generater";

class dataMember {
    name: string
    type: string
    constructor(name: string, type: string) {
        this.name = name;
        this.type = type;
    }
}

class TsData {
    name: string
    members: dataMember[] = []

    constructor(name: string) {
        this.name = name;
    }
    toString() {
        let memberStr = ""
        this.members.forEach(el => {
            console.debug(el);
            memberStr += `${el.name}: ${el.type}| undefined\n`
        })
        return `class ${this.name}{
          ${memberStr}
      }\n`
    }
}

/**
 * 通过apidoc生成 api调用函数的工具
 * @param api_data apidoc生成文件的路径下的 api_data.json 文件内容
 * @returns string  生成ts代码
 */
export class TsBuilder extends Generater {
    template: string = ""
    tsDatas: TsData[] = [];

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
            case "Long":
            case "long":
            case "float":
            case "Float":
                return "number"
            case "Boolean":
            case "boolean":
                return "boolean"
            default:
                break;
        }
        let matched = apiType.match(/(\w+)\[\]/)
        if (matched) {
            let t: string = this.toTsType(matched[1])
            return t + "[]"
        }
        if (this.tsDatas.find(el => { return el.name == apiType })) return apiType;
        return "any";
    }


    static getUrlData(url: string) {
        let s = {
            url: url,// 转化后的api
            param: "",// retrofit @path形式的参数
            names: <string[]>[]//存储名字避免参数重复
        }
        let matched = url.match(/\:(\w+)/g);
        if (matched) {
            matched.forEach((el, i) => {
                let name = el.substr(1);
                s.names.push(name);
                if (i != 0) s.param = ", "
                s.param += `${name}:string`
                //console.log(el);
            })
        }

        s.url = url.replace(/\:(\w+)/g, "${$1}");
        return s;
    }

    generateDataclass(parameter: Field[]|null) {
        let num = 0;
        parameter?.forEach((param: Field, i: number) => {
            if (param.group == "Parameter") {
                num++;
                return;
            }
            console.error(param.group)
            let tsData = this.tsDatas.find(el => { return el.name == param.group })
            if (!tsData) {
                tsData = new TsData(param.group)
                this.tsDatas.push(tsData);
            }
            let member = tsData.members.find(el => { return el.name == param.field })
            if (!member) {
                tsData.members.push(new dataMember(param.field, this.toTsType(param.type)));
            }
        });
        return num;
    }

    generateFun(apiData: ApiData) {
        let code = ""
        let params = ""
        let postData = ""
        let url = TsBuilder.getUrlData(apiData.url)
        let parameter = this.getFields(apiData.parameter?.fields);
        //console.log(url);
        url.names.forEach((name: string, i: number) => {
            if (params) params += `, `
            params += `${name}: string`
            //console.log(name);
        });

     
                
        let num = this.generateDataclass( parameter);
       

        parameter?.forEach((param: Field, i: number) => {
            let field = this.underlineToHump(param.field)
            if (param.group != "Parameter") {
                if(num == 0){
                    let name=this.firstToLower(param.group)
                    params=`${name}:${param.group}`
                    postData=`\n    postData=${name}`
                }
                return;
            }
            let tstype = this.toTsType(param.type)
            let temp = `${field}: ${tstype}${param.optional ? " | null" : ""}`
            if (url.names.find(el => { return el == param.field })) {
                params = params.replace(`${param.field}: string`, temp)
                return;
            }
            if (params) params += `, `
            params += temp;
            postData += `\n    postData.${param.field} = ${field};`
        });

        let name = this.underlineToHump(apiData.name);
        code += `
  ${name}(${params}) {
    let postData: any = {};${postData}
    return this.${apiData.type}(this.getBaseUrl() + \`${url.url}\`, postData);
}`;
        return code;
    }

    build() {
        let code = ""
        this.apiDatas.forEach((el, i: number) => {
            code += this.generateFun(el);
        });
        //code += "\n}"

        return this.template.replace("/**replace*/", code)
    }

    buildData() {
        let code = ""
        this.tsDatas.forEach((el, i: number) => {
            code += el.toString();
        });
        //code += "\n}"

        return code
    }

}


