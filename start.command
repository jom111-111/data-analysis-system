#!/bin/bash

# 获取脚本所在目录的绝对路径
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 切换到项目目录
cd "$DIR"

# 检查是否已经存在虚拟环境
if [ ! -d "venv" ]; then
    echo "正在创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "正在激活虚拟环境..."
source venv/bin/activate

# 安装所需的包
echo "正在安装必要的包..."
pip install -r requirements.txt

# 运行程序
echo "正在启动数据分析系统..."

# 等待2秒后在后台打开浏览器
(sleep 2 && open http://127.0.0.1:5001/login) &

# 启动Flask应用
python app.py

# 退出虚拟环境
deactivate

# 如果程序异常退出，等待用户按键再关闭窗口
read -p "按任意键退出..." 