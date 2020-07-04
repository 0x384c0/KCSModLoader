import Constants from './Constants'
const AttackConfigs = Constants.AttackConfigs
const GunType = Constants.GunType
const Faction = Constants.Faction

export default class ConfigGenerator {
    constructor(damage, attacker) {
        this._damage = damage
        this._attacker = attacker
        this._configs = AttackConfigs
    }

    getAttackType() {
        let config = this._getAttackConfig()
        return config.attackType
    }

    getAttackConfig() {
        let config = this._getAttackConfig()
        let isMissed = this._isMissed()
        return (isMissed && config.miss != null && config.miss.attack != null) ? config.miss.attack : config.hit.attack
    }

    getBulletConfig() {
        let config = this._getAttackConfig()
        let isMissed = this._isMissed()
        return (isMissed && config.miss.bullet != null) ? config.miss.bullet : config.hit.bullet
    }

    getImpactConfig() {
        let config = this._getAttackConfig()
        let isMissed = this._isMissed()
        return (isMissed && config.miss.impact != null) ? config.miss.impact : config.hit.impact
    }

    //Private
    _isMissed() {
        return this._damage <= 0
    }

    _getAttackConfig() {
        let gunType = this._getGunType(this._attacker)
        let isFlagship = this._isFlagship(this._attacker)
        let faction = this._getFaction(this._attacker)

        let sortedByScore = this._configs
            .map(a => { a.score = this._getScore(a.requirements, gunType, isFlagship, faction); return a })
            .sort((a, b) => {
                return b.score - a.score
            })

        // console.log(`gunType ${gunType}`)
        // console.log(`isFlagship ${isFlagship}`)
        // console.log(`faction ${faction}`)
        // console.log(`sortedByScore ${sortedByScore.map(it => it.attackType)}`)
        // console.log(`\n`)

        let config = sortedByScore[0]
        return config
    }

    _getScore(requirements, gunType, isFlagship, faction) {
        let isFlagshipReq = requirements.isFlagship
        let factionReq = requirements.faction

        let result = 0

        if (requirements.gunType == gunType)
            result += 1

        if (isFlagshipReq != undefined && isFlagshipReq == isFlagship)
            result += 1

        if (factionReq != undefined)
            if (factionReq == faction)
                result += 1
            else
                result = 0

        return result
    }

    _getFaction(attacker) {
        let isAbyssal = (!attacker._practice && !attacker.friend)
        return isAbyssal ? Faction.ABUSSAL : Faction.KANMUSU
    }

    _isFlagship(attacker) {
        return attacker.index == 0
    }

    _getGunType(attacker) {
        const gunTable = [
            { type: GunType.SMALL, priority: 1, gunTypeIds: [1] },
            { type: GunType.MIDDLE, priority: 2, gunTypeIds: [2, 4] },
            { type: GunType.LARGE, priority: 3, gunTypeIds: [3] }
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
            return GunType.SMALL
        }
    }
}

ConfigGenerator.getAllResources = () => {
    let resources = [
        //bullet
        { link: "resources/default_effects/img/battle/explosion_large_w.json", name: null },
        { link: "resources/default_effects/img/battle/explosion_small_g.json", name: null },
        { link: "resources/default_effects/img/battle/explosion_middle_g.json", name: null },
        { link: "resources/default_effects/img/battle/explosion_large_g.json", name: null },
        { link: "resources/default_effects/img/battle/attack_middle_0.json", name: null },
        { link: "resources/default_effects/img/battle/attack_middle_1.json", name: null },
        { link: "resources/default_effects/img/battle/bullet_small.png", name: "bullet_small" },
        { link: "resources/default_effects/img/battle/bullet_middle.png", name: "bullet_middle" },
        { link: "resources/default_effects/img/battle/bullet_large.png", name: "bullet_large" },
        //laser
        { link: "resources/default_effects/img/battle/explosion_spark.json", name: null },
        { link: "resources/default_effects/img/battle/laser_origin.json", name: null },
        { link: "resources/default_effects/img/battle/light_large.png", name: "light_large" },
        { link: "resources/default_effects/img/battle/light_middle.png", name: "light_middle" },
        { link: "resources/default_effects/img/battle/beam_mask.png", name: "beam_mask" },
        { link: "resources/default_effects/img/battle/FXRazorGradnc.png", name: "FXRazorGradnc" },
        { link: "resources/default_effects/img/battle/FXObeliskLaserHeroic.png", name: "FXObeliskLaserHeroic" },
        //laser yellow
        { link: "resources/default_effects/img/battle/explosion_circle.json", name: null },
        { link: "resources/default_effects/img/battle/light_large_yellow.png", name: "light_large_yellow" },
        { link: "resources/default_effects/img/battle/light_middle_yellow.png", name: "light_middle_yellow" },
        { link: "resources/default_effects/img/battle/FXRazorGradnc_yellow.png", name: "FXRazorGradnc_yellow" },
        { link: "resources/default_effects/img/battle/FXObeliskLaserHeroic_yellow.png", name: "FXObeliskLaserHeroic_yellow" },
        //BB Shogun
        { link: "resources/default_effects/img/battle/attack_middle_shogun_0.json", name: null },
        { link: "resources/default_effects/img/battle/attack_middle_shogun_1.json", name: null },
        { link: "resources/default_effects/img/battle/FXJapanShogunProjectile.png", name: "FXJapanShogunProjectile" },
        { link: "resources/default_effects/img/battle/explosion_shogun.json", name: null },
    ]
    return resources
}

ConfigGenerator.getRandom = (names) => {
    return names[Math.floor(Math.random() * names.length)]
}