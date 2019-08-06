
class CustomPhaseAttackNormal extends document.kcs_PhaseAttackNormal.PhaseAttackNormal {
    _playExplosion(t, e) {
        var i = t.getGlobalPos(!0);
        this._scene.view.layer_explosion.playDamageExplosionCustom(i.x, i.y, e)
    }
}

class CustomExplosion extends PIXI.Container {
    constructor() {
        super();
        this._current_frame = 0
        this._img = new PIXI.Sprite
        this.addChild(this._img)
    }


    play(completion) {
        void 0 === completion && (completion = null),
            this._isPlaying || (this._isPlaying = !0,
                this.createTween(completion))
    }
    createTween(completion) {
        var e = this;
        void 0 === completion && (completion = null),
            createjs.Tween.removeTweens(this),
            this._tween = createjs.Tween.get(this),
            this._tween.wait(33).call(function () {
                e._current_frame++ ,
                    e._img.texture = e._getTexture(e._current_frame),
                    e._setImageOffset(e._current_frame),
                    e._current_frame <= 15 ? e.createTween(completion) : (e._isPlaying = !1,
                        e._current_frame = 0,
                        null != completion && completion())
            })
    }
    stop() {
        this._isPlaying && (this._isPlaying = !1,
            this._tween.setPaused(!0)),
            this._current_frame = 0,
            this._img.texture = this._getTexture(this._current_frame),
            this._setImageOffset(this._current_frame)
    }

    _getTexture(current_frame) {
        return PIXI.Texture.WHITE
    }

    _setImageOffset(current_frame) {
        this._img.position.set(0, 0);
    }
}

class CustomLayerExplosion extends document.kcs_LayerExplosion.LayerExplosion {
    playDamageExplosionCustom(t, e, i, n) {
        void 0 === n && (n = null),
            i < 0 ? null != n && n() : i < 16 ? this.playExplosionLargeCustom(t, e, n) : i < 40 ? this.playExplosionLargeCustom(t, e, n) : this.playExplosionLargeCustom(t, e, n)
    }

    playExplosionLargeCustom(t, e, i) {
        var n = this;
        void 0 === i && (i = null),
            createjs.Tween.get(this).call(function () {
                document.kcs_SE.SE.play("104"),
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

function injectKCSMods() {
    document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal
    document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion
}