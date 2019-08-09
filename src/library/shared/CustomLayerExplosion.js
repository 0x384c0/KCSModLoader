

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {

    attackExplosionDuration = 300
    playAttackExplosion(
        attackerPosX, attackerPosY,
        defenderPosX, defenderPosY,
        attackInfo,
        callback
    ) {
        const fireGunInfo = [
            {type: ExplosionType.SMALL, default:"fire_gun2"},
            {type: ExplosionType.MIDDLE, default:"fire_gun7"},
            {type: ExplosionType.LARGE, default:"fire_gun4"}
        ]
        const fireGun = fireGunInfo.find(i => i.type == attackInfo.explosionType).default
        this._explodeCustom(attackerPosX, attackerPosY) // add gun shoot flares
        document.kcs_SoundManager.se_play(fireGun)
        this._emitBullet(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            this.attackExplosionDuration,
            callback
        )
    }

    //impact
    playImpactExplosion(x, y, attackInfo, callback) {
        const explosionInfo = [
            {type: ExplosionType.SMALL, default:"boom_med1_g", missed: "boom_med1_w"},
            {type: ExplosionType.MIDDLE, default:"boom_big1_g", missed: "boom_big1_w"},
            {type: ExplosionType.LARGE, default:"boom_big1_g", missed: "boom_big1_w"}
        ]
        const explosion = explosionInfo.find(i => i.type == attackInfo.explosionType)
        var n = this;
        void 0 === callback && (callback = null),
            createjs.Tween.get(this).call(function () {
                document.kcs_SoundManager.se_play(attackInfo.isMissed ? explosion.missed : explosion.default)
                n._explodeCustom(x, y)
            }).wait(300).call(function () {
                n._explodeCustom(x + 10, y + 10)
            }).wait(300).call(function () {
                n._explodeCustom(x + 20, y + 20, callback)
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

