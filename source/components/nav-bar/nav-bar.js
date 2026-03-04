Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    navHeight: {
      type: Number,
      value: 44
    },
    statusBarHeight: {
      type: Number,
      value: 20
    },
    showBack: {
      type: Boolean,
      value: true
    }
  },
  methods: {
    onBackTap() {
      this.triggerEvent('back');
    }
  }
});
