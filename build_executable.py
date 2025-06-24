#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据分析系统 - 可执行文件构建脚本
使用 PyInstaller 将 Flask 应用打包成可执行文件
"""

import os
import sys
import shutil
import subprocess
from pathlib import Path

def build_executable():
    """构建可执行文件"""
    print("🚀 开始构建数据分析系统可执行文件...")
    
    # 检查是否安装了 PyInstaller
    try:
        import PyInstaller
        print("✅ PyInstaller 已安装")
    except ImportError:
        print("❌ PyInstaller 未安装，正在安装...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
        print("✅ PyInstaller 安装完成")
    
    # 当前目录
    current_dir = Path.cwd()
    
    # 创建构建目录
    build_dir = current_dir / "build_temp"
    if build_dir.exists():
        shutil.rmtree(build_dir)
    build_dir.mkdir(exist_ok=True)
    
    # 复制必要文件到构建目录
    print("📁 复制必要文件...")
    files_to_copy = [
        "app.py",
        "ai_analysis.py", 
        "sales_trend.py",
        "requirements.txt",
        "create_all_tables.sql"
    ]
    
    dirs_to_copy = [
        "templates",
        "static"
    ]
    
    # 复制文件
    for file in files_to_copy:
        if (current_dir / file).exists():
            shutil.copy2(current_dir / file, build_dir / file)
            print(f"  ✅ 复制文件: {file}")
    
    # 复制目录
    for dir_name in dirs_to_copy:
        src_dir = current_dir / dir_name
        if src_dir.exists():
            shutil.copytree(src_dir, build_dir / dir_name)
            print(f"  ✅ 复制目录: {dir_name}")
    
    # 创建启动脚本
    startup_script = build_dir / "startup.py"
    with open(startup_script, 'w', encoding='utf-8') as f:
        f.write('''#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据分析系统 - 启动脚本
"""
import os
import sys
import sqlite3
import threading
import time
import webbrowser
from pathlib import Path

# 添加当前目录到Python路径
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

def init_database():
    """初始化数据库"""
    db_path = current_dir / "users.db"
    sql_path = current_dir / "create_all_tables.sql"
    
    if sql_path.exists():
        try:
            with open(sql_path, 'r', encoding='utf-8') as f:
                sql_script = f.read()
            
            conn = sqlite3.connect(str(db_path))
            conn.executescript(sql_script)
            conn.close()
            print("✅ 数据库初始化完成")
        except Exception as e:
            print(f"⚠️ 数据库初始化失败: {e}")
    else:
        print("⚠️ 未找到数据库脚本文件")

def open_browser():
    """延迟打开浏览器"""
    time.sleep(2)  # 等待服务器启动
    webbrowser.open('http://127.0.0.1:5000')

def main():
    """主函数"""
    print("🚀 启动数据分析系统...")
    
    # 初始化数据库
    init_database()
    
    # 在后台线程中打开浏览器
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # 启动Flask应用
    try:
        from app import app
        print("🌐 服务器启动成功！")
        print("📍 访问地址: http://127.0.0.1:5000")
        print("🔄 浏览器将自动打开...")
        print("❌ 按 Ctrl+C 退出系统")
        app.run(host='127.0.0.1', port=5000, debug=False)
    except KeyboardInterrupt:
        print("\\n👋 系统已关闭")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        input("按回车键退出...")

if __name__ == "__main__":
    main()
''')
    
    print("📝 创建启动脚本完成")
    
    # 切换到构建目录
    os.chdir(build_dir)
    
    # 构建PyInstaller命令
    pyinstaller_cmd = [
        "pyinstaller",
        "--onefile",  # 打包成单个文件
        "--windowed",  # 无控制台窗口（可选）
        "--name=数据分析系统",
        "--icon=../static/icon.icns" if (current_dir / "static" / "icon.icns").exists() else "",
        "--add-data=templates;templates",
        "--add-data=static;static", 
        "--add-data=create_all_tables.sql;.",
        "--hidden-import=sqlite3",
        "--hidden-import=flask",
        "--hidden-import=werkzeug",
        "--hidden-import=jinja2",
        "--hidden-import=pandas",
        "--hidden-import=numpy",
        "--hidden-import=plotly",
        "startup.py"
    ]
    
    # 移除空的图标参数
    pyinstaller_cmd = [arg for arg in pyinstaller_cmd if arg]
    
    print("🔨 开始构建可执行文件...")
    print(f"📋 构建命令: {' '.join(pyinstaller_cmd)}")
    
    try:
        result = subprocess.run(pyinstaller_cmd, check=True, capture_output=True, text=True)
        print("✅ 构建成功！")
        
        # 复制生成的可执行文件到主目录
        dist_dir = build_dir / "dist"
        if dist_dir.exists():
            for file in dist_dir.iterdir():
                if file.is_file():
                    dest_file = current_dir / file.name
                    shutil.copy2(file, dest_file)
                    print(f"📦 可执行文件已生成: {dest_file}")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ 构建失败: {e}")
        print(f"错误输出: {e.stderr}")
        return False
    
    # 清理构建目录
    os.chdir(current_dir)
    if build_dir.exists():
        shutil.rmtree(build_dir)
        print("🧹 清理构建文件完成")
    
    print("🎉 构建完成！双击可执行文件即可启动系统")
    return True

if __name__ == "__main__":
    build_executable() 