//require CustomExplosion
//require CustomLayerExplosion
//require CustomPhaseAttackNormal

function injectKCSMods(extensionUrl) {
    let scriptUrl = document.querySelector("head > script:nth-child(8)").src
    let scripts = []
    fetch(scriptUrl)
        .then(b => b.text())
        .then(s => s.replace("e.PhaseAttackDouble=c", "document.kcs_PhaseAttackDouble = e;e.PhaseAttackDouble=c"))
        .then(s => s.replace("e.PhaseAttackNormal=_", "document.kcs_PhaseAttackNormal = e;e.PhaseAttackNormal=_"))
        .then(s => s.replace("e.LayerExplosion=u", "document.kcs_LayerExplosion = e;e.LayerExplosion=u"))
        .then(s => s.replace("e.TaskDaihatsuEff=a;", "document.kcs_TaskDaihatsuEff = e;e.TaskDaihatsuEff=a;"))
        .then(s => eval(s))
        .then(() => _addScript(extensionUrl + "library/shared/Bullet.js"))
        .then(() => _addScript(extensionUrl + "library/shared/CustomExplosion.js"))
        .then(() => _addScript(extensionUrl + "library/shared/CustomLayerExplosion.js"))
        .then(() => _addScript(extensionUrl + "library/shared/CustomPhaseAttackHelper.js"))
        .then(() => _addScript(extensionUrl + "library/shared/CustomPhaseAttackNormal.js"))
        .then(() => _addScript(extensionUrl + "library/shared/CustomPhaseAttackDouble.js"))

        .then(() => {
            document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion
            document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal
            document.kcs_PhaseAttackDouble.PhaseAttackDouble = CustomPhaseAttackDouble
            KCS.init()
            console.log("KCS injection successfull")
        })
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