import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./assets/lang', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

function defaultLang(_lang) {
  let cookieItem = document.cookie.split(';'),
    lang = '';
  for (let item of cookieItem) {
    let itemArray = item.split('=');
    if(itemArray.length > 0 && itemArray[0].trim() === 'think_language') {
      lang = itemArray[1];
    }
  }
  lang = 'zh-cn';
  // XXX: 只用中文版本
  return lang || _lang;
}

export default new VueI18n({
  locale: defaultLang(process.env.VUE_APP_I18N_LOCALE || 'zh-cn'),
  fallbackLocale: defaultLang(process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'zh-cn'),
  messages: loadLocaleMessages()
})
