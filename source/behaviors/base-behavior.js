module.exports = Behavior({
  data: {
    navHeight: 44,
    statusBarHeight: 20
  },

  attached() {
    this.setNavHeight();
  },

  methods: {
    setNavHeight() {
      const app = getApp();
      
      if (app.globalData && app.globalData.navHeight && app.globalData.statusBarHeight) {
        this.setData({
          navHeight: app.globalData.navHeight,
          statusBarHeight: app.globalData.statusBarHeight
        });
      } else {
        const systemInfo = wx.getSystemInfoSync();
        const navHeight = 44 + systemInfo.statusBarHeight;
        
        
        if (app.globalData) {
          app.globalData.navHeight = navHeight;
          app.globalData.statusBarHeight = systemInfo.statusBarHeight;
        }

        this.setData({
          statusBarHeight: systemInfo.statusBarHeight,
          navHeight: navHeight
        });
      }
    },
    
    
    handleBack() {
      wx.navigateBack();
    }
  }
});
