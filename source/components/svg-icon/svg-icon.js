Component({
  externalClasses: ['custom-class'],

  properties: {
    src: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: ''
    },
    
    size: {
      type: null, 
      value: null
    },
    width: {
      type: String,
      value: '100%'
    },
    height: {
      type: String,
      value: '100%'
    }
  },

  data: {
    dataSrc: '',
    innerStyle: ''
  },

  observers: {
    'src, color': function (src, color) {
      this.loadSvg(src, color);
    },
    'size, width, height': function (size, width, height) {
      this.updateStyle(size, width, height);
    }
  },

  
  _cache: {},

  methods: {
    
    addUnit(value) {
      if (value === null || value === undefined || value === '') {
        return undefined;
      }
      
      if (!isNaN(value)) {
        return `${value}px`;
      }
      return value;
    },

    updateStyle(size, width, height) {
      let finalWidth = width;
      let finalHeight = height;

      if (size !== null && size !== undefined && size !== '') {
        const sizeWithUnit = this.addUnit(size);
        finalWidth = sizeWithUnit;
        finalHeight = sizeWithUnit;
      } else {
        finalWidth = this.addUnit(width);
        finalHeight = this.addUnit(height);
      }

      this.setData({
        innerStyle: `width: ${finalWidth}; height: ${finalHeight};`
      });
    },

    loadSvg(src, color) {
      if (!src) {
        this.setData({
          dataSrc: ''
        });
        return;
      }

      const cacheKey = `${src}-${color || 'default'}`;
      if (this._cache && this._cache[cacheKey]) {
        this.setData({
          dataSrc: this._cache[cacheKey]
        });
        return;
      }

      const fs = wx.getFileSystemManager();
      
      let filePath = src.startsWith('/') ? src.substring(1) : src;

      fs.readFile({
        filePath: filePath,
        encoding: 'utf8',
        success: (res) => {
          let svgContent = res.data;

          if (color) {
            svgContent = this.applyColorToSvgContent(svgContent, color);
          }

          
          
          
          const strUtf8 = unescape(encodeURIComponent(svgContent));
          const buffer = new Uint8Array(strUtf8.length);
          for (let i = 0; i < strUtf8.length; i++) {
            buffer[i] = strUtf8.charCodeAt(i);
          }

          
          const base64 = wx.arrayBufferToBase64(buffer.buffer);
          const dataSrc = `data:image/svg+xml;base64,${base64}`;

          if (!this._cache) this._cache = {};
          this._cache[cacheKey] = dataSrc;

          this.setData({
            dataSrc
          });
        },
        fail: (err) => {
          console.warn('[svg-icon] Failed to load SVG:', src, err);
        }
      });
    },

    applyColorToSvgContent(svgContent, color) {
      const cleaned = String(svgContent)
        .replace(/<\?xml[\s\S]*?\?>/i, '')
        .replace(/<!DOCTYPE[\s\S]*?>/i, '');

      const normalizeValue = (value) => String(value || '').trim().toLowerCase();

      let updated = cleaned.replace(/\sfill=(['"])(.*?)\1/gi, (match, quote, value) => {
        if (normalizeValue(value) === 'none') return match;
        return ` fill=${quote}${color}${quote}`;
      });

      updated = updated.replace(/\sstroke=(['"])(.*?)\1/gi, (match, quote, value) => {
        if (normalizeValue(value) === 'none') return match;
        return ` stroke=${quote}${color}${quote}`;
      });

      updated = updated.replace(/\sstyle=(['"])(.*?)\1/gi, (match, quote, styleText) => {
        let nextStyle = String(styleText);

        nextStyle = nextStyle.replace(/fill\s*:\s*([^;"]+)(;?)/gi, (m, value, semi) => {
          if (normalizeValue(value) === 'none') return m;
          return `fill:${color}${semi || ''}`;
        });

        nextStyle = nextStyle.replace(/stroke\s*:\s*([^;"]+)(;?)/gi, (m, value, semi) => {
          if (normalizeValue(value) === 'none') return m;
          return `stroke:${color}${semi || ''}`;
        });

        return ` style=${quote}${nextStyle}${quote}`;
      });

      const hasAnyFill = /\sfill=(['"])/i.test(updated) || /fill\s*:/i.test(updated);
      const hasAnyStroke = /\sstroke=(['"])/i.test(updated) || /stroke\s*:/i.test(updated);

      if (!hasAnyFill) {
        updated = updated.replace(/<svg\b/i, `<svg fill="${color}"`);
      }
      if (!hasAnyStroke) {
        updated = updated.replace(/<svg\b/i, `<svg stroke="${color}"`);
      }

      return updated;
    }
  }
});