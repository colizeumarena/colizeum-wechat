const i18n = require('../../utils/i18n.js');
const baseBehavior = require('../../behaviors/base-behavior.js');
const app = getApp();

Page({
    behaviors: [baseBehavior],
    data: {
        lang: 'zh',
        i18n: {},
        services: [],
        whyItems: [],
        faqs: []
    },

    onLoad() {
        this.initServices();
        this.initWhyItems();
        this.initFAQs();
    },

    onShow() {
        this.initLanguage();
        this.updateTabBarLang();
    },

    initLanguage() {
        const lang = i18n.getLanguage();
        const i18nData = i18n.languageMap[lang];

        
        const currentFaqs = this.data.faqs;
        const faqStates = {};
        if (currentFaqs.length > 0) {
            currentFaqs.forEach(f => faqStates[f.id] = f.isOpen);
        } else {
            
            faqStates['1'] = true;
        }

        const newFaqs = [{
                id: '1',
                question_key: 'faq_q1',
                answer_key: 'faq_a1',
                isOpen: !!faqStates['1']
            },
            {
                id: '2',
                question_key: 'faq_q2',
                answer_key: 'faq_a2',
                isOpen: !!faqStates['2']
            },
            {
                id: '3',
                question_key: 'faq_q3',
                answer_key: 'faq_a3',
                isOpen: !!faqStates['3']
            },
            {
                id: '4',
                question_key: 'faq_q4',
                answer_key: 'faq_a4',
                isOpen: !!faqStates['4']
            }
        ];

        this.setData({
            lang: lang,
            i18n: i18nData,
            services: [{
                    id: 'electricity',
                    iconPath: '/assets/icons/ic_electric.svg',
                    title_key: 'elec_title',
                    desc_key: 'elec_desc'
                },
                {
                    id: 'solar',
                    iconPath: '/assets/icons/ic_solar.svg',
                    title_key: 'solar_title',
                    desc_key: 'solar_desc'
                },
                {
                    id: 'battery',
                    iconPath: '/assets/icons/ic_battery.svg',
                    title_key: 'battery_title',
                    desc_key: 'battery_desc'
                },
                {
                    id: 'heat',
                    iconPath: '/assets/icons/ic_air_pump.svg',
                    title_key: 'heat_title',
                    desc_key: 'heat_desc'
                },
                {
                    id: 'ev',
                    iconPath: '/assets/icons/ic_charger.svg',
                    title_key: 'ev_title',
                    desc_key: 'ev_desc'
                },
                {
                    id: 'ppa',
                    iconPath: '/assets/icons/ic_ppa.svg',
                    title_key: 'ppa_title',
                    desc_key: 'ppa_desc'
                }
            ],
            faqs: newFaqs,
            whyItems: [{
                    id: 'care',
                    iconPath: '/assets/icons/ic_heart.svg',
                    title_key: 'why_1_title',
                    desc_key: 'why_1_desc'
                },
                {
                    id: 'online',
                    iconPath: '/assets/icons/ic_laptop.svg',
                    title_key: 'why_2_title',
                    desc_key: 'why_2_desc'
                },
                {
                    id: 'flexible',
                    iconPath: '/assets/icons/ic_cash.svg',
                    title_key: 'why_3_title',
                    desc_key: 'why_3_desc'
                }
            ]
        });
    },

    onPullDownRefresh() {
        this.initLanguage();
        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 1000);
    },

    toggleFAQ(e) {
        const id = e.currentTarget.dataset.id;
        const newFaqs = this.data.faqs.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    isOpen: !item.isOpen
                };
            }
            return item;
        });
        this.setData({
            faqs: newFaqs
        });
    },

    handleContact() {
        wx.navigateTo({
            url: '/pages/contact/index'
        });
    }
});