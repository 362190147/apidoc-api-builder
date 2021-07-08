
import fs from "fs"
import { TsBuilder } from "../src/TsBuilder";
let target: string = "D:/project/node/oxox2/src/js/api.ts"
let content = fs.readFileSync("D:/project/node/botserver/apidoc/api_data.json").toString()
let code = new TsBuilder(content).build();
fs.writeFileSync(target, code)