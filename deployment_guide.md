# 电商分析系统部署指南

本文档详细说明如何将电商分析系统部署到第三方平台的虚拟机中。

## 一、系统要求

### 1.1 硬件要求
- CPU: 2核心以上
- 内存: 至少4GB RAM（推荐8GB以上）
- 存储: 至少50GB可用空间
- 网络: 稳定的网络连接，建议有公网IP

### 1.2 软件要求
- 操作系统: Ubuntu 20.04 LTS或CentOS 8（推荐Ubuntu）
- Python: 3.8或以上
- SQLite: 3.30或以上
- Web服务器: Nginx 1.18或以上
- WSGI服务器: Gunicorn 20.0或以上

## 二、准备工作

### 2.1 获取代码和文件
确保您有以下文件：
1. 应用代码（app.py、ai_analysis.py、sales_trend.py、data_detective.py等）
2. 静态文件（static目录）
3. 模板文件（templates目录）
4. 数据库创建脚本（create_all_tables.sql）
5. 依赖清单（requirements.txt）

### 2.2 准备虚拟机
1. 登录到虚拟机供应商的控制面板
2. 创建新的虚拟机实例（选择Ubuntu 20.04 LTS）
3. 设置防火墙规则，开放以下端口：
   - 22端口（SSH）
   - 80端口（HTTP）
   - 443端口（HTTPS）
4. 获取并保存虚拟机的IP地址和访问凭证

## 三、系统安装

### 3.1 连接到虚拟机
```bash
ssh username@your_vm_ip
```

### 3.2 更新系统
```bash
sudo apt update
sudo apt upgrade -y
```

### 3.3 安装必要的系统依赖
```bash
sudo apt install -y python3 python3-pip python3-venv sqlite3 nginx git
```

### 3.4 创建项目目录
```bash
mkdir -p ~/ecommerce_analysis
cd ~/ecommerce_analysis
```

### 3.5 设置Python虚拟环境
```bash
python3 -m venv venv
source venv/bin/activate
```

## 四、代码部署

### 4.1 上传代码
您有两种方式上传代码：

#### 方式一：使用Git（如果您的代码在Git仓库中）
```bash
git clone https://your-repository-url.git .
```

#### 方式二：使用SCP从本地上传（如果代码在本地机器上）
在本地终端执行：
```bash
cd /path/to/your/local/project
scp -r * username@your_vm_ip:~/ecommerce_analysis/
```

### 4.2 创建必要的目录
```bash
mkdir -p uploads
mkdir -p flask_session
mkdir -p logs
mkdir -p reports
mkdir -p temp
```

### 4.3 设置权限
```bash
chmod -R 755 .
chmod -R 777 uploads
chmod -R 777 flask_session
chmod -R 777 logs
chmod -R 777 reports
chmod -R 777 temp
```

## 五、安装依赖

### 5.1 安装Python依赖
确保您已激活虚拟环境，然后：
```bash
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

### 5.2 检查requirements.txt内容
确保requirements.txt包含以下依赖（如果没有，请手动添加）：
```
flask>=2.0.0
pandas>=1.3.0
numpy>=1.20.0
plotly>=5.0.0
werkzeug>=2.0.0
email-validator>=1.1.0
flask-session>=0.4.0
yagmail>=0.15.0
requests>=2.25.0
```

## 六、数据库创建与初始化

### 6.1 创建数据库
```bash
cd ~/ecommerce_analysis
sqlite3 users.db < create_all_tables.sql
```

### 6.2 检查数据库是否创建成功
```bash
sqlite3 users.db
```

在SQLite提示符下：
```sql
.tables  -- 列出所有表
.schema users  -- 检查users表结构
SELECT * FROM users;  -- 查看用户（应该有一个默认管理员用户）
.exit  -- 退出SQLite
```

### 6.3 初始化其他必要的数据库表
```bash
cd ~/ecommerce_analysis
source venv/bin/activate
python3 -c "from app import init_db; init_db()"
```

## 七、配置Web服务器

### 7.1 创建Gunicorn服务文件
```bash
sudo nano /etc/systemd/system/ecommerce_analysis.service
```

粘贴以下内容（替换username为您的用户名）：
```
[Unit]
Description=Gunicorn instance to serve ecommerce analysis application
After=network.target

