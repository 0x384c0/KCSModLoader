class GameContainer {
    _shakeCamera(_amplitude) {
        var _this = this;
        this._interruptShake();
        var default_view = _root.default.view;
        this._taskShake = _classHolder.$_$.Sequence(function () {
            return _classHolder.$_$.Call(function () {
                default_view.position.x = -2.5 * _amplitude
                default_view.position.y = -2 * _amplitude;
            });
        }, function () {
            return _classHolder.$_$.WaitForFrame(1);
        }, function () {
            return _classHolder.$_$.Call(function () {
                default_view.position.x = 2.5 * _amplitude / 2
                default_view.position.y = 2 * _amplitude / 2;
            });
        }, function () {
            return _classHolder.$_$.WaitForFrame(1);
        }, function () {
            return _classHolder.$_$.Call(function () {
                default_view.position.x = -2.5 * _amplitude / 4
                default_view.position.y = -2 * _amplitude / 4;
            });
        }, function () {
            return _classHolder.$_$.WaitForFrame(1);
        }, function () {
            return _classHolder.$_$.Call(function () {
                default_view.position.x = 0, default_view.position.y = 0;
            });
        }), this._taskShake.execute(function () {
            _this._taskShake.dispose(), _this._taskShake = null;
        });
    }

    _interruptShake() {
        if (this._taskShake) {
            this._taskShake.interrupt()
            this._taskShake.dispose()
        }
        this._taskShake = null;
    }
}