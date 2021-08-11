##
### 本项目暂时和apidoc官方没有任何关系，只是利用apidoc生成的文件夹下的api_data.json文件，生成可供 typescript 调用的方法 或者 kotlin 的retrofit interface 目前kotlin版本还不实用，还在优化中

[本项目 github 地址](https://github.com/362190147/apidoc-codegen.git)

本项目依赖apidoc的生成文档部分文件，需要先了解[Apidoc](https://apidocjs.com/)，并生成文档。

### 本项目优点，只需严谨可以用apidoc代码就可以生成可调用代码

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
