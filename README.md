# recruit

### 项目介绍
脉脉招聘企业版

### 运行项目

- **克隆**

```bash
git clone https://github.com/aiqinhaian/recruit.git
cd recruit
```

- **安装依赖并启动项目**

```bash
npm install yarn -g
yarn
yarn start
```

- **访问项目**

浏览器访问 http://127.0.0.1:8000/

### 路由

URL                               |  route组件                  | 描述 
:-------------------------------- |----------------------------|-----------------
` /talents`                      | `src/routes/talents/index.js` |搜索人才首页
` /resumes`               | `src/routes/resumes/index.js` |筛选简历首页

### 公用业务组件

> /src/components 目录下的组件

name                             | Components                 | 描述
---------------------------------|----------------------------|------------
`TalentBasicInfo` | `/Common/TalentBasicInfo.js` | 人才卡片中，人才基本信息显示
`TalentCard` | `Common/TalentCard.js` | 人才卡片
`Chatting` | `Common/Chatting.js` | 联系人才/回复申请公用对话组件

### 配置代理
项目默认使用本地 mock 数据，mock 数据位于 mock 目录下
如果接口需要配置代理，修改文件 「.roadhogrc」中的 proxy 项，具体可参考：http://npm.taobao.org/package/roadhog

配置案例：
```javascript
"proxy": {
  "/api": {
    "target": "http://fred41:8106/",
    "changeOrigin": true,
    "pathRewrite": { "^/api" : "" }
  }
}
```
