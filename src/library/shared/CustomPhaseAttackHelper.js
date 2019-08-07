class CustomPhaseAttackHelper {
    constructor(instance) {
        this.instance = instance
    }


    _playExplosion(shipBanner, damage) {
        var shipBannerPos = shipBanner.getGlobalPos(true);
        this.instance._scene.view.layer_explosion.playDamageExplosionCustom(shipBannerPos.x, shipBannerPos.y, damage)
    }

    //custom
    _playAttack(attackerBanner, defenderBanner) {
        var attackerBannerPos = attackerBanner.getGlobalPos(true);
        var defenderBannerPos = defenderBanner.getGlobalPos(true);
        this.instance._scene.view.layer_explosion.playAttackExplosion(
            attackerBannerPos.x, attackerBannerPos.y,
            defenderBannerPos.x, defenderBannerPos.y
        )
    }

}