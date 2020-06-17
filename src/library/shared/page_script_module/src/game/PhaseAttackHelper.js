import Constans from './Constans'

const ExplosionType = Constans.ExplosionType
const ShakeType = Constans.ShakeType

export default class PhaseAttackHelper {
    constructor(
        layerExplosion,
        sceneInfo,
        attackType,
    ) {
        this._layerExplosion = layerExplosion
        this._sceneInfo = sceneInfo
        this._attackType = attackType
        this._lastAttackPos = null
    }

    //functions, called from any PhaseAttack
    completePreload(callback) {
        this._loader = new PIXI.loaders.Loader
        this._loader.add(document.kcs_extensionUrl + "resources/default_effects/img/battle/explosion_large_w.json")
        this._loader.add(document.kcs_extensionUrl + "resources/default_effects/img/battle/explosion_small_g.json")
        this._loader.add(document.kcs_extensionUrl + "resources/default_effects/img/battle/explosion_middle_g.json")
        this._loader.add(document.kcs_extensionUrl + "resources/default_effects/img/battle/explosion_large_g.json")
        this._loader.add(document.kcs_extensionUrl + "resources/default_effects/img/battle/attack_middle_0.json")
        this._loader.add(document.kcs_extensionUrl + "resources/default_effects/img/battle/attack_middle_1.json")
        this._loader.add("bullet_small", document.kcs_extensionUrl + "resources/default_effects/img/battle/bullet_small.png")
        this._loader.add("bullet_middle", document.kcs_extensionUrl + "resources/default_effects/img/battle/bullet_middle.png")
        this._loader.add("bullet_large", document.kcs_extensionUrl + "resources/default_effects/img/battle/bullet_large.png")
        document.loaderInstance = this._loader
        this._loader.load((t) => {
            callback()
        })
    }

