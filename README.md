# QNMaker
A simple questionnaire website based on MongoDB, Express, Vue, Node

---

说明：本项目未部署到服务器，测试时请按照以下步骤配置：

### 数据库

- 创建mongodb数据库db
- 添加数据库管理员（自行设置需要更改qnserver\db\config.js代码）
  - 账号：qnmanager
  - 密码：cm123456
- 连接配置
  - 主机：localhost
  - 端口：27017

### qnserver

- cmd进入qnserver目录下运行`npm install`
- 运行`nodemo ./bin/www`启动
- 监听3000端口

### qnclient

- cmd进入qnclient目录下运行`npm install`
- 运行`npm run dev`启动
- 监听8080端口

- 浏览器输入localhost:8080访问首页