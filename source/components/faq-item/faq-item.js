Component({
  properties: {
    question: {
      type: String,
      value: ''
    },
    answer: {
      type: String,
      value: ''
    },
    isOpen: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    handleToggle() {
      
      
      this.triggerEvent('toggle');
    }
  }
});
