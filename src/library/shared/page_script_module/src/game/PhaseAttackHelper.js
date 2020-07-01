import ConfigGenerator from './ConfigGenerator'
import utils from './utils'
import Constants from './Constants'
const AttackType = Constants.AttackType

export default class PhaseAttackHelper {
    constructor(
        layerExplosion,
        sceneInfo,
        attackPhaseName,
    ) {
        this._layerExplosion = layerExplosion
        this._sceneInfo = sceneInfo
        this._attackPhaseName = attackPhaseName
        this._lastGunImpactPos = null
    }

    //functions, called from any PhaseAttack
    completePreload(callback) {
        this._loader = new PIXI.loaders.Loader
        let resources = ConfigGenerator.getAllResources()
        for (let resource of resources) {
            if (resource.name != null)
                this._loader.add(resource.name, document.kcs_extensionUrl + resource.link)
            else
                this._loader.add(document.kcs_extensionUrl + resource.link)
        }

        document.loaderInstance = this._loader
        this._loader.load((t) => {
            callback()
        })
    }

    playAttack(attackerBanner, defenderBanner, damage, attacker, callback) {

        //calculate positions
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
        this._lastGunImpactPos = newDefenderBannerPos

        let attackerBannerBounds = attackerBanner.getBounds()
        let newAttackerPos = this._getAttackCoordinates(
            attackerBannerPos.x,
            attackerBannerPos.y,
            attackerBannerBounds.width
        )

        let configGenerator = new ConfigGenerator(damage, attacker)
        let attackType = configGenerator.getAttackType()

        switch (attackType) {
            case AttackType.BULLET: {
                //get configs
                let attackConfig = configGenerator.getAttackConfig()
                let attackSfx = ConfigGenerator.getRandom(attackConfig.sfxs)
                let attackTextureName = ConfigGenerator.getRandom(attackConfig.animatedTextures)
                let anchor = attackConfig.anchor
                let shake = attackConfig.shake

                let bulletConfig = configGenerator.getBulletConfig()
                let bulletTextureName = ConfigGenerator.getRandom(bulletConfig.textures)
                let bulletLifeTime = bulletConfig.lifeTime

                //prepare textures
                let frames = utils.getResourcesFromSpriteSheet(attackTextureName).map(i => PIXI.Texture.from(i))
                let animatedSprite = new PIXI.extras.AnimatedSprite(frames);

                //play animation
                this._layerExplosion.playGunAttackExplosion(
                    newAttackerPos.x, newAttackerPos.y,
                    newDefenderBannerPos.x, newDefenderBannerPos.y,
                    attackSfx,
                    anchor.x,
                    anchor.y,
                    animatedSprite, //PIXI.extras.AnimatedSprite
                    shake,
                    bulletLifeTime,
                    bulletTextureName,
                    callback
                )
                break;
            }
            case AttackType.LASER: {
                //get configs
                let attackConfig = configGenerator.getAttackConfig()
                let attackSfx = ConfigGenerator.getRandom(attackConfig.sfxs)
                let shake = attackConfig.shake
                let lifeTime = attackConfig.lifeTime

                //prepare textures
                //TODO

                //play animation
                this._layerExplosion.playLaserAttackExplosion(
                    newAttackerPos.x, newAttackerPos.y,
                    newDefenderBannerPos.x, newDefenderBannerPos.y,
                    attackSfx,
                    lifeTime,
                    shake,
                    callback
                )
                break;
            }
            default:
                throw `Unknown AttackType: ${attackType}`
        }
    }


    playExplosion(shipBanner, damage, attacker) {

        let configGenerator = new ConfigGenerator(damage, attacker)
        let attackType = configGenerator.getAttackType()


        switch (attackType) {
            case AttackType.BULLET: {
                //get configs
                let impactConfig = configGenerator.getImpactConfig()

                let impactSfx = ConfigGenerator.getRandom(impactConfig.sfxs)
                let impactTextureName = ConfigGenerator.getRandom(impactConfig.animatedTextures)
                let anchor = impactConfig.anchor
                let shake = impactConfig.shake


                //calculate positions
                if (this._lastGunImpactPos == null) console.log("PhaseAttackHelper._playExplosion Warning this._lastGunImpactPos is null")
                let explosionPos = this._lastGunImpactPos == null ? shipBanner.getGlobalPos(true) : this._lastGunImpactPos

                //play animation
                this._layerExplosion.playGunImpactExplosion(
                    explosionPos.x,
                    explosionPos.y,
                    impactSfx,
                    impactTextureName,
                    anchor.x,
                    anchor.y,
                    shake,
                    null
                )
                this._lastGunImpactPos = null
                break
            }
            case AttackType.LASER: {
                this._lastGunImpactPos = null
                break
            }
            default:
                throw `Unknown AttackType: ${attackType}`
        }
    }

    //Private


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