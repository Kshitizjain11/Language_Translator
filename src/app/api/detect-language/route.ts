import { NextResponse } from 'next/server';
import { franc } from 'franc';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Use franc to detect the language
    const detectedLanguageCode = franc(text);

    // Map franc's ISO 639-3 codes to our application's language codes
    const languageMap: { [key: string]: string } = {
      afr: 'af',  // Afrikaans
      sqi: 'sq',  // Albanian
      amh: 'am',  // Amharic
      ara: 'ar',  // Arabic
      hye: 'hy',  // Armenian
      aze: 'az',  // Azerbaijani
      eus: 'eu',  // Basque
      bel: 'be',  // Belarusian
      ben: 'bn',  // Bengali
      bos: 'bs',  // Bosnian
      bul: 'bg',  // Bulgarian
      cat: 'ca',  // Catalan
      ceb: 'ceb', // Cebuano
      zho: 'zh',  // Chinese (Simplified)
      zht: 'zh-TW', // Chinese (Traditional)
      cos: 'co',  // Corsican
      hrv: 'hr',  // Croatian
      ces: 'cs',  // Czech
      dan: 'da',  // Danish
      nld: 'nl',  // Dutch
      eng: 'en',  // English
      epo: 'eo',  // Esperanto
      est: 'et',  // Estonian
      fin: 'fi',  // Finnish
      fra: 'fr',  // French
      fry: 'fy',  // Frisian
      glg: 'gl',  // Galician
      kat: 'ka',  // Georgian
      deu: 'de',  // German
      ell: 'el',  // Greek
      guj: 'gu',  // Gujarati
      hat: 'ht',  // Haitian Creole
      hau: 'ha',  // Hausa
      haw: 'haw', // Hawaiian
      heb: 'he',  // Hebrew
      hin: 'hi',  // Hindi
      hmn: 'hmn', // Hmong
      hun: 'hu',  // Hungarian
      isl: 'is',  // Icelandic
      ibo: 'ig',  // Igbo
      ind: 'id',  // Indonesian
      gle: 'ga',  // Irish
      ita: 'it',  // Italian
      jpn: 'ja',  // Japanese
      jav: 'jv',  // Javanese
      kan: 'kn',  // Kannada
      kaz: 'kk',  // Kazakh
      khm: 'km',  // Khmer
      kor: 'ko',  // Korean
      kur: 'ku',  // Kurdish
      kir: 'ky',  // Kyrgyz
      lao: 'lo',  // Lao
      lat: 'la',  // Latin
      lav: 'lv',  // Latvian
      lit: 'lt',  // Lithuanian
      ltz: 'lb',  // Luxembourgish
      mkd: 'mk',  // Macedonian
      mlg: 'mg',  // Malagasy
      msa: 'ms',  // Malay
      mal: 'ml',  // Malayalam
      mlt: 'mt',  // Maltese
      mri: 'mi',  // Maori
      mar: 'mr',  // Marathi
      mon: 'mn',  // Mongolian
      mya: 'my',  // Myanmar (Burmese)
      nep: 'ne',  // Nepali
      nor: 'no',  // Norwegian
      nya: 'ny',  // Nyanja (Chichewa)
      ori: 'or',  // Odia (Oriya)
      pus: 'ps',  // Pashto
      fas: 'fa',  // Persian
      pol: 'pl',  // Polish
      por: 'pt',  // Portuguese
      pan: 'pa',  // Punjabi
      ron: 'ro',  // Romanian
      rus: 'ru',  // Russian
      smo: 'sm',  // Samoan
      gla: 'gd',  // Scots Gaelic
      srp: 'sr',  // Serbian
      sot: 'st',  // Sesotho
      sna: 'sn',  // Shona
      snd: 'sd',  // Sindhi
      sin: 'si',  // Sinhala
      slk: 'sk',  // Slovak
      slv: 'sl',  // Slovenian
      som: 'so',  // Somali
      spa: 'es',  // Spanish
      sun: 'su',  // Sundanese
      swa: 'sw',  // Swahili
      swe: 'sv',  // Swedish
      tgl: 'tl',  // Tagalog
      tgk: 'tg',  // Tajik
      tam: 'ta',  // Tamil
      tat: 'tt',  // Tatar
      tel: 'te',  // Telugu
      tha: 'th',  // Thai
      tur: 'tr',  // Turkish
      tuk: 'tk',  // Turkmen
      ukr: 'uk',  // Ukrainian
      urd: 'ur',  // Urdu
      uig: 'ug',  // Uyghur
      uzb: 'uz',  // Uzbek
      vie: 'vi',  // Vietnamese
      cym: 'cy',  // Welsh
      xho: 'xh',  // Xhosa
      yid: 'yi',  // Yiddish
      yor: 'yo',  // Yoruba
      zul: 'zu',  // Zulu
    };

    const detectedLanguage = languageMap[detectedLanguageCode] || 'en';

    return NextResponse.json({ detectedLanguage });
  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 