# danielecomoglio.com

Static mirror of the live WordPress site for Daniele Comoglio.

## URLs

- Staging: https://danielecomoglio-staging.ragaihub.com

## Branch Flow

- `staging`: auto-deploy to staging
- `main`: source branch for release preparation

## Local Preview

Open `index.html` in a browser.

## Deployment

Pushing to `staging` runs the GitHub Actions workflow that SSHes to the VPS and executes:

`/opt/danielecomoglio-site/scripts/deploy-staging.sh`

## Visual QA (BackstopJS + Playwright)

Install dependencies:

`npm install`

Create visual baseline from live site:

`npm run visual:reference`

Compare staging vs baseline:

`npm run visual:test:staging`

Optional direct screenshots:

- `npm run screenshots:live`
- `npm run screenshots:staging`

## Simply Static

Simply Static is not currently exposed on the public WordPress site, so this repo is generated via static mirror crawl.
