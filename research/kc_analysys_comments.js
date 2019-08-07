// SE.play("102") 

// //air battle fighter
// l.SE.play("102"), //1

// //explosion on ship
// e.prototype.playExplosionSmall = 

// //night double
// e.prototype._attack = function(t, e) { //3

// // attack playe fleet
// e.prototype._attack = function(t, e) { //1

// //
// e.prototype._attack = function(t, e) { //4

// //double attack first
// e.prototype._doubleH = function() {
// //double attack second
// v._cutin.view.once("attack", function() {



// //ship sunk PVP
// v._completeDamageEffect = function() {



// //attack start
// e.prototype.attack = function(t) {

// //common attack  
// createjs.Tween.get(null).wait(r).call(function() {

// //Explosion depends of damage
// e.prototype.playDamageExplosion = function(t, e, i, n) {

// //init attack animation
// //i - _scene texture bg_map/bg_h.png
// //n - attacker
// //o - defender
// var y = new a.PhaseAttackNormal(i,n,o,r,s,c,h);

// //PhaseAttackNormal constructor
// function e(e, i, n, o, s, a, _) {

// //generate animation task for surface battle
// e.prototype._hougekiCycle = function() {//2

//http://203.104.209.87/kcs2/resources/ship/card/0187_2689.png?version=44
///kcs2/resources/ship/card/0187_2689.png
//chrome-extension://nfldpcedekkdpjmmahadaffilbfaofof/assets/img/icon/icon_500.png

// PhaseNelsonTouch  Nelson
// PhaseNagatoAttack  Nagato
// PhaseMutsuAttack  Mutsu
// PhaseColoradoAttack  Colorado
// PhaseAttackDouble double attack
// PhaseAttackBakurai  ASW
// PhaseAttackRaigeki torpedo (Example:CLT with Ko-Hyoteki)
// PhaseAttackRocket anti installation (Example: WG-42)

// PhaseAttackDanchaku Unknown (some _special attack)
// PhaseZRK zuin cut in




//prevent load main.js
//prevent run KCS.init()
var elem = document.querySelector('body > canvas'); elem.parentNode.removeChild(elem);
fetch("./js/main.js?version=4.4.2.5")
    .then(b => b.text())
    .then(s => s.replace("e.PhaseAttackNormal=_", "document.kcs_PhaseAttackNormal = e;e.PhaseAttackNormal=_"))
    .then(s => s.replace("e.LayerExplosion=u", "document.kcs_LayerExplosion = e;e.LayerExplosion=u"))
    // .then(s => s.replace("!function(t){function e(t){null!=t&&", "document.kcs_SE = e;!function(t){function e(t){null!=t&&"))
    .then(s => eval(s))


class CustomPhaseAttackNormal extends document.kcs_PhaseAttackNormal.PhaseAttackNormal {
    _playExplosion(t, e) {
        var i = t.getGlobalPos(!0);
        this._scene.view.layer_explosion.playDamageExplosionCustom(i.x, i.y, e)
    }
}
document.kcs_PhaseAttackNormal.PhaseAttackNormal = CustomPhaseAttackNormal


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
document.kcs_LayerExplosion.LayerExplosion = CustomLayerExplosion


//PIXI
class CustomLoader extends PIXI.loaders.Loader {
    add(name, url, options, cb) {
        if (Object.prototype.toString.call(name) === "[object String]", url == null, options == null, cb == null) {
            return super.add(name, { crossOrigin: true })
        } else {
            options.crossOrigin = true
            return super.add(name, url, options, cb)
        }
    }
}
PIXI.loaders.Loader = CustomLoader

KCS.init()
