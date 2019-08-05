var interceptor = null
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command == "toggle_intercept") {
        if (interceptor != null && interceptor.isStarted) {
            interceptor.stop()
        } else {
            chrome.tabs.getSelected(null, function (tab) {
                interceptor = new RequestInterceptor(
                    tab.id,
                    [
                        {
                            urlPattern: "http://example.com/",
                            modifyHandler: (body) => {
                                return body.replace("<h1>Example Domain</h1>", "<h1>TEST TES Example Domain</h1>")
                            }
                        },
                        {
                            urlPattern: "https://www.google-analytics.com/analytics.js",
                            modifyHandler: (body) => {
                                return "alert('TEst opennet  analytics')" + body
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
            })
        }

        sendResponse()
    }
});