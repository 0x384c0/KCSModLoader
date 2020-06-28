//utils
function frac(x) {
    return x - Math.floor(x, 1);
}

// export default (PIXI) => {
const LaserInitializer = PIXI => {
    return class Laser extends PIXI.Container {
        constructor(fromX, fromY, toX, toY, time) {
            super();
            //args
            this._fromX = fromX;
            this._fromY = fromY;
            this._toX = toX;
            this._toY = toY;
            //vars
            this._time = time;
            this._isAnimating = false;
            //resources

            const beamMask = PIXI.Texture.from("examples/assets/beam_mask.png")
            const textureBeam = PIXI.Texture.from("examples/assets/FXObeliskLaserHeroic.png");
            const textureBeamBg = PIXI.Texture.from("examples/assets/FXIonCannoncc.png");
            const laserOriginLightTexture = this._createSprite(PIXI.Texture.from("examples/assets/light_large.png"));
            const laserOriginTextures = this._createTextures("laser_origin_", 20);
            const explosionSparkTextures = this._createTextures("explosion_sparkl_", 13);
            const laserImpactLightTexture = this._createSprite(PIXI.Texture.from("examples/assets/light_middle.png"));
            const explosionAnimationSpeed = 0.3;
            //sprites
            this._originSpeeds = [.8, null];
            this._beamsSpeeds = [1, 2];
            this._beams = [this._createTilingSprite(textureBeamBg), this._createTilingSprite(textureBeam)];
            this._beamMask = this._createSprite(beamMask)
            this._origins = [this._createAnimatedSprite(laserOriginTextures), laserOriginLightTexture];
            this._impacts = [laserImpactLightTexture];
            this._explosions = this._createAnimatedTextures(20, explosionSparkTextures);
            this._layerExplosions = new PIXI.Container();
            //sprites parameters
            this._origins.forEach((sprite, i) => { if (sprite instanceof PIXI.AnimatedSprite) { sprite.loop = true; sprite.animationSpeed = this._originSpeeds[i]; } });
            this._impacts.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite) { sprite.loop = true; } });
            this._explosions.forEach(sprite => (sprite.animationSpeed = explosionAnimationSpeed));
            this._beams.forEach(sprite => { sprite.mask = this._beamMask })
            this._beamMask.anchor.set(0, 0.5);

            this._beamMaskTextureSize = { width: beamMask.width, height: beamMask.height }
            this._beamTextureSizes = [{ width: textureBeamBg.width, height: textureBeamBg.height },{ width: textureBeam.width, height: textureBeam.height }]
        }

        play(completion) {
            this._completion = completion;

            this._runAnimation(progress => {
                if (progress >= 0 && progress <= 0.1) this._addAndPlayChilds();
                else if (progress >= 0.9 && progress <= 1) this._stopAndRemoveChilds();

                this._setAnimationProgress(progress);
            });
        }

        stop() {
            this._stopAndRemoveChilds();

            try {
                this._completion();
            } catch { }
        }

        //private
        _addAndPlayChilds() {
            if (!this._isAnimating) {
                //addChild
                this.addChild(this._beamMask)
                this._beams.forEach(sprite => this.addChild(sprite));
                this.addChild(this._layerExplosions);
                this._explosions.forEach(sprite => { this._layerExplosions.addChild(sprite); sprite.visible = false; });
                this._origins.forEach(sprite => this.addChild(sprite));
                this._impacts.forEach(sprite => this.addChild(sprite));
                //play
                this._origins.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite && !sprite.playing) { sprite.play(); } });
                this._impacts.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite && !sprite.playing) { sprite.play(); } });
            }
            this._isAnimating = true;
        }

        _stopAndRemoveChilds() {
            if (this._isAnimating) {
                //stop
                this._beams.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite) { sprite.stop(); } });
                this._explosions.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite) { sprite.stop(); } });
                this._origins.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite) { sprite.stop(); } });
                this._impacts.forEach(sprite => { if (sprite instanceof PIXI.AnimatedSprite) { sprite.stop(); } });
                //removeChild
                this._beams.forEach(sprite => this.removeChild(sprite));
                this.removeChild(this._layerExplosions);
                this._explosions.forEach(sprite => this._layerExplosions.removeChild(sprite));
                this._origins.forEach(sprite => this.removeChild(sprite));
                this._impacts.forEach(sprite => this.removeChild(sprite));
            }
            this._isAnimating = true;
        }

        _setAnimationProgress(progress) {
            const toX = this._toX * progress;
            const toY = this._toY;

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

            let index = Math.floor(this._explosions.length * progress);
            this._explode(index, toX, toY);
        }

        _createTextures(name, count) {
            const animatedTexture = [];
            let i;
            for (i = 0; i < count; i++) {
                const texture = PIXI.Texture.from(`${name}${i + 1}.png`);
                animatedTexture.push(texture);
            }
            return animatedTexture;
        }

        _createAnimatedSprite(animatedTexture) {
            const explosion = new PIXI.AnimatedSprite(animatedTexture);
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
            const tilingSprite = new PIXI.TilingSprite(
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
            if (_index >= this._explosions.length)
                _index = this._explosions.length - 1;

            let explosionSprite = this._explosions[_index];

            if (!explosionSprite.playing) {
                explosionSprite.visible = true
                explosionSprite.x = x;
                explosionSprite.y = y;
                explosionSprite.rotation = 2 * Math.PI * Math.random();
                explosionSprite.play();
            }
        }

        _runAnimation(handler) {
            let totalTime = 0;
            app.ticker.add(delta => {
                totalTime += delta;
                handler(frac(totalTime * 0.01));
            });
        }

        _createAnimatedTextures(count, animatedTexture) {
            return [...Array(count).keys()].map(() =>
                this._createAnimatedSprite(animatedTexture)
            );
        }
    };
};

//https://codesandbox.io/s/pixijs-simple-i198l?file=/src/index.js:0-3771

// init
import "./styles.css";
import * as PIXI from "pixi.js";

const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0x3d8bb4
});

document.body.appendChild(app.view);

let fromX = app.screen.width * 0.1;
let fromY = app.screen.width * 0.2;

let toX = app.screen.width * 0.9;
let toY = app.screen.width * 0.6;

app.stop();

const loaderParams = {
    crossOrigin: "anonymous",
    loadType: null
};

app.loader
    .add("spritesheet", "examples/assets/spritesheet/mc.json", loaderParams)
    .add(
        "laser_origin",
        "examples/assets/spritesheet/laser_origin.json",
        loaderParams
    )
    .add(
        "explosion_spark",
        "examples/assets/spritesheet/explosion_spark.json",
        loaderParams
    )
    .load(onAssetsLoaded);

//play
function onAssetsLoaded() {
    const Laser = LaserInitializer(PIXI);
    const laser = new Laser(fromX, fromY, toX, toY, 5);
    app.stage.addChild(laser);

    app.start();

    laser.play(() => { });
}
