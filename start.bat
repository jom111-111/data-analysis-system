@echo off
chcp 65001 >nul
title 数据分析系统

echo ===================================================
echo 🚀 数据分析系统 - 启动中...
echo ===================================================

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到Python，请先安装Python 3.7+
    echo 📥 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

REM 检查依赖是否安装
echo 🔍 检查依赖...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo 📦 正在安装依赖...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ 依赖安装失败，请手动运行：pip install -r requirements.txt
        pause
        exit /b 1
    )
)

echo ✅ 环境检查完成
echo 🚀 启动系统...

REM 启动Python应用
python start.py

pause 