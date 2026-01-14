# Pardon My French - French Cloze Test Application

A secure, anti-cheat enabled French language examination application for Austrian Gymnasium students (Grade 9). Features comprehensive keystroke logging, screenshot protection, and detailed PDF reporting.

## Features

- ✅ **10 High-Quality Exercises** - Covering Passé Composé, Imparfait, Passé Simple, Plus-que-parfait
- ✅ **Advanced Anti-Cheat** - Screenshot protection, focus loss detection, DevTools blocking
- ✅ **Keystroke Analytics** - Comprehensive behavioral analysis with PDF export
- ✅ **Secure Testing Environment** - Multiple layers of protection against cheating
- ✅ **PDF Reports** - Detailed examination results with keystroke logs

## Run Locally

**Prerequisites:** Node.js (version 18 or higher recommended)

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start the development server (with hot reload)
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally

## Deployment to GitHub Pages

This repository is configured for automatic deployment to GitHub Pages.

### Automatic Deployment

The app automatically deploys to GitHub Pages when you push to the `main` branch via GitHub Actions.

**Live URL:** https://cosmicslothoracle.github.io/Pardonmyfrench/

### Manual Deployment

1. **Build the app:**
   ```bash
   GITHUB_PAGES=true npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Go to repository Settings → Pages
   - Select source: "GitHub Actions"
   - The workflow will automatically deploy on push to `main`

### Configuration

- **Base Path:** `/Pardonmyfrench/` (configured in `vite.config.ts`)
- **Build Output:** `dist/` directory
- **Workflow:** `.github/workflows/deploy.yml`

## Notes

- **No API keys required** - The app uses static exercise content, no external APIs needed
- The development server runs on port 3000 by default
- All exercises are pre-loaded and ready to use
- Anti-cheat features are active during testing mode
- PDF password protection is not implemented (browser limitations)

## Repository

- **GitHub:** https://github.com/CosmicSlothOracle/Pardonmyfrench
- **Remote:** `pardonmyfrench` (use `git remote -v` to verify)

## License

Private project for educational use.
