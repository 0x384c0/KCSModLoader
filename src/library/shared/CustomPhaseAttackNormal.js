
class CustomPhaseAttackNormal extends document.kcs_PhaseAttackNormal.PhaseAttackNormal {
    _playExplosion(t, e) {
        var i = t.getGlobalPos(!0);
        this._scene.view.layer_explosion.playDamageExplosionCustom(i.x, i.y, e)
    }
}
