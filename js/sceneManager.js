export default class SceneManager {
  constructor(canvas, ctx, mainGame) {
    console.log('SceneManager constructor started')
    this.canvas = canvas
    this.ctx = ctx
    this.mainGame = mainGame
    this.currentScene = 'wheel'
    
    // 立即进行一次渲染
    this.render()
  }

  update(deltaTime) {
    // 更新逻辑
    if (this.currentScene === 'wheel' && this.mainGame.isRotating) {
      this.needsRender = true
    }
  }

  switchScene(sceneName) {
    this.currentScene = sceneName
    this.needsRender = true  // 切换场景时需要重新渲染
  }

  render() {
    console.log('Rendering scene:', this.currentScene)
    if (!this.ctx) {
      console.error('Context is null in render')
      return
    }

    switch(this.currentScene) {
      case 'wheel':
        this.mainGame.drawWheel()
        break
      default:
        // 默认显示白色背景
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
        break
    }
  }

  renderListScene() {
    // 绘制列表场景
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制标题
    this.ctx.fillStyle = '#333'
    this.ctx.font = 'bold 20px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('转盘列表', this.canvas.width / 2, 40)

    // 绘制选项列表
    const wheels = [
      { icon: '👆', title: '自定义转盘' },
      { icon: '🍳', title: '吃什么早餐' },
      { icon: '👍', title: '大冒险转盘' },
      { icon: '💭', title: '真心话转盘' },
      { icon: '❓', title: '真心话与大冒险' },
      { icon: '🎮', title: '峡谷64游戏转盘' },
      { icon: '🔢', title: '选数字转盘' },
      { icon: '🌍', title: '去哪玩转盘' },
      { icon: '🍽️', title: '吃什么转盘' },
      { icon: '💰', title: '谁买单转盘' }
    ]

    wheels.forEach((wheel, index) => {
      const y = 100 + index * 60
      
      // 绘制列表项背景
      this.ctx.fillStyle = '#fff'
      this.ctx.fillRect(20, y, this.canvas.width - 40, 50)
      
      // 绘制图标和标题
      this.ctx.fillStyle = '#333'
      this.ctx.textAlign = 'left'
      this.ctx.font = '20px Arial'
      this.ctx.fillText(wheel.icon, 40, y + 30)
      this.ctx.font = '16px Arial'
      this.ctx.fillText(wheel.title, 80, y + 30)
    })

    // 绘制底部导航栏
    this.drawTabBar('list')
  }

  renderTreasureScene() {
    // 绘制百宝箱场景
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // 绘制标题
    this.ctx.fillStyle = '#333'
    this.ctx.font = 'bold 20px Arial'
    this.ctx.textAlign = 'center'
    this.ctx.fillText('百宝箱', this.canvas.width / 2, 40)

    // 绘制底部导航栏
    this.drawTabBar('treasure')
  }

  drawTabBar(activeTab) {
    const tabHeight = 50
    const tabY = this.canvas.height - tabHeight
    
    // 绘制背景和边框
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, tabY, this.canvas.width, tabHeight)
    this.ctx.strokeStyle = '#eee'
    this.ctx.beginPath()
    this.ctx.moveTo(0, tabY)
    this.ctx.lineTo(this.canvas.width, tabY)
    this.ctx.stroke()

    // 绘制选项
    const tabs = [
      { id: 'wheel', icon: '⏱️', text: '转盘' },
      { id: 'list', icon: '📋', text: '列表' },
      { id: 'treasure', icon: '🎁', text: '百宝箱' }
    ]

    const tabWidth = this.canvas.width / tabs.length
    tabs.forEach((tab, index) => {
      const x = tabWidth * index + tabWidth / 2
      this.ctx.textAlign = 'center'
      this.ctx.fillStyle = tab.id === activeTab ? '#1E90FF' : '#999'
      this.ctx.font = '20px Arial'
      this.ctx.fillText(tab.icon, x, tabY + 20)
      this.ctx.font = '12px Arial'
      this.ctx.fillText(tab.text, x, tabY + 40)
    })
  }
} 