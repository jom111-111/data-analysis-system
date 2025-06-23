// 通知系统功能

// 全局变量
let notifications = [];
let unreadCount = 0;
let closeTimeout = null; // 添加关闭计时器变量
let lastNotificationCount = 0; // 添加上次通知数量变量

// 当DOM加载完成后初始化通知系统
document.addEventListener('DOMContentLoaded', function() {
    // 加载用户通知
    loadUserNotifications(false);
    
    // 设置自动刷新（每10秒钟）
    setInterval(() => loadUserNotifications(false), 10 * 1000);
    
    // 绑定事件处理程序
    const notificationButton = document.getElementById('notification-button');
    const closeButton = document.getElementById('close-notification-panel');
    const markAllReadButton = document.getElementById('mark-all-read');
    const refreshButton = document.getElementById('refresh-notifications');
    const notificationPanel = document.getElementById('notification-panel');
    
    if (notificationButton && notificationPanel) {
        // 添加鼠标悬停事件监听
        notificationButton.addEventListener('mouseenter', function() {
            // 清除可能存在的关闭计时器
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            notificationPanel.classList.add('active');
            
            // 添加抖动动画效果
            notificationPanel.style.animation = 'none';
            setTimeout(() => {
                notificationPanel.style.animation = 'panelFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
            }, 10);
        });
        
        // 保留原有的点击切换功能
        notificationButton.addEventListener('click', toggleNotificationPanel);
        
        // 为通知面板添加鼠标进入事件，清除关闭计时器
        notificationPanel.addEventListener('mouseenter', function() {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
        });
        
        // 为通知面板添加鼠标离开事件
        const notificationWrapper = document.querySelector('.notification-wrapper');
        if (notificationWrapper) {
            notificationWrapper.addEventListener('mouseleave', function() {
                // 延迟关闭面板，给用户足够时间移动到面板
                closeTimeout = setTimeout(function() {
                    notificationPanel.classList.remove('active');
                }, 300); // 300毫秒延迟，与设置菜单一致
            });
        }
    }
    
    if (closeButton) {
        closeButton.addEventListener('click', toggleNotificationPanel);
    }
    
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', markAllNotificationsRead);
    }
    
    if (refreshButton) {
        refreshButton.addEventListener('click', () => loadUserNotifications(true));
    }
    
    // 点击面板外部关闭通知面板
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('notification-panel');
        const button = document.getElementById('notification-button');
        
        if (panel && panel.classList.contains('active') && 
            !panel.contains(event.target) && 
            !button.contains(event.target)) {
            panel.classList.remove('active');
        }
    });
});

// 加载用户通知
function loadUserNotifications(isManualRefresh = false) {
    fetch('/api/user/notifications')
        .then(response => {
            if (!response.ok) {
                throw new Error('获取通知失败');
            }
            return response.json();
        })
        .then(data => {
            const oldNotifications = notifications;
            notifications = data.notifications || [];
            const oldUnreadCount = unreadCount;
            unreadCount = data.unread_count || 0;
            
            updateNotificationBadge();
            renderNotificationList();
            
            // 手动刷新时显示成功提示
            if (isManualRefresh) {
                showToast('通知已更新', 'success');
                return;
            }
            
            // 自动刷新且有新通知时显示提示
            if (unreadCount > oldUnreadCount) {
                // 有新通知，播放提醒动画
                const badge = document.getElementById('notification-badge');
                if (badge) {
                    badge.classList.add('pulse-animation');
                    setTimeout(() => {
                        badge.classList.remove('pulse-animation');
                    }, 2000);
                }
                
                const button = document.getElementById('notification-button');
                if (button) {
                    button.classList.add('shake-animation');
                    setTimeout(() => {
                        button.classList.remove('shake-animation');
                    }, 1000);
                }
                
                // 显示新通知提示
                showToast(`您有 ${unreadCount - oldUnreadCount} 条新通知`, 'info');
            }
        })
        .catch(error => {
            console.error('加载通知时出错:', error);
            showToast('加载通知失败', 'error');
        });
}

// 更新通知徽章
function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// 切换通知面板显示状态
function toggleNotificationPanel() {
    const panel = document.getElementById('notification-panel');
    if (panel) {
        panel.classList.toggle('active');
    }
}

