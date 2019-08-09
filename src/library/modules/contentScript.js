//Util
const storage = new Storage()
const detector = new KCSDetector()

//Others
function injectScript(src){
    let injectScriptUrl = chrome.runtime.getURL(src);
    let extensionUrl = chrome.runtime.getURL("");
    var script = document.createElement('script');
    script.src = injectScriptUrl;
    script.innerText = "'"+extensionUrl+"'";
    (document.head||document.documentElement).prepend(script);
}

async function start(){
    const isResourceOverrideEnabled = await storage.getIsResourceOverrideEnabled()
    const isCustomEffectEnabled = await storage.getIsCustomEffectEnabled()
    if (isResourceOverrideEnabled)
    	injectScript("library/shared/PIXIInjections.js")
    detector.notifyStart()
    window.postMessage({command:"init_main_js",isCustomEffectEnabled:isCustomEffectEnabled}, "*")
} 

injectScript("library/shared/KCSInjections.js")
window.addEventListener("message", function(event) {
	if (event.source == window && event.data.command && event.data.command == "start_web_request")
        start()
});