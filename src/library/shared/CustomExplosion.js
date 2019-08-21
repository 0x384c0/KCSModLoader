const ExplosionType = {
    SMALL: 'SMALL',
    MIDDLE: 'MIDDLE',
    LARGE: 'LARGE'
}

const explosionTypesInfo = [{
        type: ExplosionType.SMALL,
        default: {
            name: "explosion_middle_g_",
            frames: 51
        },
        missed: {
            name: "explosion_large_w_",
            frames: 49
        }
    },
    {
        type: ExplosionType.MIDDLE,
        default: {
            name: "explosion_middle_g_",
            frames: 51
        },
        missed: {
            name: "explosion_large_w_",
            frames: 49
        }
    },
    {
        type: ExplosionType.LARGE,
        default: {
            name: "explosion_middle_g_",
            frames: 51
        },
        missed: {
            name: "explosion_large_w_",
            frames: 49
        }
    }
]

class CustomExplosion extends PIXI.Container {

    constructor(explosionType,isMissed) {
        super();
        let explosionTypeInfoObject = explosionTypesInfo.find(i => i.type == explosionType)
        this.explosionTypeInfo =  isMissed ? explosionTypeInfoObject.missed : explosionTypeInfoObject.default
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
            this._tween.wait(40).call(function () {
                e._current_frame++
                e._img.texture = e._getTexture(e._current_frame)

                e._setImageOffset(e._current_frame)
                e._current_frame < this.explosionTypeInfo.frames ? e.createTween(completion) : (e._isPlaying = false,
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
        return PIXI.Texture.from(`${this.explosionTypeInfo.name}${current_frame}`)
    }

    _setImageOffset(current_frame) {
        this._img.anchor.set(0.5,0.71); //depends of texture size
        this._img.position.set(0, 0);
    }
}
