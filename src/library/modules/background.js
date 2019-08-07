//utils
const detector = new KCSDetector(willLoadKCS, willUnoadKCS)
const resourceOverride = new KCSResourceOverride("resources/default", "../../")
//vars
const injectPixiScriptsHtml = "<script src=\"" + chrome.runtime.getURL("library/shared/PIXIInjections.js") + "\"></script>\n"
const injectScriptsUrls = [
    chrome.runtime.getURL("library/shared/KCSInjections.js")
]
const injectScriptsHtml = injectScriptsUrls.map(url => "<script src=\"" + url + "\"></script>").join("")
const injectCode = "injectKCSMods(\"" + chrome.runtime.getURL("") + "\");"
var interceptor = null

function willLoadKCS() {
    if (interceptor == null || !interceptor.isStarted) {
        chrome.tabs.getSelected(null, function (tab) {
            interceptor = new RequestInterceptor(
                tab.id,
                [
                    {
                        urlPattern: "*://*/kcs2/index.php*",
                        searchPattern: "/kcs2/index.php",
                        modifyHandler: (body) => {
                            console.log("intercept kcs2/index.php")
                            delayStopInterceptor()
                            didInjectKCSMods()
                            return body
                                .replace("<script src=\"./js/main.js", injectPixiScriptsHtml + "<script src=\"./js/main.js")
                                .replace("<script>KCS.init()</script>", injectScriptsHtml + "<script>" + injectCode + "</script>")
                                .replace("!function(t){function e(t){null!=t&&", "document.kcs_SE = e;!function(t){function e(t){null!=t&&")
                        }
                    }
                ]
            )
            interceptor.start()
        })
    }
}

function willUnoadKCS() {
    resourceOverride.stop()
}


function didInjectKCSMods() {
    resourceOverride.start()
}

function delayStopInterceptor() {
    window.setTimeout(() => { interceptor.stop(); }, 500);
}
