import PhaseAttackHelper from "./PhaseAttackHelper"
export default (PhaseAttackNormal) => {
    return class CustomPhaseAttackNormal extends PhaseAttackNormal {
        //overriden from PhaseAttackNormal
        constructor(scene, attacker, defender, slotitem, damage, hitType, isShield) {
            super(scene, attacker, defender, slotitem, damage, hitType, isShield)
            try {
                this.helper = new PhaseAttackHelper(
                    this._scene.view.layer_explosion,
                    { w: scene.width, h: scene.height },
                    "PhaseAttackNormal"
                )
                console.log(scene)
                console.log(attacker)
                this.firstAttacker = attacker
                this.firstDamage = damage
            } catch (e) {
                console.error(`CustomPhaseAttackNormal constructor \n${e}\n`, e.stack);
            }
        }

        //overriden from PhaseAttackNormal
        _completePreload() {
            try {
                this.helper.completePreload(() => super._completePreload())
            } catch (e) {
                console.error(`CustomPhaseAttackNormal _completePreload \n${e}\n`, e.stack);
                super._completePreload()
            }
        }

        //overriden from PhaseAttackNormal
        _attack(attackerBanner, defenderBanner) {
            try {
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
            } catch (e) {
                console.error(`CustomPhaseAttackNormal _attack \n${e}\n`, e.stack);
                super._attack(attackerBanner, defenderBanner)
            }
        }

        //overriden from PhaseAttackBase
        _playExplosion(shipBanner, damage) {
            try {
                this.helper.playExplosion(shipBanner, damage, this.firstAttacker)
            } catch (e) {
                console.error(`CustomPhaseAttackNormal _playExplosion \n${e}\n`, e.stack);
                super._playExplosion(shipBanner, damage)
            }
        }

        //custom
        _playAttack(attackerBanner, defenderBanner, callback) {
            this.helper.playAttack(attackerBanner, defenderBanner, this.firstDamage, this.firstAttacker, callback)
        }
    }
}