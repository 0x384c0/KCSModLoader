const ExplosionType = {
    SMALL: 'SMALL',
    MIDDLE: 'MIDDLE',
    LARGE: 'LARGE'
}

const explosionTypesInfo = [
    {
        type: ExplosionType.SMALL,
        default: {
            name: "explosion_small_g",
            anchor: { x: 0.5, y: 0.73 }
        },
        missed: {
            name: "explosion_large_w",
            anchor: { x: 0.5, y: 0.71 }
        }
    },
    {
        type: ExplosionType.MIDDLE,
        default: {
            name: "explosion_middle_g",
            anchor: { x: 0.5, y: 0.7 }
        },
        missed: {
            name: "explosion_large_w",
            anchor: { x: 0.5, y: 0.71 }
        }
    },
    {
        type: ExplosionType.LARGE,
        default: {
            name: "explosion_middle_g",
            anchor: { x: 0.5, y: 0.7 }
        },
        missed: {
            name: "explosion_large_w",
            anchor: { x: 0.5, y: 0.71 }
        }
    }
]

class CustomExplosion extends PIXI.Container {

    constructor(explosionType, isMissed) {
        super();
        let explosionTypeInfoObject = explosionTypesInfo.find(i => i.type == explosionType)
        this._explosionTypeInfo = isMissed ? explosionTypeInfoObject.missed : explosionTypeInfoObject.default
        this._explosionTypeInfo.frames = getFramesForBattleSprite(this._explosionTypeInfo.name)
        this._current_frame = 0
        this._img = new PIXI.Sprite
        this._isMirror = Math.random() >= 0.5
        this.addChild(this._img)
    }


    play(completion) {
        void 0 === completion && (completion = null),
            this._isPlaying || (this._isPlaying = true,
                this.createTween(completion))
    }
    createTween(completion) {
        var e = this;
        e._setImageOffset(e._current_frame)
        void 0 === completion && (completion = null),
            createjs.Tween.removeTweens(this),
            this._tween = createjs.Tween.get(this),
            this._tween.wait(40).call(function () {
                e._current_frame++
                e._img.texture = e._getTexture(e._current_frame)

                e._current_frame < this._explosionTypeInfo.frames.length ? e.createTween(completion) : (e._isPlaying = false,
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
        return PIXI.Texture.from(this._explosionTypeInfo.frames[current_frame])
    }

    _setImageOffset(current_frame) {
        this._img.anchor.set(this._explosionTypeInfo.anchor.x, this._explosionTypeInfo.anchor.y);
        this._img.position.set(0, 0);
        const scale = 0.8 //TODO: remove
        this._img.scale.x = this._isMirror ? -1 * scale : 1 * scale
        this._img.scale.y = scale
    }
}
