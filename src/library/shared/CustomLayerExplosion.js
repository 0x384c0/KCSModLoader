

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {

    attackExplosionDuration = 300
    playAttackExplosion(
        attackerPosX, attackerPosY,
        defenderPosX, defenderPosY,
        attackInfo,
        callback
    ) {
        this._explodeCustom(attackerPosX, attackerPosY) // add gun shoot flares
        document.kcs_SoundManager.se_play("fire_gun4")
        this._emitBullet(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            this.attackExplosionDuration,
            callback
        )
    }

    //impact
    playImpactExplosion(x, y, attackInfo, callback) {
        var n = this;
        void 0 === callback && (callback = null),
            createjs.Tween.get(this).call(function () {
                document.kcs_SoundManager.se_play(attackInfo.isMissed ? "boom_big1_w" : "boom_big1_g")
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

