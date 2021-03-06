//utils
import utils from './utils'

export default (PIXI) => {
    return class Laser extends PIXI.Container {
        constructor(fromX, fromY, toX, toY, animationArgs) {
            super();
            //args
            this._fromX = fromX;
            this._fromY = fromY;
            this._toX = toX;
            this._toY = toY;
            this._isAnimating = false;
            
            //resources
            const beamMask = PIXI.Texture.from(animationArgs.beamMask)
            const beamTextureNames = animationArgs.beamTextureNames
            const beamTextures = animationArgs.beamTextureNames.map((beam) => PIXI.Texture.from(beam.texture))
            const originResources = animationArgs.originResources
            const impactResources = animationArgs.impactResources
            const explosionChainTextures = this._createTextures(animationArgs.impactChainAnimatedSprite);
            //args
            this._beamTime = animationArgs.beamTime
            this._beamDelay = animationArgs.beamDelay
            this._fadeInTime = animationArgs.fadeInTime
            this._fadeOutTime = animationArgs.fadeOutTime
            const explosionChainAnimationSpeed = animationArgs.explosionChainAnimationSpeed
            this._xPathRange = animationArgs.xPathRange * -1 //movement always from right to left, laser only for abyssals
            this._yPathRange = animationArgs.yPathRange * (1 - 2 * Math.round(Math.random())) //random movement, from top to bottom or othervise
            this._explosionChainCount = animationArgs.explosionChainCount
            //sprites
            this._beams = beamTextures.map((texture) => this._createTilingSprite(texture))
            this._beamsSpeeds = beamTextureNames.map((beam) => beam.xSpeed)
            this._beamMask = this._createSprite(beamMask)
            this._origins = originResources.map((resource) => this._resourceToSprite(resource))
            this._impacts = impactResources.map((resource) => this._resourceToSprite(resource))
            this._explosionsChain = this._createAnimatedTextures(this._explosionChainCount, explosionChainTextures);
            this._layerExplosions = new PIXI.Container();
            //sprites parameters
            this._explosionsChain.forEach(sprite => (sprite.animationSpeed = explosionChainAnimationSpeed));
            this._beams.forEach(sprite => { sprite.mask = this._beamMask })
            this._beamMask.anchor.set(0, 0.5);

            this._beamMaskTextureSize = { width: beamMask.width, height: beamMask.height }
            this._beamTextureSizes = beamTextures.map(texture => { return { width: texture.width, height: texture.height } })
        }

        play(completion) {
            this._animationProgress = 0

            //hide beam before delay
            this._setLaserVisibile(false)

            this._addAndPlayChilds()
            this._createTween(this._beamDelay, () => {
                this.stop(completion)
            })
        }

        stop(completion) {
            this._stopAndRemoveChilds(() => {
                try { this._tween.setPaused(true) } catch{ }
                if (completion != null)
                    completion()
            });

        }

        //private
        set _animationProgress(value) {
            this._animationProgressValue = value
            this._didSetAnimationProgress(value);
        }

        get _animationProgress() {
            if (this._animationProgressValue == null)
                this._animationProgressValue = 0
            return this._animationProgressValue
        }

        _setLaserVisibile(visible) {
            if (this._laserIsVisible == undefined) {
                this._laserIsVisible = !visible
            }
            if (visible != this._laserIsVisible) {
                this._beams.forEach(sprite => sprite.visible = visible);
                this._impacts.forEach(sprite => sprite.visible = visible);
                this._layerExplosions.visible = visible
            }
            this._laserIsVisible = visible
        }

        _resourceToSprite(resource) {
            if (resource.animatedSprite) {
                const animatedSprite = this._createAnimatedSprite(this._createTextures(resource.animatedSprite))
                if (resource.loop != undefined)
                    animatedSprite.loop = resource.loop
                if (resource.animationSpeed != undefined)
                    animatedSprite.animationSpeed = resource.animationSpeed
                return animatedSprite
            } else if (resource.texture)
                return this._createSprite(PIXI.Texture.from(resource.texture))
            else
                throw `Laser._resourceToSprite Illegal resource ${resource}`
        }

        _didSetAnimationProgress(progress) {
            const toX = this._toX + (- this._xPathRange / 2 + this._xPathRange * progress)
            const toY = this._toY + (- this._yPathRange / 2 + this._yPathRange * progress)

            this._moveLaser(
                this._fromX,
                this._fromY,
                toX,
                toY,
                this._beams,
                this._beamMask,
                this._origins,
                this._impacts
            );

            this._beams.forEach(
                (sprite, i) =>
                    (sprite.tilePosition.x = progress * 500 * this._beamsSpeeds[i])
            );

            let index = Math.floor(this._explosionsChain.length * progress);
            this._explode(index, toX, toY);
        }

        _addAndPlayChilds() {
            if (!this._isAnimating) {
                this.alpha = 0
                //addChild
                this.addChild(this._beamMask)
                this._beams.forEach(sprite => this.addChild(sprite));
                this.addChild(this._layerExplosions);
                this._explosionsChain.forEach(sprite => { this._layerExplosions.addChild(sprite); sprite.visible = false; });
                this._origins.forEach(sprite => this.addChild(sprite));
                this._impacts.forEach(sprite => this.addChild(sprite));
                //play
                this._origins.forEach(sprite => { if (sprite instanceof PIXI.extras.AnimatedSprite && !sprite.playing) { sprite.play(); } });
                this._impacts.forEach(sprite => { if (sprite instanceof PIXI.extras.AnimatedSprite && !sprite.playing) { sprite.play(); } });

                this._fadeInTween = new createjs.Tween(this)
                    .to({ alpha: 1 }, this._fadeInTime)
                this._fadeInTween.call(() => { })
            }
            this._isAnimating = true;
        }

        _stopAndRemoveChilds(completion) {
            if (this._isAnimating) {
                this.alpha = 1
                this._fadeOutTween = new createjs.Tween(this)
                    .to({ alpha: 0 }, this._fadeOutTime)
                this._fadeOutTween.call(() => {
                    //stop
                    this._beams.forEach(sprite => { if (sprite instanceof PIXI.extras.AnimatedSprite) { sprite.stop(); } });
                    this._explosionsChain.forEach(sprite => { if (sprite instanceof PIXI.extras.AnimatedSprite) { sprite.stop(); } });
                    this._origins.forEach(sprite => { if (sprite instanceof PIXI.extras.AnimatedSprite) { sprite.stop(); } });
                    this._impacts.forEach(sprite => { if (sprite instanceof PIXI.extras.AnimatedSprite) { sprite.stop(); } });
                    //removeChild
                    this._beams.forEach(sprite => this.removeChild(sprite));
                    this.removeChild(this._layerExplosions);
                    this._explosionsChain.forEach(sprite => this._layerExplosions.removeChild(sprite));
                    this._origins.forEach(sprite => this.removeChild(sprite));
                    this._impacts.forEach(sprite => this.removeChild(sprite));
                    completion()
                })
            } else {
                completion()
            }
            this._isAnimating = true;
        }

        _createTextures(name) {
            return utils.getResourcesFromSpriteSheet(name).map(i => PIXI.Texture.from(i))
        }

        _createAnimatedSprite(animatedTexture) {
            const explosion = new PIXI.extras.AnimatedSprite(animatedTexture);
            explosion.anchor.set(0.5);
            explosion.loop = false;
            return explosion;
        }

        _createSprite(texture) {
            let sprite = new PIXI.Sprite(texture);
            sprite.width = texture.width;
            sprite.height = texture.height;
            sprite.anchor.set(0.5, 0.5);
            return sprite;
        }

        _createTilingSprite(texture) {
            const tilingSprite = new PIXI.extras.TilingSprite(
                texture,
                texture.width,
                texture.height
            );

            tilingSprite.anchor.set(0, 0.5);
            return tilingSprite;
        }

        _moveLaser(fromX, fromY, toX, toY, beams, beamMask, origins, impacts) {
            const maxBeamHeight = Math.max(...this._beamTextureSizes.map(size => size.height))
            const beamWidth = Math.sqrt(Math.pow(toY - fromY, 2) + Math.pow(toX - fromX, 2));
            const beamRotation = Math.atan2(toY - fromY, toX - fromX);

            beamMask.x = fromX;
            beamMask.y = fromY;
            beamMask.rotation = beamRotation

            beamMask.scale.set(beamWidth / this._beamMaskTextureSize.width, maxBeamHeight / this._beamMaskTextureSize.height)

            beams.forEach(beam => {
                beam.x = fromX;
                beam.y = fromY;
                beam.rotation = beamRotation
                beam.width = beamWidth
            });

            origins.forEach(origin => {
                origin.x = fromX;
                origin.y = fromY;
            });

            impacts.forEach(impact => {
                impact.x = toX;
                impact.y = toY;
            });
        }

        _explode(index, x, y) {
            let _index = index;
            if (_index < 0) _index = 0;
            if (_index >= this._explosionsChain.length)
                _index = this._explosionsChain.length - 1;

            let explosionSprite = this._explosionsChain[_index];

            if (!explosionSprite.playing) {
                explosionSprite.visible = true
                explosionSprite.x = x;
                explosionSprite.y = y;
                explosionSprite.rotation = 2 * Math.PI * Math.random();
                explosionSprite.play();
            }
        }

        _createTween(delay, completion) {
            this._tween = new createjs.Tween(this)
                .wait(delay)
                .call(() => { this._setLaserVisibile(true) })
                .to({ _animationProgress: 1 }, this._beamTime)
            this._tween.call(() => {
                if (completion != null)
                    completion()
            })
        }

        _createAnimatedTextures(count, animatedTexture) {
            return [...Array(count).keys()].map(() =>
                this._createAnimatedSprite(animatedTexture)
            );
        }
    };
};

//https://codesandbox.io/s/pixijs-simple-i198l?file=/src/index.js:0-3771