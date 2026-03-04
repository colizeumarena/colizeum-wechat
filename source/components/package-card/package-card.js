Component({
  properties: {
    tagList: {
      type: Array,
      value: []
    },
    badgeText: {
      type: String,
      value: ""
    },
    iconPath: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    },
    subtitle: {
      type: String,
      value: ""
    },
    desc: {
      type: String,
      value: ""
    },
    showTaxToggle: {
      type: Boolean,
      value: false
    },
    taxLabel: {
      type: String,
      value: ""
    },
    taxIncludedLabel: {
      type: String,
      value: ""
    },
    energyTitle: {
      type: String,
      value: ""
    },
    powerTitle: {
      type: String,
      value: ""
    },
    energyRows: {
      type: Array,
      value: []
    },
    powerRows: {
      type: Array,
      value: []
    },
    extraTitle: {
      type: String,
      value: ""
    },
    extraRows: {
      type: Array,
      value: []
    }
  },
  data: {
    taxIncluded: false
  },
  methods: {
    toggleTax() {
      this.setData({
        taxIncluded: !this.data.taxIncluded
      });
    }
  }
});