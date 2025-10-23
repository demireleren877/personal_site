# Cloudflare Pages Build Settings

## Build Configuration

### Build Command:
```bash
npm run build
```

### Build Output Directory:
```
build
```

### Root Directory:
```
/
```

### Node.js Version:
```
18.x
```

## Environment Variables

### Production:
```
REACT_APP_API_URL=https://personal-site-api.l5819033.workers.dev
```

## Build Settings Summary

- **Framework preset**: Create React App
- **Build command**: `npm run build`
- **Build output directory**: `build`
- **Root directory**: `/` (leave empty)
- **Node.js version**: 18.x

## Deployment Steps

1. Go to Cloudflare Dashboard → Pages
2. Create a project
3. Connect your Git repository OR upload build folder
4. Set build settings as above
5. Add environment variable: `REACT_APP_API_URL=https://personal-site-api.l5819033.workers.dev`
6. Deploy

## Alternative: Direct Upload

If Git connection fails, you can:

1. Run `npm run build` locally
2. Upload the `build` folder directly to Cloudflare Pages
3. Set custom domain (optional)
