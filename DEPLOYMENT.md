# 🌐 部署指南

本文档将指导你如何将智能数据分析系统部署到各种云平台。

## 📋 部署前准备

### 1. 环境要求
- Python 3.11+
- 所需依赖包（见 `requirements.txt`）

### 2. 环境变量配置
在部署前需要设置以下环境变量：

```bash
SECRET_KEY=your_secret_key_here  # Flask应用密钥
PORT=5000                        # 端口号（可选）
OPENAI_API_KEY=your_openai_key   # OpenAI API密钥（AI功能需要）
```

## 🚀 推荐部署方案

### 1. Railway（推荐）⭐

**优势：**
- ✅ 免费额度：每月$5免费使用
- ✅ 支持Python Flask
- ✅ 从GitHub自动部署
- ✅ 内置数据库支持
- ✅ 部署简单快速

**部署步骤：**

1. 访问 [Railway.app](https://railway.app)
2. 使用GitHub账号登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择你的 `data-analysis-system` 仓库
5. Railway会自动检测到 `railway.toml` 配置文件
6. 设置环境变量：
   - `SECRET_KEY`: 生成一个随机字符串
   - `OPENAI_API_KEY`: 你的OpenAI API密钥（可选）
7. 点击部署，等待完成

### 2. Render（免费选项）🆓

**优势：**
- ✅ 完全免费（有使用限制）
- ✅ 支持Python Flask
- ✅ GitHub集成
- ✅ 自动SSL证书
- ❌ 免费版有休眠机制

**部署步骤：**

1. 访问 [Render.com](https://render.com)
2. 使用GitHub账号登录
3. 点击 "New" → "Web Service"
4. 连接你的GitHub仓库
5. 配置设置：
   - **Name**: data-analysis-system
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
6. 添加环境变量
7. 点击部署

### 3. Heroku（付费）💰

**优势：**
- ✅ 成熟稳定的平台
- ✅ 丰富的插件生态
- ✅ 专业的数据库支持
- ❌ 需要付费（$5-7/月起）

**部署步骤：**

1. 安装 [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. 登录Heroku：`heroku login`
3. 在项目目录运行：
   ```bash
   heroku create your-app-name
   heroku config:set SECRET_KEY=your_secret_key
   heroku config:set OPENAI_API_KEY=your_openai_key
   git push heroku main
   ```

## 🔧 部署后配置

### 1. 初始化管理员账户
首次部署后，访问网站并注册第一个账户，该账户将自动获得管理员权限。

### 2. 配置邮件服务（可选）
如果需要邮件功能，请在代码中更新邮件配置：
- QQ邮箱SMTP配置
- 授权码设置

### 3. 数据库迁移
系统使用SQLite数据库，会自动创建所需的表结构。

## 📊 性能优化建议

### 1. 数据库优化
- 定期清理临时文件
- 优化查询语句
- 考虑使用PostgreSQL（生产环境）

### 2. 文件存储
- 配置文件上传限制
- 定期清理上传文件
- 考虑使用云存储服务

### 3. 缓存策略
- 启用Flask缓存
- 使用Redis缓存（可选）

## 🔒 安全配置

### 1. 环境变量
确保所有敏感信息都通过环境变量配置，不要硬编码到代码中。

### 2. HTTPS
大部分云平台都会自动配置HTTPS，确保启用。

### 3. 访问控制
- 设置强密码策略
- 启用登录限制
- 定期备份数据

## 🐛 常见问题

### 1. 部署失败
- 检查 `requirements.txt` 是否包含所有依赖
- 确认Python版本兼容性
- 查看部署日志

### 2. 数据库错误
- 确保数据库文件权限正确
- 检查表结构是否正确创建

### 3. 文件上传问题
- 检查上传目录权限
- 确认文件大小限制
- 验证文件类型过滤

## 📞 技术支持

如果在部署过程中遇到问题，可以：
1. 查看项目的GitHub Issues
2. 检查部署平台的日志
3. 参考各平台的官方文档

---

**祝你部署成功！🎉** 