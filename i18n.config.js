const i18n = require('i18next');
const Backend = require('i18next-node-fs-backend');
const numeral = require('numeral');
const locales = require('numeral/locales');
const path = require('path');

const localeDirectory = process.env.LOCALE_DIR ? process.env.LOCALE_DIR : path.join('./', 'locales');

i18n.use(Backend).init({
    fallbackLng: 'en',
    debug: false,

    interpolation: {
        format: function(value, format, lng) {
            console.log('Lng:', lng);
            numeral.locale(lng);
            if(format === 'ada') {
                return numeral(value).format("(0.00a)");
            }  else if (format === 'percentage') {
                return numeral(value).format("0.00%")
            }
            return value;
        }
    },
    backend: {
        loadPath: path.join(localeDirectory, '{{lng}}/{{ns}}.json'),
        addPath: path.join(localeDirectory, '{{lng}}/{{ns}}.missing.json'),
    }
});

module.exports = i18n;