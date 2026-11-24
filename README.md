# CHEN_STUDIO

Cinematic personal photography portfolio built with React, TypeScript, Vite, Tailwind CSS and Framer Motion.

The public edition contains 29 photographs exported as responsive WebP display images and thumbnails. All photography is the author's own work.

## Development

```powershell
npm ci
$env:VITE_STATIC_GALLERY='true'
$env:VITE_BASE_PATH='/chen-studio/'
npm run dev
```

## Production build

```powershell
npm ci
$env:VITE_STATIC_GALLERY='true'
$env:VITE_BASE_PATH='/chen-studio/'
npm run build
```

GitHub Actions deploys `dist/` to GitHub Pages after every push to `main`.

The online edition is a static portfolio snapshot. The private upload dashboard and original camera files are kept outside this repository.
