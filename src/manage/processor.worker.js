!(function () {
    'use strict';
    function t(t) {
        return (
            (function (t) {
                if (Array.isArray(t)) return e(t);
            })(t) ||
            (function (t) {
                if (
                    ('undefined' != typeof Symbol && null != t[Symbol.iterator]) ||
                    null != t['@@iterator']
                )
                    return Array.from(t);
            })(t) ||
            (function (t, r) {
                if (!t) return;
                if ('string' == typeof t) return e(t, r);
                var i = Object.prototype.toString.call(t).slice(8, -1);
                'Object' === i && t.constructor && (i = t.constructor.name);
                if ('Map' === i || 'Set' === i) return Array.from(t);
                if ('Arguments' === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))
                    return e(t, r);
            })(t) ||
            (function () {
                throw new TypeError(
                    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.',
                );
            })()
        );
    }
    function e(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var r = 0, i = new Array(e); r < e; r++) i[r] = t[r];
        return i;
    }
    function r(t, e, r, i) {
        (this.fromSampleRate = t),
            (this.toSampleRate = e),
            (this.channels = 0 | r),
            (this.noReturn = !!i),
            this.initialize();
    }
    (r.prototype.initialize = function () {
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
        (r.prototype.compileLinearInterpolation = function (t) {
            var e = t.length;
            this.initializeBuffers(e);
            var r,
                i,
                s = this.outputBufferSize,
                a = this.ratioWeight,
                f = this.lastWeight,
                n = 0,
                o = 0,
                h = 0,
                l = this.outputBuffer;
            if (e % this.channels == 0) {
                if (e > 0) {
                    for (; f < 1; f += a)
                        for (n = 1 - (o = f % 1), r = 0; r < this.channels; ++r)
                            l[h++] = this.lastOutput[r] * n + t[r] * o;
                    for (
                        f--, e -= this.channels, i = Math.floor(f) * this.channels;
                        h < s && i < e;

                    ) {
                        for (n = 1 - (o = f % 1), r = 0; r < this.channels; ++r)
                            l[h++] = t[i + r] * n + t[i + this.channels + r] * o;
                        (f += a), (i = Math.floor(f) * this.channels);
                    }
                    for (r = 0; r < this.channels; ++r) this.lastOutput[r] = t[i++];
                    return (this.lastWeight = f % 1), this.bufferSlice(h);
                }
                return this.noReturn ? 0 : [];
            }
            throw new Error('Buffer was of incorrect sample length.');
        }),
        (r.prototype.compileMultiTap = function (t) {
            var e = [],
                r = t.length;
            this.initializeBuffers(r);
            var i = this.outputBufferSize;
            if (r % this.channels == 0) {
                if (r > 0) {
                    for (var s = this.ratioWeight, a = 0, f = 0; f < this.channels; ++f) e[f] = 0;
                    var n = 0,
                        o = 0,
                        h = !this.tailExists;
                    this.tailExists = !1;
                    var l = this.outputBuffer,
                        u = 0,
                        p = 0;
                    do {
                        if (h) for (a = s, f = 0; f < this.channels; ++f) e[f] = 0;
                        else {
                            for (a = this.lastWeight, f = 0; f < this.channels; ++f)
                                e[f] += this.lastOutput[f];
                            h = !0;
                        }
                        for (; a > 0 && n < r; ) {
                            if (!(a >= (o = 1 + n - p))) {
                                for (f = 0; f < this.channels; ++f) e[f] += t[n + f] * a;
                                (p += a), (a = 0);
                                break;
                            }
                            for (f = 0; f < this.channels; ++f) e[f] += t[n++] * o;
                            (p = n), (a -= o);
                        }
                        if (0 != a) {
                            for (this.lastWeight = a, f = 0; f < this.channels; ++f)
                                this.lastOutput[f] = e[f];
                            this.tailExists = !0;
                            break;
                        }
                        for (f = 0; f < this.channels; ++f) l[u++] = e[f] / s;
                    } while (n < r && u < i);
                    return this.bufferSlice(u);
                }
                return this.noReturn ? 0 : [];
            }
            throw new Error('Buffer was of incorrect sample length.');
        }),
        (r.prototype.bypassResampler = function (t) {
            return this.noReturn ? ((this.outputBuffer = t), t.length) : t;
        }),
        (r.prototype.bufferSlice = function (t) {
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
        (r.prototype.initializeBuffers = function (t) {
            this.outputBufferSize = Math.ceil((t * this.toSampleRate) / this.fromSampleRate);
            try {
                (this.outputBuffer = new Float32Array(this.outputBufferSize)),
                    (this.lastOutput = new Float32Array(this.channels));
            } catch (t) {
                (this.outputBuffer = []), (this.lastOutput = []);
            }
        }),
        (self.transData = function (t) {
            return (
                'short16' === self.arrayBufferType &&
                    (t = (function (t) {
                        for (
                            var e = new ArrayBuffer(2 * t.length),
                                r = new DataView(e),
                                i = 0,
                                s = 0;
                            s < t.length;
                            s += 1, i += 2
                        ) {
                            var a = Math.max(-1, Math.min(1, t[s]));
                            r.setInt16(i, a < 0 ? 32768 * a : 32767 * a, !0);
                        }
                        return r.buffer;
                    })((t = self.resampler.resampler(t)))),
                t
            );
        }),
        (self.onmessage = function (e) {
            var i = e.data,
                s = i.type,
                a = i.data;
            if ('init' === s) {
                var f = a.frameSize,
                    n = a.toSampleRate,
                    o = a.fromSampleRate,
                    h = a.arrayBufferType;
                return (
                    (self.frameSize = f * Math.floor(o / n)),
                    (self.resampler = new r(o, n, 1)),
                    (self.frameBuffer = []),
                    void (self.arrayBufferType = h)
                );
            }
            if (
                ('stop' === s &&
                    (self.postMessage({
                        frameBuffer: self.transData(self.frameBuffer),
                        isLastFrame: !0,
                    }),
                    (self.frameBuffer = [])),
                'message' === s)
            ) {
                var l,
                    u = a;
                if (self.frameSize)
                    return (
                        (l = self.frameBuffer).push.apply(l, t(u)),
                        self.frameBuffer.length >= self.frameSize &&
                            (self.postMessage({
                                frameBuffer: self.transData(this.frameBuffer),
                                isLastFrame: !1,
                            }),
                            (self.frameBuffer = [])),
                        !0
                    );
                u && self.postMessage({ frameBuffer: self.transData(u), isLastFrame: !1 });
            }
        });
})();
