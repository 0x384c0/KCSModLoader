import BulletInitializer from './Bullet'
import CustomExplosionInitializer from './CustomExplosion'
import utils from './utils'
import CameraEffects from './CameraEffects'
import Constans from './Constans'

const ExplosionType = Constans.ExplosionType
const ShakeType = Constans.ShakeType

export default (LayerExplosion, args) => {
    const CustomExplosion = CustomExplosionInitializer(PIXI)
    const getRootView = args.getRootView
    return class CustomLayerExplosion extends LayerExplosion {
        constructor(scene) {
            super(scene)
            this.attackExplosionDuration = 200
            this._cameraEffects = new CameraEffects(getRootView)
        }

        playAttackExplosion(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            attackerInfo,
            callback
        ) {
            //attack sfx
            const fireGunSfxInfo = [
                { type: ExplosionType.SMALL, asset: "fire_gun2" },
                { type: ExplosionType.MIDDLE, asset: "fire_gun7" },
                { type: ExplosionType.LARGE, asset: "fire_gun4" }
            ]
            const fireGun = fireGunSfxInfo.find(i => i.type == attackerInfo.explosionType).asset
            document.kcs_SoundManagerInitializer().se_play(fireGun)

            //attack vfx
            const attackSpritesInfo = [
                { type: ExplosionType.SMALL, asset: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } }, shake: ShakeType.SMALL },
                { type: ExplosionType.MIDDLE, asset: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } }, shake: ShakeType.SMALL },
                { type: ExplosionType.LARGE, asset: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } }, shake: ShakeType.MIDDLE }
            ]
            const attackSpriteInfo = attackSpritesInfo.find(i => i.type == attackerInfo.explosionType).asset
            const shake = attackSpritesInfo.find(i => i.type == attackerInfo.explosionType).shake
            const frames = this._getAttackFrames(attackSpriteInfo.names).map(i => PIXI.Texture.from(i))

            var anim = new PIXI.extras.AnimatedSprite(frames);
            anim.loop = false;
            anim.animationSpeed = 0.25;
            anim.anchor.set(attackSpriteInfo.anchor.x, attackSpriteInfo.anchor.y); //depends of texture size
            anim.position.set(attackerPosX, attackerPosY)
            anim.rotation = Math.atan2(defenderPosY - attackerPosY, defenderPosX - attackerPosX)
            anim.onComplete = () => {
                this.removeChild(anim);
            }
            this.addChild(anim);
            anim.play();

            //bullet
            this._bulletTween = createjs.Tween.get(this)
            this._bulletTween.wait(40).call(() => {
                this._emitBullet(
                    attackerPosX, attackerPosY,
                    defenderPosX, defenderPosY,
                    this.attackExplosionDuration,
                    attackerInfo.explosionType,
                    callback
                )
            })
            this._cameraEffects.shakeCamera(
                shake.magnitude,
                shake.duration,
                shake.wiggles
            )
        }

        //impact
        playImpactExplosion(x, y, attackerInfo, callback) {
            const explosionInfo = [
                { type: ExplosionType.SMALL, asset: { hit: "boom_med1_g", missed: "boom_med1_w" }, shake: ShakeType.SMALL },
                { type: ExplosionType.MIDDLE, asset: { hit: "boom_big1_g", missed: "boom_big1_w" }, shake: ShakeType.MIDDLE },
                { type: ExplosionType.LARGE, asset: { hit: "boom_big1_g", missed: "boom_big1_w" }, shake: ShakeType.LARGE }
            ]
            const explosion = explosionInfo.find(i => i.type == attackerInfo.explosionType)
            var n = this;
            void 0 === callback && (callback = null),
                createjs.Tween.get(this).call(function () {
                    document.kcs_SoundManagerInitializer().se_play(attackerInfo.isMissed ? explosion.asset.missed : explosion.asset.hit)
                    this._cameraEffects.shakeCamera(
                        explosion.shake.magnitude,
                        explosion.shake.duration,
                        explosion.shake.wiggles
                    )
                    n._explodeCustom(x, y, attackerInfo.explosionType, attackerInfo.isMissed)
                })
        }


        //private
        //attack
        _getAttackFrames(names) {
            const name = names[Math.floor(Math.random() * names.length)];
            return utils.getFramesForBattleSprite(name)
        }

        //Bullet
        _emitBullet(fromX, fromY, toX, toY, time, explosionType, callback) {
            const Bullet = BulletInitializer(PIXI)

            const bulletInfo = [
                { type: ExplosionType.SMALL, asset: "bullet_small" },
                { type: ExplosionType.MIDDLE, asset: "bullet_middle" },
                { type: ExplosionType.LARGE, asset: "bullet_large" }
            ]
            const bulletTextureName = bulletInfo.find(i => i.type == explosionType).asset

            var bullet = new Bullet(fromX, fromY, toX, toY, bulletTextureName, time)
            bullet.position.set(0, 0)
            this.addChild(bullet)
            bullet.play(() => {
                this.removeChild(bullet)
                if (callback != null) callback({ x: toX, y: toY })
            })
        }

        //explode
        _explodeCustom(x, y, explosionType, isMissed, callback) {
            var n = this;
            void 0 === callback && (callback = null);

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
            let explosionTypeInfoObject = explosionTypesInfo.find(i => i.type == explosionType)
            let explosionTypeInfo = isMissed ? explosionTypeInfoObject.asset.missed : explosionTypeInfoObject.asset.hit

            var explosion = new CustomExplosion(explosionTypeInfo);
            explosion.position.set(x, y),
                this.addChild(explosion),
                explosion.play(function () {
                    n.removeChild(explosion),
                        null != callback && callback()
                })
        }


        //new function, will replace old
        playGunAttackExplosion(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            attackSfx,
            anchorX,
            anchorY,
            animatedSprite, //PIXI.extras.AnimatedSprite
            shake,
            bulletLifeTime,
            bulletTextureName,
            callback
        ) {
            //sfx
            document.kcs_SoundManagerInitializer().se_play(attackSfx)

            //vfx
            animatedSprite.loop = false;
            animatedSprite.animationSpeed = 0.25;
            animatedSprite.anchor.set(anchorX, anchorY); //depends of texture size
            animatedSprite.position.set(attackerPosX, attackerPosY)
            animatedSprite.rotation = Math.atan2(defenderPosY - attackerPosY, defenderPosX - attackerPosX)
            animatedSprite.onComplete = () => {
                this.removeChild(animatedSprite);
            }
            this.addChild(animatedSprite);
            animatedSprite.play();

            //bullet
            this._bulletTween = createjs.Tween.get(this)
            this._bulletTween.wait(40).call(() => {
                this._emitGunBullet(
                    attackerPosX, attackerPosY,
                    defenderPosX, defenderPosY,
                    bulletLifeTime,
                    bulletTextureName,
                    callback
                )
            })

            //shake
            this._cameraEffects.shakeCamera(
                shake.magnitude,
                shake.duration,
                shake.wiggles
            )
        }


        //impact
        playGunImpactExplosion(x, y, impactSfx, textureName, anchorX, anchorY, shake, callback) {
            
            const thisRef = this;
            void 0 === callback && (callback = null),
                createjs.Tween.get(this).call(function () {
                    document.kcs_SoundManagerInitializer().se_play(impactSfx)
                    thisRef._cameraEffects.shakeCamera(
                        shake.magnitude,
                        shake.duration,
                        shake.wiggles
                    )
                    thisRef._explodeGunImpact(x, y, textureName, anchorX, anchorY, callback)
                })
        }


        //Bullet
        _emitGunBullet(fromX, fromY, toX, toY, time, bulletTextureName, callback) {
            const Bullet = BulletInitializer(PIXI)

            var bullet = new Bullet(fromX, fromY, toX, toY, bulletTextureName, time)
            bullet.position.set(0, 0)
            this.addChild(bullet)
            bullet.play(() => {
                this.removeChild(bullet)
                if (callback != null) callback({ x: toX, y: toY })
            })
        }

        _explodeGunImpact(x, y, textureName, anchorX, anchorY, callback) {
            var n = this;
            void 0 === callback && (callback = null);

            var explosion = new CustomExplosion(
                {
                    name: textureName,
                    anchor: { x: anchorX, y: anchorY }
                }
            );
            explosion.position.set(x, y),
                this.addChild(explosion),
                explosion.play(function () {
                    n.removeChild(explosion),
                        null != callback && callback()
                })
        }
    }

}