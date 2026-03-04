const i18n = require('../../utils/i18n.js');
const baseBehavior = require('../../behaviors/base-behavior.js');
const app = getApp();

Page({
  behaviors: [baseBehavior],
  data: {
    lang: 'zh',
    i18n: {},
    values: []
  },

  onLoad() {
    this.initValues();
  },

  onShow() {
    this.initLanguage();
  },

  initLanguage() {
    const lang = i18n.getLanguage();
    const i18nData = i18n.languageMap[lang];
    this.setData({
      lang: lang,
      i18n: i18nData,
      values: [{
        id: 'val_1',
        iconPath: '/assets/icons/ic_eye.svg',
        title: i18nData.about.val_1_title,
        desc: i18nData.about.val_1_desc
      }, {
        id: 'val_2',
        iconPath: '/assets/icons/ic_heart.svg',
        title: i18nData.about.val_2_title,
        desc: i18nData.about.val_2_desc
      }, {
        id: 'val_3',
        iconPath: '/assets/icons/ic_shield.svg',
        title: i18nData.about.val_3_title,
        desc: i18nData.about.val_3_desc
      }]
    });
  },

  onPullDownRefresh() {
    this.initLanguage();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});