const convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});
class RequestInterceptor {
    //private
    _attached = false
    _version = "1.2"
    _connectDebuggerIfNeeded(debuggeeId) {
        console.log("RequestInterceptor _connectDebuggerIfNeeded")
        return new Promise((resolve, reject) => {
            if (this._attached) {
                resolve()
            } else {
                chrome.debugger.attach(debuggeeId, this._version, () => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError)
                    } else {
                        this._attached = true
                        resolve()
                    }
                });
            }
        })
    }

    _disconnectDebuggerIfNeeded(debuggeeId) {
        return new Promise((resolve, reject) => {
            if (this._attached) {
                chrome.debugger.detach(debuggeeId, () => {
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError)
                    } else {
                        this._attached = false
                        resolve()
                    }
                });
            } else {
                resolve()
            }
        })
    }
    _onDetach(debuggeeId) {
        this._isStarted = false
    }

    _handleRequestPaused(params) {
        console.log("RequestInterceptor _handleRequestPaused " + params.request.url)
        const rule = this.rules.find(rule => params.request.url.includes(rule.urlPattern))
        if (rule != null) {
            if (rule.modifyHandler != null) {
                chrome.debugger.sendCommand(
                    this.currentTabDebuggeeId,
                    "Fetch.getResponseBody",
                    { requestId: params.requestId },
                    response => {
                        let responseString = response.body
                        if (response.base64Encoded)
                            responseString = atob(responseString)
                        chrome.debugger.sendCommand(this.currentTabDebuggeeId, "Fetch.fulfillRequest",
                            {
                                requestId: params.requestId,
                                responseCode: 200,
                                responseHeaders: [],
                                body: btoa(rule.modifyHandler(responseString))
                            });
                    }
                )
                return
            } else if (rule.imageUrl != null) {
                fetch(rule.imageUrl)
                    .then(response => response.blob())
                    .then(convertBlobToBase64)
                    .then(blob => {
                        chrome.debugger.sendCommand(this.currentTabDebuggeeId, "Fetch.fulfillRequest",
                            {
                                requestId: params.requestId,
                                responseCode: 200,
                                responseHeaders: [],
                                body: blob.replace("data:image/png;base64,", "")
                            });
                    })
                return
            }
        }
        //error
        chrome.debugger.sendCommand(this.currentTabDebuggeeId, "Fetch.continueRequest", { requestId: params.requestId })
        throw new Error("rule not found")
    }
    _isStarted = false

    //public
    get isStarted() {
        return this._isStarted
    }

    async start() {
        console.log("RequestInterceptor start")
        if (this._isStarted)
            return
        await this._connectDebuggerIfNeeded(this.currentTabDebuggeeId)
        chrome.debugger.sendCommand(this.currentTabDebuggeeId, "Fetch.enable", {
            patterns: this.rules.map(rule => {
                const requestPattern = { urlPattern: rule.urlPattern }
                if (rule.modifyHandler != null)
                    requestPattern.requestStage = "Response"
                return requestPattern
            })
        });
        this._isStarted = true
    }

    async stop() {
        console.log("RequestInterceptor stop")
        if (!this._isStarted)
            return
        chrome.debugger.sendCommand(this.currentTabDebuggeeId, "Fetch.disable");
        await this._disconnectDebuggerIfNeeded(this.currentTabDebuggeeId)
        this._isStarted = false
    }

    constructor(tabId, rules) {
        console.log("RequestInterceptor init")
        this.tabId = tabId
        this.rules = rules
        this.currentTabDebuggeeId = { tabId: tabId }
        chrome.debugger.onEvent.addListener((source, method, params) => {//
            if (source.tabId === this.currentTabDebuggeeId.tabId && method === "Fetch.requestPaused")
                this._handleRequestPaused(params)
            else
                console.log(method)
        })
        chrome.debugger.onDetach.addListener(this._onDetach);
    }
}