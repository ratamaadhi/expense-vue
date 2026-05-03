# Expense Tracker

Vue 3 + TypeScript + Vite expense tracking application with shadcn-vue components.

## Features

- ✅ Track income and expenses
- ✅ Manage categories with custom colors
- ✅ Set and monitor budgets
- ✅ Interactive dashboard with financial summary
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Indonesian Rupiah (IDR) currency formatting

## Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + shadcn-vue
- **State**: Pinia
- **Routing**: Vue Router
- **API**: Axios
- **Icons**: Lucide Vue

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | API base URL | `/api` |

## Deployment

### Dokploy (Recommended)

1. Push code to Git repository
2. Create new application in Dokploy
3. Configure:
   - **Repository**: Your Git URL
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `./dist`
4. Add environment variable (optional): `VITE_API_BASE_URL=https://your-api.com/api`
5. Deploy!

### Docker

Build and run with Docker:

```bash
# Build image
docker build -t expense-tracker .

# Run container
docker run -p 3002:80 expense-tracker
```

Or use Docker Compose:

```bash
docker-compose up -d
```

Access at `http://localhost:3002`

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service (Netlify, Vercel, AWS S3, etc.)

3. Configure your server/nginx to proxy `/api` requests to your backend API.

## Project Structure

```
src/
├── components/         # Vue components
│   ├── ui/            # shadcn-vue components
│   └── ...
├── composables/       # Vue composables
├── lib/              # Utilities (API client, helpers)
├── stores/           # Pinia stores
├── types/            # TypeScript types
├── views/            # Page components
└── main.ts           # App entry point
```

## API Integration

This application connects to the Expense API at `https://expense-api.ratama.space/api`.

For custom API configuration, update the `VITE_API_BASE_URL` environment variable.
