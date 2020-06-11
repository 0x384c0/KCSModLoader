import BulletInitializer from './Bullet'
import CustomExplosion from './CustomExplosion'
import utils from './utils'
const ExplosionType = CustomExplosion.ExplosionType
const CustomExplosionInitializer = CustomExplosion.CustomExplosionInitializer

export default (parent,args) => {
    const CustomExplosion = CustomExplosionInitializer(PIXI)
    const getRootView = args.getRootView 
    return class CustomLayerExplosion extends parent {
        constructor(scene) {
            super(scene)
            this.attackExplosionDuration = 200
        }

        playAttackExplosion(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            attackerInfo,
            callback
        ) {
            //attack sfx
            const fireGunSfxInfo = [
                { type: ExplosionType.SMALL, default: "fire_gun2" },
                { type: ExplosionType.MIDDLE, default: "fire_gun7" },
                { type: ExplosionType.LARGE, default: "fire_gun4" }
            ]
            const fireGun = fireGunSfxInfo.find(i => i.type == attackerInfo.explosionType).default
            document.kcs_SoundManagerInitializer().se_play(fireGun)

            //attack vfx
            const attackSpritesInfo = [
                { type: ExplosionType.SMALL, default: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } } },
                { type: ExplosionType.MIDDLE, default: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } } },
                { type: ExplosionType.LARGE, default: { names: ["attack_middle_0", "attack_middle_1"], anchor: { x: 0.4, y: 0.5 } } }
            ]
            const attackSpriteInfo = attackSpritesInfo.find(i => i.type == attackerInfo.explosionType).default
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
        }

        //impact
        playImpactExplosion(x, y, attackerInfo, callback) {
            const explosionInfo = [
                { type: ExplosionType.SMALL, default: "boom_med1_g", missed: "boom_med1_w" },
                { type: ExplosionType.MIDDLE, default: "boom_big1_g", missed: "boom_big1_w" },
                { type: ExplosionType.LARGE, default: "boom_big1_g", missed: "boom_big1_w" }
            ]
            const explosion = explosionInfo.find(i => i.type == attackerInfo.explosionType)
            var n = this;
            void 0 === callback && (callback = null),
                createjs.Tween.get(this).call(function () {
                    document.kcs_SoundManagerInitializer().se_play(attackerInfo.isMissed ? explosion.missed : explosion.default)
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
                { type: ExplosionType.SMALL, default: "bullet_small" },
                { type: ExplosionType.MIDDLE, default: "bullet_middle" },
                { type: ExplosionType.LARGE, default: "bullet_large" }
            ]
            const bulletTextureName = bulletInfo.find(i => i.type == explosionType).default

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
            var explosion = new CustomExplosion(explosionType, isMissed);
            explosion.position.set(x, y),
                this.addChild(explosion),
                explosion.play(function () {
                    n.removeChild(explosion),
                        null != callback && callback()
                })
        }

        //shake
        _shakeCamera(){
            this._interruptShake()
            let rootView = getRootView()
            // this._taskShake = 
        }

        _interruptShake(){

        }
    }
}