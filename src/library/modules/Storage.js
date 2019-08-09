class Storage {
    //Private
    // promise wrappers for chrome APIs
    _setValue(key, value) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set({ [key]: value }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError)
                else
                    resolve()
            });
        });
    }
    _getValue(key, defaultValue) {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get([key], (result) => {
                if (result == null || result[key] == null)
                    resolve(defaultValue)
                else if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError)
                else
                    resolve(result[key])
            });
        });
    }


    //Public
    setIsResourceOverrideEnabled(value) {
        return this._setValue("isResourceOverrideEnabled", value)
    }
    getIsResourceOverrideEnabled() {
        return this._getValue("isResourceOverrideEnabled", true)
    }


    setIsCustomEffectEnabled(value) {
        return this._setValue("isCustomEffectEnabled", value)
    }
    getIsCustomEffectEnabled() {
        return this._getValue("isCustomEffectEnabled", true)
    }

    resetResourcePath(){
        return this._setValue("resourcePath", "/resources/default")
    }
    setResourcePath(value) {
        return this._setValue("resourcePath", value)
    }
    getResourcePath() {
        return this._getValue("resourcePath", "/resources/default")
    }
}