# 🌐 Global Translator Pro

> **Universal Translator for Discord and the Entire Web**

[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-v3-blue?logo=googlechrome)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful browser extension that provides seamless, real-time translation for Discord chats and any website. Translate selected text instantly or enable auto-translation for specific domains.

![Screenshot](assets/icon128.png)

<p align="center">
  <b>🇺🇸 English</b> | <a href="./README.zh-CN.md">🇨🇳 简体中文</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🚀 **Discord Live Translation** | Automatically translates Discord chat messages in real-time as they appear |
| 🎯 **Global Selection Popup** | Select any text on any website and get instant translation with a single click |
| ⚡ **Auto-Translate Domains** | Automatically translate entire pages for specific websites (e.g., Twitter/X) |
| 🌍 **Multi-Language Support** | Translate to/from 8 languages: Chinese, English, Japanese, Korean, Spanish, French, German, Russian |
| 🔄 **Smart Caching** | Translation results are cached to improve performance and reduce API calls |
| 🔒 **Privacy First** | Uses Google's public translation API directly from your browser - no data sent to third parties |
| 📱 **Lightweight** | Minimal resource usage with optimized MutationObserver for dynamic content |

---

## 📦 Installation

### Method 1: Chrome Web Store *(Coming Soon)*

Search "Global Translator Pro" on Chrome Web Store and install directly.

### Method 2: Developer Mode (Current)

1. Download or clone this repository:
   ```bash
   git clone https://github.com/wearescientist/Global-Translator-Pro.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked** and select the `Global-Translator-Pro` folder

5. The extension icon will appear in your browser toolbar

---

## 🎮 Usage

### Setting Up

1. Click the extension icon (🌐) in your browser toolbar
2. Select your **Target Language** from the dropdown
3. Toggle features on/off as needed:
   - ✅ **Discord Live Chat** - Enable real-time Discord translation
   - ✅ **Global Selection Popup** - Enable text selection translation
   - 🔄 **Auto-Translate this site** - Enable auto-translation for current domain
4. Click **Save Settings**

### Translating Selected Text

1. Select any text on any webpage
2. A 🌐 icon appears near your selection
3. Click the icon to see the translation instantly

### Discord Translation

- Simply navigate to Discord - translations appear automatically below foreign messages
- Visual indicator "🟢 Translator Active" appears when active

### Auto-Translate Mode

- Enable "Auto-Translate this site" for your frequently visited foreign websites
- Pages will be translated automatically as you scroll
- Perfect for Twitter/X, news sites, and blogs

---

## ⚙️ Supported Languages

| Language | Code |
|----------|------|
| 🇨🇳 Chinese (Simplified) | `zh` |
| 🇺🇸 English | `en` |
| 🇯🇵 Japanese | `ja` |
| 🇰🇷 Korean | `ko` |
| 🇪🇸 Spanish | `es` |
| 🇫🇷 French | `fr` |
| 🇩🇪 German | `de` |
| 🇷🇺 Russian | `ru` |

---

## 🏗️ Project Structure

```
Global-Translator-Pro/
├── manifest.json              # Extension manifest (v3)
├── background/
│   └── service_worker.js      # Background service worker
├── popup/
│   ├── index.html             # Settings popup UI
│   ├── style.css              # Popup styles
│   └── script.js              # Popup logic
├── scripts/
│   ├── global.js              # Global webpage content script
│   └── discord.js             # Discord-specific content script
├── utils/
│   └── translator.js          # Core translation engine
├── assets/
│   ├── icon16.png             # Extension icons
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── resize_icons.py            # Icon generation helper
└── README.md
```

---

## 🔧 Technical Details

### Architecture

- **Manifest V3**: Latest Chrome extension format
- **Content Scripts**: Injected into web pages for DOM manipulation
- **Service Worker**: Handles translation API calls and context menus
- **Chrome Storage API**: Persists user settings

### Translation Engine

- Uses `https://translate.googleapis.com/translate_a/single` endpoint
- Free, rate-limited Google Translate API
- Supports automatic language detection (`sl=auto`)
- Client identifier: `gtx`

### Performance Optimizations

- **Translation Queue**: Concurrent requests limited to 4 for optimal performance
- **MutationObserver**: Efficient DOM change detection
- **Result Caching**: Prevents duplicate translations
- **Same-Language Detection**: Skips translation when source equals target

---

## 🛠️ Development

### Prerequisites

- Chrome 88+ or Chromium-based browser
- Basic knowledge of JavaScript and Chrome Extension APIs

### Local Development

1. Clone the repository
2. Make your changes to the source files
3. Go to `chrome://extensions/` and reload the extension
4. Test your changes

### Icon Generation

Use the included Python script to generate icon sizes:

```bash
python resize_icons.py --source icon_original.png
```

---

## 📝 Permissions

The extension requires the following permissions:

| Permission | Purpose |
|------------|---------|
| `storage` | Save user preferences |
| `activeTab` | Access current tab for translation |
| `scripting` | Inject translation scripts |
| `contextMenus` | Add "Translate Full Page" context menu |
| `<all_urls>` | Translate content on any website |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Translation powered by [Google Translate](https://translate.google.com/)
- Icons designed for Chrome Extension standards

---

## 📬 Contact

- GitHub: [@wearescientist](https://github.com/wearescientist)
- Project Link: [https://github.com/wearescientist/Global-Translator-Pro](https://github.com/wearescientist/Global-Translator-Pro)

---

<p align="center">
  <sub>Built with ❤️ for breaking down language barriers</sub>
</p>

