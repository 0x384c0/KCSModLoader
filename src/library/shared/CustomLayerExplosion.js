

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {

    attackExplosionDuration = 600
    playAttackExplosion(
        attackerPosX, attackerPosY,
        defenderPosX, defenderPosY
    ) {
        this._explodeCustom(attackerPosX, attackerPosY)
        this._emitBullet(
            attackerPosX, attackerPosY,
            defenderPosX, defenderPosY,
            this.attackExplosionDuration
        )
    }

    playDamageExplosionCustom(x, y, damage, callback) {
        void 0 === callback && (callback = null),
            damage < 0 ? null != callback && callback() : damage < 16 ? this.playExplosionLargeCustom(x, y, callback) : damage < 40 ? this.playExplosionLargeCustom(x, y, callback) : this.playExplosionLargeCustom(x, y, callback)
    }

    playExplosionLargeCustom(x, y, callback) {
        var n = this;
        void 0 === callback && (callback = null),
            createjs.Tween.get(this).call(function () {
                // document.kcs_SE.SE.play("104"),
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

