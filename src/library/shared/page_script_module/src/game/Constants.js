const GunType = {
    SMALL: 'SMALL',
    MIDDLE: 'MIDDLE',
    LARGE: 'LARGE'
}

const AttackType = {
    BULLET: 'BULLET', //TODO: rename to PROJECTILE
    LASER: 'LASER'
}

const ShakeType = {
    SMALL: { magnitude: 0.002, duration: 0.2, wiggles: 3 },
    MIDDLE: { magnitude: 0.004, duration: 0.6, wiggles: 6 },
    LARGE: { magnitude: 0.006, duration: 0.8, wiggles: 8 },
    MIDDLE_LASER: { magnitude: 0.0025, duration: 3.0, wiggles: 60 },
    LARGE_LASER: { magnitude: 0.004, duration: 1.2, wiggles: 12 },
}

const Faction = {
    KANMUSU: 'KANMUSU',
    ABUSSAL: 'ABUSSAL',
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
                sfxs: ["fire_gun2_1.wav", "fire_gun2_2.wav"],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.SMALL,
            },
            bullet: {
                textures: ["bullet_small"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_small_g"],
                sfxs: ["boom_med1_g_1.wav", "boom_med1_g_2.wav", "boom_med1_g_3.wav"],
                anchor: { x: 0.5, y: 0.73 },
                shake: ShakeType.SMALL,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_med1_w_1.wav", "boom_med1_w_2.wav"],
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
                sfxs: ["GURhino_VehAG_weapPounda.wav", "GURhino_VehAG_weapPoundb.wav", "GURhino_VehAG_weapPoundc.wav", "GURhino_VehAG_weapPoundd.wav", "GURhino_VehAG_weapPounde.wav", "GURhino_VehAG_weapPoundf.wav",],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.SMALL,
            },
            bullet: {
                textures: ["bullet_middle"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_middle_g"],
                sfxs: ["boom_big1_g_1.wav", "boom_big1_g_2.wav", "boom_big1_g_3.wav", "boom_big1_g_4.wav"],
                anchor: { x: 0.5, y: 0.7 },
                shake: ShakeType.MIDDLE,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_big1_w_1.wav", "boom_big1_w_2.wav", "boom_big1_w_3.wav"],
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
                sfxs: ["fire_gun4_1.wav", "fire_gun4_2.wav"],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.MIDDLE,
            },
            bullet: {
                textures: ["bullet_large"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_large_g"],
                sfxs: ["boom_big1_g_1.wav", "boom_big1_g_2.wav", "boom_big1_g_3.wav", "boom_big1_g_4.wav"],
                anchor: { x: 0.5, y: 0.7 },
                shake: ShakeType.LARGE,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_big1_w_1.wav", "boom_big1_w_2.wav", "boom_big1_w_3.wav"],
                anchor: { x: 0.5, y: 0.71 },
                shake: ShakeType.LARGE,
            },
        }
    },
    {
        requirements: {
            faction: Faction.ABUSSAL,
            gunType: GunType.SMALL
        },
        attackType: AttackType.BULLET,
        hit: {
            attack: {
                animatedTextures: ["attack_middle_0", "attack_middle_1"],
                sfxs: ["AUGuard_wea1FireC.wav", "AUGuard_wea1FireA.wav", "AUGuard_wea1FireB.wav"],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.SMALL,
            },
            bullet: {
                textures: ["bullet_small"],
                lifeTime: 200
            },
            impact: {
                animatedTextures: ["explosion_small_g"],
                sfxs: ["boom_med1_g_1.wav", "boom_med1_g_2.wav", "boom_med1_g_3.wav"],
                anchor: { x: 0.5, y: 0.73 },
                shake: ShakeType.SMALL,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_med1_w_1.wav", "boom_med1_w_2.wav"],
                anchor: { x: 0.5, y: 0.71 },
                shake: ShakeType.SMALL,
            },
        }
    },
    {
        requirements: {
            faction: Faction.ABUSSAL,
            gunType: GunType.MIDDLE
        },
        attackType: AttackType.BULLET,
        hit: {
            attack: {
                animatedTextures: ["attack_middle_shogun_0", "attack_middle_shogun_1"],
                sfxs: ["JUShogu_cannFirea.wav", "JUShogu_cannFireb.wav", "JUShogu_cannFirec.wav", "JUShogu_cannFired.wav", "JUShogu_cannFiree.wav", "JUShogu_cannFiref.wav",],
                anchor: { x: 0.4, y: 0.5 },
                shake: ShakeType.SMALL,
            },
            bullet: {
                textures: ["FXJapanShogunProjectile"],
                lifeTime: 250
            },
            impact: {
                animatedTextures: ["explosion_shogun"],
                sfxs: ["JUShogu_cannExpla.wav", "JUShogu_cannExplb.wav", "JUShogu_cannExplc.wav", "JUShogu_cannExpld.wav", "JUShogu_cannExple.wav", "JUShogu_cannExplf.wav", "JUShogu_cannExplg.wav", "JUShogu_cannExplh.wav",],
                anchor: { x: 0.5, y: 0.7 },
                shake: ShakeType.MIDDLE,
            },
        },
        miss: {
            impact: {
                animatedTextures: ["explosion_large_w"],
                sfxs: ["boom_big1_w_1.wav", "boom_big1_w_2.wav", "boom_big1_w_3.wav"],
                anchor: { x: 0.5, y: 0.71 },
                shake: ShakeType.MIDDLE,
            },
        }
    },
    {
        requirements: {
            faction: Faction.ABUSSAL,
            gunType: GunType.LARGE
        },
        attackType: AttackType.LASER,
        hit: {
            attack: {
                sfxs: ["AUAthen_weapFire1a.wav", "AUAthen_weapFire1b.wav", "AUAthen_weapFire1c.wav", "AUAthen_weapFire1d.wav", "AUAthen_weapFire1e.wav", "AUAthen_weapFire1f.wav", "AUAthen_weapFire1g.wav", "AUAthen_weapFire1h.wav", "AUAthen_weapFire1i.wav"],
                animationArgs: {
                    beamTime: 2100,
                    beamDelay: 50,
                    fadeInTime: 300,
                    fadeOutTime: 300,
                    beamMask: "beam_mask",
                    beamTextureNames: [{ texture: "FXRazorGradnc_yellow", xSpeed: 1.0 }, { texture: "FXObeliskLaserHeroic_yellow", xSpeed: 2.0 }],
                    originResources: [{ texture: "light_large_yellow" }],
                    impactResources: [{ texture: "light_middle_yellow" }],
                    impactChainAnimatedSprite: "explosion_circle",
                    explosionChainCount: 20,
                    explosionChainAnimationSpeed: 0.5,
                    xPathRange: 100,
                    yPathRange: 20
                },
                shake: ShakeType.MIDDLE_LASER,
            }
        }
    },
    {
        requirements: {
            isFlagship: true,
            faction: Faction.ABUSSAL,
            gunType: GunType.LARGE
        },
        attackType: AttackType.LASER,
        hit: {
            attack: {
                sfxs: ["JUPearl_siegLasea.wav", "JUPearl_siegLaseb.wav", "JUPearl_siegLasec.wav", "JUPearl_siegLased.wav", , "JUPearl_siegLasee.wav"],
                animationArgs: {
                    beamTime: 1200,
                    beamDelay: 10,
                    fadeInTime: 100,
                    fadeOutTime: 200,
                    beamMask: "beam_mask",
                    beamTextureNames: [{ texture: "FXRazorGradnc", xSpeed: 1.0 }, { texture: "FXObeliskLaserHeroic", xSpeed: 2.0 }],
                    originResources: [{ animatedSprite: "laser_origin", animationSpeed: 0.8, loop: true }, { texture: "light_large" }],
                    impactResources: [{ texture: "light_middle" }],
                    impactChainAnimatedSprite: "explosion_spark",
                    explosionChainCount: 20,
                    explosionChainAnimationSpeed: 0.2,
                    xPathRange: 400,
                    yPathRange: 20
                },
                shake: ShakeType.LARGE_LASER,
            }
        }
    },
]



export default {
    GunType,
    ShakeType,
    AttackType,
    AttackConfigs,
    Faction
}
