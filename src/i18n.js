import I18n from 'i18n-js';
import en from './locales/en';
import de from './locales/de';

I18n.fallbacks = true;
I18n.defaultLocale = 'de';

I18n.translations = {
  en,
  de
};

export default I18n;