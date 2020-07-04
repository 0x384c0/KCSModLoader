### This is experimental chrome extension, that can inject custom code in to the KC.

### Requirements
* latest Chrome browser

### Usage
* dowload and extract latest release
* go to `chrome://extensions`
* Enable Developer Mode by clicking the toggle switch next to Developer mode.
* Click the `LOAD UNPACKED` button and select the `src` directory, where `manifest.json` is located.
* load game

### Compiling
* `cd src\library\shared\page_script_module`
* `npm install`
* `npm run build`

### Replace ingame images or sounds
* place assets, you want replace, in to `resources/default/kcs2` (for example `resources/default/kcs2/img/title/title_main.png` to change logo in start screen)
* load game

### TODO
* customize nigh double attack
* customize all special attacks (PhaseNelsonTouch,PhaseKongoAttack etc.)
* customize PhaseAttackRocket

### TODO refactor
* use webpack for compiling all modules
* catch all errors
* add self diagnostics
