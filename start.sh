#!/bin/bash

# 设置UTF-8编码
export LANG=zh_CN.UTF-8

echo "=================================================="
echo "🚀 数据分析系统 - 启动中..."
echo "=================================================="

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ 错误：未找到Python，请先安装Python 3.7+"
        echo "📥 macOS安装：brew install python3"
        echo "📥 Ubuntu安装：sudo apt install python3 python3-pip"
        read -p "按回车键退出..."
        exit 1
    else
        PYTHON_CMD=python
    fi
else
    PYTHON_CMD=python3
fi

echo "✅ 找到Python: $($PYTHON_CMD --version)"

# 检查pip
if ! command -v pip3 &> /dev/null; then
    if ! command -v pip &> /dev/null; then
        echo "❌ 错误：未找到pip"
        read -p "按回车键退出..."
        exit 1
    else
        PIP_CMD=pip
    fi
else
    PIP_CMD=pip3
fi

# 检查依赖是否安装
echo "🔍 检查依赖..."
$PYTHON_CMD -c "import flask" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 正在安装依赖..."
    $PIP_CMD install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请手动运行：$PIP_CMD install -r requirements.txt"
        read -p "按回车键退出..."
        exit 1
    fi
fi

echo "✅ 环境检查完成"
echo "🚀 启动系统..."

# 启动Python应用
$PYTHON_CMD start.py 