    playAttack(attackerBanner, defenderBanner, damage, attacker, callback) {
        let gunType = this._getGunType(attacker)

        let attackerBannerPos = attackerBanner.getGlobalPos(true);
        let defenderBannerPos = defenderBanner.getGlobalPos(true);

        let defenderBannerBounds = defenderBanner.getBounds()
        let newDefenderBannerPos = this._getImpactCoordinates(
            defenderBannerPos.x,
            defenderBannerPos.y,
            defenderBannerBounds.width,
            defenderBannerBounds.height,
            damage == 0
        )
        this._lastAttackPos = newDefenderBannerPos

        let attackerBannerBounds = attackerBanner.getBounds()
        let newAttackerPos = this._getAttackCoordinates(
            attackerBannerPos.x,
            attackerBannerPos.y,
            attackerBannerBounds.width
        )


        let fireGunSfxInfo = [
            { type: ExplosionType.SMALL, asset: "fire_gun2" },
            { type: ExplosionType.MIDDLE, asset: "fire_gun7" },
            { type: ExplosionType.LARGE, asset: "fire_gun4" }
        ]
        let attackSfx = fireGunSfxInfo.find(i => i.type == gunType).asset


        let attackSpritesInfo = [
            { type: ExplosionType.SMALL, asset: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } }, shake: ShakeType.SMALL },
            { type: ExplosionType.MIDDLE, asset: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } }, shake: ShakeType.SMALL },
            { type: ExplosionType.LARGE, asset: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } }, shake: ShakeType.MIDDLE }
        ]
        let attackSpriteInfo = attackSpritesInfo.find(i => i.type == gunType).asset
        let shake = attackSpritesInfo.find(i => i.type == gunType).shake
        let frames = this._getAttackFrames(attackSpriteInfo.names).map(i => PIXI.Texture.from(i))
        let animatedSprite = new PIXI.extras.AnimatedSprite(frames);

        let bulletInfo = [
            { type: ExplosionType.SMALL, asset: "bullet_small", lifeTime: 200 },
            { type: ExplosionType.MIDDLE, asset: "bullet_middle", lifeTime: 200 },
            { type: ExplosionType.LARGE, asset: "bullet_large", lifeTime: 200 }
        ]
        let bulletTextureName = bulletInfo.find(i => i.type == gunType).asset
        let bulletLifeTime = bulletInfo.find(i => i.type == gunType).lifeTime


        this._layerExplosion.playGunAttackExplosion(
            newAttackerPos.x, newAttackerPos.y,
            newDefenderBannerPos.x, newDefenderBannerPos.y,
            attackSfx,
            attackSpriteInfo.anchor.x,
            attackSpriteInfo.anchor.y,
            animatedSprite, //PIXI.extras.AnimatedSprite
            shake,
            bulletLifeTime,
            bulletTextureName,
            callback
        )
    }


    playExplosion(shipBanner, damage, attacker) {
        let gunType = this._getGunType(attacker)
        let isMissed = damage == 0

        let explosionInfo = [
            { type: ExplosionType.SMALL, asset: { hit: "boom_med1_g", missed: "boom_med1_w" }, shake: ShakeType.SMALL },
            { type: ExplosionType.MIDDLE, asset: { hit: "boom_big1_g", missed: "boom_big1_w" }, shake: ShakeType.MIDDLE },
            { type: ExplosionType.LARGE, asset: { hit: "boom_big1_g", missed: "boom_big1_w" }, shake: ShakeType.LARGE }
        ]
        let explosion = explosionInfo.find(i => i.type == gunType)
        let impactSfx = isMissed ? explosion.asset.missed : explosion.asset.hit


        let explosionTypesInfo = [
            {
                type: ExplosionType.SMALL,
                asset: {
                    hit: {
                        name: "explosion_small_g",
                        anchor: { x: 0.5, y: 0.73 }
                    },
                    missed: {
                        name: "explosion_large_w",
                        anchor: { x: 0.5, y: 0.71 }
                    }
                }
            },
            {
                type: ExplosionType.MIDDLE,
                asset: {
                    hit: {
                        name: "explosion_middle_g",
                        anchor: { x: 0.5, y: 0.7 }
                    },
                    missed: {
                        name: "explosion_large_w",
                        anchor: { x: 0.5, y: 0.71 }
                    }
                }
            },
            {
                type: ExplosionType.LARGE,
                asset: {
                    hit: {
                        name: "explosion_large_g",
                        anchor: { x: 0.5, y: 0.7 }
                    },
                    missed: {
                        name: "explosion_large_w",
                        anchor: { x: 0.5, y: 0.71 }
                    }
                }
            }
        ]
        let explosionTypeInfoObject = explosionTypesInfo.find(i => i.type == gunType)
        let explosionTypeInfo = isMissed ? explosionTypeInfoObject.asset.missed : explosionTypeInfoObject.asset.hit



        if (this._lastAttackPos == null) console.log("PhaseAttackHelper._playExplosion Warning this._lastAttackPos is null")
        let explosionPos = this._lastAttackPos == null ? shipBanner.getGlobalPos(true) : this._lastAttackPos
        this._layerExplosion.playGunImpactExplosion(explosionPos.x, explosionPos.y, impactSfx, explosionTypeInfo.name, explosionTypeInfo.anchor.x, explosionTypeInfo.anchor.y, explosion.shake, null)
        this._lastAttackPos = null
    }

    //Private
    _getGunType(attacker) {
        const gunTable = [
            { type: ExplosionType.SMALL, priority: 1, gunTypeIds: [1] },
            { type: ExplosionType.MIDDLE, priority: 2, gunTypeIds: [2, 4] },
            { type: ExplosionType.LARGE, priority: 3, gunTypeIds: [3] }
        ]
        const allGunIds = [].concat.apply([], gunTable.map(i => i.gunTypeIds))
        try {
            const gunIds = attacker.slots
                .filter(i => (i != null && i.equipType != null && allGunIds.includes(i.equipType)))
                .map(i => i.equipType)
            const foundGunInfos = gunIds.map(gunId => gunTable.find(gunInfo => gunInfo.gunTypeIds.includes(gunId)))
                .sort((a, b) => b.priority - a.priority)
            return foundGunInfos[0].type
        } catch (e) {
            return ExplosionType.SMALL
        }
    }


    _getAttackFrames(names) {
        const name = names[Math.floor(Math.random() * names.length)];
        return this._getFramesForBattleSprite(name)
    }

    _getFramesForBattleSprite(resourceName) {
        let resource = document.loaderInstance.resources[document.kcs_extensionUrl + "resources/default_effects/img/battle/" + resourceName + ".json"]
        return Object.keys(resource.data.frames)
    }


    _getImpactCoordinates(x, y, w, h, isMissed) {
        let paddingPercent = 0.25
        let marginPercent = 0.2
        let randY = Math.random() * 2 - 1
        if (isMissed) {
            let randX = Math.random()
            let offset = w / 2 * (1 + marginPercent)
            let xOffset = randX * w / 2 + offset
            if (x > this._sceneInfo.w / 2)
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

    _getAttackCoordinates(x, y, w) {
        if (x > this._sceneInfo.w / 2) {
            return {
                x: x - (w / 2) * 0.9,
                y: y
            }
        } else {
            return {
                x: x + (w / 2) * 0.9,
                y: y
            }
        }
    }
}