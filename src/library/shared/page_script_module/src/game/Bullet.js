export default (PIXI) => { //TODO: get rid of lazy init
    return class Bullet extends PIXI.Container { //TODO: rename to Projectile
        constructor(fromX, fromY, toX, toY, textureName, time) {
            super();
            this.fromX = fromX
            this.fromY = fromY
            this.toX = toX
            this.toY = toY
            this.textureName = textureName


            this.time = time
            this._current_frame = 0
            this._img = new PIXI.Sprite
            this._img.rotation = Math.atan2(toY - fromY, toX - fromX)
            this.addChild(this._img)
        }


        play(completion) {
            this._resetImageOffset()
            void 0 === completion && (completion = null),
                this._isPlaying || (this._isPlaying = true,
                    this.createTween(completion))
        }
        createTween(completion) {
            this._img.texture = PIXI.Texture.from(this.textureName)
            this._img.anchor.set(1, 0.5);


            this._tween = new createjs.Tween(this._img.position)
                .to({ x: this.toX, y: this.toY }, this.time)

            this._tween.call(() => {
                if (completion != null)
                    completion()
            })
        }
        stop() {
            this._isPlaying && (this._isPlaying = false,
                this._tween.setPaused(true)),
                this._current_frame = 0,
                this._resetImageOffset(this._current_frame)
        }

        _resetImageOffset() {
            this._img.position.set(this.fromX, this.fromY);
        }
    }
}