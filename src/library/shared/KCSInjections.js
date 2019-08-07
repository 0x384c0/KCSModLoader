//require CustomExplosion
//require CustomLayerExplosion
//require CustomPhaseAttackNormal

function injectKCSMods(extensionUrl) {
    let scriptUrl = document.querySelector("head > script:nth-child(8)").src
    let scripts = []
    fetch(scriptUrl)
        .then(b => b.text())
        .then(s => s.replace("e.PhaseAttackNormal=_", "document.kcs_PhaseAttackNormal = e;e.PhaseAttackNormal=_"))
        .then(s => s.replace("e.LayerExplosion=u", "document.kcs_LayerExplosion = e;e.LayerExplosion=u"))
        .then(s => eval(s))
        .then(() => {return _addScript( extensionUrl + "library/shared/CustomExplosion.js")})
        .then(() => {return _addScript( extensionUrl + "library/shared/CustomLayerExplosion.js")})
        .then(() => {return _addScript( extensionUrl + "library/shared/CustomPhaseAttackNormal.js")})

        .then(() => {
            document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion
            document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal
            KCS.init()
            console.log("KCS injection successfull")
        })
}

function _addScript(src){
    return new Promise(resolve => {
        var script = document.createElement('script');
        script.src = src
        script.onload = function() {
            resolve()
        };
        document.body.appendChild(script)
    })
}