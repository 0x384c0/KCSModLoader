class KCSResourceOverride {
    //private
    _isStarted = false

    _redirectIfNeeded(details) {
        let newUrl = this.overridden_resources.find(url => details.url.includes(url))
        if (newUrl == null)
            newUrl = details.url
        else {
            newUrl = chrome.runtime.getURL(this.path + "/" + newUrl)
        }
        console.log("redirect from: " + details.url + " to: " + newUrl)
        return { redirectUrl: newUrl }
    }


    //public
    get isStarted() {
        return this._isStarted
    }

    async start() {
        if (this._isStarted)
            return

        this.overridden_resources = await fetch(this.path + "/overridden_resources.json").then(response => response.json())

        this._redirectListener =  details => { return this._redirectIfNeeded(details) }
        chrome.webRequest.onBeforeRequest.addListener(
            this._redirectListener,
            {
                urls: this.overridden_resources.map(url => "*://*/" + url + "*"),
                types: []
            },
            ["blocking"]);
        this._isStarted = true
    }

    stop() {
        if (!this._isStarted)
            return
        chrome.webRequest.onBeforeRequest.removeListener(this._redirectListener)
        this._isStarted = false
    }

    constructor(path) {
        this.path = path
    }
}
