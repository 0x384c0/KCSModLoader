class KCSResourceOverride {
    //private
    _isStarted = false

    _redirectIfNeeded(details) {
        let newUrl = this.files.find(url => details.url.includes(url))
        if (newUrl == null)
            newUrl = details.url
        else
            newUrl = this.path + "/" + newUrl

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


        const url = this.path + "/files.txt"
        try {
            if (this.localResources != null)
                this.files = this.localResources
            else
                this.files = await fetch(url)
                    .then(response => response.text())
                    .then(text => text.split(/[\r\n]+/))
        } catch (e) {
            alert("Resource override from " + url + " failed with error:\n" + e)
            return
        }

        this._redirectListener = details => { return this._redirectIfNeeded(details) }
        const urls = this.files.filter(file => file != "").map(url => "*://*/" + url + "*")
        chrome.webRequest.onBeforeRequest.addListener(
            this._redirectListener,
            {
                urls: urls,
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

    constructor(path, localResources) {
        if (path.startsWith("http")) {
            this.path = path
            this.localResources = null
        } else {
            this.path = chrome.runtime.getURL(path)
            this.localResources = localResources
        }
    }
}
