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

interceptor.start()


document.getElementById("toggle_button").addEventListener("click", toggle_redirect);

let redirectListener = function (details) {
    return {redirectUrl: "chrome-extension://nfldpcedekkdpjmmahadaffilbfaofof/assets/img/icon/icon_48.png"};
}
let isRedirecting = false

function toggle_redirect(){
    if (isRedirecting){
        chrome.webRequest.onBeforeRequest.removeListener(redirectListener)
    } else {
        chrome.webRequest.onBeforeRequest.addListener(
            redirectListener,
            {urls: ["*://*/kcs2/resources/ship/card/0187_2689.png*"], types: []},
            ["blocking"]);
    }
    isRedirecting = !isRedirecting
}