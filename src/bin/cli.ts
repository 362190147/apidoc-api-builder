#!/usr/bin/env node
import yargs from 'yargs/yargs';
const { hideBin } = require('yargs/helpers');
import { TsBuilder } from "../lib/TsBuilder";
import fs from "fs"
import { KotlinBuilder } from '../lib/KotlinBuilder';
import path from 'path';
interface Arguments {
    [x: string]: unknown;
    a: boolean;
    b: string;
    c: number | undefined;
    d: (string | number)[] | undefined;
    e: number;
    f: string | undefined;
}


let parser = yargs(hideBin(process.argv)).options({
    t: { choices: ['ts', 'kotlin'], alias: 'type', demandOption: true },
    s: { type: 'string', alias: 'src', demandOption: true },//api_data.json path
    d: { type: 'string', alias: 'dist', demandOption: true },//dits path
    p: { type: 'string', alias: 'package' },//kotlin package name
    tst: { type: 'string', alias: 'ts-template' },//typescript template 
})
    .usage('Usage: apidoc-codegen -t [type] -s [api_data.json path] -d [dist path]  [-p] [kotlin package]');


(async () => {

    const argv = await parser.argv;

    if (!argv.d) {
        return console.error("miss argv d");
    }
    if (!argv.s) {
        return console.error("miss argv s");
    }
    if (!argv.t) {
        return console.error("miss argv t");
    }
    let api_data = fs.readFileSync(argv.s).toString()
    let dist_path = argv.d

    if (argv.type == "kotlin") {
        let packageName = "ltd.oxox.apidoc";
        if (argv.p) {
            packageName = packageName;
        }

        let builder = new KotlinBuilder(api_data);
        let apiCode = builder.BuildApiClass(packageName)
        let dataCode = builder.BuildDataClass(packageName)
        fs.writeFileSync(path.join(dist_path ,"/data/Datas.kt"), dataCode)
        fs.writeFileSync(path.join(dist_path , "/Api.kt"), apiCode)
    } else if (argv.type == "ts") {
        let tsBuilder = new TsBuilder(api_data)
        let templatePath = argv.tst ?? path.join(__dirname, "../../template/ts.txt")
        let template = fs.readFileSync(templatePath).toString();
        tsBuilder.template = template;
        //console.log(template)
        let code = tsBuilder.build();
        fs.writeFileSync(path.join(dist_path, "/api.ts"), code)
        code = tsBuilder.buildData();
        fs.writeFileSync(path.join(dist_path, "/data.ts"), code)
        
    }





})();