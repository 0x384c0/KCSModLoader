

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {
    playDamageExplosionCustom(t, e, i, n) {
        void 0 === n && (n = null),
            i < 0 ? null != n && n() : i < 16 ? this.playExplosionLargeCustom(t, e, n) : i < 40 ? this.playExplosionLargeCustom(t, e, n) : this.playExplosionLargeCustom(t, e, n)
    }

    playExplosionLargeCustom(t, e, i) {
        var n = this;
        void 0 === i && (i = null),
            createjs.Tween.get(this).call(function () {
                // document.kcs_SE.SE.play("104"),
                    n._explodeCustom(t - 5, e + 33)
            }).wait(100).call(function () {
                n._explodeCustom(t + 48, e - 24)
            }).wait(100).call(function () {
                n._explodeCustom(t - 50, e - 8, i)
            })
    }

    _explodeCustom(t, e, i) {
        var n = this;
        void 0 === i && (i = null);
        var o = new CustomExplosion();
        o.position.set(t, e),
            this.addChild(o),
            o.play(function () {
                n.removeChild(o),
                    null != i && i()
            })
    }
}
