class CustomPhaseAttackHelper {
    constructor(instance) {
        this.instance = instance
        this._lastAttackPos = null
    }


    _playExplosion(shipBanner, damage) {
        let explosionPos = this._lastAttackPos == null ? shipBanner.getGlobalPos(true) : this._lastAttackPos
        this.instance._scene.view.layer_explosion.playDamageExplosionCustom(explosionPos.x, explosionPos.y, damage)
        this._lastAttackPos = null
    }

    //custom
    _playAttack(attackerBanner, defenderBanner, attackInfo) {
        this._attackInfo = attackInfo
        let attackerBannerPos = attackerBanner.getGlobalPos(true);
        let defenderBannerPos = defenderBanner.getGlobalPos(true);

        let defenderBannerBounds = defenderBanner.getBounds()
        let newDefenderBannerPos = this._getCoordinates(
            defenderBannerPos.x,
            defenderBannerPos.y,
            defenderBannerBounds.width,
            defenderBannerBounds.height,
            this._attackInfo
        )
        this._lastAttackPos = newDefenderBannerPos


        this.instance._scene.view.layer_explosion.playAttackExplosion(
            attackerBannerPos.x, attackerBannerPos.y,
            newDefenderBannerPos.x, newDefenderBannerPos.y
        )
    }

    _getCoordinates(x, y, w, h, attackInfo) {
        let paddingPercent = 0.25
        let marginPercent = 0.2
        let isMissed = attackInfo.damage == 0
        let randX = Math.random() * 2 - 1
        let randY = Math.random() * 2 - 1
        if (isMissed) {
            let offset = randX > 0 ? w / 2 : -w / 2
            offset *= (1 + marginPercent)
            return {
                x: x + randX * w / 2 + offset,
                y: y + h * (1 - paddingPercent) / 2 * randY
            }
        } else {
            return {
                x: x + w * (1 - paddingPercent) / 2 * randX,
                y: y + h * (1 - paddingPercent) / 2 * randY
            }
        }
    }

}