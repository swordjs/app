![](https://cdn.nlark.com/yuque/0/2021/png/2831854/1617885972908-7fb87ba7-7a38-4104-9f84-53f69e4684bc.png#align=left&display=inline&height=132&margin=%5Bobject%20Object%5D&originHeight=132&originWidth=399&status=done&style=none&width=399)
互联网人题解神器，神器在手，offer我有
随手刷题 | 无广告绿色免费 | 个性推荐 | 每日自动推送 | 多维度丰富领域知识
![](https://img.shields.io/github/issues/swordCodePractice/InternetQuestionBank#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=90&status=done&style=none&width=90)![](https://img.shields.io/github/forks/swordCodePractice/InternetQuestionBank#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=54&status=done&style=none&width=54)![](https://img.shields.io/github/stars/swordCodePractice/InternetQuestionBank#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=54&status=done&style=none&width=54)![](https://img.shields.io/github/license/swordCodePractice/InternetQuestionBank#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=120&status=done&style=none&width=120)

- [Github 仓库](https://github.com/swordCodePractice/InternetQuestionBank)
- [码云 仓库](https://gitee.com/yinzhuoei/InternetQuestionBank)
## 简要概览
《剑指题解》作为一款完全使用 [uniapp](https://uniapp.dcloud.io/) 跨端开发，配合 [UniCloud](https://unicloud.dcloud.net.cn/login) 云函数，非常轻量级，无需购买服务器设备，云函数与数据库真正做到一键部署。一键部署上线。如果你不熟悉uniapp或者unicloud那么就要去自行学习这部分的知识。


开源的意义在于，让更多的人，用到我们这款题库提升自己的市场价值，也能在此基础上，自定义你想要的功能造福更多的人。
## 开始安装
### 运行环境准备
在开始准备本地运行和操作之前，请首先确保已经有以下内容正常使用。


- 注册 [UniCloud](https://unicloud.dcloud.net.cn/login) 并且完成实名认证（开通云空间必备条件）
- 安装基础 [NodeJs](http://nodejs.cn/download/) 开发环境
- 下载并安装 [HbuilderX](https://www.dcloud.io/hbuilderx.html) 开发工具（推荐APP开发版本）
- 如果你想部署微信小程序端就要下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html), 如果你想部署QQ小程序端就要下载[QQ开发者工具](https://q.qq.com/wiki/tools/devtool/)



```shell
# 拉取最新代码
git clone https://github.com/swordCodePractice/InternetQuestionBank
cd InternetQuestionBank
# 安装项目依赖
npm install
```


在注册Dcloud账号后，请先在[Dcloud个人后台](https://dev.dcloud.net.cn/)进行 `账户中心`- `个人实名认证` 完成认证，否则无法创建云服务空间。


**手机号和邮箱均需要做验证后，方可操作**


![](https://cdn.nlark.com/yuque/0/2021/jpeg/2831854/1617892891738-d209fccd-e0bd-457b-ae09-350ed396f184.jpeg#align=left&display=inline&height=368&margin=%5Bobject%20Object%5D&originHeight=368&originWidth=983&status=done&style=none&width=983)


### 关联云空间
打开 [HbuilderX](https://www.dcloud.io/hbuilderx.html) 开发工具，通过 `打开目录` 的方式打开项目所在文件夹。


![](https://cdn.nlark.com/yuque/0/2021/jpeg/2831854/1617892891805-74c9b6f6-90e3-4992-9ca0-bf5eaeb936f0.jpeg#align=left&display=inline&height=537&margin=%5Bobject%20Object%5D&originHeight=537&originWidth=1048&status=done&style=none&width=1048)


在 `uniCloud` 目录上选择右键，`运行云服务空间初始化向导` ,这里需要登录你的  [UniCloud](https://unicloud.dcloud.net.cn/login) 账号。
添加或者选择云服务空间，请务必选择 **阿里云** 。


![](https://cdn.nlark.com/yuque/0/2021/jpeg/2831854/1617892891837-411a9558-9911-49e5-b96f-2e5ecb854200.jpeg#align=left&display=inline&height=450&margin=%5Bobject%20Object%5D&originHeight=450&originWidth=630&status=done&style=none&width=630)


![image.png](https://cdn.nlark.com/yuque/0/2021/png/710380/1618034935720-03b36b2e-3e66-41d1-b170-67d2e9eb9549.png#align=left&display=inline&height=450&margin=%5Bobject%20Object%5D&name=image.png&originHeight=450&originWidth=630&size=22439&status=done&style=none&width=630)
点击**开始部署**
其他的直接点击下一步，注意观察底部日志输出，无错误信息即部署成功。
```bash
20:24:24.119 [阿里云:s-word-code]正在上传公共模块...
20:24:32.632 [阿里云:s-word-code]公共模块上传完成
20:24:53.283 [阿里云:s-word-code]正在上传云函数application...
20:24:57.191 [阿里云:s-word-code]云函数application上传完成
20:24:57.195 [阿里云:s-word-code]正在上传云函数pull...
20:24:58.583 [阿里云:s-word-code]云函数pull上传完成
20:24:58.586 [阿里云:s-word-code]正在上传云函数send-template-msg...
20:25:01.706 [阿里云:s-word-code]云函数send-template-msg上传完成
20:25:01.706 [阿里云:s-word-code]已成功完成3个云函数上传。
20:25:40.373 [阿里云:s-word-code]开始上传所有数据集合Schema和数据库扩展校验函数
20:25:41.144 [阿里云:s-word-code]上传所有数据集合Schema和数据库扩展校验函数成功
20:25:57.081 [阿里云:s-word-code]初始化云数据库...
20:26:09.135 [阿里云:s-word-code]初始化云数据库成功
```


如果执行后，如果在 [云管理平台](https://unicloud.dcloud.net.cn/) 数据库页面，未发现表结构，请在 `database/db_init` 文件上右键，点击 `初始化云数据库` 进行手动初始化。


### 如何运行程序？
剑指题解项目使用了uniapp的cli创建方式，基于vue3，但是截止写这篇文档的时候，脚手架的一个依赖在mac环境下报错导致运行程序失败：
```shell
/InternetQuestionBank/node_modules/fork-ts-checker-webpack-plugin-v5/node_modules/fs-extra/lib/mkdirs/make-dir.js:85
```
我在这里把对应的issue贴一下：[如何解决这个问题？](https://github.com/swordCodePractice/InternetQuestionBank/issues/16)
**如果你不是mac系统你不需要做这一步**
### 运行到微信开发者工具


**1.请先运行本地微信开发者工具**，并且使用微信扫码登录后再进行以下操作。


![](https://cdn.nlark.com/yuque/0/2021/png/2831854/1617892891870-31e42f57-4d40-4823-b379-3e1d4b6b3576.png#align=left&display=inline&height=600&margin=%5Bobject%20Object%5D&originHeight=600&originWidth=800&status=done&style=none&width=800)


在微信开发者工具开启服务端口，`设置` - `安全` - `服务端口`


![](https://cdn.nlark.com/yuque/0/2021/jpeg/2831854/1617963224867-f4db8bce-76c0-4116-ae12-502a5f7cd066.jpeg#align=left&display=inline&height=739&margin=%5Bobject%20Object%5D&originHeight=739&originWidth=900&size=0&status=done&style=none&width=900)


`菜单` - `运行到小程序模拟器` - `微信开发者工具`  检查是否正确运行到微信开发者工具。


![](https://cdn.nlark.com/yuque/0/2021/jpeg/2831854/1617963224893-551c7ed7-8593-4b75-8940-d6e6d13591c9.jpeg#align=left&display=inline&height=610&margin=%5Bobject%20Object%5D&originHeight=610&originWidth=925&size=0&status=done&style=none&width=925)


## 配置小程序安全白名单
剑指题解使用的是阿里云平台，所以请根据如下文档进行配置：
[unicloud小程序域名配置](https://uniapp.dcloud.io/uniCloud/quickstart?id=%e5%b0%8f%e7%a8%8b%e5%ba%8f%e4%b8%ad%e4%bd%bf%e7%94%a8unicloud%e7%9a%84%e7%99%bd%e5%90%8d%e5%8d%95%e9%85%8d%e7%bd%ae)


## 二次云函数开发
**如果你想对本项目的后端提交pr或者你想要二次开发，那么这个部分对你很有帮助**
云函数技术栈使用的是explain框架以及ts，我们在后端开发云函数的时候，需要经过以下工具进行辅助：

1. 全局安装typescript
1. 全局安装nodemon
1. 全局安装esbuild-node-tsc


具体看以下之前写的教程：
[使用TS开发云函数指南](https://www.yinzhuoei.com/index.php/archives/470/)

安装之后，请在云函数根目录运行
```bash
npm run dev
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/710380/1618035605323-1fe45eea-62a2-48fa-9e57-90c7eb16b6c6.png#align=left&display=inline&height=818&margin=%5Bobject%20Object%5D&name=image.png&originHeight=818&originWidth=962&size=108475&status=done&style=none&width=962)

本地开发环境开启成功之后，我们就可以使用ts迭代我们的后端逻辑并且保存之后点击云函数上传即可。

## 自定义配置
在项目源代码中，有部分代码并没有上传（涉及到账号密码），如果你要完整的开发小程序，那这一步请认真阅读：
随着项目的迭代，后端开发需要配置很多很多的config，我们都在gitignore里注明了。

后端自定义配置说明请移步到：[语雀-安装配置项指南](https://www.yuque.com/docs/share/9ea0a6a6-7af6-4c6d-8679-838e212c9ac0)

## 云自助配置

部分云函数是需要用户自己到云后台配置，代码中没办法体现，但是我们仍然贴心的准备了一份指南文档，帮助用户更好的上手。
请移步：[语雀-安装配置项指南](https://www.yuque.com/docs/share/f500ddaa-6a1e-4449-84d6-908564e27de9)

## 常见问题

- `当前登录账户需完成手机号验证后才可上传云函数`
   - 请先完成uni-cloud 账户管理中心的手机号和邮箱验证！
- `[error] IDE service port disabled.`
   - 参考 微信开发者工具开启服务端口
- `[error] Error: Fail to open IDE` 
   - 尝试在微信开发者工具， `项目` - `重新打开此项目` 

## 联系我们
您遇到的问题不在上面？那请[联系我们吧～](https://www.yuque.com/docs/share/92cb643e-b6a4-4dd9-8cb4-224556e4ccef)