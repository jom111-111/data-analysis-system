/**
 * 登录后动画效果 - 数据流光效应
 * 在用户登录后显示的动画，展示数据分析的核心概念 - 数据流动与转化
 */

class LoginAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.charts = [];
        this.animationFrameId = null;
        this.animationStartTime = null;
        this.animationDuration = 10000; // 延长到10秒
        this.colors = {
            light: {
                primary: '#0071e3',
                secondary: '#28a745',
                tertiary: '#dc3545',
                background: 'rgba(245, 245, 247, 0.9)',
                accent1: '#ff9f0a', // 橙色
                accent2: '#5e5ce6', // 紫色
                accent3: '#bf5af2',  // 洋红色
                accent4: '#30d158',  // 绿色
                accent5: '#64d2ff'   // 天蓝色
            },
            dark: {
                primary: '#2997ff',
                secondary: '#39e75f',
                tertiary: '#ff375f',
                background: 'rgba(0, 0, 0, 0.9)',
                accent1: '#ff9f0a', // 橙色
                accent2: '#5e5ce6', // 紫色
                accent3: '#bf5af2',  // 洋红色
                accent4: '#32d74b',  // 绿色
                accent5: '#64d2ff'   // 天蓝色
            }
        };
        // 更新图表类型，添加新的分析模式图表
        this.finalCharts = [];
        this.username = '';
        this.backgroundParticles = []; // 背景粒子
        this.dataStreams = []; // 数据流
        this.dataConnections = []; // 数据连接线
        this.isHighPerformance = true; // 性能监测标志
        this.glowEffects = true; // 发光效果
        this.haloRadius = 80; // 光晕半径
        this.skipButton = null; // 跳过按钮元素
        this.resizeHandler = null; // 窗口大小变化处理函数
        // 修改动画阶段
        this.animationPhases = {
            initial: { start: 0, end: 0.2 },
            expansion: { start: 0.2, end: 0.5 },
            charts: { start: 0.5, end: 0.9 },
            fadeOut: { start: 0.9, end: 1 }
        };
        // 数据故事线阶段，修改为反映新的分析模式
        this.storyStages = [
            { text: "正在加载数据...", time: 0.1 },
            { text: "启动多文件分析模块...", time: 0.25 },
            { text: "准备AI智能分析引擎...", time: 0.4 },
            { text: "构建销售趋势模型...", time: 0.55 },
            { text: "激活数据侦探模式...", time: 0.7 },
            { text: "所有分析系统就绪!", time: 0.85 }
        ];
        // 问候语
        this.greeting = this.getTimeBasedGreeting();
        // 3D效果参数
        this.depth = {
            enabled: true,
            factor: 5,
            shadowDepth: 10
        };
    }

    // 初始化动画
    init(username = '用户') {
        this.username = username;
        
        // 检测设备性能
        this.detectPerformance();
        
        // 获取当前主题
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        this.theme = isDarkMode ? 'dark' : 'light';
        
        // 创建canvas元素
        this.canvas = document.createElement('canvas');
        
        // 初始化画布尺寸和属性
        this.setupCanvas();
        
        // 添加到body
        document.body.appendChild(this.canvas);
        
        // 创建跳过按钮
        this.createSkipButton();
        
        // 更新图表位置
        this.updateChartsPositions();
        
        // 生成各种粒子
        this.generateCenterParticles();
        this.generateBackgroundParticles();
        this.generateDataStreams();
        this.generateDataConnections();
        
        // 添加窗口大小变化事件监听
        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
        
        // 开始动画
        this.animationStartTime = performance.now();
        this.animate();
        
        // 10秒后自动移除
        setTimeout(() => this.remove(), this.animationDuration);
    }
    
    // 设置画布尺寸和属性
    setupCanvas() {
        // 获取设备像素比以支持高DPI屏幕
        const dpr = window.devicePixelRatio || 1;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // 设置canvas的实际尺寸（物理像素）- 提高2倍提升清晰度
        this.canvas.width = this.width * Math.min(dpr, 2.5);
        this.canvas.height = this.height * Math.min(dpr, 2.5);
        
        // 设置canvas的显示尺寸（CSS像素）
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        
        this.canvas.id = 'login-animation-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.pointerEvents = 'none';
        
        // 设置背景颜色并添加轻微模糊效果
        this.canvas.style.backgroundColor = this.colors[this.theme].background;
        this.canvas.style.backdropFilter = 'blur(5px)'; // 减少模糊度从10px到5px
        this.canvas.style.webkitBackdropFilter = 'blur(5px)';
        
        // 获取绘图上下文
        this.ctx = this.canvas.getContext('2d', { 
            alpha: true, 
            antialias: true,
            desynchronized: true, // 提高性能
            willReadFrequently: false // 优化性能
        });
        
        // 根据设备像素比缩放上下文以匹配显示尺寸
        this.ctx.scale(Math.min(dpr, 2.5), Math.min(dpr, 2.5));
        
        // 启用抗锯齿和平滑处理
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        // 增强线条清晰度
        this.ctx.lineJoin = 'round';
        this.ctx.lineCap = 'round';
    }
    
    // 处理窗口大小变化事件
    handleResize() {
        // 清除之前的粒子和连接
        this.particles = [];
        this.backgroundParticles = [];
        this.dataStreams = [];
        this.dataConnections = [];
        
        // 重新设置画布尺寸
        this.setupCanvas();
        
        // 更新图表位置
        this.updateChartsPositions();
        
        // 重新生成粒子和连接
        this.generateCenterParticles();
        this.generateBackgroundParticles();
        this.generateDataStreams();
        this.generateDataConnections();
    }
    
    // 更新图表位置
    updateChartsPositions() {
        this.finalCharts = [
            { type: 'multiFile', x: this.width * 0.25, y: this.height * 0.35 }, // 多文件分析
            { type: 'singleFile', x: this.width * 0.75, y: this.height * 0.35 }, // 单文件分析
            { type: 'aiAnalysis', x: this.width * 0.25, y: this.height * 0.65 }, // AI智能分析
            { type: 'salesTrend', x: this.width * 0.60, y: this.height * 0.65 }, // 销售趋势分析
            { type: 'dataDetective', x: this.width * 0.75, y: this.height * 0.5 }  // 数据侦探模式
        ];
    }
    
    // 创建跳过按钮
    createSkipButton() {
        // 创建按钮元素
        this.skipButton = document.createElement('button');
        this.skipButton.innerText = '跳过';
        this.skipButton.id = 'login-animation-skip-button';
        
        // 设置按钮样式
        this.skipButton.style.position = 'fixed';
        this.skipButton.style.top = '20px';
        this.skipButton.style.right = '20px';
        this.skipButton.style.padding = '8px 16px';
        this.skipButton.style.backgroundColor = this.theme === 'dark' ? 'rgba(60, 60, 67, 0.8)' : 'rgba(240, 240, 245, 0.8)';
        this.skipButton.style.color = this.theme === 'dark' ? '#ffffff' : '#1d1d1f';
        this.skipButton.style.border = 'none';
        this.skipButton.style.borderRadius = '20px';
        this.skipButton.style.fontSize = '14px';
        this.skipButton.style.fontWeight = 'bold';
        this.skipButton.style.cursor = 'pointer';
        this.skipButton.style.zIndex = '10000'; // 确保在canvas上方
        this.skipButton.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        this.skipButton.style.transition = 'all 0.2s ease';
        this.skipButton.style.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif';
        
        // 添加悬停效果
        this.skipButton.onmouseover = () => {
            this.skipButton.style.backgroundColor = this.theme === 'dark' ? 'rgba(80, 80, 87, 0.9)' : 'rgba(220, 220, 225, 0.9)';
            this.skipButton.style.transform = 'translateY(-2px)';
        };
        
        this.skipButton.onmouseout = () => {
            this.skipButton.style.backgroundColor = this.theme === 'dark' ? 'rgba(60, 60, 67, 0.8)' : 'rgba(240, 240, 245, 0.8)';
            this.skipButton.style.transform = 'translateY(0)';
        };
        
        // 添加点击事件
        this.skipButton.onclick = () => {
            this.remove(); // 点击按钮时立即移除动画
        };
        
        // 添加到body
        document.body.appendChild(this.skipButton);
    }

    // 检测设备性能
    detectPerformance() {
        // 简单性能检测 - 可根据设备类型或帧率判断
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isOldDevice = !window.requestAnimationFrame || !window.performance;
        
        if (isMobile || isOldDevice || window.innerWidth < 768) {
            this.isHighPerformance = false;
            this.glowEffects = false;
        }
        
        // 根据性能调整粒子数量和效果
        if (!this.isHighPerformance) {
            this.haloRadius = 60;
            this.finalCharts = [
                { type: 'bar', x: this.width * 0.4, y: this.height * 0.5 },
                { type: 'pie', x: this.width * 0.6, y: this.height * 0.5 }
            ];
        }
    }

    // 生成中心粒子
    generateCenterParticles() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // 创建中心圆形
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 50;
            this.particles.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                radius: Math.random() * 3 + 1,
                color: this.getRandomColor(),
                speed: Math.random() * 2 + 1,
                angle: angle,
                targetX: centerX + Math.cos(angle) * 300,
                targetY: centerY + Math.sin(angle) * 300,
                alpha: 1,
                type: 'center'
            });
        }
    }

    // 获取随机颜色，增加透明度参数
    getRandomColor(alpha = 1) {
        const colors = [
            this.colors[this.theme].primary,
            this.colors[this.theme].secondary,
            this.colors[this.theme].tertiary
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 如果是完全不透明的颜色，直接返回
        if (alpha >= 1) {
            return color;
        }
        
        // 将16进制颜色转换为rgba
        let r, g, b;
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            const rgbValues = color.match(/\d+/g);
            r = parseInt(rgbValues[0]);
            g = parseInt(rgbValues[1]);
            b = parseInt(rgbValues[2]);
        } else {
            // 默认颜色
            r = 0; g = 113; b = 227;
        }
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 绘制柱状图，增加立体感和发光效果
    drawBarChart(x, y, progress) {
        const width = 100 * progress; // 增加图表宽度从90到100
        const height = 80 * progress; // 增加图表高度从70到80
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`; // 增加字体粗细和大小
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)'; // 增加不透明度
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('销售趋势', 0, -height/2 - 12);
        }
        
        // 画柱状图的柱子
        const barCount = 5;
        const barWidth = width / (barCount * 2);
        const barSpacing = barWidth * 0.4;
        const barColors = ['#4c75e6', '#5a8cf5', '#5aa5f5', '#5abbf5', '#5ad1f5'];
        
        for (let i = 0; i < barCount; i++) {
            const barHeight = (Math.sin(i * 0.8) + 1.5) * height / 2.5;
            const barX = i * (barWidth + barSpacing) - width/2 + barWidth/2;
            
            // 绘制阴影
            if (this.glowEffects) {
                this.ctx.shadowColor = barColors[i];
                this.ctx.shadowBlur = 12 * progress; // 增加阴影模糊半径
                this.ctx.shadowOffsetY = 2 * progress; // 添加轻微阴影偏移
            }
            
            // 绘制3D效果的柱子
            const gradient = this.ctx.createLinearGradient(barX - barWidth/2, 0, barX + barWidth/2, 0);
            gradient.addColorStop(0, barColors[i]);
            gradient.addColorStop(1, this.lightenColor(barColors[i], 20));
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = progress;
            
            // 主柱子 - 使用完整路径绘制以提高清晰度
            this.ctx.beginPath();
            const radius = 4 * progress;
            const barTop = 0 - barHeight;
            const barLeft = barX - barWidth/2;
            const barRight = barX + barWidth/2;
            const barBottom = 0;
            
            // 绘制圆角矩形，手动指定每个角的弧度
            this.ctx.moveTo(barLeft + radius, barTop);
            this.ctx.lineTo(barRight - radius, barTop);
            this.ctx.arcTo(barRight, barTop, barRight, barTop + radius, radius);
            this.ctx.lineTo(barRight, barBottom);
            this.ctx.lineTo(barLeft, barBottom);
            this.ctx.lineTo(barLeft, barTop + radius);
            this.ctx.arcTo(barLeft, barTop, barLeft + radius, barTop, radius);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 顶部高光 - 增强对比度
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // 增加透明度从0.3到0.4
            this.ctx.beginPath();
            this.ctx.moveTo(barLeft + radius, barTop);
            this.ctx.lineTo(barRight - radius, barTop);
            this.ctx.arcTo(barRight, barTop, barRight, barTop + radius, radius);
            this.ctx.lineTo(barRight, barTop + 5 * progress);
            this.ctx.lineTo(barLeft, barTop + 5 * progress);
            this.ctx.lineTo(barLeft, barTop + radius);
            this.ctx.arcTo(barLeft, barTop, barLeft + radius, barTop, radius);
            this.ctx.closePath();
            this.ctx.fill();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetY = 0;
            
            // 添加数值标签
            if (progress > 0.85) {
                const labelProgress = (progress - 0.85) / 0.15;
                const value = Math.floor((barHeight / height) * 100);
                this.ctx.textAlign = 'center';
                this.ctx.font = `bold ${11 * labelProgress}px -apple-system, sans-serif`; // 增加字体粗细和大小
                this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'; // 使用完全不透明的颜色
                this.ctx.globalAlpha = labelProgress;
                this.ctx.fillText(`${value}`, barX, -barHeight - 6); // 增加偏移以提高可读性
            }
        }
        
        this.ctx.restore();
    }

    // 绘制折线图，增加平滑曲线和阴影
    drawLineChart(x, y, progress) {
        const width = 100 * progress; // 增加宽度从90到100
        const height = 60 * progress; // 增加高度从50到60
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('数据趋势', 0, -height/2 - 12);
        }
        
        // 绘制坐标轴 - 增加线宽和对比度
        if (progress > 0.4) {
            const axisProgress = Math.min((progress - 0.4) / 0.3, 1);
            this.ctx.beginPath();
            this.ctx.moveTo(-width/2, height/2);
            this.ctx.lineTo(-width/2 + width * axisProgress, height/2);
            this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.lineWidth = 1.5; // 增加线宽
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(-width/2, height/2);
            this.ctx.lineTo(-width/2, height/2 - height * axisProgress);
            this.ctx.stroke();
        }
        
        // 创建数据点
        const points = [];
        const pointCount = 8;
        
        for (let i = 0; i < pointCount; i++) {
            const pointX = -width/2 + (width * i / (pointCount - 1));
            // 使用更自然的曲线
            const angle = i / (pointCount - 1) * Math.PI * 1.5;
            const pointY = Math.sin(angle) * height / 2.5;
            points.push({ x: pointX, y: pointY });
        }
        
        // 绘制区域填充 - 增强渐变效果
        if (progress > 0.5) {
            const fillProgress = Math.min((progress - 0.5) / 0.5, 1);
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, height/2);
            this.ctx.lineTo(points[0].x, points[0].y);
            
            // 绘制贝塞尔曲线，增加点数以提高精度
            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i+1].x) / 2;
                const yc = (points[i].y + points[i+1].y) / 2;
                const endX = Math.min(points[i+1].x, points[0].x + (points[pointCount-1].x - points[0].x) * fillProgress);
                
                this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                
                if (endX < points[i+1].x) {
                    const t = (endX - points[i].x) / (points[i+1].x - points[i].x);
                    const endY = (1-t) * points[i].y + t * points[i+1].y;
                    this.ctx.lineTo(endX, endY);
                    break;
                }
            }
            
            if (fillProgress >= 1) {
                this.ctx.lineTo(points[pointCount-1].x, height/2);
            } else {
                this.ctx.lineTo(points[0].x + (points[pointCount-1].x - points[0].x) * fillProgress, height/2);
            }
            
            // 增强渐变对比度
            const gradient = this.ctx.createLinearGradient(0, -height/2, 0, height/2);
            gradient.addColorStop(0, `${this.colors[this.theme].primary}BB`); // 增加不透明度从99到BB
            gradient.addColorStop(1, `${this.colors[this.theme].primary}22`); // 增加不透明度从11到22
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = progress * 0.8; // 增加全局不透明度
            this.ctx.fill();
        }
        
        // 绘制线条 - 增加线宽和发光效果
        if (progress > 0.5) {
            const lineProgress = Math.min((progress - 0.5) / 0.5, 1);
            
            // 设置阴影效果
            if (this.glowEffects) {
                this.ctx.shadowColor = this.colors[this.theme].primary;
                this.ctx.shadowBlur = 10 * progress; // 增加模糊半径
            }
            
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i+1].x) / 2;
                const yc = (points[i].y + points[i+1].y) / 2;
                const endX = Math.min(points[i+1].x, points[0].x + (points[pointCount-1].x - points[0].x) * lineProgress);
                
                if (endX < points[i+1].x) {
                    const t = (endX - points[i].x) / (points[i+1].x - points[i].x);
                    const endY = (1-t) * points[i].y + t * points[i+1].y;
                    this.ctx.quadraticCurveTo(points[i].x, points[i].y, endX, endY);
                    break;
                }
                
                this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            
            this.ctx.strokeStyle = this.colors[this.theme].primary;
            this.ctx.lineWidth = 3 * progress; // 增加线宽从2.5到3
            this.ctx.globalAlpha = progress;
            this.ctx.stroke();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
        }
        
        // 绘制数据点 - 增加点的大小和发光效果
        if (progress > 0.6) {
            const pointsProgress = Math.min((progress - 0.6) / 0.4, 1);
            
            for (let i = 0; i < points.length; i++) {
                // 只绘制填充区域内的点
                if (points[i].x <= points[0].x + (points[pointCount-1].x - points[0].x) * pointsProgress) {
                    // 设置阴影效果
                    if (this.glowEffects) {
                        this.ctx.shadowColor = this.colors[this.theme].primary;
                        this.ctx.shadowBlur = 8 * progress;
                    }
                    
                    // 外圆
                    this.ctx.beginPath();
                    this.ctx.arc(points[i].x, points[i].y, 5 * progress, 0, Math.PI * 2); // 增加半径从4到5
                    this.ctx.fillStyle = 'white';
                    this.ctx.globalAlpha = progress;
                    this.ctx.fill();
                    
                    // 内圆
                    this.ctx.beginPath();
                    this.ctx.arc(points[i].x, points[i].y, 3 * progress, 0, Math.PI * 2); // 增加半径从2.5到3
                    this.ctx.fillStyle = this.colors[this.theme].primary;
                    this.ctx.fill();
                    
                    // 重置阴影
                    this.ctx.shadowBlur = 0;
                }
            }
        }
        
        this.ctx.restore();
    }

    // 绘制饼图，增加3D效果和动画过渡
    drawPieChart(x, y, progress) {
        const radius = 40 * progress; // 增加半径从35到40
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('市场份额', 0, -radius - 12);
        }
        
        // 饼图数据（百分比）
        const segments = [0.35, 0.25, 0.2, 0.15, 0.05];
        const colors = ['#4c75e6', '#5bbf54', '#f0c139', '#e35d62', '#8e44ad'];
        const labels = ['产品A', '产品B', '产品C', '产品D', '其他'];
        let startAngle = -Math.PI / 2; // 从顶部开始
        
        // 先绘制一个背景圆
        if (progress < 0.2) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(50, 50, 55, 0.9)' : 'rgba(240, 240, 245, 0.9)';
            this.ctx.globalAlpha = progress * 5;
            this.ctx.fill();
        }
        
        // 3D效果的底部阴影（增强3D效果）
        if (progress > 0.2) {
            this.ctx.beginPath();
            this.ctx.arc(0, 3, radius * 0.95, 0, Math.PI * 2);
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(20, 20, 25, 0.5)' : 'rgba(0, 0, 0, 0.1)';
            this.ctx.globalAlpha = 0.5 * progress;
            this.ctx.fill();
        }
        
        // 绘制饼图的扇区
        for (let i = 0; i < segments.length; i++) {
            const segmentProgress = Math.min(progress * 5, 1); // 快速显示整个饼图
            const segmentAngle = segments[i] * Math.PI * 2 * segmentProgress;
            const endAngle = startAngle + segmentAngle;
            
            // 设置阴影效果
            if (this.glowEffects && progress > 0.8) {
                this.ctx.shadowColor = colors[i];
                this.ctx.shadowBlur = 12 * (progress - 0.8) / 0.2; // 增加模糊半径
                this.ctx.shadowOffsetY = 2; // 添加轻微阴影偏移
            }
            
            // 绘制3D效果的扇区
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, startAngle, endAngle, false);
            this.ctx.closePath();
            
            // 创建扇区渐变
            const midAngle = startAngle + segmentAngle / 2;
            const gradient = this.ctx.createRadialGradient(
                Math.cos(midAngle) * radius * 0.3, 
                Math.sin(midAngle) * radius * 0.3, 
                0,
                Math.cos(midAngle) * radius * 0.3, 
                Math.sin(midAngle) * radius * 0.3, 
                radius
            );
            gradient.addColorStop(0, this.lightenColor(colors[i], 20)); // 增加亮度
            gradient.addColorStop(1, colors[i]);
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = progress;
            this.ctx.fill();
            
            // 添加高光效果
            if (progress > 0.8) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.arc(0, 0, radius * 0.85, startAngle, endAngle, false);
                this.ctx.closePath();
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // 增加不透明度
                this.ctx.fill();
            }
            
            // 绘制标签线和文本 - 增强文本清晰度
            if (progress > 0.85 && segments[i] > 0.1) {
                const labelProgress = (progress - 0.85) / 0.15;
                const midAngle = startAngle + segmentAngle / 2;
                const labelRadius = radius * 1.2;
                const labelX = Math.cos(midAngle) * labelRadius;
                const labelY = Math.sin(midAngle) * labelRadius;
                const textRadius = radius * 1.4;
                const textX = Math.cos(midAngle) * textRadius;
                const textY = Math.sin(midAngle) * textRadius;
                
                // 标签线
                this.ctx.beginPath();
                this.ctx.moveTo(Math.cos(midAngle) * radius * 0.9, Math.sin(midAngle) * radius * 0.9);
                this.ctx.lineTo(labelX, labelY);
                this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
                this.ctx.lineWidth = 1.5 * labelProgress; // 增加线宽
                this.ctx.globalAlpha = labelProgress;
                this.ctx.stroke();
                
                // 标签圆点
                this.ctx.beginPath();
                this.ctx.arc(labelX, labelY, 3 * labelProgress, 0, Math.PI * 2); // 增加圆点大小
                this.ctx.fillStyle = colors[i];
                this.ctx.fill();
                
                // 标签文本
                this.ctx.textAlign = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5 ? 'right' : 'left';
                this.ctx.textBaseline = 'middle';
                this.ctx.font = `bold ${12 * labelProgress}px -apple-system, sans-serif`; // 增加字体粗细和大小
                this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
                this.ctx.fillText(`${labels[i]} ${Math.round(segments[i] * 100)}%`, textX, textY);
            }
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetY = 0;
            
            startAngle = endAngle;
        }
        
        // 中心圆孔效果
        if (progress > 0.3) {
            const innerProgress = Math.min((progress - 0.3) / 0.4, 1);
            this.ctx.beginPath();
            this.ctx.arc(0, 0, radius * 0.4 * innerProgress, 0, Math.PI * 2);
            
            // 创建中心渐变
            const centerGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.4);
            if (this.theme === 'dark') {
                centerGradient.addColorStop(0, 'rgba(30, 30, 35, 1)');
                centerGradient.addColorStop(1, 'rgba(50, 50, 60, 1)');
            } else {
                centerGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
                centerGradient.addColorStop(1, 'rgba(240, 240, 245, 1)');
            }
            
            this.ctx.fillStyle = centerGradient;
            this.ctx.globalAlpha = innerProgress;
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }

    // 颜色处理辅助方法
    lightenColor(color, percent) {
        let r, g, b;
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            const rgbValues = color.match(/\d+/g);
            r = parseInt(rgbValues[0]);
            g = parseInt(rgbValues[1]);
            b = parseInt(rgbValues[2]);
        } else {
            return color;
        }
        
        r = Math.min(255, Math.floor(r * (100 + percent) / 100));
        g = Math.min(255, Math.floor(g * (100 + percent) / 100));
        b = Math.min(255, Math.floor(b * (100 + percent) / 100));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // 添加变暗颜色方法
    darkenColor(color, percent) {
        let r, g, b;
        if (color.startsWith('#')) {
            const hex = color.substring(1);
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (color.startsWith('rgb')) {
            const rgbValues = color.match(/\d+/g);
            r = parseInt(rgbValues[0]);
            g = parseInt(rgbValues[1]);
            b = parseInt(rgbValues[2]);
        } else {
            return color;
        }
        
        r = Math.max(0, Math.floor(r * (100 - percent) / 100));
        g = Math.max(0, Math.floor(g * (100 - percent) / 100));
        b = Math.max(0, Math.floor(b * (100 - percent) / 100));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // 创建高质量线性渐变
    createSmoothLinearGradient(ctx, x1, y1, x2, y2, colorStops, alpha = 1) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        
        // 使用更多的中间色，创建更平滑的渐变过渡
        colorStops.forEach((stop, index) => {
            gradient.addColorStop(stop.position, stop.color);
            
            // 在相邻色之间添加过渡色
            if (index < colorStops.length - 1) {
                const nextStop = colorStops[index + 1];
                const midPosition = (stop.position + nextStop.position) / 2;
                
                // 解析颜色
                let r1, g1, b1, r2, g2, b2;
                
                // 解析第一个色
                if (stop.color.startsWith('#')) {
                    const hex = stop.color.substring(1);
                    r1 = parseInt(hex.substring(0, 2), 16);
                    g1 = parseInt(hex.substring(2, 4), 16);
                    b1 = parseInt(hex.substring(4, 6), 16);
                } else if (stop.color.startsWith('rgb')) {
                    const rgbValues = stop.color.match(/\d+/g);
                    r1 = parseInt(rgbValues[0]);
                    g1 = parseInt(rgbValues[1]);
                    b1 = parseInt(rgbValues[2]);
                }
                
                // 解析第二个色
                if (nextStop.color.startsWith('#')) {
                    const hex = nextStop.color.substring(1);
                    r2 = parseInt(hex.substring(0, 2), 16);
                    g2 = parseInt(hex.substring(2, 4), 16);
                    b2 = parseInt(hex.substring(4, 6), 16);
                } else if (nextStop.color.startsWith('rgb')) {
                    const rgbValues = nextStop.color.match(/\d+/g);
                    r2 = parseInt(rgbValues[0]);
                    g2 = parseInt(rgbValues[1]);
                    b2 = parseInt(rgbValues[2]);
                }
                
                // 中间色
                const r = Math.floor((r1 + r2) / 2);
                const g = Math.floor((g1 + g2) / 2);
                const b = Math.floor((b1 + b2) / 2);
                
                gradient.addColorStop(midPosition, `rgba(${r}, ${g}, ${b}, ${alpha})`);
            }
        });
        
        return gradient;
    }
    
    // 高质量圆角矩形绘制
    drawRoundedRect(ctx, x, y, width, height, radius, fill = true, stroke = false) {
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            radius = {
                tl: radius[0] || 0,
                tr: radius[1] || 0,
                br: radius[2] || 0,
                bl: radius[3] || 0
            };
        }
        
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        
        if (fill) {
            ctx.fill();
        }
        
        if (stroke) {
            ctx.stroke();
        }
    }
    
    // 高质量文本渲染
    drawEnhancedText(ctx, text, x, y, options = {}) {
        const {
            font = '14px -apple-system, sans-serif',
            color = 'white',
            align = 'center',
            baseline = 'middle',
            alpha = 1,
            shadow = false,
            shadowColor = 'rgba(0, 0, 0, 0.5)',
            shadowBlur = 4,
            shadowOffsetX = 0,
            shadowOffsetY = 1,
            maxWidth = undefined,
            stroke = false,
            strokeColor = 'black',
            strokeWidth = 1
        } = options;
        
        ctx.save();
        
        // 设置文本样式
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.globalAlpha = alpha;
        
        // 添加阴影
        if (shadow) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
        }
        
        // 绘制外描边
        if (stroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.strokeText(text, x, y, maxWidth);
        }
        
        // 绘制文本
        ctx.fillText(text, x, y, maxWidth);
        
        ctx.restore();
    }

    // 动画循环
    animate() {
        const now = performance.now();
        const elapsed = now - this.animationStartTime;
        const progress = Math.min(elapsed / this.animationDuration, 1);
        
        // 清除画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 根据动画阶段决定行为
        if (progress < this.animationPhases.initial.end) {
            // 第一阶段：中心粒子聚集
            const phaseProgress = (progress - this.animationPhases.initial.start) / 
                                 (this.animationPhases.initial.end - this.animationPhases.initial.start);
            this.drawInitialPhase(phaseProgress);
        } else if (progress < this.animationPhases.expansion.end) {
            // 第二阶段：粒子向外扩散，形成数据流
            const phaseProgress = (progress - this.animationPhases.expansion.start) / 
                                 (this.animationPhases.expansion.end - this.animationPhases.expansion.start);
            this.drawExpansionPhase(phaseProgress);
        } else if (progress < this.animationPhases.charts.end) {
            // 第三阶段：形成图表和显示欢迎文字
            const phaseProgress = (progress - this.animationPhases.charts.start) / 
                                 (this.animationPhases.charts.end - this.animationPhases.charts.start);
            this.drawChartPhase(phaseProgress);
        } else {
            // 第四阶段：淡出
            const phaseProgress = (progress - this.animationPhases.fadeOut.start) / 
                                 (this.animationPhases.fadeOut.end - this.animationPhases.fadeOut.start);
            this.drawFadeOutPhase(phaseProgress);
        }
        
        // 如果动画未结束，继续下一帧
        if (progress < 1) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }

    // 初始阶段：中心粒子聚集
    drawInitialPhase(progress) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // 绘制背景粒子
        this.drawBackgroundParticles(progress * 0.5);
        
        // 绘制中心光晕
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.haloRadius * progress, 0, Math.PI * 2);
        
        // 创建径向渐变
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, this.haloRadius * progress
        );
        gradient.addColorStop(0, this.getRandomColor(0.4));
        gradient.addColorStop(0.5, this.getRandomColor(0.2));
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // 绘制中心粒子
        for (const particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha * progress;
            
            // 添加发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 5 * progress;
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // 开始显示欢迎文字
        if (progress > 0.7) {
            const textProgress = (progress - 0.7) / 0.3;
            this.drawWelcomeText(textProgress * 0.5);
        }
    }

    // 扩散阶段：粒子向外扩散
    drawExpansionPhase(progress) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // 绘制背景粒子
        this.drawBackgroundParticles(0.5 + progress * 0.5);
        
        // 绘制数据流
        this.drawDataStreams(progress);
        
        // 更新粒子位置，向目标移动
        for (const particle of this.particles) {
            // 计算当前位置
            const moveProgress = Math.min(progress * 1.5, 1);
            particle.x = centerX + (particle.targetX - centerX) * moveProgress;
            particle.y = centerY + (particle.targetY - centerY) * moveProgress;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha * (1 - progress * 0.5);
            
            // 添加发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = particle.color;
                this.ctx.shadowBlur = 5 * (1 - progress * 0.5);
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // 绘制粒子尾迹
            if (moveProgress < 0.8) {
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.strokeStyle = particle.color;
                this.ctx.globalAlpha = 0.2 * (1 - moveProgress);
                this.ctx.lineWidth = 0.8;
                this.ctx.stroke();
            }
        }
        
        // 绘制欢迎文字
        const textProgress = Math.min(progress * 2, 1);
        this.drawWelcomeText(0.5 + textProgress * 0.5);
        
        // 开始绘制图表轮廓
        if (progress > 0.7) {
            const chartProgress = (progress - 0.7) / 0.3 * 0.2;
            
            for (const chart of this.finalCharts) {
                if (chart.type === 'bar') {
                    this.drawBarChart(chart.x, chart.y, chartProgress);
                } else if (chart.type === 'line') {
                    this.drawLineChart(chart.x, chart.y, chartProgress);
                } else if (chart.type === 'pie') {
                    this.drawPieChart(chart.x, chart.y, chartProgress);
                }
            }
        }
    }

    // 图表阶段：形成图表
    drawChartPhase(progress) {
        // 绘制背景粒子
        this.drawBackgroundParticles(1);
        
        // 绘制欢迎文字，完全显示
        this.drawWelcomeText(1);
        
        // 绘制数据连接线
        this.drawDataConnections(progress);
        
        // 绘制图表，逐步形成
        for (const chart of this.finalCharts) {
            if (chart.type === 'bar') {
                this.drawBarChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'line') {
                this.drawLineChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'pie') {
                this.drawPieChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'gauge') {
                this.drawGaugeChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'heatmap') {
                this.drawHeatmapChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'multiFile') {
                this.drawMultiFileChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'singleFile') {
                this.drawSingleFileChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'aiAnalysis') {
                this.drawAiAnalysisChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'salesTrend') {
                this.drawSalesTrendChart(chart.x, chart.y, 0.2 + progress * 0.8);
            } else if (chart.type === 'dataDetective') {
                this.drawDataDetectiveChart(chart.x, chart.y, 0.2 + progress * 0.8);
            }
        }
        
        // 绘制数据故事线
        this.drawDataStoryline(progress);
        
        // 绘制淡化的数据流
        this.drawDataStreams(1 - progress * 0.5);
        
        // 绘制淡出的粒子
        for (const particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha * (1 - progress);
            this.ctx.fill();
        }
    }

    // 淡出阶段：整体动画淡出
    drawFadeOutPhase(progress) {
        // 设置画布透明度
        this.canvas.style.opacity = 1 - progress;
        
        // 绘制背景粒子
        this.drawBackgroundParticles(1);
        
        // 绘制欢迎文字，完全显示
        this.drawWelcomeText(1);
        
        // 绘制数据连接线
        this.drawDataConnections(1);
        
        // 绘制数据故事线
        this.drawDataStoryline(1);
        
        // 绘制完整图表
        for (const chart of this.finalCharts) {
            if (chart.type === 'bar') {
                this.drawBarChart(chart.x, chart.y, 1);
            } else if (chart.type === 'line') {
                this.drawLineChart(chart.x, chart.y, 1);
            } else if (chart.type === 'pie') {
                this.drawPieChart(chart.x, chart.y, 1);
            } else if (chart.type === 'gauge') {
                this.drawGaugeChart(chart.x, chart.y, 1);
            } else if (chart.type === 'heatmap') {
                this.drawHeatmapChart(chart.x, chart.y, 1);
            } else if (chart.type === 'multiFile') {
                this.drawMultiFileChart(chart.x, chart.y, 1);
            } else if (chart.type === 'singleFile') {
                this.drawSingleFileChart(chart.x, chart.y, 1);
            } else if (chart.type === 'aiAnalysis') {
                this.drawAiAnalysisChart(chart.x, chart.y, 1);
            } else if (chart.type === 'salesTrend') {
                this.drawSalesTrendChart(chart.x, chart.y, 1);
            } else if (chart.type === 'dataDetective') {
                this.drawDataDetectiveChart(chart.x, chart.y, 1);
            }
        }
    }

    // 绘制欢迎文字，增加动画和装饰效果
    drawWelcomeText(progress) {
        const centerX = this.width / 2;
        const centerY = this.height * 0.3;
        
        this.ctx.save();
        
        // 添加3D效果
        if (this.depth.enabled) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = 15 * progress;
            this.ctx.shadowOffsetX = this.depth.factor;
            this.ctx.shadowOffsetY = this.depth.factor;
        }
        
        // 主标题 - 基于时间的问候语
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `bold ${Math.min(32, this.width / 18)}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
        
        // 文字渐变效果
        if (this.theme === 'dark') {
            const gradient = this.ctx.createLinearGradient(
                centerX - 120, centerY, 
                centerX + 120, centerY
            );
            gradient.addColorStop(0, '#5e9eff');
            gradient.addColorStop(0.5, '#f5f5f7');
            gradient.addColorStop(1, '#5e9eff');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(
                centerX - 120, centerY, 
                centerX + 120, centerY
            );
            gradient.addColorStop(0, '#0071e3');
            gradient.addColorStop(0.5, '#1d1d1f');
            gradient.addColorStop(1, '#0071e3');
            this.ctx.fillStyle = gradient;
        }
        
        this.ctx.globalAlpha = progress;
        
        // 文字出现动画
        if (progress < 0.7) {
            const scale = 0.8 + 0.2 * progress / 0.7;
            this.ctx.translate(centerX, centerY);
            this.ctx.scale(scale, scale);
            this.ctx.translate(-centerX, -centerY);
        }
        
        this.ctx.fillText(`${this.greeting}，${this.username}`, centerX, centerY);
        
        // 绘制装饰元素
        if (progress > 0.4) {
            const decorProgress = (progress - 0.4) / 0.6;
            
            // 左侧装饰线 - 添加3D效果
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - 180, centerY);
            this.ctx.lineTo(centerX - 180 + 100 * decorProgress, centerY);
            this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(94, 158, 255, 0.6)' : 'rgba(0, 113, 227, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            // 右侧装饰线
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + 180, centerY);
            this.ctx.lineTo(centerX + 180 - 100 * decorProgress, centerY);
            this.ctx.stroke();
            
            // 装饰点
            const dotRadius = 4 * decorProgress;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX - 190, centerY, dotRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.theme === 'dark' ? '#5e9eff' : '#0071e3';
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(centerX + 190, centerY, dotRadius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 副标题
        if (progress > 0.7) {
            const subProgress = (progress - 0.7) / 0.3;
            const subY = centerY + 45;
            
            this.ctx.font = `${Math.min(16, this.width / 40) * subProgress}px -apple-system, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
            this.ctx.globalAlpha = subProgress;
            this.ctx.fillText('准备开始您的数据分析之旅', centerX, subY);
        }
        
        this.ctx.restore();
    }

    // 绘制背景粒子
    drawBackgroundParticles(progress) {
        // 更新和绘制背景粒子
        for (const particle of this.backgroundParticles) {
            // 更新位置，缓慢漂浮
            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            
            // 如果粒子移出画布，将其移到另一侧
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
            
            // 缓慢改变移动角度
            particle.angle += (Math.random() - 0.5) * 0.01;
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.alpha * progress;
            this.ctx.fill();
        }
    }

    // 绘制数据流
    drawDataStreams(progress) {
        for (const stream of this.dataStreams) {
            // 更新进度
            stream.progress += stream.speed;
            if (stream.progress > 1) stream.progress = 0;
            
            // 计算当前端点位置
            const currentEndX = stream.startX + (stream.endX - stream.startX) * progress;
            const currentEndY = stream.startY + (stream.endY - stream.startY) * progress;
            
            // 绘制流线
            this.ctx.beginPath();
            this.ctx.moveTo(stream.startX, stream.startY);
            this.ctx.lineTo(currentEndX, currentEndY);
            this.ctx.strokeStyle = stream.color;
            this.ctx.lineWidth = stream.width;
            this.ctx.globalAlpha = 0.3 * progress;
            
            // 添加发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = stream.color;
                this.ctx.shadowBlur = 5 * progress;
            }
            
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            // 绘制数据流上的粒子
            for (const particle of stream.particles) {
                // 更新粒子位置
                particle.position += particle.speed;
                if (particle.position > 1) particle.position = 0;
                
                // 只在数据流显示范围内绘制粒子
                if (particle.position <= progress) {
                    const particleX = stream.startX + (currentEndX - stream.startX) * particle.position;
                    const particleY = stream.startY + (currentEndY - stream.startY) * particle.position;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(particleX, particleY, particle.radius, 0, Math.PI * 2);
                    this.ctx.fillStyle = stream.color;
                    this.ctx.globalAlpha = 0.7 * progress;
                    
                    // 添加发光效果
                    if (this.glowEffects) {
                        this.ctx.shadowColor = stream.color;
                        this.ctx.shadowBlur = 8 * progress;
                    }
                    
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                }
            }
        }
    }

    // 生成背景粒子
    generateBackgroundParticles() {
        const particleCount = this.isHighPerformance ? 50 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            this.backgroundParticles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.3 + 0.1,
                color: this.getRandomColor(0.7),
                speed: Math.random() * 0.2 + 0.1,
                angle: Math.random() * Math.PI * 2
            });
        }
    }

    // 生成数据流
    generateDataStreams() {
        const streamCount = this.isHighPerformance ? 15 : 8;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        for (let i = 0; i < streamCount; i++) {
            const angle = (i / streamCount) * Math.PI * 2;
            const length = Math.random() * 100 + 150;
            
            this.dataStreams.push({
                startX: centerX,
                startY: centerY,
                endX: centerX + Math.cos(angle) * length,
                endY: centerY + Math.sin(angle) * length,
                width: Math.random() * 1.5 + 0.5,
                progress: 0,
                speed: Math.random() * 0.01 + 0.005,
                color: this.getRandomColor(),
                particles: []
            });
            
            // 为每条数据流添加粒子
            const particleCount = Math.floor(Math.random() * 4) + 3;
            for (let j = 0; j < particleCount; j++) {
                const position = j / particleCount;
                this.dataStreams[i].particles.push({
                    position: position,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 0.02 + 0.01
                });
            }
        }
    }

    // 生成数据连接线
    generateDataConnections() {
        // 确保图表之间有连接线
        for (let i = 0; i < this.finalCharts.length - 1; i++) {
            const chart1 = this.finalCharts[i];
            
            // 每个图表连接到1-2个其他图表
            const connectionCount = Math.floor(Math.random() * 2) + 1;
            
            for (let j = 0; j < connectionCount; j++) {
                // 随机选择一个目标图表，避免重复连接
                let targetIndex;
                do {
                    targetIndex = Math.floor(Math.random() * this.finalCharts.length);
                } while (targetIndex === i);
                
                const chart2 = this.finalCharts[targetIndex];
                
                // 创建连接
                this.dataConnections.push({
                    startX: chart1.x,
                    startY: chart1.y,
                    endX: chart2.x,
                    endY: chart2.y,
                    color: this.getRandomColor(0.7),
                    width: Math.random() * 1.5 + 1,
                    progress: 0,
                    speed: Math.random() * 0.005 + 0.002,
                    particles: [],
                    animateParticles: Math.random() > 0.5 // 一些连接线有动画粒子
                });
                
                // 添加连接线上的粒子
                if (this.dataConnections[this.dataConnections.length - 1].animateParticles) {
                    const particleCount = Math.floor(Math.random() * 3) + 2;
                    for (let k = 0; k < particleCount; k++) {
                        this.dataConnections[this.dataConnections.length - 1].particles.push({
                            position: Math.random(),
                            radius: Math.random() * 2.5 + 1,
                            speed: Math.random() * 0.01 + 0.005,
                            direction: Math.random() > 0.5 ? 1 : -1 // 随机方向
                        });
                    }
                }
            }
        }
    }

    // 移除动画
    remove() {
        // 取消动画帧
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        
        // 移除窗口大小变化事件监听
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        
        // 移除Canvas
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        
        // 移除跳过按钮
        if (this.skipButton && this.skipButton.parentNode) {
            this.skipButton.parentNode.removeChild(this.skipButton);
        }
    }

    // 获取基于时间的问候语
    getTimeBasedGreeting() {
        const hour = new Date().getHours();
        let greeting = "";
        
        if (hour >= 5 && hour < 12) {
            greeting = "早上好";
        } else if (hour >= 12 && hour < 18) {
            greeting = "下午好";
        } else {
            greeting = "晚上好";
        }
        
        return greeting;
    }

    // 绘制数据故事线
    drawDataStoryline(progress) {
        const currentStage = this.getCurrentStoryStage(progress);
        if (!currentStage) return;
        
        const x = this.width * 0.5;
        const y = this.height * 0.9;
        
        this.ctx.save();
        
        // 添加3D效果
        if (this.depth.enabled) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        
        // 绘制背景
        this.ctx.beginPath();
        this.ctx.roundRect(x - 150, y - 15, 300, 30, [15]);
        this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(50, 50, 55, 0.7)' : 'rgba(240, 240, 245, 0.7)';
        this.ctx.fill();
        
        // 绘制进度条
        const progressWidth = 290 * progress;
        this.ctx.beginPath();
        this.ctx.roundRect(x - 145, y - 10, progressWidth, 20, [10]);
        
        // 进度条渐变
        const gradient = this.ctx.createLinearGradient(x - 145, y, x - 145 + progressWidth, y);
        gradient.addColorStop(0, this.colors[this.theme].primary);
        gradient.addColorStop(1, this.theme === 'dark' ? this.colors[this.theme].accent2 : this.colors[this.theme].accent3);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // 绘制当前阶段文本
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = `bold 14px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
        this.ctx.fillStyle = this.theme === 'dark' ? 'white' : '#1d1d1f';
        this.ctx.fillText(currentStage.text, x, y);
        
        this.ctx.restore();
    }

    // 获取当前故事阶段
    getCurrentStoryStage(progress) {
        // 找到最后一个时间小于当前进度的阶段
        for (let i = this.storyStages.length - 1; i >= 0; i--) {
            if (progress >= this.storyStages[i].time) {
                return this.storyStages[i];
            }
        }
        return null;
    }

    // 绘制数据连接线
    drawDataConnections(progress) {
        for (const connection of this.dataConnections) {
            // 计算当前连接线进度
            connection.progress = Math.min(connection.progress + connection.speed, 1);
            
            // 绘制连接线
            const currentEndX = connection.startX + (connection.endX - connection.startX) * connection.progress * progress;
            const currentEndY = connection.startY + (connection.endY - connection.startY) * connection.progress * progress;
            
            // 贝塞尔曲线控制点
            const controlX = (connection.startX + connection.endX) / 2;
            const controlY = ((connection.startY + connection.endY) / 2) - 50; // 上方弯曲
            
            // 添加3D效果的阴影
            if (this.depth.enabled) {
                this.ctx.shadowColor = connection.color;
                this.ctx.shadowBlur = 5 * progress;
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowOffsetY = 2;
            }
            
            // 绘制连接线
            this.ctx.beginPath();
            this.ctx.moveTo(connection.startX, connection.startY);
            this.ctx.quadraticCurveTo(controlX, controlY, currentEndX, currentEndY);
            this.ctx.strokeStyle = connection.color;
            this.ctx.lineWidth = connection.width;
            this.ctx.globalAlpha = 0.6 * progress;
            this.ctx.stroke();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
            
            // 绘制连接线上的数据粒子
            if (connection.animateParticles) {
                for (const particle of connection.particles) {
                    // 更新粒子位置
                    particle.position += particle.speed * particle.direction;
                    if (particle.position > 1) particle.position = 0;
                    if (particle.position < 0) particle.position = 1;
                    
                    // 计算粒子在贝塞尔曲线上的位置
                    const t = particle.position * connection.progress * progress;
                    if (t > 0) {
                        const particleX = Math.pow(1-t, 2) * connection.startX + 
                                          2 * (1-t) * t * controlX + 
                                          t * t * currentEndX;
                        const particleY = Math.pow(1-t, 2) * connection.startY + 
                                          2 * (1-t) * t * controlY + 
                                          t * t * currentEndY;
                        
                        // 添加3D效果的阴影
                        if (this.depth.enabled) {
                            this.ctx.shadowColor = connection.color;
                            this.ctx.shadowBlur = 5;
                            this.ctx.shadowOffsetX = 1;
                            this.ctx.shadowOffsetY = 1;
                        }
                        
                        // 绘制粒子
                        this.ctx.beginPath();
                        this.ctx.arc(particleX, particleY, particle.radius, 0, Math.PI * 2);
                        this.ctx.fillStyle = connection.color;
                        this.ctx.globalAlpha = 0.8 * progress;
                        this.ctx.fill();
                        
                        // 重置阴影
                        this.ctx.shadowBlur = 0;
                        this.ctx.shadowOffsetX = 0;
                        this.ctx.shadowOffsetY = 0;
                    }
                }
            }
        }
    }

    // 绘制仪表盘图表
    drawGaugeChart(x, y, progress) {
        const radius = 40 * progress;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = this.depth.shadowDepth;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('系统性能', 0, -radius - 12);
        }
        
        // 绘制外圈
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
        this.ctx.lineWidth = 2 * progress;
        this.ctx.globalAlpha = progress;
        this.ctx.stroke();
        
        // 绘制内圈背景
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius - 5 * progress, Math.PI * 0.75, Math.PI * 2.25, false);
        this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
        this.ctx.lineWidth = 10 * progress;
        this.ctx.stroke();
        
        // 绘制仪表值 - 动态变化
        const gaugeValue = progress * 0.85; // 最大值为85%
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius - 5 * progress, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * gaugeValue), false);
        
        // 仪表值渐变色
        const gradient = this.ctx.createLinearGradient(-radius, 0, radius, 0);
        gradient.addColorStop(0, this.colors[this.theme].primary);
        gradient.addColorStop(0.7, this.colors[this.theme].secondary);
        gradient.addColorStop(1, this.theme === 'dark' ? this.colors[this.theme].accent1 : this.colors[this.theme].accent1);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 10 * progress;
        this.ctx.stroke();
        
        // 绘制中心圆
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 15 * progress, 0, Math.PI * 2);
        this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(50, 50, 55, 0.9)' : 'rgba(240, 240, 245, 0.9)';
        this.ctx.fill();
        
        // 绘制仪表针
        if (progress > 0.3) {
            const needleProgress = Math.min((progress - 0.3) / 0.7, 1);
            const needleLength = radius - 10 * progress;
            const needleAngle = Math.PI * (0.75 + 1.5 * gaugeValue);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(Math.cos(needleAngle) * needleLength * needleProgress, Math.sin(needleAngle) * needleLength * needleProgress);
            this.ctx.strokeStyle = this.theme === 'dark' ? '#ff375f' : '#dc3545';
            this.ctx.lineWidth = 2 * progress;
            this.ctx.stroke();
            
            // 针头圆点
            this.ctx.beginPath();
            this.ctx.arc(Math.cos(needleAngle) * needleLength * needleProgress, Math.sin(needleAngle) * needleLength * needleProgress, 4 * progress, 0, Math.PI * 2);
            this.ctx.fillStyle = this.theme === 'dark' ? '#ff375f' : '#dc3545';
            this.ctx.fill();
        }
        
        // 显示当前值
        if (progress > 0.6) {
            const valueProgress = Math.min((progress - 0.6) / 0.4, 1);
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = `bold ${16 * valueProgress}px -apple-system, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'white' : '#1d1d1f';
            this.ctx.globalAlpha = valueProgress;
            this.ctx.fillText(`${Math.round(gaugeValue * 100)}%`, 0, radius / 2);
        }
        
        this.ctx.restore();
    }

    // 绘制热力图
    drawHeatmapChart(x, y, progress) {
        const width = 100 * progress;
        const height = 80 * progress;
        const cellSize = 14 * progress;
        const cols = 5;
        const rows = 4;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = this.depth.shadowDepth;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('数据热力图', 0, -height/2 - 12);
        }
        
        // 计算起始位置，以使热力图居中
        const startX = -width / 2 + (width - cols * cellSize) / 2;
        const startY = -height / 2 + (height - rows * cellSize) / 2;
        
        // 绘制热力图单元格
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // 随机热力值，但确保有一定模式
                let value = (Math.sin(row / 2) + Math.cos(col / 3) + 2) / 4;
                // 进一步随机化，但保持模式
                value = Math.min(1, Math.max(0, value + (Math.random() - 0.5) * 0.3));
                
                // 计算单元格位置
                const cellX = startX + col * cellSize;
                const cellY = startY + row * cellSize;
                
                // 计算显示进度 - 使单元格逐个显示
                const cellIndex = row * cols + col;
                const totalCells = rows * cols;
                const cellDisplayProgress = Math.min(1, (progress * 1.2 * totalCells - cellIndex) / 3);
                
                if (cellDisplayProgress > 0) {
                    // 绘制单元格
                    this.ctx.beginPath();
                    this.ctx.rect(cellX, cellY, cellSize - 1, cellSize - 1);
                    
                    // 根据热力值选择颜色
                    let cellColor;
                    if (value < 0.3) {
                        cellColor = this.theme === 'dark' ? 'rgba(41, 151, 255, ' + cellDisplayProgress + ')' : 
                                                           'rgba(0, 113, 227, ' + cellDisplayProgress + ')';
                    } else if (value < 0.6) {
                        cellColor = this.theme === 'dark' ? 'rgba(94, 92, 230, ' + cellDisplayProgress + ')' : 
                                                           'rgba(88, 86, 214, ' + cellDisplayProgress + ')';
                    } else {
                        cellColor = this.theme === 'dark' ? 'rgba(255, 55, 95, ' + cellDisplayProgress + ')' : 
                                                           'rgba(220, 53, 69, ' + cellDisplayProgress + ')';
                    }
                    
                    this.ctx.fillStyle = cellColor;
                    this.ctx.fill();
                    
                    // 显示热力值
                    if (cellDisplayProgress > 0.7 && progress > 0.8) {
                        const textProgress = Math.min(1, (cellDisplayProgress - 0.7) / 0.3);
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.font = `${9 * textProgress}px -apple-system, sans-serif`;
                        this.ctx.fillStyle = this.theme === 'dark' ? 'white' : '#1d1d1f';
                        this.ctx.globalAlpha = textProgress;
                        this.ctx.fillText(Math.round(value * 100), cellX + cellSize/2, cellY + cellSize/2);
                    }
                }
            }
        }
        
        // 添加图例
        if (progress > 0.9) {
            const legendProgress = (progress - 0.9) / 0.1;
            const legendY = height/2 + 15;
            
            // 图例标题
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            this.ctx.font = `${10 * legendProgress}px -apple-system, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
            this.ctx.globalAlpha = legendProgress;
            this.ctx.fillText('活跃度', 0, legendY);
            
            // 图例颜色块
            const legendWidth = 60 * legendProgress;
            const legendHeight = 5 * legendProgress;
            const legendX = -legendWidth / 2;
            
            // 创建渐变
            const legendGradient = this.ctx.createLinearGradient(legendX, 0, legendX + legendWidth, 0);
            legendGradient.addColorStop(0, this.theme === 'dark' ? 'rgba(41, 151, 255, 1)' : 'rgba(0, 113, 227, 1)');
            legendGradient.addColorStop(0.5, this.theme === 'dark' ? 'rgba(94, 92, 230, 1)' : 'rgba(88, 86, 214, 1)');
            legendGradient.addColorStop(1, this.theme === 'dark' ? 'rgba(255, 55, 95, 1)' : 'rgba(220, 53, 69, 1)');
            
            this.ctx.fillStyle = legendGradient;
            this.ctx.fillRect(legendX, legendY + 15, legendWidth, legendHeight);
            
            // 图例标签
            this.ctx.textAlign = 'center';
            this.ctx.font = `${8 * legendProgress}px -apple-system, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
            
            this.ctx.fillText('低', legendX, legendY + 25);
            this.ctx.fillText('高', legendX + legendWidth, legendY + 25);
        }
        
        this.ctx.restore();
    }
    
    // 绘制多文件分析图表
    drawMultiFileChart(x, y, progress) {
        const width = 100 * progress;
        const height = 80 * progress;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)';
            this.ctx.shadowBlur = this.depth.shadowDepth * 1.2;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('多文件分析', 0, -height/2 - 12);
        }
        
        // 绘制文件组图标
        const fileCount = 5;
        const fileWidth = 30 * progress;
        const fileHeight = 40 * progress;
        const spacing = 7 * progress;
        
        // 绘制多个文件层叠效果
        for (let i = 0; i < fileCount; i++) {
            // 根据进度动态显示文件
            if (progress < 0.4 + i * 0.15) continue;
            
            const fileOpacity = Math.min(1, (progress - (0.4 + i * 0.15)) / 0.15);
            
            // 文件位置偏移 - 创建错落有致的效果
            const offsetX = -20 + i * 10 * progress;
            const offsetY = -20 + i * 5 * progress;
            
            // 绘制文件背景
            this.ctx.beginPath();
            this.ctx.roundRect(offsetX, offsetY, fileWidth, fileHeight, [5 * progress]);
            
            // 不同文件使用不同颜色
            const fileColors = [
                this.colors[this.theme].primary, 
                this.colors[this.theme].accent1,
                this.colors[this.theme].accent2, 
                this.colors[this.theme].accent4,
                this.colors[this.theme].accent5
            ];
            
            // 创建渐变背景
            const gradient = this.ctx.createLinearGradient(
                offsetX, offsetY,
                offsetX + fileWidth, offsetY + fileHeight
            );
            gradient.addColorStop(0, fileColors[i]);
            gradient.addColorStop(1, this.lightenColor(fileColors[i], 20));
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = 0.8 * fileOpacity;
            this.ctx.fill();
            
            // 绘制文件内容线条
            if (progress > 0.6) {
                const lineProgress = Math.min(1, (progress - 0.6) / 0.2);
                
                this.ctx.beginPath();
                for (let j = 0; j < 3; j++) {
                    const lineY = offsetY + 10 + j * 8 * progress;
                    this.ctx.moveTo(offsetX + 5, lineY);
                    this.ctx.lineTo(offsetX + fileWidth - 10, lineY);
                }
                
                this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)';
                this.ctx.lineWidth = 1.5 * lineProgress;
                this.ctx.globalAlpha = 0.7 * lineProgress;
                this.ctx.stroke();
            }
            
            // 添加连接线 - 文件相互连接
            if (i > 0 && progress > 0.7) {
                const connectionProgress = Math.min(1, (progress - 0.7) / 0.3);
                
                this.ctx.beginPath();
                this.ctx.moveTo(offsetX - 10, offsetY + fileHeight / 2);
                this.ctx.lineTo(offsetX - 30 + i * 10, offsetY - 5 + i * 5);
                
                this.ctx.strokeStyle = fileColors[i];
                this.ctx.lineWidth = 2 * connectionProgress;
                this.ctx.globalAlpha = 0.7 * connectionProgress;
                
                // 添加发光效果
                if (this.glowEffects) {
                    this.ctx.shadowColor = fileColors[i];
                    this.ctx.shadowBlur = 8 * connectionProgress;
                }
                
                this.ctx.stroke();
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
            }
        }
        
        // 绘制数据分析指示器
        if (progress > 0.8) {
            const analysisProgress = Math.min(1, (progress - 0.8) / 0.2);
            
            // 绘制扫描线
            this.ctx.beginPath();
            this.ctx.moveTo(-30, 15);
            this.ctx.lineTo(40, 15);
            
            const scanGradient = this.ctx.createLinearGradient(-30, 15, 40, 15);
            scanGradient.addColorStop(0, 'transparent');
            scanGradient.addColorStop(0.5, this.colors[this.theme].accent3);
            scanGradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = scanGradient;
            this.ctx.lineWidth = 3 * analysisProgress;
            this.ctx.globalAlpha = analysisProgress;
            
            // 添加扫描线发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = this.colors[this.theme].accent3;
                this.ctx.shadowBlur = 10 * analysisProgress;
            }
            
            this.ctx.stroke();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            
            // 绘制扫描点
            const scanPosition = -30 + 70 * ((performance.now() % 1000) / 1000);
            
            this.ctx.beginPath();
            this.ctx.arc(scanPosition, 15, 4 * analysisProgress, 0, Math.PI * 2);
            this.ctx.fillStyle = this.colors[this.theme].accent3;
            this.ctx.globalAlpha = analysisProgress;
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    // 绘制单文件分析图表
    drawSingleFileChart(x, y, progress) {
        const width = 100 * progress;
        const height = 90 * progress;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = this.depth.shadowDepth;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('单文件分析', 0, -height/2 - 12);
        }
        
        // 绘制一个大文件图标
        const fileWidth = 50 * progress;
        const fileHeight = 65 * progress;
        
        // 根据进度动态显示文件
        if (progress > 0.3) {
            const fileProgress = Math.min(1, (progress - 0.3) / 0.4);
            
            // 绘制文件背景
            this.ctx.beginPath();
            this.ctx.roundRect(-fileWidth/2, -fileHeight/2, fileWidth, fileHeight, [8 * progress]);
            
            // 创建渐变背景
            const gradient = this.ctx.createLinearGradient(
                -fileWidth/2, -fileHeight/2,
                fileWidth/2, fileHeight/2
            );
            gradient.addColorStop(0, this.colors[this.theme].accent5); // 使用天蓝色
            gradient.addColorStop(1, this.lightenColor(this.colors[this.theme].accent5, 20));
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = fileProgress;
            this.ctx.fill();
            
            // 添加发光边框
            if (this.glowEffects && progress > 0.5) {
                const borderProgress = Math.min(1, (progress - 0.5) / 0.5);
                
                this.ctx.beginPath();
                this.ctx.roundRect(-fileWidth/2, -fileHeight/2, fileWidth, fileHeight, [8 * progress]);
                this.ctx.strokeStyle = this.colors[this.theme].accent5;
                this.ctx.lineWidth = 2 * borderProgress;
                this.ctx.globalAlpha = 0.8 * borderProgress;
                
                // 添加边框发光效果
                this.ctx.shadowColor = this.colors[this.theme].accent5;
                this.ctx.shadowBlur = 10 * borderProgress;
                
                this.ctx.stroke();
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
            }
            
            // 绘制文件内容线条
            if (progress > 0.5) {
                const lineProgress = Math.min(1, (progress - 0.5) / 0.3);
                
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const lineY = -fileHeight/2 + 15 + i * 8 * progress;
                    const lineLength = (fileWidth - 15) * (i % 3 === 0 ? 0.6 : 0.8); // 不同长度的线条
                    
                    this.ctx.moveTo(-lineLength/2, lineY);
                    this.ctx.lineTo(lineLength/2, lineY);
                }
                
                this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
                this.ctx.lineWidth = 1.5 * lineProgress;
                this.ctx.globalAlpha = lineProgress;
                this.ctx.stroke();
            }
        }
        
        // 绘制放大镜效果
        if (progress > 0.6) {
            const magnifierProgress = Math.min(1, (progress - 0.6) / 0.4);
            const magnifierRadius = 15 * magnifierProgress;
            const handleLength = 20 * magnifierProgress;
            
            // 放大镜位置 - 右下角
            const magnifierX = 15;
            const magnifierY = 10;
            
            // 添加放大镜发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = this.colors[this.theme].primary;
                this.ctx.shadowBlur = 10 * magnifierProgress;
            }
            
            // 绘制放大镜框
            this.ctx.beginPath();
            this.ctx.arc(magnifierX, magnifierY, magnifierRadius, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.colors[this.theme].primary;
            this.ctx.lineWidth = 2.5 * magnifierProgress;
            this.ctx.globalAlpha = magnifierProgress;
            this.ctx.stroke();
            
            // 绘制放大镜玻璃
            this.ctx.beginPath();
            this.ctx.arc(magnifierX, magnifierY, magnifierRadius - 2 * magnifierProgress, 0, Math.PI * 2);
            
            // 创建放大镜玻璃的渐变效果
            const glassGradient = this.ctx.createRadialGradient(
                magnifierX, magnifierY, 0,
                magnifierX, magnifierY, magnifierRadius - 2 * magnifierProgress
            );
            glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
            
            this.ctx.fillStyle = glassGradient;
            this.ctx.fill();
            
            // 绘制放大镜手柄
            this.ctx.beginPath();
            this.ctx.moveTo(
                magnifierX + Math.cos(Math.PI * 0.75) * magnifierRadius,
                magnifierY + Math.sin(Math.PI * 0.75) * magnifierRadius
            );
            this.ctx.lineTo(
                magnifierX + Math.cos(Math.PI * 0.75) * (magnifierRadius + handleLength),
                magnifierY + Math.sin(Math.PI * 0.75) * (magnifierRadius + handleLength)
            );
            
            this.ctx.strokeStyle = this.colors[this.theme].primary;
            this.ctx.lineWidth = 2.5 * magnifierProgress;
            this.ctx.stroke();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            
            // 添加聚焦线条
            if (progress > 0.8) {
                const focusProgress = Math.min(1, (progress - 0.8) / 0.2);
                
                // 在文件内部添加高亮行
                const highlightY = -fileHeight/2 + 25;
                
                this.ctx.beginPath();
                this.ctx.roundRect(-fileWidth/2 + 5, highlightY - 3, fileWidth - 10, 8, [3]);
                
                this.ctx.fillStyle = this.colors[this.theme].primary;
                this.ctx.globalAlpha = 0.3 * focusProgress;
                this.ctx.fill();
                
                // 添加高亮文本
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.font = `bold ${10 * focusProgress}px -apple-system, sans-serif`;
                this.ctx.fillStyle = this.theme === 'dark' ? 'white' : '#1d1d1f';
                this.ctx.globalAlpha = focusProgress;
                this.ctx.fillText('关键数据点', 0, highlightY + 1);
                
                // 连接放大镜和高亮区域
                this.ctx.beginPath();
                this.ctx.moveTo(magnifierX, magnifierY);
                this.ctx.lineTo(fileWidth/4, highlightY);
                
                this.ctx.strokeStyle = this.colors[this.theme].primary;
                this.ctx.lineWidth = 1 * focusProgress;
                this.ctx.globalAlpha = 0.5 * focusProgress;
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    // 绘制AI智能分析图表
    drawAiAnalysisChart(x, y, progress) {
        const width = 100 * progress;
        const height = 80 * progress;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = this.depth.shadowDepth * 1.2;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${16 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 20, 20, 0.95)';
            this.ctx.globalAlpha = titleProgress;
            
            // 添加文字阴影以增强清晰度
            if (this.depth.enabled) {
                this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)';
                this.ctx.shadowBlur = 4;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 1;
            }
            
            this.ctx.fillText('AI智能分析', 0, -height/2 - 14);
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        }
        
        // 绘制AI大脑图形
        if (progress > 0.3) {
            const brainProgress = Math.min(1, (progress - 0.3) / 0.5);
            const brainRadius = 32 * brainProgress;
            
            // 绘制大脑外部光晕
            if (this.glowEffects) {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, brainRadius * 1.2, 0, Math.PI * 2);
                
                const haloGradient = this.ctx.createRadialGradient(
                    0, 0, brainRadius * 0.5,
                    0, 0, brainRadius * 1.2
                );
                haloGradient.addColorStop(0, `${this.colors[this.theme].accent2}30`);
                haloGradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = haloGradient;
                this.ctx.globalAlpha = 0.6 * brainProgress;
                this.ctx.fill();
            }
            
            // 绘制大脑外部圆形
            this.ctx.beginPath();
            this.ctx.arc(0, 0, brainRadius, 0, Math.PI * 2);
            
            // 创建渐变 - 增强立体感
            const brainGradient = this.ctx.createRadialGradient(
                -brainRadius * 0.2, -brainRadius * 0.2, 0,
                0, 0, brainRadius
            );
            brainGradient.addColorStop(0, this.lightenColor(this.colors[this.theme].accent2, 20)); 
            brainGradient.addColorStop(0.7, this.colors[this.theme].accent2);
            brainGradient.addColorStop(1, this.colors[this.theme].accent3);
            
            this.ctx.fillStyle = brainGradient;
            this.ctx.globalAlpha = 0.9 * brainProgress;
            
            // 添加发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = this.colors[this.theme].accent2;
                this.ctx.shadowBlur = 18 * brainProgress;
            }
            
            this.ctx.fill();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            
            // 绘制脑纹理 - 更复杂的神经网络图案
            if (progress > 0.4) {
                const textureProgress = Math.min(1, (progress - 0.4) / 0.4);
                
                // 绘制弯曲的神经网络线条
                for (let i = 0; i < 10; i++) {
                    const angle = (i / 10) * Math.PI * 2;
                    const startRadius = brainRadius * 0.4;
                    const endRadius = brainRadius * 0.8;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(
                        Math.cos(angle) * startRadius,
                        Math.sin(angle) * startRadius
                    );
                    
                    // 创建多个控制点的贝塞尔曲线，增加曲线复杂度
                    // 第一个控制点
                    const cp1x = Math.cos(angle + 0.2) * (startRadius + endRadius) / 3;
                    const cp1y = Math.sin(angle + 0.2) * (startRadius + endRadius) / 3;
                    // 第二个控制点
                    const cp2x = Math.cos(angle + 0.3) * (startRadius + endRadius) * 2/3;
                    const cp2y = Math.sin(angle + 0.3) * (startRadius + endRadius) * 2/3;
                    
                    this.ctx.bezierCurveTo(
                        cp1x, cp1y,
                        cp2x, cp2y,
                        Math.cos(angle + 0.4) * endRadius,
                        Math.sin(angle + 0.4) * endRadius
                    );
                    
                    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                    this.ctx.lineWidth = 1.8 * textureProgress;
                    this.ctx.globalAlpha = 0.8 * textureProgress;
                    
                    // 添加神经线发光效果
                    if (this.glowEffects) {
                        this.ctx.shadowColor = 'white';
                        this.ctx.shadowBlur = 5 * textureProgress;
                    }
                    
                    this.ctx.stroke();
                    
                    // 重置阴影
                    this.ctx.shadowBlur = 0;
                    
                    // 添加神经节点 - 中间节点
                    const midX = (Math.cos(angle) * startRadius + Math.cos(angle + 0.4) * endRadius) / 2;
                    const midY = (Math.sin(angle) * startRadius + Math.sin(angle + 0.4) * endRadius) / 2;
                    
                    this.ctx.beginPath();
                    this.ctx.arc(midX, midY, 2.5 * textureProgress, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.globalAlpha = 0.9 * textureProgress;
                    this.ctx.fill();
                    
                    // 添加神经节点 - 终点
                    this.ctx.beginPath();
                    this.ctx.arc(
                        Math.cos(angle + 0.4) * endRadius,
                        Math.sin(angle + 0.4) * endRadius,
                        3 * textureProgress, 0, Math.PI * 2
                    );
                    this.ctx.fillStyle = 'white';
                    this.ctx.globalAlpha = 0.9 * textureProgress;
                    
                    // 添加节点发光效果
                    if (this.glowEffects) {
                        this.ctx.shadowColor = 'white';
                        this.ctx.shadowBlur = 6 * textureProgress;
                    }
                    
                    this.ctx.fill();
                    
                    // 重置阴影
                    this.ctx.shadowBlur = 0;
                }
                
                // 绘制中心核心
                this.ctx.beginPath();
                this.ctx.arc(0, 0, brainRadius * 0.35, 0, Math.PI * 2);
                
                const coreGradient = this.ctx.createRadialGradient(
                    0, 0, 0,
                    0, 0, brainRadius * 0.35
                );
                coreGradient.addColorStop(0, 'white');
                coreGradient.addColorStop(0.5, this.lightenColor(this.colors[this.theme].accent3, 30));
                coreGradient.addColorStop(1, this.colors[this.theme].accent3);
                
                this.ctx.fillStyle = coreGradient;
                this.ctx.globalAlpha = textureProgress;
                
                // 添加核心发光效果
                if (this.glowEffects) {
                    this.ctx.shadowColor = 'white';
                    this.ctx.shadowBlur = 12 * textureProgress;
                }
                
                this.ctx.fill();
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
                
                // 添加核心脉冲效果
                const time = performance.now() / 1000;
                const pulseSize = Math.sin(time * 3) * 2 + 2; // 脉冲大小变化
                
                this.ctx.beginPath();
                this.ctx.arc(0, 0, (brainRadius * 0.35 + pulseSize) * textureProgress, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                this.ctx.lineWidth = 2 * textureProgress;
                this.ctx.globalAlpha = 0.5 * textureProgress * (0.5 + Math.sin(time * 3) * 0.5);
                this.ctx.stroke();
            }
        }
        
        // 绘制数据连接和分析结果
        if (progress > 0.6) {
            const analysisProgress = Math.min(1, (progress - 0.6) / 0.4);
            
            // 绘制4条射线，表示AI分析结果
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const startRadius = 32 * progress;
                const endRadius = startRadius + 35 * analysisProgress;
                
                // 计算起点和终点
                const startX = Math.cos(angle) * startRadius;
                const startY = Math.sin(angle) * startRadius;
                const endX = Math.cos(angle) * endRadius;
                const endY = Math.sin(angle) * endRadius;
                
                // 绘制射线
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.lineTo(endX, endY);
                
                // 使用不同颜色的射线
                const rayColors = [
                    this.colors[this.theme].primary,
                    this.colors[this.theme].secondary,
                    this.colors[this.theme].accent1,
                    this.colors[this.theme].accent4
                ];
                
                this.ctx.strokeStyle = rayColors[i];
                this.ctx.lineWidth = 2.5 * analysisProgress;
                this.ctx.globalAlpha = analysisProgress;
                
                // 添加射线发光效果
                if (this.glowEffects) {
                    this.ctx.shadowColor = rayColors[i];
                    this.ctx.shadowBlur = 10 * analysisProgress;
                }
                
                this.ctx.stroke();
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
                
                // 在射线末端添加结果指示器
                if (progress > 0.75) {
                    const indicatorProgress = Math.min(1, (progress - 0.75) / 0.25);
                    
                    // 绘制结果圆圈
                    this.ctx.beginPath();
                    this.ctx.arc(endX, endY, 7 * indicatorProgress, 0, Math.PI * 2);
                    this.ctx.fillStyle = rayColors[i];
                    this.ctx.globalAlpha = indicatorProgress;
                    
                    // 添加结果圆圈发光效果
                    if (this.glowEffects) {
                        this.ctx.shadowColor = rayColors[i];
                        this.ctx.shadowBlur = 8 * indicatorProgress;
                    }
                    
                    this.ctx.fill();
                    
                    // 重置阴影
                    this.ctx.shadowBlur = 0;
                    
                    // 绘制指示图标
                    const iconRadius = 4 * indicatorProgress;
                    this.ctx.beginPath();
                    this.ctx.arc(endX, endY, iconRadius, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.globalAlpha = indicatorProgress;
                    this.ctx.fill();
                    
                    // 绘制结果标签
                    this.ctx.textAlign = angle > Math.PI / 2 && angle < Math.PI * 1.5 ? 'right' : 'left';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.font = `bold ${10 * indicatorProgress}px -apple-system, sans-serif`;
                    this.ctx.fillStyle = this.theme === 'dark' ? 'white' : '#1d1d1f';
                    
                    // 结果标签文本
                    const labels = ['模式识别', '预测分析', '异常检测', '智能推荐'];
                    const labelOffset = 12 * indicatorProgress;
                    
                    // 添加文字阴影以增强清晰度
                    if (this.depth.enabled) {
                        this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
                        this.ctx.shadowBlur = 3;
                        this.ctx.shadowOffsetX = 0;
                        this.ctx.shadowOffsetY = 1;
                    }
                    
                    this.ctx.fillText(
                        labels[i],
                        endX + (angle > Math.PI / 2 && angle < Math.PI * 1.5 ? -labelOffset : labelOffset),
                        endY
                    );
                    
                    // 重置阴影
                    this.ctx.shadowBlur = 0;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 0;
                }
            }
            
            // 添加分析完成指示器
            if (progress > 0.85) {
                const completeProgress = Math.min(1, (progress - 0.85) / 0.15);
                
                // 脉冲效果
                const time = performance.now() / 1000;
                const pulseSize = 5 + Math.sin(time * 4) * 3;
                
                this.ctx.beginPath();
                this.ctx.arc(0, 0, (32 + pulseSize) * completeProgress, 0, Math.PI * 2);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
                this.ctx.lineWidth = 2.5 * completeProgress;
                this.ctx.globalAlpha = 0.6 * completeProgress * (0.5 + Math.sin(time * 4) * 0.5);
                this.ctx.stroke();
                
                // 中心文本
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.font = `bold ${13 * completeProgress}px -apple-system, sans-serif`;
                this.ctx.fillStyle = 'white';
                this.ctx.globalAlpha = completeProgress;
                
                // 添加文字阴影以增强清晰度
                if (this.depth.enabled) {
                    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.shadowBlur = 3;
                    this.ctx.shadowOffsetX = 0;
                    this.ctx.shadowOffsetY = 1;
                }
                
                this.ctx.fillText('100%', 0, 0);
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
                this.ctx.shadowOffsetX = 0;
                this.ctx.shadowOffsetY = 0;
            }
        }
        
        this.ctx.restore();
    }
    
    // 绘制销售趋势分析图表
    drawSalesTrendChart(x, y, progress) {
        const width = 100 * progress;
        const height = 80 * progress;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = this.depth.shadowDepth;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('销售趋势分析', 0, -height/2 - 12);
        }
        
        // 绘制坐标轴
        if (progress > 0.3) {
            const axisProgress = Math.min(1, (progress - 0.3) / 0.3);
            
            // X轴
            this.ctx.beginPath();
            this.ctx.moveTo(-width/2, height/3);
            this.ctx.lineTo(-width/2 + width * axisProgress, height/3);
            this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)';
            this.ctx.lineWidth = 2 * axisProgress;
            this.ctx.globalAlpha = axisProgress;
            this.ctx.stroke();
            
            // Y轴
            this.ctx.beginPath();
            this.ctx.moveTo(-width/2, height/3);
            this.ctx.lineTo(-width/2, height/3 - height * 0.6 * axisProgress);
            this.ctx.stroke();
            
            // X轴标签 - 月份
            if (progress > 0.4) {
                const labelProgress = Math.min(1, (progress - 0.4) / 0.3);
                
                const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
                const monthWidth = width / 6;
                
                for (let i = 0; i < 6; i++) {
                    // 只显示已展开的部分的标签
                    if (i <= axisProgress * 6) {
                        const monthX = -width/2 + i * monthWidth + monthWidth/2;
                        
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'top';
                        this.ctx.font = `${9 * labelProgress}px -apple-system, sans-serif`;
                        this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
                        this.ctx.globalAlpha = labelProgress;
                        this.ctx.fillText(months[i], monthX, height/3 + 5);
                        
                        // 小刻度线
                        this.ctx.beginPath();
                        this.ctx.moveTo(monthX, height/3);
                        this.ctx.lineTo(monthX, height/3 + 3);
                        this.ctx.stroke();
                    }
                }
            }
        }
        
        // 绘制销售数据线
        if (progress > 0.5) {
            const lineProgress = Math.min(1, (progress - 0.5) / 0.4);
            
            // 销售数据点
            const salesData = [15, 30, 25, 40, 35, 50];
            const points = [];
            const chartHeight = height * 0.6;
            const pointWidth = width / 6;
            
            // 计算点坐标
            for (let i = 0; i < salesData.length; i++) {
                // 归一化数据
                const normalized = salesData[i] / 50;
                
                points.push({
                    x: -width/2 + i * pointWidth + pointWidth/2,
                    y: height/3 - normalized * chartHeight
                });
            }
            
            // 绘制销售曲线
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            
            // 计算当前绘制的终点，基于lineProgress
            const endIndex = Math.min(Math.floor(lineProgress * 6), 5);
            const endFraction = lineProgress * 6 - endIndex;
            
            // 绘制贝塞尔曲线 - 平滑连接
            for (let i = 0; i < endIndex; i++) {
                const xc = (points[i].x + points[i+1].x) / 2;
                const yc = (points[i].y + points[i+1].y) / 2;
                this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            
            // 处理最后一段未完成的线
            if (endIndex < 5) {
                const lastX = points[endIndex].x;
                const lastY = points[endIndex].y;
                const nextX = points[endIndex+1].x;
                const nextY = points[endIndex+1].y;
                
                const currentX = lastX + (nextX - lastX) * endFraction;
                const currentY = lastY + (nextY - lastY) * endFraction;
                
                this.ctx.quadraticCurveTo(lastX, lastY, 
                    lastX + (currentX - lastX) / 2, 
                    lastY + (currentY - lastY) / 2);
                
                this.ctx.lineTo(currentX, currentY);
            } else {
                const xc = (points[4].x + points[5].x) / 2;
                const yc = (points[4].y + points[5].y) / 2;
                this.ctx.quadraticCurveTo(points[4].x, points[4].y, xc, yc);
                this.ctx.quadraticCurveTo(xc, yc, points[5].x, points[5].y);
            }
            
            // 设置线条样式
            this.ctx.strokeStyle = this.colors[this.theme].primary;
            this.ctx.lineWidth = 3 * lineProgress;
            this.ctx.globalAlpha = lineProgress;
            
            // 添加线条发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = this.colors[this.theme].primary;
                this.ctx.shadowBlur = 8 * lineProgress;
            }
            
            this.ctx.stroke();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
            
            // 添加渐变填充
            if (lineProgress > 0.3) {
                const fillProgress = Math.min(1, (lineProgress - 0.3) / 0.7);
                
                // 创建销售曲线的填充路径
                this.ctx.beginPath();
                this.ctx.moveTo(points[0].x, height/3);
                this.ctx.lineTo(points[0].x, points[0].y);
                
                // 绘制贝塞尔曲线 - 平滑连接
                for (let i = 0; i < endIndex; i++) {
                    const xc = (points[i].x + points[i+1].x) / 2;
                    const yc = (points[i].y + points[i+1].y) / 2;
                    this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }
                
                // 处理最后一段未完成的线
                if (endIndex < 5) {
                    const lastX = points[endIndex].x;
                    const lastY = points[endIndex].y;
                    const nextX = points[endIndex+1].x;
                    const nextY = points[endIndex+1].y;
                    
                    const currentX = lastX + (nextX - lastX) * endFraction;
                    const currentY = lastY + (nextY - lastY) * endFraction;
                    
                    this.ctx.quadraticCurveTo(lastX, lastY, 
                        lastX + (currentX - lastX) / 2, 
                        lastY + (currentY - lastY) / 2);
                    
                    this.ctx.lineTo(currentX, currentY);
                    this.ctx.lineTo(currentX, height/3);
                } else {
                    const xc = (points[4].x + points[5].x) / 2;
                    const yc = (points[4].y + points[5].y) / 2;
                    this.ctx.quadraticCurveTo(points[4].x, points[4].y, xc, yc);
                    this.ctx.quadraticCurveTo(xc, yc, points[5].x, points[5].y);
                    this.ctx.lineTo(points[5].x, height/3);
                }
                
                this.ctx.closePath();
                
                // 创建渐变填充
                const gradient = this.ctx.createLinearGradient(0, height/3 - chartHeight, 0, height/3);
                gradient.addColorStop(0, `${this.colors[this.theme].primary}99`);
                gradient.addColorStop(1, `${this.colors[this.theme].primary}11`);
                
                this.ctx.fillStyle = gradient;
                this.ctx.globalAlpha = 0.7 * fillProgress;
                this.ctx.fill();
            }
            
            // 绘制数据点
            if (lineProgress > 0.5) {
                const pointsProgress = Math.min(1, (lineProgress - 0.5) / 0.5);
                
                for (let i = 0; i <= endIndex; i++) {
                    // 绘制数据点外圈
                    this.ctx.beginPath();
                    this.ctx.arc(points[i].x, points[i].y, 5 * pointsProgress, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.globalAlpha = pointsProgress;
                    
                    // 添加点发光效果
                    if (this.glowEffects) {
                        this.ctx.shadowColor = this.colors[this.theme].primary;
                        this.ctx.shadowBlur = 5 * pointsProgress;
                    }
                    
                    this.ctx.fill();
                    
                    // 重置阴影
                    this.ctx.shadowBlur = 0;
                    
                    // 绘制数据点内圈
                    this.ctx.beginPath();
                    this.ctx.arc(points[i].x, points[i].y, 3 * pointsProgress, 0, Math.PI * 2);
                    this.ctx.fillStyle = this.colors[this.theme].primary;
                    this.ctx.fill();
                }
                
                // 如果有额外的部分点
                if (endIndex < 5 && endFraction > 0) {
                    const partialX = points[endIndex].x + (points[endIndex+1].x - points[endIndex].x) * endFraction;
                    const partialY = points[endIndex].y + (points[endIndex+1].y - points[endIndex].y) * endFraction;
                    
                    // 绘制部分点
                    this.ctx.beginPath();
                    this.ctx.arc(partialX, partialY, 5 * pointsProgress * endFraction, 0, Math.PI * 2);
                    this.ctx.fillStyle = 'white';
                    this.ctx.globalAlpha = pointsProgress * endFraction;
                    this.ctx.fill();
                    
                    this.ctx.beginPath();
                    this.ctx.arc(partialX, partialY, 3 * pointsProgress * endFraction, 0, Math.PI * 2);
                    this.ctx.fillStyle = this.colors[this.theme].primary;
                    this.ctx.fill();
                }
            }
            
            // 添加数据标签
            if (progress > 0.8) {
                const labelProgress = Math.min(1, (progress - 0.8) / 0.2);
                
                for (let i = 0; i <= endIndex; i++) {
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'bottom';
                    this.ctx.font = `bold ${10 * labelProgress}px -apple-system, sans-serif`;
                    this.ctx.fillStyle = this.theme === 'dark' ? 'white' : '#1d1d1f';
                    this.ctx.globalAlpha = labelProgress;
                    this.ctx.fillText(`${salesData[i]}k`, points[i].x, points[i].y - 8);
                }
            }
        }
        
        // 添加增长指标
        if (progress > 0.85) {
            const indicatorProgress = Math.min(1, (progress - 0.85) / 0.15);
            
            // 绘制增长标识
            const indicatorX = width/3;
            const indicatorY = -height/3;
            
            // 箭头背景
            this.ctx.beginPath();
            this.ctx.roundRect(indicatorX - 30, indicatorY - 15, 60, 30, [15]);
            this.ctx.fillStyle = this.colors[this.theme].secondary;
            this.ctx.globalAlpha = 0.2 * indicatorProgress;
            this.ctx.fill();
            
            // 上升箭头
            this.ctx.beginPath();
            this.ctx.moveTo(indicatorX - 10, indicatorY + 8);
            this.ctx.lineTo(indicatorX, indicatorY - 8);
            this.ctx.lineTo(indicatorX + 10, indicatorY + 8);
            
            this.ctx.strokeStyle = this.colors[this.theme].secondary;
            this.ctx.lineWidth = 2 * indicatorProgress;
            this.ctx.globalAlpha = indicatorProgress;
            this.ctx.stroke();
            
            // 增长率文本
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = `bold ${12 * indicatorProgress}px -apple-system, sans-serif`;
            this.ctx.fillStyle = this.colors[this.theme].secondary;
            this.ctx.fillText('+24%', indicatorX, indicatorY + 2);
        }
        
        this.ctx.restore();
    }
    
    // 绘制数据侦探模式图表
    drawDataDetectiveChart(x, y, progress) {
        const width = 100 * progress;
        const height = 80 * progress;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // 添加3D效果
        if (this.depth.enabled && this.glowEffects) {
            this.ctx.shadowColor = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
            this.ctx.shadowBlur = this.depth.shadowDepth;
            this.ctx.shadowOffsetX = this.depth.factor / 2;
            this.ctx.shadowOffsetY = this.depth.factor / 2;
        }
        
        // 添加图表标题
        if (progress > 0.7) {
            const titleProgress = (progress - 0.7) / 0.3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            this.ctx.font = `bold ${14 * titleProgress}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif`;
            this.ctx.fillStyle = this.theme === 'dark' ? 'rgba(245, 245, 247, 0.9)' : 'rgba(29, 29, 31, 0.9)';
            this.ctx.globalAlpha = titleProgress;
            this.ctx.fillText('数据侦探模式', 0, -height/2 - 12);
        }
        
        // 绘制侦探模式图形 - 放大镜和数据节点图
        if (progress > 0.3) {
            const detectiveProgress = Math.min(1, (progress - 0.3) / 0.4);
            
            // 创建节点和连接
            const nodes = [
                { x: 0, y: 0, radius: 15, color: this.colors[this.theme].accent1 },
                { x: -25, y: -20, radius: 10, color: this.colors[this.theme].primary },
                { x: 25, y: -15, radius: 8, color: this.colors[this.theme].accent4 },
                { x: -20, y: 20, radius: 12, color: this.colors[this.theme].accent2 },
                { x: 30, y: 25, radius: 9, color: this.colors[this.theme].accent5 }
            ];
            
            const connections = [
                { from: 0, to: 1 },
                { from: 0, to: 2 },
                { from: 0, to: 3 },
                { from: 0, to: 4 },
                { from: 1, to: 3 },
                { from: 2, to: 4 }
            ];
            
            // 绘制连接线
            for (const connection of connections) {
                const fromNode = nodes[connection.from];
                const toNode = nodes[connection.to];
                
                this.ctx.beginPath();
                this.ctx.moveTo(fromNode.x, fromNode.y);
                this.ctx.lineTo(toNode.x, toNode.y);
                
                this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)';
                this.ctx.lineWidth = 1.5 * detectiveProgress;
                this.ctx.globalAlpha = 0.7 * detectiveProgress;
                this.ctx.stroke();
            }
            
            // 绘制节点
            for (const node of nodes) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * detectiveProgress, 0, Math.PI * 2);
                
                // 创建节点的渐变效果
                const gradient = this.ctx.createRadialGradient(
                    node.x, node.y, 0,
                    node.x, node.y, node.radius * detectiveProgress
                );
                gradient.addColorStop(0, this.lightenColor(node.color, 20));
                gradient.addColorStop(1, node.color);
                
                this.ctx.fillStyle = gradient;
                this.ctx.globalAlpha = detectiveProgress;
                
                // 添加节点发光效果
                if (this.glowEffects) {
                    this.ctx.shadowColor = node.color;
                    this.ctx.shadowBlur = 8 * detectiveProgress;
                }
                
                this.ctx.fill();
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
            }
        }
        
        // 绘制放大镜效果
        if (progress > 0.5) {
            const magnifierProgress = Math.min(1, (progress - 0.5) / 0.4);
            
            // 放大镜位置 - 动态移动以模拟搜索
            const time = performance.now() / 1000;
            const magnifierX = Math.sin(time) * 15;
            const magnifierY = Math.cos(time * 0.7) * 10;
            
            // 放大镜参数
            const magnifierRadius = 25 * magnifierProgress;
            const handleLength = 30 * magnifierProgress;
            const handleAngle = Math.PI * 0.3;
            
            // 绘制放大镜区域 - 先创建裁剪区域
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(magnifierX, magnifierY, magnifierRadius, 0, Math.PI * 2);
            this.ctx.clip();
            
            // 在放大镜内绘制放大的内容
            this.ctx.scale(1.5, 1.5);
            this.ctx.translate(-magnifierX / 1.5, -magnifierY / 1.5);
            
            // 绘制放大的节点和连接
            if (progress > 0.3) {
                const detectiveProgress = Math.min(1, (progress - 0.3) / 0.4);
                
                // 创建节点和连接
                const nodes = [
                    { x: 0, y: 0, radius: 15, color: this.colors[this.theme].accent1 },
                    { x: -25, y: -20, radius: 10, color: this.colors[this.theme].primary },
                    { x: 25, y: -15, radius: 8, color: this.colors[this.theme].accent4 },
                    { x: -20, y: 20, radius: 12, color: this.colors[this.theme].accent2 },
                    { x: 30, y: 25, radius: 9, color: this.colors[this.theme].accent5 }
                ];
                
                const connections = [
                    { from: 0, to: 1 },
                    { from: 0, to: 2 },
                    { from: 0, to: 3 },
                    { from: 0, to: 4 },
                    { from: 1, to: 3 },
                    { from: 2, to: 4 }
                ];
                
                // 绘制连接线
                for (const connection of connections) {
                    const fromNode = nodes[connection.from];
                    const toNode = nodes[connection.to];
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(fromNode.x, fromNode.y);
                    this.ctx.lineTo(toNode.x, toNode.y);
                    
                    this.ctx.strokeStyle = this.theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)';
                    this.ctx.lineWidth = 2 * detectiveProgress;
                    this.ctx.globalAlpha = detectiveProgress;
                    this.ctx.stroke();
                }
                
                // 绘制节点
                for (const node of nodes) {
                    this.ctx.beginPath();
                    this.ctx.arc(node.x, node.y, node.radius * detectiveProgress, 0, Math.PI * 2);
                    
                    // 创建节点的渐变效果
                    const gradient = this.ctx.createRadialGradient(
                        node.x, node.y, 0,
                        node.x, node.y, node.radius * detectiveProgress
                    );
                    gradient.addColorStop(0, this.lightenColor(node.color, 30));
                    gradient.addColorStop(1, node.color);
                    
                    this.ctx.fillStyle = gradient;
                    this.ctx.globalAlpha = detectiveProgress;
                    this.ctx.fill();
                    
                    // 添加数据标签
                    if (node.radius > 10 && progress > 0.7) {
                        const labelProgress = Math.min(1, (progress - 0.7) / 0.3);
                        this.ctx.textAlign = 'center';
                        this.ctx.textBaseline = 'middle';
                        this.ctx.font = `bold ${node.radius * 0.7 * labelProgress}px -apple-system, sans-serif`;
                        this.ctx.fillStyle = 'white';
                        this.ctx.globalAlpha = labelProgress;
                        this.ctx.fillText('!', node.x, node.y);
                    }
                }
            }
            
            this.ctx.restore();
            
            // 绘制放大镜边框
            this.ctx.beginPath();
            this.ctx.arc(magnifierX, magnifierY, magnifierRadius, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.colors[this.theme].tertiary;
            this.ctx.lineWidth = 3 * magnifierProgress;
            this.ctx.globalAlpha = magnifierProgress;
            
            // 添加放大镜边框发光效果
            if (this.glowEffects) {
                this.ctx.shadowColor = this.colors[this.theme].tertiary;
                this.ctx.shadowBlur = 10 * magnifierProgress;
            }
            
            this.ctx.stroke();
            
            // 绘制放大镜手柄
            this.ctx.beginPath();
            this.ctx.moveTo(
                magnifierX + Math.cos(handleAngle) * magnifierRadius,
                magnifierY + Math.sin(handleAngle) * magnifierRadius
            );
            this.ctx.lineTo(
                magnifierX + Math.cos(handleAngle) * (magnifierRadius + handleLength),
                magnifierY + Math.sin(handleAngle) * (magnifierRadius + handleLength)
            );
            
            this.ctx.strokeStyle = this.colors[this.theme].tertiary;
            this.ctx.lineWidth = 3 * magnifierProgress;
            this.ctx.stroke();
            
            // 重置阴影
            this.ctx.shadowBlur = 0;
        }
        
        // 添加动态扫描效果
        if (progress > 0.7) {
            const scanProgress = Math.min(1, (progress - 0.7) / 0.3);
            
            // 创建扫描线
            const scanY = -30 + 60 * ((performance.now() % 1500) / 1500);
            
            this.ctx.beginPath();
            this.ctx.moveTo(-width/2, scanY);
            this.ctx.lineTo(width/2, scanY);
            
            // 创建扫描线渐变
            const scanGradient = this.ctx.createLinearGradient(-width/2, scanY, width/2, scanY);
            scanGradient.addColorStop(0, 'transparent');
            scanGradient.addColorStop(0.1, this.colors[this.theme].tertiary);
            scanGradient.addColorStop(0.5, this.theme === 'dark' ? 'white' : this.colors[this.theme].tertiary);
            scanGradient.addColorStop(0.9, this.colors[this.theme].tertiary);
            scanGradient.addColorStop(1, 'transparent');
            
            this.ctx.strokeStyle = scanGradient;
            this.ctx.lineWidth = 1.5 * scanProgress;
            this.ctx.globalAlpha = 0.7 * scanProgress;
            
            this.ctx.stroke();
            
            // 添加发现结果标签
            if (progress > 0.85) {
                const resultProgress = Math.min(1, (progress - 0.85) / 0.15);
                
                // 创建结果标签
                this.ctx.beginPath();
                this.ctx.roundRect(-40, -height/2 + 15, 80, 20, [10]);
                this.ctx.fillStyle = this.colors[this.theme].tertiary;
                this.ctx.globalAlpha = resultProgress;
                
                // 添加标签发光效果
                if (this.glowEffects) {
                    this.ctx.shadowColor = this.colors[this.theme].tertiary;
                    this.ctx.shadowBlur = 10 * resultProgress;
                }
                
                this.ctx.fill();
                
                // 重置阴影
                this.ctx.shadowBlur = 0;
                
                // 添加标签文本
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.font = `bold ${11 * resultProgress}px -apple-system, sans-serif`;
                this.ctx.fillStyle = 'white';
                this.ctx.fillText('发现异常!', 0, -height/2 + 25);
            }
        }
        
        this.ctx.restore();
    }
}

// 导出动画类
window.LoginAnimation = LoginAnimation; 