// 渲染通知列表
function renderNotificationList() {
    const listElement = document.getElementById('notification-list');
    if (!listElement) return;
    
    // 清空当前列表
    listElement.innerHTML = '';
    
    // 如果没有通知
    if (notifications.length === 0) {
        listElement.innerHTML = '<div class="empty-notifications">暂无通知</div>';
        return;
    }
    
    // 渲染每个通知
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item';
        // 添加data-notification-id属性，用于删除功能
        notificationItem.setAttribute('data-notification-id', notification.id);
        
        if (!notification.read) {
            notificationItem.classList.add('unread');
        }
        notificationItem.classList.add(`type-${notification.type}`);
        
        // 根据通知类型设置不同的图标
        let iconClass = 'ri-information-line';
        let iconColorClass = 'info';
        switch (notification.type) {
            case 'success':
                iconClass = 'ri-check-line';
                iconColorClass = 'success';
                break;
            case 'warning':
                iconClass = 'ri-error-warning-line';
                iconColorClass = 'warning';
                break;
            case 'error':
                iconClass = 'ri-close-circle-line';
                iconColorClass = 'error';
                break;
            case 'maintenance':
                iconClass = 'ri-tools-line';
                iconColorClass = 'maintenance';
                break;
            case 'update':
                iconClass = 'ri-refresh-line';
                iconColorClass = 'update';
                break;
            case 'info':
            default:
                iconClass = 'ri-information-line';
                iconColorClass = 'info';
        }
        
        // 格式化时间
        const notificationDate = new Date(notification.created_at);
        const formattedDate = formatDate(notificationDate);
        
        // 处理通知消息中可能包含的动画效果
        let processedMessage = notification.message;
        
        // 使用内联样式，默认隐藏删除按钮，颜色更浅
        notificationItem.innerHTML = `
            <div class="notification-icon type-${iconColorClass}">
                <i class="${iconClass}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    ${notification.title}
                    <span class="notification-type ${iconColorClass}">${getTypeLabel(notification.type)}</span>
                </div>
                <div class="notification-message">${processedMessage}</div>
                <div class="notification-time">${formattedDate}</div>
            </div>
            <div class="notification-delete-button" title="删除通知" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); width:28px; height:28px; border-radius:50%; background-color:rgba(255,69,58,0.1); display:flex; justify-content:center; align-items:center; cursor:pointer; z-index:10; opacity:0; transition:opacity 0.3s ease;">
                <i class="ri-delete-bin-line" style="color:#ff453a; font-size:16px;"></i>
            </div>
        `;
        
        // 添加鼠标悬停事件，显示删除按钮
        notificationItem.addEventListener('mouseenter', function() {
            const deleteButton = this.querySelector('.notification-delete-button');
            if (deleteButton) {
                deleteButton.style.opacity = '1';
            }
        });
        
        // 添加鼠标离开事件，隐藏删除按钮
        notificationItem.addEventListener('mouseleave', function() {
            const deleteButton = this.querySelector('.notification-delete-button');
            if (deleteButton) {
                deleteButton.style.opacity = '0';
            }
        });
        
        // 添加点击事件以查看详情，但不包括删除按钮区域
        notificationItem.addEventListener('click', function(e) {
            // 如果点击的是删除按钮，不触发查看详情
            if (e.target.closest('.notification-delete-button')) {
                return;
            }
            
            // 调用详情查看函数
            viewNotificationDetail(notification.id);
        });
        
        // 为删除按钮添加专门的点击事件
        const deleteButton = notificationItem.querySelector('.notification-delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡，避免触发通知点击事件
                e.preventDefault();
                
                // 显示删除确认对话框
                showDeleteConfirmDialog(notificationItem);
            });
        }
        
        listElement.appendChild(notificationItem);
    });
}

// 根据通知类型获取显示名称
function getTypeLabel(type) {
    switch (type) {
        case 'success':
            return '成功';
        case 'warning':
            return '警告';
        case 'error':
            return '错误';
        case 'maintenance':
            return '维护';
        case 'update':
            return '更新';
        case 'info':
        default:
            return '信息';
    }
}

