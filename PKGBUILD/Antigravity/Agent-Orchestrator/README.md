# Antigravity Orchestrator PKGBUILD

## Description
This PKGBUILD packages the Google Antigravity Hub, a multi-agent desktop orchestration platform powered by Electron.

## Installation Targets
* **Downloads**: Precompiled `Antigravity.tar.gz` from Google Cloud Storage and the hub SVG icon.
* **Installs**: 
  * App framework tree to `~/.local/share/Antigravity/`
  * Launcher symlink to `~/.local/bin/antigravity`
  * System icon to `~/.local/share/icons/`
  * Desktop menu entry with custom URL scheme support (`antigravity://`) to `~/.local/share/applications/`

## Testing
* Tested on CachyOS.
