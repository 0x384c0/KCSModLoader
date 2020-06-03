async function _injectKCSMods(extensionUrl) {
    /*
    let scriptUrl = _findScript("js/main.js").src
    let scripts = []
    //load and modify main script
    const mainScript = await fetch(scriptUrl)
        .then(b => b.text())
        .then(s => s.replace(/(.)\.SoundManager=(.)/, "document.kcs_SoundManager = $1;e.SoundManager=$2"))
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

    //get classes
    await _addScript(extensionUrl + "library/shared/CustomSoundManager.js")
    await _addScript(extensionUrl + "library/shared/Bullet.js")
    await _addScript(extensionUrl + "library/shared/CustomExplosion.js")
    await _addScript(extensionUrl + "library/shared/CustomLayerExplosion.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackDanchaku.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackHelper.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackNormal.js")
    await _addScript(extensionUrl + "library/shared/CustomPhaseAttackDouble.js")


    window.addEventListener("message", function(event) {
        if (event.source == window && event.data.command && event.data.command == "init_main_js"){
            if (event.data.isCustomEffectEnabled) {
                //inject custom classes
                document.kcs_extensionUrl = extensionUrl
                document.kcs_SoundManager = new CustomSoundManager(new document.kcs_SoundManager.SoundManager,extensionUrl)
                document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion
                document.kcs_PhaseAttackDanchaku.PhaseAttackDanchaku = CustomPhaseAttackDanchaku
                document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal
                document.kcs_PhaseAttackDouble.PhaseAttackDouble = CustomPhaseAttackDouble
            }
            setTimeout(()=>{ KCS.init() }, 300);
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


_disableGameInit()
window.addEventListener('DOMContentLoaded', (event) => { 
    _enableGameInit()

    //inject code
    let extensionUrl = _findScript("KCSInjections.js").innerText.replace("'","").replace("'","")
    _injectKCSMods(extensionUrl)
});