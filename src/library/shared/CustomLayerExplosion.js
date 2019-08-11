const AttackAnimationInfo = {

}

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {

    attackExplosionDuration = 300
    playAttackExplosion(
        attackerPosX, attackerPosY,
        defenderPosX, defenderPosY,
        attackerInfo,
        callback
    ) {
        //bullet
        this._emitBullet(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            this.attackExplosionDuration,
            callback
        )

        //attack sfx
        const fireGunInfo = [
            {type: ExplosionType.SMALL, default:"fire_gun2"},
            {type: ExplosionType.MIDDLE, default:"fire_gun7"},
            {type: ExplosionType.LARGE, default:"fire_gun4"}
        ]
        const fireGun = fireGunInfo.find(i => i.type == attackerInfo.explosionType).default
        document.kcs_SoundManager.se_play(fireGun)

        //attack vfx
        const frames = [];
        const variant = Math.round(Math.random())
        for (let i = 0; i < 6; i++) {
            frames.push(PIXI.Texture.from(`attack_middle_${variant}_${i}`));
        }
        var anim = new PIXI.extras.AnimatedSprite(frames);
        anim.loop = false;
        anim.animationSpeed = 0.25;
        anim.anchor.set(0.40,0.5); //depends of texture size
        anim.position.set(attackerPosX, attackerPosY)
        anim.rotation = Math.atan2(defenderPosY - attackerPosY, defenderPosX - attackerPosX)
        anim.onComplete = ()=>{
            this.removeChild(anim);
        }
        this.addChild(anim);
        anim.play();
    }

    //impact
    playImpactExplosion(x, y, attackerInfo, callback) {
        const explosionInfo = [
            {type: ExplosionType.SMALL, default:"boom_med1_g", missed: "boom_med1_w"},
            {type: ExplosionType.MIDDLE, default:"boom_big1_g", missed: "boom_big1_w"},
            {type: ExplosionType.LARGE, default:"boom_big1_g", missed: "boom_big1_w"}
        ]
        const explosion = explosionInfo.find(i => i.type == attackerInfo.explosionType)
        var n = this;
        void 0 === callback && (callback = null),
            createjs.Tween.get(this).call(function () {
                document.kcs_SoundManager.se_play(attackerInfo.isMissed ? explosion.missed : explosion.default)
                n._explodeCustom(x, y)
            })
    }


    //private
    //Bullet
    _emitBullet(fromX, fromY, toX, toY, time, callback) {
        var bullet = new Bullet(fromX, fromY, toX, toY, time)
        bullet.position.set(0, 0)
        this.addChild(bullet)
        bullet.play(() => {
            this.removeChild(bullet)
            if (callback != null) callback()
        })
    }

    //explode
    _explodeCustom(x, y, callback) {
        var n = this;
        void 0 === callback && (callback = null);
        var explosion = new CustomExplosion();
        explosion.position.set(x, y),
            this.addChild(explosion),
            explosion.play(function () {
                n.removeChild(explosion),
                    null != callback && callback()
            })
    }
}

