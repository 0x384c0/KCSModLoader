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