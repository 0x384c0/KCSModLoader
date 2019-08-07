class CustomExplosion extends PIXI.Container {
    constructor() {
        super();
        this._current_frame = 0
        this._img = new PIXI.Sprite
        this.addChild(this._img)
    }


    play(completion) {
        void 0 === completion && (completion = null),
            this._isPlaying || (this._isPlaying = true,
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
                    e._current_frame <= 15 ? e.createTween(completion) : (e._isPlaying = false,
                        e._current_frame = 0,
                        null != completion && completion())
            })
    }
    stop() {
        this._isPlaying && (this._isPlaying = false,
            this._tween.setPaused(true)),
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
