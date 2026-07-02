# mGit

GitHub repo showcase — view repos across multiple profiles with contribution heatmaps and commit activity sparklines.

**[Deployed site →](https://mscheetz.github.io/m-git/)**

## Features

- **Multi-profile** — add any GitHub username, toggle profiles on/off
- **Commit sparkline** — monthly commit bars on repo cards
- **Contribution heatmap** — merged GitHub-style contribution calendar across all selected profiles
- **Filters** — search by name, filter by language, toggle forks/archived
- **Rate-limit safe** — optional PAT bumps from 60 to 5000 req/hr

## Setup

```bash
git clone git@github.com:mscheetz/m-git.git
cd m-git/client
npm install
npm run dev       # local dev at localhost:5173
```

## Deploy

Push to `master` — GitHub Actions builds and deploys to GitHub Pages.

For authenticated API calls (5000 req/hr instead of 60):

1. Create a PAT at [github.com/settings/tokens](https://github.com/settings/tokens) — no scopes needed
2. Add it as a repository secret named `PAT_TOKEN` under Settings → Secrets and variables → Actions
3. The build workflow in `.github/workflows/deploy.yml` injects it at build time

## Stack

React 19, Tailwind CSS 4, Vite, @tanstack/react-query, GitHub REST + GraphQL APIs.
