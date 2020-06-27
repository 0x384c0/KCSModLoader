export default (PIXI) => { //TODO: get rid of lazy init
    return class Laser extends PIXI.Container {
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
    }
}












const app = new PIXI.Application();
document.body.appendChild(app.view);
app.stop();

app.loader
    .add('spritesheet', 'examples/assets/spritesheet/mc.json')
    .load(onAssetsLoaded);

function createTextures() {
    const animatedTexture = [];
    let i;
    for (i = 0; i < 26; i++) {
        const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
        animatedTexture.push(texture);
    }
    return animatedTexture
}

function createAnimatedSprite(animatedTexture) {
    const explosion = new PIXI.AnimatedSprite(animatedTexture)
    explosion.anchor.set(0.5)
    explosion.loop = false
    return explosion
}

function createBeam(texture) {
    const tilingSprite = new PIXI.TilingSprite(
        texture,
        texture.width,
        texture.height,
    );
    tilingSprite.anchor.set(0, 0.5);
    return tilingSprite
}

function moveLaser(fromX, fromY, toX, toY, beams, origin, impact) {
    beams.forEach((beam) => {
        beam.x = fromX
        beam.y = fromY
        beam.width = Math.sqrt(Math.pow(toY - fromY, 2) + Math.pow(toX - fromX, 2))
        beam.rotation = Math.atan2(toY - fromY, toX - fromX)
    })

    origin.x = fromX
    origin.y = fromY

    impact.x = toX
    impact.y = toY
}

function floor(x) {
    return x - Math.floor(x, 1)
}

function runAnimation(handler) {
    let totalTime = 0
    app.ticker.add((delta) => {
        totalTime += delta
        handler(floor(totalTime * .01))
    });
}

function createAnimatedTextures(count, animatedTexture) {
    return [...Array(count).keys()].map(() => createAnimatedSprite(animatedTexture))
}


function onAssetsLoaded() {


    let fromX = app.screen.width * 0.1
    let fromY = app.screen.width * 0.2

    let toX = app.screen.width * 0.9
    let toY = app.screen.width * 0.6

    const textureBeam = PIXI.Texture.from('examples/assets/bunny.png');
    const textureBeamBg = PIXI.Texture.from('examples/assets/p2.jpeg')
    const animatedTexture = createTextures()

    const beam = createBeam(textureBeam)
    const beamBg = createBeam(textureBeamBg)
    const origin = createAnimatedSprite(animatedTexture)
    const impact = createAnimatedSprite(animatedTexture)
    const explosions = createAnimatedTextures(10, animatedTexture)

    moveLaser(fromX, fromY, toX, toY, [beam, beamBg], origin, impact)

    app.stage.addChild(beamBg);
    app.stage.addChild(beam);
    app.stage.addChild(origin);
    app.stage.addChild(impact);
    explosions.forEach((explosion) => app.stage.addChild(explosion))

    runAnimation((progress) => {
        moveLaser(fromX, fromY, toX * progress, toY, [beam, beamBg], origin, impact)

        if (!origin.playing)
            origin.play()

        if (!impact.playing)
            impact.play()

        beam.tilePosition.x = progress * 500
        beamBg.tilePosition.x = progress * 1000

        let index = Math.floor(explosions.length * progress)
        if (index >= explosions.length)
            index = explosions.length - 1;
        let explosionSprite = explosions[index]

        

        if (!explosionSprite.playing) {
            explosionSprite.x = toX * progress
            explosionSprite.y = toY
            explosionSprite.play()
        }
    })

    app.start();
}
