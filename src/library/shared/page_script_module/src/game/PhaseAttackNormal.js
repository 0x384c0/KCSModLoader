import PhaseAttackHelper from "./PhaseAttackHelper"
export default (PhaseAttackNormal) => {
    return class CustomPhaseAttackNormal extends PhaseAttackNormal {
        //overriden from parent
        constructor(scene, attacker, defender, slotitem, damage, hitType, isShield) {
            super(scene, attacker, defender, slotitem, damage, hitType, isShield)
            this.helper = new PhaseAttackHelper(
                this._scene.view.layer_explosion,
                { w: scene.width, h: scene.height },
                "PhaseAttackNormal"
            )
            this.firstAttacker = attacker
            this.firstDamage = damage
        }

        _completePreload() {
            this.helper.completePreload(() => super._completePreload())
        }

        _attack(attackerBanner, defenderBanner) {
            var thisRef = this,
                scene = this._scene.view.layer_content;
            new document.kcs_TaskDaihatsuEff(scene, attackerBanner, defenderBanner, this._daihatsu_eff).start();
            var dlcTimout = 0;
            0 != this._daihatsu_eff && (dlcTimout = 1300),
                createjs.Tween.get(null).wait(dlcTimout).wait(200)
                    .call(() => {
                        attackerBanner.attack(null)
                        thisRef._playAttack(attackerBanner, defenderBanner,
                            () => {
                                thisRef._damageEffect(attackerBanner, defenderBanner)
                            })
                    })
        }

        //overriden from PhaseAttackBase
        _playExplosion(shipBanner, damage) {
            this.helper.playExplosion(shipBanner, this.firstDamage, this.firstAttacker)
        }

        //custom
        _playAttack(attackerBanner, defenderBanner, callback) {
            this.helper.playAttack(attackerBanner, defenderBanner, this.firstDamage, this.firstAttacker, callback)
        }
    }
}