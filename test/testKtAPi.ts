import { KotlinBuilder } from "../src/KotlinBuilder";
import fs from "fs"
let api_data = fs.readFileSync("D:/project/node/botserver/apidoc/api_data.json").toString()
let path="D:/project/android/OxCore/oxapi/src/main/java/ltd/oxox/oxapi"

let builder=new KotlinBuilder(api_data);//.Build("ltd.oxox.oxapi")
let apiCode=builder.BuildApiClass("ltd.oxox.oxapi")
let dataCode=builder.BuildDataClass("ltd.oxox.oxapi")
fs.writeFileSync(path + "/data/Datas.kt", dataCode)
fs.writeFileSync(path + "/Api.kt", apiCode)