class CustomPhaseAttackDanchaku extends document.kcs_PhaseAttackDanchaku.PhaseAttackDanchaku{
     constructor(scene, type, attacker, defender, slotitem1, slotitem2, slotitem3, damage, hitType, isShield) {
        super(scene, type, attacker, defender, slotitem1, slotitem2, slotitem3, damage, hitType, isShield)
        this.helper = new CustomPhaseAttackHelper(this, { w: scene.width, h: scene.height })
        this.damage = damage
        this.attackInfo = {
            damage: damage,
            isMissed: damage == 0, //TODO: get this info from api
            explosionType: this.helper.getAttackExplosionType(attacker)
        }
    }

    _completePreload(){
        this.helper._completePreload(() => this._afterCompletePreload())
    }

    _afterCompletePreload(){
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
                this._fakeAttack(t, e)
            })
            .wait(600).call(() => {
                this._fakeAttack(t, e)
            })
            .wait(600).call(() => {
                this._attack(t, e)
            })
        })
    }

    _attack(attackerBanner, defenderBanner) {
        attackerBanner.attack(null)
        this._playAttack(
            attackerBanner, defenderBanner,
            this.attackInfo,
            () => {
                this._damageEffect(attackerBanner, defenderBanner)
            }
        )
    }

    //overriden from PhaseAttackBase
    _playExplosion(shipBanner, damage) {
        this.helper._playExplosion(shipBanner, damage)
    }

    //custom
    _playAttack(attackerBanner, defenderBanner, attackInfo, callback) {
        this.helper._playAttack(attackerBanner, defenderBanner, attackInfo, callback)
    }

    _fakeAttack(attackerBanner, defenderBanner){
        attackerBanner.attack(null)
        this._playAttack(
            attackerBanner, defenderBanner,
            this.attackInfo,
            (impactPos) => {
                defenderBanner.moveAtDamage(this._shield)
                this._scene.view.layer_explosion.playImpactExplosion(impactPos.x, impactPos.y, this.attackInfo, null)
            }
        )
    }
}