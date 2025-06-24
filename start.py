#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
数据分析系统 - 快速启动脚本
双击即可启动系统，自动打开浏览器
"""

import os
import sys
import sqlite3
import threading
import time
import webbrowser
from pathlib import Path

def init_database():
    """初始化数据库"""
    current_dir = Path(__file__).parent
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
    time.sleep(3)  # 等待服务器启动
    webbrowser.open('http://127.0.0.1:5000')
    print("🔄 浏览器已打开")

def main():
    """主函数"""
    print("=" * 50)
    print("🚀 数据分析系统 - 启动中...")
    print("=" * 50)
    
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
        print("=" * 50)
        
        # 禁用Flask的调试模式和重载
        app.run(
            host='127.0.0.1', 
            port=5000, 
            debug=False, 
            use_reloader=False,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n👋 系统已关闭")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        input("按回车键退出...")

if __name__ == "__main__":
    main() 