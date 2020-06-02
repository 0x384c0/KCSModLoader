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
* http://203.104.209.87/kcs2/js/main.js
* create deobfuscator, that works in runtime (https://github.com/javascript-obfuscator/javascript-obfuscator with base64 string encoding)
* inject code in after game loaded, recursively find objects and override them
* add screen shake on impact
* add effects for bosses