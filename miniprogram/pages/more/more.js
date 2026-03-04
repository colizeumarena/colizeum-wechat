// more.js
Page({
  data: {},

  onLoad() {},

  openWebview() {
    const url = encodeURIComponent(
      "https://mp.weixin.qq.com/s/36gc5HbxAq6XiOs95KWSYw",
    );
    wx.navigateTo({
      url: `/pages/webview/index?url=${url}`,
    });
  },

  copySocialHandle(e) {
    const handle = e.currentTarget.dataset.handle;
    wx.setClipboardData({
      data: handle,
      success: () => {
        wx.showToast({
          title: "已复制",
          icon: "success",
        });
      },
    });
  },

  // Call phone
  callPhone() {
    wx.makePhoneCall({
      phoneNumber: "+34624075035",
    });
  },
});
