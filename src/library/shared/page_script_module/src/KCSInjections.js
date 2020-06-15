
import CustomLayerExplosionInitializer from './game/LayerExplosion.js';
import CustomPhaseAttackDanchakuInitializer from './game/PhaseAttackDanchaku.js';
import CustomPhaseAttackDoubleInitializer from './game/PhaseAttackDouble.js';
import CustomPhaseAttackNormalInitializer from './game/PhaseAttackNormal.js';
import SoundManagerWrapper from './game/SoundManagerWrapper'

import CameraEffects from './game/CameraEffects' //TODO: delete

//utils
async function _injectKCSMods(extensionUrl) {

    window.addEventListener("message", function (event) {
        if (event.source == window && event.data.command && event.data.command == "init_main_js") {
            if (event.data.isCustomEffectEnabled) {
                document.kcs_extensionUrl = extensionUrl
            }
            setTimeout(() => { KCS.init(); }, 300);
        }
    });
    window.postMessage({ command: "start_web_request" }, "*")
}

function _addScript(src) {
    return new Promise(resolve => {
        var script = document.createElement('script');
        script.src = src
        script.onload = function () {
            resolve()
        };
        document.body.appendChild(script)
    })
}

function _findScript(src) {
    return Array.prototype.slice.call(document.querySelectorAll("script")).find(s => (s.src != null && s.src.includes(src)))
}

//kcs interceptor
var _kcsBackup;
function _disableGameInit() {
    Object.defineProperty(window, 'KCS', {
        configurable: true,
        get: () => { return { init: () => { } } },
        set: (kcs) => { _kcsBackup = kcs }
    })
}

function _enableGameInit() {
    delete window.KCS
    window.KCS = _kcsBackup
}

//properties override
let _propertyHolders = {}
function _overrideProperties(extensionUrl) {
    let _rootViewSingletonHolder = new PropertyParentHolder('_friendlyRequest', ["_view", "_settings", "_option", "_model", "_resource", "_scene", "_sound"])
    let layerExplosionArgs = { getRootView : () => { return _rootViewSingletonHolder.getObject()._view } }

    document.tmp_CameraEffects = new CameraEffects(() => { return _rootViewSingletonHolder.getObject()._view })

    let properties = [
        { name: 'LayerExplosion', initializer: CustomLayerExplosionInitializer, initializerArgs: layerExplosionArgs },
        { name: 'PhaseAttackDanchaku', initializer: CustomPhaseAttackDanchakuInitializer },
        { name: 'PhaseAttackDouble', initializer: CustomPhaseAttackDoubleInitializer },
        { name: 'PhaseAttackNormal', initializer: CustomPhaseAttackNormalInitializer },
        { name: 'TaskDaihatsuEff', setHandler: (property) => { document.kcs_TaskDaihatsuEff = property } }, //TODO: pass object via contructor, not
        {
            name: 'SoundManager', setHandler: (property) => {
                document.kcs_SoundManagerInitializer = () => {
                    if (document.kcs_SoundManager == null)
                        document.kcs_SoundManager = new SoundManagerWrapper(new property, extensionUrl)
                    return document.kcs_SoundManager
                }
            }
        },
    ]

    for (let property of properties) {
        let propertyHolder = new PropertyHolder(property.initializer, property.initializerArgs, property.setHandler, property.name)
        Object.defineProperty(Object.prototype, property.name, {
            configurable: true,
            get: function () { return propertyHolder.getProperty() },
            set: function (propertyValue) { propertyHolder.setProperty(propertyValue) }
        })
        _propertyHolders[`${property.name}Holder`] = propertyHolder
    }
}

class PropertyHolder {
    constructor(customPropertyInitializer, initializerArgs, setHandler, name) {
        this.name = name
        this.setHandler = setHandler
        this.customPropertyInitializer = customPropertyInitializer
        this.initializerArgs = initializerArgs
    }
    getProperty() {
        if (this.originalProperty == null || this.originalProperty == undefined) {
            throw "Property requsted, before originalProperty set"
        }
        if (this.property == undefined) {
            if (this.customPropertyInitializer)
                this.property = this.customPropertyInitializer(this.originalProperty,this.initializerArgs)
            else if (this.setHandler)
                this.property = this.originalProperty
            else
                throw "customPropertyInitializer and setHandler are undefined"
        }
        return this.property
    }
    setProperty(property) {
        if (this.setHandler)
            this.setHandler(property)
        this.originalProperty = property
    }
}

class PropertyParentHolder {
    constructor(propertyName, propertyNames) {
        this.propertyNamesStr = propertyNames.join('')
        this._properties = {}
        let holder = this
        Object.defineProperty(Object.prototype, propertyName, {
            configurable: true,
            get: function () {
                return holder.getProperty(this)
            },
            set: function (propertyValue) {
                holder.setProperty(propertyValue, this)
            }
        })
    }

    getProperty(owner) {
        let result = null
        let key = Object.keys(owner).join("")
        for (let existingKey in this._properties) {
            if (existingKey.includes(key)) {
                result = this._properties[existingKey]
                break
            }
        }
        if (result == null){
            debugger
            throw "Object not found"
        } else
            return result
    }

    setProperty(propertyValue, owner) {
        let generatedKey = Object.keys(owner).join('')
        this._properties[generatedKey] = propertyValue
        if (generatedKey == this.propertyNamesStr)
            this._object = owner
    }

    getObject() {
        return this._object
    }
}


export default function main() {
    let extensionUrl = _findScript('page_script_module.bundle.js').innerText.replace("'", '').replace("'", '')

    _overrideProperties(extensionUrl)
    _disableGameInit()
    window.addEventListener('DOMContentLoaded', (event) => {
        _enableGameInit()
        //inject code
        _injectKCSMods(extensionUrl)
    });
}