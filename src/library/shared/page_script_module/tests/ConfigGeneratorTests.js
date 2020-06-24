import "@babel/polyfill";
import chai from 'chai';
const assert = chai.assert;

import ConfigGenerator from './../src/game/ConfigGenerator.js'
import Constants from './../src/game/Constants.js'
const AttackType = Constants.AttackType
const ShakeType = Constants.ShakeType

const attackerSmallGuns = { slots: [{ equipType: 1 }] }
const attackerMediumGuns = { slots: [{ equipType: 2 }] }
const attackerLargeGuns = { slots: [{ equipType: 3 }] }
const hitDamage = 100
const missDamage = 0

function testGetAttackType() {
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage,attackerSmallGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage,attackerMediumGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
    configGenerator = new ConfigGenerator(hitDamage,attackerLargeGuns)
    assert.equal(configGenerator.getAttackType(), AttackType.BULLET);
}
function testGetAttackConfig(){
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage,attackerSmallGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage,attackerMediumGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.SMALL);
    configGenerator = new ConfigGenerator(hitDamage,attackerLargeGuns)
    assert.equal(configGenerator.getAttackConfig().shake, ShakeType.MIDDLE);
}
function testGetBulletConfig(){ 
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage,attackerSmallGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "bullet_small");
    configGenerator = new ConfigGenerator(hitDamage,attackerMediumGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "bullet_middle");
    configGenerator = new ConfigGenerator(hitDamage,attackerLargeGuns)
    assert.equal(configGenerator.getBulletConfig().textures[0], "bullet_large");
}
function testGetImpactConfig(){
    let configGenerator;
    configGenerator = new ConfigGenerator(hitDamage,attackerSmallGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_med1_g");
    configGenerator = new ConfigGenerator(hitDamage,attackerMediumGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_g");
    configGenerator = new ConfigGenerator(hitDamage,attackerLargeGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_g");

    configGenerator = new ConfigGenerator(missDamage,attackerSmallGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_med1_w");
    configGenerator = new ConfigGenerator(missDamage,attackerMediumGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_w");
    configGenerator = new ConfigGenerator(missDamage,attackerLargeGuns)
    assert.equal(configGenerator.getImpactConfig().sfxs[0], "boom_big1_w");
}

testGetAttackType()
testGetAttackConfig()
testGetBulletConfig()
testGetImpactConfig()

console.log('\x1b[32m%s\x1b[0m', 'Tests passed');