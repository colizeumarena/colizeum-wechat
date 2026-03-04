const i18n = require("../../utils/i18n.js");
const baseBehavior = require("../../behaviors/base-behavior.js");
const authService = require("../../services/auth-service.js");
const app = getApp();

Page({
  behaviors: [baseBehavior],
  data: {
    lang: "zh",
    i18n: {},
    showLangMenu: false,
    currentBanner: 0,
    banners: [],
    menuItems: [],
  },

  onLoad() {
    this.initBanners();
  },

  onShow() {
    this.initLanguage();
    this.initMenuItems();
    this.updateTabBarLang();
  },

  initLanguage() {
    const lang = i18n.getLanguage();
    this.setData({
      lang: lang,
      i18n: i18n.languageMap[lang],
    });
  },

  initBanners() {
    this.setData({
      banners: [
        {
          id: 1,
          image:
            "https://lumisa-strapi.s3.eu-south-2.amazonaws.com/promociones_cover_060bef7f68.webp",
          logo_sub_key: "logo_sub",
          title_key: "banner_title_1",
          subtitle_key: "banner_subtitle_1",
        },
        {
          id: 2,
          image:
            "https://lumisolar.s3.eu-south-2.amazonaws.com/solar_panels_g98df458c8_1280_366bcb45f0.jpg",
          logo_sub_key: "logo_sub_solar",
          title_key: "banner_title_2",
          subtitle_key: "banner_subtitle_2",
        },
        {
          id: 3,
          image:
            "https://lumisolar.s3.eu-south-2.amazonaws.com/seer_scop_d0a8183cf2.jpg",
          logo_sub_key: "logo_sub_service",
          title_key: "banner_title_3",
          subtitle_key: "banner_subtitle_3",
        },
      ],
    });
  },

  initMenuItems() {
    const token = wx.getStorageSync(authService.STORAGE_KEYS.token);
    const isLoggedIn = !!token;

    const items = [
      {
        id: "about",
        icon: "info",
        iconPath: "/assets/icons/ic_about.svg",
        title_key: "menu_about",
        desc_key: "menu_about_desc",
        url: "/pages/about/index",
      },
      {
        id: "packages",
        icon: "file-invoice-dollar",
        iconPath: "/assets/icons/ic_packages.svg",
        title_key: "menu_packages",
        desc_key: "menu_packages_desc",
        url: "/pages/packages/index",
      },
      {
        id: "services",
        icon: "th-large",
        iconPath: "/assets/icons/ic_services.svg",
        title_key: "menu_services",
        desc_key: "menu_services_desc",
        url: "/pages/services/index",
        isTab: false,
      },
      {
        id: "news",
        icon: "newspaper",
        iconPath: "/assets/icons/ic_news.svg",
        title_key: "menu_news",
        desc_key: "menu_news_desc",
        url: "/pages/news/index",
      },
      {
        id: "contact",
        icon: "envelope",
        iconPath: "/assets/icons/ic_mail.svg",
        title_key: "menu_contact",
        desc_key: "menu_contact_desc",
        url: "/pages/contact/index",
      },
    ];

    this.setData({
      menuItems: items,
    });
  },

  toggleLangMenu() {
    this.setData({
      showLangMenu: !this.data.showLangMenu,
    });
  },

  onBannerChange(e) {
    const current =
      e.detail && typeof e.detail.current === "number" ? e.detail.current : 0;
    this.setData({
      currentBanner: current,
    });
  },

  switchLang(e) {
    const lang = e.currentTarget.dataset.lang;
    if (lang === this.data.lang) return;

    i18n.setLanguage(lang);
    this.setData({
      lang: lang,
      i18n: i18n.languageMap[lang],
      showLangMenu: false,
    });
    this.updateTabBarLang();
  },

  updateTabBarLang() {
    const lang = i18n.getLanguage();
    const tabBarTexts = i18n.languageMap[lang].tabBar;

    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      });
    }

    wx.setTabBarItem({
      index: 0,
      text: tabBarTexts.home,
    });
    wx.setTabBarItem({
      index: 1,
      text: tabBarTexts.invoice,
    });
    wx.setTabBarItem({
      index: 2,
      text: tabBarTexts.mine,
    });
  },

  handleMenuClick(e) {
    const item = e.currentTarget.dataset.item;

    if (item.isTab) {
      wx.switchTab({
        url: item.url,
      });
    } else {
      if (item.id === "news") {
        const articleUrl = encodeURIComponent(
          "https://mp.weixin.qq.com/s/bo7nPSph1zlLe4Ls61TC6w",
        );
        wx.navigateTo({
          url: `/pages/webview/index?url=${articleUrl}`,
        });
      } else {
        wx.navigateTo({
          url: item.url,
        });
      }
    }
  },

  onPullDownRefresh() {
    this.initLanguage();

    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
});