// 查看通知详情
function viewNotificationDetail(notificationId) {
    // 标记该通知为已读
    markNotificationAsRead(notificationId);
    
    // 查找通知
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;
    
    // 如果通知有链接，则跳转
    if (notification.link) {
        window.location.href = notification.link;
        return;
    }
    
    // 否则显示通知详情模态框
    // 创建模态框元素（如果不存在）
    let modal = document.getElementById('notification-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'notification-modal';
        modal.className = 'notification-modal';
        document.body.appendChild(modal);
    }
    
    // 格式化时间
    const notificationDate = new Date(notification.created_at);
    const formattedDate = formatDate(notificationDate);
    
    // 根据通知类型设置不同的图标和颜色
    let iconClass = 'ri-information-line';
    let typeColorClass = 'info';
    switch (notification.type) {
        case 'success':
            iconClass = 'ri-check-line';
            typeColorClass = 'success';
            break;
        case 'warning':
            iconClass = 'ri-error-warning-line';
            typeColorClass = 'warning';
            break;
        case 'error':
            iconClass = 'ri-close-circle-line';
            typeColorClass = 'error';
            break;
        case 'maintenance':
            iconClass = 'ri-tools-line';
            typeColorClass = 'maintenance';
            break;
        case 'update':
            iconClass = 'ri-refresh-line';
            typeColorClass = 'update';
            break;
        case 'info':
        default:
            iconClass = 'ri-information-line';
            typeColorClass = 'info';
    }
    
    // 设置模态框内容 - 保留原始HTML以支持动画效果
    modal.innerHTML = `
        <div class="notification-modal-content">
            <div class="notification-modal-header notification-type-${typeColorClass}">
                <div class="notification-modal-title">
                    <div class="notification-modal-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <h3>${notification.title}</h3>
                </div>
                <button class="close-modal"><i class="ri-close-line"></i></button>
            </div>
            <div class="notification-modal-body">
                <div class="notification-modal-message">${notification.message}</div>
                <div class="notification-modal-time">
                    <i class="ri-time-line"></i> ${formattedDate}
                </div>
            </div>
            <div class="notification-modal-footer">
                <button class="modal-action-button" id="modal-close-button">关闭</button>
                ${notification.target ? `<button class="modal-action-button primary" id="modal-action-button">查看详情</button>` : ''}
            </div>
        </div>
    `;
    
    // 以淡入效果显示模态框
    modal.style.display = 'flex';
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // 添加关闭模态框的事件
    const closeButton = modal.querySelector('.close-modal');
    const modalCloseButton = modal.querySelector('#modal-close-button');
    const actionButton = modal.querySelector('#modal-action-button');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);
    }
    
    if (actionButton && notification.target) {
        actionButton.addEventListener('click', () => {
            closeModal();
            if (notification.target) {
                window.location.href = notification.target;
            }
        });
    }
    
    // 点击模态框外部关闭模态框
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // 关闭模态框函数
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // 添加按键监听 - ESC键关闭模态框
    const escKeyHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escKeyHandler);
        }
    };
    document.addEventListener('keydown', escKeyHandler);
}

