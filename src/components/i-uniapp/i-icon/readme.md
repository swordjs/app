#i-icon图标集-最优质且统一风格的图标库，源于remixicon

- [访问remixicon官网](https://remixicon.com/)
- [特点](## 特点)
- [使用说明](## 使用说明)

## 特点
- remixicon提倡全部开源，免费商用。
- 每一个图标都由remixicon成员绘制，设计统一。
- i-icon组件隶属于i-uniapp组件库，i-icon组件单独维护。
- CDN引入，无需引入繁琐的字体等文件。
- 支持NVue, Vue, 小程序，H5

## 使用说明
安装之后会在components目录下多一个i-uniapp的文件夹，文件夹结构如下:

```
-i-icon
 -js
  -- icon.js
 - i-icon.vue
 - readme.md
```

为了保证icon引入方便，我们可以利用easycom来自动引入: 
page.json:

```json
"easycom": {
	"autoscan": true,
	"custom": {
	    "^i-icon": "@/components/i-icon/i-icon.vue"
	}
},
```

组件提供如下props参数:

| props | 类型 | 说明 |
| :-----| ----: | :----: |
| name | String | 图标名 |
| color | String | 颜色填充/red/#fff |
| size | String | 大小：px/rpx/upx |

示例:

```html
<i-icon size="16px" color="#0067F5" name="lock-line"></i-icon>
```

图标类名请在[remixicon中搜索](https://remixicon.com/)

提示: 不要在name中写入图标库的前缀ri，组件中已经处理好前缀，不用担心类名冲突的问题