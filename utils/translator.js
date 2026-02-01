class Translator {
    constructor() {
        this.cache = new Map();
    }

    async translate(text, targetLang, provider = 'google_free', sourceLang = 'auto') {
        const cacheKey = `${text}_${sourceLang}_${targetLang}_${provider}`;
        if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

        let result = text;
        try {
            console.log(`[Translator] Request: ${text} -> ${targetLang} via ${provider}`);
            if (provider === 'mock') {
                result = `[${targetLang.toUpperCase()}] ${text}`;
                await new Promise(r => setTimeout(r, 600));
            } else if (provider === 'google_free') {
                result = await this.googleFreeTranslate(text, sourceLang, targetLang);
            }
        } catch (e) {
            console.error('Translation failed:', e);
            return `[Error: ${e.message}]`;
        }

        this.cache.set(cacheKey, result);
        return result;
    }

    async googleFreeTranslate(text, sourceLang, targetLang) {
        // Uses the publicly available 'gtx' endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Join segments
        return data[0].map(s => s[0]).join('');
    }
}

globalThis.Translator = Translator;
