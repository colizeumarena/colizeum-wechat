Component({
  properties: {
    text: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    variant: {
      type: String,
      value: 'cyan'
    }
  },
  methods: {
    handleTap() {
      this.triggerEvent('tap');
    }
  }
});