Component({
  properties: {
    iconPath: {
      type: String,
      value: ''
    },
    variant: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('tap');
    }
  }
});