!(function () {
    function t(t, e) {
        for (var r = 0; r < e.length; r++) {
            var n = e[r];
            (n.enumerable = n.enumerable || !1),
                (n.configurable = !0),
                'value' in n && (n.writable = !0),
                Object.defineProperty(
                    t,
                    ((i = n.key),
                    (o = void 0),
                    'symbol' ===
                    typeof (o = (function (t, e) {
                        if ('object' !== typeof t || null === t) return t;
                        var r = t[Symbol.toPrimitive];
                        if (void 0 !== r) {
                            var n = r.call(t, e || 'default');
                            if ('object' !== typeof n) return n;
                            throw new TypeError('@@toPrimitive must return a primitive value.');
                        }
                        return ('string' === e ? String : Number)(t);
                    })(i, 'string'))
                        ? o
                        : String(o)),
                    n,
                );
        }
        var i, o;
    }
    function e(t) {
        return (
            (e = Object.setPrototypeOf
                ? Object.getPrototypeOf.bind()
                : function (t) {
                      return t.__proto__ || Object.getPrototypeOf(t);
                  }),
            e(t)
        );
    }
    function r(t, e) {
        return (
            (r = Object.setPrototypeOf
                ? Object.setPrototypeOf.bind()
                : function (t, e) {
                      return (t.__proto__ = e), t;
                  }),
            r(t, e)
        );
    }
    function n() {
        if ('undefined' === typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ('function' === typeof Proxy) return !0;
        try {
            return (
                Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})), !0
            );
        } catch (t) {
            return !1;
        }
    }
    function i(t, e, o) {
        return (
            (i = n()
                ? Reflect.construct.bind()
                : function (t, e, n) {
                      var i = [null];
                      i.push.apply(i, e);
                      var o = new (Function.bind.apply(t, i))();
                      return n && r(o, n.prototype), o;
                  }),
            i.apply(null, arguments)
        );
    }
    function o(t) {
        var n = 'function' === typeof Map ? new Map() : void 0;
        return (
            (o = function (t) {
                if (
                    null === t ||
                    ((o = t), -1 === Function.toString.call(o).indexOf('[native code]'))
                )
                    return t;
                var o;
                if ('function' !== typeof t)
                    throw new TypeError('Super expression must either be null or a function');
                if (void 0 !== n) {
                    if (n.has(t)) return n.get(t);
                    n.set(t, a);
                }
                function a() {
                    return i(t, arguments, e(this).constructor);
                }
                return (
                    (a.prototype = Object.create(t.prototype, {
                        constructor: { value: a, enumerable: !1, writable: !0, configurable: !0 },
                    })),
                    r(a, t)
                );
            }),
            o(t)
        );
    }
    function a(t) {
        if (void 0 === t)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return t;
    }
    function s(t) {
        var r = n();
        return function () {
            var n,
                i = e(t);
            if (r) {
                var o = e(this).constructor;
                n = Reflect.construct(i, arguments, o);
            } else n = i.apply(this, arguments);
            return (function (t, e) {
                if (e && ('object' === typeof e || 'function' === typeof e)) return e;
                if (void 0 !== e)
                    throw new TypeError('Derived constructors may only return object or undefined');
                return a(t);
            })(this, n);
        };
    }
    function f(t) {
        return (
            (function (t) {
                if (Array.isArray(t)) return u(t);
            })(t) ||
            (function (t) {
                if (
                    ('undefined' !== typeof Symbol && null != t[Symbol.iterator]) ||
                    null != t['@@iterator']
                )
                    return Array.from(t);
            })(t) ||
            (function (t, e) {
                if (!t) return;
                if ('string' === typeof t) return u(t, e);
                var r = Object.prototype.toString.call(t).slice(8, -1);
                'Object' === r && t.constructor && (r = t.constructor.name);
                if ('Map' === r || 'Set' === r) return Array.from(t);
                if ('Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
                    return u(t, e);
            })(t) ||
            (function () {
                throw new TypeError(
                    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                );
            })()
        );
    }
    function u(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
        return n;
    }
    function l(t, e, r, n) {
        (this.fromSampleRate = t),
            (this.toSampleRate = e),
            (this.channels = 0 | r),
            (this.noReturn = !!n),
            this.initialize();
    }
    (l.prototype.initialize = function () {
        if (!(this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0))
            throw new Error('Invalid settings specified for the resampler.');
        this.fromSampleRate == this.toSampleRate
            ? ((this.resampler = this.bypassResampler), (this.ratioWeight = 1))
            : (this.fromSampleRate < this.toSampleRate
                  ? ((this.lastWeight = 1), (this.resampler = this.compileLinearInterpolation))
                  : ((this.tailExists = !1),
                    (this.lastWeight = 0),
                    (this.resampler = this.compileMultiTap)),
              (this.ratioWeight = this.fromSampleRate / this.toSampleRate));
    }),
        (l.prototype.compileLinearInterpolation = function (t) {
            var e = t.length;
            this.initializeBuffers(e);
            var r,
                n,
                i = this.outputBufferSize,
                o = this.ratioWeight,
                a = this.lastWeight,
                s = 0,
                f = 0,
                u = 0,
                l = this.outputBuffer;
            if (e % this.channels == 0) {
                if (e > 0) {
                    for (; a < 1; a += o)
                        for (s = 1 - (f = a % 1), r = 0; r < this.channels; ++r)
                            l[u++] = this.lastOutput[r] * s + t[r] * f;
                    for (
                        a--, e -= this.channels, n = Math.floor(a) * this.channels;
                        u < i && n < e;

                    ) {
                        for (s = 1 - (f = a % 1), r = 0; r < this.channels; ++r)
                            l[u++] = t[n + r] * s + t[n + this.channels + r] * f;
                        (a += o), (n = Math.floor(a) * this.channels);
                    }
                    for (r = 0; r < this.channels; ++r) this.lastOutput[r] = t[n++];
                    return (this.lastWeight = a % 1), this.bufferSlice(u);
                }
                return this.noReturn ? 0 : [];
            }
            throw new Error('Buffer was of incorrect sample length.');
        }),
        (l.prototype.compileMultiTap = function (t) {
            var e = [],
                r = t.length;
            this.initializeBuffers(r);
            var n = this.outputBufferSize;
            if (r % this.channels == 0) {
                if (r > 0) {
                    for (var i = this.ratioWeight, o = 0, a = 0; a < this.channels; ++a) e[a] = 0;
                    var s = 0,
                        f = 0,
                        u = !this.tailExists;
                    this.tailExists = !1;
                    var l = this.outputBuffer,
                        h = 0,
                        c = 0;
                    do {
                        if (u) for (o = i, a = 0; a < this.channels; ++a) e[a] = 0;
                        else {
                            for (o = this.lastWeight, a = 0; a < this.channels; ++a)
                                e[a] += this.lastOutput[a];
                            u = !0;
                        }
                        for (; o > 0 && s < r; ) {
                            if (!(o >= (f = 1 + s - c))) {
                                for (a = 0; a < this.channels; ++a) e[a] += t[s + a] * o;
                                (c += o), (o = 0);
                                break;
                            }
                            for (a = 0; a < this.channels; ++a) e[a] += t[s++] * f;
                            (c = s), (o -= f);
                        }
                        if (0 != o) {
                            for (this.lastWeight = o, a = 0; a < this.channels; ++a)
                                this.lastOutput[a] = e[a];
                            this.tailExists = !0;
                            break;
                        }
                        for (a = 0; a < this.channels; ++a) l[h++] = e[a] / i;
                    } while (s < r && h < n);
                    return this.bufferSlice(h);
                }
                return this.noReturn ? 0 : [];
            }
            throw new Error('Buffer was of incorrect sample length.');
        }),
        (l.prototype.bypassResampler = function (t) {
            return this.noReturn ? ((this.outputBuffer = t), t.length) : t;
        }),
        (l.prototype.bufferSlice = function (t) {
            if (this.noReturn) return t;
            try {
                return this.outputBuffer.subarray(0, t);
            } catch (e) {
                try {
                    return (this.outputBuffer.length = t), this.outputBuffer;
                } catch (e) {
                    return this.outputBuffer.slice(0, t);
                }
            }
        }),
        (l.prototype.initializeBuffers = function (t) {
            this.outputBufferSize = Math.ceil((t * this.toSampleRate) / this.fromSampleRate);
            try {
                (this.outputBuffer = new Float32Array(this.outputBufferSize)),
                    (this.lastOutput = new Float32Array(this.channels));
            } catch (t) {
                (this.outputBuffer = []), (this.lastOutput = []);
            }
        });
    var h = (function (e) {
        !(function (t, e) {
            if ('function' !== typeof e && null !== e)
                throw new TypeError('Super expression must either be null or a function');
            (t.prototype = Object.create(e && e.prototype, {
                constructor: { value: t, writable: !0, configurable: !0 },
            })),
                Object.defineProperty(t, 'prototype', { writable: !1 }),
                e && r(t, e);
        })(h, e);
        var n,
            i,
            o,
            u = s(h);
        function h() {
            var t;
            !(function (t, e) {
                if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
            })(this, h);
            var e = a((t = u.call(this)));
            return (
                (t.port.onmessage = function (t) {
                    var r = t.data,
                        n = r.type,
                        i = r.data;
                    if ((console.log('type', n), 'init' === n)) {
                        var o = i.frameSize,
                            a = i.toSampleRate,
                            s = i.arrayBufferType,
                            f = i.fromSampleRate;
                        return (
                            (e.frameSize = o * Math.floor(f / a)),
                            (e.resampler = new l(f, a, 1)),
                            (e.frameBuffer = []),
                            void (e.arrayBufferType = s)
                        );
                    }
                    'stop' === n &&
                        (e.port.postMessage({
                            frameBuffer: e.transData(e.frameBuffer),
                            isLastFrame: !0,
                        }),
                        (e.frameBuffer = []));
                }),
                t
            );
        }
        return (
            (n = h),
            (i = [
                {
                    key: 'process',
                    value: function (t) {
                        var e,
                            r = t[0][0];
                        return this.frameSize
                            ? ((e = this.frameBuffer).push.apply(e, f(r)),
                              this.frameBuffer.length >= this.frameSize &&
                                  (this.port.postMessage({
                                      frameBuffer: this.transData(this.frameBuffer),
                                      isLastFrame: !1,
                                  }),
                                  (this.frameBuffer = [])),
                              !0)
                            : (r &&
                                  this.port.postMessage({
                                      frameBuffer: this.transData(r),
                                      isLastFrame: !1,
                                  }),
                              !0);
                    },
                },
                {
                    key: 'transData',
                    value: function (t) {
                        return (
                            'short16' === this.arrayBufferType &&
                                (t = (function (t) {
                                    for (
                                        var e = new ArrayBuffer(2 * t.length),
                                            r = new DataView(e),
                                            n = 0,
                                            i = 0;
                                        i < t.length;
                                        i += 1, n += 2
                                    ) {
                                        var o = Math.max(-1, Math.min(1, t[i]));
                                        r.setInt16(n, o < 0 ? 32768 * o : 32767 * o, !0);
                                    }
                                    return r.buffer;
                                })((t = this.resampler.resampler(t)))),
                            t
                        );
                    },
                },
            ]) && t(n.prototype, i),
            o && t(n, o),
            Object.defineProperty(n, 'prototype', { writable: !1 }),
            h
        );
    })(o(AudioWorkletProcessor));
    registerProcessor('processor-worklet', h);
})();