# Astral Oracle - Tarot Reading App

A beautiful, mystical tarot reading application built with Next.js, featuring AI-powered interpretations with a Ghibli-inspired witchy aesthetic.

## Features

- 🎴 **Interactive Tarot Readings**: Choose from multiple spreads and select cards digitally or let the app draw for you
- 🔮 **AI-Powered Interpretations**: Get insightful, personalized readings powered by OpenAI GPT-4
- ✨ **Beautiful UI**: Immersive experience with smooth animations and mystical theming
- 📱 **Progressive Web App**: Installable PWA with offline support
- ♿ **Accessible**: Built with accessibility in mind with keyboard navigation and ARIA labels
- 💾 **Reading History**: Save and revisit your past readings

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tarot-app/tarot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the `tarot` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
tarot/
├── src/
│   ├── app/              # Next.js app router pages and actions
│   ├── components/       # React components
│   ├── lib/              # Type definitions and utilities
│   └── pages/           # API routes
├── public/              # Static assets
└── data/                # Tarot card and spread data
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: OpenAI GPT-4
- **PWA**: next-pwa
- **Validation**: Zod

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

Private project - All rights reserved
