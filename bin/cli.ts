#!/usr/bin/env node
import yargs from 'yargs/yargs';
const { hideBin } = require('yargs/helpers');
import { TsBuilder } from "../src/TsBuilder";
import fs from "fs"
import { KotlinBuilder } from '../src/KotlinBuilder';
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
    p: { type: 'string', alias: 'package' },//kotlin 
})
    .usage('Usage: apibuilder -t [type] -s [api_data.json path] -d [dist path]  [-p] [kotlin package]');


(async () => {

    const argv = await parser.argv;

    if (!argv.d) {
        console.error("miss argv d")
        return;
    }
    if (!argv.s) {
        console.error("miss argv s")
        return;
    }
    if (!argv.t) {
        console.error("miss argv t")
        return;
    }
    let api_data = fs.readFileSync(argv.s).toString()
    let dist_path = argv.d

    if (argv.type == "kotlin") {
        if (!argv.p) {
            console.error("kotlin need argv p")
            return;
        }

        let builder = new KotlinBuilder(api_data);
        let apiCode = builder.BuildApiClass(argv.p)
        let dataCode = builder.BuildDataClass(argv.p)
        fs.writeFileSync(path.join(dist_path ,"/data/Datas.kt"), dataCode)
        fs.writeFileSync(path.join(dist_path , "/Api.kt"), apiCode)
    } else if (argv.type == "ts") {
        let tsBuilder = new TsBuilder(api_data)
        let template = fs.readFileSync(path.join(__dirname, "../template/tshead.ts")).toString();
        tsBuilder.template = template;
        console.log(template)
        let code = tsBuilder.build();
        fs.writeFileSync(path.join(dist_path, "/api.ts"), code)
        code = tsBuilder.buildData();
        fs.writeFileSync(path.join(dist_path, "/data.ts"), code)
        
    }





})();