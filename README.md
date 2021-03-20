# Dark Soundcloud

This is a dark theme for Soundcloud inspired by Github Dark and Dark Gitlab.

## Installing

[![alt tag](https://img.shields.io/badge/Install%20directly%20with-Stylus-%233daee9?style=for-the-badge)](https://github.com/florianvazelle/dark-soundcloud/raw/master/dark-soundcloud.user.css)

#### Using a browser extension:

* Stylus - get the addon for [Firefox](https://addons.mozilla.org/en-US/firefox/addon/styl-us/), [Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne) and [Opera](https://addons.opera.com/en-gb/extensions/details/stylus/).

## Development

### Dependencies

Make sure you have these installed :

- [`node`](https://nodejs.org): version 12 or greater
- [`yarn`](https://classic.yarnpkg.com/en/docs/install/): version 1
- `make`: available with UNIX-like OS, on Windows you can use [this](https://stackoverflow.com/a/54086635/808699)

### Make targets

Run `make build install` to build the style and install in the default browser.

- `make deps`: Install development dependencies into `dark-soundcloud/node_modules`
- `make build`: Build `dark-soundcloud.user.css`
- `make install`: Install `dark-soundcloud.user.css`
- `make lint`: Run linters
- `make clean`: Format source files

Lesser used targets include:

- `make update`: Update dependencies
- `make`: Alias for `make build`