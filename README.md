# danielecomoglio.com

Static website for Daniele Comoglio.

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
