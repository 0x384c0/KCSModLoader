//utils
function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

async function _injectKCSMods(extensionUrl) {
    /*
    let scriptUrl = _findScript("js/main.js").src
    let scripts = []
    //load and modify main script
    const mainScript = await fetch(scriptUrl)
        .then(b => b.text())
        .then(s => s.replace(/(.)\.SoundManager=(.)/, "document.kcs_SoundManager = $1;e.SoundManager=$2")) //TODO: pass sound manager as parameter
        .then(s => s.replace(/(.)\.LayerExplosion=(.)/, "document.kcs_LayerExplosion = $1;e.LayerExplosion=$2"))
        .then(s => s.replace(/(.)\.TaskDaihatsuEff=(.)/, "document.kcs_TaskDaihatsuEff = $1;e.TaskDaihatsuEff=$2"))
        .then(s => s.replace(/(.)\.PhaseAttackDanchaku=(.)/, "document.kcs_PhaseAttackDanchaku = $1;e.PhaseAttackDanchaku=$2"))
        .then(s => s.replace(/(.)\.PhaseAttackDouble=(.)/, "document.kcs_PhaseAttackDouble = $1;e.PhaseAttackDouble=$2"))
        .then(s => s.replace(/(.)\.PhaseAttackNormal=(.)/, "document.kcs_PhaseAttackNormal = $1;e.PhaseAttackNormal=$2"))
    eval(mainScript)
    */
   
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

   /*
    //get classes
    await _addScript(extensionUrl + "library/shared/Bullet.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackHelper.js")

    await _addScript(extensionUrl + "library/shared/CustomSoundManager.js")
    await _addScript(extensionUrl + "library/shared/CustomExplosion.js")
    await _addScript(extensionUrl + "library/shared/CustomLayerExplosion.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackDanchaku.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackNormal.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackDouble.js")
    */


    window.addEventListener("message", function(event) {
        if (event.source == window && event.data.command && event.data.command == "init_main_js"){
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
            setTimeout(()=>{ KCS.init();console.log("KCS.init() called") }, 300);
        }
    });
    window.postMessage({command:"start_web_request"}, "*")
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

function _findScript(src){
    return Array.prototype.slice.call(document.querySelectorAll("script")).find(s => (s.src != null && s.src.includes(src)))
}

//kcs interceptor
var _kcsBackup;
function _disableGameInit(){
    Object.defineProperty(window, 'KCS',{ configurable: true, 
        get: () => {return {init:() => {console.log("KCS.init() was skipped")}}},
        set: (kcs) => {_kcsBackup = kcs}
    })
}

function _enableGameInit(){
    delete window.KCS
    window.KCS = _kcsBackup
}

//properties override
let _propertyHolders = {}
function _overrideProperties(){
    Object.defineProperty(Object.prototype, 'SoundManager',{ configurable: true, 
        get: () => {console.log('SoundManager getter called'); return document.kcs_SoundManager},
        set: (p) => {console.log('SoundManager setter called');  document.kcs_SoundManager = p}
    })
    /*
    let properties = [
        'SoundManager',
        'LayerExplosion',
        'PhaseAttackDanchaku',
        'PhaseAttackNormal',
        'PhaseAttackDouble',
    ]

    for (property of properties){
        let customPropertyInitializer = () => {return document['Custom${property}Initializer']}//TODO: inline initializers with npm
        let propertyHolder = PropertyHolder(customPropertyInitializer)
        Object.defineProperty(Object.prototype, property,{ configurable: true, 
            get: () => { return propertyHolder.getProperty()},
            set: (p) => {  propertyHolder.propertWasSet(p)}
        })
        _propertyHolders[property] = propertyHolder
        console.log('${property} property overrided')
    }
    */
}

/*
class PropertyHolder{
    constructor(customPropertyInitializer){
        this.customPropertyInitializer = customPropertyInitializer
    }
    getProperty(){
        if (this.originalProperty == null || this.originalProperty == undefined){
            throw "Property requsted, before originalProperty set"
        }
        if (this.property == undefined){
            let customPropertyInitializer = this.customPropertyInitializer
            if (customPropertyInitializer == undefined)
                throw "customPropertyInitializer is not ready"
            this.property = customPropertyInitializer(this.originalProperty)
        }
        return this.property
    }
    propertWasSet(property){
        this.originalProperty = property
    }
}
*/

_overrideProperties()
_disableGameInit()



window.addEventListener('DOMContentLoaded', (event) => { 
    _enableGameInit()
    //inject code
    let extensionUrl = _findScript('KCSInjections.js').innerText.replace("'",'').replace("'",'')
    _injectKCSMods(extensionUrl)
});