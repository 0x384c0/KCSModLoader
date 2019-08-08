class CustomPhaseAttackDouble extends document.kcs_PhaseAttackDouble.PhaseAttackDouble {
    //overriden from parent
    constructor(scene, attacker, defender, slotitem, damage, hitType, isShield, defender2, slotitem2, damage2, hitType2, isShield2) {
        super(scene, attacker, defender, slotitem, damage, hitType, isShield, defender2, slotitem2, damage2, hitType2, isShield2)
        this.helper = new CustomPhaseAttackHelper(this,{w:scene.width,h:scene.height})
        this.damage = damage
        this.damage2 = damage2
        this._completeDamageEffect = function () {
            this._cutin.resume()
            this._cutin.view.once("attack", () => {
                if (this._additionalInfo != null)
                    this._playAttack(this._additionalInfo.attackerBanner, this._additionalInfo.defenderBanner, { damage: this.damage2 })
                this._a_banner.attack(null)
                createjs.Tween.get(null)
                    .wait(this._scene.view.layer_explosion.attackExplosionDuration)
                    .call(() => {
                        this._2ndDamageEffect()
                    })
            })
        }
    }

    _attack(attackerBanner, defenderBanner) {
        this._additionalInfo = {
            attackerBanner: attackerBanner,
            defenderBanner: defenderBanner
        }
        // r.SE.play("102")
        this._playAttack(attackerBanner, defenderBanner, { damage: this.damage })
        attackerBanner.attack(null)
        createjs.Tween.get(null)
            .wait(this._scene.view.layer_explosion.attackExplosionDuration)
            .call(() => {
                this._damageEffect(attackerBanner, defenderBanner)
            })
    }

    _damageEffect(attackerBanner, defenderBanner) {
        var i = this;
        1 == this._shield && this._showShield(defenderBanner);
        var damage = this._getDamage(this._defender);
        defenderBanner.moveAtDamage(this._shield);
        var defenderBannerPos = defenderBanner.getGlobalPos(!0);
        this._scene.view.layer_explosion.playDamageExplosionCustom(defenderBannerPos.x, defenderBannerPos.y, damage, null),
            this._scene.view.layer_damage.showAtBanner(defenderBanner, damage, this._hit),
            createjs.Tween.get(this).wait(200).call(function () {
                i._damage_cutin.causeDoubleDamage1st(i._defender, damage),
                    defenderBanner.updateHp(i._defender.hp_now)
            }).wait(500).call(function () {
                i._completeDamageEffect()
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