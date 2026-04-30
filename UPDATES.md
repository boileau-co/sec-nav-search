# Updates & Versioning

This plugin uses [Plugin Update Checker (PUC)](https://github.com/YahnisElsts/plugin-update-checker) to pull updates straight from GitHub releases — same pattern as Tabby Cat. The library lives in `lib/plugin-update-checker/`.

## One-time GitHub setup

### 1. Create the GitHub repo

1. New repo on GitHub: `secondary-nav-search`. Public is simplest (no auth-token-on-every-site headache).
2. Don't initialize with a README; we'll push our own.

### 2. Add Plugin Update Checker to the plugin

1. Download the latest release from https://github.com/YahnisElsts/plugin-update-checker/releases/latest
2. Extract the ZIP. Rename the resulting folder from `plugin-update-checker-X.Y` to just `plugin-update-checker`.
3. Move it into `lib/` so the path is `lib/plugin-update-checker/plugin-update-checker.php`.

### 3. Update the GitHub URL placeholder

In `secondary-nav-search.php`, replace `YOUR-USERNAME` with the actual GitHub account or org:

```php
'https://github.com/YOUR-USERNAME/secondary-nav-search/',
```

If the repo is private, also uncomment and fill in the `setAuthentication()` line with a Personal Access Token (`Contents: read` scope on a fine-grained token, or `repo` on a classic).

### 4. Push to GitHub

```bash
cd secondary-nav-search
git init
git add .
git commit -m "Initial commit: v1.0.0"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/secondary-nav-search.git
git push -u origin main
```

### 5. Cut the first release

1. GitHub → **Releases → Draft a new release**.
2. **Choose a tag → Create new tag:** `v1.0.0` (must match the Version in the plugin header).
3. **Title:** `v1.0.0`.
4. **Description:** copy the matching `## v1.0.0` block from this file.
5. Optionally attach a clean ZIP of the plugin folder under "Attach binaries" (the code is configured to prefer release assets via `enableReleaseAssets()`). If you skip this, PUC falls back to GitHub's auto-generated source ZIP.
6. **Publish release.**

### 6. Install on a site (one time per site)

1. Download the ZIP from the GitHub release.
2. WP Admin → Plugins → Add New → Upload Plugin → activate.

From here on, updates flow automatically on every site running it.

## Ongoing update workflow

Every time you ship a change:

1. **Bump the version** in two places in `secondary-nav-search.php`:
   - The `Version:` line in the plugin header
   - The `SNS_VERSION` constant
2. **Add a changelog entry** below in this file under a new `## v1.x.x` heading.
3. **Commit + push** to `main`:
   ```bash
   git add .
   git commit -m "v1.x.x: <short description>"
   git push
   ```
4. **Cut the release** on GitHub with the matching tag (`v1.x.x`). Attach a clean ZIP if you went that route.

Within a few hours — or after manually clicking "Check Again" on WP Admin → Dashboard → Updates — every site running the plugin will see the new version and offer to update.

## Tagging notes

- PUC matches the `Version:` header against the highest semver-looking tag in the repo
- Tag format `v1.2.0` or `1.2.0` both work
- Always bump the version *before* tagging — otherwise sites see "v1.2.0 available" but install the same code they already have

## Troubleshooting

- **404 errors on update check:** repo is private without an auth token, or username in the plugin code doesn't match the actual GitHub account, or no releases have been published yet.
- **Site keeps showing "up to date" after a release:** WP caches update checks; click "Check Again" on the Updates page to force one. For deeper debugging, install the **Debug Bar** plugin — PUC adds a panel with a manual check button and request logs.
- **Update installs but version doesn't change:** `Version:` header in the new release wasn't bumped. PUC compares headers, not tag names.

---

## Changelog

### v1.0.0

- Initial release.
- Adds a magnifier icon to the Divi secondary nav with a slide-down + fade animation that mirrors Divi's primary nav search.
- Existing secondary menu items + social icons slide down + fade out in unison with the search opening.
- Optional integration with SearchWP Live Ajax Search (autocomplete dropdown). Works with native WordPress search if SearchWP isn't installed.
- ESC to close, focus management, ARIA attributes for accessibility.
- GitHub auto-updater via Plugin Update Checker.
