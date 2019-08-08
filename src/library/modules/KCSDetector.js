class KCSDetector {
    //private
    _isStarted = false
    //public
    get isStarted() {
        return this._isStarted
    }
    startListen() {
        if (this._isStarted)
            return
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.command == "will_load_kcs") {
                this.willLoad()
            }
            sendResponse()
        })
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.command == "will_stop_kcs") {
                this.willUnload()
            }
            sendResponse()
        })
        this._isStarted = true
    }
    stop() {
        if (!this._isStarted)
            return
        chrome.webRequest.onBeforeRequest.removeListener(this._holdListener)
        this._isStarted = false
    }

    notifyStart(){
        chrome.runtime.sendMessage({ command: "will_load_kcs" }, function (response) { })
    }

    notifyStop(){
        chrome.runtime.sendMessage({ command: "will_stop_kcs" }, function (response) { })
    }

    constructor(willLoad,willUnload) {
        this.willLoad = willLoad
        this.willUnload = willUnload
    }
}