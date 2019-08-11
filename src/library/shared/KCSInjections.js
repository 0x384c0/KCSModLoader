async function injectKCSMods(extensionUrl) {
    let scriptUrl = _findScript("js/main.js").src
    let scripts = []
    //load and modify main script
    const mainScript = await fetch(scriptUrl)
        .then(b => b.text())
        .then(s => s.replace("e.SoundManager=_", "document.kcs_SoundManager = e;e.SoundManager=_"))
        .then(s => s.replace("e.LayerExplosion=u", "document.kcs_LayerExplosion = e;e.LayerExplosion=u"))
        .then(s => s.replace("e.TaskDaihatsuEff=a;", "document.kcs_TaskDaihatsuEff = e;e.TaskDaihatsuEff=a;"))
        .then(s => s.replace("e.PhaseAttackDouble=c", "document.kcs_PhaseAttackDouble = e;e.PhaseAttackDouble=c"))
        .then(s => s.replace("e.PhaseAttackNormal=_", "document.kcs_PhaseAttackNormal = e;e.PhaseAttackNormal=_"))
    eval(mainScript)

    //get classes
    await _addScript(extensionUrl + "library/shared/CustomSoundManager.js")
    await _addScript(extensionUrl + "library/shared/Bullet.js")
    await _addScript(extensionUrl + "library/shared/CustomExplosion.js")
    await _addScript(extensionUrl + "library/shared/CustomLayerExplosion.js")
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

Object.defineProperty(window, 'KCS',{ configurable: true, value: function(){/*"KCS empty define"*/}})
KCS.init = () => {/*"KCS empty init"*/}

window.addEventListener('DOMContentLoaded', (event) => {
    //prevent init main.js
    let extensionUrl = _findScript("KCSInjections.js").innerText.replace("'","").replace("'","")
    delete window.KCS
    //inject code
    injectKCSMods(extensionUrl)
});