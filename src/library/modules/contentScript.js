const detector = new KCSDetector()
let injectScriptUrl = chrome.runtime.getURL("library/shared/KCSInjections.js");
let extensionUrl = chrome.runtime.getURL("");
var script = document.createElement('script');
script.src = injectScriptUrl;
script.innerText = "'"+extensionUrl+"'";
(document.head||document.documentElement).prepend(script);


window.addEventListener("message", function(event) {
    if (event.source != window)
        return;

    if (event.data.command && (event.data.command == "start_web_request")) {
    	detector.notifyStart()
    }
});