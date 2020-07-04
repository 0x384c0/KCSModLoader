import "@babel/polyfill";
import chai from 'chai';
const assert = chai.assert;

import ConfigGenerator from './../src/game/ConfigGenerator.js'
import Constants from './../src/game/Constants.js'
const AttackType = Constants.AttackType
const ShakeType = Constants.ShakeType

const attackerSmallGuns = { slots: [{ equipType: 1 }], _practice: true, friend: true, index: 1 }
const attackerMediumGuns = { slots: [{ equipType: 2 }], _practice: true, friend: true, index: 1 }
const attackerLargeGuns = { slots: [{ equipType: 3 }], _practice: true, friend: true, index: 1 }

const attackerAbyssalSmallGuns = { slots: [{ equipType: 1 }], _practice: false, friend: false, index: 1 }
const attackerAbyssalMediumGuns = { slots: [{ equipType: 2 }], _practice: false, friend: false, index: 1 }
const attackerAbyssalLargeGuns = { slots: [{ equipType: 3 }], _practice: false, friend: false, index: 1 }

const attackerAbyssalFlagshipSmallGuns = { slots: [{ equipType: 1 }], _practice: false, friend: false, index: 0 }
const attackerAbyssalFlagshipMediumGuns = { slots: [{ equipType: 2 }], _practice: false, friend: false, index: 0 }
const attackerAbyssalFlagshipLargeGuns = { slots: [{ equipType: 3 }], _practice: false, friend: false, index: 0 }

const attackerFriendPvpSmallGuns = { slots: [{ equipType: 1 }], _practice: false, friend: true, index: 0 }
const attackerFriendPvpMediumGuns = { slots: [{ equipType: 2 }], _practice: false, friend: true, index: 0 }
const attackerFriendPvpLargeGuns = { slots: [{ equipType: 3 }], _practice: false, friend: true, index: 0 }

const hitDamage = 100
const missDamage = 0

function testGetAttackType() {
    let configGenerator;

    configGenerator = new ConfigGenerator(hitDamage, attackerSmallGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerMediumGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerLargeGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);

    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalSmallGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalMediumGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalLargeGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.LASER);

    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalFlagshipSmallGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalFlagshipMediumGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalFlagshipLargeGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.LASER);

    configGenerator = new ConfigGenerator(hitDamage, attackerFriendPvpSmallGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerFriendPvpMediumGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage, attackerFriendPvpLargeGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
}
function testGetAttackConfig() {
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage, attackerSmallGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerMediumGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerLargeGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.MIDDLE);

    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalSmallGuns)
    assert.equal(configGenerator.getAttackConfig().sfxs[0], "AUGuard_wea1FireC.wav");
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalSmallGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalMediumGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalLargeGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.MIDDLE_LASER);

    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalFlagshipSmallGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalFlagshipMediumGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalFlagshipLargeGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.LARGE_LASER);

    configGenerator = new ConfigGenerator(hitDamage, attackerFriendPvpSmallGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerFriendPvpMediumGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage, attackerFriendPvpLargeGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.MIDDLE);

}
function testGetBulletConfig() {
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage, attackerSmallGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "bullet_small");
    configGenerator = new ConfigGenerator(hitDamage, attackerMediumGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "bullet_middle");
    configGenerator = new ConfigGenerator(hitDamage, attackerLargeGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "bullet_large");

    configGenerator = new ConfigGenerator(hitDamage, attackerAbyssalMediumGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "FXJapanShogunProjectile");
}
function testGetImpactConfig() {
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage, attackerSmallGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_med1_g_1.wav");
    configGenerator = new ConfigGenerator(hitDamage, attackerMediumGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_g_1.wav");
    configGenerator = new ConfigGenerator(hitDamage, attackerLargeGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_g_1.wav");

    configGenerator = new ConfigGenerator(missDamage, attackerSmallGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_med1_w_1.wav");
    configGenerator = new ConfigGenerator(missDamage, attackerMediumGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_w_1.wav");
    configGenerator = new ConfigGenerator(missDamage, attackerLargeGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_w_1.wav");
}

testGetAttackType()
testGetAttackConfig()
testGetBulletConfig()
testGetImpactConfig()

console.log('\x1b[32m%s\x1b[0m', 'Tests passed');