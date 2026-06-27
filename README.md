# Zbeul folder - Useless for most - Easier for me to have static links for free+VCS

## DONE

### PKGBUILD

* **antigravity-cli**: Package for the Google Antigravity CLI companion tool (`agy`).
* **antigravity-ide**: Package for the VS Code-based Google Antigravity IDE.
* **antigravity-orchestrator**: Package for the Electron-based Google Antigravity Hub orchestration platform.
* **xone-dkms-git-custom**: Custom xone-dongle-dkms module spoofing firmware and MAC address for specific clone dongles.

### Dotpatches

* **xone-custom-dongle.patch**: Automatically spoofs firmware and MAC address for Aliexpress clone dongles, used in `xone-dkms-git-custom`.

### Userscript

* **Reddit-VO**: Remove auto translation from Reddit when searching from search engine

## Broken

### PKGBUILD

*(None)*

### Dotpatches

*(None)*

### Userscript

* **Anilist-redirect**: Redirects to AniList, currently broken.
* **Anilist_MAL-button**: Integrates AniList/MAL button, currently broken.
* **MAL-redirect**: Redirects to MyAnimeList, currently broken.

## WIP

### Hardware config tools

* **ryujin-screen-control**: Future tool to make the Asus Ryujin screen handle wakeup and sleep modes properly, avoiding constant signal spamming.
* **ryujin-temp-led**: Future custom temp curves (YAML/JSON config) and led control for Asus Ryujin coolers.
* **zaopin-z1-pro-driver**: Future profile integration or dedicated tool to configure polling rate settings for Compx dongles.
* **aula-hero-84-he-driver**: Keyboard settings control for AULA Hero 84 HE keyboards.
* **darmoshark-q13-qmk**: QMK/ZMK firmware rewrite to enable native VIA compatibility for Darmoshark keyboards.

# Reason & Conclusion

* **Goal**: Backup configs. Make fresh installs easy on other machines.
* **Objective**: First year on Linux. Learning coding, Linux, and AI/LLM orchestration.
* **Security & PGP**: Commits not verified. Proper PGP is serious work, cannot do correctly now. Fake security is bad. So keep unverified for honesty. Look at `checksums.txt` in each folder to verify files.
* **Disclaimer**: Do not use these tools. Too much risk if GitHub or agy gets hacked. If you still use, clone to your side. No fork. No issues. No requests. Do not contact me. I do not exist.