// 标记通知为已读
function markNotificationAsRead(notificationId) {
    // 找到通知对象
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.read) return;
    
    // 发送请求到服务器标记为已读
    fetch(`/api/user/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('标记通知为已读失败');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 更新本地通知状态
            notification.read = true;
            unreadCount = Math.max(0, unreadCount - 1);
            
            // 更新UI
            updateNotificationBadge();
            renderNotificationList();
        }
    })
    .catch(error => {
        console.error('标记通知为已读时出错:', error);
        showToast('标记通知为已读失败', 'error');
    });
}

// 标记所有通知为已读
function markAllNotificationsRead() {
    // 如果没有未读通知，则不执行任何操作
    if (unreadCount === 0) return;
    
    // 发送请求到服务器标记所有通知为已读
    fetch('/api/user/notifications/read-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('标记所有通知为已读失败');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 更新所有通知为已读
            notifications.forEach(notification => {
                notification.read = true;
            });
            
            // 重置未读计数
            unreadCount = 0;
            
            // 更新UI
            updateNotificationBadge();
            renderNotificationList();
            
            // 显示成功提示
            showToast('所有通知已标记为已读', 'success');
        }
    })
    .catch(error => {
        console.error('标记所有通知为已读时出错:', error);
        showToast('标记所有通知为已读失败', 'error');
    });
}

// 格式化日期
function formatDate(date) {
    if (!date || date === 'undefined') {
        // console.log('无效日期:', date);
        return '未知时间';
    }
    
    try {
        // 创建日期对象，将SQLite时间格式转换为JS Date对象
        const messageDate = new Date(date);
        
        // 检查日期是否有效
        if (isNaN(messageDate.getTime())) {
            // console.log('无效日期格式:', date);
            return '未知时间';
        }
        
        // 为中国时区调整小时显示，加8小时
        // 创建新日期对象避免修改原始日期
        const adjustedDate = new Date(messageDate.getTime());
        adjustedDate.setHours(adjustedDate.getHours() + 8);
        
        const now = new Date();
        
        const diff = now - adjustedDate;
        const dayInMs = 24 * 60 * 60 * 1000;
        
        // 一小时内显示"刚刚"或"x分钟前"
        if (diff < 60 * 60 * 1000) {
            const minutes = Math.floor(diff / (60 * 1000));
            return minutes <= 5 ? '刚刚' : `${minutes}分钟前`;
        }
        
        // 比较年月日
        const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const messageDateDay = new Date(adjustedDate.getFullYear(), adjustedDate.getMonth(), adjustedDate.getDate());
        const dateDiff = (nowDate - messageDateDay) / dayInMs;
        
        // 获取调整后的小时和分钟
        const hours = adjustedDate.getHours();
        const minutes = adjustedDate.getMinutes();
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        
        // 今天内显示"今天 HH:MM"
        if (dateDiff < 1) {
            return `今天 ${timeStr}`;
        }
        // 昨天显示"昨天 HH:MM"
        else if (dateDiff < 2) {
            return `昨天 ${timeStr}`;
        }
        // 一周内显示"周几 HH:MM"
        else if (dateDiff < 7) {
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            return `${weekdays[adjustedDate.getDay()]} ${timeStr}`;
        }
        // 其他显示完整日期时间
        else {
            return `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')} ${timeStr}`;
        }
    } catch (error) {
        console.error('格式化日期时出错:', error, date);
        return '日期错误';
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    // 检查是否存在toast容器
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'close-circle-line' : 'information-line'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加到容器
    toastContainer.appendChild(toast);
    
    // 添加显示class
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// 显示删除确认对话框
function showDeleteConfirmDialog(notificationItem) {
    // 创建确认对话框，如果不存在
    let confirmDialog = document.getElementById('notification-confirm-dialog');
    if (!confirmDialog) {
        confirmDialog = document.createElement('div');
        confirmDialog.id = 'notification-confirm-dialog';
        confirmDialog.className = 'confirm-dialog';
        confirmDialog.innerHTML = `
            <div class="confirm-dialog-content">
                <div class="confirm-dialog-title">确认删除</div>
                <div class="confirm-dialog-message">您确定要删除这条通知吗？此操作无法撤销。</div>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-dialog-button cancel">取消</button>
                    <button class="confirm-dialog-button confirm">删除</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmDialog);
    }
    
    // 显示确认对话框
    confirmDialog.classList.add('active');
    
    // 获取通知ID
    const notificationId = notificationItem.getAttribute('data-notification-id');
    
    // 绑定确认对话框按钮事件
    const cancelButton = confirmDialog.querySelector('.cancel');
    const confirmButton = confirmDialog.querySelector('.confirm');
    
    // 移除可能存在的旧事件处理器
    const newCancelButton = cancelButton.cloneNode(true);
    const newConfirmButton = confirmButton.cloneNode(true);
    cancelButton.parentNode.replaceChild(newCancelButton, cancelButton);
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton);
    
    // 添加新的事件处理器
    newCancelButton.addEventListener('click', function() {
        confirmDialog.classList.remove('active');
    });
    
    newConfirmButton.addEventListener('click', function() {
        deleteNotification(notificationId, notificationItem, confirmDialog);
    });
}

// 删除通知
function deleteNotification(notificationId, notificationItem, confirmDialog) {
    if (!notificationId) {
        console.error('通知ID不存在');
        return;
    }
    
    // 发送删除请求到服务器
    fetch(`/api/user/notifications/${notificationId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('删除通知失败');
        }
        return response.json();
    })
    .then(data => {
        // 隐藏确认对话框
        confirmDialog.classList.remove('active');
        
        if (data.success) {
            // 添加删除动画
            notificationItem.style.height = notificationItem.offsetHeight + 'px';
            notificationItem.style.opacity = '0';
            notificationItem.style.marginTop = '-' + notificationItem.offsetHeight + 'px';
            
            // 删除元素
            setTimeout(() => {
                notificationItem.remove();
                
                // 如果删除后通知列表为空，显示空通知提示
                const notificationList = document.getElementById('notification-list');
                if (notificationList && notificationList.querySelectorAll('.notification-item').length === 0) {
                    notificationList.innerHTML = '<div class="empty-notifications">暂无通知</div>';
                }
                
                // 更新本地通知数据
                const index = notifications.findIndex(n => n.id === parseInt(notificationId) || n.id === notificationId);
                if (index !== -1) {
                    // 如果是未读通知，减少未读计数
                    if (!notifications[index].read) {
                        unreadCount = Math.max(0, unreadCount - 1);
                    }
                    // 从数组中移除通知
                    notifications.splice(index, 1);
                }
                
                // 更新通知徽章
                updateNotificationBadge();
            }, 300);
            
            showToast('通知已删除', 'success');
        } else {
            showToast(data.message || '删除通知失败', 'error');
        }
    })
    .catch(error => {
        // 隐藏确认对话框
        confirmDialog.classList.remove('active');
        
        console.error('删除通知错误:', error);
        showToast('删除通知失败', 'error');
    });
} 