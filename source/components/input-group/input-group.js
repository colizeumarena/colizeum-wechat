Component({
  properties: {
    label: {
      type: String,
      value: ''
    },
    icon: {
      type: String,
      value: ''
    },
    type: {
      type: String,
      value: 'text'
    },
    enablePasswordToggle: {
      type: Boolean,
      value: false
    },
    placeholder: {
      type: String,
      value: ''
    },
    value: {
      type: String,
      value: ''
    },
    field: {
      type: String,
      value: ''
    },
    helper: {
      type: String,
      value: ''
    }
  },
  data: {
    passwordVisible: false,
    resolvedType: 'text',
    resolvedPassword: false,
    refocus: false,
    inputFocused: false,
    suppressNextBlur: false
  },
  observers: {
    'type, enablePasswordToggle, passwordVisible': function () {
      this.syncResolvedType();
    }
  },
  lifetimes: {
    attached() {
      this.syncResolvedType();
    }
  },
  methods: {
    syncResolvedType() {
      const baseType = this.data.type || 'text';
      if (this.data.enablePasswordToggle && baseType === 'password') {
        this.setData({
          resolvedType: 'text',
          resolvedPassword: !this.data.passwordVisible
        });
        return;
      }
      this.setData({
        resolvedType: baseType,
        resolvedPassword: false
      });
    },

    handleTogglePassword() {
      if (!(this.data.enablePasswordToggle && this.data.type === 'password')) {
        return;
      }
      const wasFocused = this.data.inputFocused;
      this.setData({
        passwordVisible: !this.data.passwordVisible,
        suppressNextBlur: wasFocused
      });
      if (wasFocused) {
        this.setData({
          refocus: false
        });
        wx.nextTick(() => {
          this.setData({
            refocus: true
          });
          wx.nextTick(() => {
            this.setData({
              refocus: false
            });
          });
        });
      }
    },

    handleInput(e) {
      const detail = {
        value: e.detail.value,
        field: this.data.field
      };
      this.triggerEvent('input', detail);
    },
    handleFocus() {
      this.setData({
        inputFocused: true
      });
      const detail = {
        field: this.data.field
      };
      this.triggerEvent('focus', detail);
    },
    handleBlur() {
      if (this.data.suppressNextBlur) {
        this.setData({
          suppressNextBlur: false,
          inputFocused: true
        });
        return;
      }
      this.setData({
        inputFocused: false
      });
      const detail = {
        field: this.data.field
      };
      this.triggerEvent('blur', detail);
    }
  }
});