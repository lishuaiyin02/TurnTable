export default class Main {
  constructor() {
    console.log('Main constructor started')
    
    // 直接使用 wx API 创建画布
    this.canvas = wx.createCanvas()
    this.ctx = this.canvas.getContext('2d')
    
    // 获取屏幕尺寸
    const { windowWidth, windowHeight } = wx.getSystemInfoSync()
    this.canvas.width = windowWidth
    this.canvas.height = windowHeight
    console.log('Canvas size:', windowWidth, windowHeight)
    this.centerX = windowWidth / 2
    this.centerY = windowHeight / 2
    this.radius = Math.min(windowWidth, windowHeight) * 0.4

    // 初始化转盘选项
    this.options = [
      { text: '再转一次', color: '#B088F9' },
      { text: '娱乐', color: '#5C7A7D' },
      { text: 'rap', color: '#5E9E63' },
      { text: '惩', color: '#9E8E5E' },
      { text: '唱', color: '#8B4513' }
    ]

    // 初始化状态
    this.isRotating = false
    const sliceAngle = 360 / this.options.length
    this.rotateAngle = -90 - (sliceAngle / 2)

    // 确保渲染上下文正确
    if (!this.ctx) {
      console.error('Failed to get canvas context')
      return
    }

    // 延迟一点时间后初始化游戏
    setTimeout(() => {
      this.init()
    }, 100)

    this.isSettingsPanelVisible = false;
    this.rotationDuration = 4; // 默认旋转时长为4秒

    // 设置项数据
    this.settingsItems = [
      { icon: '📤', text: '分享转盘', subtext: '邀请朋友一起玩转盘', hasArrow: true },
      { icon: '⏱️', text: '旋转时长', hasSpinner: true },
      { icon: '🔊', text: '语音播报', hasSwitch: true, inputValue: '情感女声-智瑜' },
      { icon: '📝', text: '抽取记录', hasArrow: true }
    ];
  }


  init() {
    console.log('Initializing game')
    // 绘制初始转盘
    this.drawWheel()
    // 绑定事件
    this.bindTouchEvents()
  }

  drawWheel() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 绘制白色背景
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制标题
    this.ctx.save()
    this.ctx.fillStyle = '#FF0000'
    this.ctx.font = `bold ${this.radius * 0.12}px Arial`
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText('转盘', this.centerX, this.centerY - this.radius - 40)
    this.ctx.restore()

    // 绘制设置按钮
    this.ctx.save()
    const settingX = 80  // 距离左边40px
    const settingY = this.canvas.height - 150  // 距离底部100px（在底部导航栏上方）
    const settingSize = 30  // 按钮大小

    // 绘制圆形背景
    this.ctx.beginPath()
    this.ctx.arc(settingX, settingY, settingSize/2, 0, Math.PI * 2)
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fill()

    // 绘制设置图标
    this.ctx.fillStyle = '#666666'
    this.ctx.font = '35px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.fillText('⚙️', settingX, settingY)
    this.ctx.restore()

    // 保存当前状态
    this.ctx.save()
    
    // 移动到转盘中心
    this.ctx.translate(this.centerX, this.centerY)
    
    // 保存移动到中心后的状态
    this.ctx.save()
    
    // 旋转转盘
    this.ctx.rotate(this.rotateAngle * Math.PI / 180)

    // 绘制扇形
    const sliceAngle = 360 / this.options.length
    this.options.forEach((option, index) => {
      const startAngle = (index * sliceAngle) * Math.PI / 180
      const endAngle = ((index + 1) * sliceAngle) * Math.PI / 180

      // 绘制扇形
      this.ctx.beginPath()
      this.ctx.moveTo(0, 0)
      this.ctx.arc(0, 0, this.radius, startAngle, endAngle)
      this.ctx.closePath()
      this.ctx.fillStyle = option.color
      this.ctx.fill()

      // 绘制文字
      this.ctx.save()
      const midAngle = (startAngle + endAngle) / 2
      const textX = Math.cos(midAngle) * (this.radius * 0.6)
      const textY = Math.sin(midAngle) * (this.radius * 0.6)
      
      this.ctx.translate(textX, textY)
      let rotationAngle = midAngle
      if (midAngle > Math.PI / 2 && midAngle <= 3 * Math.PI / 2) {
        rotationAngle += Math.PI
      }
      this.ctx.rotate(rotationAngle)
      
      this.ctx.fillStyle = '#ffffff'
      this.ctx.font = `bold ${this.radius * 0.1}px Arial`
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'middle'
      this.ctx.fillText(option.text, 0, 0)
      this.ctx.restore()
    })

    // 恢复到中心点状态
    this.ctx.restore()
    
    // 绘制中心按钮
    this.drawCenterButton()

    // 恢复到初始状态
    this.ctx.restore()

    // 在最后绘制底部导航栏
    this.drawTabBar()
  }

  drawCenterButton() {
    // 绘制外圈圆形
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.radius * 0.15, 0, Math.PI * 2)
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fill()
    this.ctx.strokeStyle = '#1E90FF'
    this.ctx.lineWidth = 2
    this.ctx.stroke()

    // 绘制内圈圆形
    this.ctx.beginPath()
    this.ctx.arc(0, 0, this.radius * 0.13, 0, Math.PI * 2)
    this.ctx.strokeStyle = '#1E90FF'
    this.ctx.stroke()

    // 绘制GO文字
    this.ctx.fillStyle = '#1E90FF'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.font = `bold ${this.radius * 0.08}px Arial`
    this.ctx.fillText('GO', 0, 0)

    // 绘制箭头
    const arrowSize = this.radius * 0.04
    this.ctx.beginPath()
    this.ctx.moveTo(0, -this.radius * 0.15 - arrowSize) // 箭头顶点
    this.ctx.lineTo(-arrowSize, -this.radius * 0.15) // 箭头左边
    this.ctx.lineTo(arrowSize, -this.radius * 0.15) // 箭头右边
    this.ctx.closePath()
    this.ctx.fillStyle = '#1E90FF'
    this.ctx.fill()
  }

  drawTabBar() {
    const tabHeight = 50
    const tabY = this.canvas.height - tabHeight
    
    // 绘制背景
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, tabY, this.canvas.width, tabHeight)
    
    // 绘制顶部边框
    this.ctx.beginPath()
    this.ctx.moveTo(0, tabY)
    this.ctx.lineTo(this.canvas.width, tabY)
    this.ctx.strokeStyle = '#eeeeee'
    this.ctx.stroke()

    // 定义tab项
    const tabs = [
        { text: '转盘', icon: '⏱️' },
        { text: '列表', icon: '📋' },
        { text: '百宝箱', icon: '🎁' }
    ]

    // 计算每个tab的宽度
    const tabWidth = this.canvas.width / tabs.length

    // 绘制每个tab
    tabs.forEach((tab, index) => {
        const x = tabWidth * index + tabWidth / 2
        const iconY = tabY + 12
        const textY = tabY + 35

        // 绘制图标
        this.ctx.font = '20px Arial'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText(tab.icon, x, iconY)

        // 绘制文字
        this.ctx.font = '12px Arial'
        this.ctx.fillStyle = index === (this.currentScene === 'wheel' ? 0 : this.currentScene === 'list' ? 1 : 2) ? '#1E90FF' : '#999999'
        this.ctx.fillText(tab.text, x, textY)
    })
  }

  bindTouchEvents() {
    wx.onTouchStart((e) => {
      const touch = e.touches[0];

      if (this.isSettingsPanelVisible) {
        const panelHeight = this.canvas.height * 0.5;
        const itemHeight = 60;
        const yStart = this.canvas.height - panelHeight;

        // 检测点击是否在面板区域外
        if (touch.clientY < yStart) {
          this.closeSettingsPanel();
          return;
        }

        // 检测加减按钮
        this.settingsItems.forEach((item, index) => {
          if (item.hasSpinner) {
            const y = yStart + index * itemHeight;
            if (touch.clientY > y && touch.clientY < y + itemHeight) {
              if (touch.clientX > this.canvas.width - 100 && touch.clientX < this.canvas.width - 80) {
                this.rotationDuration = Math.max(1, this.rotationDuration - 1); // 减少时长，最小为1秒
              } else if (touch.clientX > this.canvas.width - 40 && touch.clientX < this.canvas.width - 20) {
                this.rotationDuration = Math.min(10, this.rotationDuration + 1); // 增加时长，最大为10秒
              }
              this.drawSettingsPanel();
            }
          }
        });

        // 检测输入框
        if (touch.clientY > yStart + 1 * itemHeight && touch.clientY < yStart + 2 * itemHeight) {
          if (touch.clientX > this.canvas.width - 90 && touch.clientX < this.canvas.width - 50) {
            wx.showModal({
              title: '设置旋转时长',
              content: '请输入旋转时长（秒）',
              editable: true,
              placeholderText: `${this.rotationDuration}`,
              success: (res) => {
                if (res.confirm && res.content) {
                  const newDuration = parseInt(res.content);
                  if (!isNaN(newDuration) && newDuration >= 1 && newDuration <= 10) {
                    this.rotationDuration = newDuration;
                    this.drawSettingsPanel();
                  } else {
                    wx.showToast({ title: '请输入1到10之间的数字', icon: 'none' });
                  }
                }
              }
            });
          }
        }

        return;
      }

      // 检查是否点击了设置按钮
      const settingX = 80;
      const settingY = this.canvas.height - 150;
      const settingSize = 30;
      let dx = touch.clientX - settingX;
      let dy = touch.clientY - settingY;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= settingSize / 2) {
        console.log('Settings button clicked');
        this.showSettingsPanel();
        return;
      }

      // 检查是否点击了底部导航栏
      const tabHeight = 50
      const tabY = this.canvas.height - tabHeight

      if (touch.clientY >= tabY) {
          const tabWidth = this.canvas.width / 3
          const tabIndex = Math.floor(touch.clientX / tabWidth)
          
          switch(tabIndex) {
              case 0:
                  this.currentScene = 'wheel'
                  this.drawWheel()
                  break
              case 1:
                  this.currentScene = 'list'
                  this.drawList()
                  break
              case 2:
                  this.currentScene = 'treasure'
                  this.drawTreasure()
                  break
          }
          return
      }

      // 只有在转盘场景下才处理转盘相关的点击
      if (this.isRotating) return
      
      // 重用之前声明的变量
      dx = touch.clientX - this.centerX
      dy = touch.clientY - this.centerY
      distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance <= this.radius * 0.15) {
          this.startRotate()
      }
    })
  }

  showSettingsPanel() {
    this.isSettingsPanelVisible = true;
    this.drawSettingsPanel();
  }

  closeSettingsPanel() {
    this.isSettingsPanelVisible = false;
    this.drawWheel(); // 重新绘制主界面
  }

  drawSettingsPanel() {
    if (!this.isSettingsPanelVisible) return;

    // 重新绘制转盘背景
    this.drawWheel();

    const ctx = this.ctx;
    const canvas = this.canvas;

    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制白色面板
    const panelHeight = canvas.height * 0.5;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, canvas.height - panelHeight, canvas.width, panelHeight);

    // 绘制设置项
    this.settingsItems.forEach((item, index) => {
        const itemHeight = 60;
        const y = canvas.height - panelHeight + index * itemHeight;
        const padding = 20;

        // 绘制背景
        ctx.fillStyle = '#f5f5f5';
        ctx.fillRect(0, y, canvas.width, itemHeight);

        // 绘制图标
        ctx.font = '24px Arial';
        ctx.fillStyle = '#1E90FF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.icon, padding, y + itemHeight / 2);

        // 绘制主文本
        ctx.font = '16px Arial';
        ctx.fillStyle = '#333333';
        ctx.fillText(item.text, padding + 40, y + itemHeight / 2);

        // 绘制右侧内容
        if (item.hasArrow) {
            ctx.fillText('>', canvas.width - padding, y + itemHeight / 2);
        } else if (item.hasSwitch) {
            // 绘制开关
            const switchWidth = 50;
            const switchHeight = 30;
            const switchX = canvas.width - switchWidth - padding;
            const switchY = y + (itemHeight - switchHeight) / 2;

            ctx.fillStyle = '#1E90FF';
            ctx.beginPath();
            ctx.arc(switchX + switchHeight / 2, switchY + switchHeight / 2, switchHeight / 2, Math.PI / 2, 3 * Math.PI / 2);
            ctx.arc(switchX + switchWidth - switchHeight / 2, switchY + switchHeight / 2, switchHeight / 2, 3 * Math.PI / 2, Math.PI / 2);
            ctx.closePath();
            ctx.fill();

            // 绘制开关滑块
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(switchX + switchWidth - switchHeight / 2, switchY + switchHeight / 2, switchHeight / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.hasSpinner) {
            // 绘制加减按钮和数值
            ctx.fillStyle = '#1E90FF';
            ctx.fillText('-', canvas.width - 100, y + itemHeight / 2);
            ctx.fillText('+', canvas.width - 40, y + itemHeight / 2);

            // 绘制输入框
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(canvas.width - 90, y + 10, 40, itemHeight - 20);
            ctx.fillStyle = '#333333';
            ctx.fillText(`${this.rotationDuration}`, canvas.width - 70, y + itemHeight / 2);
        }

        // 绘制输入框（如果有）
        if (item.inputValue) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(canvas.width - 200 - padding, y + 10, 200, itemHeight - 20);
            ctx.fillStyle = '#333333';
            ctx.fillText(item.inputValue, canvas.width - 190, y + itemHeight / 2);
        }
    });
  }

  // 单独处理分享功能
  handleShare() {
    wx.showModal({
        title: '分享转盘',
        content: '复制链接邀请朋友：\nhttps://example.com/wheel',
        confirmText: '复制链接',
        success: (res) => {
            if (res.confirm) {
                wx.setClipboardData({
                    data: 'https://example.com/wheel',
                    success: () => {
                        wx.showToast({ title: '链接已复制' });
                    }
                });
            }
        }
    });
  }

  // 添加一个辅助方法来处理开关类型的设置
  toggleSetting(title, content) {
    wx.showModal({
        title: title,
        content: content,
        confirmText: '开启',
        cancelText: '关闭',
        success: (res) => {
            if (res.confirm) {
                console.log(`${title}已开启`);
                if (title === '震动') {
                    wx.vibrateShort({ type: 'medium' });
                }
            } else {
                console.log(`${title}已关闭`);
            }
        }
    });
  }

  getRandomColor() {
    const colors = [
        '#B088F9', '#5C7A7D', '#5E9E63', 
        '#9E8E5E', '#8B4513', '#4169E1',
        '#8B008B', '#556B2F', '#8B0000'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  startRotate() {
    if (this.isRotating) return; // 防止重复启动旋转
    this.isRotating = true;

    // 随机选择一个选项
    const targetIndex = Math.floor(Math.random() * this.options.length);
    const sliceAngle = 360 / this.options.length;
    
    // 计算目标角度
    const baseRotation = 360 * 5; // 基础旋转5圈
    const extraRotation = 360 * (this.rotationDuration - 1); // 根据旋转时长增加额外圈数
    const baseAngle = -90 - (targetIndex * sliceAngle) - (sliceAngle / 2);
    const targetAngle = baseRotation + extraRotation + baseAngle;

    // 保存目标索引
    this.targetIndex = targetIndex;

    this.rotateAnimation(targetAngle);
  }

  rotateAnimation(targetAngle) {
    const duration = this.rotationDuration * 1000; // 将秒转换为毫秒
    const startAngle = this.rotateAngle;
    const changeInAngle = targetAngle - startAngle;
    const startTime = Date.now();

    const animate = () => {
        const currentTime = Date.now();
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        // 使用缓动函数
        this.rotateAngle = this.easeOutCubic(timeElapsed, startAngle, changeInAngle, duration);
        this.drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            this.isRotating = false;
            // 重置角度到基础位置
            this.rotateAngle = this.rotateAngle % 360;
            this.onRotationEnd();
        }
    };

    animate();
  }

  easeOutCubic(t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  }

  onRotationEnd() {
    wx.showToast({
      title: `结果：${this.options[this.targetIndex].text}`,
      icon: 'none'
    });
  }

  // 添加/编辑选项
  updateOptions(options) {
    this.options = options
    this.drawWheel()
  }

  drawList() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 绘制白色背景
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制顶部标题栏
    const titleBarHeight = 80  // 增加标题栏高度
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, titleBarHeight)
    this.ctx.fillStyle = '#000000'
    this.ctx.font = 'bold 18px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('转盘', this.canvas.width / 2, 60)  // 将标题下移到60

    // 绘制顶部选项卡
    const tabWidth = this.canvas.width / 2
    this.ctx.font = '16px Arial'
    
    // 热门转盘
    this.ctx.fillStyle = '#1E90FF'
    this.ctx.fillText('热门转盘', tabWidth / 2, 120)  // 向下移动到120
    this.ctx.fillRect(tabWidth / 2 - 30, 130, 60, 2)  // 向下移动到130
    
    // 我的转盘
    this.ctx.fillStyle = '#999999'
    this.ctx.fillText('我的转盘', tabWidth * 1.5, 120)  // 向下移动到120

    // 绘制列表项
    const items = [
        { icon: '👆', text: '自定义转盘' },
        { icon: '🥣', text: '吃什么早餐' },
        { icon: '👍', text: '大冒险转盘' },
        { icon: '💭', text: '真心话转盘' },
        { icon: '❓', text: '真心话与大冒险' },
        { icon: '🎮', text: '峡谷64游戏转盘' },
        { icon: '🔢', text: '选数字转盘' },
        { icon: '🌍', text: '去哪玩转盘' },
        { icon: '🍚', text: '吃什么转盘' },
        { icon: '💰', text: '谁买单转盘' }
    ]

    items.forEach((item, index) => {
        const y = 160 + index * 60  // 调整起始位置到160
        
        // 绘制背景
        this.ctx.fillStyle = '#f5f5f5'
        this.ctx.fillRect(15, y, this.canvas.width - 30, 50)
        
        // 绘制图标和文字
        this.ctx.fillStyle = '#000000'
        this.ctx.textAlign = 'left'
        this.ctx.font = '20px Arial'
        this.ctx.fillText(item.icon, 30, y + 30)
        this.ctx.font = '16px Arial'
        this.ctx.fillText(item.text, 70, y + 30)
        
        // 绘制收藏星标
        this.ctx.fillStyle = '#1E90FF'
        this.ctx.font = '20px Arial'
        this.ctx.textAlign = 'right'
        this.ctx.fillText('⭐', this.canvas.width - 30, y + 30)
    })

    // 绘制底部导航栏
    this.drawTabBar()
  }

  drawTreasure() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    
    // 绘制白色背景
    this.ctx.fillStyle = '#ffffff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制顶部标题
    this.ctx.fillStyle = '#000000'
    this.ctx.font = 'bold 18px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('百宝箱', this.canvas.width / 2, 30)

    // 绘制内容（示例）
    this.ctx.fillStyle = '#666666'
    this.ctx.font = '16px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('敬请期待...', this.canvas.width / 2, this.canvas.height / 2)

    // 绘制底部导航栏
    this.drawTabBar()
  }
}
