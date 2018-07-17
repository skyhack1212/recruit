# doctor-strange

### 项目名称由来

doctor strange意为「奇异博士」,是美国漫威影业创作的动漫人物，奇异博士利用超自然的能力和神奇来保护着世界，代表着正义和力量。该系统作为知乎广告系统核心平台之一，负责合同、订单、排期、财务等核心业务逻辑的管理，在广告系统中发挥着强大的作用，更能像奇异博士 一样，保护整个广告系统的稳定运行。

### 项目历史介绍

* 本项目现为新老平台共存状态,老项目git地址: https://git.in.zhihu.com/efe/crm , 新项目git地址:https://git.in.zhihu.com/efe/doctor-strange
* 由于多个原因,老项目内容会逐步迁移到新项目上,目前新项目已经完成 '财务管理'模块。

### 项目地址

开发地址: http://adop.dev.zhihu.com/crm-v2/

线上地址: http://adop.in.zhihu.com/crm-v2/

### 起步

**克隆**

```bash
git clone git@git.in.zhihu.com:efe/doctor-strange.git
cd doctor-strange
```

**安装依赖**

```bash
$ yarn
```

**开启项目**

> 成功之后会自动打开浏览器 http://127.0.0.1:8000/

```bash
$ yarn start
```

### 路由

> 具体配置可以看 /src/common/nav.js

URL                               |  route组件                  | 描述 
:-------------------------------- |----------------------------|-----------------
` /crm-v2/invoice`                      | `/routes/invoice/index` |发票首页
` /crm-v2/invoice/todo`               | `/routes/invoice/todo` |待开发票列表[媒介]
` /crm-v2/invoice/applied`                  | `/routes/invoice/applied` |已申请发票列表[媒介]
` /crm-v2/invoice/complete` | `/routes/invoice/complete` |已完成发票列表[媒介&财务] *媒介和财务看到的列表字段会有不同*
` /crm-v2/invoice/review` | `/routes/invoice/review` |待确认开票列表[财务]
` /crm-v2/invoice/create` | `/routes/invoice/create` |新建发票[媒介]
`  /crm-v2/invoice/:invoiceId/modify` | `/routes/invoice/modify` |编辑发票[媒介]
`  /crm-v2/invoice/:invoiceId/detail` | `/routes/invoice/detail` |发票详情[媒介&财务]
`  /crm-v2/invoice/:invoiceId/confirm` | `/routes/invoice/confirm` |确认开票[财务]

### 公用业务组件

> /src/components 目录下的组件

name                             | Components                 | 描述
---------------------------------|----------------------------|------------
`Upload` | `/Common/Upload` | 基于antd封装,主要封装业务需求(预览、文件下载),并处理后端数据格式与antd的格式不一致问题 
`UploadView` | `/Common/UploadView` | `Upload`组件的预览组件 
`Input` | `/Common/Input` | 基于antd封装,主要增加一层 formater,预处理用户输入的value 
`InvoiceForm` | `/Invoice/InvoiceForm ` | 发票的新建和编辑页面均会用到此组件,由于文件不能超过400行,拆为了`InvoiceFormBase(基本信息)`   `InvoiceFormInvoiceInfo(发票信息)`  `InvoiceFormQualification(资质证明)` 模块 
`InvoiceFormQualificationView` | `/Invoice/InvoiceFormQualificationView ` | 同`InvoiceFormInvoiceInfo(发票信息)`,但是只能预览(确认开票、发票详情页面会用到) 
`ListSearchForm` | `/Invoice/ListSearchForm` | 发票列表的搜索组件,根据不同的状态显示不同的fields 
`ListTable` | `/Invoice/ListTable` | 发票列表的表格 
`OrderSelector` | `/Invoice/OrderSelector` | 发票列表的订单选择组件 
`OrderPreview` | `/Invoice/OrderPreview` | 发票列表的订单预览组件 
`Layout布局组件` | `/Layout/` | 基于antd和zhihu-layouts的项目布局组件 
`Users组件` | `/Users/` | 用户头像、登录、注销等相关组件 



### 杂项&约定

* 公用工具方法请按模块放在 `/src/utils`  文件夹下
* 公用常量请按模块放在 `/src/constants`  文件夹下

### 本地开发

dva默认运行在 http://127.0.0.1:8000/,  如果是本地开发,mock数据写在 `/mock`文件夹下,如果期望访问后端dev环境的api, 请做如下代理:

>  以下方式采用一种即可

**方式1:**

* 先将 adop.dev.zhihu.com/api/*  代理到 adop.dev.zhihu.com/api/
* 然后 adop.dev.zhihu.com/*   代理到 localhost:8000/
* 打开浏览器  访问 http://adop.dev.zhihu.com/ , 此时文件访问的本地文件,接口访问后端dev环境的接口

**方式2：**

* 在`/.roadhogrc`配置proxy

### 部署测试环境 （只能手动部署前台, 以下两种方法采用一种即可）

1. 先设置环境变量 `SHIPIT_USER` 再部署
    ```sh
    export SHIPIT_USER=yourname
    yarn deploy
    ```

2. 直接部署并指定要 SSH 的用户名

    ```sh
    yarn deploy -u "userName"
    ```
    然后访问: http://adop.dev.zhihu.com/crm-v2/ 就好啦~
