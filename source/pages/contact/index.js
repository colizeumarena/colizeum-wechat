const i18n = require("../../utils/i18n.js");
const baseBehavior = require("../../behaviors/base-behavior.js");
const app = getApp();

Page({
  behaviors: [baseBehavior],
  data: {
    lang: "zh",
    i18n: {},
    contactCards: [],
    offices: [],
  },

  onLoad() {},

  onShow() {
    this.initLanguage();
  },

  initLanguage() {
    const lang = i18n.getLanguage();
    const i18nData = i18n.languageMap[lang];
    const contactCards = [
      {
        id: "phone",
        type: "phone",
        iconPath: "/assets/icons/ic_phone.svg",
        label: i18nData.contact.phone_label,
        value: i18nData.contact.phone_value,
      },
      {
        id: "whatsapp",
        type: "whatsapp",
        iconPath: "/assets/icons/ic_whatsapp.svg",
        label: i18nData.contact.whatsapp_label,
        value: i18nData.contact.whatsapp_value,
      },
      {
        id: "email",
        type: "email",
        iconPath: "/assets/icons/ic_mail.svg",
        label: i18nData.contact.email_label,
        value: i18nData.contact.email_value,
      },
    ];
    this.setData({
      lang: lang,
      i18n: i18nData,
      contactCards: contactCards,
      offices: [
        {
          id: "main",
          title: i18nData.contact.office_main_title,
          desc: i18nData.contact.office_main_addr,
          latitude: 41.3937551,
          longitude: 2.1784348,
          name: "Lumisa - Barcelona",
          address: i18nData.contact.office_main_addr,
        },
        {
          id: "sub",
          title: i18nData.contact.office_sub_title,
          desc: i18nData.contact.office_sub_addr,
          latitude: 40.2692973,
          longitude: -3.7449676,
          name: "Lumisa - Madrid",
          address: i18nData.contact.office_sub_addr,
        },
      ],
    });
  },

  handlePhone() {
    wx.makePhoneCall({
      phoneNumber: this.data.i18n.contact.phone_value,
    });
  },

  handleWhatsApp() {
    const that = this;
    wx.setClipboardData({
      data: this.data.i18n.contact.whatsapp_value,
      success() {
        wx.showToast({
          title:
            that.data.i18n.contact.whatsapp_toast ||
            that.data.i18n.contact.copied,
          icon: "success",
        });
      },
    });
  },

  handleEmail() {
    const that = this;
    wx.setClipboardData({
      data: this.data.i18n.contact.email_value,
      success() {
        wx.showToast({
          title: that.data.i18n.contact.copied,
          icon: "success",
        });
      },
    });
  },

  handleCardTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === "phone") {
      this.handlePhone();
    } else if (type === "whatsapp") {
      this.handleWhatsApp();
    } else if (type === "email") {
      this.handleEmail();
    }
  },

  handleOpenMap(e) {
    const officeId = e.currentTarget.dataset.officeId;
    const office = this.data.offices.find((o) => o.id === officeId);

    if (office) {
      wx.openLocation({
        latitude: office.latitude,
        longitude: office.longitude,
        name: office.name,
        address: office.address,
        scale: 18,
      });
    }
  },

  onPullDownRefresh() {
    this.initLanguage();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
});
