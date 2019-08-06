
class KCSResourceOverride {
    //private
    _isStarted = false

    _redirectListener(details) {
        let newUrl = this.overridden_resources.find(url => details.url.includes(url))
        if (newUrl == null)
            newUrl = details.url
        else {
            newUrl = chrome.extension.getURL(this.path + "/" + newUrl)
            console.log("redirect from: " + details.url + " to: " + newUrl)
        }
        return { redirectUrl: newUrl }
    }

    //public
    get isStarted() {
        return this._isStarted
    }

    async start() {
        if (this._isStarted)
            return

        this.overridden_resources = await fetch(this.base + this.path + "/overridden_resources.json").then(response => response.json())

        chrome.webRequest.onBeforeRequest.addListener(
            details => { return this._redirectListener(details) },
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

    constructor(path, base) {
        this.path = path
        if (base == null)
            this.base = ""
        else
            this.base = base
    }
}
