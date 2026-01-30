# Robonet Documentation

This is the official documentation site for Robonet, built with VitePress.

## Development

### Prerequisites

- Bun 1.3.6 or higher
- Node.js 20 or higher

### Setup

```bash
bun install
```

### Development Server

```bash
bun run dev
```

This will start the development server at `http://localhost:5173`.

### Build

```bash
bun run build
```

This generates static files in `docs/.vitepress/dist`.

### Preview Production Build

```bash
bun run preview
```

### Quality Checks

Before committing, ensure these pass:

```bash
# Type checking
bun run typecheck

# Linting
bun run lint

# Build
bun run build
```

## Deployment

The site is configured for automatic deployment to Netlify. Push to the main branch to trigger a deployment.

## Project Structure

```
robonet-docs/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts        # VitePress configuration
│   │   └── theme/           # Custom theme
│   ├── guide/               # User guides
│   ├── reference/           # Reference documentation
│   └── index.md             # Homepage
├── netlify.toml             # Netlify configuration
└── package.json
```

## Contributing

Documentation is maintained internally. For questions or issues, please contact the Allora Network team.
