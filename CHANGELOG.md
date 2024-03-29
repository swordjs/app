## 1.1.2
- 完善数据库所有的schema
- 完善certificationApplyOrder表的createDate等字段
- 修复内容安全api的问题（完善get-accesstoken公共模块)
- qq机器人正式服开启，欢迎大家进群玩耍，随时学习，快速提高
## 1.1.1
- 完善api环境变量的配置
- 修复上线release环境出现的问题
- 详情访问issue，获得更多信息 [#23](https://github.com/swordCodePractice/app/issues/23)
## 1.1.0
- npm包 新增typescript-type核心包，重构了unicloud/explain/sword-core等所有类型提示
- 新增 CI 持续集成小程序实现自动发布
- 新增 unicloud后端架构大幅调整，从explain1->explain2，所有核心云函数都将采用http云函数URL化
- 新增 后端架构调整&代码重构&美化代码
- 新增 TS运行时校验功能
- 新增 后端核心函数新增中间件体系
- 新增 更改explain2核心部分代码
- 新增 核心主要函数将cjs替换为es
- 新增 QQ机器人系统，推送海量题目
- 新增 微信小程序结束了审核，此后微信小程序&QQ小程序将会正常迭代
- 新增 重构&美化了API层的所有代码（*下一个版本会重点改进这里）
- 新增 更改官网的部分内容
- 新增 app核心工程升级了所有的依赖包到最新版本（*后续会对windows电脑部署项目出现的bug进行修复）
- 新增 整个app工程引入了husky和lint-staged,eslint
- 更多内容请查阅具体代码或者阅读[升级说明](https://www.yinzhuoei.com/index.php/archives/590/)

## 1.0.9
- 新增 openAPI核心云函数以及架构
- 新增 CoreOpenAPI的crud代码
- 新增 用户表下的调用次数字段
- 新增 QQ机器人架构代码 【生态新功能】
- 修改 修改题目api调整传入字段
- 修改 核心类图
- 更新 uniapp/vue3版本依赖
- 更新 全部云函数统一了配置方式，使用了uni-config-center
## 1.0.8
- 新增 文章功能模块
- 新增 统一了uni-id的版本（以及后台管理系统）
- 新增 后台管理系统 http://sword.admin.yinzhuoei.com/#/pages/login/login
- 新增 小程序用户如何使用后台管理系统的教程 https://www.yuque.com/mlgrgm/lmm8g4/pg6t14
- 删除 username的字段 username由手机号mobile替代（包括登录都用mobile）
- 删除 无用的云函数（账号密码登录和注册）
- 更新 数据库schema
- 更新 core类图 - 关于用户表和文章表
## 1.0.7
- 新增 密码管理功能，用户可以设置自己用户的密码（用于之后的后台管理系统登陆）
- 修复 首页初始化用户信息的问题
- 修复 题解详情样式bug&用户展示自己的签名
- 修复 热搜功能归纳逻辑
- 文档 精简了readme，以及新增了合作伙伴和赞助商的logo
- 文档 安装教程优先展示
- 安装 修复了dcloud插件市场下载的插件文件缺失的问题，在根目录新增了manifest.json（没有这个文件项目会被过滤掉，具体信息看[issue](https://github.com/swordCodePractice/InternetQuestionBank/issues/17)）
## 1.0.6.20210606
- 修复 发布题解提示敏感词非法的bug
- 修复 搜索功能上拉重置联想结果的bug
- 修复 热搜无效相关bug
- 文档 完善安装文档 https://www.yuque.com/mlgrgm/lmm8g4/esf5l8
- 文档 团队联系方式文档  https://www.yuque.com/mlgrgm/lmm8g4/ybvkar
- 新增 新的php题库合作伙伴 https://github.com/wudi/PHP-Interview-Best-Practices-in-China
- 新增 每日统计基本信息的云函数
## 1.0.6
- 新增 内容安全云函数，支持微信和qq双端文字敏感词校验API
- 新增 写题解&修改资料等信息已经过内容安全函数处理
- 修复 写题解富文本编辑字体过大的bug
- 优化 首页菜单toggle按钮偏移
- 优化 公共模块get-accesstoken代码体积变小且高效
- 优化 搜索页面的部分代码，逻辑并未变更
- 优化 项目readme中的类图404的问题
- 删除 原先云函数关联的fastscan付费敏感词模块
- 删除 登陆页面的hello world动画展示
## 1.0.5
- 新增PHP题库和专区
- 新增搜索功能以及API，支持热搜更新等
- 完善了在线更新的用户体验
- 完善了题目详情页面的UI以及基础功能
- 调整了用户中心的功能（issue: unicloud目前版本不支持多表嵌套查询功能，因此用户题解列表将暂时功能缺失）
- 修复 其他已知问题
## 1.0.4
- 题目详情增加写题解/自己题解的入口
- 题解详情增加写题解/自己题解的入口
- 删除题目列表的部分UI
- 优化 题目详情中的题解列表分页
- 优化 题目详情和题解详情的用户跳转功能
- 修复 其他已知问题
## 1.0.3
- 重磅更新 QQ小程序发布  
- 新增 用户体系 微信一键登录 QQ一键登录 验证码登录  
- 新增 首页抽屉交互体验
- 新增 绑定QQ 微信 手机号 三端账户互相通用
- 新增 认证出题官功能 现已人人都可以申请出题资格了！
- 新增 题解团队内部钉钉通知云函数
- 新增 云函数缓存功能
- 新增 获取Accesstoken的公共模块
- 新增 云函数多个config文件 在git忽略文件中能找到忽略的config文件
- 修复 修改资料出现的Bug
- 修复 调整了云函数开发流程，所有的核心文件存放在src中
## 1.0.2.210418
- 新增 修改资料API
- 新增 发送短信验证码API
- 新增 修改题解功能
- 修复 分享功能部分页面中文乱码的问题
- 文档 新增原型图链接可预览参考
- 文档 新增题库合作伙伴 "达达前端"
- 文档 新用户绑定流程图
- 周边 新增Python爬虫issue的工具
## 1.0.0.210405_beta
- 修复 问题列表中由于swiper产生的遮挡start按钮的问题
- 修改 首页UI的昵称和头像细微样式调整
- 修改 问题列表卡片的背景,根据奇数偶数区别背景图片
## 1.0.0.210404
- 新增 项目首次上线提交
- 新增 用户模块 题目模块 题解模块
- 新增 用户关注功能 用户答题功能 用户采纳和收藏功能
- 新增 定时云函数拉取功能
- 新增 前端训练和java训练专区
- 文档 类图变更
