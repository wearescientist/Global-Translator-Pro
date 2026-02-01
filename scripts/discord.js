(function () {
    let targetLang = 'zh';

    // Init
    chrome.storage.sync.get(['targetLang'], (res) => {
        if (res.targetLang) targetLang = res.targetLang;
        initObserver();
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.targetLang) targetLang = changes.targetLang.newValue;
    });

    function initObserver() {
        console.log('[Discord Translator] initializing...');

        // Add a visual indicator to the top right of the screen
        const indicator = document.createElement('div');
        indicator.textContent = '🟢 Translator Active';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #4ade80;
            padding: 5px 10px;
            border-radius: 20px;
            z-index: 9999;
            font-size: 12px;
            pointer-events: none;
            opacity: 0.7;
        `;
        document.body.appendChild(indicator);

        const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element
                        processNode(node);
                    }
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Process initial messages
        processExistingMessages();
    }

    function processExistingMessages() {
        // Try multiple selectors
        const selectors = [
            '[id^="message-content"]',
            '[class*="messageContent"]',
            '[class^="markup"]' // Fallback for some discord versions
        ];

        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(translateMessage);
        });
    }

    function processNode(node) {
        // Check if the node itself matches
        if (checkMatch(node)) {
            translateMessage(node);
            return;
        }

        // Check children
        if (node.querySelectorAll) {
            // Broad search for potential message containers
            const candidates = node.querySelectorAll('[id^="message-content"], [class*="messageContent"]');
            candidates.forEach(translateMessage);
        }
    }

    function checkMatch(node) {
        if (!node.matches) return false;
        return node.matches('[id^="message-content"]') ||
            node.matches('[class*="messageContent"]');
    }

    const PROCESSED_ATTR = 'data-tr-done';

    function isSameLanguage(text, lang) {
        if (lang === 'zh' || lang.startsWith('zh')) {
            // Check if text contains Chinese characters
            // Threshold: if > 30% or at least a few chars?
            // Simple check: if it has Chinese, assume it's Chinese.
            return /[\u4e00-\u9fa5]/.test(text);
        }
        if (lang === 'en') {
            // If strictly latin and no other scripts
            return /^[a-zA-Z0-9\s.,!?'"-]+$/.test(text);
        }
        return false;
    }

    async function translateMessage(element) {
        if (element.hasAttribute(PROCESSED_ATTR)) return;
        element.setAttribute(PROCESSED_ATTR, 'processing');

        let text = element.innerText;
        // Filter out empty or very short 'system' messages
        if (!text || text.trim().length <= 1) return;

        // Clean user handles/mentions from text if needed, or just let API handle it. 
        // But for detection, might be noisy.

        // Same Language Check
        if (isSameLanguage(text, targetLang)) {
            console.log('[Discord] Skipping translation (Same Language detected):', text.substring(0, 20));
            element.setAttribute(PROCESSED_ATTR, 'skipped');
            return;
        }

        // Avoid translating the translation we just added (if logic fails)
        if (element.closest('.translation-result')) return;

        // Visual feedback that we found it
        element.style.borderLeft = "2px solid #fbbf24"; // Yellow = Processing

        try {
            const response = await chrome.runtime.sendMessage({
                action: 'translate',
                text: text,
                targetLang: targetLang,
                provider: 'google_free'
            });

            if (response && response.translation) {
                // Double check result isn't same as input (API sometimes returns same)
                if (response.translation.trim() === text.trim()) {
                    element.setAttribute(PROCESSED_ATTR, 'skipped');
                    element.style.borderLeft = "";
                    return;
                }

                injectTranslation(element, response.translation);
                element.setAttribute(PROCESSED_ATTR, 'done');
                element.style.borderLeft = ""; // Remove processing marker
            } else {
                console.warn('[Discord Translator] No translation returned');
            }
        } catch (e) {
            console.error('[Discord Translator] Error:', e);
        }
    }

    function injectTranslation(element, translatedText) {
        // Avoid duplicates more aggressively
        if (element.nextSibling && element.nextSibling.className === 'translation-result') return;

        const div = document.createElement('div');
        div.className = 'translation-result';
        div.style.cssText = `
            margin-top: 4px;
            padding: 4px 8px;
            border-left: 3px solid #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            color: #e2e8f0;
            font-size: 0.9em;
            white-space: pre-wrap;
        `;
        div.innerHTML = `<span style="opacity:0.7">🌐 </span> ${translatedText}`;

        // Insert AFTER the message
        if (element.parentElement) {
            element.parentElement.insertBefore(div, element.nextSibling);
        }
    }
})(); // IIFE End
