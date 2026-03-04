Component({
  properties: {
    // 基础内容
    title: {
      type: String,
      value: ''
    },
    desc: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    
    // 样式控制
    size: {
      type: String,
      value: 'normal' // normal, small, large
    },
    border: {
      type: Boolean,
      value: true
    },
    card: {
      type: Boolean,
      value: false // 是否为卡片样式 (用于 contract-card)
    },
    active: {
      type: Boolean,
      value: false // 是否激活 (用于 contract-card)
    },
    
    // 交互行为
    isLink: {
      type: Boolean,
      value: false
    },
    url: {
      type: String,
      value: ''
    },
    openType: {
      type: String,
      value: ''
    },
    copyable: {
      type: Boolean,
      value: false
    },
    
    // 加载状态
    loading: {
      type: Boolean,
      value: false
    },
    skeletonWidth: {
      type: String,
      value: '60%'
    },
    
    // 图标颜色
    iconColor: {
      type: String,
      value: '#1E293B'
    }
  },

  methods: {
    handleTap(e) {
      if (this.data.loading) return;
      
      const { url, copyable, value, openType } = this.data;
      
      // 复制功能
      if (copyable && value) {
        wx.setClipboardData({
          data: value,
          success: () => {
            wx.showToast({
              title: 'Copied',
              icon: 'none'
            });
          }
        });
        return;
      }
      
      // 页面跳转
      if (url) {
        wx.navigateTo({ url });
        return;
      }
      
      // 触发点击事件 (如果有 openType，则由 button 处理)
      if (!openType) {
        this.triggerEvent('click', e.detail);
        this.triggerEvent('tap', e.detail); // 兼容 tap
      }
    }
  }
});
