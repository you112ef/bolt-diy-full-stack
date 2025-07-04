# Yousef SS - AI-Powered Development Platform

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)
[![Deploy to Vercel](https://img.shields.io/badge/Deploy%20to-Vercel-black)](https://vercel.com/)
[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7)](https://netlify.com/)

A modern, AI-powered development platform similar to [same.new](https://same.new) and [manus.im](https://manus.im), featuring intelligent agents, code editors, terminals, and seamless deployment integration.

## ✨ Features

### 🤖 AI-Powered Development
- **Dynamic AI Agents**: Switch between GPT-4, Claude, DeepSeek, and other models
- **Context-Aware Assistance**: AI understands your current file and project context
- **Smart Commands**: "Explain this file", "Fix this error", "Add documentation"
- **Real-time Code Suggestions**: AI-powered completions while you type

### 📝 Advanced Code Editor
- **Monaco Editor**: Full-featured editor with VS Code-like experience
- **Multi-file Support**: Tab-based editing with syntax highlighting
- **Language Detection**: Automatic language recognition and formatting
- **Auto-save**: Configurable auto-save functionality
- **Keyboard Shortcuts**: Comprehensive shortcut support

### 🗂️ Smart File Management
- **Interactive File Tree**: Drag & drop, create, delete files and folders
- **Project Templates**: Quick project setup with popular frameworks
- **File Upload**: Drag & drop files or import ZIP archives
- **GitHub Integration**: Import projects directly from GitHub

### 💻 Integrated Terminal
- **Multiple Sessions**: Create and manage multiple terminal sessions
- **Command History**: Persistent command history and output
- **AI Terminal Assistant**: Get explanations for terminal commands and outputs
- **Visual Output**: Clear, formatted command results

### 🚀 One-Click Deployment
- **Vercel Integration**: Deploy directly to Vercel
- **Netlify Support**: Push to Netlify with configuration
- **Cloudflare Pages**: Optimized for Cloudflare deployment
- **Export Options**: Download as ZIP, generate PWA, or create APK

### 🎨 Modern UI/UX
- **Dark Mode**: Beautiful dark theme with violet accents
- **Responsive Design**: Optimized for desktop and mobile (360x800+)
- **Arabic Support**: RTL layout and Arabic language support
- **Accessible**: WCAG compliant design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

#### Option 1: Automated Setup (Recommended)

**Linux/macOS:**
```bash
git clone <repository-url>
cd yousef-ss
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
git clone <repository-url>
cd yousef-ss
setup.bat
```

#### Option 2: Manual Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd yousef-ss
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment:**
```bash
cp .env.example .env.local
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Edit `.env.local` to configure your AI providers and integrations:

```env
# AI API Keys (Optional - can be set in UI)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# GitHub Integration
GITHUB_TOKEN=your_github_token_here

# Deployment Keys
VERCEL_TOKEN=your_vercel_token_here
NETLIFY_TOKEN=your_netlify_token_here
CLOUDFLARE_TOKEN=your_cloudflare_token_here
```

### AI Providers

The platform supports multiple AI providers:

- **GPT-4**: OpenAI's most capable model
- **Claude**: Anthropic's reasoning-focused model
- **DeepSeek**: Specialized coding model
- **Custom Models**: Add your own API endpoints

## 🏗️ Architecture

### Core Components

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Input, etc.)
│   ├── CodeEditor.tsx  # Monaco editor wrapper
│   ├── FileTree.tsx    # File explorer component
│   └── Terminal.tsx    # Terminal interface
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── lib/                # Utility functions
└── styles/             # Global styles and themes
```

### State Management

Uses Zustand for efficient state management:

- **AI Agent State**: Provider, memory, context
- **File System**: Projects, files, editor tabs
- **UI State**: Sidebars, modals, settings
- **Terminal State**: Sessions, command history

## 🚀 Deployment

### Cloudflare Pages (Recommended)

```bash
npm run build && npm run export
```

Upload the `dist` folder to Cloudflare Pages.

### Vercel

```bash
vercel --prod
```

### Netlify

```bash
npm run build && npm run export
netlify deploy --prod --dir=dist
```

### Docker

```bash
docker build -t yousef-ss .
docker run -p 3000:3000 yousef-ss
```

## 🤖 AI Agent Usage

### Smart Commands

The AI agent responds to natural language commands:

- **"Explain this file"** - Get detailed code explanations
- **"Fix this error"** - Automatic error detection and fixes
- **"Add documentation"** - Generate comprehensive docs
- **"Optimize this code"** - Performance improvements
- **"Create a React component"** - Generate boilerplate code

### Context Awareness

The agent maintains context of:
- Current file content
- Project structure
- Recent commands
- Error messages
- User preferences

### Keyboard Shortcuts

- `Ctrl/Cmd + J` - Explain selected code
- `Ctrl/Cmd + Shift + A` - Open AI chat
- `Ctrl/Cmd + Shift + T` - Toggle terminal
- `Ctrl/Cmd + Shift + E` - Toggle file explorer

## 📱 Mobile Support

Optimized for mobile development:

- **Responsive Layout**: Adapts to screen sizes from 360px
- **Touch Controls**: Swipe gestures and touch-friendly UI
- **Mobile Terminal**: Full terminal functionality on mobile
- **Floating Actions**: Quick access to common functions

## 🌍 Internationalization

### Supported Languages

- **English**: Default language
- **Arabic**: Full RTL support

### Adding Languages

1. Create translation files in `src/locales/`
2. Update language selector in settings
3. Add RTL support if needed

## 🔌 Integrations

### GitHub

- Import repositories
- Push changes
- Create pull requests
- Sync with remote

### Deployment Platforms

- **Vercel**: Direct deployment with build configuration
- **Netlify**: Form handling and edge functions
- **Cloudflare Pages**: Edge deployment with Workers

## 🛠️ Development

### Project Structure

```
yousef-ss/
├── public/             # Static assets
├── pages/              # Next.js pages
├── src/                # Source code
├── docker-compose*.yml # Docker orchestration (legacy)
├── Dockerfile          # Custom container (legacy)
└── setup.*             # Installation scripts
```

### Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run export      # Export static files
npm run lint        # Run ESLint
npm run type-check  # TypeScript checking
```

### Adding New Features

1. **Components**: Create in `src/components/`
2. **Store**: Add state in `src/store/useAppStore.ts`
3. **Types**: Define in `src/types/index.ts`
4. **Styles**: Use Tailwind classes or add to `globals.css`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [same.new](https://same.new) and [manus.im](https://manus.im)
- Built with [Next.js](https://nextjs.org/), [Monaco Editor](https://microsoft.github.io/monaco-editor/), and [Tailwind CSS](https://tailwindcss.com/)
- AI integration powered by OpenAI, Anthropic, and DeepSeek APIs

## 📧 Support

For support and questions:
- Open an issue on GitHub
- Join our Discord community
- Email: support@yousefss.dev

---

**Made with ⚡ by Yousef SS**


