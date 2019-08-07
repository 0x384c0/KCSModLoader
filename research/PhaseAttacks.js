//TODO: customize
//attack
const PhaseAttackNormal = function (t) {
    //init attack cnimation
    //i - _scene texture bg_map/bg_h.png
    //n - attacker
    //o - target
    function e(scene, attacker, defender, slotitem, damage, hitType, isShield) {
        var u = t.call(this, scene, attacker, slotitem, damage, hitType, isShield) || this;
        u._defender = defender;
        var isNight = u._scene.data.isNight();
        return u._cutin = new r.CutinAttack(u._attacker, u._slot, isNight, true, true),
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
            var attackerBanner, defenderBanner, i = this, n = this._attacker.friend, attackerIndex = this._attacker.index, defenderIndex = this._defender.index;
            1 == n ? (attackerBanner = this._scene.view.bannerGroupLayer.getBanner(true, attackerIndex),
                defenderBanner = this._scene.view.bannerGroupLayer.getBanner(false, defenderIndex)) : (attackerBanner = this._scene.view.bannerGroupLayer.getBanner(false, attackerIndex),
                    defenderBanner = this._scene.view.bannerGroupLayer.getBanner(true, defenderIndex)),
                attackerBanner.moveFront(),
                0 == this._shield && defenderBanner.moveFront(),
                this._cutin.view.once("attack", function () {
                    i._playVoice(),
                        i._attack(attackerBanner, defenderBanner)
                }),
                this._scene.view.layer_cutin.addChild(this._cutin.view),
                this._cutin.start()
        }
        ,
        e.prototype._attack = function (attackerBanner, defenderBanner) {
            var i = this
                , n = this._scene.view.layer_content;
            new s.TaskDaihatsuEff(n, attackerBanner, defenderBanner, this._daihatsu_eff).start();
            var r = 0;
            0 != this._daihatsu_eff && (r = 1300),
                createjs.Tween.get(null).wait(r).call(function () {
                    o.SE.play("102"),
                        attackerBanner.attack(function () {
                            i._damageEffect(attackerBanner, defenderBanner)
                        })
                })
        }
        ,
        e.prototype._damageEffect = function (attackerBanner, defenderBanner) {
            1 == this._shield && this._showShield(defenderBanner),
                defenderBanner.moveAtDamage(this._shield);
            var damage = this._getDamage(this._defender);
            this._playExplosion(defenderBanner, damage),
                this._playDamageEffect(attackerBanner, defenderBanner, this._defender, damage, this._hit)
        }
        ,
        e
}(PhaseAttackBase);

const PhaseAttackBase = function (t) {
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
        e.prototype.preload = function (t) {
            null != t && t()
        }
        ,
        e.prototype.setOptionalEffects = function (t) {
            this._daihatsu_eff = t
        }
        ,
        e.prototype._endTask = function () {
            var e = this;
            this._damage_cutin.start(function () {
                t.prototype._endTask.call(e)
            })
        }
        ,
        e.prototype._getDamage = function (t) {
            return 1 == this._scene.data.model.isPractice() ? Math.min(this._damage, t.hp_now - 1) : this._damage
        }
        ,
        e.prototype._showShield = function (t) {
            var e = this._scene.view.bannerGroupLayer.getShieldTargetBanner(t);
            this._scene.view.layer_damage.showShieldAtBanner(e)
        }
        ,
        e.prototype._playVoice = function () {
            0 == this._scene.data.isNight() ? this._playVoiceDay() : this._playVoiceNight()
        }
        ,
        e.prototype._playVoiceDay = function () {
            if (this._attacker.friend) {
                var t = this._attacker.mst_id
                    , e = this._attacker.stype;
                7 == e || 11 == e ? o.default.sound.voice.playAtRandom(t.toString(), [16, 18], [50, 50]) : this._attacker.isSubMarine() && 0 != this._daihatsu_eff ? o.default.sound.voice.play(t.toString(), 26) : o.default.sound.voice.playAtRandom(t.toString(), [16, 17], [50, 50])
            } else
                this._playVoiceEnemy()
        }
        ,
        e.prototype._playVoiceNight = function () {
            if (this._attacker.friend) {
                var t = this._attacker.mst_id
                    , e = 17;
                432 == t || 353 == t ? e = 917 : this._attacker.isSubMarine() && 0 != this._daihatsu_eff && (e = 26),
                    o.default.sound.voice.play(t.toString(), e)
            } else
                this._playVoiceEnemy()
        }
        ,
        e.prototype._playVoiceEnemy = function () {
            var t = s.EnemyVoiceConst.getAttackVoiceIDs(this._scene, this._attacker);
            if (null != t && t.length > 0) {
                var e = t[Math.floor(Math.random() * t.length)];
                o.default.sound.voice.play("9998", e)
            }
        }
        ,
        e.prototype._playExplosion = function (t, e) {
            var i = t.getGlobalPos(true);
            this._scene.view.layer_explosion.playDamageExplosion(i.x, i.y, e) //layer_explosion - LayerExplosion
        }
        ,
        e.prototype._playDamageEffect = function (t, e, i, n, o, r) {
            var s = this;
            void 0 === r && (r = null),
                this._scene.view.layer_damage.showAtBanner(e, n, o);
            var a = createjs.Tween.get(null);
            a.wait(200),
                a.call(function () {
                    s._damage_cutin.causeDamage(i, n),
                        e.updateHp(i.hp_now),
                        t.moveDefault()
                }),
                a.wait(600),
                null == r ? a.call(function () {
                    s._endTask()
                }) : a.call(r)
        }
        ,
        e.prototype._log = function (t) { }
        ,
        e
}(TaskBase);


