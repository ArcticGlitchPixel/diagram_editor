<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**A modern, powerful, and beautiful Mermaid.js diagram editor and previewer**

[English](README.md)

### Live Editor: [https://arcticglitchpixel.github.io/diagram_editor/](https://arcticglitchpixel.github.io/diagram_editor/)

[🎯 Features](#features) • [🚀 Quick Start](#quick-start) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing)

</div>

---

<img src="docs/images/screenshot-main.png" width="100%" alt="diagram editor preview"/>

<a name="features"></a>

## ✨ Features

### 🎨 **Professional Themes**
- **10+ Beautiful Themes**: Linear Light/Dark, Industrial, Hand Drawn, Studio Ghibli, Retro, and more
- **Custom Backgrounds**: Gradient, solid colors, and patterns
- **Font Selection**: Multiple professional fonts including Fira Code, JetBrains Mono, and more
- **Dark Mode**: Full dark mode support with automatic theme switching

### ⚡ **Powerful Editor**
- **Syntax Highlighting**: Real-time Mermaid syntax highlighting with color-coded keywords
- **Line Numbers**: Clear line numbering for easy reference
- **Auto-completion**: Smart suggestions for Mermaid syntax
- **Resizable Panels**: Adjustable editor and preview pane sizes

### 🖼️ **Advanced Export**
- **High-Quality Export**: Export diagrams in PNG (transparent) or JPG (with background)
- **Clipboard Copy**: One-click copy diagrams to clipboard with/without background
- **Custom Resolution**: Export at 3x resolution for crystal-clear images
- **Batch Export**: Export multiple diagrams at once

### 🎯 **Annotation Tools**
- **Drawing Tools**: Arrows, rectangles, circles, lines, and text annotations
- **Color Customization**: Customize annotation colors to match your theme
- **Multi-language Support**: Interface available in English and Spanish

### 🔧 **Interactive Features**
- **Live Preview**: Real-time rendering as you type
- **Auto-scaling**: Diagrams automatically scale to fit the viewport
- **Zoom & Pan**: Smooth zoom and pan controls with mouse/trackpad
- **Fullscreen Mode**: Distraction-free editing experience
- **Node Coloring**: Right-click on nodes to change colors

### 📊 **Supported Diagram Types**
- Flowcharts & Flow Diagrams
- Sequence Diagrams
- Class Diagrams
- State Diagrams
- Entity Relationship Diagrams
- User Journey Diagrams
- Gantt Charts
- Pie Charts
- Git Graphs
- Mindmaps
- Timeline Diagrams
- Quadrant Charts
- XY Charts
- And more!

---

## 🖼️ Screenshots

<details>
<summary>Click to expand screenshots</summary>

### Main Interface
![Main Interface](docs/images/screenshot-main.png)
<!-- Add main interface screenshot here -->

### Themes

<br/>

<table>
  <tr>
    <td width="33%"><img src="docs/images/screenshot-brutalist.png" alt="brutalist"/><br/><b>Brutalist</b></td>
    <td width="33%"><img src="docs/images/screenshot-cyberpunk.png" alt="cyberpunk"/><br/><b>Cyberpunk</b></td>
    <td width="33%"><img src="docs/images/screenshot-ghibli.png" alt="ghibli"/><br/><b>Ghibli</b></td>
  </tr>
  <tr>
    <td><img src="docs/images/screenshot-memphis.png" alt="memphis"/><br/><b>Memphis</b></td>
    <td><img src="docs/images/screenshot-spotless.png" alt="spotless"/><br/><b>Spotless</b></td>
    <td><img src="docs/images/screenshot-handdrawn.png" alt="handdrawn"/><br/><b>HandDrawn</b></td>
  </tr>
</table>

</details>

---

<a name="quick-start"></a>

## 🚀 Quick Start

Try it instantly in the **Live Editor**: [https://arcticglitchpixel.github.io/diagram_editor/](https://arcticglitchpixel.github.io/diagram_editor/)

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm, pnpm, or yarn

### Installation

```bash
# From a local checkout
cd diagram_editor

# Install dependencies (using pnpm recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Development

```bash
# Start development server
pnpm dev

# The app will be available at http://localhost:5173
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2 | UI Framework |
| **TypeScript** | 5.9 | Type Safety |
| **Vite** | 7.2 | Build Tool |
| **Tailwind CSS** | 4.1 | Styling |
| **Mermaid.js** | 11.12 | Diagram Rendering |
| **Lucide React** | 0.554 | Icons |
| **html-to-image** | 1.11 | Image Export |

---

<a name="documentation"></a>

## 📖 Documentation

Using the hosted app? Open the **Live Editor**: [https://arcticglitchpixel.github.io/diagram_editor/](https://arcticglitchpixel.github.io/diagram_editor/)

### Basic Usage

1. **Enter Mermaid Code**: Type your Mermaid diagram code in the left editor panel
2. **See Live Preview**: The diagram renders in real-time on the right
3. **Customize**: Choose themes, backgrounds, and fonts from the toolbar
4. **Annotate**: Use annotation tools to highlight important parts
5. **Export**: Download or copy your diagram in your preferred format

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Download diagram |
| `Ctrl/Cmd + C` | Copy to clipboard |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` | Redo |
| `Esc` | Exit fullscreen |

### Example Diagrams

```mermaid
graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> A
```

More examples available in the [examples directory](src/utils/examples.ts).

---

<a name="contributing"></a>

## 🤝 Contributing

We love contributions! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: Open an issue describing the bug
- 💡 **Suggest Features**: Share your ideas for new features
- 📝 **Improve Documentation**: Help us improve our docs
- 🌍 **Translations**: Add support for more languages
- 💻 **Code Contributions**: Submit pull requests

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `pnpm lint` before committing
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
