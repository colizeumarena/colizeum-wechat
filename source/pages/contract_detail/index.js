const i18n = require('../../utils/i18n.js');
const baseBehavior = require('../../behaviors/base-behavior.js');
const documentsService = require('../../services/documents-service.js');

Page({
    behaviors: [baseBehavior],
    data: {
        i18n: {},
        codcli: '',
        contract: null,
        maskedIban: '',
        loading: true
    },

    onLoad(options) {
        if (options.codcli) {
            this.setData({
                codcli: decodeURIComponent(options.codcli)
            });
            this.loadContractDetails();
        } else {
            this.setData({
                loading: false
            });
        }
    },

    onShow() {
        this.initLanguage();
    },

    initLanguage() {
        const lang = i18n.getLanguage();
        const i18nData = i18n.languageMap[lang];
        this.setData({
            lang: lang,
            i18n: i18nData
        });
        
    },

    handleBack() {
        wx.navigateBack();
    },

    loadContractDetails() {
        if (!this.data.codcli) return;

        this.setData({
            loading: true
        });

        documentsService.getContrato(this.data.codcli)
            .then(data => {
                
                
                

                const contractData = data.contrato || {};
                const billingData = data.facturacion || {};

                
                
                const mappedContract = {
                    cup: contractData.cup,
                    dirSuministro: contractData.dirSuministro,
                    titular: contractData.titular,
                    tarifaAcceso: contractData.tarifaAcceso,
                    potencia1: contractData.potencia1, 
                    potencia2: contractData.potencia2,
                    iban: billingData.num_cuenta 
                };

                this.setData({
                    contract: mappedContract,
                    maskedIban: this.maskIban(mappedContract.iban),
                    loading: false
                });
            })
            .catch(err => {
                this.setData({
                    loading: false
                });
                wx.showToast({
                    title: 'Failed to load details',
                    icon: 'none'
                });
                console.error(err);
            });
    },

    maskIban(iban) {
        if (!iban || iban.length < 8) return iban;
        return '**** **** **** ' + iban.slice(-4);
    }
});