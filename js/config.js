export default class Config {
  constructor(main) {
    this.main = main
    this.isVisible = false
    this.initUI()
  }

  initUI() {
    // 创建配置按钮
    const configBtn = wx.createUserInfoButton({
      type: 'image',
      image: 'images/settings.png',
      style: {
        left: 10,
        top: 10,
        width: 40,
        height: 40
      }
    })

    configBtn.onTap(() => {
      this.showConfigPanel()
    })
  }

  showConfigPanel() {
    wx.showModal({
      title: '编辑转盘选项',
      content: '请输入选项，用逗号分隔',
      editable: true,
      placeholderText: '选项1,选项2,选项3',
      success: (res) => {
        if (res.confirm && res.content) {
          const options = res.content.split(',').map((text, index) => ({
            text: text.trim(),
            color: this.getRandomColor()
          }))
          this.main.updateOptions(options)
        }
      }
    })
  }

  getRandomColor() {
    const colors = [
      '#B088F9', '#5C7A7D', '#5E9E63', 
      '#9E8E5E', '#8B4513', '#4169E1',
      '#8B008B', '#556B2F', '#8B0000'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }
} 