# My litteral backup for some of the worst code and config files you'll see in your life.

## DONE :

### Userscript

- Reddit-VO : Remove auto translation from Reddit when searching from search
  engine

### PKGBUID

- xone-dongle-dkms-git-custom : Custom xone-dongle-dkms module, made for
  specific counterfeit product sold on Aliexpress (Auto spoof FW+Mac Adress)

## Broken

### Userscript

- All the userscripts related to AL or MAL should be broken, they can work in
  some cases but it's not something up to standard

## WIP

- Antigravity-CLI/IDE/Agent : They should work (as its proprietary, it's just
  something to download from Google server, add custom icon, .desktop, mime)
  - for Antigravity-CLI : The PKGBUILd do launch the first time for
    configuration PS : All PKG Build also have .install file for clean removal
    when uninstalling via Paru/Yay/Others PKG Builder (they are not available on
    AUR, and will probably never be, i find my repo more secure if i decide to
    make them orphans lol) You are advised to read the code before using them,
    i'm trying to use only core tools availble on Arch but it's something that
    should be done.

- Hardware config tools :
  - For now the only things i added (and not on the repo) avec udev rules, as
    they have all compatible webdriver they can be used this way for now, but my
    objective is to make them work with either their own tools (like
    FanControl/LiquidCTL/Libgratag - But dedicated to chinese knocfoff)
  - It will of course be by step, first make the Ryujin screen understand
    wakeup/sleep mode (i saw some reverse engineering, and i don't like how it's
    done, needing to spam signal everytime to let it in wake mode_
  - Still for Ryujin, made the abnormal temp led control work (and screen too) -
    For now i only have a python script using only hwmon to make a fancurve
    designeed specifically for my need (small case with hot component and shitty
    chipset) - Will improve it in the future with JSON/YAML config - Probably
    GUI tool too somewhere in the future.
  - For the Zaopin Z1 Pro, the web driver let control all the settingsd appart
    from the polling rate from the dongle (8k theorical max), so either create a
    profile to include it in existing tool, or create one dedicated to Compx
    dongle/Chinese peripherals
  - For AULA HERO 84 HE - Similar to the Zaopin, but without wireless
  - Darmoshark Q13 (Or SK13 ?), the firmware is still in dev mode it seems and
    cause some weird things with VIA, will potentially rewrite the QMK firmware
    to have correct detection without importing their .json, or work on the new
    ZMK using Perl who seems to have big benefits As you can see, its a lot of
    chinese component lol, and for now available Linux tools are oriented on
    Western manufacturers with high cost, for now i think it would be better to
    make a separate tool, either via forking or via new creation from base (only
    Ryujin II is western manufacturer and i saw some IA work for the LCD. but
    apart from 1 of the commits, the others are not understand one word of what
    they say, its 200 % vibe)

##PS : To be perfectly honest, i do use IA for coding too, and massively as it
cost me next to nothing, i'm not a dev at origin even if i learned in 15 years
ago when i was at highschool, but i do relearn it with the new tools available,
and all things vibe coded are reread by me + muliples agents, i also explictly
ask for pure respect of standard guideline (PEP8 for Python that i focus a lot,
PKG template build + Archwik, i do not produce vibe coded code if i am unable to
understand what it does, i can't promise 100 % of the code is known on my part
but most of it i know why its here and i take care to maintain TECHNICAL.md to
explain everything + comments and i don't minify the code I also respect
standard things, like never more than 80 lines for shell script, otherwise
switch to Python, and i will continue my learning on Python + learning JS (which
i'm not intested to but it's so much used nowadays), my goal is to be able to
write my own code in Go from A to Z. understanding Rust (while not using it
lol), and look around Zig that i found sayksi.

#### DISCLAIMER : For now i push unverified code, i'm in the process of creating my PGP key but i want to do that in a good way.

- Master Key created on a fresh device with latest OpenPGP version and standard,
  who never had been connected to net
- Subkey will also be created at this time, and i want to be sure about
  protocol, avoid something pushed by US standatdization for fear of backdoor)
- Export masterkey + subkey + trust.db - Master key encrypted on encrypted
  virtual drive on a hardware with some protection (not FIPS i'm too poor for
  that)
- Master key then put in a safe zone not accessible from me, in a safe/air
  locked zone (revocation date of 1 year)
- Subkey in encrypted virtual drive, need to confirm if i need to protect more
  the signing of verification key, but it will not be as secured as master key
  for obvious reason that i need them)
- I don't have for objective to have much subkey, 1 or 2 of each type, and will
  not be used for encryption only verif+signing
- I need to confirm cipher and digest for the subkey as t hey need to be able to
  run on some low powered device, which limit things
- Revocation key will be spread at people that i trust to do revocation in case
  i have an issue.

For now, until you do not see verified commits + Virustotal and sandbox run +
please do not use the more ambitious tools that will be posted. First
tag/pre-release will be when i'm confident of my IT sec process, anf first
release when im wll be sure the tool is working fine. For now i put GPU
licensing, as t he code available is already coming from GPU source ? Potential
upgrade to anoter licence in the future (While still open soure and copy left
free)

Its my first year on Linux and in dev in general (i came from hardware
debug/High level Tech support) so be gentle with me, i do my best to learn fast
lol. ALso waiting parts for reading controller on my devices+ wireshard
analysis, so again new tools to learn (tho i know a little already for those
from work)

I will not make great tools, it will never be 100 % human coded, but i'll do my
bst to make human the core of the project,IA is atool not a dev+lead
dev+manager.

Stay safe everyone !

