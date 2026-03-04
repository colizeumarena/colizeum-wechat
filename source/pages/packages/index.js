const i18n = require("../../utils/i18n.js");
const baseBehavior = require("../../behaviors/base-behavior.js");
const packagesService = require("../../services/packages-service.js");
const app = getApp();

Page({
  behaviors: [baseBehavior],
  data: {
    lang: "zh",
    i18n: {},
    sections: [],
    loading: true,
    error: false,
    errorMessage: "",
  },

  onLoad() {
    this.fetchPackageData();
  },

  onShow() {
    const currentLang = i18n.getLanguage();
    if (this.data.lang !== currentLang) {
      this.initLanguage(); // Update i18n strings
      if (!this.data.loading && !this.data.error) {
        this.renderPackages(this.data.apiData);
      }
    }
  },

  initLanguage() {
    const lang = i18n.getLanguage();
    const i18nData = i18n.languageMap[lang];
    this.setData({
      lang: lang,
      i18n: i18nData,
    });
  },

  fetchPackageData() {
    this.setData({
      loading: true,
      error: false,
      errorMessage: "",
    });

    packagesService
      .getFixedRateData()
      .then((data) => {
        // Handle API response wrapper { message, data: { ... } }
        const rawData = data && data.data ? data.data : data;

        this.setData({
          apiData: rawData,
        });

        // Ensure minimum loading time to prevent flicker
        setTimeout(() => {
          this.renderPackages(rawData);
          this.setData({
            loading: false,
          });
        }, 500);
      })
      .catch((err) => {
        console.error("Failed to fetch package data", err);
        const lang = i18n.getLanguage();
        const i18nData = i18n.languageMap[lang];

        this.setData({
          loading: false,
          error: true,
          errorMessage: i18nData.common.network_error || "Network Error",
        });
      });
  },

  onRetry() {
    this.fetchPackageData();
  },

  renderPackages(apiData) {
    if (!apiData) return;

    const lang = i18n.getLanguage();
    const i18nData = i18n.languageMap[lang];

    const findRateByTitle = (data, targetTitle) => {
      if (!data || typeof data !== "object") return null;

      // Check immediate children (like "9": { ... })
      for (const item of Object.values(data)) {
        if (item && typeof item === "object") {
          if (item.rateTitle === targetTitle) {
            return item;
          }
          // Recurse deeper (e.g., into "2.0TD")
          const found = findRateByTitle(item, targetTitle);
          if (found) return found;
        }
      }
      return null;
    };

    const getVal = (val) => {
      if (val === undefined || val === null) return null;
      return Number(val);
    };

    const getPowerVal = (val) => {
      const v = getVal(val);
      if (v === null) return null;
      return v / 365;
    };

    // Format price for display in non-numeric cases (like strings) or manual formatting
    const formatPriceString = (val) => {
      if (val === undefined || val === null) return "--";
      if (typeof val === "number") return `${val.toFixed(6)} €`;
      if (typeof val === "string" && !val.includes("€")) return `${val} €`;
      return val;
    };

    const rate3Period = findRateByTitle(apiData, "lumisa_three");
    const rate24h = findRateByTitle(apiData, "lumisa_simple");
    const rateSolar = findRateByTitle(apiData, "lumisa_solar");
    const rateBusinessOne = findRateByTitle(apiData, "lumisa_luz_empresas_one");
    const rateBusinessSavings = findRateByTitle(
      apiData,
      "lumisa_luz_empresas_ahorro",
    );

    const fixedPackages = [
      {
        id: "3_period",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_3_title,
        subtitle: i18nData.packages.pkg_3_subtitle,
        desc: i18nData.packages.pkg_3_desc,
        showTaxToggle: true,
        energyRows: [
          {
            label: i18nData.packages.label_p1_peak,
            value: getVal(rate3Period?.energy?.[0]),
            highlight: true,
          },
          {
            label: i18nData.packages.label_p2_flat,
            value: getVal(rate3Period?.energy?.[1]),
            highlight: true,
          },
          {
            label: i18nData.packages.label_p3_valley,
            value: getVal(rate3Period?.energy?.[2]),
            highlight: true,
          },
        ],
        powerRows: [
          {
            label: i18nData.packages.label_p1,
            value: getPowerVal(rate3Period?.power?.[0]),
            highlight: true,
          },
          {
            label: i18nData.packages.label_p2,
            value: getPowerVal(rate3Period?.power?.[1]),
            highlight: true,
          },
        ],
      },
      {
        id: "24h",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_24_title,
        subtitle: i18nData.packages.pkg_24_subtitle,
        desc: i18nData.packages.pkg_24_desc,
        showTaxToggle: true,
        energyRows: [
          {
            label: i18nData.packages.label_24h,
            value: getVal(rate24h?.energy?.[0]),
          },
        ],
        powerRows: [
          {
            label: i18nData.packages.label_p1,
            value: getPowerVal(rate24h?.power?.[0]),
            highlight: true,
          },
          {
            label: i18nData.packages.label_p2,
            value: getPowerVal(rate24h?.power?.[1]),
            highlight: true,
          },
        ],
      },
    ];

    const floatingPackages = [
      {
        id: "floating",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_float_title,
        subtitle: i18nData.packages.pkg_float_subtitle,
        desc: i18nData.packages.pkg_float_desc,
        showTaxToggle: true,
        energyRows: [
          {
            label: i18nData.packages.label_energy_price,
            value: i18nData.packages.pkg_float_value,
          },
        ],
        powerRows: [
          {
            label: i18nData.packages.label_p1,
            value: 0.073782,
            highlight: true,
          },
          {
            label: i18nData.packages.label_p2,
            value: 0.0019,
            highlight: true,
          },
        ],
      },
    ];

    const solarPackages = [
      {
        id: "solar",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_solar_title,
        subtitle: i18nData.packages.pkg_solar_subtitle,
        desc: i18nData.packages.pkg_solar_desc,
        showTaxToggle: true,
        energyRows: [
          {
            label: i18nData.packages.label_24h,
            value: getVal(rateSolar?.energy?.[0]),
          },
        ],
        powerRows: [
          {
            label: i18nData.packages.label_p1,
            value: getPowerVal(rateSolar?.power?.[0]),
            highlight: true,
          },
          {
            label: i18nData.packages.label_p2,
            value: getPowerVal(rateSolar?.power?.[1]),
            highlight: true,
          },
        ],
        extraRows: [
          {
            label: "", // Empty label as per screenshot, or we can put the value directly
            value: rateSolar?.outgoingEnergy?.[0]
              ? `+${formatPriceString(rateSolar.outgoingEnergy[0])}`
              : "--",
          },
        ],
      },
    ];

    // Generate P1-P6 rows dynamically
    const generatePowerRowsP1P6 = (powerArray) => {
      if (!powerArray || !Array.isArray(powerArray)) return [];
      return powerArray.map((val, idx) => ({
        label: `P${idx + 1}`,
        value: getPowerVal(val),
        highlight: true,
      }));
    };

    const businessPackages = [
      {
        id: "business_one",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_business_title,
        subtitle: i18nData.packages.pkg_business_subtitle,
        desc: i18nData.packages.pkg_business_desc,
        showTaxToggle: true,
        energyRows: [
          {
            label: i18nData.packages.label_p1_p6,
            value: getVal(rateBusinessOne?.energy?.[0]),
          },
        ],
        powerRows: generatePowerRowsP1P6(rateBusinessOne?.power),
      },
      {
        id: "business_savings",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_business_savings_title,
        subtitle: i18nData.packages.pkg_business_savings_subtitle,
        desc: i18nData.packages.pkg_business_savings_desc,
        showTaxToggle: true,
        energyRows: (rateBusinessSavings?.energy || []).map((val, idx) => ({
          label: `P${idx + 1}`,
          value: getVal(val),
        })),
        powerRows: generatePowerRowsP1P6(rateBusinessSavings?.power),
      },
    ];

    const hvPackages = [
      {
        id: "hv",
        badgeText: "",
        tagList: [],
        title: i18nData.packages.pkg_hv_title,
        subtitle: i18nData.packages.pkg_hv_subtitle,
        desc: i18nData.packages.pkg_hv_desc,
        showTaxToggle: false,
        energyRows: [],
        powerRows: [],
      },
    ];

    this.setData({
      lang: lang,
      i18n: i18nData,
      sections: [
        {
          id: "fixed",
          title: i18nData.packages.section_fixed_title,
          taxLabel: i18nData.packages.price_tax_title,
          taxIncludedLabel: i18nData.packages.price_tax_included_title,
          energyTitle: i18nData.packages.price_energy_title,
          powerTitle: i18nData.packages.price_power_title,
          packages: fixedPackages,
        },
        {
          id: "floating",
          title: i18nData.packages.section_floating_title,
          taxLabel: i18nData.packages.price_tax_title,
          taxIncludedLabel: i18nData.packages.price_tax_included_title,
          energyTitle: i18nData.packages.price_energy_title,
          powerTitle: i18nData.packages.price_power_title,
          packages: floatingPackages,
        },
        {
          id: "solar",
          title: i18nData.packages.section_solar_title,
          taxLabel: i18nData.packages.price_tax_title,
          taxIncludedLabel: i18nData.packages.price_tax_included_title,
          energyTitle: i18nData.packages.price_energy_title,
          powerTitle: i18nData.packages.price_power_title,
          extraTitle: i18nData.packages.label_solar_surplus_title,
          packages: solarPackages,
        },
        {
          id: "business",
          title: i18nData.packages.section_business_title,
          taxLabel: i18nData.packages.price_tax_title,
          taxIncludedLabel: i18nData.packages.price_tax_included_title,
          energyTitle: i18nData.packages.price_energy_title,
          powerTitle: i18nData.packages.price_power_title,
          packages: businessPackages,
        },
        {
          id: "hv",
          title: i18nData.packages.section_hv_title,
          taxLabel: "",
          energyTitle: "",
          powerTitle: "",
          packages: hvPackages,
        },
      ],
    });
  },

  handleInterest() {
    wx.navigateTo({
      url: "/pages/contact/index",
    });
  },
});
