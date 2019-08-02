//TODO: customize
//attack
const PhaseAttackNormal = function (t) {
    //init attack cnimation
    //i - _scene texture bg_map/bg_h.png
    //n - attacker
    //o - target
    function e(e, i, n, o, s, a, _) {
        var u = t.call(this, e, i, o, s, a, _) || this;
        u._defender = n;
        var l = u._scene.data.isNight();
        return u._cutin = new r.CutinAttack(u._attacker, u._slot, l, !0, !0),
            u
    }
    return n(e, t),
        e.prototype._start = function () {
            var t = this;
            this._cutin.getPreloadTask().start(function () {
                t._completePreload()
            })
        }
        ,
        e.prototype._completePreload = function () {
            var t, e, i = this, n = this._attacker.friend, o = this._attacker.index, r = this._defender.index;
            1 == n ? (t = this._scene.view.bannerGroupLayer.getBanner(!0, o),
                e = this._scene.view.bannerGroupLayer.getBanner(!1, r)) : (t = this._scene.view.bannerGroupLayer.getBanner(!1, o),
                    e = this._scene.view.bannerGroupLayer.getBanner(!0, r)),
                t.moveFront(),
                0 == this._shield && e.moveFront(),
                this._cutin.view.once("attack", function () {
                    i._playVoice(),
                        i._attack(t, e)
                }),
                this._scene.view.layer_cutin.addChild(this._cutin.view),
                this._cutin.start()
        }
        ,
        e.prototype._attack = function (t, e) {
            var i = this
                , n = this._scene.view.layer_content;
            new s.TaskDaihatsuEff(n, t, e, this._daihatsu_eff).start();
            var r = 0;
            0 != this._daihatsu_eff && (r = 1300),
                createjs.Tween.get(null).wait(r).call(function () {
                    o.SE.play("102"),
                        t.attack(function () {
                            i._damageEffect(t, e)
                        })
                })
        }
        ,
        e.prototype._damageEffect = function (t, e) {
            1 == this._shield && this._showShield(e),
                e.moveAtDamage(this._shield);
            var i = this._getDamage(this._defender);
            this._playExplosion(e, i),
                this._playDamageEffect(t, e, this._defender, i, this._hit)
        }
        ,
        e
}(PhaseAttackBase);

const PhaseAttackBase = function(t) {
    function e(e, i, n, r, s, _) {
        var u = t.call(this) || this;
        return u._scene = e,
        u._attacker = i,
        u._slot = o.default.model.slot.getMst(n),
        u._hit = s,
        u._damage = r,
        u._shield = _,
        u._daihatsu_eff = 0,
        u._damage_cutin = new a.PhaseDamageCutin(e),
        u
    }
    return n(e, t),
    e.prototype.preload = function(t) {
        null != t && t()
    }
    ,
    e.prototype.setOptionalEffects = function(t) {
        this._daihatsu_eff = t
    }
    ,
    e.prototype._endTask = function() {
        var e = this;
        this._damage_cutin.start(function() {
            t.prototype._endTask.call(e)
        })
    }
    ,
    e.prototype._getDamage = function(t) {
        return 1 == this._scene.data.model.isPractice() ? Math.min(this._damage, t.hp_now - 1) : this._damage
    }
    ,
    e.prototype._showShield = function(t) {
        var e = this._scene.view.bannerGroupLayer.getShieldTargetBanner(t);
        this._scene.view.layer_damage.showShieldAtBanner(e)
    }
    ,
    e.prototype._playVoice = function() {
        0 == this._scene.data.isNight() ? this._playVoiceDay() : this._playVoiceNight()
    }
    ,
    e.prototype._playVoiceDay = function() {
        if (this._attacker.friend) {
            var t = this._attacker.mst_id
              , e = this._attacker.stype;
            7 == e || 11 == e ? o.default.sound.voice.playAtRandom(t.toString(), [16, 18], [50, 50]) : this._attacker.isSubMarine() && 0 != this._daihatsu_eff ? o.default.sound.voice.play(t.toString(), 26) : o.default.sound.voice.playAtRandom(t.toString(), [16, 17], [50, 50])
        } else
            this._playVoiceEnemy()
    }
    ,
    e.prototype._playVoiceNight = function() {
        if (this._attacker.friend) {
            var t = this._attacker.mst_id
              , e = 17;
            432 == t || 353 == t ? e = 917 : this._attacker.isSubMarine() && 0 != this._daihatsu_eff && (e = 26),
            o.default.sound.voice.play(t.toString(), e)
        } else
            this._playVoiceEnemy()
    }
    ,
    e.prototype._playVoiceEnemy = function() {
        var t = s.EnemyVoiceConst.getAttackVoiceIDs(this._scene, this._attacker);
        if (null != t && t.length > 0) {
            var e = t[Math.floor(Math.random() * t.length)];
            o.default.sound.voice.play("9998", e)
        }
    }
    ,
    e.prototype._playExplosion = function(t, e) {
        var i = t.getGlobalPos(!0);
        this._scene.view.layer_explosion.playDamageExplosion(i.x, i.y, e) //layer_explosion - LayerExplosion
    }
    ,
    e.prototype._playDamageEffect = function(t, e, i, n, o, r) {
        var s = this;
        void 0 === r && (r = null),
        this._scene.view.layer_damage.showAtBanner(e, n, o);
        var a = createjs.Tween.get(null);
        a.wait(200),
        a.call(function() {
            s._damage_cutin.causeDamage(i, n),
            e.updateHp(i.hp_now),
            t.moveDefault()
        }),
        a.wait(600),
        null == r ? a.call(function() {
            s._endTask()
        }) : a.call(r)
    }
    ,
    e.prototype._log = function(t) {}
    ,
    e
}(TaskBase);


var TaskBase = function() {
    function t() {}
    return t.prototype.start = function(t, e) {
        this._cb = t,
        this._cb_failed = e,
        this._start()
    }
    ,
    t.prototype._endTask = function(t) {
        void 0 === t && (t = !1),
        0 == t ? this._completedEnd() : this._failedEnd()
    }
    ,
    t.prototype._completedEnd = function() {
        if (null != this._cb) {
            var t = this._cb;
            this._cb = null,
            this._cb_failed = null,
            t()
        }
    }
    ,
    t.prototype._failedEnd = function() {
        var t = null;
        null != this._cb_failed ? t = this._cb_failed : null != this._cb && (t = this._cb),
        this._cb = null,
        this._cb_failed = null,
        null != t && t()
    }
    ,
    t
}();