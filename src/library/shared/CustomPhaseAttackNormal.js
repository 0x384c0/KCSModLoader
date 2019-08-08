
class CustomPhaseAttackNormal extends document.kcs_PhaseAttackNormal.PhaseAttackNormal {
    //overriden from parent
    constructor(scene, attacker, defender, slotitem, damage, hitType, isShield) {
        super(scene, attacker, defender, slotitem, damage, hitType, isShield)
        this.helper = new CustomPhaseAttackHelper(this,{w:scene.width,h:scene.height})
        this.damage = damage
    }

    _attack(attackerBanner, defenderBanner) {
        var i = this,
            scene = this._scene.view.layer_content;
        new document.kcs_TaskDaihatsuEff.TaskDaihatsuEff(scene, attackerBanner, defenderBanner, this._daihatsu_eff).start();
        var dlcTimout = 0;
        0 != this._daihatsu_eff && (dlcTimout = 1300),
            createjs.Tween.get(null).wait(dlcTimout).wait(300)
                .call(() => {
                    // o.SE.play("102"),
                    i._playAttack(attackerBanner, defenderBanner, { damage: this.damage })
                })
                .wait(this._scene.view.layer_explosion.attackExplosionDuration)
                .call(function () {
                    attackerBanner.attack(function () {
                        i._damageEffect(attackerBanner, defenderBanner)
                    })
                })
    }

    //overriden from PhaseAttackBase
    _playExplosion(shipBanner, damage) {
        this.helper._playExplosion(shipBanner, damage)
    }

    //custom
    _playAttack(attackerBanner, defenderBanner, attackInfo) {
        this.helper._playAttack(attackerBanner, defenderBanner, attackInfo)
    }
}
