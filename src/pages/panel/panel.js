const interceptor = new RequestInterceptor(
    chrome.devtools.inspectedWindow.tabId,
    [
        {
            urlPattern: "http://example.com/",
            modifyHandler: (body) => {
                return body.replace("<h1>Example Domain</h1>", "<h1>TEST TES Example Domain</h1>")
            }
        },
        {
            urlPattern: "https://blog.hubspot.com/hubfs/image8-2.jpg",
            imageUrl: "https://www.iconplc.com/site-files/cms-templates/images/open-graph/OG_Facebook.png"
        },
        {
            urlPattern: "https://www.google.com/test",
            imageUrl: "https://www.iconplc.com/site-files/cms-templates/images/open-graph/OG_Facebook.png"
        }
    ]
)

// interceptor.start()


document.getElementById("toggle_button").addEventListener("click", toggle_redirect);

let resourceOverride = new KCSResourceOverride("resources/default", "../../")
function toggle_redirect() {
    if (resourceOverride.isStarted) {
        resourceOverride.stop()
        console.log("stoppped")
    } else {
        resourceOverride.start()
        console.log("started")
    }
}
//"kcs2/img/title/title2.png",
//http://203.104.209.87/kcs2/img/title/title2.png?version=4.0.0.0
//chrome-extension://cigcbmmbmjnfdmfckngppcleemmfpjbi/resources/default/kcs2/img/title/title2.png