class GameContainer{
    _shakeCamera(_0x2739b8) {
        var _this = this;
        this['_interruptShake']();
        var _default_view = _0x4ae1be['default']['view'];
        this['_taskShake'] = _0x42068c['$_$']['Sequence'](function () {
            return _0x42068c['$_$']['Call'](function () {
                _default_view['position']['x'] = -2.5 * _0x2739b8, _default_view['position']['y'] = -2 * _0x2739b8;
            });
        }, function () {
            return _0x42068c['$_$']['WaitForFrame'](1);
        }, function () {
            return _0x42068c['$_$']['Call'](function () {
                _default_view['position']['x'] = 2.5 * _0x2739b8 / 2, _default_view['position']['y'] = 2 * _0x2739b8 / 2;
            });
        }, function () {
            return _0x42068c['$_$']['WaitForFrame'](1);
        }, function () {
            return _0x42068c['$_$']['Call'](function () {
                _default_view['position']['x'] = -2.5 * _0x2739b8 / 4, _default_view['position']['y'] = -2 * _0x2739b8 / 4;
            });
        }, function () {
            return _0x42068c['$_$']['WaitForFrame'](1);
        }, function () {
            return _0x42068c['$_$']['Call'](function () {
                _default_view['position']['x'] = 0, _default_view['position']['y'] = 0;
            });
        }), this['_taskShake']['execute'](function () {
            _this['_taskShake']['dispose'](), _this['_taskShake'] = null;
        });
    }

    _interruptShake() {
        this['_taskShake'] && (this['_taskShake']['interrupt'](), this['_taskShake']['dispose']()), this['_taskShake'] = null;
    }
}