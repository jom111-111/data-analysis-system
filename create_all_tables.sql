-- 电商分析系统 - 完整数据库创建脚本
-- 包含所有系统所需的数据库表和索引

-- 1. 用户管理表
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    status TEXT DEFAULT '活跃',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 聊天历史表
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT,
    message TEXT,
    response TEXT,
    html_content TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 3. 注册验证码表
CREATE TABLE IF NOT EXISTS register_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 密码重置验证码表
CREATE TABLE IF NOT EXISTS password_reset_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 用户密码元数据表
CREATE TABLE IF NOT EXISTS user_password_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    password_length INTEGER NOT NULL,
    has_uppercase INTEGER NOT NULL,
    has_lowercase INTEGER NOT NULL,
    has_number INTEGER NOT NULL,
    has_special INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 6. 密码修改历史表
CREATE TABLE IF NOT EXISTS password_change_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    is_suspicious INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- 7. 验证码管理表
CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    is_used INTEGER DEFAULT 0,
    used_at TEXT
);

-- 验证码表索引
CREATE INDEX IF NOT EXISTS idx_verification_username ON verification_codes (username);
CREATE INDEX IF NOT EXISTS idx_verification_code ON verification_codes (code);

-- 8. 用户活动日志表
CREATE TABLE IF NOT EXISTS user_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    timestamp TEXT NOT NULL,
    details TEXT
);

-- 用户活动日志表索引
CREATE INDEX IF NOT EXISTS idx_activity_username ON user_activity_log (username);
CREATE INDEX IF NOT EXISTS idx_activity_type ON user_activity_log (activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON user_activity_log (timestamp);

-- 9. 系统异常表
CREATE TABLE IF NOT EXISTS system_anomalies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT '未处理',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. 用户异常表
CREATE TABLE IF NOT EXISTS user_anomalies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    activity TEXT NOT NULL,
    reason TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT '未处理',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. 通知管理表
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL,
    target TEXT NOT NULL,
    methods TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted INTEGER DEFAULT 0
);

-- 12. 通知接收者表
CREATE TABLE IF NOT EXISTS notification_recipients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    read_at TIMESTAMP,
    is_sent INTEGER DEFAULT 0,
    sent_at TIMESTAMP,
    FOREIGN KEY (notification_id) REFERENCES notifications (id)
);

-- 13. 注销用户表
CREATE TABLE IF NOT EXISTS deactivated_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT,
    deactivation_date TEXT NOT NULL,
    reason TEXT,
    data_backup TEXT
);

-- 14. 系统设置表
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加设置表需要的键值对记录
INSERT OR IGNORE INTO settings (key, value, description) VALUES 
('system_name', '数据分析系统', '系统名称'),
('system_description', '', '系统描述'),
('admin_email', '', '管理员邮箱'),
('login_attempts', '5', '最大登录尝试次数'),
('min_password_length', '8', '最小密码长度'),
('session_timeout', '30', '会话超时时间（分钟）'),
('require_uppercase', '1', '是否要求密码包含大写字母'),
('require_numbers', '1', '是否要求密码包含数字'),
('require_special', '1', '是否要求密码包含特殊字符'),
('log_level', 'INFO', '日志级别'),
('log_retention', '30', '日志保留天数'),
('log_size_limit', '100', '日志文件大小限制（MB）'),
('default_theme', 'light', '默认主题'),
('animation', 'on', '是否启用动画'),
('show_avatar', 'on', '是否显示头像'),
('typewriter_effect', 'on', '是否启用打字机效果'),
('typewriter_speed', 'medium', '打字机效果速度'),
('default_font', 'system', '默认字体'),
('bubble_style', 'square', '气泡样式');

-- 15. 多文件/单文件分析记录表
CREATE TABLE IF NOT EXISTS analysis_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    file_count INTEGER NOT NULL,
    analysis_mode TEXT NOT NULL,
    processing_time REAL NOT NULL,
    file_names TEXT,
    status TEXT DEFAULT 'success',
    response_time REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. AI分析记录表
CREATE TABLE IF NOT EXISTS ai_analysis_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    response_time REAL NOT NULL,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. 销售趋势分析记录表
CREATE TABLE IF NOT EXISTS sales_trend_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    file_name TEXT NOT NULL,
    analysis_type TEXT NOT NULL,
    processing_time REAL DEFAULT 0,
    status TEXT DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. 登录历史记录表
CREATE TABLE IF NOT EXISTS login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    ip_address TEXT,
    status TEXT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin INTEGER DEFAULT 0,
    user_agent TEXT,
    location TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_analysis_username ON analysis_records (username);
CREATE INDEX IF NOT EXISTS idx_analysis_created_at ON analysis_records (created_at);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_username ON ai_analysis_records (username);
CREATE INDEX IF NOT EXISTS idx_ai_analysis_created_at ON ai_analysis_records (created_at);
CREATE INDEX IF NOT EXISTS idx_sales_trend_username ON sales_trend_records (username);
CREATE INDEX IF NOT EXISTS idx_sales_trend_created_at ON sales_trend_records (created_at);
CREATE INDEX IF NOT EXISTS idx_login_history_username ON login_history (username);
CREATE INDEX IF NOT EXISTS idx_login_history_time ON login_history (login_time);

-- -- 19. 数据侦探模式 - 侦探进度表
-- CREATE TABLE IF NOT EXISTS detective_progress (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     level INTEGER DEFAULT 1,
--     points INTEGER DEFAULT 0,
--     badges TEXT DEFAULT '[]',
--     last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- -- 15. 数据侦探模式 - 已完成案例表
-- CREATE TABLE IF NOT EXISTS detective_completed_cases (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     case_id INTEGER NOT NULL,
--     score REAL NOT NULL,
--     time_taken REAL NOT NULL,
--     completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     solution TEXT NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- -- 16. 数据侦探模式 - 排行榜表
-- CREATE TABLE IF NOT EXISTS detective_leaderboard (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     username TEXT NOT NULL,
--     level INTEGER NOT NULL,
--     points INTEGER NOT NULL,
--     badges_count INTEGER NOT NULL,
--     last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id)
-- );

-- 创建默认管理员用户
INSERT OR IGNORE INTO users (username, email, password, is_admin)
VALUES ('admin', 'admin@example.com', '$2b$12$N.6i1YA5b3V0gxkI2OJ2tOQc66wZdFm3fO2UEeA4QyJlkY2fQKF8q', 1);

-- 注：密码哈希值对应的明文密码为 'admin123'，生产环境请修改此密码

-- 创建说明：
-- 1. 可通过SQLite命令行执行此脚本：sqlite3 users.db < create_all_tables.sql
-- 2. 也可在Python中执行：
--    import sqlite3
--    conn = sqlite3.connect('users.db')
--    with open('create_all_tables.sql', 'r') as f:
--        conn.executescript(f.read())
--    conn.close() 