# EXPLAIN

快速、极简的uniCloud云函数开发框架。已支持云函数URL化。已支持RESTful。

加入QQ群：[970799055](https://jq.qq.com/?_wv=1027&k=KFkDL5gp)。

若从插件市场直接部署后报错，在本地重新上传部署一次即可。

## 目录结构
```
┌── cloudfunctions 云函数目录
|   ├── common 云函数公共模块
|   |   └── explain
|   └── application 业务逻辑函数目录
|       ├── filters 过滤器
|       ├── services 云函数集
|       └── index.js 云函数入口
└──
```

## 使用方式
### 匹配模式
#### 云函数入口
```javascript
// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, (config) => {
		
		config.init({baseDir: __dirname});
		
	});
}
```
#### 云函数
```javascript
// application -> services -> home.js

// 继承抽象父类explain.service，无需写构造函数即可调用this.event，this.context，this.explain

const explain = require("explain");

module.exports = class home extends explain.service {
	
	index(params) {
		return 'Hello, World!';
	}
	
}
```
#### 前端
```javascript
uniCloud.callFunction({
	name: 'application',
	data: {
		service: 'home',
		action: 'index',
		params: {}
	}
}).then(res => {
	console.log(res)
})
```
### 路由模式
#### 云函数入口
```javascript
// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, (config) => {
		
		config.init({baseDir: __dirname});
		
		// 设置根路由，设置后云函数URL化不用指定service和route或route=/可到达指定方法
		config.route.setRoot({
			get: {
				service: "home",
				action: "index"
			},
			post: {
				service: "values",
				action: "postValueAsync"
			},
			// put: {
			// 	service: "values",
			// 	action: "putValueAsync"
			// },
			// delete: {
			// 	service: "values",
			// 	action: "deleteValueAsync"
			// }
			// ...
		});
		
		/**
		 * 配置路由
		 * 路由参数内不能包含/字符，如果包含&#符号请求前需进行编码。
		 */
		config.route.add([{
			route: "api/values", // 可省略，省略后路由模板为service，也就是"values"
			service: "values",
			routes: [
				// GET api/values 获取列表数据
				{
					// route: "", // 路由模板与service一致则可省略
					// httpMethod: "GET", // action名称以对应RESTful动词（不区分大小写）开头则可省略
					action: "getValuesAsync"
				},
				// GET api/values/5 获取id为5的数据，{id}会自动解析为参数注入event.params中
				{
					route: "{id}",
					// httpMethod: "GET", // action名称以对应RESTful动词（不区分大小写）开头则可省略
					action: "getValueAsync"
				},
				// POST api/values 新增一条数据
				{
					// route: "", // 路由模板与service一致则可省略
					// httpMethod: "POST", // action名称以对应RESTful动词（不区分大小写）开头则可省略，除此之外还支持以create、add、insert开头
					action: "postValueAsync"
				},
				// PUT api/values/5 更新id为5的数据，{id}会自动解析为参数注入event.params中
				{
					route: "{id}",
					// httpMethod: "PUT", // action名称以对应RESTful动词（不区分大小写）开头则可省略，除此之外还支持以update开头
					action: "putValueAsync"
				},
				// DELETE api/values/5 删除id为5的数据，{id}会自动解析为参数注入event.params中
				{
					route: "{id}",
					// httpMethod: "DELETE", // action名称以对应RESTful动词（不区分大小写）开头则可省略，除此之外还支持以remove开头
					action: "deleteValueAsync"
				},
				// GET api/values/exists/5 获取id为5的数据是否存在，{id}会自动解析为参数注入event.params中
				{
					route: "exists/{id}",
					httpMethod: "GET",
					action: "checkValueIsExistsAsync"
				},
				// GET api/values/new/10 获取type为new，column为10的数据，{type}、{column}会自动解析为参数注入event.params中
				{
					route: "{type}/{column}",
					httpMethod: "GET",
					action: "getValuesAsync"
				},
				// GET api/values/2020/02/28 获取year为2020，month为02，day为28的数据，{year}、{month}、{day}会自动解析为参数注入event.params中
				{
					route: "{year}/{month}/{day}",
					httpMethod: "GET",
					action: "getValueByYearAndMonthAndDayAsync"
				},
				// GET api/values/2020-02-28 获取year为2020，month为02，day为28的数据，{year}、{month}、{day}会自动解析为参数注入event.params中
				{
					route: "{year}-{month}-{day}",
					httpMethod: ["GET"],
					action: "getValueByYearAndMonthAndDayAsync"
				},
				// GET api/values/date-2020-02-28/time-19:30:00 获取year为2020，month为02，day为28，hour为19，minute为30，second为00的数据，{year}、{month}、{day}、{hour}、{minute}、{second}会自动解析为参数注入event.params中
				{
					route: "date-{year}-{month}-{day}/time:{hour}:{minute}:{second}",
					httpMethod: ["GET"],
					action: "getValueByYearAndMonthAndDayAsync"
				}
			]
		}]);
		
	});
}
```
#### 云函数
```javascript
// application -> services -> values.js

// 继承抽象父类explain.service，无需写构造函数即可调用this.event，this.context，this.explain

const explain = require("explain");

module.exports = class values extends explain.service {

	async getValuesAsync() {
		let res = {
			service: "values",
			action: "getValuesAsync",
			params: this.event.params,
			message: "获取成功",
			response: ["value1", "value2"]
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

	async getValueAsync({
		id
	}) {
		let res = {
			service: "values",
			action: "getValueAsync",
			params: this.event.params,
			message: "获取成功",
			response: "value"
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

	async postValueAsync({
		value
	}) {
		let res = {
			service: "values",
			action: "postValueAsync",
			params: this.event.params,
			message: "添加成功"
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

	async putValueAsync({
		id,
		value
	}) {
		let res = {
			service: "values",
			action: "putValueAsync",
			params: this.event.params,
			message: "更新成功"
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

	async deleteValueAsync({
		id
	}) {
		let res = {
			service: "values",
			action: "deleteValueAsync",
			params: this.event.params,
			message: "删除成功"
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

	async checkValueIsExistsAsync({
		id
	}) {
		let res = {
			service: "values",
			action: "getValueIsExistsAsync",
			params: this.event.params,
			message: "检查成功",
			response: true
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

	async getValueByYearAndMonthAndDayAsync({
		year,
		month,
		day
	}) {
		let res = {
			service: "values",
			action: "getValueByYearAndMonthAndDayAsync",
			params: this.event.params,
			message: "获取成功",
			response: `${year}-${month}-${day}`
		}
		if (this.explain.mode === "route") {
			res = Object.assign({
				route: this.event.route,
				routeTemplate: this.context.routeTemplate,
				httpMethod: this.context.httpMethod
			}, res);
		}
		return res;
	}

}

```
#### 前端
```javascript
// 获取数据列表
uniCloud.callFunction({
	name: 'application',
	data: {
		route: 'api/values',
		method: 'GET',
		params: {
			page: 1,
			limit: 10
		}
	}
}).then(res => {
	console.log(res)
})

// 获取id为5的数据
uniCloud.callFunction({
	name: 'application',
	data: {
		route: 'api/values/5',
		method: 'GET',
		params: {}
	}
}).then(res => {
	console.log(res)
})

// 添加一条数据
uniCloud.callFunction({
	name: 'application',
	data: {
		route: 'api/values',
		method: 'POST',
		params: {
			name: 'Sansnn',
			like: ['explain1', 'explain2']
		}
	}
}).then(res => {
	console.log(res)
})

// 更新id为5的数据
uniCloud.callFunction({
	name: 'application',
	data: {
		route: 'api/values/5',
		method: 'POST',
		params: {
			name: '3snn',
			like: ['explain1', 'explain2', 'explain3']
		}
	}
}).then(res => {
	console.log(res)
})
```

## 云函数URL化
### 匹配模式
以下参数为必填，其他参数最终会被合并至`event.params`中。

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|service/serviceKey|String|是|需要指向的service的，若参数名与业务参数冲突可通过`config.init`配置`serviceKey`改变参数名称|
|action/actionKey|String|是|需要指向的action的，若参数名与业务参数冲突可通过`config.init`配置`actionKey`改变参数名称|

#### 示例
> GET https://${spaceId}.service.tcloudbase.com/${path}?service=home&action=index&a=1&b=2

```javascript
const explain = require("explain");

module.exports = class home extends explain.service {
	
	index(params) {
		return params; // 接收到的params为{a: "1", b: "2"}
	}
	
}
```

> POST https://${spaceId}.service.tcloudbase.com/${path}?service=home&action=index

```javascript
// 以uni.request为例

uni.request({
	method: 'POST',
	url: 'https://${spaceId}.service.tcloudbase.com/${path}?service=home&action=index',
	data: {
		params: {
			a: 1,
			b: 2
		}
	}
})

// 或

uni.request({
	method: 'POST',
	url: 'https://${spaceId}.service.tcloudbase.com/${path}',
	data: {
		service: 'home',
		action: 'index',
		params: {
			a: 1,
			b: 2
		}
	}
})
```
```javascript
const explain = require("explain");

module.exports = class home extends explain.service {
	
	index(params) {
		return params; // 接收到的params为{a: 1, b: 2}
	}
	
}
```

### 路由模式
以下参数为必填，其他参数最终会被合并至`event.params`中。以下示例的路由配置使用`使用方式 -> 路由模式`中的示例。

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|route/routeKey|String|是|需要指向的路由，若参数名与业务参数冲突可通过`config.init`配置`routeKey`改变参数名称|
|method/methodKey|String|否|路由对应的请求方法，GET/POST/PUT/DELETE等，不填写则同步为http的请求方法，填写则覆盖http的请求方法。若参数名与业务参数冲突可通过`config.init`配置`methodKey`改变参数名称|

#### 示例
> GET https://${spaceId}.service.tcloudbase.com/${path}?route=api/values&a=1&b=2

```javascript
const explain = require("explain");

module.exports = class values extends explain.service {
	
	async getValuesAsync(params) {
		return params; // params为{a: "1", b: "2"}
	}
	
}
```

> PUT https://${spaceId}.service.tcloudbase.com/${path}?route=api/values/5

```javascript
// 以uni.request为例

uni.request({
	method: 'PUT',
	url: 'https://${spaceId}.service.tcloudbase.com/${path}?route=api/values/5',
	data: {
		params: {
			a: 1,
			b: 2
		}
	}
})

// 或

uni.request({
	method: 'PUT',
	url: 'https://${spaceId}.service.tcloudbase.com/${path}',
	data: {
		route: 'api/values/5',
		method: 'PUT', // 此处method可改变http请求方法，例如uni.request为POST方法，此处为DELETE方法，则请求到的路由为DELETE对应路由。该参数可用于兼容不支持PUT、DELETE、PATCH等方法的浏览器。
		params: {
			a: 1,
			b: 2
		}
	}
})
```
```javascript
const explain = require("explain");

module.exports = class values extends explain.service {
	
	async putValueAsync(params) {
		return params; // params为{id: "5", a: 1, b: 2}
	}
	
}
```

## 使用过滤器
执行顺序为注册过滤器时的顺序，先注册的先执行，后注册的后执行。
### onActionExecuting
方法执行时触发。

### 示例：实现用户身份验证
#### 云函数入口
```javascript
// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, config => {
		
		config.init({baseDir: __dirname});
		
		config.filter.add([{
			filter: require("./filters/tokenFilter"), // 添加用户身份验证过滤器
			ignore: [{ // 过滤器忽略所指定的service和它的action
				service: "home",
				actions: ["index"] // 不写actions则表示忽略该service中的所有action
			}]
		}]);
	
	});
}
```
#### 过滤器代码
```javascript
// application -> filters -> tokenFilter.js

// 需要继承抽象父类explain.filter

const explain = require("explain");

module.exports = class tokenFilter extends explain.filter {

	async onActionExecuting() {
		let {event, context} = this;

		if (!event.params.token) {
			// 使用context.response直接返回至客户端
			context.response = {
				code: 401,
				message: "缺少token"
			}
			return;
		}

		// let user = checkToken(event.params.token); // 自行封装的token验证方法
		let user = event.params.token == "Sansnn" ? {
			id: 1,
			name: "Sansnn"
		} : null;
		if (user) {
			context.user = user;
		} else {
			context.response = {
				code: 401,
				message: "token无效"
			}
		}
	}

}
```
#### 云函数
```javascript
// application -> services -> home.js

const explain = require("explain");

module.exports = class home extends explain.service {
	
	index(params) {
		return 'Hello, World!';
	}
	
	getUser(params) {
		return this.context.user;
	}
	
}
```

### onActionExecuted
方法执行后触发。

### 示例：实现请求日志记录
#### 云函数入口
```javascript
// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, config => {
		
		config.init({baseDir: __dirname});
		
		config.filter.add([{
			filter: require("./filters/requestFilter") // 添加全局请求记录过滤器
		}]);
	
	});
}
```
#### 过滤器代码
```javascript
// application -> filters -> requestFilter.js

// 需要继承抽象父类explain.filter

const explain = require("explain");

module.exports = class requestFilter extends explain.filter {
	
	async onActionExecuting() {
		let {event, context} = this;
		
		console.log("------------");
		console.log("请求开始");
		if (event.service) {
			console.log(`service: ${event.service}`);
		}
		if (event.action) {
			console.log(`action: ${event.action}`);
		}
		if (event.route) {
			console.log(`route: ${event.route}`);
		}
		if (event.method) {
			console.log(`method: ${event.method}`);
		}
		if (context.routeTemplate) {
			console.log(`routeTemplate: ${context.routeTemplate}`);
		}
		if (event.params) {
			console.log(`params: ${JSON.stringify(event.params)}`);
		}
		console.log("------------");
	}
	
	async onActionExecuted() {
		let {event, context} = this;
		
		console.log("------------");
		console.log("请求结束");
		console.log(`response: ${JSON.stringify(context.response)}`)
		console.log("------------");
	
		// context.response = {
		// 	code: 0,
		// 	message: "请求成功"
		// } // 可对context.response重新赋值来改变响应结果
	}
	
}
```

### onException
发生异常触发。

### 示例：实现全局异常处理
#### 云函数入口
```javascript
// application -> index.js

const explain = require("explain");

exports.main = async (event, context) => {
	return explain.run(event, context, config => {
		
		config.init({baseDir: __dirname});
		
		config.filter.add([{
			filter: require("./filters/exceptionFilter") // 添加全局异常过滤器
		}]);
	
	});
}
```
#### 过滤器代码
```javascript
// application -> filters -> exceptionFilter.js

// 需要继承抽象父类explain.filter

const explain = require("explain");

module.exports = class exceptionFilter extends explain.filter {
	
	async onException() {
		let {event, context} = this;
		
		context.response = {
			code: 500,
			message: context.exception.message
		} // 可对context.response重新赋值来改变响应结果
	
		// 输出日志
		console.error("------------");
		console.error("发生错误");
		if (event.service) {
			console.error(`service: ${event.service}`);
		}
		if (event.action) {
			console.error(`action: ${event.action}`);
		}
		if (event.route) {
			console.error(`route: ${event.route}`);
		}
		if (event.method) {
			console.error(`method: ${event.method}`);
		}
		if (context.routeTemplate) {
			console.error(`routeTemplate: ${context.routeTemplate}`);
		}
		if (event.params) {
			console.error(`params: ${JSON.stringify(event.params)}`);
		}
		console.error(`异常信息: ${context.exception.message}`);
		console.error("原始异常: ", context.exception);
		console.error("------------");
	
		// 发送异常信息到电子邮件
		// 
	}
	
}
```

## 配置说明
### config.init(options)
#### 初始化，baseDir是必须配置的

|参数|类型|必填|说明|
|--	|--	|--	|--	|
|baseDir|String|是|项目根目录|
|serviceDir|String|否|service目录，/开头，/结尾，默认`/services/`|
|serviceKey|String|否|service参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`service`|
|actionKey|String|否|action参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`action`|
|routeKey|String|否|route参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`route`|
|methodKey|String|否|method参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`method`|
|paramsKey|String|否|params参数别名，作用是与其他参数冲突时可以修改为别的名称，默认`params`|
|enableMatchMode|Boolen|否|启用匹配模式，默认为`true`，`false`为禁用，禁用后仅支持路由模式访问业务函数|
|matchIgnore|Array|否|为保证安全性，匹配模式可忽略所指定的service和actions，忽略后仅配置路由模式后可访问，格式为`[{service: "serviceName", actions: ["actionName1", "actionName2"]},{...}]`，不写`actions`表示忽略该service下所有action|

#### 示例
```javascript
config.init({
	baseDir: __dirname, // 项目根目录
	serviceDir: "/services/", // service目录
	serviceKey: "service", // service参数别名，默认"service"，作用是与其他参数冲突时可以修改为别的名称
	actionKey: "action", // action参数别名，默认"action"，作用是与其他参数冲突时可以修改为别的名称
	routeKey: "route", // route参数别名，默认"route"，作用是与其他参数冲突时可以修改为别的名称
	methodKey: "method", // method参数别名，默认"method"，作用是与其他参数冲突时可以修改为别的名称
	paramsKey: "params", // params参数别名，默认"params"，作用是与其他参数冲突时可以修改为别的名称
	enableMatchMode: true, // 启用匹配模式，false为禁用，禁用后仅支持路由模式访问业务函数
	matchIgnore: [ // 匹配模式忽略指定的service和actions，忽略后仅配置路由模式后可访问
		{
			service: "goods",
			actions: ["getListAsync"]
		}
	]
});
```

## 基类说明
### service
服务基类，继承后构造函数会自动注入`event`，`context`，`explain`几个对象，可通过`this.event`，`this.context`，`this.explain`进行调用，每个对象的作用如下。
#### event
为客户端上传的参数，主要内容如下：

|参数|类型|说明|
|--	|--	|--	|
|service/serviceKey|String|调用的服务的名称，参数名会受config配置的`serviceKey`所改变|
|action/actionKey|String|调用的方法的名称，参数名会受config配置的`actionKey`所改变|
|route/routeKey|String|调用的路由，参数名会受config配置的`routeKey`所改变|
|method/methodKey|String|路由对应请求方法，GET/POST/PUT/DELETE等，参数名会受config配置的`methodKey`所改变|
|params/paramsKey|Object|来自客户端的参数集，已整合URL化参数，参数名会受config配置的`paramsKey`所改变|

#### context
可获取每次调用的上下文，主要内容如下：

|参数|类型|说明|
|--	|--	|--	|
|service|Object|本次请求所使用的service，未实例化|
|isHttp|Boolen|`true`表示是云函数URL化HTTP请求，`false`表示不是|
|httpMethod|String|`isHttp`为`true`时，当前请求的HTTP方法|
|routeTemplate|String|`isHttp`为`true`时，当前请求的路由模板|
|response|Object|本次请求所返回的数据|

#### explain
框架扩展，主要内容如下：

|参数|类型|说明|
|--	|--	|--	|
|config|Object|初始化时注入的配置|
|mode|String|获取本次请求为`match`匹配模式还是`route`路由模式|
|routes|Array|已配置的路由集合|
|filters|Array|已配置的过滤器集合|
|useService|Function|在服务中使用其他service，若被使用的service是继承自explain.service，则会自动注入`event`，`context`，`explain`，详情见下|

##### explain.useService(obj)
|参数|类型|必填|说明|
|--	|--	|--	|--	|
|obj|Function|是|引入的service对象，需未被实例化|

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
const { dateTime } = require("explain");

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
const { object } = require("explain");

var obj = {
	b: 1,
	c: 2,
	a: 3
}
obj = object.sort(obj); // 结果为{a:3,b:1,c:2}
```

## 扩展模块
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

## 解决方案
|名称|说明|链接|
|--	|--	|--	|
|unicloud云函数TS开发最优解决方案|感谢 `老沈-1018715564@qq.com` 提供|[https://www.yinzhuoei.com/index.php/archives/470](https://www.yinzhuoei.com/index.php/archives/470)|

### 更多模块正在开发中，敬请期待...