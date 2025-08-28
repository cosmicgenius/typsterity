# Typsterity

[TeXnique](https://texnique.xyz/) but for [Typst](https://typst.app/).
Claude Code wrote almost all of this.

## Development

According to Claude Code:

### Prerequisites

- Node.js (version 20.19+, 22.12+, or 24+)
- Yarn package manager

### Setup

1. Clone the repository
2. Install dependencies: `yarn install`
3. Start development server: `yarn dev`
4. Open http://localhost:3000 in your browser

### Build

```bash
yarn build
```

## Technology Stack

- **Frontend**: SvelteKit with TypeScript
- **Styling**: CSS (component-scoped)
- **Typst Rendering**: @myriaddreamin/typst.ts (with canvas fallback)
- **Build Tool**: Vite
