importScripts('/utils/translator.js');

const translator = new Translator();

// Setup Context Menu on installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "translate-global",
        title: "Translate Full Page",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "translate-global") {
        chrome.tabs.sendMessage(tab.id, { action: "translate_page_trigger" });
    }
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === 'translate') {
        handleTranslate(req).then(sendResponse);
        return true; // async
    }
});

async function handleTranslate(req) {
    const settings = await chrome.storage.sync.get(['targetLang', 'provider']);
    const target = req.targetLang || settings.targetLang || 'zh';
    const provider = req.provider || settings.provider || 'google_free';

    const result = await translator.translate(req.text, target, provider);
    return { translation: result };
}
