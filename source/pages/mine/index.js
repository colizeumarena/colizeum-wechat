const i18n = require('../../utils/i18n.js');
const baseBehavior = require('../../behaviors/base-behavior.js');
const authService = require('../../services/auth-service.js');
const app = getApp();

Page({
    behaviors: [baseBehavior],
    data: {
        lang: 'zh',
        i18n: {},
        menuList: [],
        isLoggedIn: false
    },

    onLoad() {},

    onShow() {
        this.checkLoginStatus();
        this.initLanguage();
        this.updateTabBarLang();
    },

    checkLoginStatus() {
        const token = wx.getStorageSync(authService.STORAGE_KEYS.token);
        this.setData({
            isLoggedIn: !!token
        }, () => {
            this.updateMenuList();
        });
    },

    updateMenuList() {
        const i18nData = this.data.i18n;
        console.log('updateMenuList called', {
            i18nData,
            isLoggedIn: this.data.isLoggedIn
        });

        if (!i18nData || !i18nData.mine) {
            console.log('i18nData or i18nData.mine is missing');
            return;
        }

        const list = [{
                id: 'referral',
                iconPath: '/assets/icons/ic_recomend.svg',
                title: i18nData.mine.referral,
                openType: 'share'
            },
            {
                id: 'service',
                iconPath: '/assets/icons/ic_customer_service.svg',
                title: i18nData.mine.service
            }
        ];

        if (this.data.isLoggedIn) {
            list.push({
                id: 'logout',
                iconPath: '/assets/icons/ic_logout.svg',
                title: i18nData.mine.logout
            });
        }

        const listWithDivider = list.map((item, index) => ({
            ...item,
            showDivider: index < list.length - 1
        }));

        console.log('Setting menuList:', listWithDivider);

        this.setData({
            menuList: listWithDivider
        });
    },

    initLanguage() {
        const lang = i18n.getLanguage();
        const i18nData = i18n.languageMap[lang];

        this.setData({
            lang: lang,
            i18n: i18nData
        }, () => {
            this.updateMenuList();
        });
    },

    updateTabBarLang() {
        const lang = i18n.getLanguage();
        const tabBarTexts = i18n.languageMap[lang].tabBar;

        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selected: 2
            })
        }

        wx.setTabBarItem({
            index: 0,
            text: tabBarTexts.home
        });
        wx.setTabBarItem({
            index: 1,
            text: tabBarTexts.invoice
        });
        wx.setTabBarItem({
            index: 2,
            text: tabBarTexts.mine
        });
    },

    handleLogin() {
        wx.navigateTo({
            url: '/pages/login/index'
        });
    },

    onShareAppMessage() {
        
        const lang = this.data.lang || i18n.getLanguage();
        const i18nData = i18n.languageMap[lang] || {};
        const mineTexts = i18nData.mine || {};
        const shareTitle = mineTexts.share_title || 'Lumisa';
        return {
            title: shareTitle,
            path: '/pages/index/index',
            imageUrl: 'https://lumisa-strapi.s3.eu-south-2.amazonaws.com/promociones_cover_060bef7f68.webp'
        };
    },

    handleMenuClick(e) {
        
        
        const item = e.currentTarget.dataset.item;

        if (!item) return;

        if (item.id === 'service') {
            wx.navigateTo({
                url: '/pages/contact/index'
            });
            return;
        }

        if (item.id === 'logout') {
            this.handleLogout();
            return;
        }

        wx.showToast({
            title: this.data.i18n.common.coming_soon,
            icon: 'none'
        });
    },

    onPullDownRefresh() {
        this.initLanguage();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000);
    },

    handleLogout() {
        const confirmText = this.data.i18n.common.confirm || 'OK';
        const cancelText = this.data.i18n.common.cancel || 'Cancel';

        
        
        
        const finalConfirmText = confirmText.length > 4 ? confirmText.substring(0, 4) : confirmText;
        const finalCancelText = cancelText.length > 4 ? cancelText.substring(0, 4) : cancelText;

        wx.showModal({
            title: this.data.i18n.mine.logout,
            content: this.data.i18n.mine.confirm_logout,
            confirmText: finalConfirmText,
            cancelText: finalCancelText,
            success: (res) => {
                if (res.confirm) {
                    authService.clearAuth();
                    wx.removeStorageSync('last_selected_codcli');
                    this.setData({
                        isLoggedIn: false
                    }, () => {
                        this.updateMenuList();
                    });
                    wx.showToast({
                        title: this.data.i18n.common.success,
                        icon: 'none'
                    });
                }
            }
        });
    }
});