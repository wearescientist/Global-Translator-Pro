document.addEventListener('DOMContentLoaded', async () => {
    const targetSelect = document.getElementById('target-lang');
    const saveBtn = document.getElementById('btn-save');
    const msgBox = document.getElementById('msg-box');

    // Toggles
    const toggleDiscord = document.getElementById('toggle-discord');
    const toggleGlobal = document.getElementById('toggle-global');
    const toggleDomainAuto = document.getElementById('toggle-domain-auto');
    const currentDomainSpan = document.getElementById('current-domain');

    // Get current tab domain
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let currentHost = '';
    if (tab && tab.url) {
        try {
            const url = new URL(tab.url);
            currentHost = url.hostname;
            currentDomainSpan.textContent = currentHost;
        } catch (e) {
            currentDomainSpan.textContent = 'this site';
        }
    }

    // Load Settings
    chrome.storage.sync.get(['targetLang', 'discordEnabled', 'globalEnabled', 'autoDomains'], (res) => {
        if (res.targetLang) targetSelect.value = res.targetLang;

        toggleDiscord.checked = res.discordEnabled !== false;
        toggleGlobal.checked = res.globalEnabled !== false;

        // Check if current domain is in auto-list
        const autoList = res.autoDomains || [];
        toggleDomainAuto.checked = autoList.includes(currentHost);
    });

    // Save
    saveBtn.addEventListener('click', () => {
        const lang = targetSelect.value;
        const discord = toggleDiscord.checked;
        const global = toggleGlobal.checked;
        const domainAuto = toggleDomainAuto.checked;

        // Update domain list
        chrome.storage.sync.get(['autoDomains'], (res) => {
            let list = res.autoDomains || [];
            if (domainAuto) {
                if (!list.includes(currentHost) && currentHost) list.push(currentHost);
            } else {
                list = list.filter(h => h !== currentHost);
            }

            chrome.storage.sync.set({
                targetLang: lang,
                discordEnabled: discord,
                globalEnabled: global,
                autoDomains: list
            }, () => {
                msgBox.textContent = 'Settings Saved!';
                setTimeout(() => msgBox.textContent = '', 2000);

                // Notify content script to reload settings
                if (tab && tab.id) {
                    chrome.tabs.sendMessage(tab.id, { action: 'update_settings' });
                }
            });
        });
    });
});
