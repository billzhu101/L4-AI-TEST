!(function (e, t) {
    'object' == typeof exports && 'undefined' != typeof module
        ? (module.exports = t())
        : 'function' == typeof define && define.amd
        ? define(t)
        : ((e = 'undefined' != typeof globalThis ? globalThis : e || self).RecorderManager = t());
})(this, function () {
    'use strict';
    function e(e, t, o, r) {
        return new (o || (o = Promise))(function (n, a) {
            function i(e) {
                try {
                    s(r.next(e));
                } catch (e) {
                    a(e);
                }
            }
            function u(e) {
                try {
                    s(r.throw(e));
                } catch (e) {
                    a(e);
                }
            }
            function s(e) {
                var t;
                e.done
                    ? n(e.value)
                    : ((t = e.value),
                      t instanceof o
                          ? t
                          : new o(function (e) {
                                e(t);
                            })).then(i, u);
            }
            s((r = r.apply(e, t || [])).next());
        });
    }
    function t(e, t) {
        var o,
            r,
            n,
            a,
            i = {
                label: 0,
                sent: function () {
                    if (1 & n[0]) throw n[1];
                    return n[1];
                },
                trys: [],
                ops: [],
            };
        return (
            (a = { next: u(0), throw: u(1), return: u(2) }),
            'function' == typeof Symbol &&
                (a[Symbol.iterator] = function () {
                    return this;
                }),
            a
        );
        function u(u) {
            return function (s) {
                return (function (u) {
                    if (o) throw new TypeError('Generator is already executing.');
                    for (; a && ((a = 0), u[0] && (i = 0)), i; )
                        try {
                            if (
                                ((o = 1),
                                r &&
                                    (n =
                                        2 & u[0]
                                            ? r.return
                                            : u[0]
                                            ? r.throw || ((n = r.return) && n.call(r), 0)
                                            : r.next) &&
                                    !(n = n.call(r, u[1])).done)
                            )
                                return n;
                            switch (((r = 0), n && (u = [2 & u[0], n.value]), u[0])) {
                                case 0:
                                case 1:
                                    n = u;
                                    break;
                                case 4:
                                    return i.label++, { value: u[1], done: !1 };
                                case 5:
                                    i.label++, (r = u[1]), (u = [0]);
                                    continue;
                                case 7:
                                    (u = i.ops.pop()), i.trys.pop();
                                    continue;
                                default:
                                    if (
                                        !((n = i.trys),
                                        (n = n.length > 0 && n[n.length - 1]) ||
                                            (6 !== u[0] && 2 !== u[0]))
                                    ) {
                                        i = 0;
                                        continue;
                                    }
                                    if (3 === u[0] && (!n || (u[1] > n[0] && u[1] < n[3]))) {
                                        i.label = u[1];
                                        break;
                                    }
                                    if (6 === u[0] && i.label < n[1]) {
                                        (i.label = n[1]), (n = u);
                                        break;
                                    }
                                    if (n && i.label < n[2]) {
                                        (i.label = n[2]), i.ops.push(u);
                                        break;
                                    }
                                    n[2] && i.ops.pop(), i.trys.pop();
                                    continue;
                            }
                            u = t.call(e, i);
                        } catch (e) {
                            (u = [6, e]), (r = 0);
                        } finally {
                            o = n = 0;
                        }
                    if (5 & u[0]) throw u[1];
                    return { value: u[0] ? u[1] : void 0, done: !0 };
                })([u, s]);
            };
        }
    }
    var o = !AudioWorkletNode;
    function r() {
        var e;
        return (null === (e = navigator.mediaDevices) || void 0 === e ? void 0 : e.getUserMedia)
            ? navigator.mediaDevices.getUserMedia({ audio: !0, video: !1 })
            : navigator.getUserMedia
            ? new Promise(function (e, t) {
                  navigator.getUserMedia(
                      { audio: !0, video: !1 },
                      function (t) {
                          e(t);
                      },
                      function (e) {
                          t(e);
                      },
                  );
              })
            : Promise.reject(new Error('不支持录音'));
    }
    function n(r, n) {
        return e(this, void 0, void 0, function () {
            return t(this, function (e) {
                switch (e.label) {
                    case 0:
                        return o
                            ? [4, r.audioWorklet.addModule(''.concat(n, '/processor.worklet.js'))]
                            : [3, 2];
                    case 1:
                        return e.sent(), [2, new AudioWorkletNode(r, 'processor-worklet')];
                    case 2:
                        return [4, new Worker(''.concat(n, '/processor.worker.js'))];
                    case 3:
                        return [2, { port: e.sent() }];
                }
            });
        });
    }
    return (function () {
        function a(e) {
            (this.processorPath = e), (this.audioBuffers = []);
        }
        return (
            (a.prototype.start = function (a) {
                var i,
                    u = a.sampleRate,
                    s = a.frameSize,
                    c = a.arrayBufferType;
                return e(this, void 0, void 0, function () {
                    var e, a, d, f, l, p;
                    return t(this, function (t) {
                        switch (t.label) {
                            case 0:
                                return ((e = this).audioBuffers = []), [4, r()];
                            case 1:
                                return (
                                    (a = t.sent()),
                                    (this.audioTracks = a.getAudioTracks()),
                                    (d = (function (e, t) {
                                        var o;
                                        try {
                                            (o = new (window.AudioContext ||
                                                window.webkitAudioContext)({
                                                sampleRate: t,
                                            })).createMediaStreamSource(e);
                                        } catch (t) {
                                            (o = new (window.AudioContext ||
                                                window.webkitAudioContext)()).createMediaStreamSource(
                                                e,
                                            );
                                        }
                                        return o;
                                    })(a, u)),
                                    (this.audioContext = d),
                                    d.createMediaStreamSource(a),
                                    (f = d.createMediaStreamSource(a)),
                                    [4, n(d, this.processorPath)]
                                );
                            case 2:
                                return (
                                    (l = t.sent()),
                                    (this.audioWorklet = l),
                                    l.port.postMessage({
                                        type: 'init',
                                        data: {
                                            frameSize: s,
                                            toSampleRate: u || d.sampleRate,
                                            fromSampleRate: d.sampleRate,
                                            arrayBufferType: c || 'short16',
                                        },
                                    }),
                                    (l.port.onmessage = function (t) {
                                        s && e.onFrameRecorded && e.onFrameRecorded(t.data),
                                            e.onStop &&
                                                (t.data.frameBuffer &&
                                                    e.audioBuffers.push(t.data.frameBuffer),
                                                t.data.isLastFrame &&
                                                    !o &&
                                                    (null == l ? void 0 : l.port).terminate(),
                                                t.data.isLastFrame && e.onStop(e.audioBuffers));
                                    }),
                                    o
                                        ? f.connect(l)
                                        : (((p = d.createScriptProcessor(0, 1, 1)).onaudioprocess =
                                              function (e) {
                                                  l.port.postMessage({
                                                      type: 'message',
                                                      data: e.inputBuffer.getChannelData(0),
                                                  });
                                              }),
                                          f.connect(p),
                                          p.connect(d.destination)),
                                    d.resume(),
                                    null === (i = this.onStart) || void 0 === i || i.call(this),
                                    [2]
                                );
                        }
                    });
                });
            }),
            (a.prototype.stop = function () {
                var e, t, o;
                null === (e = this.audioWorklet) ||
                    void 0 === e ||
                    e.port.postMessage({ type: 'stop' }),
                    null === (t = this.audioTracks) || void 0 === t || t[0].stop(),
                    null === (o = this.audioContext) || void 0 === o || o.suspend();
            }),
            a
        );
    })();
});
