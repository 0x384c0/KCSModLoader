//utils
const detector = new KCSDetector(willLoadKCS, willUnoadKCS)
const resourceOverride = new KCSResourceOverride("resources/default", "../../")
//vars
const injectPixiScriptsHtml = "<script src=\"" + chrome.runtime.getURL("library/shared/PIXIInjections.js") + "\"></script>\n"
const injectScriptsUrls = [chrome.runtime.getURL("library/shared/KCSInjections.js")]
const injectScriptsHtml = injectScriptsUrls.map(url => "<script src=\"" + url + "\"></script>")
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
                            delayStopInterceptor()
                            didInjectKCSMods()
                            return body
                                .replace("<script src=\"./js/main.js", injectPixiScriptsHtml + "<script src=\"./js/main.js")
                                .replace("<script>KCS.init()</script>", injectScriptsHtml + "<script>" + injectCode + "KCS.init()</script>")
                        }
                    },
                    // {
                    //     urlPattern: "/kcs2/js/main.js",
                    //     modifyHandler: (body) => {
                    //         delayStopInterceptor()
                    //         return body.replace("<h1>Example Domain</h1>", "<h1>TEST TES Example Domain</h1>")
                    //     }
                    // },
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
