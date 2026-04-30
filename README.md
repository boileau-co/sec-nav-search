# Secondary Nav Search

A WordPress plugin that adds a search icon to the [Divi](https://www.elegantthemes.com/gallery/divi/) secondary navigation. Click the icon, and a search input slides down from the top while the existing menu items slide away — mirroring Divi's primary nav search animation.

Compatible with [SearchWP](https://searchwp.com/) Pro and the free [SearchWP Live Ajax Search](https://wordpress.org/plugins/searchwp-live-ajax-search/) companion when installed; falls back to native WordPress search otherwise.

## Install

1. Upload the plugin ZIP via Plugins → Add New → Upload Plugin, or copy the folder into `wp-content/plugins/`.
2. Activate **Secondary Nav Search**.
3. Confirm the site has a Divi secondary menu enabled (Divi → Theme Customizer → Header & Navigation → Header Format → "Show Secondary Menu Bar").
4. *(Optional)* For autocomplete dropdown results, install **SearchWP Live Ajax Search** and toggle **SearchWP → Settings → Enable Live Search** on. Plays nicely with SearchWP Pro if you have it; works with the free Live Ajax plugin alone too.
5. *(If using WP-SCSS)* configure it to compile this plugin's SCSS folder:
   - **SCSS Location:** `wp-content/plugins/secondary-nav-search/assets/scss/`
   - **CSS Location:** `wp-content/plugins/secondary-nav-search/assets/css/`

> **Note:** The plugin ships with a precompiled `secondary-nav-search.css` so it works out of the box. WP-SCSS is only needed if you want to tweak the SCSS source on the live site.

## Structure

```
secondary-nav-search/
├── secondary-nav-search.php  Main plugin file
├── README.md
├── UPDATES.md                Setup notes + changelog
├── lib/
│   └── plugin-update-checker/  PUC library for GitHub auto-updates
└── assets/
    ├── scss/                 Source styles
    ├── css/                  Compiled output (enqueued by PHP)
    └── js/                   Form construction + behavior
```

## Customization

All theming variables live at the top of `assets/scss/secondary-nav-search.scss`:

- `$sns-bg` — top-header background color
- `$sns-text` — secondary menu text color
- `$sns-placeholder` — input placeholder color
- `$sns-fade-duration` / `$sns-slide-duration` — animation timing
- Dropdown card variables (`$sns-dropdown-*`) — only used when SearchWP Live Ajax is present

Edit, save, and (if WP-SCSS is configured) the CSS recompiles. Otherwise, compile locally and ship the new CSS in the next release.

## Hooks for further customization

The Divi secondary menu's `theme_location` is hard-coded to `secondary-menu`. If you want to repurpose this on a non-Divi theme, fork or wire the menu filter to a different theme location.

## Updates & versioning

See [UPDATES.md](UPDATES.md) for the full update workflow and changelog.
