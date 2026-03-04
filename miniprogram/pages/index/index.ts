// index.ts
Page({
  data: {
    markers: [
      {
        id: 1,
        latitude: 40.4345526,
        longitude: -3.7168796,
        title: "COLIZEUM MADRID",
        iconPath: "/images/logo.png",
        width: 30,
        height: 30,
      },
    ],
  },

  openWebview() {
    const url = encodeURIComponent('https://mp.weixin.qq.com/s/36gc5HbxAq6XiOs95KWSYw');
    wx.navigateTo({
      url: `/pages/webview/index?url=${url}`,
    });
  },

  openLocation() {
    wx.openLocation({
      latitude: 40.4345526,
      longitude: -3.7168796,
      name: "COLIZEUM MADRID",
      address: "Calle de Fernando el Católico 84 Bajo, 28015 Madrid",
      scale: 16,
    });
  },

  onLoad() {},
});
