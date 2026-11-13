# RYSEN content backend

The website now includes a Node.js backend with persistent JSON storage for:

- blog posts and categories;
- case studies;
- contact-form entries and follow-up notes.

## Run locally

```bash
npm run dev
```

This starts the Vite website on `http://127.0.0.1:5173` and the API on `http://127.0.0.1:8787`. Vite proxies `/api` requests to the backend.

Admin screens:

- `/admin` — overview and backend status;
- `/admin/resources` — blog editor;
- `/admin/case-studies` — case-study editor;
- `/admin/contacts` — contact entries and follow-up tracking.

## Production

Build and start the unified server:

```bash
npm run build
npm start
```

The production server exposes the API and serves the built React application from the same origin. Set `PORT` to change the default production port (`8787`) and `HOST` when the hosting platform requires a specific bind address. Production defaults to `0.0.0.0`.

Required production environment:

```bash
NODE_ENV=production
HOST=0.0.0.0
PORT=8787
ADMIN_PASSWORD=use-a-long-unique-password
SITE_URL=https://www.rysenconsulting.com
VITE_SITE_URL=https://www.rysenconsulting.com
VITE_RECAPTCHA_SITE_KEY=your-public-recaptcha-v3-site-key
RECAPTCHA_SECRET_KEY=your-private-recaptcha-v3-secret-key
RECAPTCHA_MIN_SCORE=0.5
```

`VITE_SITE_URL` and `VITE_RECAPTCHA_SITE_KEY` must be present during `npm run build`. `SITE_URL`, `RECAPTCHA_SECRET_KEY`, and `RECAPTCHA_MIN_SCORE` are runtime server settings. The private reCAPTCHA secret must never use the `VITE_` prefix.

Register reCAPTCHA v3 keys for the production domain in the Google reCAPTCHA console. The contact form executes the `contact` action at submission time, and the backend checks token validity, action name, and score before saving an enquiry. Production contact submissions fail closed when the private key is missing.

## Docker deployment

```bash
docker build --build-arg VITE_SITE_URL="https://www.rysenconsulting.com" \
  --build-arg VITE_RECAPTCHA_SITE_KEY="your-public-site-key" \
  -t rysen-leadership .
docker run -d --name rysen-leadership -p 8787:8787 \
  -e ADMIN_PASSWORD="use-a-long-unique-password" \
  -e SITE_URL="https://www.rysenconsulting.com" \
  -e RECAPTCHA_SECRET_KEY="your-private-secret-key" \
  -e RECAPTCHA_MIN_SCORE="0.5" \
  -v rysen-data:/app/server/data \
  rysen-leadership
```

Put the container behind an HTTPS reverse proxy and forward traffic to port `8787`. Keep the `rysen-data` volume mounted so articles, categories, case studies, and enquiries survive deployments.

## Admin login and protection

Set `ADMIN_PASSWORD` in the server environment to protect the admin console and every create, update, delete, draft-list, and contact-list operation. Copy `.env.example` into the deployment platform's environment configuration. Local `.env.local` and `.env` files are loaded when present, but hosting-platform environment variables take precedence.

Open `/admin/login` and enter the server password. Login creates a signed HttpOnly, SameSite session cookie that expires after 12 hours and remains valid across backend restarts. The cookie is not accessible to frontend JavaScript.

For local development only, the fallback password is `rysen-admin`. Always configure a strong `ADMIN_PASSWORD` before deployment.

Public published-content endpoints and contact submission remain available without authentication. Draft content and admin records do not.

## Persistence

Data is stored in `server/data/db.json`. Back up this file and mount the `server/data` directory on persistent storage when deploying to a container or serverless platform.

## API checks

With the backend running:

```bash
npm run test:api
```

The smoke test verifies categories, blogs, case studies, and contacts, then removes its temporary records afterward.


## Preserve live content when deploying

Articles, case studies, categories, enquiries and subscribers are stored in the server database, not in the frontend build. Local and production databases do not synchronise.

- Deploy code and built assets without uploading local server/data/db.json or local environment files.
- Keep the live database on persistent storage. The existing default is server/data/db.json. This is excluded from Git and Docker build contexts.
- For deployments that replace application folders, set DATABASE_PATH to an absolute path outside the release directory (for example /var/lib/rysen/db.json). The server account must be able to write to that directory.
- Before changing the path, stop writes/server, back up the existing LIVE database, and copy that live database to the new path. Only then set DATABASE_PATH and restart. A missing path creates a fresh database with starter content; it does not migrate existing data. Never replace it with your local database.
- For Docker, reuse the same named volume or host bind mount at /app/server/data across deployments. The Dockerfile VOLUME declaration alone is not a guarantee that a replacement container will reuse the same volume. Do not delete that volume during deployments.
- Keep scheduled backups of the live database and restore-test them. Run one backend process against this JSON file; multi-instance hosting requires a shared database with appropriate concurrency support.
- After deploying, verify existing articles, case studies and enquiries in the live admin. Source changes do not modify saved records. Changes to saved content must be made through the live admin.

No production storage has been configured by changing this repository; configure and verify the persistent path/volume on the actual host.