[Service]
User=username
Group=www-data
WorkingDirectory=/home/username/ecommerce_analysis
Environment="PATH=/home/username/ecommerce_analysis/venv/bin"
ExecStart=/home/username/ecommerce_analysis/venv/bin/gunicorn --workers 3 --bind unix:ecommerce_analysis.sock -m 007 app:app

[Install]
WantedBy=multi-user.target
```

### 7.2 启用并启动Gunicorn服务
```bash
sudo systemctl start ecommerce_analysis
sudo systemctl enable ecommerce_analysis
sudo systemctl status ecommerce_analysis  # 检查服务状态
```

### 7.3 配置Nginx
```bash
sudo nano /etc/nginx/sites-available/ecommerce_analysis
```

粘贴以下内容（替换your_vm_ip为您的虚拟机IP地址或域名）：
```
server {
    listen 80;
    server_name your_vm_ip;

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/username/ecommerce_analysis/ecommerce_analysis.sock;
        proxy_connect_timeout 300s;
        proxy_read_timeout 300s;
        client_max_body_size 50M;
    }

    location /static {
        alias /home/username/ecommerce_analysis/static;
    }

    location /uploads {
        alias /home/username/ecommerce_analysis/uploads;
    }
}
```

### 7.4 启用Nginx配置并重启
```bash
sudo ln -s /etc/nginx/sites-available/ecommerce_analysis /etc/nginx/sites-enabled
sudo nginx -t  # 检查配置是否有误
sudo systemctl restart nginx
```

## 八、安全设置

### 8.1 更新默认管理员密码
访问您的应用（http://your_vm_ip），使用默认管理员账号登录：
- 用户名：admin
- 密码：admin123

登录后立即修改管理员密码。

### 8.2 配置防火墙
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status  # 检查防火墙状态
```

### 8.3 设置自动安全更新
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 九、测试系统

### 9.1 访问应用
在浏览器中访问：http://your_vm_ip

### 9.2 测试功能
1. 登录管理员账号
2. 测试用户注册
3. 测试数据上传和分析
4. 测试报告生成
5. 测试通知系统

## 十、维护与监控

### 10.1 设置日志轮转
```bash
sudo nano /etc/logrotate.d/ecommerce_analysis
```

粘贴以下内容：
```
/home/username/ecommerce_analysis/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 username www-data
}
```

### 10.2 创建备份脚本
```bash
nano ~/backup_system.sh
```

粘贴以下内容：
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/home/username/backups"
mkdir -p $BACKUP_DIR

# 备份数据库
sqlite3 /home/username/ecommerce_analysis/users.db ".backup '$BACKUP_DIR/users_$TIMESTAMP.db'"

# 备份上传的文件
tar -czf $BACKUP_DIR/uploads_$TIMESTAMP.tar.gz -C /home/username/ecommerce_analysis uploads

# 保留最近7天的备份
find $BACKUP_DIR -name "users_*.db" -type f -mtime +7 -delete
find $BACKUP_DIR -name "uploads_*.tar.gz" -type f -mtime +7 -delete
```

设置执行权限并添加到crontab：
```bash
chmod +x ~/backup_system.sh
crontab -e
```

添加以下行（每天凌晨2点执行备份）：
```
0 2 * * * /home/username/backup_system.sh > /dev/null 2>&1
```

### 10.3 监控系统状态
```bash
sudo apt install -y htop
```

使用htop命令监控系统资源使用情况：
```bash
htop
```

## 十一、故障排查

### 11.1 检查应用日志
```bash
tail -f ~/ecommerce_analysis/app.log
```

### 11.2 检查Nginx日志
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 11.3 检查Gunicorn服务状态
```bash
sudo systemctl status ecommerce_analysis
```

### 11.4 重启服务
如果应用出现问题，可以尝试重启服务：
```bash
sudo systemctl restart ecommerce_analysis
sudo systemctl restart nginx
```

## 十二、系统更新

### 12.1 更新应用代码
如果使用Git：
```bash
cd ~/ecommerce_analysis
git pull
```

如果手动上传：
在本地终端执行：
```bash
scp -r updated_files/* username@your_vm_ip:~/ecommerce_analysis/
```

### 12.2 更新数据库结构
如果有新的数据库结构更改：
```bash
cd ~/ecommerce_analysis
sqlite3 users.db < update_database.sql
```

### 12.3 重启服务
```bash
sudo systemctl restart ecommerce_analysis
```

## 十三、联系与支持

如有任何问题或需要支持，请联系系统开发团队：
- 电子邮件：support@example.com
- 电话：+86 123 4567 8910 