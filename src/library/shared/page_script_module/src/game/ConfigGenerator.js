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
        return (isMissed && config.miss.attack != null) ? config.miss.attack : config.hit.attack
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
        let config = this._configs
            .sort((a, b) => {
                let scoreA = a.requirements.gunType == gunType ? 1 : 0
                let scoreB = b.requirements.gunType == gunType ? 1 : 0
                return scoreB - scoreA
            })[0]
        return config
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
            { link: "resources/default_effects/img/battle/explosion_large_w.json", name: null },
            { link: "resources/default_effects/img/battle/explosion_small_g.json", name: null },
            { link: "resources/default_effects/img/battle/explosion_middle_g.json", name: null },
            { link: "resources/default_effects/img/battle/explosion_large_g.json", name: null },
            { link: "resources/default_effects/img/battle/attack_middle_0.json", name: null },
            { link: "resources/default_effects/img/battle/attack_middle_1.json", name: null },
            { link: "resources/default_effects/img/battle/bullet_small.png", name: "bullet_small" },
            { link: "resources/default_effects/img/battle/bullet_middle.png", name: "bullet_middle" },
            { link: "resources/default_effects/img/battle/bullet_large.png", name: "bullet_large" },
        ]
        return resources
}

ConfigGenerator.getRandom = (names) => {
    return names[Math.floor(Math.random() * names.length)]
}