//utils
const detector = new KCSDetector(willLoadKCS, willUnoadKCS)
const resourceOverride = new KCSResourceOverride("resources/default", "../../")
//vars
const injectPixiScriptsHtml = "<script src=\"" + chrome.runtime.getURL("library/shared/PIXIInjections.js") + "\"></script>\n"
const injectScriptsUrls = [
    chrome.runtime.getURL("library/shared/CustomExplosion.js"),
    chrome.runtime.getURL("library/shared/CustomLayerExplosion.js"),
    chrome.runtime.getURL("library/shared/CustomPhaseAttackNormal.js"),
    chrome.runtime.getURL("library/shared/KCSInjections.js")
]
const injectScriptsHtml = injectScriptsUrls.map(url => "<script src=\"" + url + "\"></script>").join("")
const injectCode = "injectKCSMods();"
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
                            return body
                                .replace("<script src=\"./js/main.js", injectPixiScriptsHtml + "<script src=\"./js/main.js")
                                .replace("<script>KCS.init()</script>", injectScriptsHtml + "<script>" + injectCode + "KCS.init()</script>")
                                .replace("!function(t){function e(t){null!=t&&", "document.kcs_SE = e;!function(t){function e(t){null!=t&&")
                        }
                    },
                    {
                        urlPattern: "*://*/kcs2/js/main.js*",
                        searchPattern: "/kcs2/js/main.js",
                        modifyHandler: (body) => {
                            console.log("intercept kcs2/js/main.js")
                            delayStopInterceptor()
                            didInjectKCSMods()
                            return body
                                .replace("e.PhaseAttackNormal=_", "document.kcs_PhaseAttackNormal = e;e.PhaseAttackNormal=_")
                                .replace("e.LayerExplosion=u", "document.kcs_LayerExplosion = e;e.LayerExplosion=u")
                        }
                    },
                    {
                        urlPattern: "https://www.google.com/test",
                        imageUrl: chrome.runtime.getURL("assets/img/icon/icon_500.png")
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
