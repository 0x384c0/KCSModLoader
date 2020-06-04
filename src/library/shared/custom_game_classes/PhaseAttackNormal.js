
class CustomPhaseAttackNormal extends document.kcs_PhaseAttackNormal.PhaseAttackNormal {
    //overriden from parent
    constructor(scene, attacker, defender, slotitem, damage, hitType, isShield) {
        super(scene, attacker, defender, slotitem, damage, hitType, isShield)
        this.helper = new CustomPhaseAttackHelper(this, { w: scene.width, h: scene.height })
        this.attackInfo = {
            damage: damage,
            isMissed: damage == 0, //TODO: get this info from api
            explosionType: this.helper.getAttackExplosionType(attacker)
        }
    }

    _completePreload(){
        this.helper._completePreload(() => super._completePreload())
    }

    _attack(attackerBanner, defenderBanner) {
        var i = this,
            scene = this._scene.view.layer_content;
        new document.kcs_TaskDaihatsuEff.TaskDaihatsuEff(scene, attackerBanner, defenderBanner, this._daihatsu_eff).start();
        var dlcTimout = 0;
        0 != this._daihatsu_eff && (dlcTimout = 1300),
            createjs.Tween.get(null).wait(dlcTimout).wait(200)
                .call(() => {
                    attackerBanner.attack(null)
                    i._playAttack(attackerBanner, defenderBanner,
                        this.attackInfo,
                        () => {
                            i._damageEffect(attackerBanner, defenderBanner)
                        })
                })
    }

    //overriden from PhaseAttackBase
    _playExplosion(shipBanner, damage) {
        this.helper._playExplosion(shipBanner, damage)
    }

    //custom
    _playAttack(attackerBanner, defenderBanner, attackInfo, callback) {
        this.helper._playAttack(attackerBanner, defenderBanner, attackInfo, callback)
    }
}
