### Currently not working due obfuscation of main.js

### Requirements
* latest Chrome browser

### Usage
* dowload and extract latest release
* go to `chrome://extensions`
* Enable Developer Mode by clicking the toggle switch next to Developer mode.
* Click the LOAD UNPACKED button and select the extension directory.
* load game

### Replace ingame images or sounds
* place assets, you want replace, in to `resources/default/kcs2` (for example `resources/default/kcs2/img/title/title_main.png` to change logo in start screen)
* load game



### TODO
* create deobfuscator, that works in runtime with heuristics (all symbols are stored in base64)
* add screen shake on impact
* add effects for bosses