var TaskBase = function () {
    function t() { }
    return t.prototype.start = function (t, e) {
        this._cb = t,
            this._cb_failed = e,
            this._start()
    }
        ,
        t.prototype._endTask = function (t) {
            void 0 === t && (t = false),
                0 == t ? this._completedEnd() : this._failedEnd()
        }
        ,
        t.prototype._completedEnd = function () {
            if (null != this._cb) {
                var t = this._cb;
                this._cb = null,
                    this._cb_failed = null,
                    t()
            }
        }
        ,
        t.prototype._failedEnd = function () {
            var t = null;
            null != this._cb_failed ? t = this._cb_failed : null != this._cb && (t = this._cb),
                this._cb = null,
                this._cb_failed = null,
                null != t && t()
        }
        ,
        t
}();


const PhaseAttackDouble = function (t, e, i) {
    "use strict";
    var n = this && this.__extends || function () {
        var t = Object.setPrototypeOf || {
            __proto__: []
        } instanceof Array && function (t, e) {
            t.__proto__ = e
        }
            || function (t, e) {
                for (var i in e)
                    e.hasOwnProperty(i) && (t[i] = e[i])
            }
            ;
        return function (e, i) {
            function n() {
                this.constructor = e
            }
            t(e, i),
                e.prototype = null === i ? Object.create(i) : (n.prototype = i.prototype,
                    new n)
        }
    }();
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var o = i(0)
        , r = i(6)
        , s = i(453)
        , a = i(1357)
        , _ = i(1358)
        , u = i(1359)
        , l = i(39)
        , c = function (t) {
            //scene, attacker, defender, slotitem, damage, hitType, isShield, defender2, slotitem2, damage2, hitType2, isShield2
            function e(scene, attacker, defender, slotitem, damage, hitType, isShield, defender2, slotitem2, damage2, hitType2, isShield2) {
                var v = t.call(this, scene, attacker, slotitem, damage, hitType, isShield) || this;
                v._completeDamageEffect = function () {
                    v._cutin.resume(),
                        v._cutin.view.once("attack", function () {
                            r.SE.play("102"),
                                v._a_banner.attack(function () {
                                    v._2ndDamageEffect()
                                })
                        })
                }
                    ,
                    v._defender = defender,
                    v._defender2 = defender2,
                    v._slot2 = o.default.model.slot.getMst(slotitem2),
                    v._damage2 = damage2,
                    v._hit2 = hitType2,
                    v._shield2 = isShield2;
                var b = v._scene.data.isNight()
                    , w = Math.floor(4 * Math.random());
                return v._cutin = 0 == w ? new s.CutinDouble1(v._attacker, v._slot, v._slot2, b) : 1 == w ? new a.CutinDouble2(v._attacker, v._slot, v._slot2, b) : 2 == w ? new _.CutinDouble3(v._attacker, v._slot, v._slot2, b) : new u.CutinDouble4(v._attacker, v._slot, v._slot2, b),
                    v
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
                    if (1 == this._scene.data.isNight()) {
                        var t = null != this._slot ? this._slot : this._slot2;
                        if (null != t) {
                            var e = t.equipTypeSp;
                            if (5 == e || 32 == e)
                                return void this._doubleR()
                        }
                    }
                    this._doubleH()
                }
                ,
                e.prototype._doubleH = function () {
                    var t = this
                        , e = this._attacker.friend
                        , i = this._attacker.index
                        , n = this._defender.index
                        , o = this._defender2.index;
                    1 == e ? (this._a_banner = this._scene.view.bannerGroupLayer.getBanner(!0, i),
                        this._d_banner1 = this._scene.view.bannerGroupLayer.getBanner(!1, n),
                        this._d_banner2 = this._scene.view.bannerGroupLayer.getBanner(!1, o)) : (this._a_banner = this._scene.view.bannerGroupLayer.getBanner(!1, i),
                            this._d_banner1 = this._scene.view.bannerGroupLayer.getBanner(!0, n),
                            this._d_banner2 = this._scene.view.bannerGroupLayer.getBanner(!0, o)),
                        this._a_banner.moveFront(),
                        0 == this._shield && this._d_banner1.moveFront(),
                        this._scene.view.layer_cutin.addChild(this._cutin.view),
                        this._cutin.start(),
                        this._cutin.view.once("attack", function () {
                            t._playVoice(),
                                t._attack(t._a_banner, t._d_banner1)
                        })
                }
                ,
                e.prototype._doubleR = function () { }
                ,
                e.prototype._attack = function (attackerBanner, defenderBanner) {
                    r.SE.play("102"),
                        attackerBanner.attack(null),
                        this._damageEffect(attackerBanner, defenderBanner)
                }
                ,
                e.prototype._damageEffect = function (attackerBanner, defenderBanner) {
                    var i = this;
                    1 == this._shield && this._showShield(defenderBanner);
                    var damage = this._getDamage(this._defender);
                    defenderBanner.moveAtDamage(this._shield);
                    var defenderBannerPos = defenderBanner.getGlobalPos(!0);
                    this._scene.view.layer_explosion.playDamageExplosion(defenderBannerPos.x, defenderBannerPos.y, damage, null),
                        this._scene.view.layer_damage.showAtBanner(defenderBanner, damage, this._hit),
                        createjs.Tween.get(this).wait(200).call(function () {
                            i._damage_cutin.causeDoubleDamage1st(i._defender, damage),
                                defenderBanner.updateHp(i._defender.hp_now)
                        }).wait(500).call(function () {
                            i._completeDamageEffect()
                        })
                }
                ,
                e.prototype._2ndDamageEffect = function () {
                    var t = this
                        , defender2 = this._defender2
                        , d_banner2 = this._d_banner2
                        , damage2 = this._damage2;
                    1 == this._scene.data.model.isPractice() && (damage2 = Math.min(damage2, defender2.hp_now - 1));
                    var hit2 = this._hit2;
                    1 == this._shield2 && this._showShield(d_banner2),
                        d_banner2.moveAtDamage(this._shield2),
                        this._playExplosion(d_banner2, damage2),
                        this._scene.view.layer_damage.showAtBanner(d_banner2, damage2, hit2),
                        createjs.Tween.get(this).wait(200).call(function () {
                            t._damage_cutin.causeDoubleDamage2nd(defender2, damage2),
                                d_banner2.updateHp(defender2.hp_now)
                        }).wait(600).call(function () {
                            t._endTask()
                        })
                }
                ,
                e.prototype._playVoice = function () {
                    this._playVoiceNight()
                }
                ,
                e.prototype._log = function (e) {
                    t.prototype._log.call(this, e + ":1");
                    var i = "[" + e + ":2] [" + this._attacker.index + "]" + this._attacker.name + "(" + this._attacker.mst_id + ")";
                    i += " damage:" + this._damage2 + " ",
                        null != this._slot && (i += " [" + this._slot2.mstID + "]" + this._slot2.name),
                        2 == this._hit2 ? i += " [CRITICAL]" : 0 == this._hit2 && (i += " [MISS]")
                }
                ,
                e
        }(l.PhaseAttackBase);
}