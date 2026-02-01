# 🌐 Global Translator Pro

> **Discord 和全网页通用翻译器**

[![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-v3-blue?logo=googlechrome)](https://chrome.google.com/webstore)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一款功能强大的浏览器扩展，为 Discord 聊天和任何网站提供无缝的实时翻译。即时翻译选中的文本或为特定域名启用自动翻译。

![Screenshot](assets/icon128.png)

<p align="center">
  <a href="./README.md">🇺🇸 English</a> | <b>🇨🇳 简体中文</b>
</p>

---

## ✨ 功能特性

| 功能 | 描述 |
|---------|-------------|
| 🚀 **Discord 实时翻译** | 实时自动翻译 Discord 聊天消息 |
| 🎯 **全局划词翻译** | 在任何网站上选中任意文本，一键即可翻译 |
| ⚡ **网站自动翻译** | 为特定网站（如 Twitter/X）自动翻译整个页面 |
| 🌍 **多语言支持** | 支持 8 种语言互译：中文、英语、日语、韩语、西班牙语、法语、德语、俄语 |
| 🔄 **智能缓存** | 翻译结果会被缓存，提高性能并减少 API 调用 |
| 🔒 **隐私优先** | 使用谷歌公开翻译 API，直接从浏览器调用 - 数据不会发送给第三方 |
| 📱 **轻量级** | 资源占用极小，使用优化的 MutationObserver 处理动态内容 |

---

## 📦 安装方式

### 方式一：Chrome 应用商店 *(即将上架)*

在 Chrome 应用商店搜索 "Global Translator Pro" 直接安装。

### 方式二：开发者模式（当前方式）

1. 下载或克隆本仓库：
   ```bash
   git clone https://github.com/wearescientist/Global-Translator-Pro.git
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`

3. 开启**开发者模式**（右上角开关）

4. 点击**加载已解压的扩展程序**，选择 `Global-Translator-Pro` 文件夹

5. 扩展图标将出现在浏览器工具栏中

---

## 🎮 使用指南

### 初始设置

1. 点击浏览器工具栏中的扩展图标（🌐）
2. 从下拉菜单中选择**目标语言**
3. 根据需要开启/关闭功能：
   - ✅ **Discord 实时聊天** - 启用 Discord 实时翻译
   - ✅ **全局划词翻译** - 启用选中文本翻译
   - 🔄 **自动翻译此网站** - 为当前域名启用自动翻译
4. 点击**保存设置**

### 划词翻译

1. 在任意网页上选中任意文本
2. 选中文字附近会出现 🌐 图标
3. 点击图标即可查看翻译结果

### Discord 翻译

- 直接访问 Discord - 外文消息下方会自动显示翻译
- 激活时会出现 "🟢 翻译器已激活" 视觉提示

### 自动翻译模式

- 为常访问的外文网站启用"自动翻译此网站"
- 滚动页面时会自动翻译新内容
- 特别适合 Twitter/X、新闻网站和博客

---

## ⚙️ 支持语言

| 语言 | 代码 |
|----------|------|
| 🇨🇳 简体中文 | `zh` |
| 🇺🇸 英语 | `en` |
| 🇯🇵 日语 | `ja` |
| 🇰🇷 韩语 | `ko` |
| 🇪🇸 西班牙语 | `es` |
| 🇫🇷 法语 | `fr` |
| 🇩🇪 德语 | `de` |
| 🇷🇺 俄语 | `ru` |

---

## 🏗️ 项目结构

```
Global-Translator-Pro/
├── manifest.json              # 扩展清单文件 (v3)
├── background/
│   └── service_worker.js      # 后台服务工作线程
├── popup/
│   ├── index.html             # 设置弹窗界面
│   ├── style.css              # 弹窗样式
│   └── script.js              # 弹窗逻辑
├── scripts/
│   ├── global.js              # 全局网页内容脚本
│   └── discord.js             # Discord 专用内容脚本
├── utils/
│   └── translator.js          # 核心翻译引擎
├── assets/
│   ├── icon16.png             # 扩展图标
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── resize_icons.py            # 图标生成助手
└── README.md
```

---

## 🔧 技术细节

### 架构

- **Manifest V3**: 最新 Chrome 扩展格式
- **内容脚本**: 注入网页进行 DOM 操作
- **Service Worker**: 处理翻译 API 调用和右键菜单
- **Chrome 存储 API**: 持久化用户设置

### 翻译引擎

- 使用 `https://translate.googleapis.com/translate_a/single` 接口
- 免费的谷歌翻译 API（有频率限制）
- 支持自动语言检测 (`sl=auto`)
- 客户端标识: `gtx`

### 性能优化

- **翻译队列**: 并发请求限制为 4 个以获得最佳性能
- **MutationObserver**: 高效的 DOM 变化检测
- **结果缓存**: 防止重复翻译
- **同语言检测**: 源语言和目标语言相同时跳过翻译

---

## 🛠️ 开发指南

### 环境要求

- Chrome 88+ 或 Chromium 内核浏览器
- JavaScript 和 Chrome 扩展 API 基础知识

### 本地开发

1. 克隆仓库
2. 修改源文件
3. 访问 `chrome://extensions/` 重新加载扩展
4. 测试更改

### 图标生成

使用附带的 Python 脚本生成各种尺寸的图标：

```bash
python resize_icons.py --source icon_original.png
```

---

## 📝 权限说明

扩展需要以下权限：

| 权限 | 用途 |
|------------|---------|
| `storage` | 保存用户偏好设置 |
| `activeTab` | 访问当前标签页进行翻译 |
| `scripting` | 注入翻译脚本 |
| `contextMenus` | 添加"翻译整页"右键菜单 |
| `<all_urls>` | 在任何网站上翻译内容 |

---

## 🤝 贡献指南

欢迎提交贡献！请随时提交 Pull Request。

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

- 翻译由 [Google Translate](https://translate.google.com/) 提供支持
- 图标遵循 Chrome 扩展标准设计

---

## 📬 联系方式

- GitHub: [@wearescientist](https://github.com/wearescientist)
- 项目链接: [https://github.com/wearescientist/Global-Translator-Pro](https://github.com/wearescientist/Global-Translator-Pro)

---

<p align="center">
  <sub>用 ❤️ 打造，打破语言障碍</sub>
</p>
