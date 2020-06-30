import Constants from './Constants'
const AttackConfigs = Constants.AttackConfigs
const GunType = Constants.GunType

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
        let sortedByScore = this._configs
            .sort((a, b) => {
                let scoreA = this._getScore(a.requirements, gunType)
                let scoreB = this._getScore(b.requirements, gunType)
                return scoreB - scoreA
            })
        let config = sortedByScore[0]
        return config
    }

    _getScore(requirements, gunType) {
        let isFlagship = false
        if (requirements.isFlagship != undefined)
            isFlagship = requirements.isFlagship
        let gunScore = requirements.gunType == gunType ? 1 : 0
        let flagshipScore = isFlagship ? 1 : 0
        return gunScore + flagshipScore
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
        { link: "resources/default_effects/img/battle/FXIonCannoncc.png", name: "FXIonCannoncc" },
        { link: "resources/default_effects/img/battle/FXObeliskLaserHeroic.png", name: "FXObeliskLaserHeroic" },
    ]
    return resources
}

ConfigGenerator.getRandom = (names) => {
    return names[Math.floor(Math.random() * names.length)]
}