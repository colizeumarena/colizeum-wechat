const common = require('./i18n/common.js');
const home = require('./i18n/home.js');
const invoice = require('./i18n/invoice.js');
const mine = require('./i18n/mine.js');
const services = require('./i18n/services.js');
const auth = require('./i18n/auth.js');
const about = require('./i18n/about.js');
const packages = require('./i18n/packages.js');
const contact = require('./i18n/contact.js');
const tabBar = require('./i18n/tabBar.js');

const languageMap = {
  zh: {
    ...common.zh,
    ...home.zh,
    ...invoice.zh,
    ...mine.zh,
    ...services.zh,
    ...auth.zh,
    ...about.zh,
    ...packages.zh,
    ...contact.zh,
    ...tabBar.zh
  },
  es: {
    ...common.es,
    ...home.es,
    ...invoice.es,
    ...mine.es,
    ...services.es,
    ...auth.es,
    ...about.es,
    ...packages.es,
    ...contact.es,
    ...tabBar.es
  }
};


const getLanguage = () => {
  const app = getApp();
  return app.globalData.lang || 'zh';
};

const setLanguage = (lang) => {
  const app = getApp();
  app.globalData.lang = lang;
};

const t = (path) => {
  const lang = getLanguage();
  const keys = path.split('.');
  let value = languageMap[lang];

  for (const key of keys) {
    if (value && value[key]) {
      value = value[key];
    } else {
      return path; 
    }
  }
  return value;
};

const tArgs = (path, args) => {
  let text = t(path);
  if (args) {
    for (const key in args) {
      text = text.replace(`{${key}}`, args[key]);
    }
  }
  return text;
};

module.exports = {
  t,
  tArgs,
  setLanguage,
  getLanguage,
  languageMap
};