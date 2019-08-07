//require CustomExplosion
//require CustomLayerExplosion
//require CustomPhaseAttackNormal

function injectKCSMods() {
    document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion
    document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal
}