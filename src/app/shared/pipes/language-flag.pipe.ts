import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'languageFlagPipe'
})
export class LanguageFlagPipe implements PipeTransform {
    public langs: Array<{ key: string, value: string, flag: string }> = [
        {
            key: 'cs',
            value: 'Čeština',
            flag: '🇨🇿'
        },
        {
            key: 'da',
            value: 'Dansk',
            flag: '🇩🇰'
        },
        {
            key: 'de',
            value: 'Deutsch',
            flag: '🇩🇪'
        },
        {
            key: 'en',
            value: 'English',
            flag: '🇬🇧/🇺🇸'
        },
        {
            key: 'es',
            value: 'Español',
            flag: '🇪🇸'
        },
        {
            key: 'fr',
            value: 'Français',
            flag: '🇫🇷'
        },
        {
            key: 'hr',
            value: 'Hrvatski jezik',
            flag: '🇭🇷'
        },
        {
            key: 'it',
            value: 'Italiano',
            flag: '🇮🇹'
        },
        {
            key: 'pl',
            value: 'Język polski',
            flag: '🇵🇱'
        },
        {
            key: 'lv',
            value: 'Latviešu valoda',
            flag: '🇱🇻'
        },
        {
            key: 'lt',
            value: 'Lietuvių kalba',
            flag: '🇱🇹'
        },
        {
            key: 'hu',
            value: 'Magyar',
            flag: '🇭🇺'
        },
        {
            key: 'nl',
            value: 'Nederlands',
            flag: '🇳🇱'
        },
        {
            key: 'no',
            value: 'Norsk',
            flag: '🇳🇴'
        },
        {
            key: 'pt',
            value: 'Português',
            flag: '🇵🇹'
        },
        {
            key: 'ro',
            value: 'Română',
            flag: '🇷🇴'
        },
        {
            key: 'sk',
            value: 'Slovenčina',
            flag: '🇸🇰'
        },
        {
            key: 'fi',
            value: 'Suomi',
            flag: '🇫🇮'
        },
        {
            key: 'se',
            value: 'Svenska',
            flag: '🇸🇪'
        },
        {
            key: 'vi',
            value: 'Tiếng Việt',
            flag: '🇻🇳'
        },
        {
            key: 'tr',
            value: 'Türkçe',
            flag: '🇹🇷'
        },
        {
            key: 'el',
            value: 'Ελληνικά',
            flag: '🇬🇷'
        },
        {
            key: 'bg',
            value: 'Български език',
            flag: '🇧🇬'
        },
        {
            key: 'ru',
            value: 'Pусский',
            flag: '🇷🇺'
        },
        {
            key: 'th',
            value: 'ภาษาไทย',
            flag: '🇹🇭'
        },
        {
            key: 'zh-cn',
            value: '中文 简体',
            flag: '🇨🇳'
        },
        {
            key: 'zh-tw',
            value: '中文 繁體',
            flag: '🇹🇼'
        },
        {
            key: 'ja',
            value: '日本語',
            flag: '🇯🇵'
        },
        {
            key: 'ko',
            value: '한국어',
            flag: '🇰🇷'
        }
    ];

    transform(value: string): string {
        const lang = this.langs.find(l => l.key === value);
        return `${lang.flag} (${lang.value})`;
    }
}
