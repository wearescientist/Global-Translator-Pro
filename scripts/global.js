(function () {
    let targetLang = 'zh';
    let autoTranslateActive = false;
    let globalSelectionEnabled = true;

    // Init
    initialize();

    function initialize() {
        chrome.storage.sync.get(['targetLang', 'globalEnabled', 'autoDomains'], (res) => {
            if (res.targetLang) targetLang = res.targetLang;
            globalSelectionEnabled = res.globalEnabled !== false;

            const host = window.location.hostname;
            // Default Twitter/X to on if not set
            let autoList = res.autoDomains;
            if (!autoList) {
                // Setting defaults for the user
                autoList = ['twitter.com', 'x.com', 'www.twitter.com', 'www.x.com'];
                // Optional: Save this default back to storage so it persists? 
                // Don't need to force save, just use it in-memory for logic.
            }

            if (autoList.includes(host)) {
                if (!autoTranslateActive) {
                    startAutoTranslator();
                }
            } else {
                stopAutoTranslator();
            }
        });
    }

    // Listen for updates from popup
    chrome.runtime.onMessage.addListener((req) => {
        if (req.action === 'update_settings') {
            initialize();
        }
    });

    /* =========================================
       1. SELECTION POPUP logic
       ========================================= */
    document.addEventListener('mouseup', (e) => {
        if (!globalSelectionEnabled) return;
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text.length > 0 && text.length < 2000) {
            showTranslateBubble(e.pageX, e.pageY, text);
        }
    });

    let bubble = null;
    function showTranslateBubble(x, y, text) {
        if (bubble) bubble.remove();
        bubble = document.createElement('div');
        bubble.innerHTML = '🌐';
        bubble.style.cssText = `
            position: absolute; top: ${y + 10}px; left: ${x + 10}px;
            z-index: 2147483647; background: #3b82f6; color: white;
            width: 30px; height: 30px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        `;
        bubble.onclick = (e) => { e.stopPropagation(); doTranslateSelection(text, x, y); };
        document.body.appendChild(bubble);
        document.addEventListener('mousedown', (e) => {
            if (bubble && !bubble.contains(e.target)) { bubble.remove(); bubble = null; }
        }, { once: true });
    }

    async function doTranslateSelection(text, x, y) {
        if (bubble) bubble.innerText = '...';
        try {
            const res = await chrome.runtime.sendMessage({
                action: 'translate', text: text, targetLang: targetLang
            });
            if (res && res.translation) showResultPopup(res.translation, x, y);
        } catch (e) { showResultPopup('Error', x, y); }
    }

    function showResultPopup(text, x, y) {
        if (bubble) bubble.remove();
        const p = document.createElement('div');
        p.innerText = text;
        p.style.cssText = `
            position: absolute; top: ${y + 15}px; left: ${x}px;
            max-width: 300px; background: #1e293b; color: white; padding: 12px;
            border-radius: 8px; z-index: 2147483647; font-size: 14px;
            border: 1px solid #475569; position: absolute;
        `;
        document.body.appendChild(p);
        setTimeout(() => document.addEventListener('click', () => p.remove(), { once: true }), 100);
    }


    /* =========================================
       2. UNIVERSAL AUTO-TRANSLATOR
       ========================================= */
    let autoObserver = null;
    const TRANSLATED_MARK = 'data-tr-auto';

    function startAutoTranslator() {
        console.log('[Global] Auto-Translation STARTED');
        autoTranslateActive = true;

        // 1. Translate existing
        translateBatch(document.body);

        // 2. Observe new
        autoObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element
                        translateBatch(node);
                    } else if (node.nodeType === 3) { // Text
                        if (shouldTranslate(node.parentElement)) {
                            queueTranslation(node.parentElement);
                        }
                    }
                });
            }
        });

        autoObserver.observe(document.body, { childList: true, subtree: true });
    }

    function stopAutoTranslator() {
        if (autoObserver) {
            autoObserver.disconnect();
            autoObserver = null;
        }
        autoTranslateActive = false;
        console.log('[Global] Auto-Translation STOPPED');
    }

    // Specific fix for Twitter/X timeline
    function isTwitterText(node) {
        if (!node || !node.parentElement) return false;
        // Twitter text usually has this data attribute
        if (node.parentElement.closest('[data-testid="tweetText"]')) return true;
        return false;
    }

    function translateBatch(rootNode) {
        const walker = document.createTreeWalker(
            rootNode, NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;

                    // Prioritize Twitter content
                    if (isTwitterText(node)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }

                    if (shouldTranslate(parent) && node.nodeValue.trim().length > 1) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            queueTranslation(node);
        });
    }

    function shouldTranslate(element) {
        if (!element) return false;
        const tag = element.tagName;
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE'].includes(tag)) return false;
        if (element.isContentEditable) return false;
        if (element.hasAttribute(TRANSLATED_MARK)) return false;
        if (element.closest && element.closest(`[${TRANSLATED_MARK}]`)) return false;
        return true;
    }

    // Concurrent Queue
    let translationQueue = [];
    let isProcessingQueue = false;

    function queueTranslation(textNode) {
        if (translationQueue.includes(textNode)) return;
        translationQueue.push(textNode);
        processQueue();
    }

    async function processQueue() {
        if (isProcessingQueue) return;
        if (translationQueue.length === 0) return;

        isProcessingQueue = true;

        const MAX_CONCURRENT = 4;
        const activePromises = new Set();

        while (translationQueue.length > 0 || activePromises.size > 0) {
            // Fill the pool
            while (translationQueue.length > 0 && activePromises.size < MAX_CONCURRENT) {
                const node = translationQueue.shift();

                // Validate
                if (!node.parentElement || !document.contains(node)) continue;
                const originalText = (node.nodeValue || '').trim();
                if (!/[a-zA-Z\u4e00-\u9fa5]/.test(originalText)) continue;

                // Create promise
                const p = (async () => {
                    try {
                        node.parentElement.setAttribute(TRANSLATED_MARK, 'pending');
                        const res = await chrome.runtime.sendMessage({
                            action: 'translate',
                            text: originalText,
                            targetLang: targetLang
                        });

                        if (res && res.translation) {
                            node.nodeValue = res.translation;
                            node.parentElement.setAttribute(TRANSLATED_MARK, 'done');
                        } else {
                            node.parentElement.removeAttribute(TRANSLATED_MARK);
                        }
                    } catch (e) {
                        node.parentElement.removeAttribute(TRANSLATED_MARK);
                    }
                })();

                activePromises.add(p);
                p.finally(() => activePromises.delete(p));
            }

            if (activePromises.size > 0) {
                await Promise.race(activePromises);
            }
        }

        isProcessingQueue = false;
    }

})(); // IIFE End
