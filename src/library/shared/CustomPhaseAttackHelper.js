class CustomPhaseAttackHelper {
    constructor(instance, sceneInfo) {
        this.instance = instance
        this.sceneInfo = sceneInfo
        this._lastAttackPos = null
        this._lastAttackInfo = null
    }

    _completePreload(callback){
        this._loader = new PIXI.loaders.Loader
        this._loader.add("chrome-extension://nfldpcedekkdpjmmahadaffilbfaofof/resources/default_effects/img/battle/explosio_large_w.json")
        this._loader.load((t) => {
            callback()
        })
    }


    _playExplosion(shipBanner, damage) {
        if (this._lastAttackPos == null) console.log("CustomPhaseAttackHelper._playExplosion Warning this._lastAttackPos is null")
        let explosionPos = this._lastAttackPos == null ? shipBanner.getGlobalPos(true) : this._lastAttackPos

        if (this._lastAttackInfo == null) {
            this._lastAttackInfo = { //default attack info
                damage: damage,
                isMissed: damage == 0,
                explosionType: ExplosionType.LARGE
            }
        }

        this.instance._scene.view.layer_explosion.playImpactExplosion(explosionPos.x, explosionPos.y, this._lastAttackInfo, null)
        this._lastAttackPos = null
        this._lastAttackInfo = null
    }

    //custom
    _playAttack(attackerBanner, defenderBanner, attackInfo, callback) {
        this._lastAttackInfo = attackInfo

        let attackerBannerPos = attackerBanner.getGlobalPos(true);
        let defenderBannerPos = defenderBanner.getGlobalPos(true);

        let defenderBannerBounds = defenderBanner.getBounds()
        let newDefenderBannerPos = this._getCoordinates(
            defenderBannerPos.x,
            defenderBannerPos.y,
            defenderBannerBounds.width,
            defenderBannerBounds.height,
            this._lastAttackInfo
        )
        this._lastAttackPos = newDefenderBannerPos

        this.instance._scene.view.layer_explosion.playAttackExplosion(
            attackerBannerPos.x, attackerBannerPos.y,
            newDefenderBannerPos.x, newDefenderBannerPos.y,
            attackInfo,
            callback
        )
    }

    _getCoordinates(x, y, w, h, attackInfo) {
        let paddingPercent = 0.25
        let marginPercent = 0.2
        let randY = Math.random() * 2 - 1
        if (this._lastAttackInfo.isMissed) {
            let randX = Math.random()
            let offset = w / 2 * (1 + marginPercent)
            let xOffset = randX * w / 2 + offset
            if (x > this.sceneInfo.w / 2)
                xOffset = -xOffset
            return {
                x: x + xOffset,
                y: y + h * (1 - paddingPercent) / 2 * randY
            }
        } else {
            let randX = Math.random() * 2 - 1
            return {
                x: x + w * (1 - paddingPercent) / 2 * randX,
                y: y + h * (1 - paddingPercent) / 2 * randY
            }
        }
    }

    getAttackExplosionType(attacker){
        const gunTable = [
            {type: ExplosionType.SMALL, proprity:1, gunTypeIds: [1]},
            {type: ExplosionType.MIDDLE, proprity:2, gunTypeIds: [2,4]},
            {type: ExplosionType.LARGE, proprity:3, gunTypeIds: [3]}
        ]
        const allGunIds = [].concat.apply([], gunTable.map(i => i.gunTypeIds))
        try{
            const gunIds = attacker.slots
                .filter(i => (i != null && i.equipType != null && allGunIds.includes(i.equipType)))
                .map(i => i.equipType)
            const foundGunInfos = gunIds.map(gunId => gunTable.find(gunInfo => gunInfo.gunTypeIds.includes(gunId)))
                .sort((a,b) => b.proprity-a.proprity)
            return foundGunInfos[0].type
        } catch (e){
            return ExplosionType.SMALL
        }
    }

}