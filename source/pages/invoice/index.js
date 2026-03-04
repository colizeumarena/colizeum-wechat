const i18n = require("../../utils/i18n.js");
const baseBehavior = require("../../behaviors/base-behavior.js");
const authService = require("../../services/auth-service.js");
const documentsService = require("../../services/documents-service.js");
const invoiceAdapter = require("../../utils/invoice-adapter.js");
const app = getApp();

Page({
  behaviors: [baseBehavior],
  data: {
    i18n: {},
    t: i18n,
    invoices: [],
    page: 1,
    hasMore: true,
    loading: false,
    isLoadingMore: false,
    totalCount: 0,
    contracts: [],
    currentContractIndex: 0,
    currentCodcli: "",
    currentContract: null,
  },

  onLoad() {
    this.setData({
      loading: true,
    });
  },

  onShow() {
    this.initLanguage();
    this.updateTabBarLang();

    const lastCodcli = wx.getStorageSync("last_selected_codcli");
    if (lastCodcli) {
      this.setData({
        currentCodcli: lastCodcli,
      });
    }

    this.loadInvoices(false);
  },

  initLanguage() {
    const lang = i18n.getLanguage();
    const i18nData = i18n.languageMap[lang];
    this.setData({
      lang: lang,
      i18n: i18nData,
      totalCount: this.data.invoices.length,
      totalCountText: i18n.tArgs("invoice.total_count", {
        count: this.data.invoices.length,
      }),
    });
  },

  updateTabBarLang() {
    const lang = i18n.getLanguage();
    const tabBarTexts = i18n.languageMap[lang].tabBar;

    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
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

  handleLogin() {
    wx.navigateTo({
      url: "/pages/login/index",
    });
  },

  handleContractChange(e) {
    const index = e.detail.current;
    const contracts = this.data.contracts;

    if (contracts.length <= 1 && e.detail.source === "touch") {
      return;
    }

    if (index >= 0 && index < contracts.length) {
      const selectedCodcli = contracts[index].id;

      if (selectedCodcli !== this.data.currentCodcli) {
        this.setData({
          currentContractIndex: index,
          currentCodcli: selectedCodcli,
          invoices: [],
          page: 1,
          hasMore: true,
          totalCount: 0,
          loading: true,
        });

        wx.setStorageSync("last_selected_codcli", selectedCodcli);
        this.loadInvoices(false);
      }
    }
  },

  loadInvoices(isLoadMore = false) {
    if (isLoadMore && (this.data.isLoadingMore || !this.data.hasMore)) {
      return;
    }

    const tokenHeader = authService.getAuthorizationHeader();
    const isLoggedIn = !!tokenHeader.Authorization;

    this.setData({
      isLoggedIn: isLoggedIn,
    });

    if (!isLoggedIn) {
      this.setData({
        invoices: [],
        loading: false,
        isLoadingMore: false,
        totalCount: 0,
        contracts: [],
        currentCodcli: "",
        currentContract: null,
      });
      return;
    }

    const nextPage = isLoadMore ? this.data.page + 1 : 1;

    this.setData({
      loading: !isLoadMore,
      isLoadingMore: isLoadMore,
    });

    const ensureCodcli = () => {
      if (this.data.currentCodcli && this.data.contracts.length > 0) {
        return Promise.resolve(this.data.currentCodcli);
      }

      return documentsService.getMyContratos().then((payload) => {
        const list = Array.isArray(payload)
          ? payload
          : (payload && Array.isArray(payload.codclis)
              ? payload.codclis
              : []) ||
            (payload && payload.contratos) ||
            (payload && payload.data) ||
            [];

        const formattedContracts = list.map((item) => {
          const id = typeof item === "object" ? item.codcli || item.id : item;
          return {
            id: String(id),
            name: String(id),
            details: null,
          };
        });

        let initialCodcli = "";
        let initialIndex = 0;

        if (formattedContracts.length > 0) {
          const lastCodcli =
            this.data.currentCodcli ||
            wx.getStorageSync("last_selected_codcli");
          const foundIndex = formattedContracts.findIndex(
            (c) => c.id === lastCodcli,
          );

          if (foundIndex >= 0) {
            initialCodcli = lastCodcli;
            initialIndex = foundIndex;
          } else {
            initialCodcli = formattedContracts[0].id;
            initialIndex = 0;
          }
        }

        this.setData({
          contracts: formattedContracts,
          currentContractIndex: initialIndex,
          currentCodcli: initialCodcli,
        });

        if (initialCodcli) {
          authService.setCodcli(initialCodcli);
          wx.setStorageSync("last_selected_codcli", initialCodcli);
        }
        return initialCodcli;
      });
    };

    ensureCodcli()
      .then((codcli) => {
        if (!codcli) {
          return {
            data: [],
            total: 0,
            hasMore: false,
          };
        }

        return documentsService.getFacturas(codcli, nextPage);
      })
      .then((payload) => {
        const normalized = invoiceAdapter.normalizeInvoicesResponse(payload, {
          page: nextPage,
        });
        const mergedInvoices = isLoadMore
          ? this.data.invoices.concat(normalized.invoices)
          : normalized.invoices;
        const hasMore =
          typeof normalized.hasMore === "boolean"
            ? normalized.hasMore
            : this.data.hasMore;

        this.setData({
          invoices: mergedInvoices,
          page: nextPage,
          hasMore: hasMore,
          totalCount: mergedInvoices.length,
          loading: false,
          isLoadingMore: false,
        });
      })
      .catch((err) => {
        const statusCode = err && err.statusCode;
        const title =
          statusCode === 401 || statusCode === 403
            ? (this.data.i18n.common && this.data.i18n.common.please_login) ||
              "请先登录"
            : (this.data.i18n.common && this.data.i18n.common.network_error) ||
              "网络异常，请稍后重试";

        this.setData({
          loading: false,
          isLoadingMore: false,
        });

        if (statusCode === 401 || statusCode === 403) {
          authService.clearAuth();
          this.setData({
            isLoggedIn: false,
            invoices: [],
            contracts: [],
            currentCodcli: "",
            currentContract: null,
          });
          wx.showToast({
            title: title,
            icon: "none",
          });
        } else {
          wx.showToast({
            title,
            icon: "none",
          });
        }
      });
  },

  handleDownload(e) {
    const item = e.detail.item;
    wx.showToast({
      title: `Downloading ${item.id}...`,
      icon: "none",
    });
  },

  onPullDownRefresh() {
    this.setData({
      hasMore: true,
    });
    this.loadInvoices(false);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 800);
  },

  onReachBottom() {
    this.loadInvoices(true);
  },

  handleLoadMore() {
    this.loadInvoices(true);
  },

  handleContractSwitch() {
    if (!this.data.contracts || this.data.contracts.length === 0) {
      documentsService.getMyContratos().then((payload) => {
        const list = Array.isArray(payload)
          ? payload
          : (payload && payload.contratos) || (payload && payload.data) || [];
        const formattedContracts = list.map((id) => ({
          id: id,
          name: id,
        }));
        this.setData({
          contracts: formattedContracts,
        });
        this._showContractActionSheet(formattedContracts);
      });
    } else {
      this._showContractActionSheet(this.data.contracts);
    }
  },

  _showContractActionSheet(contracts) {
    if (!contracts || contracts.length === 0) return;

    const itemList = contracts.map((c) => c.id);
    wx.showActionSheet({
      itemList: itemList,
      success: (res) => {
        const selectedCodcli = itemList[res.tapIndex];
        if (selectedCodcli !== this.data.currentCodcli) {
          this.setData({
            currentCodcli: selectedCodcli,
            invoices: [],
            page: 1,
            hasMore: true,
            totalCount: 0,
            currentContract: null,
          });
          wx.setStorageSync("last_selected_codcli", selectedCodcli);

          this.loadInvoices(false);
        }
      },
    });
  },

  handleViewContractDetails() {
    if (!this.data.currentCodcli) return;
    wx.navigateTo({
      url: `/pages/contract_detail/index?codcli=${encodeURIComponent(this.data.currentCodcli)}`,
    });
  },
});
