<h2 align="center">剑指题解</h2>
<div align="center">
<img width="200" height="70" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/5623bee6-39a4-4f4b-9fab-e31d245f214e.png"></img>
</div>
<p align="center">互联网人题解神器，神器在手，offer我有
<br>
随手刷题 | 无广告绿色免费 | 个性推荐 | 每日自动推送 | 多维度丰富领域知识
</p>
<div align="center">
<img src="https://img.shields.io/github/issues/swordCodePractice/InternetQuestionBank"></img>
<img src="https://img.shields.io/github/forks/swordCodePractice/InternetQuestionBank"></img>
<img src="https://img.shields.io/github/stars/swordCodePractice/InternetQuestionBank"></img>
<img src="https://img.shields.io/github/license/swordCodePractice/InternetQuestionBank"></img>
</div>

---

项目的起源是一个 github 仓库，名为[前端知识每日 3+1](https://github.com/haizlin/fe-interview)，正是这个优秀的题库项目才有了我们团队开发聚合题库的想法。在我们国内程序员圈子，大多数小伙伴为了更好的技术发展和 offer，都通过训练题来提高自己的眼界，其中不乏包括算法/业务/软技能的题目，但是因为我们的环境和侧重点不一样，所以我们接触的项目和题目都不一样，而市面上很少有一个项目能做到，涵盖不同圈子的聚合题库。 《剑指题解》项目就是一个优秀的互联网行业聚合题库神器。

<div><img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/19fe73b3-bd01-4c7e-8418-4c90c25c4035.png" width="15%">
<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/c1746d60-2e22-4161-b23d-38b910b73c91.jpg" width="15%"><img style="margin-left: 40px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/e4395033-d45f-4e3e-a930-78ff91c8db54.png" width="40%">
</div>

##### 开源免费不易，请关注我们的公众号以及开源仓库

[![沈昊Seho/InternetQuestionBank](https://gitee.com/yinzhuoei/InternetQuestionBank/widgets/widget_card.svg?colors=393222,ebdfc1,fffae5,d8ca9f,393222,a28b40)](https://gitee.com/yinzhuoei/InternetQuestionBank)<br/>
[Github 点 star, 拉取代码时请选择最新分支](https://github.com/swordCodePractice/InternetQuestionBank)
[Dcloud 插件市场支持我们](https://ext.dcloud.net.cn/plugin?id=4637)

<a href="https://t.1yb.co/pfaP">
<img width="50%" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-86dc45ba-28e8-4734-a880-bbf700b08cf9/78978813-0347-4d90-a0d8-14df925572da.png"></img>
</a>

# 目录

- [安装](https://www.yuque.com/docs/share/b3e2c390-0441-46a1-a3da-ae6b9d108f2e)
- [特点](#特点)
- [技术栈](#技术栈)
- [UML](#UML)
- [设计概览](#设计概览)
- [API设计](#API设计（读写职责分离）)
- [开放API-新版本!](#开放API)
- [配套后台管理系统](#配套后台管理系统)
- [作者和贡献者们](#作者和贡献者们)
- [相关开源物料](#相关开源物料)
- [题库合作伙伴](#题库合作伙伴)
- [用户群&联系我们](#QQ群和钉钉群)
- [友情开源项目](#友情开源项目)
- [许可](#许可)

# 特点

1. 汇聚优秀的开源题目，以技术社区为主线展开的刷题 APP
2. 根据用户的喜好，去推送相关的最新题目，不会再刷到 “牛头不对马嘴”无用的题目
3. 我们绑定了微信服务号，每日定时推送给用户最新的题目，让你能在每天清晨就开启活力新一天
4. 刷题 APP 无广告，无硬性推广，一切盈利皆在赞助/官网流量
5. 我们还有很多有意思的待开发 feature，比如大佬带萌新模式，还将开启校园/企业的通道，让每一个学生/员工都能每时每刻提高自己
6. 剑指题解开源项目，从原型图到小程序，UI 图，UML，API 文档，第三方 API 对接说明书，使用说明都将免费开源，欢迎各位同僚二开，让这个行业变得更好，我们将用心地辅助你们解决在技术上的难题。

# 技术栈

- [uniapp](https://uniapp.dcloud.io/)
- [unicloud](https://unicloud.dcloud.net.cn/home)
- [unicloud 前端网页托管服务](https://unicloud.dcloud.net.cn/home)
- [vue3](https://vue3js.cn/)
- [typescript](https://www.tslang.cn/)

关于技术栈的选型可以参考我们的语雀文档
周边物料的开源，还需要感谢 mockPlus 以及语雀:

<div>
<a href="https://www.mockplus.cn/">
    <img class="imgIcon" src="http://static.yinzhuoei.com/typecho/2021/01/17/69752764374919.png" width="10%">
</a>
<a href="https://www.yuque.com/">
    <img class="imgIcon" src="http://static.yinzhuoei.com/typecho/2021/01/17/697832282748067.jpg" width="20%"></img>
</a>
</div>

# UML

由于此部分在开发新 feature 的工作中可能会进行变更或者本就有实质性的错误，欢迎向我们反馈错误，我们将感激不尽。

## 类图

<img src="https://github.com/swordCodePractice/InternetQuestionBank/blob/master/out/doc/db/core/core.png?raw=true"></img>

## 拉取任务

<div align=center>
<img src="https://github.com/swordCodePractice/InternetQuestionBank/blob/v1.0.0-dev/out/doc/db/pull/pull.png?raw=true"></img>
</div>

## 更多

更多相关资料请移步
`out/doc`或者[语雀-UML](https://www.yuque.com/u509950/lmm8g4/hho30u)

# 设计概览

<div>
<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/634202cd-6b93-4712-9cfc-4141b535a8aa.png" width="25%"></img>
<img src="http://static.yinzhuoei.com/typecho/2021/01/17/721852972570223.png" width="30%"></img> 
<img src="http://static.yinzhuoei.com/typecho/2021/01/17/72195918714747.png" width="30%"></img> 
</div>

设计源文件请移步：[点击查看-为了您的体验，请务必下载最新版本的设计图](https://www.yuque.com/u509950/lmm8g4/oy2ztb)
原型图在线预览: [点击查看, 如果失效请联系我们](https://app.mockplus.cn/s/16Fus8k9TTz)

# API设计（读写职责分离）

读写职责分离模式（CQRS）是一种把查询(Queries) 数据和和更新(Commands) 数据通过使用各自独立的接口分开的模式。
Uniapp 的 Unicloud 很好，其中的 jql 也是大开眼界，确实统一了前端开发操作数据库的体验，让我们前端开发操作数据库非常友好，但是我们使用 CQRS 将这些原本封装的很好的 API 不予以使用。

- 前端使用 jql 去读取想要的数据
- 写入操作就交给云函数去执行

如图，前端读取一个列表数据

```js
const db = uniCloud.database();
const databaseName = "testInit";
// 获取测试数据列表
export function getTestList() {
  return new Promise((resolve) => {
    db.collection(databaseName)
      .get()
      .then((res) => {
        // res 为数据库查询结果
        resolve(res);
      })
      .catch((err) => {
        // err.message 错误信息
        // err.code 错误码
      });
  });
}
```

我们将这样的文件抽出了一个一个查询模块，每一个模块对应了一个数据表（这里是 testInit）封装在了 API 这个文件夹中。

<img src="https://cdn.nlark.com/yuque/0/2020/png/710380/1604849161872-36fc9bd2-1988-430c-9f75-d8b989782737.png?x-oss-process=image%2Fresize%2Cw_513"></img>

Vue 页面将这样去调用，这样我们在 API 查询层将做好数据的处理，确保 Vue 拿到的是可以直接渲染的干净数据。

```js
import { getTestList } from "../../api/test";
const data = getTestList();
```

我们写入操作将通过云函数直接调用，唯一设计不同的地方在于，我们将云函数这个概念改变了，一个云函数可能要做一个版本的接口。

在我们的初步技术调研过程中，由于 Uni 官方并没有提供给用户云函数开发框架，但是我们在插件市场中找到了一款名为 explain 的开发框架，它可以迅速的帮助我们实现 restapi 风格的单路由云函数，这款框架我们不多做介绍，文档在这里：[explain.js 快速开发 uni 云函数的框架](https://ext.dcloud.net.cn/plugin?id=3312)

```js
// 注册用户根据手机号
  addUserByPhone() {
    return handleMustRequireParam(
        [{
            key: "username",
            value: "用户名",
          },
          {
            key: "password",
            value: "密码",
          },
        ],
        this.event.params
      )
      .then(async () => {
        const {
          username,
          password
        } = this.event.params;
        if (!/^1[3456789]\d{9}$/.test(username)) {
          return appErrorMessage("用户名格式不正确");
        } else if (password === "" || password.length < 6) {
          return appErrorMessage("密码格式不正确");
        } else {
          // 校验手机号
          return await uniID.register({
            username,
            password,
          });
        }
      })
      .catch((err) => {
        return err;
      });
  }
```

那么我们如果要调用 testPrint 这个模块中的增加操作

```js
uniCloud.callFunction({
  name: "application",
  data: {
    route: "api/user",
    method: "POST",
    params: {
      username: "",
      password: "",
    },
  },
});
```
想要了解更多API相关内容，请移步我们的[API文档](https://www.yuque.com/mlgrgm/lmm8g4/bgxcw3)

# 开放API

openAPI是剑指题解1.0.9版本之后的新内容，我们将暴露一部分的云函数给外部，用户可以通过后台管理系统来获取自身专属的公共api，openapi对于每一个用户来说都是免费的，但是目前每个月限制了调用次数。在初步我们每个月都会往每个用户中加入200次调用次数，每个月重置。这个调用次数随着用户的增加而上调。

<img src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/cc4c191c-5306-4123-adfe-a4bd916bc3b8.jpg">

可以从图中看到，openapi和coreapi是2个云函数，这样做的目的主要还是保持coreapi的封闭性，openapi和数据库表openapi联系，在数据表定义了数个开发的api，存储着name，remark，info等字段，这些字段均表示了api的各种信息，在管理后台管理员可以对这些api进行控制。

剑指题解程序中的token在目前的版本中是永久的，这是非常不安全的，预计在1.0之后的版本会对token进行有效期调整。openapi的2要素就是token+apiid，token是永久的token（除非您在APP中退出当前账号，这才会销毁token）。我们在后台管理系统中提供了非常简便的【复制公共API】按钮，只需要按照文档进行请求即可。

[查阅公共api文档](https://www.yuque.com/mlgrgm/lmm8g4/axpewl)
# 配套后台管理系统
后台管理系统开放角色为：管理员, 普通用户，认证答题官（具有发布权限），目前版本仍然在完善中，而且大可放心的是，后台管理系统仍然使用unicloud进行快速开发，在读取我们没有使用jql，而是直接在页面渲染client-db组件。
关于为什么和app的技术栈不一样，我这边简单归纳了几点，首先我希望后台管理系统是大家一起维护提pr的，作为一款管理产品，拓展不会太宽，是要求门槛很低且需要快速开发的，所以我选择了上手较快的云开发产品

关于已经有小程序账号的用户如何进入管理后台：[请移步这个文档](https://www.yuque.com/mlgrgm/lmm8g4/pg6t14)
剑指题解后台管理系统: http://sword.admin.yinzhuoei.com/#/pages/login/login
源代码：https://github.com/swordCodePractice/swordUserAdmin

# 作者和贡献者们

感谢为《剑指题解》这个优秀项目贡献自己一份力的小伙伴们:

<table><tbody>
      <tr><td><a target="_blank" href="https://github.com/1018715564"><img width="60px" src="https://avatars1.githubusercontent.com/u/35763284?s=460&u=018d91407ac17ac3b6abbd16cdca5b080b385b32&v=4"></a></td>
      <td><a target="_blank" href="https://github.com/maruichao52"><img width="60px" src="https://avatars0.githubusercontent.com/u/41415464?s=460&u=4e8e3f255ba143921d7eb3489cdb1be0ee4cbf4c&v=4"></a></td>
      </td>
        </tr></tbody></table>

如果您想加入到我们的贡献者队列中，[请联系我们，这里还有相关贡献者的介绍，希望对您有帮助](https://www.yuque.com/u509950/lmm8g4/bw6hgz)

- [@Seho: 负责前端和后端的开发，产品设计，以及产品的市场调研还有相关社区维护宣传](https://github.com/1018715564)
- [@maruichao52：负责后端开发工作以及后端分析工作以及社区维护宣传](https://github.com/maruichao52)
- [@Maria ^敏：APPUI，以及相关宣传物料等设计工作，设计相关合作请加微信：P309033661 备注：剑指题解](https://dribbble.com/BigMonsterQueen)

# 相关开源物料

- [语雀](https://www.yuque.com/books/share/7825dfb4-e7d2-403a-b462-21eaf9d3017e?#)
- [摹客产品设计-联系@seho 获取原型图](https://app.mockplus.cn/s/ceKIIx7cyes)

# 题库合作伙伴

- [前端面试 3+1 开源题库](https://github.com/haizlin/fe-interview)
- [Guide 哥的 JAVA 题库](https://github.com/Snailclimb/JavaGuide)
- [达达前端](https://github.com/webVueBlog/interview-answe)
- [凌枫-phpQ&A](https://github.com/colinlet/PHP-Interview-QA)
- [PHP interview best practices in China](https://github.com/wudi/PHP-Interview-Best-Practices-in-China)

# 下载小程序后台管理系统源代码下载
- [Dcloud插件市场下载](https://ext.dcloud.net.cn/plugin?id=5404)
- [Github下载](https://github.com/swordCodePractice/swordUserAdmin/tree/master)
# QQ群和钉钉群

<div style="display: flex;justify-content: flex-start;">
<img width="30%" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/6f5b6587-8efe-400f-8fcb-f277892a9854.png" />
<img width="32%" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/309debe7-7f2a-47ae-a415-875e5b1f4922.jpg"></img>
</div>

其他渠道联系我们：[联系我们](https://www.yuque.com/docs/share/92cb643e-b6a4-4dd9-8cb4-224556e4ccef)

# 友情开源项目

<table><tbody>
      <tr><td style="text-align: center;"><a target="_blank" href="https://ext.dcloud.net.cn/plugin?id=271"><img width="80px" style="margin-top: 15px;" src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-c7e81452-9d28-4486-bedc-5dbf7c8386a5/7ede4b51-1574-49b9-a84d-0ad8b8bf65a8.jpeg"></a>
      <p style="font-size: 14px;">秋云ucharts跨端图表库</p>
      </td>
</tr></tbody>
</table>

# 许可

Apache License © 剑指题解
