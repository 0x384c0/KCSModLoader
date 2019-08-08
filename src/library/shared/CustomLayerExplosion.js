

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {

    attackExplosionDuration = 300
    playAttackExplosion(
        attackerPosX, attackerPosY,
        defenderPosX, defenderPosY
    ) {
        this._explodeCustom(attackerPosX, attackerPosY)
        document.kcs_SoundManager.se_play("fire_gun4")
        this._emitBullet(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            this.attackExplosionDuration
        )
    }

    playDamageExplosionCustom(x, y, damage, callback) {
        const isMissed = damage == 0
        void 0 === callback && (callback = null),
            damage < 0 ? null != callback && callback() : damage < 16 ? this.playExplosionLargeCustom(x, y, callback,isMissed) : damage < 40 ? this.playExplosionLargeCustom(x, y, callback,isMissed) : this.playExplosionLargeCustom(x, y, callback,isMissed)
    }

    playExplosionLargeCustom(x, y, callback,isMissed) {
        var n = this;
        void 0 === callback && (callback = null),
            createjs.Tween.get(this).call(function () {

                if (isMissed)
                    document.kcs_SoundManager.se_play("boom_big1_w")
                else
                    document.kcs_SoundManager.se_play("boom_big1_g")

                n._explodeCustom(x, y)
            }).wait(300).call(function () {
                n._explodeCustom(x + 10, y + 10)
            }).wait(300).call(function () {
                n._explodeCustom(x + 20, y + 20, callback)
            })
    }

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

    _emitBullet(fromX, fromY, toX, toY, time) {
        var bullet = new Bullet(fromX, fromY, toX, toY, time)
        bullet.position.set(0, 0)
        this.addChild(bullet)
        bullet.play(() => {
            this.removeChild(bullet)
        })
    }
}

