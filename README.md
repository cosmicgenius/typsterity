# Typsterity

A Typst speed-typesetting game inspired by TeXnique. How many formulas can you recreate in three minutes?

## About

Typsterity is a clone of the popular LaTeX speed-typing game TeXnique, but built for Typst - the modern typesetting system. Players are challenged to quickly and accurately reproduce mathematical formulas using Typst syntax within a three-minute time limit.

## Features

- **3-minute time limit**: Race against the clock to type as many formulas as possible
- **Progressive difficulty**: Formulas get harder as your score increases (easy → medium → hard)
- **Real-time rendering**: See how your Typst formulas should look (with fallback text rendering)
- **Accuracy tracking**: Monitor both your score and typing accuracy
- **Keyboard shortcuts**: Use Ctrl+Enter to quickly submit answers
- **Varied formula types**: Includes algebra, calculus, geometry, trigonometry, and more

## How to Play

1. Click "Start Game" to begin
2. A mathematical formula will be displayed
3. Type the exact Typst syntax to recreate the formula
4. Press Ctrl+Enter or click Submit to check your answer
5. Correct answers increase your score and load a new formula
6. Try to score as many points as possible in 3 minutes!

## Formula Examples

- Easy: `$x^2$`, `$a + b = c$`
- Medium: `$x = frac(-b plus.minus sqrt(b^2 - 4a c), 2a)$`
- Hard: `$mat(a, b; c, d) mat(x; y) = mat(a x + b y; c x + d y)$`

## Development

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

## Inspiration

This game is inspired by [TeXnique](https://github.com/akshayravikumar/TeXnique) by Akshay Ravikumar, but built specifically for the Typst typesetting system.
