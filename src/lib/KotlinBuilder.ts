import { ApiData, Field } from "./apidata"
import { Generater } from "./Generater"
/**
 * 通过Apidoc 中的api_data.json生成 数据类 和 调用请求的接口
 * 当前的是Apidoc 0.28.1生成的文件 如果未来版本不可以，可尝试回退此版本
 * 使用
 * auther:chenjunwei
 */
class KotlinClass {
  name: string
  codeHead: string
  codeBody: string
  codeFoot: string
  constructor(name: string,
    codeHead: string,
    codeBody: string,
    codeFoot: string) {
    this.name = name
    this.codeHead = codeHead;
    this.codeBody = codeBody;
    this.codeFoot = codeFoot;
  }
  toString() {
    return this.codeHead + this.codeBody + this.codeFoot
  }
}


export class KotlinBuilder extends Generater {
  apiFileHead: string =
    `import retrofit2.http.*
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST
import java.io.File
`
  private dataClasses: KotlinClass[] = []
  private apiClasses: KotlinClass[] = []


  /**
   * 
   * @param api_data Apidoc生成目录下的api.data.json文件内容
   * @param apiFileHeadTemplate 调用接口模板，主要为import的包名
   */
  constructor(api_data: string, apiFileHeadTemplate?: string) {
    super(api_data)
    if (apiFileHeadTemplate) {
      this.apiFileHead = apiFileHeadTemplate
    }
    this.apiDatas.forEach(el => {
      this.generateFun(el, "HttpData")
    })
  }


  /**
   * 生成调用api接口方法
   * @param apiData 
   * @param retrunType 
   */
  generateFun(apiData: ApiData, retrunType: string) {
    let method = apiData.type.toLocaleUpperCase();
    let params = ""
    let FormUrlEncoded =""
    let filed = "@Field";
    let funName = this.underlineToHump(apiData.name);
    if (method == "GET") {
      filed = "@Query";
    }

    let ktType = this.getReturnType(apiData) ; // 获取返回类型 
    let urlData = KotlinBuilder.getUrlData(apiData.url); // 获取返回类型 
    let parameter = this.getFields(apiData.parameter?.fields);

     parameter?.forEach((p:Field, i:number) => {
      if (urlData.names.find(el => { return el == p.field })) { return; } // 检测出path参数，避免重复
      if (i !== 0 || urlData.names.length > 0) params += `, `
      let param = p.field
      let type = this.toKotlinType(p.type)
      params += `${filed}("${p.field}") ${param}: ${type}${p.optional ? "?" : ""}`
    })

    //@FormUrlEncoded 无@Field的时候会出错
    if(method=="POST" && params){
      FormUrlEncoded = "\n   @FormUrlEncoded";
    }
    let code =
      `  
   @${method}("${urlData.url}")${FormUrlEncoded}
   suspend fun ${funName}(${urlData.param}${params}):${retrunType}<${ktType}>
`;
    this.saveToApiclass(apiData.group, code);
  }

  /**
   * 
   * @param url 
   * @returns 
   */
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
        s.param += `@Path("${name}") ${name}:String`
        // console.log(el);
      })
    }
    s.url = url.replace(/\:(\w+)/g, "{$1}");
    return s;
  }

  /**
   * 获取返回类型
   * 根据类型获取
   * @param apiData 
   * @returns 返回类型
   */
  getReturnType(apiData: ApiData) {
    let ktType = "Object";
    let dataClass: KotlinClass = new KotlinClass("Object", "", "", ")\n")
    let success = this.getFields(apiData.success?.fields);

    success?.forEach((el:Field, i:number) => {
      if (/data/.test(el.field) ) {
        if (el.field == "data") {
          ktType = this.toKotlinType(el.type)
          dataClass.name = this.getNotArrayType(el.type)
          dataClass.codeHead = `data class ${dataClass.name}(`
          //console.log(ktType);
        }
        
        let matched = el.field.match(/data\.(\w+)/)
        if (matched) {
          if (dataClass.codeBody != "") { dataClass.codeBody += "," }
          dataClass.codeBody += `var ${matched[1]}: ${this.getNotArrayType(el.type)}`
        }
        //console.log(el.field);
      }
    });
    this.saveToDataClass(dataClass);
    return ktType;
  }

  saveToDataClass(dataClass: KotlinClass) {
    switch (dataClass.name) {
      case "":
      case "String":
      case "string":
      case "number":
      case "Number":
      case "Boolean":
      case "boolean":
      case "Object":
      case "object":
        return
      default:
        break;
    }
    let data = this.dataClasses.find(el => { return el.name == dataClass.name })
    if (data) { return; }
    this.dataClasses.push(dataClass);

  }

  /**
   * 存储调用api接口代码
   * @param className 
   * @param funCode 
   */
  saveToApiclass(className: string, funCode: string) {
    let apiClass = this.apiClasses.find(el => { return el.name == className })
    if (!apiClass) {
      //console.log("new "+className)
      let newClass = new KotlinClass(className, `interface ${className}Api{`, "", "} \n")
      apiClass = newClass;
      this.apiClasses.push(newClass)
    }
    apiClass.codeBody += funCode;
  }

  /**
   * 将apidoc类型转换为kotlin类型
   * string转为
   * apidoc中的数组类型是Object[],转为kotlin暂定为List，以后考虑变为可选
   * @param apiType 
   * @returns 
   */
  toKotlinType(apiType: string) {
    //let ktType=apiType;
    switch (apiType) {
      case "String":
      case "string":
        return "String";
      case "number":
      case "Number":
        return "Int"
      case "boolean":
      case "Boolean":
        return "Boolean"
      case "object":
      case "Object":
        return "Object";
      case "float":
        return "Float";
      default:
        break;
    }
    let matched = apiType.match(/(\w+)\[\]/)
    if (matched) {
      let t: string = this.toKotlinType(matched[1])
      return "List<" + t + ">"
    }
    return apiType;
  }

  getNotArrayType(apiType: string) {
    let matched = apiType.match(/(\w+)\[\]/)
    if (matched) {
      return this.toKotlinType(matched[1]);
    } else {
      return this.toKotlinType(apiType);
    }
  }


  /** */
  BuildApiClass(packageName: string) {
    let apiCode =
      `package ${packageName}
${this.apiFileHead}
import ${packageName}.data.*
`;
    this.apiClasses.forEach(el => {
      apiCode += el.toString()
    })
    return apiCode;

  }

  BuildDataClass(packageName: string) {
    let dataCode =
      `package ${packageName}.data
    `;
    this.dataClasses.forEach(el => {
      dataCode += el.toString()
    })
    return dataCode;
  }

}
