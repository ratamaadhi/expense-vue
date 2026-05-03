# Deployment Guide

Complete guide for deploying Expense Tracker to various platforms.

## Table of Contents

- [Dokploy Deployment](#dokploy-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Dokploy Deployment

### Prerequisites

- Active Dokploy instance
- Git repository (GitHub, GitLab, or Bitbucket)
- Backend API deployed and accessible

### Step-by-Step

#### Option 1: Nixpacks (Auto-detect)

1. **Create Application**
   - Log in to Dokploy dashboard
   - Click "New Application"
   - Select "Git" as source

2. **Configure Repository**
   ```
   Repository URL: https://github.com/YOUR_USERNAME/expense-ui-vue.git
   Branch: main
   Build Path: /
   ```

3. **Build Settings** (Auto-detected)
   ```
   Build Command: npm run build
   Publish Directory: ./dist
   Install Command: npm install
   ```

4. **Environment Variables** (Optional)
   ```
   VITE_API_BASE_URL=https://your-api.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

6. **Domain Configuration**
   - Go to "Domains" tab
   - Click "Generate Domain"
   - Set port to `80`

#### Option 2: Dockerfile

1. **Select Dockerfile as Build Type**

2. **Build Settings**
   ```
   Docker Context: /
   Dockerfile Path: ./Dockerfile
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   ```

4. **Deploy**

---

## Docker Deployment

### Local Testing

```bash
# Build image
docker build -t expense-tracker .

# Run container
docker run -p 3002:80 expense-tracker
```

Access at `http://localhost:3002`

### Docker Compose

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f
```

### Production Docker

```bash
# Build with tag
docker build -t expense-tracker:latest .

# Tag for registry
docker tag expense-tracker:latest registry.example.com/expense-tracker:latest

# Push to registry
docker push registry.example.com/expense-tracker:latest

# Run in production
docker run -d \
  --name expense-tracker \
  -p 80:80 \
  --restart unless-stopped \
  expense-tracker:latest
```

---

## Environment Variables

### Available Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | `/api` | No |
| `NODE_ENV` | Environment mode | `production` | No |

### Configuration Examples

#### Development (with Vite proxy)
```bash
VITE_API_BASE_URL=/api
```
Uses Vite proxy configured in `vite.config.ts`

#### Production (with nginx proxy)
```bash
VITE_API_BASE_URL=/api
```
Uses nginx proxy in `nginx.conf`

#### Direct API Access
```bash
VITE_API_BASE_URL=https://expense-api.ratama.space/api
```
Connects directly to API (CORS must be configured on API server)

---

## Troubleshooting

### Build Issues

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Run build locally first
npm run build

# Check TypeScript version
npm list typescript
```

**Problem**: Module not found errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Runtime Issues

**Problem**: Blank page after deployment

**Solutions**:
1. Check browser console for errors
2. Verify `dist/` folder contains files
3. Check nginx configuration for SPA routing
4. Verify API is accessible

**Problem**: API calls failing (CORS errors)

**Solutions**:
1. Use nginx proxy (default with Docker)
2. Configure CORS on API server
3. Use environment variable for direct API access

**Problem**: Routes not working (404 on refresh)

**Solution**: Ensure nginx `try_files` directive:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Docker Issues

**Problem**: Container exits immediately

**Solution**: Check logs
```bash
docker logs expense-tracker
```

**Problem**: Port already in use

**Solution**:
```bash
# Find process using port 3002
lsof -ti:3002 | xargs kill -9

# Or use different port
docker run -p 3001:80 expense-tracker
```

---

## Platform-Specific Notes

### Netlify

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/api/*"
  to = "https://expense-api.ratama.space/api/:splat"
  status = 200
```

### Vercel

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://expense-api.ratama.space/api/:path*" },
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

### AWS S3 + CloudFront

1. Build app: `npm run build`
2. Upload `dist/` to S3 bucket
3. Configure CloudFront:
   - Add custom error responses for 403/404 → /index.html
   - Configure origin for /api/* to backend API

---

## Monitoring

### Health Checks

The Docker container includes a health check:
```bash
# Test health endpoint
wget --quiet --tries=1 --spider http://localhost/
```

### Logs

**Docker**:
```bash
docker logs -f expense-tracker
```

**Dokploy**: View logs in application dashboard

---

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **API Keys**: Never commit API keys to repository
3. **CORS**: Configure proper CORS on API server
4. **Headers**: Security headers included in nginx.conf
5. **Dependencies**: Regularly update dependencies

---

## Support

For issues related to:
- **Dokploy**: https://docs.dokploy.com
- **Docker**: https://docs.docker.com
- **Vue/Vite**: https://vuejs.org, https://vitejs.dev
