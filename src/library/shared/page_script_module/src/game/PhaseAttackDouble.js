import PhaseAttackHelper from "./PhaseAttackHelper"
export default (PhaseAttackDouble) => {
    return class CustomPhaseAttackDouble extends PhaseAttackDouble {
        //overriden from parent
        constructor(scene, attacker, defender, slotitem, damage, hitType, isShield, defender2, slotitem2, damage2, hitType2, isShield2) {
            super(scene, attacker, defender, slotitem, damage, hitType, isShield, defender2, slotitem2, damage2, hitType2, isShield2)
            this.helper = new PhaseAttackHelper(
                scene.view.layer_explosion,
                { w: scene.width, h: scene.height },
                "PhaseAttackDouble"
            )
            this.firstDamage = damage
            this.firstAttacker = attacker
            this.secondDamage = damage2

            this._completeDamageEffect = function () {
                this._cutin.resume()
                this._cutin.view.once("attack", () => {
                    this._a_banner.attack(null)
                    if (this._additionalInfo != null)
                        this._playAttack(this._additionalInfo.attackerBanner, this._additionalInfo.defenderBanner,
                            this.secondDamage,
                            this.firstAttacker,
                            () => {
                                this._2ndDamageEffect()
                            })
                    else
                        this._2ndDamageEffect()
                })
            }
        }

        _completePreload() {
            this.helper.completePreload(() => super._completePreload())
        }

        _attack(attackerBanner, defenderBanner) {
            this._additionalInfo = {
                attackerBanner: attackerBanner,
                defenderBanner: defenderBanner
            }
            attackerBanner.attack(null)
            this._playAttack(attackerBanner, defenderBanner,
                this.firstDamage,
                this.firstAttacker,
                () => {
                    this._damageEffect(attackerBanner, defenderBanner)
                })
        }

        _damageEffect(attackerBanner, defenderBanner) {
            var i = this;
            1 == this._shield && this._showShield(defenderBanner);
            var damage = this._getDamage(this._defender);
            defenderBanner.moveAtDamage(this._shield);

            this._playExplosion(defenderBanner, this.firstDamage)

            this._scene.view.layer_damage.showAtBanner(defenderBanner, damage, this._hit)
            createjs.Tween.get(this).wait(200).call(function () {
                i._damage_cutin.causeDoubleDamage1st(i._defender, damage)
                defenderBanner.updateHp(i._defender.hp_now)
            }).wait(500).call(function () {
                i._completeDamageEffect()
            })
        }

        //overriden from PhaseAttackBase
        _playExplosion(shipBanner, damage) {
            this.helper.playExplosion(shipBanner, damage, this.firstAttacker)
        }

        //custom
        _playAttack(attackerBanner, defenderBanner, damage, attacker, callback) {
            this.helper.playAttack(attackerBanner, defenderBanner, damage, attacker, callback)
        }
    }
}