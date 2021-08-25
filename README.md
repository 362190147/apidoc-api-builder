##
### 利用apidoc文档 生成调用代码。 目前计划生成 typescript 和 kotlin 的 interface(自行通过 retrofit 生成可调用代码) 和 数据类。视情况添加其他项目语言

[本项目 github 地址](https://github.com/362190147/apidoc-codegen.git)

> 注意:本项目暂时和apidoc官方没有任何关系，只是利用apidoc生成的文件夹下的api_data.json文件


本项目依赖apidoc的生成文档部分文件，需要先了解[Apidoc](https://apidocjs.com/)，并生成文档。

### 本项目优点：
1.写一次文档即可生成 可调用的代码，加快开发效率。
2.后端改了以后，前端可能会漏修改掉调用代码。例如调用增加必须的参数，而前端忘记添加会有发生运行错误，使用生成代码，就不会漏掉。调用缺少参数就会在编译时检测出错误。

安装 
``` cmd
npm i -d apidoc-codegen

``` 

全局安装
``` cmd
npm i -g apidoc-codegen

```

使用说明 
1. 首先使用apidoc 生成文档。请参考[Apidoc](https://apidocjs.com/) 
2. 使用apidoc-codegen生成

apidoc-codegen 参数说明：
```
选项：
      --help                显示帮助信息                                  [布尔]
      --version             显示版本号                                    [布尔]
  -t, --type                                     [必需] [可选值: "ts", "kotlin"] typescript 或者是kotlin
  -s, --src                                                      [字符串] [必需] api_data路径
  -d, --dist                                                     [字符串] [必需] 生成代码的文件夹路径
  -p, --package                                                         [字符串] kotlin包名 
      --tst, --ts-template                                              [字符串] ts代码模板路径，未设置时使用默认模板
``` 
示例
```
apidoc-codegen -t ts -s sample/api_data.json -d sample/dist/  
```
