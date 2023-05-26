# docx-example
这是一个使用docx导出word的代码展示，使用方法代码供大家参考，说不定小伙伴们有更好的想法，docx导出的word基本上可以满足大部分需求了，（个人认为）前端使用导出的时候需要注意图片需要转base64，因此图片越多，导出速度肯定受到影响，如果是服务端支持fs去读取图片，使用的docx版本为6.0.3，v7版本使用发现导出速度较慢，等待官方修复
> 2022/5/10 突发奇想 尝试把经常使用的封装成npm包，方便下载就可直接使用    
> easy-word 插件制作成功,目前只单单支持图文和表格的导出,使用方法去脚本地址查看
> 2022/6/28 更新修复，后续会修复尝试合并其他导出功能
# 下载案例
> git clone https://github.com/Slash214/docx-demo.git    
> cd docx-demo    
> npm install    

# easy-word 插件
> npm install easy-wrod   
[脚本地址](https://www.npmjs.com/package/easy-word)


# 导出样式
[基础图文样式](/src/assets/graphic.png)
[基础表格样式](/src/assets/table.png)

目录结构其代码存在views下， 请求的是mock数据，导出方法主要在tool里面，展示的demo请求的数据都是200的
每一个数据里面存在5张图片，相当于1K个图片，大家可以自己感觉导出速度如何

# 功能开发
- 图文案例
- 表格案例
- 其他正在开发...

# npm 包
- [npm包](https://www.npmjs.com/package/easy-word)


# 2023-5-26 代码重构中>>>




