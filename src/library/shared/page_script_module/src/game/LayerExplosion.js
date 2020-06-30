import BulletInitializer from './Bullet'
import LaserInitializer from './Laser'
import CustomExplosionInitializer from './CustomExplosion'
import CameraEffects from './CameraEffects'

export default (LayerExplosion, args) => {
    const CustomExplosion = CustomExplosionInitializer(PIXI)
    const getRootView = args.getRootView
    return class CustomLayerExplosion extends LayerExplosion {
        constructor(scene) {
            super(scene)
            this.attackExplosionDuration = 200
            this._cameraEffects = new CameraEffects(getRootView)
        }

        //public
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

        playLaserAttackExplosion(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            attackSfx,
            time,
            shake,
            callback
        ) {
            //sfx
            document.kcs_SoundManagerInitializer().se_play(attackSfx)
            
            //vfx
            this._emitLaser(
                attackerPosX, attackerPosY,
                defenderPosX, defenderPosY,
                time,
                callback
            )

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



        //private
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

        //laser
        _emitLaser(fromX, fromY, toX, toY, time, callback) {
            const Laser = LaserInitializer(PIXI)

            var laser = new Laser(fromX, fromY, toX, toY, time)
            laser.position.set(0, 0)
            this.addChild(laser)
            laser.play(() => {
                this.removeChild(laser)
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