
import CustomLayerExplosionInitializer from './game/LayerExplosion.js';
import CustomPhaseAttackDanchakuInitializer from './game/PhaseAttackDanchaku.js';
import CustomPhaseAttackDoubleInitializer from './game/PhaseAttackDouble.js';
import CustomPhaseAttackNormalInitializer from './game/PhaseAttackNormal.js';
import SoundManagerWrapper from './game/SoundManagerWrapper'

//utils
async function _injectKCSMods(extensionUrl) {

    /*
    var variable = () => {"asdas"}
 
     Object.defineProperty(Object.prototype, 'KCS',{ configurable: true, 
     get: () => { console.log( "gettter called");return "getted value"},
     set: () => { console.log( "setter called");}
     })
 
     // delete Object.prototype.KCS
 
     variable['KCS'] = "asdasd"
     console.log(variable.KCS)
    */


    window.addEventListener("message", function (event) {
        if (event.source == window && event.data.command && event.data.command == "init_main_js") {
            if (event.data.isCustomEffectEnabled) {
                //inject custom classes
                document.kcs_extensionUrl = extensionUrl
                /*
                document.kcs_SoundManager = new CustomSoundManager(new document.kcs_SoundManager.SoundManager,extensionUrl)
                document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion
                document.kcs_PhaseAttackDanchaku.PhaseAttackDanchaku = CustomPhaseAttackDanchaku
                document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal
                document.kcs_PhaseAttackDouble.PhaseAttackDouble = CustomPhaseAttackDouble
                */
            }
            setTimeout(() => { KCS.init(); console.log("KCS.init() called") }, 300);
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
    console.log("_disableGameInit")
    Object.defineProperty(window, 'KCS', {
        configurable: true,
        get: () => { return { init: () => { console.log("KCS.init() was skipped") } } },
        set: (kcs) => { _kcsBackup = kcs }
    })
}

function _enableGameInit() {
    delete window.KCS
    window.KCS = _kcsBackup
    console.log(`_enableGameInit _kcsBackup ${_kcsBackup}`)
}

//properties override
let _propertyHolders = {}
let _soundManagerHolder = undefined
function _overrideProperties(extensionUrl) {
    // console.log('SoundManager overriden')

    let properties = [
        { name: 'LayerExplosion',      initializer: CustomLayerExplosionInitializer },
        { name: 'PhaseAttackDanchaku', initializer: CustomPhaseAttackDanchakuInitializer },
        { name: 'PhaseAttackDouble',   initializer: CustomPhaseAttackDoubleInitializer },
        { name: 'PhaseAttackNormal',   initializer: CustomPhaseAttackNormalInitializer },
        { name: 'TaskDaihatsuEff',     setHandler: (property) => {document.kcs_TaskDaihatsuEff = property}}, //TODO: pass object via contructor, not
        { name: 'SoundManager',        setHandler: (property) => {document.kcs_SoundManagerInitializer = () => {
            if (document.kcs_SoundManager == null)
                document.kcs_SoundManager = new SoundManagerWrapper(new property,extensionUrl)
            return document.kcs_SoundManager
        }}}
    ]

    for (let property of properties) {
        let propertyHolder = new PropertyHolder(property.initializer, property.setHandler, property.name)
        Object.defineProperty(Object.prototype, property.name, {
            configurable: true,
            get: () => { return propertyHolder.getProperty() },
            set: (property) => { propertyHolder.propertyWasSet(property) }
        })
        _propertyHolders[`${property.name}Holder`] = propertyHolder
    }



    // Object.defineProperty(Object.prototype, 'SoundManager',{ configurable: true, 
    //     get: () => { return _soundManagerHolder},
    //     set: (SoundManager) => { 
    //         _soundManagerHolder = SoundManager
    //         document.kcs_SoundManager = () => {return new SoundManagerWrapper(new SoundManager,extensionUrl)} //TODO: init SoundManagerWrapper inside CustomLayerExplosion
    //     }
    // })

    // Object.defineProperty(Object.prototype, 'LayerExplosion',{ configurable: true, 
    //     get: function() {
    //         console.log(`get ${this._LayerExplosion}`)
    //          return this._LayerExplosion
    //     },
    //     set: function(LayerExplosion) { 
    //         // this._LayerExplosionCustom = CustomLayerExplosionInitializer(LayerExplosion)
    //         // this._LayerExplosion = LayerExplosion
    //         // this._LayerExplosion._LayerExplosionCustom = this._LayerExplosionCustom


    //         this['_LayerExplosion'] = CustomLayerExplosionInitializer(LayerExplosion)
    //         this['_LayerExplosion']['_originalClass'] = LayerExplosion

    //         console.log(`set ${this._LayerExplosion}`)
    //     }
    // })
}


class PropertyHolder {
    constructor(customPropertyInitializer,setHandler, name) {
        this.name = name
        this.setHandler = setHandler
        this.customPropertyInitializer = customPropertyInitializer
    }
    getProperty() {
        console.log(`getter called ${this.name}`)
        if (this.originalProperty == null || this.originalProperty == undefined) {
            throw "Property requsted, before originalProperty set"
        }
        if (this.property == undefined) {
            if (this.customPropertyInitializer)
                this.property = this.customPropertyInitializer(this.originalProperty)
            else if (this.setHandler)
                this.property = this.originalProperty
            else
                throw "customPropertyInitializer and setHandler are undefined"
        }
        return this.property
    }
    propertyWasSet(property) {
        console.log(`setter called ${this.name}`)
        if (this.setHandler)
            this.setHandler(property)
        this.originalProperty = property
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