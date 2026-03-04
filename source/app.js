
const authService = require('./services/auth-service');

App({
  onLaunch() {
    
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    
    this.checkAuthStatus();
  },

  checkAuthStatus() {
    const token = wx.getStorageSync(authService.STORAGE_KEYS.token);
    if (!token) {
      return;
    }

    authService.authCheck()
      .catch(() => {
        
        authService.clearAuth();
      });
  },

  globalData: {
    userInfo: null,
    lang: 'zh' 
  }
})
