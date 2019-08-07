
class CustomPhaseAttackNormal extends document.kcs_PhaseAttackNormal.PhaseAttackNormal {

    constructor(scene, attacker, defender, slotitem, damage, hitType, isShield) {
        super(scene, attacker, defender, slotitem, damage, hitType, isShield)
        this._additionalData = {}
    }


    _attack(attackerBanner, defenderBanner) {
        var i = this,
            scene = this._scene.view.layer_content;
        new document.kcs_TaskDaihatsuEff.TaskDaihatsuEff(scene, attackerBanner, defenderBanner, this._daihatsu_eff).start();
        var dlcTimout = 0;
        0 != this._daihatsu_eff && (dlcTimout = 1300),
            createjs.Tween.get(null).wait(dlcTimout).wait(300)
                .call(function () {
                    // o.SE.play("102"),
                    i._playAttack(attackerBanner, defenderBanner)
                })
                .wait(this._scene.view.layer_explosion.attackExplosionDuration)
                .call(function () {
                    attackerBanner.attack(function () {
                        i._damageEffect(attackerBanner, defenderBanner)
                    })
                })
    }

    _playAttack(attackerBanner, defenderBanner) {
        var attackerBannerPos = attackerBanner.getGlobalPos(true);
        var defenderBannerPos = defenderBanner.getGlobalPos(true);
        this._scene.view.layer_explosion.playAttackExplosion(
            attackerBannerPos.x, attackerBannerPos.y,
            defenderBannerPos.x, defenderBannerPos.y
        )
    }

    _damageEffect(attackerBanner, defenderBanner) {
        if (1 == this._shield)
            this._showShield(defenderBanner)
        defenderBanner.moveAtDamage(this._shield)
        var damage = this._getDamage(this._defender)
        this._playExplosion(defenderBanner, damage)
        this._playDamageEffect(attackerBanner, defenderBanner, this._defender, damage, this._hit)
    }

    _playExplosion(shipBanner, damage) {
        var shipBannerPos = shipBanner.getGlobalPos(true);
        this._scene.view.layer_explosion.playDamageExplosionCustom(shipBannerPos.x, shipBannerPos.y, damage)
    }
}
