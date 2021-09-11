# EXPLAIN-UNICLOUD

快速、极简的uniCloud云函数开发框架。已支持云函数URL化，已支持RESTful。

框架交流QQ群：[970799055](https://jq.qq.com/?_wv=1027&k=KFkDL5gp)。

## 示例项目目录结构
```
┌── cloudfunctions 云函数目录
|   ├── common 云函数公共模块
|   |   └── explain-unicloud 核心框架
|   |   └── explain-validator 数据校验器模块
|   |   └── explain-unicloud-mvc MVC模块
|   ├── app 普通应用目录
|   |   ├── index.js 云函数入口
|   |   ├── startup.js 启动配置、路由配置、中间件、过滤器配置等
|   |   ├── services 云函数集
|   |   ├── filters 过滤器
|   |   ├── schemas JSON Schema目录
|   |   └── views 视图页
|   └── mvc MVC应用目录
|       ├── index.js 云函数入口
|       ├── startup.js 启动配置、路由配置、中间件、过滤器配置等
|       ├── models 模型
|       ├── views 视图
|       └── controllers 控制器
├── js_sdk
|   └── explain-creq 云函数和http请求模块
└── common
    ├── creq.interceptor.callfunction 云函数请求拦截器配置
    └── creq.interceptor.request http请求拦截器配置
```

## 使用方式
### 匹配模式
|参数|类型|必填|说明|
|--	|--	|--	|--	|
|service/serviceKey|String|是|需要指向的service的，若参数名与业务参数冲突可通过`app.init`配置`serviceKey`改变参数名称|
|action/actionKey|String|是|需要指向的action的，若参数名与业务参数冲突可通过`app.init`配置`actionKey`改变参数名称|
|data/dataKey|String|是|请求包含的参数，若参数名与业务参数冲突可通过`app.init`配置`dataKey`改变参数名称|

#### 云函数入口
```javascript
// app -> index.js

const explain = require("explain-unicloud");

exports.main = async (event, context) => explain.run({
	event,
	context,
	(app) => {
		app.init({baseDir: __dirname});
	}
});
```
#### 云函数
```javascript
// app -> services -> values.js

// 继承抽象父类explain.service，无需写构造函数即可调用this.event，this.context，this.explain

const explain = require("explain-unicloud");

module.exports = class home extends explain.service {
	
	index(data) {
		return 'Hello, World!';
	}
	
}
```
#### 前端
```javascript
uniCloud.callFunction({
	name: 'app',
	data: {
		service: 'values',
		action: 'getValuesAsync',
		data: {}
	}
}).then(res => {
	console.log(res)
})
```

推荐使用`explain-creq`，封装了请求拦截器，响应拦截器和错误拦截器，可自由定制请求数据处理和响应结果处理

```javascript
import creq from '@/uni_modules/explain-creq/js_sdk/explain-creq.js'

creq.callFunction('values', 'getValuesAsync', {
	name: 'app', // 指定云函数名称
	data: {} // 请求参数
}).then(res => {
	console.log(res)
})
```
### 路由模式
#### 云函数入口
```javascript
// app -> index.js

const explain = require("explain-unicloud");

exports.main = async (event, context) => explain.run({
	event,
	context,
	(app) => {
		app.init({baseDir: __dirname});
		
		// 批量添加路由
		app.route.add([{
			route: "api/values", // 可省略，省略后路由模板为service，也就是"values"
			service: "values", // services目录下的service文件名
			routes: [
				// GET api/values 获取列表数据
				{
					// route: "", // 路由模板与service一致则可省略
					// httpMethod: "GET", // action名称以对应RESTful动词开头则可省略
					action: "getValuesAsync" // service中被调用的方法名称
				},
				// GET api/values/5 获取id为5的数据，{id}会自动解析为参数注入event.data中
				{
					route: "{id}", // 将动态参数作为路由
					// httpMethod: "GET", // action名称以对应RESTful开头则可省略
					action: "getValueAsync"
				},
				// POST api/values 新增一条数据
				{
					// route: "", // 路由模板与service一致则可省略
					// httpMethod: "POST", // action名称以对应RESTful开头则可省略，除此之外还支持以create、add、insert开头
					action: "postValueAsync"
				},
				// PUT api/values/5 更新id为5的数据，{id}会自动解析为参数注入event.data中
				{
					route: "{id}",
					// httpMethod: "PUT", // action名称以对应RESTful开头则可省略，除此之外还支持以update开头
					action: "putValueAsync"
				},
				// DELETE api/values/5 删除id为5的数据，{id}会自动解析为参数注入event.data中
				{
					route: "{id}",
					// httpMethod: "DELETE", // action名称以对应RESTful开头则可省略，除此之外还支持以remove开头
					action: "deleteValueAsync"
				},
				// GET api/values/exists/5 获取id为5的数据是否存在，{id}会自动解析为参数注入event.data中
				{
					route: "exists/{id}",
					httpMethod: "GET",
					action: "checkValueIsExistsAsync"
				},
				// GET api/values/new/10 获取type为new，column为10的数据，{type}、{column}会自动解析为参数注入event.data中
				{
					route: "{type}/{column}",
					httpMethod: "GET",
					action: "getValuesAsync"
				},
				// GET api/values/2020/02/28 获取year为2020，month为02，day为28的数据，{year}、{month}、{day}会自动解析为参数注入event.data中
				{
					route: "{year}/{month}/{day}",
					httpMethod: "GET",
					action: "getValueByYearAndMonthAndDayAsync"
				},
				// GET api/values/2020-02-28 获取year为2020，month为02，day为28的数据，{year}、{month}、{day}会自动解析为参数注入event.data中
				{
					route: "{year}-{month}-{day}",
					httpMethod: ["GET"],
					action: "getValueByYearAndMonthAndDayAsync"
				},
				// GET api/values/date-2020-02-28/time:19:30:00 获取year为2020，month为02，day为28，hour为19，minute为30，second为00的数据，{year}、{month}、{day}、{hour}、{minute}、{second}会自动解析为参数注入event.data中
				{
					route: "date-{year}-{month}-{day}/time:{hour}:{minute}:{second}",
					httpMethod: ["GET"],
					action: "getValueByYearAndMonthAndDayAsync"
				}
			]
		}, {
			route: "api/test",
			service: "test",
			routes: [{
				route: "checktoken",
				httpMethod: ["GET", "POST"],
				action: "checkToken"
			}]
		}]);
		
		// 添加单个路由，此处将服务端渲染html作为示例
		app.route.add({
			// 云函数URL化后访问：https://云函数域名/请求路径/index.html
			route: "index.html",
			service: "home",
			routes: [{
				action: "index",
				httpMethod: ["GET"]
			}]
		});
		
		// 设置根路由，设置后云函数URL化不用输入路由可到达指定方法
		app.route.add([{
			route: "/",
			service: "home",
			routes: [{
				action: "index",
				httpMethod: ["GET"]
			}]
		}, {
			route: "/",
			service: "values",
			routes: [{
				action: "postValueAsync",
				httpMethod: ["POST"]
			}, {
				action: "putValueAsync",
				httpMethod: ["PUT"]
			}, {
				action: "deleteValueAsync",
				httpMethod: ["DELETE"]
			}]
		}]);
	}
});
```
#### 云函数
```javascript
// app -> services -> values.js

// 继承抽象父类explain.service，无需写构造函数即可调用this.event，this.context，this.explain

const explain = require("explain-unicloud");

module.exports = class values extends explain.service {

	async getValuesAsync() {
		return {
			data: ["explain-unicloud", "explain-admin"],
			message: "获取成功"
		}
	}

	async getValueAsync({
		id
	}) {
		return {
			data: {
				id,
				name: "Sansnn"
			},
			message: "获取成功"
		}
	}

	async postValueAsync({
		name,
		like
	}) {
		return {
			data: {
				id: 9,
				name,
				like
			},
			message: "添加成功"
		}
	}

	async putValueAsync({
		id,
		name,
		like
	}) {
		return {
			data: {
				id,
				name,
				like
			},
			message: "更新成功"
		}
	}

	async deleteValueAsync({
		id
	}) {
		return {
			data: {
				id
			},
			message: "删除成功"
		}
	}

	async checkValueIsExistsAsync({
		id
	}) {
		return {
			data: {
				id,
				checked: true
			},
			message: "检查成功"
		}
	}

	async getValueByYearAndMonthAndDayAsync({
		year,
		month,
		day
	}) {
		return {
			data: {
				date: `${year}-${month}-${day}`
			},
			message: "获取成功"
		}
	}

}

更多示例请前往目录uniCloud -> cloudfunctions -> app -> services中查看
```
#### 前端
```javascript
uni.request({
	url: 'http://tcb-e386czuna1dv2wib7e6bd-d064f3.service.tcloudbase.com/http/app/api/values',
	method: 'post',
	data: {
		name: 'Sansnn',
		like: ['explain-unicloud', 'explain-admin']
	},
	success: res => {
		console.log(res)
	}
})
```

推荐使用`explain-creq`，封装了请求拦截器，响应拦截器和错误拦截器，可自由定制请求数据处理和响应结果处理

```javascript
import creq from '@/uni_modules/explain-creq/js_sdk/explain-creq.js'

creq.request('http://tcb-e386czuna1dv2wib7e6bd-d064f3.service.tcloudbase.com/http/app/api/values', 'post', {
	data: {
		name: 'Sansnn',
		like: ['explain-unicloud', 'explain-admin']
	}
}).then(res => {
	console.log(res)
})

更多示例请前往目录pages -> route -> route.vue中查看
```

## 云函数URL化（仅支持路由模式）
#### 示例
> 腾讯云 GET http://${spaceId}.service.tcloudbase.com/${path}/api/values?a=1&b=2

> 阿里云 GET https://${spaceId}.bspapp.com/${path}/api/values?a=1&b=2

> 完整参考 GET http://tcb-e386czuna1dv2wib7e6bd-d064f3.service.tcloudbase.com/http/app/api/values

## 使用中间件
执行顺序为使用中间件时的顺序，先使用的先执行，后使用的后执行。
### app.use()
### 示例
```javascript
// app -> startup.js

module.exports = (app) => {

	app.init({
		baseDir: __dirname
	});

	// 使用中间件示例
	app.use(async ({
		event,
		context,
		explain,
		next
	}) => {
		// 异常处理中间件
		try {
			console.log("m1-0")
			await next();
			console.log("m1-1")
		} catch (e) {
			// 将响应信息改为异常信息
			explain.response.body = {
				message: e.message + (explain.request.service === "test" && explain.request
					.action === "exception" ? "，经过了异常处理中间件" : "")
			}
		}
	});
	
	app.use(async ({
		next
	}) => {
		console.log("m2-0")
		await next();
		console.log("m2-1")
	});
	
	app.use(async ({
		next
	}) => {
		console.log("m3-0")
		await next();
		console.log("m3-1")
	});

}
```

## 使用过滤器
执行顺序为注册过滤器时的顺序，先注册的先执行，后注册的后执行。
### onActionExecuting
方法执行时触发。

### 示例：实现用户身份验证
#### 云函数入口
```javascript
// app -> startup.js

module.exports = (app) => {

	app.init({
		baseDir: __dirname
	});

	// 使用过滤器示例
	app.filter.add([{
		filter: require("./filters/tokenFilter"), // 添加身份验证过滤器
		// 忽略一下service和action
		ignore: [{
			service: "values"
		}, {
			service: "home"
		}, {
			service: "test",
			actions: ["exception"]
		}]
	}]);

}
```
#### 过滤器代码
```javascript
// app -> filters -> tokenFilter.js

// 需要继承抽象父类explain.filter

const explain = require("explain-unicloud");

module.exports = class tokenFilter extends explain.filter {

	async onActionExecuting() {
		let {
			explain,
			context
		} = this;

		if (!explain.request.data.token) {
			// 使用explain.response.body直接返回至客户端
			explain.response.body = {
				code: 401,
				message: "缺少token"
			}
			return;
		}

		// let user = checkToken(event.request.data.token); // 自行封装的token验证方法
		let user = explain.request.data.token == "Sansnn" ? {
			id: 1,
			name: "Sansnn"
		} : null;
		if (user) {
			context.user = user;
		} else {
			explain.response.body = {
				code: 401,
				message: "token无效"
			}
		}
	}

}
```
#### 云函数
```javascript
// app -> services -> test.js

const explain = require("explain-unicloud");

module.exports = class test extends explain.service {
	
	async checkToken() {
		return {
			checked: true,
			data: this.context.user // 得到根据token解析出来的用户对象
		}
	}
	
}
```

### onActionExecuted
方法执行后触发。

### 示例：实现请求日志记录
#### 云函数入口
```javascript
// app -> startup.js

module.exports = (app) => {

	app.init({
		baseDir: __dirname
	});

	// 使用过滤器示例
	app.filter.add([{
		filter: require("./filters/requestFilter"), // 添加请求记录过滤器
		ignore: [{
			service: "home",
			actions: ["index"]
		}]
	}]);

}
```
#### 过滤器代码
```javascript
// app -> filters -> requestFilter.js

// 需要继承抽象父类explain.filter

const explain = require("explain-unicloud");

module.exports = class requestFilter extends explain.filter {

	async onActionExecuting() {
		let {
			explain
		} = this;

		console.log("------------");
		console.log("请求开始");
		if (explain.request.service) {
			console.log(`service: ${explain.request.service}`);
		}
		if (explain.request.action) {
			console.log(`action: ${explain.request.action}`);
		}
		if (explain.request.route) {
			console.log(`route: ${explain.request.route}`);
		}
		if (explain.request.routeTemplate) {
			console.log(`routeTemplate: ${explain.request.routeTemplate}`);
		}
		if (explain.request.httpMethod) {
			console.log(`httpMethod: ${explain.request.httpMethod}`);
		}
		if (explain.request.data) {
			console.log(`data: ${JSON.stringify(explain.request.data)}`);
		}
		console.log("------------");

		console.log(this.explain)
	}

	async onActionExecuted() {
		console.log(this.explain)

		let {
			explain
		} = this;

		console.log("------------");
		console.log("请求结束");
		console.log(`response: ${JSON.stringify(explain.response.body)}`);
		console.log("------------");

		// 可对explain.response.body重新赋值来改变响应结果
		if (explain.mode === "route") {
			explain.response.body = {
				response: explain.response.body,
				service: explain.request.service,
				action: explain.request.action,
				data: explain.request.data,
				route: explain.request.route,
				routeTemplate: explain.request.routeTemplate,
				httpMethod: explain.request.httpMethod
			}
		} else {
			explain.response.body = {
				response: explain.response.body,
				service: explain.request.service,
				action: explain.request.action,
				data: explain.request.data
			}
		}
	}

}
```

### onException
发生异常触发。

### 示例：实现全局异常处理
#### 云函数入口
```javascript
// app -> startup.js

module.exports = (app) => {

	app.init({
		baseDir: __dirname
	});

	// 使用过滤器示例
	app.filter.add([{
		filter: require("./filters/exceptionFilter") // 添加异常处理过滤器
	}]);

}
```
#### 过滤器代码
```javascript
// app -> filters -> exceptionFilter.js

// 需要继承抽象父类explain.filter

const explain = require("explain-unicloud");

module.exports = class exceptionFilter extends explain.filter {

	async onException() {
		let {
			explain
		} = this;

		// 输出日志
		console.error("------------");
		console.error("发生错误");
		if (explain.request.service) {
			console.error(`service: ${explain.request.service}`);
		}
		if (explain.request.action) {
			console.error(`action: ${explain.request.action}`);
		}
		if (explain.request.route) {
			console.error(`route: ${explain.request.route}`);
		}
		if (explain.request.httpMethod) {
			console.error(`httpMethod: ${explain.request.httpMethod}`);
		}
		if (explain.request.routeTemplate) {
			console.error(`routeTemplate: ${explain.request.routeTemplate}`);
		}
		if (explain.request.data) {
			console.error(`data: ${JSON.stringify(explain.request.data)}`);
		}
		console.error(`异常信息: ${explain.exception.message}`);
		console.error("原始异常: ", explain.exception);
		console.error("------------");

		// 发送异常信息到电子邮件
		// 
		
		throw new Error(explain.exception.message + "，经过了异常处理过滤器");
	}

}
```

## 配置说明
### app.init(options)
#### 初始化，baseDir是必须配置的

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|baseDir|String|是|项目根目录|
|serviceDir|String|否|service目录，/开头，/结尾，默认`/services/`|
|serviceKey|String|否|匹配模式下service参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`service`|
|actionKey|String|否|匹配模式下action参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`action`|
|dataKey|String|否|匹配模式下data参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`data`|
|enableMatchMode|Boolen|否|启用匹配模式，默认为`true`，`false`为禁用，禁用后仅支持路由模式访问业务函数|
|matchIgnore|Array|否|为保证安全性，匹配模式可忽略所指定的service和actions，忽略后仅配置路由模式后可访问，格式为`[{service: "serviceName", actions: ["actionName1", "actionName2"]},{...}]`，不写`actions`表示忽略该service下所有action|

#### 示例
```javascript
// 初始化
app.init({
	baseDir: __dirname, // 项目根目录
	serviceDir: "/services/", // service目录
	serviceKey: "service", // 匹配模式下service参数别名，默认"service"，作用是与其他参数冲突时可以修改为别的名称
	actionKey: "action", // 匹配模式下action参数别名，默认"action"，作用是与其他参数冲突时可以修改为别的名称
	dataKey: "data", // 匹配模式下data参数别名，默认"data"，作用是与其他参数冲突时可以修改为别的名称
	enableMatchMode: true, // 启用匹配模式，false为禁用，禁用后仅支持路由模式访问业务函数
	matchIgnore: [ // 匹配模式忽略指定的service和actions，忽略后仅配置路由模式后可访问
		{
			service: "home",
			actions: ["index"]
		}
	]
});
```

## 基类说明
### service
服务基类，继承后构造函数会自动注入`event`，`context`，`explain`几个对象，可通过`this.event`，`this.context`，`this.explain`进行调用。
#### explain对象
框架扩展，主要内容如下：

|参数|类型|说明|
|--	|--	|--	|
|mode|String|获取本次请求为`match`匹配模式还是`route`路由模式|
|config|Object|通过`app.init`初始化时的配置信息，详见`app.init`|
|request|Object|请求对象，详情见下方`explain.request`|
|response|Object|响应对象，详情见下方`explain.response`|
|exception|Object|异常对象|
|routes|Array|已配置的路由集合|
|middlewares|Object|已配置的中间件集合|
|filters|Array|已配置的过滤器集合|
|useService|Function|在服务中使用其他service，若被使用的service是继承自explain.service，则会自动注入`event`，`context`，`explain`，详情见下|

##### explain.request
|参数|类型|说明|
|--	|--	|--	|
|service|String|匹配到的`service`文件名称|
|action|String|匹配到的`action`方法名称|
|data|Object|客户端传入的参数|
|isHttp|Boolen|是否是HTTP请求、是否是云函数URL化|
|route|String|客户端传入的路由，只有当`mode`为`route`时该属性才有值|
|routeTemplate|String|成功匹配的路由模板，只有当`mode`为`route`时该属性才有值|
|httpMethod|String|HTTP Method，只有当`mode`为`route`时该属性才有值|

##### explain.response
|参数|类型|说明|
|--	|--	|--	|
|mpserverlessComposedResponse|Boolen|使用阿里云返回集成响应是需要此字段为true|
|statusCode|Number|HTTP StatusCode|
|headers|Object|HTTP Reponse Headers|
|body|Object|集成响应内容主体|

##### explain.useService(obj)
|参数|类型|必填|说明|
|--	|--	|--	|--	|
|obj|Function|是|引入的未被实例化的service对象|

### filter
过滤器基类，继承后构造函数会自动注入`event`，`context`，`explain`几个对象，可通过`this.event`，`this.context`，`this.explain`进行调用，每个对象的作用同`service`基类。

## 内置模块
### dateTime 日期时间操作
#### now(formatString, timezone)
获取当前时间

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|formatString|String|否|日期格式化，`yyyy`表示年份，`MM`表示月份，`dd`表示日期，`HH`表示时，`mm`表示分，`ss`表示秒，`fff`表示毫秒。不填则返回为时间戳|
|timezone|Number|否|formatString存在时有效，格式化为指定时区的时间，默认8|

#### format(timestamp, formatString, timezone)
日期格式化

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|要格式化的时间戳|
|formatString|String|是|日期格式化，`yyyy`表示年份，`MM`表示月份，`dd`表示日期，`HH`表示时，`mm`表示分，`ss`表示秒，`fff`表示毫秒|
|timezone|Number|否|时区，默认8|

#### addYears(timestamp, value)
添加年份

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的年份数值|

#### addMonths(timestamp, value)
添加月份

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的月份数值|

#### addDays(timestamp, value)
添加日期

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的日期数值|

#### addHours(timestamp, value)
添加时

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的时数值|

#### addMinutes(timestamp, value)
添加分

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的分数值|

#### addSeconds(timestamp, value)
添加秒

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的秒数值|

#### addMilliseconds(timestamp, value)
添加毫秒

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|timestamp|Number/String|是|时间戳|
|value|Number|是|要添加的毫秒数值|

#### 使用示例
```javascript
const { dateTime } = require("explain-unicloud");

dateTime.now("yyyy-MM-dd HH:mm:ss"); // 得到格式为2020-11-11 00:00:00的当前时间
dateTime.format(1605024000000, "yyyy年MM月dd日HH时mm分ss秒"); // 格式化时间为2020年11月11日00时00分00秒
dateTime.addYears(1605024000000, 2); // 原始日期为2020年11月11日，年份增加2年，结果为2022年11月11日
dateTime.addMonths(1605024000000, 13); // 原始日期为2020年11月，增加13个月，结果为2021年12月
dateTime.addHours(1605024000000, -1); // 原始日期为2020年11月11日00时，增加-1时，结果为2020年11月10日23时
```

### object 对象操作
#### sort(obj)
属性名称按照ASCII码从小到大排序（字典序）

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|obj|Object|是|需要排序的对象|

#### 使用示例
```javascript
const { object } = require("explain-unicloud");

var obj = {
	b: 1,
	c: 2,
	a: 3
}
obj = object.sort(obj); // 结果为{a:3,b:1,c:2}
```

<!-- ## 扩展模块
|名称|说明|链接|
|--	|--	|--	|
|explain-qrcode|二维码模块|[https://ext.dcloud.net.cn/plugin?id=3359](https://ext.dcloud.net.cn/plugin?id=3359)|
|explain-cache|缓存模块|[https://ext.dcloud.net.cn/plugin?id=3425](https://ext.dcloud.net.cn/plugin?id=3425)|
|explain-weixin|微信模块|[https://ext.dcloud.net.cn/plugin?id=3678](https://ext.dcloud.net.cn/plugin?id=3678)|

## 前端模板
|名称|说明|链接|
|--	|--	|--	|
|explain-mall|商城模板|[https://ext.dcloud.net.cn/plugin?id=3637](https://ext.dcloud.net.cn/plugin?id=3637)|
|explain-form|低代码表单生成组件|[https://ext.dcloud.net.cn/plugin?id=4880](https://ext.dcloud.net.cn/plugin?id=4880)|

## 项目模板
|名称|说明|链接|
|--	|--	|--	|
|explain-admin|云端一体后台模板|[https://ext.dcloud.net.cn/plugin?id=5084](https://ext.dcloud.net.cn/plugin?id=5084)|
 -->

### 更多模块正在开发中，敬请期待...

## 解决方案
|名称|说明|链接|
|--	|--	|--	|
|unicloud云函数TS开发最优解决方案|感谢 `老沈-1018715564@qq.com` 提供|[https://www.yinzhuoei.com/index.php/archives/470](https://www.yinzhuoei.com/index.php/archives/470)|

## 第三方插件（感谢插件作者）：
[json格式数据展示](https://ext.dcloud.net.cn/plugin?id=2687) @作者：罗魔什