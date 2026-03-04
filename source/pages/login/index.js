const i18n = require("../../utils/i18n.js");
const baseBehavior = require("../../behaviors/base-behavior.js");
const authService = require("../../services/auth-service.js");
const app = getApp();

Page({
  behaviors: [baseBehavior],
  data: {
    lang: "zh",
    i18n: {},
    email: "",
    password: "",
    activeFieldId: "",
    bottomSpacer: 40,
  },

  onLoad() {},

  onShow() {
    this.initLanguage();
    this.bindKeyboardEvents();
  },

  onHide() {
    this.unbindKeyboardEvents();
  },

  onUnload() {
    this.unbindKeyboardEvents();
  },

  initLanguage() {
    const lang = i18n.getLanguage();
    const i18nData = i18n.languageMap[lang];
    this.setData({
      lang: lang,
      i18n: i18nData,
    });
  },

  bindKeyboardEvents() {
    if (this.keyboardHeightListener) {
      return;
    }
    this.keyboardHeightListener = (res) => {
      if (!res) {
        return;
      }
      if (res.height > 0) {
        this.setData({
          bottomSpacer: res.height + 20,
        });
      } else {
        this.setData({
          bottomSpacer: 40,
        });
      }
    };
    wx.onKeyboardHeightChange(this.keyboardHeightListener);
  },

  unbindKeyboardEvents() {
    if (this.keyboardHeightListener) {
      wx.offKeyboardHeightChange(this.keyboardHeightListener);
      this.keyboardHeightListener = null;
    }
  },

  handleInput(e) {
    const field = e.detail.field;
    this.setData({
      [field]: e.detail.value,
    });
  },

  handleFieldFocus(e) {
    const field = e.detail.field;
    this.setData({
      activeFieldId: field + "Field",
    });
  },

  handleFieldBlur() {
    this.setData({
      activeFieldId: "",
    });
  },

  handleLogin() {
    const { email, password } = this.data;

    if (!email || !password) {
      wx.showToast({
        title: this.data.i18n.common.please_fill_all,
        icon: "none",
      });
      return;
    }

    wx.showLoading({
      title: this.data.i18n.auth.login_btn,
      mask: true,
    });

    authService
      .login(email, password)
      .then(() => {
        wx.hideLoading();
        wx.showToast({
          title: this.data.i18n.common.success,
          icon: "success",
        });

        if (this._isNavigatingBack) return;
        this._isNavigatingBack = true;

        setTimeout(() => {
          wx.navigateBack();
        }, 500);
      })
      .catch((err) => {
        wx.hideLoading();
        const statusCode = err && err.statusCode;
        const errMsg = (err && err.errMsg) || "";
        const data = err && err.data;
        const isBasicAuthChallenge =
          statusCode === 401 &&
          typeof data === "string" &&
          data.includes("Authorization Required");
        const normalizedErrMsg = String(errMsg || "").toLowerCase();
        const isDomainNotAllowed =
          normalizedErrMsg.includes("url not in domain list") ||
          normalizedErrMsg.includes("domain list");
        const title =
          statusCode === 401 || statusCode === 403
            ? isBasicAuthChallenge
              ? this.data.i18n.common.network_error
              : this.data.i18n.common.login_failed
            : isDomainNotAllowed
              ? this.data.i18n.common.domain_not_allowed
              : this.data.i18n.common.network_error;
        wx.showToast({
          title,
          icon: "none",
        });
      });
  },
});
