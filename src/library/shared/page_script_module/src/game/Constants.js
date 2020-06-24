const GunType = {
    SMALL: 'SMALL',
    MIDDLE: 'MIDDLE',
    LARGE: 'LARGE'
}

const AttackType = {
    BULLET: 'BULLET',
    LASER: 'LASER'
}

const ShakeType = {
    SMALL: { magnitude: 0.002, duration: 0.2, wiggles: 3 },
    MIDDLE: { magnitude: 0.004, duration: 0.6, wiggles: 6 },
    LARGE: { magnitude: 0.006, duration: 0.8, wiggles: 8 }
}

const AttackConfigs = [
    {
        requirements: {
            gunType: GunType.SMALL
        },
        attackType: AttackType.BULLET,
        hit: {
            attack: {
                animatedTextures: ["attack_middle_0", "attack_middle_1"],
                sfxs: ["fire_gun2"],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.SMALL,
            },
            bullet: {
                textures: ["bullet_small"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_small_g"],
                sfxs: ["boom_med1_g"],
                anchor: { x: 0.5, y: 0.73 },
                shake: ShakeType.SMALL,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_med1_w"],
                anchor: { x: 0.5, y: 0.71 },
                shake: ShakeType.SMALL,
            },
        }
    },
    {
        requirements: {
            gunType: GunType.MIDDLE
        },
        attackType: AttackType.BULLET,
        hit: {
            attack: {
                animatedTextures: ["attack_middle_0", "attack_middle_1"],
                sfxs: ["fire_gun7"],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.SMALL,
            },
            bullet: {
                textures: ["bullet_middle"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_middle_g"],
                sfxs: ["boom_big1_g"],
                anchor: { x: 0.5, y: 0.7 },
                shake: ShakeType.MIDDLE,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_big1_w"],
                anchor: { x: 0.5, y: 0.71 },
                shake: ShakeType.MIDDLE,
            },
        }
    },
    {
        requirements: {
            gunType: GunType.LARGE
        },
        attackType: AttackType.BULLET,
        hit: {
            attack: {
                animatedTextures: ["attack_middle_0", "attack_middle_1"],
                sfxs: ["fire_gun4"],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.MIDDLE,
            },
            bullet: {
                textures: ["bullet_large"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_large_g"],
                sfxs: ["boom_big1_g"],
                anchor: { x: 0.5, y: 0.7 },
                shake: ShakeType.LARGE,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_big1_w"],
                anchor: { x: 0.5, y: 0.71 },
                shake: ShakeType.LARGE,
            },
        }
    }
]



export default {
    GunType,
    ShakeType,
    AttackType,
    AttackConfigs
}
