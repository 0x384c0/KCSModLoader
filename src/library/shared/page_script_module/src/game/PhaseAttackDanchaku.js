import PhaseAttackHelper from "./PhaseAttackHelper"
export default (PhaseAttackDanchaku) => {
    return class CustomPhaseAttackDanchaku extends PhaseAttackDanchaku {
        constructor(scene, type, attacker, defender, slotitem1, slotitem2, slotitem3, damage, hitType, isShield) {
            super(scene, type, attacker, defender, slotitem1, slotitem2, slotitem3, damage, hitType, isShield)
            this.helper = new PhaseAttackHelper(
                scene.view.layer_explosion,
                { w: scene.width, h: scene.height },
                "PhaseAttackDanchaku"
            )
            this.firstDamage = damage
            this.firstAttacker = attacker
        }

        _completePreload() {
            this.helper.completePreload(() => this._afterCompletePreload())
        }

        _afterCompletePreload() {
            var t, e, i = this, n = this._attacker.friend, o = this._attacker.index, s = this._defender.index;
            1 == n ? (t = this._scene.view.bannerGroupLayer.getBanner(!0, o),
                e = this._scene.view.bannerGroupLayer.getBanner(!1, s)) : (t = this._scene.view.bannerGroupLayer.getBanner(!1, o),
                    e = this._scene.view.bannerGroupLayer.getBanner(!0, s)),
                t.moveFront(),
                e.moveFront(),
                this._scene.view.layer_cutin.addChild(this._cutin.view),
                this._cutin.start(),
                this._cutin.view.once("attack", () => {
                    i._playVoice();
                    createjs.Tween.get(null)
                        .wait(800).call(() => {
                            t.attack(null)
                            this._fakeAttack(t, e)
                        })
                        .wait(600).call(() => {
                            this._attack(t, e, true)
                        })
                })
        }

        _attack(attackerBanner, defenderBanner) {
            this._playAttack(
                attackerBanner, defenderBanner,
                () => {
                    this._damageEffect(attackerBanner, defenderBanner)
                }
            )
        }

        //overriden from PhaseAttackBase
        _playExplosion(shipBanner, damage) {
            this.helper.playExplosion(shipBanner, damage, this.firstAttacker)
        }

        //custom
        _playAttack(attackerBanner, defenderBanner, callback) {
            this.helper.playAttack(attackerBanner, defenderBanner,
                this.firstDamage,
                this.firstAttacker,
                callback)
        }

        _fakeAttack(attackerBanner, defenderBanner) {
            this._playAttack(
                attackerBanner, defenderBanner,
                (impactPos) => {
                    defenderBanner.moveAtDamage(this._shield)
                    this._playExplosion(defenderBanner,this.firstDamage)
                }
            )
        }
    }
}