! function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).window = t.window || {})
}(this, (function (t) {
    "use strict";
    const e = (t, e = 1e4) => (t = parseFloat(t + "") || 0, Math.round((t + Number.EPSILON) * e) / e),
        i = function (t) {
            if (!(t && t instanceof Element && t.offsetParent)) return !1;
            const e = t.scrollHeight > t.clientHeight,
                i = window.getComputedStyle(t).overflowY,
                n = -1 !== i.indexOf("hidden"),
                s = -1 !== i.indexOf("visible");
            return e && !n && !s
        },
        n = function (t, e) {
            return !(!t || t === document.body || e && t === e) && (i(t) ? t : n(t.parentElement, e))
        },
        s = function (t) {
            var e = (new DOMParser).parseFromString(t, "text/html").body;
            if (e.childElementCount > 1) {
                for (var i = document.createElement("div"); e.firstChild;) i.appendChild(e.firstChild);
                return i
            }
            return e.firstChild
        },
        o = t => `${t||""}`.split(" ").filter((t => !!t)),
        a = (t, e, i) => {
            o(e).forEach((e => {
                t && t.classList.toggle(e, i || !1)
            }))
        };
    class r {
        constructor(t) {
            Object.defineProperty(this, "pageX", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "pageY", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "clientX", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "clientY", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "id", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "time", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "nativePointer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), this.nativePointer = t, this.pageX = t.pageX, this.pageY = t.pageY, this.clientX = t.clientX, this.clientY = t.clientY, this.id = self.Touch && t instanceof Touch ? t.identifier : -1, this.time = Date.now()
        }
    }
    const l = {
        passive: !1
    };
    class c {
        constructor(t, {
            start: e = (() => !0),
            move: i = (() => {}),
            end: n = (() => {})
        }) {
            Object.defineProperty(this, "element", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "startCallback", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "moveCallback", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "endCallback", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "currentPointers", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: []
            }), Object.defineProperty(this, "startPointers", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: []
            }), this.element = t, this.startCallback = e, this.moveCallback = i, this.endCallback = n;
            for (const t of ["onPointerStart", "onTouchStart", "onMove", "onTouchEnd", "onPointerEnd", "onWindowBlur"]) this[t] = this[t].bind(this);
            this.element.addEventListener("mousedown", this.onPointerStart, l), this.element.addEventListener("touchstart", this.onTouchStart, l), this.element.addEventListener("touchmove", this.onMove, l), this.element.addEventListener("touchend", this.onTouchEnd), this.element.addEventListener("touchcancel", this.onTouchEnd)
        }
        onPointerStart(t) {
            if (!t.buttons || 0 !== t.button) return;
            const e = new r(t);
            this.currentPointers.some((t => t.id === e.id)) || this.triggerPointerStart(e, t) && (window.addEventListener("mousemove", this.onMove), window.addEventListener("mouseup", this.onPointerEnd), window.addEventListener("blur", this.onWindowBlur))
        }
        onTouchStart(t) {
            for (const e of Array.from(t.changedTouches || [])) this.triggerPointerStart(new r(e), t);
            window.addEventListener("blur", this.onWindowBlur)
        }
        onMove(t) {
            const e = this.currentPointers.slice(),
                i = "changedTouches" in t ? Array.from(t.changedTouches || []).map((t => new r(t))) : [new r(t)],
                n = [];
            for (const t of i) {
                const e = this.currentPointers.findIndex((e => e.id === t.id));
                e < 0 || (n.push(t), this.currentPointers[e] = t)
            }
            n.length && this.moveCallback(t, this.currentPointers.slice(), e)
        }
        onPointerEnd(t) {
            t.buttons > 0 && 0 !== t.button || (this.triggerPointerEnd(t, new r(t)), window.removeEventListener("mousemove", this.onMove), window.removeEventListener("mouseup", this.onPointerEnd), window.removeEventListener("blur", this.onWindowBlur))
        }
        onTouchEnd(t) {
            for (const e of Array.from(t.changedTouches || [])) this.triggerPointerEnd(t, new r(e))
        }
        triggerPointerStart(t, e) {
            return !!this.startCallback(e, t, this.currentPointers.slice()) && (this.currentPointers.push(t), this.startPointers.push(t), !0)
        }
        triggerPointerEnd(t, e) {
            const i = this.currentPointers.findIndex((t => t.id === e.id));
            i < 0 || (this.currentPointers.splice(i, 1), this.startPointers.splice(i, 1), this.endCallback(t, e, this.currentPointers.slice()))
        }
        onWindowBlur() {
            this.clear()
        }
        clear() {
            for (; this.currentPointers.length;) {
                const t = this.currentPointers[this.currentPointers.length - 1];
                this.currentPointers.splice(this.currentPointers.length - 1, 1), this.startPointers.splice(this.currentPointers.length - 1, 1), this.endCallback(new Event("touchend", {
                    bubbles: !0,
                    cancelable: !0,
                    clientX: t.clientX,
                    clientY: t.clientY
                }), t, this.currentPointers.slice())
            }
        }
        stop() {
            this.element.removeEventListener("mousedown", this.onPointerStart, l), this.element.removeEventListener("touchstart", this.onTouchStart, l), this.element.removeEventListener("touchmove", this.onMove, l), this.element.removeEventListener("touchend", this.onTouchEnd), this.element.removeEventListener("touchcancel", this.onTouchEnd), window.removeEventListener("mousemove", this.onMove), window.removeEventListener("mouseup", this.onPointerEnd), window.removeEventListener("blur", this.onWindowBlur)
        }
    }

    function h(t, e) {
        return e ? Math.sqrt(Math.pow(e.clientX - t.clientX, 2) + Math.pow(e.clientY - t.clientY, 2)) : 0
    }

    function d(t, e) {
        return e ? {
            clientX: (t.clientX + e.clientX) / 2,
            clientY: (t.clientY + e.clientY) / 2
        } : t
    }
    const u = t => "object" == typeof t && null !== t && t.constructor === Object && "[object Object]" === Object.prototype.toString.call(t),
        p = (t, ...e) => {
            const i = e.length;
            for (let n = 0; n < i; n++) {
                const i = e[n] || {};
                Object.entries(i).forEach((([e, i]) => {
                    const n = Array.isArray(i) ? [] : {};
                    t[e] || Object.assign(t, {
                        [e]: n
                    }), u(i) ? Object.assign(t[e], p(n, i)) : Array.isArray(i) ? Object.assign(t, {
                        [e]: [...i]
                    }) : Object.assign(t, {
                        [e]: i
                    })
                }))
            }
            return t
        },
        f = function (t, e) {
            return t.split(".").reduce(((t, e) => "object" == typeof t ? t[e] : void 0), e)
        };
    class m {
        constructor(t = {}) {
            Object.defineProperty(this, "options", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: t
            }), Object.defineProperty(this, "events", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: new Map
            }), this.setOptions(t);
            for (const t of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) t.startsWith("on") && "function" == typeof this[t] && (this[t] = this[t].bind(this))
        }
        setOptions(t) {
            this.options = t ? p({}, this.constructor.defaults, t) : {};
            for (const [t, e] of Object.entries(this.option("on") || {})) this.on(t, e)
        }
        option(t, ...e) {
            let i = f(t, this.options);
            return i && "function" == typeof i && (i = i.call(this, this, ...e)), i
        }
        optionFor(t, e, i, ...n) {
            let s = f(e, t);
            var o;
            "string" != typeof (o = s) || isNaN(o) || isNaN(parseFloat(o)) || (s = parseFloat(s)), "true" === s && (s = !0), "false" === s && (s = !1), s && "function" == typeof s && (s = s.call(this, this, t, ...n));
            let a = f(e, this.options);
            return a && "function" == typeof a ? s = a.call(this, this, t, ...n, s) : void 0 === s && (s = a), void 0 === s ? i : s
        }
        cn(t) {
            const e = this.options.classes;
            return e && e[t] || ""
        }
        localize(t, e = []) {
            t = String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g, ((t, e, i) => {
                let n = "";
                return i ? n = this.option(`${e[0]+e.toLowerCase().substring(1)}.l10n.${i}`) : e && (n = this.option(`l10n.${e}`)), n || (n = t), n
            }));
            for (let i = 0; i < e.length; i++) t = t.split(e[i][0]).join(e[i][1]);
            return t = t.replace(/\{\{(.*?)\}\}/g, ((t, e) => e))
        }
        on(t, e) {
            let i = [];
            "string" == typeof t ? i = t.split(" ") : Array.isArray(t) && (i = t), this.events || (this.events = new Map), i.forEach((t => {
                let i = this.events.get(t);
                i || (this.events.set(t, []), i = []), i.includes(e) || i.push(e), this.events.set(t, i)
            }))
        }
        off(t, e) {
            let i = [];
            "string" == typeof t ? i = t.split(" ") : Array.isArray(t) && (i = t), i.forEach((t => {
                const i = this.events.get(t);
                if (Array.isArray(i)) {
                    const t = i.indexOf(e);
                    t > -1 && i.splice(t, 1)
                }
            }))
        }
        emit(t, ...e) {
            [...this.events.get(t) || []].forEach((t => t(this, ...e))), "*" !== t && this.emit("*", t, ...e)
        }
    }
    Object.defineProperty(m, "version", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: "5.0.17"
    }), Object.defineProperty(m, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {}
    });
    class g extends m {
        constructor(t = {}) {
            super(t), Object.defineProperty(this, "plugins", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: {}
            })
        }
        attachPlugins(t = {}) {
            const e = new Map;
            for (const [i, n] of Object.entries(t)) {
                const t = this.option(i),
                    s = this.plugins[i];
                s || !1 === t ? s && !1 === t && (s.detach(), delete this.plugins[i]) : e.set(i, new n(this, t || {}))
            }
            for (const [t, i] of e) this.plugins[t] = i, i.attach();
            this.emit("attachPlugins")
        }
        detachPlugins(t) {
            t = t || Object.keys(this.plugins);
            for (const e of t) {
                const t = this.plugins[e];
                t && t.detach(), delete this.plugins[e]
            }
            return this.emit("detachPlugins"), this
        }
    }
    var b;
    ! function (t) {
        t[t.Init = 0] = "Init", t[t.Error = 1] = "Error", t[t.Ready = 2] = "Ready", t[t.Panning = 3] = "Panning", t[t.Mousemove = 4] = "Mousemove", t[t.Destroy = 5] = "Destroy"
    }(b || (b = {}));
    const v = ["a", "b", "c", "d", "e", "f"],
        y = {
            PANUP: "Move up",
            PANDOWN: "Move down",
            PANLEFT: "Move left",
            PANRIGHT: "Move right",
            ZOOMIN: "Zoom in",
            ZOOMOUT: "Zoom out",
            TOGGLEZOOM: "Toggle zoom level",
            TOGGLE1TO1: "Toggle zoom level",
            ITERATEZOOM: "Toggle zoom level",
            ROTATECCW: "Rotate counterclockwise",
            ROTATECW: "Rotate clockwise",
            FLIPX: "Flip horizontally",
            FLIPY: "Flip vertically",
            FITX: "Fit horizontally",
            FITY: "Fit vertically",
            RESET: "Reset",
            TOGGLEFS: "Toggle fullscreen"
        },
        w = {
            content: null,
            width: "auto",
            height: "auto",
            panMode: "drag",
            touch: !0,
            dragMinThreshold: 3,
            lockAxis: !1,
            mouseMoveFactor: 1,
            mouseMoveFriction: .12,
            zoom: !0,
            pinchToZoom: !0,
            panOnlyZoomed: "auto",
            minScale: 1,
            maxScale: 2,
            friction: .25,
            dragFriction: .35,
            decelFriction: .05,
            click: "toggleZoom",
            dblClick: !1,
            wheel: "zoom",
            wheelLimit: 7,
            spinner: !0,
            bounds: "auto",
            infinite: !1,
            rubberband: !0,
            bounce: !0,
            maxVelocity: 75,
            transformParent: !1,
            classes: {
                content: "f-panzoom__content",
                isLoading: "is-loading",
                canZoomIn: "can-zoom_in",
                canZoomOut: "can-zoom_out",
                isDraggable: "is-draggable",
                isDragging: "is-dragging",
                inFullscreen: "in-fullscreen",
                htmlHasFullscreen: "with-panzoom-in-fullscreen"
            },
            l10n: y
        },
        x = '<div class="f-spinner"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="20"></circle><circle cx="25" cy="25" r="20"></circle></svg></div>',
        E = t => t && null !== t && t instanceof Element && "nodeType" in t,
        S = (t, e) => {
            t && o(e).forEach((e => {
                t.classList.remove(e)
            }))
        },
        P = (t, e) => {
            t && o(e).forEach((e => {
                t.classList.add(e)
            }))
        },
        C = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0,
            f: 0
        },
        M = 1e5,
        T = 1e3,
        O = "mousemove",
        A = "drag",
        z = "content";
    let L = null,
        R = null;
    class k extends g {
        get isTouchDevice() {
            return null === R && (R = window.matchMedia("(hover: none)").matches), R
        }
        get isMobile() {
            return null === L && (L = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)), L
        }
        get panMode() {
            return this.options.panMode !== O || this.isTouchDevice ? A : O
        }
        get panOnlyZoomed() {
            const t = this.options.panOnlyZoomed;
            return "auto" === t ? this.isTouchDevice : t
        }
        get isInfinite() {
            return this.option("infinite")
        }
        get angle() {
            return 180 * Math.atan2(this.current.b, this.current.a) / Math.PI || 0
        }
        get targetAngle() {
            return 180 * Math.atan2(this.target.b, this.target.a) / Math.PI || 0
        }
        get scale() {
            const {
                a: t,
                b: e
            } = this.current;
            return Math.sqrt(t * t + e * e) || 1
        }
        get targetScale() {
            const {
                a: t,
                b: e
            } = this.target;
            return Math.sqrt(t * t + e * e) || 1
        }
        get minScale() {
            return this.option("minScale") || 1
        }
        get fullScale() {
            const {
                contentRect: t
            } = this;
            return t.fullWidth / t.fitWidth || 1
        }
        get maxScale() {
            return this.fullScale * (this.option("maxScale") || 1) || 1
        }
        get coverScale() {
            const {
                containerRect: t,
                contentRect: e
            } = this, i = Math.max(t.height / e.fitHeight, t.width / e.fitWidth) || 1;
            return Math.min(this.fullScale, i)
        }
        get isScaling() {
            return Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting
        }
        get isContentLoading() {
            const t = this.content;
            return !!(t && t instanceof HTMLImageElement) && !t.complete
        }
        get isResting() {
            if (this.isBouncingX || this.isBouncingY) return !1;
            for (const t of v) {
                const e = "e" == t || "f" === t ? .001 : 1e-5;
                if (Math.abs(this.target[t] - this.current[t]) > e) return !1
            }
            return !(!this.ignoreBounds && !this.checkBounds().inBounds)
        }
        constructor(t, e = {}, i = {}) {
            var n;
            if (super(e), Object.defineProperty(this, "pointerTracker", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "resizeObserver", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "updateTimer", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "clickTimer", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "rAF", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "isTicking", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "friction", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "ignoreBounds", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "isBouncingX", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "isBouncingY", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "clicks", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "trackingPoints", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: []
                }), Object.defineProperty(this, "pwt", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "cwd", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "pmme", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "state", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: b.Init
                }), Object.defineProperty(this, "isDragging", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), Object.defineProperty(this, "container", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "content", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "spinner", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "containerRect", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        width: 0,
                        height: 0,
                        innerWidth: 0,
                        innerHeight: 0
                    }
                }), Object.defineProperty(this, "contentRect", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                        fullWidth: 0,
                        fullHeight: 0,
                        fitWidth: 0,
                        fitHeight: 0,
                        width: 0,
                        height: 0
                    }
                }), Object.defineProperty(this, "dragStart", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        x: 0,
                        y: 0,
                        top: 0,
                        left: 0,
                        time: 0
                    }
                }), Object.defineProperty(this, "dragOffset", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        x: 0,
                        y: 0,
                        time: 0
                    }
                }), Object.defineProperty(this, "current", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: Object.assign({}, C)
                }), Object.defineProperty(this, "target", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: Object.assign({}, C)
                }), Object.defineProperty(this, "velocity", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {
                        a: 0,
                        b: 0,
                        c: 0,
                        d: 0,
                        e: 0,
                        f: 0
                    }
                }), Object.defineProperty(this, "lockedAxis", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: !1
                }), !t) throw new Error("Container Element Not Found");
            this.container = t, this.initContent(), this.attachPlugins(Object.assign(Object.assign({}, k.Plugins), i)), this.emit("init");
            const o = this.content;
            if (o.addEventListener("load", this.onLoad), o.addEventListener("error", this.onError), this.isContentLoading) {
                if (this.option("spinner")) {
                    t.classList.add(this.cn("isLoading"));
                    const e = s(x);
                    !t.contains(o) || o.parentElement instanceof HTMLPictureElement ? this.spinner = t.appendChild(e) : this.spinner = (null === (n = o.parentElement) || void 0 === n ? void 0 : n.insertBefore(e, o)) || null
                }
                this.emit("beforeLoad")
            } else queueMicrotask((() => {
                this.enable()
            }))
        }
        initContent() {
            const {
                container: t
            } = this, e = this.cn(z);
            let i = this.option(z) || t.querySelector(`.${e}`);
            if (i || (i = t.querySelector("img,picture") || t.firstElementChild, i && P(i, e)), i instanceof HTMLPictureElement && (i = i.querySelector("img")), !i) throw new Error("No content found");
            this.content = i
        }
        onLoad() {
            this.spinner && (this.spinner.remove(), this.spinner = null), this.option("spinner") && this.container.classList.remove(this.cn("isLoading")), this.emit("afterLoad"), this.state === b.Init ? this.enable() : this.updateMetrics()
        }
        onError() {
            this.state !== b.Destroy && (this.spinner && (this.spinner.remove(), this.spinner = null), this.stop(), this.detachEvents(), this.state = b.Error, this.emit("error"))
        }
        attachObserver() {
            var t;
            const e = () => Math.abs(this.containerRect.width - this.container.getBoundingClientRect().width) > .1 || Math.abs(this.containerRect.height - this.container.getBoundingClientRect().height) > .1;
            this.resizeObserver || void 0 === window.ResizeObserver || (this.resizeObserver = new ResizeObserver((() => {
                this.updateTimer || (e() ? (this.onResize(), this.isMobile && (this.updateTimer = setTimeout((() => {
                    e() && this.onResize(), this.updateTimer = null
                }), 500))) : this.updateTimer && (clearTimeout(this.updateTimer), this.updateTimer = null))
            }))), null === (t = this.resizeObserver) || void 0 === t || t.observe(this.container)
        }
        detachObserver() {
            var t;
            null === (t = this.resizeObserver) || void 0 === t || t.disconnect()
        }
        attachEvents() {
            const {
                container: t
            } = this;
            t.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.addEventListener("wheel", this.onWheel, {
                passive: !1
            }), this.pointerTracker = new c(t, {
                start: this.onPointerDown,
                move: this.onPointerMove,
                end: this.onPointerUp
            }), document.addEventListener(O, this.onMouseMove)
        }
        detachEvents() {
            var t;
            const {
                container: e
            } = this;
            e.removeEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), e.removeEventListener("wheel", this.onWheel, {
                passive: !1
            }), null === (t = this.pointerTracker) || void 0 === t || t.stop(), this.pointerTracker = null, document.removeEventListener(O, this.onMouseMove), document.removeEventListener("keydown", this.onKeydown, !0), this.clickTimer && (clearTimeout(this.clickTimer), this.clickTimer = null), this.updateTimer && (clearTimeout(this.updateTimer), this.updateTimer = null)
        }
        animate() {
            const t = this.friction;
            this.setTargetForce();
            const e = this.option("maxVelocity");
            for (const i of v) t ? (this.velocity[i] *= 1 - t, e && !this.isScaling && (this.velocity[i] = Math.max(Math.min(this.velocity[i], e), -1 * e)), this.current[i] += this.velocity[i]) : this.current[i] = this.target[i];
            this.setTransform(), this.setEdgeForce(), !this.isResting || this.isDragging ? this.rAF = requestAnimationFrame((() => this.animate())) : this.stop("current")
        }
        setTargetForce() {
            for (const t of v) "e" === t && this.isBouncingX || "f" === t && this.isBouncingY || (this.velocity[t] = (1 / (1 - this.friction) - 1) * (this.target[t] - this.current[t]))
        }
        checkBounds(t = 0, e = 0) {
            const {
                current: i
            } = this, n = i.e + t, s = i.f + e, o = this.getBounds(), {
                x: a,
                y: r
            } = o, l = a.min, c = a.max, h = r.min, d = r.max;
            let u = 0,
                p = 0;
            return l !== 1 / 0 && n < l ? u = l - n : c !== 1 / 0 && n > c && (u = c - n), h !== 1 / 0 && s < h ? p = h - s : d !== 1 / 0 && s > d && (p = d - s), Math.abs(u) < .001 && (u = 0), Math.abs(p) < .001 && (p = 0), Object.assign(Object.assign({}, o), {
                xDiff: u,
                yDiff: p,
                inBounds: !u && !p
            })
        }
        clampTargetBounds() {
            const {
                target: t
            } = this, {
                x: e,
                y: i
            } = this.getBounds();
            e.min !== 1 / 0 && (t.e = Math.max(t.e, e.min)), e.max !== 1 / 0 && (t.e = Math.min(t.e, e.max)), i.min !== 1 / 0 && (t.f = Math.max(t.f, i.min)), i.max !== 1 / 0 && (t.f = Math.min(t.f, i.max))
        }
        calculateContentDim(t = this.current) {
            const {
                content: e,
                contentRect: i
            } = this, {
                fitWidth: n,
                fitHeight: s,
                fullWidth: o,
                fullHeight: a
            } = i;
            let r = o,
                l = a;
            if (this.option("zoom") || 0 !== this.angle) {
                const i = !(e instanceof HTMLImageElement) && ("none" === window.getComputedStyle(e).maxWidth || "none" === window.getComputedStyle(e).maxHeight),
                    c = i ? o : n,
                    h = i ? a : s,
                    d = this.getMatrix(t),
                    u = new DOMPoint(0, 0).matrixTransform(d),
                    p = new DOMPoint(0 + c, 0).matrixTransform(d),
                    f = new DOMPoint(0 + c, 0 + h).matrixTransform(d),
                    m = new DOMPoint(0, 0 + h).matrixTransform(d),
                    g = Math.abs(f.x - u.x),
                    b = Math.abs(f.y - u.y),
                    v = Math.abs(m.x - p.x),
                    y = Math.abs(m.y - p.y);
                r = Math.max(g, v), l = Math.max(b, y)
            }
            return {
                contentWidth: r,
                contentHeight: l
            }
        }
        setEdgeForce() {
            if (this.ignoreBounds || this.isDragging || this.panMode === O || this.targetScale < this.scale) return this.isBouncingX = !1, void(this.isBouncingY = !1);
            const {
                target: t
            } = this, {
                x: e,
                y: i,
                xDiff: n,
                yDiff: s
            } = this.checkBounds();
            const o = this.option("maxVelocity");
            let a = this.velocity.e,
                r = this.velocity.f;
            0 !== n ? (this.isBouncingX = !0, n * a <= 0 ? a += .14 * n : (a = .14 * n, e.min !== 1 / 0 && (this.target.e = Math.max(t.e, e.min)), e.max !== 1 / 0 && (this.target.e = Math.min(t.e, e.max))), o && (a = Math.max(Math.min(a, o), -1 * o))) : this.isBouncingX = !1, 0 !== s ? (this.isBouncingY = !0, s * r <= 0 ? r += .14 * s : (r = .14 * s, i.min !== 1 / 0 && (this.target.f = Math.max(t.f, i.min)), i.max !== 1 / 0 && (this.target.f = Math.min(t.f, i.max))), o && (r = Math.max(Math.min(r, o), -1 * o))) : this.isBouncingY = !1, this.isBouncingX && (this.velocity.e = a), this.isBouncingY && (this.velocity.f = r)
        }
        enable() {
            const {
                content: t
            } = this, e = new DOMMatrixReadOnly(window.getComputedStyle(t).transform);
            for (const t of v) this.current[t] = this.target[t] = e[t];
            this.updateMetrics(), this.attachObserver(), this.attachEvents(), this.state = b.Ready, this.emit("ready")
        }
        onClick(t) {
            var e;
            this.isDragging && (null === (e = this.pointerTracker) || void 0 === e || e.clear(), this.trackingPoints = [], this.startDecelAnim());
            const i = t.target;
            if (!i || t.defaultPrevented) return;
            if (i && i.hasAttribute("disabled")) return t.preventDefault(), void t.stopPropagation();
            if ((() => {
                    const t = window.getSelection();
                    return t && "Range" === t.type
                })() && !i.closest("button")) return;
            const n = i.closest("[data-panzoom-action]"),
                s = i.closest("[data-panzoom-change]"),
                o = n || s,
                a = o && E(o) ? o.dataset : null;
            if (a) {
                const e = a.panzoomChange,
                    i = a.panzoomAction;
                if ((e || i) && t.preventDefault(), e) {
                    let t = {};
                    try {
                        t = JSON.parse(e)
                    } catch (t) {
                        console && console.warn("The given data was not valid JSON")
                    }
                    return void this.applyChange(t)
                }
                if (i) return void(this[i] && this[i]())
            }
            if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3) return t.preventDefault(), void t.stopPropagation();
            const r = this.content.getBoundingClientRect();
            if (this.dragStart.time && !this.canZoomOut() && (Math.abs(r.x - this.dragStart.x) > 2 || Math.abs(r.y - this.dragStart.y) > 2)) return;
            this.dragStart.time = 0;
            const l = e => {
                    this.option("zoom") && e && "string" == typeof e && /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(e) && "function" == typeof this[e] && (t.preventDefault(), this[e]({
                        event: t
                    }))
                },
                c = this.option("click", t),
                h = this.option("dblClick", t);
            h ? (this.clicks++, 1 == this.clicks && (this.clickTimer = setTimeout((() => {
                1 === this.clicks ? (this.emit("click", t), !t.defaultPrevented && c && l(c)) : (this.emit("dblClick", t), t.defaultPrevented || l(h)), this.clicks = 0, this.clickTimer = null
            }), 350))) : (this.emit("click", t), !t.defaultPrevented && c && l(c))
        }
        addTrackingPoint(t) {
            const e = this.trackingPoints.filter((t => t.time > Date.now() - 100));
            e.push(t), this.trackingPoints = e
        }
        onPointerDown(t, e, i) {
            var n;
            this.pwt = 0, this.dragOffset = {
                x: 0,
                y: 0,
                time: 0
            }, this.trackingPoints = [];
            const s = this.content.getBoundingClientRect();
            if (this.dragStart = {
                    x: s.x,
                    y: s.y,
                    top: s.top,
                    left: s.left,
                    time: Date.now()
                }, this.clickTimer) return !1;
            if (this.panMode === O && this.targetScale > 1) return t.preventDefault(), t.stopPropagation(), !1;
            if (!i.length) {
                const e = t.composedPath()[0];
                if (["A", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].includes(e.nodeName) || e.closest("[contenteditable]") || e.closest("[data-selectable]") || e.closest("[data-panzoom-change]") || e.closest("[data-panzoom-action]")) return !1;
                null === (n = window.getSelection()) || void 0 === n || n.removeAllRanges()
            }
            if ("mousedown" === t.type) t.preventDefault();
            else if (Math.abs(this.velocity.a) > .3) return !1;
            return this.target.e = this.current.e, this.target.f = this.current.f, this.stop(), this.isDragging || (this.isDragging = !0, this.addTrackingPoint(e), this.emit("touchStart", t)), !0
        }
        onPointerMove(t, i, s) {
            if (!1 === this.option("touch", t)) return;
            if (!this.isDragging) return;
            if (i.length < 2 && this.panOnlyZoomed && e(this.targetScale) <= e(this.minScale)) return;
            if (this.emit("touchMove", t), t.defaultPrevented) return;
            this.addTrackingPoint(i[0]);
            const {
                content: o
            } = this, a = d(s[0], s[1]), r = d(i[0], i[1]);
            let l = 0,
                c = 0;
            if (i.length > 1) {
                const t = o.getBoundingClientRect();
                l = a.clientX - t.left - .5 * t.width, c = a.clientY - t.top - .5 * t.height
            }
            const u = h(s[0], s[1]),
                p = h(i[0], i[1]);
            let f = u ? p / u : 1,
                m = r.clientX - a.clientX,
                g = r.clientY - a.clientY;
            this.dragOffset.x += m, this.dragOffset.y += g, this.dragOffset.time = Date.now() - this.dragStart.time;
            let b = e(this.targetScale) === e(this.minScale) && this.option("lockAxis");
            if (b && !this.lockedAxis)
                if ("xy" === b || "y" === b || "touchmove" === t.type) {
                    if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) return void t.preventDefault();
                    const e = Math.abs(180 * Math.atan2(this.dragOffset.y, this.dragOffset.x) / Math.PI);
                    this.lockedAxis = e > 45 && e < 135 ? "y" : "x", this.dragOffset.x = 0, this.dragOffset.y = 0, m = 0, g = 0
                } else this.lockedAxis = b;
            if (n(t.target, this.content) && (b = "x", this.dragOffset.y = 0), b && "xy" !== b && this.lockedAxis !== b && e(this.targetScale) === e(this.minScale)) return;
            t.cancelable && t.preventDefault(), this.container.classList.add(this.cn("isDragging"));
            const v = this.checkBounds(m, g);
            this.option("rubberband") ? ("x" !== this.isInfinite && (v.xDiff > 0 && m < 0 || v.xDiff < 0 && m > 0) && (m *= Math.max(0, .5 - Math.abs(.75 / this.contentRect.fitWidth * v.xDiff))), "y" !== this.isInfinite && (v.yDiff > 0 && g < 0 || v.yDiff < 0 && g > 0) && (g *= Math.max(0, .5 - Math.abs(.75 / this.contentRect.fitHeight * v.yDiff)))) : (v.xDiff && (m = 0), v.yDiff && (g = 0));
            const y = this.targetScale,
                w = this.minScale,
                x = this.maxScale;
            y < .5 * w && (f = Math.max(f, w)), y > 1.5 * x && (f = Math.min(f, x)), "y" === this.lockedAxis && e(y) === e(w) && (m = 0), "x" === this.lockedAxis && e(y) === e(w) && (g = 0), this.applyChange({
                originX: l,
                originY: c,
                panX: m,
                panY: g,
                scale: f,
                friction: this.option("dragFriction"),
                ignoreBounds: !0
            })
        }
        onPointerUp(t, e, i) {
            if (i.length) return this.dragOffset.x = 0, this.dragOffset.y = 0, void(this.trackingPoints = []);
            this.container.classList.remove(this.cn("isDragging")), this.isDragging && (this.addTrackingPoint(e), this.panOnlyZoomed && this.contentRect.width - this.contentRect.fitWidth < 1 && this.contentRect.height - this.contentRect.fitHeight < 1 && (this.trackingPoints = []), n(t.target, this.content) && "y" === this.lockedAxis && (this.trackingPoints = []), this.emit("touchEnd", t), this.isDragging = !1, this.lockedAxis = !1, this.state !== b.Destroy && (t.defaultPrevented || this.startDecelAnim()))
        }
        startDecelAnim() {
            var t;
            const i = this.isScaling;
            this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.isBouncingX = !1, this.isBouncingY = !1;
            for (const t of v) this.velocity[t] = 0;
            this.target.e = this.current.e, this.target.f = this.current.f, S(this.container, "is-scaling"), S(this.container, "is-animating"), this.isTicking = !1;
            const {
                trackingPoints: n
            } = this, s = n[0], o = n[n.length - 1];
            let a = 0,
                r = 0,
                l = 0;
            o && s && (a = o.clientX - s.clientX, r = o.clientY - s.clientY, l = o.time - s.time);
            const c = (null === (t = window.visualViewport) || void 0 === t ? void 0 : t.scale) || 1;
            1 !== c && (a *= c, r *= c);
            let h = 0,
                d = 0,
                u = 0,
                p = 0,
                f = this.option("decelFriction");
            const m = this.targetScale;
            if (l > 0) {
                u = Math.abs(a) > 3 ? a / (l / 30) : 0, p = Math.abs(r) > 3 ? r / (l / 30) : 0;
                const t = this.option("maxVelocity");
                t && (u = Math.max(Math.min(u, t), -1 * t), p = Math.max(Math.min(p, t), -1 * t))
            }
            u && (h = u / (1 / (1 - f) - 1)), p && (d = p / (1 / (1 - f) - 1)), ("y" === this.option("lockAxis") || "xy" === this.option("lockAxis") && "y" === this.lockedAxis && e(m) === this.minScale) && (h = u = 0), ("x" === this.option("lockAxis") || "xy" === this.option("lockAxis") && "x" === this.lockedAxis && e(m) === this.minScale) && (d = p = 0);
            const g = this.dragOffset.x,
                b = this.dragOffset.y,
                y = this.option("dragMinThreshold") || 0;
            Math.abs(g) < y && Math.abs(b) < y && (h = d = 0, u = p = 0), (m < this.minScale - 1e-5 || m > this.maxScale + 1e-5 || i && !h && !d) && (f = .35), this.applyChange({
                panX: h,
                panY: d,
                friction: f
            }), this.emit("decel", u, p, g, b)
        }
        onWheel(t) {
            var e = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce((function (t, e) {
                return Math.abs(e) > Math.abs(t) ? e : t
            }));
            const i = Math.max(-1, Math.min(1, e));
            if (this.emit("wheel", t, i), this.panMode === O) return;
            if (t.defaultPrevented) return;
            const n = this.option("wheel");
            "pan" === n ? (t.preventDefault(), this.panOnlyZoomed && !this.canZoomOut() || this.applyChange({
                panX: 2 * -t.deltaX,
                panY: 2 * -t.deltaY,
                bounce: !1
            })) : "zoom" === n && !1 !== this.option("zoom") && this.zoomWithWheel(t)
        }
        onMouseMove(t) {
            this.panWithMouse(t)
        }
        onKeydown(t) {
            "Escape" === t.key && this.toggleFS()
        }
        onResize() {
            this.updateMetrics(), this.checkBounds().inBounds || this.requestTick()
        }
        setTransform() {
            this.emit("beforeTransform");
            const {
                current: t,
                target: i,
                content: n,
                contentRect: s
            } = this, o = Object.assign({}, C);
            for (const n of v) {
                const s = "e" == n || "f" === n ? T : M;
                o[n] = e(t[n], s), Math.abs(i[n] - t[n]) < ("e" == n || "f" === n ? .51 : .001) && (t[n] = i[n])
            }
            let {
                a: a,
                b: r,
                c: l,
                d: c,
                e: h,
                f: d
            } = o, u = `matrix(${a}, ${r}, ${l}, ${c}, ${h}, ${d})`, p = n.parentElement instanceof HTMLPictureElement ? n.parentElement : n;
            if (this.option("transformParent") && (p = p.parentElement || p), p.style.transform === u) return;
            p.style.transform = u;
            const {
                contentWidth: f,
                contentHeight: m
            } = this.calculateContentDim();
            s.width = f, s.height = m, this.emit("afterTransform")
        }
        updateMetrics(t = !1) {
            var i;
            if (!this || this.state === b.Destroy) return;
            if (this.isContentLoading) return;
            const n = Math.max(1, (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.scale) || 1),
                {
                    container: s,
                    content: o
                } = this,
                a = o instanceof HTMLImageElement,
                r = s.getBoundingClientRect(),
                l = getComputedStyle(this.container);
            let c = r.width * n,
                h = r.height * n;
            const d = parseFloat(l.paddingTop) + parseFloat(l.paddingBottom),
                u = c - (parseFloat(l.paddingLeft) + parseFloat(l.paddingRight)),
                p = h - d;
            this.containerRect = {
                width: c,
                height: h,
                innerWidth: u,
                innerHeight: p
            };
            let f = this.option("width") || "auto",
                m = this.option("height") || "auto";
            "auto" === f && (f = parseFloat(o.dataset.width || "") || (t => {
                let e = 0;
                return e = t instanceof HTMLImageElement ? t.naturalWidth : t instanceof SVGElement ? t.width.baseVal.value : Math.max(t.offsetWidth, t.scrollWidth), e || 0
            })(o)), "auto" === m && (m = parseFloat(o.dataset.height || "") || (t => {
                let e = 0;
                return e = t instanceof HTMLImageElement ? t.naturalHeight : t instanceof SVGElement ? t.height.baseVal.value : Math.max(t.offsetHeight, t.scrollHeight), e || 0
            })(o));
            let g = o.parentElement instanceof HTMLPictureElement ? o.parentElement : o;
            this.option("transformParent") && (g = g.parentElement || g);
            const v = g.getAttribute("style") || "";
            g.style.setProperty("transform", "none", "important"), a && (g.style.width = "", g.style.height = ""), g.offsetHeight;
            const y = o.getBoundingClientRect();
            let w = y.width * n,
                x = y.height * n,
                E = 0,
                S = 0;
            a && (Math.abs(f - w) > 1 || Math.abs(m - x) > 1) && ({
                width: w,
                height: x,
                top: E,
                left: S
            } = ((t, e, i, n) => {
                const s = i / n;
                return s > t / e ? (i = t, n = t / s) : (i = e * s, n = e), {
                    width: i,
                    height: n,
                    top: .5 * (e - n),
                    left: .5 * (t - i)
                }
            })(w, x, f, m)), this.contentRect = Object.assign(Object.assign({}, this.contentRect), {
                top: y.top - r.top + E,
                bottom: r.bottom - y.bottom + E,
                left: y.left - r.left + S,
                right: r.right - y.right + S,
                fitWidth: w,
                fitHeight: x,
                width: w,
                height: x,
                fullWidth: f,
                fullHeight: m
            }), g.style.cssText = v, a && (g.style.width = `${w}px`, g.style.height = `${x}px`), this.setTransform(), !0 !== t && this.emit("refresh"), this.ignoreBounds || (e(this.targetScale) < e(this.minScale) ? this.zoomTo(this.minScale, {
                friction: 0
            }) : this.targetScale > this.maxScale ? this.zoomTo(this.maxScale, {
                friction: 0
            }) : this.state === b.Init || this.checkBounds().inBounds || this.requestTick()), this.updateControls()
        }
        getBounds() {
            const t = this.option("bounds");
            if ("auto" !== t) return t;
            const {
                contentWidth: i,
                contentHeight: n
            } = this.calculateContentDim(this.target);
            let s = 0,
                o = 0,
                a = 0,
                r = 0;
            const l = this.option("infinite");
            if (!0 === l || this.lockedAxis && l === this.lockedAxis) s = -1 / 0, a = 1 / 0, o = -1 / 0, r = 1 / 0;
            else {
                let {
                    containerRect: t,
                    contentRect: l
                } = this, c = e(this.contentRect.fitWidth * this.targetScale, T), h = e(this.contentRect.fitHeight * this.targetScale, T), {
                    innerWidth: d,
                    innerHeight: u
                } = t;
                if (this.containerRect.width === c && (d = t.width), this.containerRect.width === h && (u = t.height), i > d) {
                    a = .5 * (i - d), s = -1 * a;
                    let t = .5 * (l.right - l.left);
                    s += t, a += t
                }
                if (this.contentRect.fitWidth > d && i < d && (s -= .5 * (this.contentRect.fitWidth - d), a -= .5 * (this.contentRect.fitWidth - d)), n > u) {
                    r = .5 * (n - u), o = -1 * r;
                    let t = .5 * (l.bottom - l.top);
                    o += t, r += t
                }
                this.contentRect.fitHeight > u && n < u && (s -= .5 * (this.contentRect.fitHeight - u), a -= .5 * (this.contentRect.fitHeight - u))
            }
            return {
                x: {
                    min: s,
                    max: a
                },
                y: {
                    min: o,
                    max: r
                }
            }
        }
        updateControls() {
            const t = this,
                i = t.container,
                {
                    panMode: n,
                    contentRect: s,
                    fullScale: o,
                    targetScale: r,
                    coverScale: l,
                    maxScale: c,
                    minScale: h
                } = t;
            let d = {
                    toggleMax: r - h < .5 * (c - h) ? c : h,
                    toggleCover: r - h < .5 * (l - h) ? l : h,
                    toggleZoom: r - h < .5 * (o - h) ? o : h
                } [t.option("click") || ""] || h,
                u = t.canZoomIn(),
                p = t.canZoomOut(),
                f = p && n === A;
            e(r) < e(h) && !this.panOnlyZoomed && (f = !0), (e(s.width, 1) > e(s.fitWidth, 1) || e(s.height, 1) > e(s.fitHeight, 1)) && (f = !0), e(s.width * r, 1) < e(s.fitWidth, 1) && (f = !1), n === O && (f = !1);
            let m = u && e(d) > e(r),
                g = !m && !f && p && e(d) < e(r);
            a(i, this.cn("canZoomIn"), m), a(i, this.cn("canZoomOut"), g), a(i, this.cn("isDraggable"), f);
            for (const t of i.querySelectorAll('[data-panzoom-action="zoomIn"]')) u ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
            for (const t of i.querySelectorAll('[data-panzoom-action="zoomOut"]')) p ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
            for (const t of i.querySelectorAll('[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]')) {
                u || p ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"));
                const e = t.querySelector("g");
                e && (e.style.display = u ? "" : "none")
            }
        }
        panTo({
            x: t = this.target.e,
            y: e = this.target.f,
            scale: i = this.targetScale,
            friction: n = this.option("friction"),
            angle: s = 0,
            originX: o = 0,
            originY: a = 0,
            flipX: r = !1,
            flipY: l = !1,
            ignoreBounds: c = !1
        }) {
            this.state !== b.Destroy && this.applyChange({
                panX: t - this.target.e,
                panY: e - this.target.f,
                scale: i / this.targetScale,
                angle: s,
                originX: o,
                originY: a,
                friction: n,
                flipX: r,
                flipY: l,
                ignoreBounds: c
            })
        }
        applyChange({
            panX: t = 0,
            panY: i = 0,
            scale: n = 1,
            angle: s = 0,
            originX: o = -this.current.e,
            originY: a = -this.current.f,
            friction: r = this.option("friction"),
            flipX: l = !1,
            flipY: c = !1,
            ignoreBounds: h = !1,
            bounce: d = this.option("bounce")
        }) {
            if (this.state === b.Destroy) return;
            this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.friction = r || 0, this.ignoreBounds = h;
            const {
                current: u
            } = this, p = u.e, f = u.f, m = this.getMatrix(this.target);
            let g = (new DOMMatrix).translate(p, f).translate(o, a).translate(t, i);
            if (this.option("zoom")) {
                if (!h) {
                    const t = this.targetScale,
                        e = this.minScale,
                        i = this.maxScale;
                    t * n < e && (n = e / t), t * n > i && (n = i / t)
                }
                g = g.scale(n)
            }
            g = g.translate(-o, -a).translate(-p, -f).multiply(m), s && (g = g.rotate(s)), l && (g = g.scale(-1, 1)), c && (g = g.scale(1, -1));
            for (const t of v) "e" !== t && "f" !== t && (g[t] > this.minScale + 1e-5 || g[t] < this.minScale - 1e-5) ? this.target[t] = g[t] : this.target[t] = e(g[t], T);
            (this.targetScale < this.scale || Math.abs(n - 1) > .1 || this.panMode === O || !1 === d) && !h && this.clampTargetBounds(), this.isResting || (this.state = b.Panning, this.requestTick())
        }
        stop(t = !1) {
            if (this.state === b.Init || this.state === b.Destroy) return;
            const e = this.isTicking;
            this.rAF && (cancelAnimationFrame(this.rAF), this.rAF = null), this.isBouncingX = !1, this.isBouncingY = !1;
            for (const e of v) this.velocity[e] = 0, "current" === t ? this.current[e] = this.target[e] : "target" === t && (this.target[e] = this.current[e]);
            this.setTransform(), S(this.container, "is-scaling"), S(this.container, "is-animating"), this.isTicking = !1, this.state = b.Ready, e && (this.emit("endAnimation"), this.updateControls())
        }
        requestTick() {
            this.isTicking || (this.emit("startAnimation"), this.updateControls(), P(this.container, "is-animating"), this.isScaling && P(this.container, "is-scaling")), this.isTicking = !0, this.rAF || (this.rAF = requestAnimationFrame((() => this.animate())))
        }
        panWithMouse(t, i = this.option("mouseMoveFriction")) {
            if (this.pmme = t, this.panMode !== O || !t) return;
            if (e(this.targetScale) <= e(this.minScale)) return;
            this.emit("mouseMove", t);
            const {
                container: n,
                containerRect: s,
                contentRect: o
            } = this, a = s.width, r = s.height, l = n.getBoundingClientRect(), c = (t.clientX || 0) - l.left, h = (t.clientY || 0) - l.top;
            let {
                contentWidth: d,
                contentHeight: u
            } = this.calculateContentDim(this.target);
            const p = this.option("mouseMoveFactor");
            p > 1 && (d !== a && (d *= p), u !== r && (u *= p));
            let f = .5 * (d - a) - c / a * 100 / 100 * (d - a);
            f += .5 * (o.right - o.left);
            let m = .5 * (u - r) - h / r * 100 / 100 * (u - r);
            m += .5 * (o.bottom - o.top), this.applyChange({
                panX: f - this.target.e,
                panY: m - this.target.f,
                friction: i
            })
        }
        zoomWithWheel(t) {
            if (this.state === b.Destroy || this.state === b.Init) return;
            const i = Date.now();
            if (i - this.pwt < 45) return void t.preventDefault();
            this.pwt = i;
            var n = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce((function (t, e) {
                return Math.abs(e) > Math.abs(t) ? e : t
            }));
            const s = Math.max(-1, Math.min(1, n)),
                {
                    targetScale: o,
                    maxScale: a,
                    minScale: r
                } = this;
            let l = o * (100 + 45 * s) / 100;
            e(l) < e(r) && e(o) <= e(r) ? (this.cwd += Math.abs(s), l = r) : e(l) > e(a) && e(o) >= e(a) ? (this.cwd += Math.abs(s), l = a) : (this.cwd = 0, l = Math.max(Math.min(l, a), r)), this.cwd > this.option("wheelLimit") || (t.preventDefault(), e(l) !== e(o) && this.zoomTo(l, {
                event: t
            }))
        }
        canZoomIn() {
            return this.option("zoom") && (e(this.contentRect.width, 1) < e(this.contentRect.fitWidth, 1) || e(this.targetScale) < e(this.maxScale))
        }
        canZoomOut() {
            return this.option("zoom") && e(this.targetScale) > e(this.minScale)
        }
        zoomIn(t = 1.25, e) {
            this.zoomTo(this.targetScale * t, e)
        }
        zoomOut(t = .8, e) {
            this.zoomTo(this.targetScale * t, e)
        }
        zoomToFit(t) {
            this.zoomTo("fit", t)
        }
        zoomToCover(t) {
            this.zoomTo("cover", t)
        }
        zoomToFull(t) {
            this.zoomTo("full", t)
        }
        zoomToMax(t) {
            this.zoomTo("max", t)
        }
        toggleZoom(t) {
            this.zoomTo(this.targetScale - this.minScale < .5 * (this.fullScale - this.minScale) ? "full" : "fit", t)
        }
        toggleMax(t) {
            this.zoomTo(this.targetScale - this.minScale < .5 * (this.maxScale - this.minScale) ? "max" : "fit", t)
        }
        toggleCover(t) {
            this.zoomTo(this.targetScale - this.minScale < .5 * (this.coverScale - this.minScale) ? "cover" : "fit", t)
        }
        iterateZoom(t) {
            this.zoomTo("next", t)
        }
        zoomTo(t = 1, {
            friction: e = "auto",
            originX: i = 0,
            originY: n = 0,
            event: s
        } = {}) {
            if (this.isContentLoading || this.state === b.Destroy) return;
            const {
                targetScale: o
            } = this;
            this.stop();
            let a = 1;
            if (this.panMode === O && (s = this.pmme || s), s) {
                const t = this.content.getBoundingClientRect(),
                    e = s.clientX || 0,
                    o = s.clientY || 0;
                i = e - t.left - .5 * t.width, n = o - t.top - .5 * t.height
            }
            const r = this.fullScale,
                l = this.maxScale;
            let c = this.coverScale;
            "number" == typeof t ? a = t / o : ("next" === t && (r - c < .2 && (c = r), t = o < r - 1e-5 ? "full" : o < l - 1e-5 ? "max" : "fit"), a = "full" === t ? r / o || 1 : "cover" === t ? c / o || 1 : "max" === t ? l / o || 1 : 1 / o || 1), e = "auto" === e ? a > 1 ? .15 : .25 : e, this.applyChange({
                scale: a,
                originX: i,
                originY: n,
                friction: e
            }), s && this.panMode === O && this.panWithMouse(s, e)
        }
        rotateCCW() {
            this.applyChange({
                angle: -90
            })
        }
        rotateCW() {
            this.applyChange({
                angle: 90
            })
        }
        flipX() {
            this.applyChange({
                flipX: !0
            })
        }
        flipY() {
            this.applyChange({
                flipY: !0
            })
        }
        fitX() {
            this.stop("target");
            const {
                containerRect: t,
                contentRect: e,
                target: i
            } = this;
            this.applyChange({
                panX: .5 * t.width - (e.left + .5 * e.fitWidth) - i.e,
                panY: .5 * t.height - (e.top + .5 * e.fitHeight) - i.f,
                scale: t.width / e.fitWidth / this.targetScale,
                originX: 0,
                originY: 0,
                ignoreBounds: !0
            })
        }
        fitY() {
            this.stop("target");
            const {
                containerRect: t,
                contentRect: e,
                target: i
            } = this;
            this.applyChange({
                panX: .5 * t.width - (e.left + .5 * e.fitWidth) - i.e,
                panY: .5 * t.innerHeight - (e.top + .5 * e.fitHeight) - i.f,
                scale: t.height / e.fitHeight / this.targetScale,
                originX: 0,
                originY: 0,
                ignoreBounds: !0
            })
        }
        toggleFS() {
            const {
                container: t
            } = this, e = this.cn("inFullscreen"), i = this.cn("htmlHasFullscreen");
            t.classList.toggle(e);
            const n = t.classList.contains(e);
            n ? (document.documentElement.classList.add(i), document.addEventListener("keydown", this.onKeydown, !0)) : (document.documentElement.classList.remove(i), document.removeEventListener("keydown", this.onKeydown, !0)), this.updateMetrics(), this.emit(n ? "enterFS" : "exitFS")
        }
        getMatrix(t = this.current) {
            const {
                a: e,
                b: i,
                c: n,
                d: s,
                e: o,
                f: a
            } = t;
            return new DOMMatrix([e, i, n, s, o, a])
        }
        reset(t) {
            if (this.state !== b.Init && this.state !== b.Destroy) {
                this.stop("current");
                for (const t of v) this.target[t] = C[t];
                this.target.a = this.minScale, this.target.d = this.minScale, this.clampTargetBounds(), this.isResting || (this.friction = void 0 === t ? this.option("friction") : t, this.state = b.Panning, this.requestTick())
            }
        }
        destroy() {
            this.stop(), this.state = b.Destroy, this.detachEvents(), this.detachObserver();
            const {
                container: t,
                content: e
            } = this, i = this.option("classes") || {};
            for (const e of Object.values(i)) t.classList.remove(e + "");
            e && (e.removeEventListener("load", this.onLoad), e.removeEventListener("error", this.onError)), this.detachPlugins()
        }
    }
    Object.defineProperty(k, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: w
    }), Object.defineProperty(k, "Plugins", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {}
    });
    const I = function (t, e) {
            let i = !0;
            return (...n) => {
                i && (i = !1, t(...n), setTimeout((() => {
                    i = !0
                }), e))
            }
        },
        D = (t, e) => {
            let i = [];
            return t.childNodes.forEach((t => {
                t.nodeType !== Node.ELEMENT_NODE || e && !t.matches(e) || i.push(t)
            })), i
        },
        F = {
            viewport: null,
            track: null,
            enabled: !0,
            slides: [],
            axis: "x",
            transition: "fade",
            preload: 1,
            slidesPerPage: "auto",
            initialPage: 0,
            friction: .12,
            Panzoom: {
                decelFriction: .12
            },
            center: !0,
            infinite: !0,
            fill: !0,
            dragFree: !1,
            adaptiveHeight: !1,
            direction: "ltr",
            classes: {
                container: "f-carousel",
                viewport: "f-carousel__viewport",
                track: "f-carousel__track",
                slide: "f-carousel__slide",
                isLTR: "is-ltr",
                isRTL: "is-rtl",
                isHorizontal: "is-horizontal",
                isVertical: "is-vertical",
                inTransition: "in-transition",
                isSelected: "is-selected"
            },
            l10n: {
                NEXT: "Next slide",
                PREV: "Previous slide",
                GOTO: "Go to slide #%d"
            }
        };
    var j;
    ! function (t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Destroy = 2] = "Destroy"
    }(j || (j = {}));
    const H = t => {
            if ("string" == typeof t && (t = {
                    html: t
                }), !(t instanceof String || t instanceof HTMLElement)) {
                const e = t.thumb;
                void 0 !== e && ("string" == typeof e && (t.thumbSrc = e), e instanceof HTMLImageElement && (t.thumbEl = e, t.thumbElSrc = e.src, t.thumbSrc = e.src), delete t.thumb)
            }
            return Object.assign({
                html: "",
                el: null,
                isDom: !1,
                class: "",
                index: -1,
                dim: 0,
                gap: 0,
                pos: 0,
                transition: !1
            }, t)
        },
        B = (t = {}) => Object.assign({
            index: -1,
            slides: [],
            dim: 0,
            pos: -1
        }, t);
    class N extends m {
        constructor(t, e) {
            super(e), Object.defineProperty(this, "instance", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: t
            })
        }
        attach() {}
        detach() {}
    }
    const _ = {
        classes: {
            list: "f-carousel__dots",
            isDynamic: "is-dynamic",
            hasDots: "has-dots",
            dot: "f-carousel__dot",
            isBeforePrev: "is-before-prev",
            isPrev: "is-prev",
            isCurrent: "is-current",
            isNext: "is-next",
            isAfterNext: "is-after-next"
        },
        dotTpl: '<button type="button" data-carousel-page="%i" aria-label="{{GOTO}}"><span class="f-carousel__dot" aria-hidden="true"></span></button>',
        dynamicFrom: 11,
        maxCount: 1 / 0,
        minCount: 2
    };
    class W extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "isDynamic", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "list", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onRefresh() {
            this.refresh()
        }
        build() {
            let t = this.list;
            return t || (t = document.createElement("ul"), P(t, this.cn("list")), t.setAttribute("role", "tablist"), this.instance.container.appendChild(t), P(this.instance.container, this.cn("hasDots")), this.list = t), t
        }
        refresh() {
            var t;
            const e = this.instance.pages.length,
                i = Math.min(2, this.option("minCount")),
                n = Math.max(2e3, this.option("maxCount")),
                s = this.option("dynamicFrom");
            if (e < i || e > n) return void this.cleanup();
            const o = "number" == typeof s && e > 5 && e >= s,
                r = !this.list || this.isDynamic !== o || this.list.children.length !== e;
            r && this.cleanup();
            const l = this.build();
            if (a(l, this.cn("isDynamic"), !!o), r)
                for (let t = 0; t < e; t++) l.append(this.createItem(t));
            let c, h = 0;
            for (const e of [...l.children]) {
                const i = h === this.instance.page;
                i && (c = e), a(e, this.cn("isCurrent"), i), null === (t = e.children[0]) || void 0 === t || t.setAttribute("aria-selected", i ? "true" : "false");
                for (const t of ["isBeforePrev", "isPrev", "isNext", "isAfterNext"]) S(e, this.cn(t));
                h++
            }
            if (c = c || l.firstChild, o && c) {
                const t = c.previousElementSibling,
                    e = t && t.previousElementSibling;
                P(t, this.cn("isPrev")), P(e, this.cn("isBeforePrev"));
                const i = c.nextElementSibling,
                    n = i && i.nextElementSibling;
                P(i, this.cn("isNext")), P(n, this.cn("isAfterNext"))
            }
            this.isDynamic = o
        }
        createItem(t = 0) {
            var e;
            const i = document.createElement("li");
            i.setAttribute("role", "presentation");
            const n = s(this.instance.localize(this.option("dotTpl"), [
                ["%d", t + 1]
            ]).replace(/\%i/g, t + ""));
            return i.appendChild(n), null === (e = i.children[0]) || void 0 === e || e.setAttribute("role", "tab"), i
        }
        cleanup() {
            this.list && (this.list.remove(), this.list = null), this.isDynamic = !1, S(this.instance.container, this.cn("hasDots"))
        }
        attach() {
            this.instance.on(["refresh", "change"], this.onRefresh)
        }
        detach() {
            this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup()
        }
    }
    Object.defineProperty(W, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: _
    });
    const $ = "disabled",
        X = "next",
        Y = "prev";
    class q extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "prev", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "next", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onRefresh() {
            const t = this.instance,
                e = t.pages.length,
                i = t.page;
            if (e < 2) return void this.cleanup();
            this.build();
            let n = this.prev,
                s = this.next;
            n && s && (n.removeAttribute($), s.removeAttribute($), t.isInfinite || (i <= 0 && n.setAttribute($, ""), i >= e - 1 && s.setAttribute($, "")))
        }
        createButton(t) {
            const e = this.instance,
                i = document.createElement("button");
            i.setAttribute("tabindex", "0"), i.setAttribute("title", e.localize(`{{${t.toUpperCase()}}}`)), P(i, this.cn("button") + " " + this.cn(t === X ? "isNext" : "isPrev"));
            const n = e.isRTL ? t === X ? Y : X : t;
            var s;
            return i.innerHTML = e.localize(this.option(`${n}Tpl`)), i.dataset[`carousel${s=t,s?s.match("^[a-z]")?s.charAt(0).toUpperCase()+s.substring(1):s:""}`] = "true", i
        }
        build() {
            let t = this.container;
            t || (this.container = t = document.createElement("div"), P(t, this.cn("container")), this.instance.container.appendChild(t)), this.next || (this.next = t.appendChild(this.createButton(X))), this.prev || (this.prev = t.appendChild(this.createButton(Y)))
        }
        cleanup() {
            this.prev && this.prev.remove(), this.next && this.next.remove(), this.container && this.container.remove(), this.prev = null, this.next = null, this.container = null
        }
        attach() {
            this.instance.on(["refresh", "change"], this.onRefresh)
        }
        detach() {
            this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup()
        }
    }
    Object.defineProperty(q, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            classes: {
                container: "f-carousel__nav",
                button: "f-button",
                isNext: "is-next",
                isPrev: "is-prev"
            },
            nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',
            prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>'
        }
    });
    class V extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "selectedIndex", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "target", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "nav", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        addAsTargetFor(t) {
            this.target = this.instance, this.nav = t, this.attachEvents()
        }
        addAsNavFor(t) {
            this.nav = this.instance, this.target = t, this.attachEvents()
        }
        attachEvents() {
            this.nav && this.target && (this.nav.options.initialSlide = this.target.options.initialPage, this.nav.on("ready", this.onNavReady), this.nav.state === j.Ready && this.onNavReady(this.nav), this.target.on("ready", this.onTargetReady), this.target.state === j.Ready && this.onTargetReady(this.target))
        }
        onNavReady(t) {
            t.on("createSlide", this.onNavCreateSlide), t.on("Panzoom.click", this.onNavClick), t.on("Panzoom.touchEnd", this.onNavTouch), this.onTargetChange()
        }
        onTargetReady(t) {
            t.on("change", this.onTargetChange), t.on("Panzoom.refresh", this.onTargetChange), this.onTargetChange()
        }
        onNavClick(t, e, i) {
            i.pointerType || this.onNavTouch(t, t.panzoom, i)
        }
        onNavTouch(t, e, i) {
            var n, s;
            if (Math.abs(e.dragOffset.x) > 3 || Math.abs(e.dragOffset.y) > 3) return;
            const o = i.target,
                {
                    nav: a,
                    target: r
                } = this;
            if (!a || !r || !o) return;
            const l = o.closest("[data-index]");
            if (i.stopPropagation(), i.preventDefault(), !l) return;
            const c = parseInt(l.dataset.index || "", 10) || 0,
                h = r.getPageForSlide(c),
                d = a.getPageForSlide(c);
            a.slideTo(d), r.slideTo(h, {
                friction: null === (s = null === (n = this.nav) || void 0 === n ? void 0 : n.plugins) || void 0 === s ? void 0 : s.Sync.option("friction")
            }), this.markSelectedSlide(c)
        }
        onNavCreateSlide(t, e) {
            e.index === this.selectedIndex && this.markSelectedSlide(e.index)
        }
        onTargetChange() {
            const {
                target: t,
                nav: e
            } = this;
            if (!t || !e) return;
            if (e.state !== j.Ready || t.state !== j.Ready) return;
            const i = t.pages[t.page].slides[0].index,
                n = e.getPageForSlide(i);
            this.markSelectedSlide(i), e.slideTo(n)
        }
        markSelectedSlide(t) {
            const {
                nav: e
            } = this;
            e && e.state === j.Ready && (this.selectedIndex = t, [...e.slides].map((e => {
                e.el && e.el.classList[e.index === t ? "add" : "remove"]("is-nav-selected")
            })))
        }
        attach() {
            let t = this.options.target,
                e = this.options.nav;
            t ? this.addAsNavFor(t) : e && this.addAsTargetFor(e)
        }
        detach() {
            const t = this,
                e = t.nav,
                i = t.target;
            e && (e.off("ready", t.onNavReady), e.off("createSlide", t.onNavCreateSlide), e.off("Panzoom.click", t.onNavClick), e.off("Panzoom.touchEnd", t.onNavTouch)), this.nav = null, i && (i.off("ready", t.onTargetReady), i.off("refresh", t.onTargetChange), i.off("change", t.onTargetChange)), this.target = null
        }
    }
    Object.defineProperty(V, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            friction: .35
        }
    });
    const Z = {
        Navigation: q,
        Dots: W,
        Sync: V
    };
    class G extends g {
        get axis() {
            return this.isHorizontal ? "e" : "f"
        }
        get isEnabled() {
            return this.state === j.Ready
        }
        get isInfinite() {
            let t = !1;
            const {
                contentDim: e,
                viewportDim: i,
                pages: n,
                slides: s
            } = this;
            return n.length >= 2 && e + s[0].dim >= i && (t = this.option("infinite")), t
        }
        get isRTL() {
            return "rtl" === this.option("direction")
        }
        get isHorizontal() {
            return "x" === this.option("axis")
        }
        constructor(t, e = {}, i = {}) {
            if (super(), Object.defineProperty(this, "userOptions", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {}
                }), Object.defineProperty(this, "userPlugins", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: {}
                }), Object.defineProperty(this, "bp", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: ""
                }), Object.defineProperty(this, "lp", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "state", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: j.Init
                }), Object.defineProperty(this, "page", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "prevPage", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "container", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: void 0
                }), Object.defineProperty(this, "viewport", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "track", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "slides", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: []
                }), Object.defineProperty(this, "pages", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: []
                }), Object.defineProperty(this, "panzoom", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: null
                }), Object.defineProperty(this, "inTransition", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: new Set
                }), Object.defineProperty(this, "contentDim", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), Object.defineProperty(this, "viewportDim", {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: 0
                }), "string" == typeof t && (t = document.querySelector(t)), !t || !E(t)) throw new Error("No Element found");
            this.container = t, this.slideNext = I(this.slideNext.bind(this), 150), this.slidePrev = I(this.slidePrev.bind(this), 150), this.userOptions = e, this.userPlugins = i, queueMicrotask((() => {
                this.processOptions()
            }))
        }
        processOptions() {
            const t = p({}, G.defaults, this.userOptions);
            let e = "";
            const i = t.breakpoints;
            if (i && u(i))
                for (const [n, s] of Object.entries(i)) window.matchMedia(n).matches && u(s) && (e += n, p(t, s));
            e === this.bp && this.state !== j.Init || (this.bp = e, this.state === j.Ready && (t.initialSlide = this.pages[this.page].slides[0].index), this.state !== j.Init && this.destroy(), super.setOptions(t), !1 === this.option("enabled") ? this.attachEvents() : setTimeout((() => {
                this.init()
            }), 0))
        }
        init() {
            this.state = j.Init, this.emit("init"), this.attachPlugins(Object.assign(Object.assign({}, G.Plugins), this.userPlugins)), this.initLayout(), this.initSlides(), this.updateMetrics(), this.setInitialPosition(), this.initPanzoom(), this.attachEvents(), this.state = j.Ready, this.emit("ready")
        }
        initLayout() {
            const {
                container: t
            } = this, e = this.option("classes");
            P(t, this.cn("container")), a(t, e.isLTR, !this.isRTL), a(t, e.isRTL, this.isRTL), a(t, e.isVertical, !this.isHorizontal), a(t, e.isHorizontal, this.isHorizontal);
            let i = this.option("viewport") || t.querySelector(`.${e.viewport}`);
            i || (i = document.createElement("div"), P(i, e.viewport), i.append(...D(t, `.${e.slide}`)), t.prepend(i));
            let n = this.option("track") || t.querySelector(`.${e.track}`);
            n || (n = document.createElement("div"), P(n, e.track), n.append(...Array.from(i.childNodes))), n.setAttribute("aria-live", "polite"), i.contains(n) || i.prepend(n), this.viewport = i, this.track = n, this.emit("initLayout")
        }
        initSlides() {
            const {
                track: t
            } = this;
            if (t) {
                this.slides = [], [...D(t, `.${this.cn("slide")}`)].forEach((t => {
                    if (E(t)) {
                        const e = H({
                            el: t,
                            isDom: !0,
                            index: this.slides.length
                        });
                        this.slides.push(e), this.emit("initSlide", e, this.slides.length)
                    }
                }));
                for (let t of this.option("slides", [])) {
                    const e = H(t);
                    e.index = this.slides.length, this.slides.push(e), this.emit("initSlide", e, this.slides.length)
                }
                this.emit("initSlides")
            }
        }
        setInitialPage() {
            let t = 0;
            const e = this.option("initialSlide");
            t = "number" == typeof e ? this.getPageForSlide(e) : parseInt(this.option("initialPage", 0) + "", 10) || 0, this.page = t
        }
        setInitialPosition() {
            if (!this.track || !this.pages.length) return;
            const t = this.isHorizontal;
            let e = this.page;
            this.pages[e] || (this.page = e = 0);
            const i = this.pages[e].pos * (this.isRTL && t ? 1 : -1),
                n = t ? `${i}px` : "0",
                s = t ? "0" : `${i}px`;
            this.track.style.transform = `translate3d(${n}, ${s}, 0) scale(1)`, this.option("adaptiveHeight") && this.setViewportHeight()
        }
        initPanzoom() {
            this.panzoom && (this.panzoom.destroy(), this.panzoom = null);
            const t = this.option("Panzoom") || {};
            this.panzoom = new k(this.viewport, p({}, {
                content: this.track,
                zoom: !1,
                panOnlyZoomed: !1,
                lockAxis: this.isHorizontal ? "x" : "y",
                infinite: this.isInfinite,
                click: !1,
                dblClick: !1,
                touch: t => !(this.pages.length < 2 && !t.options.infinite),
                bounds: () => this.getBounds(),
                maxVelocity: t => Math.abs(t.target[this.axis] - t.current[this.axis]) < 2 * this.viewportDim ? 100 : 0
            }, t)), this.panzoom.on("*", ((t, e, ...i) => {
                this.emit(`Panzoom.${e}`, t, ...i)
            })), this.panzoom.on("decel", this.onDecel), this.panzoom.on("refresh", this.onRefresh), this.panzoom.on("beforeTransform", this.onBeforeTransform), this.panzoom.on("endAnimation", this.onEndAnimation)
        }
        attachEvents() {
            const t = this.container;
            t && (t.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.addEventListener("slideTo", this.onSlideTo)), window.addEventListener("resize", this.onResize)
        }
        createPages() {
            let t = [];
            const {
                contentDim: e,
                viewportDim: i
            } = this;
            let n = this.option("slidesPerPage");
            ("number" != typeof n || e <= i) && (n = 1 / 0);
            let s = 0,
                o = 0,
                a = 0;
            for (const e of this.slides)(!t.length || o + e.dim > i || a === n) && (t.push(B()), s = t.length - 1, o = 0, a = 0), t[s].slides.push(e), o += e.dim + e.gap, a++;
            return t
        }
        processPages() {
            const t = this.pages,
                {
                    contentDim: i,
                    viewportDim: n
                } = this,
                s = this.option("center"),
                o = this.option("fill"),
                a = o && s && i > n && !this.isInfinite;
            if (t.forEach(((t, e) => {
                    t.index = e, t.pos = t.slides[0].pos, t.dim = 0;
                    for (const [e, i] of t.slides.entries()) t.dim += i.dim, e < t.slides.length - 1 && (t.dim += i.gap);
                    a && t.pos + .5 * t.dim < .5 * n ? t.pos = 0 : a && t.pos + .5 * t.dim >= i - .5 * n ? t.pos = i - n : s && (t.pos += -.5 * (n - t.dim))
                })), t.forEach(((t, s) => {
                    o && !this.isInfinite && i > n && (t.pos = Math.max(t.pos, 0), t.pos = Math.min(t.pos, i - n)), t.pos = e(t.pos, 1e3), t.dim = e(t.dim, 1e3), t.pos < .1 && t.pos > -.1 && (t.pos = 0)
                })), this.isInfinite) return t;
            const r = [];
            let l;
            return t.forEach((t => {
                const e = Object.assign({}, t);
                l && e.pos === l.pos ? (l.dim += e.dim, l.slides = [...l.slides, ...e.slides]) : (e.index = r.length, l = e, r.push(e))
            })), r
        }
        getPageFromIndex(t = 0) {
            const e = this.pages.length;
            let i;
            return t = parseInt((t || 0).toString()) || 0, i = this.isInfinite ? (t % e + e) % e : Math.max(Math.min(t, e - 1), 0), i
        }
        getSlideMetrics(t) {
            var i;
            const n = this.isHorizontal ? "width" : "height";
            let s = 0,
                o = 0,
                a = t.el;
            if (a ? s = parseFloat(a.dataset[n] || "") || 0 : (a = document.createElement("div"), a.style.visibility = "hidden", P(a, this.cn("slide") + " " + t.class), (this.track || document.body).prepend(a)), s) a.style[n] = `${s}px`, a.style["width" === n ? "height" : "width"] = "";
            else {
                const t = Math.max(1, (null === (i = window.visualViewport) || void 0 === i ? void 0 : i.scale) || 1);
                s = a.getBoundingClientRect()[n] * t
            }
            const r = getComputedStyle(a);
            return "content-box" === r.boxSizing && (this.isHorizontal ? (s += parseFloat(r.paddingLeft) || 0, s += parseFloat(r.paddingRight) || 0) : (s += parseFloat(r.paddingTop) || 0, s += parseFloat(r.paddingBottom) || 0)), o = parseFloat(r[this.isHorizontal ? "marginRight" : "marginBottom"]) || 0, t.el || a.remove(), {
                dim: e(s, 1e3),
                gap: e(o, 1e3)
            }
        }
        getBounds() {
            const {
                isInfinite: t,
                isRTL: e,
                isHorizontal: i,
                pages: n
            } = this;
            let s = {
                min: 0,
                max: 0
            };
            if (t) s = {
                min: -1 / 0,
                max: 1 / 0
            };
            else if (n.length) {
                const t = n[0].pos,
                    o = n[n.length - 1].pos;
                s = e && i ? {
                    min: t,
                    max: o
                } : {
                    min: -1 * o,
                    max: -1 * t
                }
            }
            return {
                x: i ? s : {
                    min: 0,
                    max: 0
                },
                y: i ? {
                    min: 0,
                    max: 0
                } : s
            }
        }
        repositionSlides() {
            let t, {
                    isHorizontal: i,
                    isRTL: n,
                    isInfinite: s,
                    viewport: o,
                    viewportDim: a,
                    contentDim: r,
                    page: l,
                    pages: c,
                    slides: h,
                    panzoom: d
                } = this,
                u = 0,
                p = 0,
                f = 0,
                m = 0;
            d ? m = -1 * d.current[this.axis] : c[l] && (m = c[l].pos || 0), t = i ? n ? "right" : "left" : "top", n && i && (m *= -1);
            for (const i of h) i.el ? ("top" === t ? (i.el.style.right = "", i.el.style.left = "") : i.el.style.top = "", i.index !== u ? i.el.style[t] = 0 === p ? "" : `${e(p,1e3)}px` : i.el.style[t] = "", f += i.dim + i.gap, u++) : p += i.dim + i.gap;
            if (s && f && o) {
                let n = getComputedStyle(o),
                    s = "padding",
                    l = i ? "Right" : "Bottom",
                    c = parseFloat(n[s + (i ? "Left" : "Top")]);
                m -= c, a += c, a += parseFloat(n[s + l]);
                for (const i of h) i.el && (e(i.pos) < e(a) && e(i.pos + i.dim + i.gap) < e(m) && e(m) > e(r - a) && (i.el.style[t] = `${e(p+f,1e3)}px`), e(i.pos + i.gap) >= e(r - a) && e(i.pos) > e(m + a) && e(m) < e(a) && (i.el.style[t] = `-${e(f,1e3)}px`))
            }
            let g, b, v = [...this.inTransition];
            if (v.length > 1 && (g = c[v[0]], b = c[v[1]]), g && b) {
                let i = 0;
                for (const n of h) n.el ? this.inTransition.has(n.index) && g.slides.indexOf(n) < 0 && (n.el.style[t] = `${e(i+(g.pos-b.pos),1e3)}px`) : i += n.dim + n.gap
            }
        }
        createSlideEl(t) {
            const {
                track: e,
                slides: i
            } = this;
            if (!e || !t) return;
            if (t.el) return;
            const n = document.createElement("div");
            P(n, this.cn("slide")), P(n, t.class), P(n, t.customClass), t.html && (n.innerHTML = t.html);
            const s = [];
            i.forEach(((t, e) => {
                t.el && s.push(e)
            }));
            const o = t.index;
            let a = null;
            if (s.length) {
                a = i[s.reduce(((t, e) => Math.abs(e - o) < Math.abs(t - o) ? e : t))]
            }
            const r = a && a.el ? a.index < t.index ? a.el.nextSibling : a.el : null;
            e.insertBefore(n, e.contains(r) ? r : null), t.el = n, this.emit("createSlide", t)
        }
        removeSlideEl(t, e = !1) {
            const i = t.el;
            if (!i) return;
            if (S(i, this.cn("isSelected")), t.isDom && !e) return i.removeAttribute("aria-hidden"), i.removeAttribute("data-index"), S(i, this.cn("isSelected")), void(i.style.left = "");
            this.emit("removeSlide", t);
            const n = new CustomEvent("animationend");
            i.dispatchEvent(n), t.el && t.el.remove(), t.el = null
        }
        transitionTo(t = 0, i = this.option("transition")) {
            if (!i) return !1;
            const {
                pages: n,
                panzoom: s
            } = this;
            t = parseInt((t || 0).toString()) || 0;
            const o = this.getPageFromIndex(t);
            if (!s || !n[o] || n.length < 2 || Math.abs(n[this.page].slides[0].dim - this.viewportDim) > 1) return !1;
            const a = t > this.page ? 1 : -1,
                r = this.pages[o].pos * (this.isRTL ? 1 : -1);
            if (this.page === o && e(r, 1e3) === e(s.target[this.axis], 1e3)) return !1;
            this.clearTransitions();
            const l = s.isResting;
            P(this.container, this.cn("inTransition"));
            const c = this.pages[this.page].slides[0],
                h = this.pages[o].slides[0];
            this.inTransition.add(h.index), this.createSlideEl(h);
            let d = c.el,
                u = h.el;
            l || "slide" === i || (i = "fadeFast", d = null);
            const p = this.isRTL ? "next" : "prev",
                f = this.isRTL ? "prev" : "next";
            return d && (this.inTransition.add(c.index), c.transition = i, d.addEventListener("animationend", this.onAnimationEnd), d.classList.add(`f-${i}Out`, `to-${a>0?f:p}`)), u && (h.transition = i, u.addEventListener("animationend", this.onAnimationEnd), u.classList.add(`f-${i}In`, `from-${a>0?p:f}`)), s.panTo({
                x: this.isHorizontal ? r : 0,
                y: this.isHorizontal ? 0 : r,
                friction: 0
            }), this.onChange(o), !0
        }
        manageSlideVisiblity() {
            const t = new Set,
                e = new Set,
                i = this.getVisibleSlides(parseFloat(this.option("preload", 0) + "") || 0);
            for (const n of this.slides) i.has(n) ? t.add(n) : e.add(n);
            for (const e of this.inTransition) t.add(this.slides[e]);
            for (const e of t) this.createSlideEl(e), this.lazyLoadSlide(e);
            for (const i of e) t.has(i) || this.removeSlideEl(i);
            this.markSelectedSlides(), this.repositionSlides()
        }
        markSelectedSlides() {
            if (!this.pages[this.page] || !this.pages[this.page].slides) return;
            const t = "aria-hidden";
            let e = this.cn("isSelected");
            if (e)
                for (const i of this.slides) i.el && (i.el.dataset.index = `${i.index}`, this.pages[this.page].slides.includes(i) ? (i.el.classList.contains(e) || (P(i.el, e), this.emit("selectSlide", i)), i.el.removeAttribute(t)) : (i.el.classList.contains(e) && (S(i.el, e), this.emit("unselectSlide", i)), i.el.setAttribute(t, "true")))
        }
        flipInfiniteTrack() {
            const t = this.panzoom;
            if (!t || !this.isInfinite) return;
            const e = "x" === this.option("axis") ? "e" : "f",
                {
                    viewportDim: i,
                    contentDim: n
                } = this;
            let s = t.current[e],
                o = t.target[e] - s,
                a = 0,
                r = .5 * i,
                l = n;
            this.isRTL && this.isHorizontal ? (s < -r && (a = -1, s += l), s > l - r && (a = 1, s -= l)) : (s > r && (a = 1, s -= l), s < -l + r && (a = -1, s += l)), a && (t.current[e] = s, t.target[e] = s + o)
        }
        lazyLoadSlide(t) {
            const e = this,
                i = t && t.el;
            if (!i) return;
            const n = new Set,
                o = "f-fadeIn";
            i.querySelectorAll("[data-lazy-srcset]").forEach((t => {
                t instanceof HTMLImageElement && n.add(t)
            }));
            let a = Array.from(i.querySelectorAll("[data-lazy-src]"));
            i.dataset.lazySrc && a.push(i), a.map((t => {
                t instanceof HTMLImageElement ? n.add(t) : E(t) && (t.style.backgroundImage = `url('${t.dataset.lazySrc||""}')`, delete t.dataset.lazySrc)
            }));
            const r = (t, i, n) => {
                n && (n.remove(), n = null), i.complete && (i.classList.add(o), setTimeout((() => {
                    i.classList.remove(o)
                }), 350), i.style.display = ""), this.option("adaptiveHeight") && t.el && this.pages[this.page].slides.indexOf(t) > -1 && (e.updateMetrics(), e.setViewportHeight()), this.emit("load", t)
            };
            for (const e of n) {
                let i = null;
                e.src = e.dataset.lazySrcset || e.dataset.lazySrc || "", delete e.dataset.lazySrc, delete e.dataset.lazySrcset, e.style.display = "none", e.addEventListener("error", (() => {
                    r(t, e, i)
                })), e.addEventListener("load", (() => {
                    r(t, e, i)
                })), setTimeout((() => {
                    e.parentNode && t.el && (e.complete ? r(t, e, i) : (i = s(x), e.parentNode.insertBefore(i, e)))
                }), 300)
            }
        }
        onAnimationEnd(t) {
            var e;
            const i = t.target,
                n = i ? parseInt(i.dataset.index || "", 10) || 0 : -1,
                s = this.slides[n],
                o = t.animationName;
            if (!i || !s || !o) return;
            const a = !!this.inTransition.has(n) && s.transition;
            a && o.substring(0, a.length + 2) === `f-${a}` && this.inTransition.delete(n), this.inTransition.size || this.clearTransitions(), n === this.page && (null === (e = this.panzoom) || void 0 === e ? void 0 : e.isResting) && this.emit("settle")
        }
        onDecel(t, e = 0, i = 0) {
            const {
                isRTL: n,
                isHorizontal: s,
                axis: o,
                pages: a
            } = this, r = a.length, l = Math.abs(Math.atan2(i, e) / (Math.PI / 180));
            let c = 0;
            if (c = l > 45 && l < 135 ? s ? 0 : i : s ? e : 0, !r) return;
            const h = this.option("dragFree");
            let d = this.page,
                u = n && s ? 1 : -1;
            const p = t.target[o] * u,
                f = t.current[o] * u;
            let {
                pageIndex: m
            } = this.getPageFromPosition(p), {
                pageIndex: g
            } = this.getPageFromPosition(f);
            h ? this.onChange(m) : (Math.abs(c) > 5 ? (a[d].dim < document.documentElement["client" + (this.isHorizontal ? "Width" : "Height")] - 1 && (d = g), d = n && s ? c < 0 ? d - 1 : d + 1 : c < 0 ? d + 1 : d - 1) : d = g, this.slideTo(d, {
                transition: !1,
                friction: t.option("decelFriction")
            }))
        }
        onClick(t) {
            const e = t.target,
                i = e && E(e) ? e.dataset : null;
            let n, s;
            i && (void 0 !== i.carouselPage ? (s = "slideTo", n = i.carouselPage) : void 0 !== i.carouselNext ? s = "slideNext" : void 0 !== i.carouselPrev && (s = "slidePrev")), s ? (t.preventDefault(), t.stopPropagation(), e && !e.hasAttribute("disabled") && this[s](n)) : this.emit("click", t)
        }
        onSlideTo(t) {
            const e = t.detail || 0;
            this.slideTo(this.getPageForSlide(e), {
                friction: 0
            })
        }
        onChange(t, e = 0) {
            const i = this.page;
            this.prevPage = i, this.page = t, this.option("adaptiveHeight") && this.setViewportHeight(), t !== i && (this.markSelectedSlides(), this.emit("change", t, i, e))
        }
        onRefresh() {
            let t = this.contentDim,
                e = this.viewportDim;
            this.updateMetrics(), this.contentDim === t && this.viewportDim === e || this.slideTo(this.page, {
                friction: 0,
                transition: !1
            })
        }
        onResize() {
            this.option("breakpoints") && this.processOptions()
        }
        onBeforeTransform(t) {
            this.lp !== t.current[this.axis] && (this.flipInfiniteTrack(), this.manageSlideVisiblity()), this.lp = t.current.e
        }
        onEndAnimation() {
            this.inTransition.size || this.emit("settle")
        }
        reInit(t = null, e = null) {
            this.destroy(), this.state = j.Init, this.userOptions = t || this.userOptions, this.userPlugins = e || this.userPlugins, this.processOptions()
        }
        slideTo(t = 0, {
            friction: e = this.option("friction"),
            transition: i = this.option("transition")
        } = {}) {
            if (this.state === j.Destroy) return;
            const {
                axis: n,
                isHorizontal: s,
                isRTL: o,
                pages: a,
                panzoom: r
            } = this, l = a.length, c = o && s ? 1 : -1;
            if (!r || !l) return;
            if (this.transitionTo(t, i)) return;
            const h = this.getPageFromIndex(t);
            let d = a[h].pos;
            if (this.isInfinite) {
                const e = this.contentDim,
                    i = r.target[n] * c;
                if (2 === l) d += e * Math.floor(parseFloat(t + "") / 2);
                else {
                    const t = i;
                    d = [d, d - e, d + e].reduce((function (e, i) {
                        return Math.abs(i - t) < Math.abs(e - t) ? i : e
                    }))
                }
            }
            d *= c, Math.abs(r.target[n] - d) < .1 || (r.panTo({
                x: s ? d : 0,
                y: s ? 0 : d,
                friction: e
            }), this.onChange(h))
        }
        slideToClosest(t) {
            if (this.panzoom) {
                const {
                    pageIndex: e
                } = this.getPageFromPosition(this.panzoom.current[this.isHorizontal ? "e" : "f"]);
                this.slideTo(e, t)
            }
        }
        slideNext() {
            this.slideTo(this.page + 1)
        }
        slidePrev() {
            this.slideTo(this.page - 1)
        }
        clearTransitions() {
            this.inTransition.clear(), S(this.container, this.cn("inTransition"));
            const t = ["to-prev", "to-next", "from-prev", "from-next"];
            for (const e of this.slides) {
                const i = e.el;
                if (i) {
                    i.removeEventListener("animationend", this.onAnimationEnd), i.classList.remove(...t);
                    const n = e.transition;
                    n && i.classList.remove(`f-${n}Out`, `f-${n}In`)
                }
            }
            this.manageSlideVisiblity()
        }
        prependSlide(t) {
            var e, i;
            let n = Array.isArray(t) ? t : [t];
            for (const t of n.reverse()) this.slides.unshift(H(t));
            for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
            const s = (null === (e = this.pages[this.page]) || void 0 === e ? void 0 : e.pos) || 0;
            this.page += n.length, this.updateMetrics();
            const o = (null === (i = this.pages[this.page]) || void 0 === i ? void 0 : i.pos) || 0;
            if (this.panzoom) {
                const t = this.isRTL ? s - o : o - s;
                this.panzoom.target.e -= t, this.panzoom.current.e -= t, this.panzoom.requestTick()
            }
        }
        appendSlide(t) {
            let e = Array.isArray(t) ? t : [t];
            for (const t of e) {
                const e = H(t);
                e.index = this.slides.length, this.slides.push(e), this.emit("initSlide", t, this.slides.length)
            }
            this.updateMetrics()
        }
        removeSlide(t) {
            const e = this.slides.length;
            t = (t % e + e) % e, this.removeSlideEl(this.slides[t], !0), this.slides.splice(t, 1);
            for (let t = 0; t < this.slides.length; t++) this.slides[t].index = t;
            this.updateMetrics(), this.slideTo(this.page, {
                friction: 0,
                transition: !1
            })
        }
        updateMetrics() {
            const {
                panzoom: t,
                viewport: i,
                track: n,
                isHorizontal: s
            } = this;
            if (!n) return;
            const o = s ? "width" : "height",
                a = s ? "offsetWidth" : "offsetHeight";
            if (i) {
                let t = Math.max(i[a], e(i.getBoundingClientRect()[o], 1e3)),
                    n = getComputedStyle(i),
                    r = "padding",
                    l = s ? "Right" : "Bottom";
                t -= parseFloat(n[r + (s ? "Left" : "Top")]) + parseFloat(n[r + l]), this.viewportDim = t
            }
            let r, l = this.pages.length,
                c = 0;
            for (const [t, i] of this.slides.entries()) {
                let n = 0,
                    s = 0;
                !i.el && r ? (n = r.dim, s = r.gap) : (({
                    dim: n,
                    gap: s
                } = this.getSlideMetrics(i)), r = i), n = e(n, 1e3), s = e(s, 1e3), i.dim = n, i.gap = s, i.pos = c, c += n, (this.isInfinite || t < this.slides.length - 1) && (c += s)
            }
            const h = this.contentDim;
            c = e(c, 1e3), this.contentDim = c, t && (t.contentRect[o] = c, t.contentRect["e" === this.axis ? "fullWidth" : "fullHeight"] = c), this.pages = this.createPages(), this.pages = this.processPages(), this.state === j.Init && this.setInitialPage(), this.page = Math.max(0, Math.min(this.page, this.pages.length - 1)), t && l === this.pages.length && Math.abs(c - h) > .5 && (t.target[this.axis] = -1 * this.pages[this.page].pos, t.current[this.axis] = -1 * this.pages[this.page].pos, t.stop()), this.manageSlideVisiblity(), this.emit("refresh")
        }
        getProgress(t, i = !1) {
            void 0 === t && (t = this.page);
            const n = this,
                s = n.panzoom,
                o = n.pages[t] || 0;
            if (!o || !s) return 0;
            let a = -1 * s.current.e,
                r = n.contentDim;
            var l = [e((a - o.pos) / (1 * o.dim), 1e3), e((a + r - o.pos) / (1 * o.dim), 1e3), e((a - r - o.pos) / (1 * o.dim), 1e3)].reduce((function (t, e) {
                return Math.abs(e) < Math.abs(t) ? e : t
            }));
            return i ? l : Math.max(-1, Math.min(1, l))
        }
        setViewportHeight() {
            const {
                page: t,
                pages: e,
                viewport: i,
                isHorizontal: n
            } = this;
            if (!i || !e[t]) return;
            let s = 0;
            n && this.track && (this.track.style.height = "auto", e[t].slides.forEach((t => {
                t.el && (s = Math.max(s, t.el.offsetHeight))
            }))), i.style.height = s ? `${s}px` : ""
        }
        getPageForSlide(t) {
            for (const e of this.pages)
                for (const i of e.slides)
                    if (i.index === t) return e.index;
            return -1
        }
        getVisibleSlides(t = 0) {
            var e;
            const i = new Set;
            let {
                contentDim: n,
                viewportDim: s,
                pages: o,
                page: a
            } = this;
            n = n + (null === (e = this.slides[this.slides.length - 1]) || void 0 === e ? void 0 : e.gap) || 0;
            let r = 0;
            r = this.panzoom ? -1 * this.panzoom.current[this.axis] : o[a] && o[a].pos || 0, this.isInfinite && (r -= Math.floor(r / n) * n), this.isRTL && this.isHorizontal && (r *= -1);
            const l = r - s * t,
                c = r + s * (t + 1),
                h = this.isInfinite ? [-1, 0, 1] : [0];
            for (const t of this.slides)
                for (const e of h) {
                    const s = t.pos + e * n,
                        o = t.pos + t.dim + t.gap + e * n;
                    s < c && o > l && i.add(t)
                }
            return i
        }
        getPageFromPosition(t) {
            const {
                viewportDim: e,
                contentDim: i
            } = this, n = this.pages.length, s = this.slides.length, o = this.slides[s - 1];
            let a = 0,
                r = 0,
                l = 0;
            const c = this.option("center");
            c && (t += .5 * e), this.isInfinite || (t = Math.max(this.slides[0].pos, Math.min(t, o.pos)));
            const h = i + o.gap;
            l = Math.floor(t / h) || 0, t -= l * h;
            let d = o,
                u = this.slides.find((e => {
                    const i = t + (d && !c ? .5 * d.dim : 0);
                    return d = e, e.pos <= i && e.pos + e.dim + e.gap > i
                }));
            return u || (u = o), r = this.getPageForSlide(u.index), a = r + l * n, {
                page: a,
                pageIndex: r
            }
        }
        destroy() {
            if ([j.Destroy].includes(this.state)) return;
            this.state = j.Destroy;
            const {
                container: t,
                viewport: e,
                track: i,
                slides: n,
                panzoom: s
            } = this, o = this.option("classes");
            t.removeEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.removeEventListener("slideTo", this.onSlideTo), window.removeEventListener("resize", this.onResize), s && (s.destroy(), this.panzoom = null), n && n.forEach((t => {
                this.removeSlideEl(t)
            })), this.detachPlugins(), e && e.offsetParent && i && i.offsetParent && e.replaceWith(...i.childNodes);
            for (const [e, i] of Object.entries(o)) "container" !== e && i && t.classList.remove(i);
            this.track = null, this.viewport = null, this.page = 0, this.slides = [];
            const a = this.events.get("ready");
            this.events = new Map, a && this.events.set("ready", a)
        }
    }
    Object.defineProperty(G, "Panzoom", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: k
    }), Object.defineProperty(G, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: F
    }), Object.defineProperty(G, "Plugins", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Z
    });
    const U = function (t) {
            const e = window.pageYOffset,
                i = window.pageYOffset + window.innerHeight;
            if (!E(t)) return 0;
            const n = t.getBoundingClientRect(),
                s = n.y + window.pageYOffset,
                o = n.y + n.height + window.pageYOffset;
            if (e > o || i < s) return 0;
            if (e < s && i > o) return 100;
            if (s < e && o > i) return 100;
            let a = n.height;
            s < e && (a -= window.pageYOffset - s), o > i && (a -= o - i);
            const r = a / window.innerHeight * 100;
            return Math.round(r)
        },
        K = !("undefined" == typeof window || !window.document || !window.document.createElement);
    let J;
    const Q = ["a[href]", "area[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "button:not([disabled]):not([aria-hidden]):not(.fancybox-focus-guard)", "iframe", "object", "embed", "video", "audio", "[contenteditable]", '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])'].join(","),
        tt = t => {
            if (t && K) {
                void 0 === J && document.createElement("div").focus({
                    get preventScroll() {
                        return J = !0, !1
                    }
                });
                try {
                    if (J) t.focus({
                        preventScroll: !0
                    });
                    else {
                        const e = window.pageXOffset || document.body.scrollTop,
                            i = window.pageYOffset || document.body.scrollLeft;
                        t.focus(), document.body.scrollTo({
                            top: e,
                            left: i,
                            behavior: "auto"
                        })
                    }
                } catch (t) {}
            }
        },
        et = {
            dragToClose: !0,
            hideScrollbar: !0,
            Carousel: {
                classes: {
                    container: "fancybox__carousel",
                    viewport: "fancybox__viewport",
                    track: "fancybox__track",
                    slide: "fancybox__slide"
                }
            },
            contentClick: "toggleZoom",
            contentDblClick: !1,
            backdropClick: "close",
            animated: !0,
            idle: 3500,
            showClass: "f-zoomInUp",
            hideClass: "f-fadeOut",
            commonCaption: !1,
            parentEl: null,
            startIndex: 0,
            l10n: Object.assign(Object.assign({}, y), {
                CLOSE: "Close",
                NEXT: "Next",
                PREV: "Previous",
                MODAL: "You can close this modal content with the ESC key",
                ERROR: "Something Went Wrong, Please Try Again Later",
                IMAGE_ERROR: "Image Not Found",
                ELEMENT_NOT_FOUND: "HTML Element Not Found",
                AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
                AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
                IFRAME_ERROR: "Error Loading Page",
                TOGGLE_ZOOM: "Toggle zoom level",
                TOGGLE_THUMBS: "Toggle thumbnails",
                TOGGLE_SLIDESHOW: "Toggle slideshow",
                TOGGLE_FULLSCREEN: "Toggle full-screen mode",
                DOWNLOAD: "Download"
            }),
            tpl: {
                closeButton: '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>',
                main: '<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">\n    <div class="fancybox__backdrop"></div>\n    <div class="fancybox__carousel"></div>\n    <div class="fancybox__footer"></div>\n  </div>'
            },
            groupAll: !1,
            groupAttr: "data-fancybox",
            defaultType: "image",
            defaultDisplay: "block",
            autoFocus: !0,
            trapFocus: !0,
            placeFocusBack: !0,
            closeButton: "auto",
            keyboard: {
                Escape: "close",
                Delete: "close",
                Backspace: "close",
                PageUp: "next",
                PageDown: "prev",
                ArrowUp: "prev",
                ArrowDown: "next",
                ArrowRight: "next",
                ArrowLeft: "prev"
            },
            Fullscreen: {
                autoStart: !1
            },
            compact: () => window.matchMedia("(max-width: 578px), (max-height: 578px)").matches,
            wheel: "zoom"
        };
    var it, nt;
    ! function (t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Closing = 2] = "Closing", t[t.CustomClosing = 3] = "CustomClosing", t[t.Destroy = 4] = "Destroy"
    }(it || (it = {})),
    function (t) {
        t[t.Loading = 0] = "Loading", t[t.Opening = 1] = "Opening", t[t.Ready = 2] = "Ready", t[t.Closing = 3] = "Closing"
    }(nt || (nt = {}));
    const st = () => {
        queueMicrotask((() => {
            (() => {
                const {
                    slug: t,
                    index: e
                } = ot.parseURL(), i = jt.getInstance();
                if (i && !1 !== i.option("Hash")) {
                    const n = i.carousel;
                    if (t && n) {
                        for (let e of n.slides)
                            if (e.slug && e.slug === t) return n.slideTo(e.index);
                        if (t === i.option("slug")) return n.slideTo(e - 1);
                        const s = i.getSlide(),
                            o = s && s.triggerEl && s.triggerEl.dataset;
                        if (o && o.fancybox === t) return n.slideTo(e - 1)
                    }
                    ot.hasSilentClose = !0, i.close()
                }
                ot.startFromUrl()
            })()
        }))
    };
    class ot extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "origHash", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: ""
            }), Object.defineProperty(this, "timer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onChange() {
            const t = this.instance,
                e = t.carousel;
            this.timer && clearTimeout(this.timer);
            const i = t.getSlide();
            if (!e || !i) return;
            const n = t.isOpeningSlide(i),
                s = new URL(document.URL).hash;
            let o, a = i.slug || void 0,
                r = i.triggerEl || void 0;
            o = a || this.instance.option("slug"), !o && r && r.dataset && (o = r.dataset.fancybox);
            let l = "";
            o && "true" !== o && (l = "#" + o + (!a && e.slides.length > 1 ? "-" + (i.index + 1) : "")), n && (this.origHash = s !== l ? s : ""), l && s !== l && (this.timer = setTimeout((() => {
                try {
                    t.state === it.Ready && window.history[n ? "pushState" : "replaceState"]({}, document.title, window.location.pathname + window.location.search + l)
                } catch (t) {}
            }), 300))
        }
        onClose() {
            if (this.timer && clearTimeout(this.timer), !0 !== ot.hasSilentClose) try {
                window.history.replaceState({}, document.title, window.location.pathname + window.location.search + (this.origHash || ""))
            } catch (t) {}
        }
        attach() {
            const t = this.instance;
            t.on("Carousel.ready", this.onChange), t.on("Carousel.change", this.onChange), t.on("close", this.onClose)
        }
        detach() {
            const t = this.instance;
            t.off("Carousel.ready", this.onChange), t.off("Carousel.change", this.onChange), t.off("close", this.onClose)
        }
        static parseURL() {
            const t = window.location.hash.slice(1),
                e = t.split("-"),
                i = e[e.length - 1],
                n = i && /^\+?\d+$/.test(i) && parseInt(e.pop() || "1", 10) || 1;
            return {
                hash: t,
                slug: e.join("-"),
                index: n
            }
        }
        static startFromUrl() {
            if (ot.hasSilentClose = !1, jt.getInstance() || !1 === jt.defaults.Hash) return;
            const {
                hash: t,
                slug: e,
                index: i
            } = ot.parseURL();
            if (!e) return;
            let n = document.querySelector(`[data-slug="${t}"]`);
            if (n && n.dispatchEvent(new CustomEvent("click", {
                    bubbles: !0,
                    cancelable: !0
                })), jt.getInstance()) return;
            const s = document.querySelectorAll(`[data-fancybox="${e}"]`);
            s.length && (n = s[i - 1], n && n.dispatchEvent(new CustomEvent("click", {
                bubbles: !0,
                cancelable: !0
            })))
        }
        static destroy() {
            window.removeEventListener("hashchange", st, !1)
        }
    }

    function at() {
        window.addEventListener("hashchange", st, !1), setTimeout((() => {
            ot.startFromUrl()
        }), 500)
    }
    Object.defineProperty(ot, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {}
    }), Object.defineProperty(ot, "hasSilentClose", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: !1
    }), K && (/complete|interactive|loaded/.test(document.readyState) ? at() : document.addEventListener("DOMContentLoaded", at));
    class rt extends N {
        onCreateSlide(t, e, i) {
            const n = this.instance,
                s = n.optionFor(i, "src") || "",
                {
                    el: o,
                    type: a
                } = i;
            o && "image" === a && "string" == typeof s && this.setContent(i, s).then((t => {
                const e = i.contentEl,
                    s = i.imageEl,
                    a = i.thumbElSrc;
                if (n.isClosing() || !e || !s) return;
                e.offsetHeight;
                const r = !!n.isOpeningSlide(i) && this.getZoomInfo(i);
                if (this.option("protected")) {
                    o.addEventListener("contextmenu", (t => {
                        t.preventDefault()
                    }));
                    const t = document.createElement("div");
                    P(t, "fancybox-protected"), e.appendChild(t)
                }
                if (a && r) {
                    const s = t.contentRect,
                        o = Math.max(s.fullWidth, s.fullHeight);
                    let c = null;
                    !r.opacity && o > 1200 && (c = document.createElement("img"), P(c, "fancybox-ghost"), c.src = a, e.appendChild(c));
                    const h = () => {
                        c && (P(c, "f-fadeFastOut"), setTimeout((() => {
                            c && (c.remove(), c = null)
                        }), 200))
                    };
                    (l = a, new Promise(((t, e) => {
                        const i = new Image;
                        i.onload = t, i.onerror = e, i.src = l
                    }))).then((() => {
                        i.state = nt.Opening, this.instance.emit("reveal", i), this.zoomIn(i).then((() => {
                            h(), this.instance.done(i)
                        }), (() => {
                            n.hideLoading(i)
                        })), c && setTimeout((() => {
                            h()
                        }), o > 2500 ? 800 : 200)
                    }), (() => {
                        n.hideLoading(i), n.revealContent(i)
                    }))
                } else {
                    const e = this.optionFor(i, "initialSize"),
                        s = this.optionFor(i, "zoom"),
                        o = {
                            event: n.prevMouseMoveEvent || n.options.event,
                            friction: s ? .12 : 0
                        };
                    let a = n.optionFor(i, "showClass") || void 0,
                        r = !0;
                    n.isOpeningSlide(i) && ("full" === e ? t.zoomToFull(o) : "cover" === e ? t.zoomToCover(o) : "max" === e ? t.zoomToMax(o) : r = !1, t.stop("current")), r && a && (a = t.isDragging ? "f-fadeIn" : ""), n.revealContent(i, a)
                }
                var l
            }), (() => {
                n.setError(i, "{{IMAGE_ERROR}}")
            }))
        }
        onRemoveSlide(t, e, i) {
            i.panzoom && i.panzoom.destroy(), i.panzoom = void 0, i.imageEl = void 0
        }
        onChange(t, e, i, n) {
            for (const t of e.slides) {
                const e = t.panzoom;
                e && t.index !== i && e.reset(.35)
            }
        }
        onClose() {
            var t;
            const e = this.instance,
                i = e.container,
                n = e.getSlide();
            if (!i || !i.parentElement || !n) return;
            const {
                el: s,
                contentEl: o,
                panzoom: a
            } = n, r = n.thumbElSrc;
            if (!s || !r || !o || !a || a.isContentLoading || a.state === b.Init || a.state === b.Destroy) return;
            a.updateMetrics();
            let l = this.getZoomInfo(n);
            if (!l) return;
            this.instance.state = it.CustomClosing, i.classList.remove("is-zooming-in"), i.classList.add("is-zooming-out"), o.style.backgroundImage = `url('${r}')`;
            const c = i.getBoundingClientRect();
            1 === ((null === (t = window.visualViewport) || void 0 === t ? void 0 : t.scale) || 1) && Object.assign(i.style, {
                position: "absolute",
                top: `${window.pageYOffset}px`,
                left: `${window.pageXOffset}px`,
                bottom: "auto",
                right: "auto",
                width: `${c.width}px`,
                height: `${c.height}px`,
                overflow: "hidden"
            });
            const {
                x: h,
                y: d,
                scale: u,
                opacity: p
            } = l;
            if (p) {
                const t = ((t, e, i, n) => {
                    const s = e - t,
                        o = n - i;
                    return e => i + ((e - t) / s * o || 0)
                })(a.scale, u, 1, 0);
                a.on("afterTransform", (() => {
                    o.style.opacity = t(a.scale) + ""
                }))
            }
            a.on("endAnimation", (() => {
                e.destroy()
            })), a.target.a = u, a.target.b = 0, a.target.c = 0, a.target.d = u, a.panTo({
                x: h,
                y: d,
                scale: u,
                friction: p ? .2 : .33,
                ignoreBounds: !0
            }), a.isResting && e.destroy()
        }
        setContent(t, e) {
            return new Promise(((i, n) => {
                var o, a;
                const r = this.instance,
                    l = t.el;
                if (!l) return void n();
                r.showLoading(t);
                let c = this.optionFor(t, "content");
                "string" == typeof c && (c = s(c)), c && E(c) || (c = document.createElement("img"), c instanceof HTMLImageElement && (c.src = e || "", c.alt = (null === (o = t.caption) || void 0 === o ? void 0 : o.replace(/<[^>]+>/gi, "").substring(0, 1e3)) || `Image ${t.index+1} of ${null===(a=r.carousel)||void 0===a?void 0:a.pages.length}`, c.draggable = !1, t.srcset && c.setAttribute("srcset", t.srcset)), t.sizes && c.setAttribute("sizes", t.sizes)), c.classList.add("fancybox-image"), t.imageEl = c, r.setContent(t, c, !1);
                t.panzoom = new k(l, p({}, this.option("Panzoom") || {}, {
                    content: c,
                    width: r.optionFor(t, "width", "auto"),
                    height: r.optionFor(t, "height", "auto"),
                    wheel: () => {
                        const t = r.option("wheel");
                        return ("zoom" === t || "pan" == t) && t
                    },
                    click: (e, i) => {
                        var n, s;
                        if (r.isCompact || r.isClosing()) return !1;
                        if (t.index !== (null === (n = r.getSlide()) || void 0 === n ? void 0 : n.index)) return !1;
                        let o = !i || i.target && (null === (s = t.contentEl) || void 0 === s ? void 0 : s.contains(i.target));
                        return r.option(o ? "contentClick" : "backdropClick") || !1
                    },
                    dblClick: () => r.isCompact ? "toggleZoom" : r.option("contentDblClick") || !1,
                    spinner: !1,
                    panOnlyZoomed: !0,
                    wheelLimit: 1 / 0,
                    transformParent: !0,
                    on: {
                        ready: t => {
                            i(t)
                        },
                        error: () => {
                            n()
                        },
                        destroy: () => {
                            n()
                        }
                    }
                }))
            }))
        }
        zoomIn(t) {
            return new Promise(((e, i) => {
                const n = this.instance,
                    s = n.container,
                    {
                        panzoom: o,
                        contentEl: a,
                        el: r
                    } = t;
                o && o.updateMetrics();
                const l = this.getZoomInfo(t);
                if (!(l && r && a && o && s)) return void i();
                const {
                    x: c,
                    y: h,
                    scale: d,
                    opacity: u
                } = l, p = () => {
                    t.state !== nt.Closing && (u && (a.style.opacity = Math.max(Math.min(1, 1 - (1 - o.scale) / (1 - d)), 0) + ""), o.scale >= 1 && o.scale > o.targetScale - .1 && e(o))
                }, f = t => {
                    S(s, "is-zooming-in"), t.scale < .99 || t.scale > 1.01 || (a.style.opacity = "", t.off("endAnimation", f), t.off("touchStart", f), t.off("afterTransform", p), e(t))
                };
                o.on("endAnimation", f), o.on("touchStart", f), o.on("afterTransform", p), o.on(["error", "destroy"], (() => {
                    i()
                })), o.panTo({
                    x: c,
                    y: h,
                    scale: d,
                    friction: 0,
                    ignoreBounds: !0
                }), o.stop("current");
                const m = {
                        event: "mousemove" === o.panMode ? n.prevMouseMoveEvent || n.options.event : void 0
                    },
                    g = this.optionFor(t, "initialSize");
                P(s, "is-zooming-in"), n.hideLoading(t), "full" === g ? o.zoomToFull(m) : "cover" === g ? o.zoomToCover(m) : "max" === g ? o.zoomToMax(m) : o.reset(.172)
            }))
        }
        getZoomInfo(t) {
            var e;
            const {
                el: i,
                imageEl: n,
                thumbEl: s,
                panzoom: o
            } = t;
            if (!i || !n || !s || !o || U(s) < 3 || !this.optionFor(t, "zoom") || this.instance.state === it.Destroy) return !1;
            if (1 !== ((null === (e = window.visualViewport) || void 0 === e ? void 0 : e.scale) || 1)) return !1;
            let {
                top: a,
                left: r,
                width: l,
                height: c
            } = s.getBoundingClientRect(), {
                top: h,
                left: d,
                fitWidth: u,
                fitHeight: p
            } = o.contentRect;
            if (!(l && c && u && p)) return !1;
            const f = o.container.getBoundingClientRect();
            d += f.left, h += f.top;
            const m = -1 * (d + .5 * u - (r + .5 * l)),
                g = -1 * (h + .5 * p - (a + .5 * c)),
                b = l / u;
            let v = this.option("zoomOpacity") || !1;
            return "auto" === v && (v = Math.abs(l / c - u / p) > .1), {
                x: m,
                y: g,
                scale: b,
                opacity: v
            }
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.change", t.onChange), e.on("Carousel.createSlide", t.onCreateSlide), e.on("Carousel.removeSlide", t.onRemoveSlide), e.on("close", t.onClose)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.change", t.onChange), e.off("Carousel.createSlide", t.onCreateSlide), e.off("Carousel.removeSlide", t.onRemoveSlide), e.off("close", t.onClose)
        }
    }
    Object.defineProperty(rt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            initialSize: "fit",
            Panzoom: {
                maxScale: 1
            },
            protected: !1,
            zoom: !0,
            zoomOpacity: "auto"
        }
    });
    const lt = (t, e = {}) => {
            const i = new URL(t),
                n = new URLSearchParams(i.search),
                s = new URLSearchParams;
            for (const [t, i] of [...n, ...Object.entries(e)]) {
                let e = i.toString();
                "t" === t ? s.set("start", parseInt(e).toString()) : s.set(t, e)
            }
            let o = s.toString(),
                a = t.match(/#t=((.*)?\d+s)/);
            return a && (o += `#t=${a[1]}`), o
        },
        ct = {
            ajax: null,
            autoSize: !0,
            iframeAttr: {
                allow: "autoplay; fullscreen",
                scrolling: "auto"
            },
            preload: !0,
            videoAutoplay: !0,
            videoRatio: 16 / 9,
            videoTpl: '<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">\n  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos.</video>',
            videoFormat: "",
            vimeo: {
                byline: 1,
                color: "00adef",
                controls: 1,
                dnt: 1,
                muted: 0
            },
            youtube: {
                controls: 1,
                enablejsapi: 1,
                nocookie: 1,
                rel: 0,
                fs: 1
            }
        },
        ht = ["image", "html", "ajax", "inline", "clone", "iframe", "map", "pdf", "html5video", "youtube", "vimeo", "video"];
    class dt extends N {
        onInitSlide(t, e, i) {
            this.processType(i)
        }
        onCreateSlide(t, e, i) {
            this.setContent(i)
        }
        onRemoveSlide(t, e, i) {
            i.closeBtnEl && (i.closeBtnEl.remove(), i.closeBtnEl = void 0), i.xhr && (i.xhr.abort(), i.xhr = null);
            const n = i.iframeEl;
            n && (n.onload = n.onerror = null, n.src = "//about:blank", i.iframeEl = null);
            const s = i.contentEl,
                o = i.placeholderEl;
            if ("inline" === i.type && s && o) s.classList.remove("fancybox__content"), "none" !== s.style.display && (s.style.display = "none"), o.parentNode && o.parentNode.insertBefore(s, o), o.remove(), i.placeholderEl = null;
            else
                for (; i.el && i.el.firstChild;) i.el.removeChild(i.el.firstChild)
        }
        onSelectSlide(t, e, i) {
            i.state === nt.Ready && this.playVideo()
        }
        onUnselectSlide(t, e, i) {
            var n, s;
            if ("html5video" === i.type) {
                try {
                    null === (s = null === (n = i.el) || void 0 === n ? void 0 : n.querySelector("video")) || void 0 === s || s.pause()
                } catch (t) {}
                return
            }
            let o;
            "vimeo" === i.type ? o = {
                method: "pause",
                value: "true"
            } : "youtube" === i.type && (o = {
                event: "command",
                func: "pauseVideo"
            }), o && i.iframeEl && i.iframeEl.contentWindow && i.iframeEl.contentWindow.postMessage(JSON.stringify(o), "*"), i.poller && clearTimeout(i.poller)
        }
        onDone(t, e) {
            t.isCurrentSlide(e) && !t.isClosing() && this.playVideo()
        }
        onRefresh(t, e) {
            e.slides.forEach((t => {
                t.el && (this.setAspectRatio(t), this.resizeIframe(t))
            }))
        }
        onMessage(t) {
            try {
                let e = JSON.parse(t.data);
                if ("https://player.vimeo.com" === t.origin) {
                    if ("ready" === e.event)
                        for (let e of Array.from(document.getElementsByClassName("fancybox__iframe"))) e instanceof HTMLIFrameElement && e.contentWindow === t.source && (e.dataset.ready = "true")
                } else if (t.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) && "onReady" === e.event) {
                    const t = document.getElementById(e.id);
                    t && (t.dataset.ready = "true")
                }
            } catch (t) {}
        }
        loadAjaxContent(t) {
            const e = this.instance.optionFor(t, "src") || "";
            this.instance.showLoading(t);
            const i = this.instance,
                n = new XMLHttpRequest;
            i.showLoading(t), n.onreadystatechange = function () {
                n.readyState === XMLHttpRequest.DONE && i.state === it.Ready && (i.hideLoading(t), 200 === n.status ? i.setContent(t, n.responseText) : i.setError(t, 404 === n.status ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}"))
            };
            const s = t.ajax || null;
            n.open(s ? "POST" : "GET", e + ""), n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), n.setRequestHeader("X-Requested-With", "XMLHttpRequest"), n.send(s), t.xhr = n
        }
        setInlineContent(t) {
            let e = null;
            if (E(t.src)) e = t.src;
            else if ("string" == typeof t.src) {
                const i = t.src.split("#", 2).pop();
                e = i ? document.getElementById(i) : null
            }
            if (e) {
                if ("clone" === t.type || e.closest(".fancybox__slide")) {
                    e = e.cloneNode(!0);
                    const i = e.dataset.animationName;
                    i && (e.classList.remove(i), delete e.dataset.animationName);
                    let n = e.getAttribute("id");
                    n = n ? `${n}--clone` : `clone-${this.instance.id}-${t.index}`, e.setAttribute("id", n)
                } else if (e.parentNode) {
                    const i = document.createElement("div");
                    i.classList.add("fancybox-placeholder"), e.parentNode.insertBefore(i, e), t.placeholderEl = i
                }
                this.instance.setContent(t, e)
            } else this.instance.setError(t, "{{ELEMENT_NOT_FOUND}}")
        }
        setIframeContent(t) {
            const {
                src: e,
                el: i
            } = t;
            if (!e || "string" != typeof e || !i) return;
            const n = this.instance,
                s = document.createElement("iframe");
            s.className = "fancybox__iframe", s.setAttribute("id", `fancybox__iframe_${n.id}_${t.index}`);
            for (const [e, i] of Object.entries(this.optionFor(t, "iframeAttr") || {})) s.setAttribute(e, i);
            s.onerror = () => {
                n.setError(t, "{{IFRAME_ERROR}}")
            }, t.iframeEl = s;
            const o = this.optionFor(t, "preload");
            if (i.classList.add("is-loading"), "iframe" !== t.type || !1 === o) return s.setAttribute("src", t.src + ""), this.resizeIframe(t), void n.setContent(t, s);
            n.showLoading(t), s.onload = () => {
                if (!s.src.length) return;
                const e = "true" !== s.dataset.ready;
                s.dataset.ready = "true", this.resizeIframe(t), e ? n.revealContent(t) : n.hideLoading(t)
            }, s.setAttribute("src", e), n.setContent(t, s, !1)
        }
        resizeIframe(t) {
            const e = t.iframeEl,
                i = null == e ? void 0 : e.parentElement;
            if (!e || !i) return;
            let n = t.autoSize,
                s = t.width || 0,
                o = t.height || 0;
            s && o && (n = !1);
            const a = i && i.style;
            if (!1 !== t.preload && !1 !== n && a) try {
                const t = window.getComputedStyle(i),
                    n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight),
                    r = parseFloat(t.paddingTop) + parseFloat(t.paddingBottom),
                    l = e.contentWindow;
                if (l) {
                    const t = l.document,
                        e = t.getElementsByTagName("html")[0],
                        i = t.body;
                    a.width = "", i.style.overflow = "hidden", s = s || e.scrollWidth + n, a.width = `${s}px`, i.style.overflow = "", a.flex = "0 0 auto", a.height = `${i.scrollHeight}px`, o = e.scrollHeight + r
                }
            } catch (t) {}
            if (s || o) {
                const t = {
                    flex: "0 1 auto",
                    width: "",
                    height: ""
                };
                s && (t.width = `${s}px`), o && (t.height = `${o}px`), Object.assign(a, t)
            }
        }
        playVideo() {
            const t = this.instance.getSlide();
            if (!t) return;
            const {
                el: e
            } = t;
            if (!e || !e.offsetParent) return;
            if (!this.optionFor(t, "videoAutoplay")) return;
            if ("html5video" === t.type) try {
                const t = e.querySelector("video");
                if (t) {
                    const e = t.play();
                    void 0 !== e && e.then((() => {})).catch((e => {
                        t.muted = !0, t.play()
                    }))
                }
            } catch (t) {}
            if ("youtube" !== t.type && "vimeo" !== t.type) return;
            const i = () => {
                if (t.iframeEl && t.iframeEl.contentWindow) {
                    let e;
                    if ("true" === t.iframeEl.dataset.ready) return e = "youtube" === t.type ? {
                        event: "command",
                        func: "playVideo"
                    } : {
                        method: "play",
                        value: "true"
                    }, e && t.iframeEl.contentWindow.postMessage(JSON.stringify(e), "*"), void(t.poller = void 0);
                    "youtube" === t.type && (e = {
                        event: "listening",
                        id: t.iframeEl.getAttribute("id")
                    }, t.iframeEl.contentWindow.postMessage(JSON.stringify(e), "*"))
                }
                t.poller = setTimeout(i, 250)
            };
            i()
        }
        processType(t) {
            if (t.html) return t.type = "html", t.src = t.html, void(t.html = "");
            const e = this.instance.optionFor(t, "src", "");
            if (!e || "string" != typeof e) return;
            let i = t.type,
                n = null;
            if (n = e.match(/(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i)) {
                const s = this.optionFor(t, "youtube"),
                    {
                        nocookie: o
                    } = s,
                    a = function (t, e) {
                        var i = {};
                        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (i[n] = t[n]);
                        if (null != t && "function" == typeof Object.getOwnPropertySymbols) {
                            var s = 0;
                            for (n = Object.getOwnPropertySymbols(t); s < n.length; s++) e.indexOf(n[s]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[s]) && (i[n[s]] = t[n[s]])
                        }
                        return i
                    }(s, ["nocookie"]),
                    r = `www.youtube${o?"-nocookie":""}.com`,
                    l = lt(e, a),
                    c = encodeURIComponent(n[2]);
                t.videoId = c, t.src = `https://${r}/embed/${c}?${l}`, t.thumbSrc = t.thumbSrc || `https://i.ytimg.com/vi/${c}/mqdefault.jpg`, i = "youtube"
            } else if (n = e.match(/^.+vimeo.com\/(?:\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/)) {
                const s = lt(e, this.optionFor(t, "vimeo")),
                    o = encodeURIComponent(n[1]),
                    a = n[4] || "";
                t.videoId = o, t.src = `https://player.vimeo.com/video/${o}?${a?`h=${a}${s?"&":""}`:""}${s}`, i = "vimeo"
            }
            if (!i && t.triggerEl) {
                const e = t.triggerEl.dataset.type;
                ht.includes(e) && (i = e)
            }
            i || "string" == typeof e && ("#" === e.charAt(0) ? i = "inline" : (n = e.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i)) ? (i = "html5video", t.videoFormat = t.videoFormat || "video/" + ("ogv" === n[1] ? "ogg" : n[1])) : e.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i) ? i = "image" : e.match(/\.(pdf)((\?|#).*)?$/i) ? i = "pdf" : (n = e.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i)) ? (t.src = `https://maps.google.${n[1]}/?ll=${(n[2]?n[2]+"&z="+Math.floor(parseFloat(n[3]))+(n[4]?n[4].replace(/^\//,"&"):""):n[4]+"").replace(/\?/,"&")}&output=${n[4]&&n[4].indexOf("layer=c")>0?"svembed":"embed"}`, i = "map") : (n = e.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i)) && (t.src = `https://maps.google.${n[1]}/maps?q=${n[2].replace("query=","q=").replace("api=1","")}&output=embed`, i = "map")), i = i || this.instance.option("defaultType"), t.type = i, "image" === i && (t.thumbSrc = t.thumbSrc || t.src)
        }
        setContent(t) {
            const e = this.instance.optionFor(t, "src") || "";
            if (t && t.type && e) {
                switch (t.type) {
                    case "html":
                        this.instance.setContent(t, e);
                        break;
                    case "html5video":
                        const i = this.option("videoTpl");
                        i && this.instance.setContent(t, i.replace(/\{\{src\}\}/gi, e + "").replace(/\{\{format\}\}/gi, this.optionFor(t, "videoFormat") || "").replace(/\{\{poster\}\}/gi, t.poster || t.thumbSrc || ""));
                        break;
                    case "inline":
                    case "clone":
                        this.setInlineContent(t);
                        break;
                    case "ajax":
                        this.loadAjaxContent(t);
                        break;
                    case "pdf":
                    case "map":
                    case "youtube":
                    case "vimeo":
                        t.preload = !1;
                    case "iframe":
                        this.setIframeContent(t)
                }
                this.setAspectRatio(t)
            }
        }
        setAspectRatio(t) {
            var e;
            const i = t.contentEl,
                n = this.optionFor(t, "videoRatio"),
                s = null === (e = t.el) || void 0 === e ? void 0 : e.getBoundingClientRect();
            if (!(i && s && n && 1 !== n && t.type && ["video", "youtube", "vimeo", "html5video"].includes(t.type))) return;
            const o = s.width,
                a = s.height;
            i.style.aspectRatio = n + "", i.style.width = o / a > n ? "auto" : "", i.style.height = o / a > n ? "" : "auto"
        }
        attach() {
            const t = this.instance;
            t.on("Carousel.initSlide", this.onInitSlide), t.on("Carousel.createSlide", this.onCreateSlide), t.on("Carousel.removeSlide", this.onRemoveSlide), t.on("Carousel.selectSlide", this.onSelectSlide), t.on("Carousel.unselectSlide", this.onUnselectSlide), t.on("Carousel.Panzoom.refresh", this.onRefresh), t.on("done", this.onDone), window.addEventListener("message", this.onMessage)
        }
        detach() {
            const t = this.instance;
            t.off("Carousel.initSlide", this.onInitSlide), t.off("Carousel.createSlide", this.onCreateSlide), t.off("Carousel.removeSlide", this.onRemoveSlide), t.off("Carousel.selectSlide", this.onSelectSlide), t.off("Carousel.unselectSlide", this.onUnselectSlide), t.off("Carousel.Panzoom.refresh", this.onRefresh), t.off("done", this.onDone), window.removeEventListener("message", this.onMessage)
        }
    }
    Object.defineProperty(dt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: ct
    });
    class ut extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: "ready"
            }), Object.defineProperty(this, "inHover", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "timer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "progressBar", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        get isActive() {
            return "ready" !== this.state
        }
        onReady(t) {
            this.option("autoStart") && (t.isInfinite || t.page < t.pages.length - 1) && this.start()
        }
        onChange() {
            var t;
            (null === (t = this.instance.panzoom) || void 0 === t ? void 0 : t.isResting) || (this.removeProgressBar(), this.pause())
        }
        onSettle() {
            this.resume()
        }
        onVisibilityChange() {
            "visible" === document.visibilityState ? this.resume() : this.pause()
        }
        onMouseEnter() {
            this.inHover = !0, this.pause()
        }
        onMouseLeave() {
            var t;
            this.inHover = !1, (null === (t = this.instance.panzoom) || void 0 === t ? void 0 : t.isResting) && this.resume()
        }
        onTimerEnd() {
            "play" === this.state && (this.instance.isInfinite || this.instance.page !== this.instance.pages.length - 1 ? this.instance.slideNext() : this.instance.slideTo(0))
        }
        removeProgressBar() {
            this.progressBar && (this.progressBar.remove(), this.progressBar = null)
        }
        createProgressBar() {
            var t;
            if (!this.option("showProgress")) return null;
            this.removeProgressBar();
            const e = this.instance,
                i = (null === (t = e.pages[e.page]) || void 0 === t ? void 0 : t.slides) || [];
            let n = this.option("progressParentEl");
            if (n || (n = (1 === i.length ? i[0].el : null) || e.viewport), !n) return null;
            const s = document.createElement("div");
            return P(s, "f-progress"), n.prepend(s), this.progressBar = s, s.offsetHeight, s
        }
        set() {
            if (this.instance.pages.length < 2) return;
            if (this.progressBar) return;
            const t = this.option("timeout");
            this.state = "play", P(this.instance.container, "has-autoplay");
            let e = this.createProgressBar();
            e && (e.style.transitionDuration = `${t}ms`, e.style.transform = "scaleX(1)"), this.timer = setTimeout((() => {
                this.timer = null, this.inHover || this.onTimerEnd()
            }), t), this.emit("set")
        }
        clear() {
            this.timer && (clearTimeout(this.timer), this.timer = null), this.removeProgressBar()
        }
        start() {
            if (this.set(), this.option("pauseOnHover")) {
                const t = this.instance.container;
                t.addEventListener("mouseenter", this.onMouseEnter, !1), t.addEventListener("mouseleave", this.onMouseLeave, !1)
            }
            document.addEventListener("visibilitychange", this.onVisibilityChange, !1)
        }
        stop() {
            const t = this.instance.container;
            this.clear(), this.state = "ready", t.removeEventListener("mouseenter", this.onMouseEnter, !1), t.removeEventListener("mouseleave", this.onMouseLeave, !1), document.removeEventListener("visibilitychange", this.onVisibilityChange, !1), S(t, "has-autoplay"), this.emit("stop")
        }
        pause() {
            "play" === this.state && (this.state = "pause", this.clear(), this.emit("pause"))
        }
        resume() {
            const t = this.instance;
            if (t.isInfinite || t.page !== t.pages.length - 1)
                if ("play" !== this.state) {
                    if ("pause" === this.state && !this.inHover) {
                        const t = new Event("resume", {
                            bubbles: !0,
                            cancelable: !0
                        });
                        this.emit("resume", event), t.defaultPrevented || this.set()
                    }
                } else this.set();
            else this.stop()
        }
        toggle() {
            "play" === this.state || "pause" === this.state ? this.stop() : this.set()
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("ready", t.onReady), e.on("Panzoom.startAnimation", t.onChange), e.on("Panzoom.endAnimation", t.onSettle), e.on("Panzoom.touchMove", t.onChange)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("ready", t.onReady), e.off("Panzoom.startAnimation", t.onChange), e.off("Panzoom.endAnimation", t.onSettle), e.off("Panzoom.touchMove", t.onChange), t.stop()
        }
    }
    Object.defineProperty(ut, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            autoStart: !0,
            pauseOnHover: !0,
            progressParentEl: null,
            showProgress: !0,
            timeout: 3e3
        }
    });
    class pt extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "ref", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onPrepare(t) {
            const e = t.carousel;
            if (!e) return;
            const i = t.container;
            i && (e.options.Autoplay = p({
                autoStart: !1
            }, this.option("Autoplay") || {}, {
                pauseOnHover: !1,
                timeout: this.option("timeout"),
                progressParentEl: () => this.option("progressParentEl") || null,
                on: {
                    set: e => {
                        var n;
                        i.classList.add("has-slideshow"), (null === (n = t.getSlide()) || void 0 === n ? void 0 : n.state) !== nt.Ready && e.pause()
                    },
                    stop: () => {
                        i.classList.remove("has-slideshow"), t.isCompact || t.endIdle()
                    },
                    resume: (e, i) => {
                        var n, s, o;
                        !i || !i.cancelable || (null === (n = t.getSlide()) || void 0 === n ? void 0 : n.state) === nt.Ready && (null === (o = null === (s = t.carousel) || void 0 === s ? void 0 : s.panzoom) || void 0 === o ? void 0 : o.isResting) || i.preventDefault()
                    }
                }
            }), e.attachPlugins({
                Autoplay: ut
            }), this.ref = e.plugins.Autoplay)
        }
        onReady(t) {
            const e = t.carousel,
                i = this.ref;
            e && i && this.option("playOnStart") && (e.isInfinite || e.page < e.pages.length - 1) && i.start()
        }
        onDone(t, e) {
            const i = this.ref;
            if (!i) return;
            const n = e.panzoom;
            n && n.on("startAnimation", (() => {
                t.isCurrentSlide(e) && i.stop()
            })), t.isCurrentSlide(e) && i.resume()
        }
        onKeydown(t, e) {
            var i;
            const n = this.ref;
            n && e === this.option("key") && "BUTTON" !== (null === (i = document.activeElement) || void 0 === i ? void 0 : i.nodeName) && n.toggle()
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.init", t.onPrepare), e.on("Carousel.ready", t.onReady), e.on("done", t.onDone), e.on("keydown", t.onKeydown)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.init", t.onPrepare), e.off("Carousel.ready", t.onReady), e.off("done", t.onDone), e.off("keydown", t.onKeydown)
        }
    }
    Object.defineProperty(pt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: {
            key: " ",
            playOnStart: !1,
            progressParentEl: t => {
                var e;
                return (null === (e = t.instance.container) || void 0 === e ? void 0 : e.querySelector(".fancybox__toolbar [data-fancybox-toggle-slideshow]")) || t.instance.container
            },
            timeout: 3e3
        }
    });
    const ft = {
        classes: {
            container: "f-thumbs f-carousel__thumbs",
            viewport: "f-thumbs__viewport",
            track: "f-thumbs__track",
            slide: "f-thumbs__slide",
            isResting: "is-resting",
            isSelected: "is-selected",
            isLoading: "is-loading",
            hasThumbs: "has-thumbs"
        },
        minCount: 2,
        parentEl: null,
        thumbTpl: '<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>',
        type: "modern"
    };
    var mt;
    ! function (t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Hidden = 2] = "Hidden", t[t.Disabled = 3] = "Disabled"
    }(mt || (mt = {}));
    let gt = class extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "type", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: "modern"
            }), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "track", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "carousel", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "panzoom", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "thumbWidth", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbClipWidth", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbHeight", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbGap", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "thumbExtraGap", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "shouldCenter", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !0
            }), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: mt.Init
            })
        }
        formatThumb(t, e) {
            return this.instance.localize(e, [
                ["%i", t.index],
                ["%d", t.index + 1],
                ["%s", t.thumbSrc || "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"]
            ])
        }
        getSlides() {
            const t = [],
                e = this.option("thumbTpl") || "";
            if (e)
                for (const i of this.instance.slides || []) {
                    let n = "";
                    i.type && (n = `for-${i.type}`, i.type && ["video", "youtube", "vimeo", "html5video"].includes(i.type) && (n += " for-video")), t.push({
                        html: this.formatThumb(i, e),
                        customClass: n
                    })
                }
            return t
        }
        onInitSlide(t, e) {
            const i = e.el;
            i && (e.thumbSrc = i.dataset.thumbSrc || e.thumbSrc || "", e.thumbClipWidth = parseFloat(i.dataset.thumbClipWidth || "") || e.thumbClipWidth || 0, e.thumbHeight = parseFloat(i.dataset.thumbHeight || "") || e.thumbHeight || 0)
        }
        onInitSlides() {
            this.state === mt.Init && this.build()
        }
        onRefreshM() {
            this.refreshModern()
        }
        onChangeM() {
            "modern" === this.type && (this.shouldCenter = !0, this.centerModern())
        }
        onClickModern(t) {
            t.preventDefault(), t.stopPropagation();
            const e = this.instance,
                i = e.page,
                n = t => {
                    if (t) {
                        const e = t.closest("[data-carousel-index]");
                        if (e) return parseInt(e.dataset.carouselIndex || "", 10) || 0
                    }
                    return -1
                },
                s = (t, e) => {
                    const i = document.elementFromPoint(t, e);
                    return i ? n(i) : -1
                };
            let o = n(t.target);
            o < 0 && (o = s(t.clientX + this.thumbGap, t.clientY), o === i && (o = i - 1)), o < 0 && (o = s(t.clientX - this.thumbGap, t.clientY), o === i && (o = i + 1)), o < 0 && (o = (e => {
                let n = s(t.clientX - e, t.clientY),
                    a = s(t.clientX + e, t.clientY);
                return o < 0 && n === i && (o = i + 1), o < 0 && a === i && (o = i - 1), o
            })(this.thumbExtraGap)), o === i ? this.centerModern() : o > -1 && o < e.pages.length && e.slideTo(o)
        }
        onTransformM() {
            if ("modern" !== this.type) return;
            const {
                instance: t,
                container: e,
                track: i
            } = this, n = t.panzoom;
            if (!(e && i && n && this.panzoom)) return;
            a(e, this.cn("isResting"), n.state !== b.Init && n.isResting);
            const s = this.thumbGap,
                o = this.thumbExtraGap,
                r = this.thumbClipWidth;
            let l = 0,
                c = 0,
                h = 0;
            for (const e of t.slides) {
                let i = e.index,
                    n = e.thumbSlideEl;
                if (!n) continue;
                a(n, this.cn("isSelected"), i === t.page), c = 1 - Math.abs(t.getProgress(i)), n.style.setProperty("--progress", c ? c + "" : "");
                const d = .5 * ((e.thumbWidth || 0) - r);
                l += s, l += d, c && (l -= c * (d + o)), n.style.setProperty("--shift", l - s + ""), l += d, c && (l -= c * (d + o)), l -= s, 0 === i && (h = o * c)
            }
            i && (i.style.setProperty("--left", h + ""), i.style.setProperty("--width", l + h + s + o * c + "")), this.shouldCenter && this.centerModern()
        }
        buildClassic() {
            const {
                container: t,
                track: e
            } = this, i = this.getSlides();
            if (!t || !e || !i) return;
            const n = new this.instance.constructor(t, p({
                track: e,
                infinite: !1,
                center: !0,
                fill: !0,
                dragFree: !0,
                slidesPerPage: 1,
                transition: !1,
                Dots: !1,
                Navigation: !1,
                Sync: {},
                classes: {
                    container: "f-thumbs",
                    viewport: "f-thumbs__viewport",
                    track: "f-thumbs__track",
                    slide: "f-thumbs__slide"
                }
            }, this.option("Carousel") || {}, {
                Sync: {
                    target: this.instance
                },
                slides: i
            }));
            this.carousel = n, this.track = e, n.on("ready", (() => {
                this.emit("ready")
            }))
        }
        buildModern() {
            if ("modern" !== this.type) return;
            const {
                container: t,
                track: e,
                instance: i
            } = this, n = this.option("thumbTpl") || "";
            if (!t || !e || !n) return;
            P(t, "is-horizontal"), this.updateModern();
            for (const t of i.slides || []) {
                const i = document.createElement("div");
                if (P(i, this.cn("slide")), t.type) {
                    let e = `for-${t.type}`;
                    ["video", "youtube", "vimeo", "html5video"].includes(t.type) && (e += " for-video"), P(i, e)
                }
                i.appendChild(s(this.formatThumb(t, n))), t.thumbSlideEl = i, e.appendChild(i), this.resizeModernSlide(t)
            }
            const o = new i.constructor.Panzoom(t, {
                content: e,
                lockAxis: "x",
                zoom: !1,
                panOnlyZoomed: !1,
                bounds: () => {
                    let t = 0,
                        e = 0,
                        n = i.slides[0],
                        s = i.slides[i.slides.length - 1],
                        o = i.slides[i.page];
                    return n && s && o && (e = -1 * this.getModernThumbPos(0), 0 !== i.page && (e += .5 * (n.thumbWidth || 0)), t = -1 * this.getModernThumbPos(i.slides.length - 1), i.page !== i.slides.length - 1 && (t += (s.thumbWidth || 0) - (o.thumbWidth || 0) - .5 * (s.thumbWidth || 0))), {
                        x: {
                            min: t,
                            max: e
                        },
                        y: {
                            min: 0,
                            max: 0
                        }
                    }
                }
            });
            o.on("touchStart", ((t, e) => {
                this.shouldCenter = !1
            })), o.on("click", ((t, e) => this.onClickModern(e))), o.on("ready", (() => {
                this.centerModern(), this.emit("ready")
            })), o.on(["afterTransform", "refresh"], (t => {
                this.lazyLoadModern()
            })), this.panzoom = o, this.refreshModern()
        }
        updateModern() {
            if ("modern" !== this.type) return;
            const {
                container: t
            } = this;
            t && (this.thumbGap = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-gap")) || 0, this.thumbExtraGap = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-extra-gap")) || 0, this.thumbWidth = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-width")) || 40, this.thumbClipWidth = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-clip-width")) || 40, this.thumbHeight = parseFloat(getComputedStyle(t).getPropertyValue("--f-thumb-height")) || 40)
        }
        refreshModern() {
            var t;
            if ("modern" === this.type) {
                this.updateModern();
                for (const t of this.instance.slides || []) this.resizeModernSlide(t);
                this.onTransformM(), null === (t = this.panzoom) || void 0 === t || t.updateMetrics(!0), this.centerModern(0)
            }
        }
        centerModern(t) {
            const i = this.instance,
                {
                    container: n,
                    panzoom: s
                } = this;
            if (!n || !s || s.state === b.Init) return;
            const o = i.page;
            let a = this.getModernThumbPos(o),
                r = a;
            for (let t = i.page - 3; t < i.page + 3; t++) {
                if (t < 0 || t > i.pages.length - 1 || t === i.page) continue;
                const e = 1 - Math.abs(i.getProgress(t));
                e > 0 && e < 1 && (r += e * (this.getModernThumbPos(t) - a))
            }
            let l = 100;
            void 0 === t && (t = .2, i.inTransition.size > 0 && (t = .12), Math.abs(-1 * s.current.e - r) > s.containerRect.width && (t = .5, l = 0)), s.options.maxVelocity = l, s.applyChange({
                panX: e(-1 * r - s.target.e, 1e3),
                friction: null === i.prevPage ? 0 : t
            })
        }
        lazyLoadModern() {
            const {
                instance: t,
                panzoom: e
            } = this;
            if (!e) return;
            const i = -1 * e.current.e || 0;
            let n = this.getModernThumbPos(t.page);
            if (e.state !== b.Init || 0 === n)
                for (const n of t.slides || []) {
                    const t = n.thumbSlideEl;
                    if (!t) continue;
                    const o = t.querySelector("img[data-lazy-src]"),
                        a = n.index,
                        r = this.getModernThumbPos(a),
                        l = i - .5 * e.containerRect.innerWidth,
                        c = l + e.containerRect.innerWidth;
                    if (!o || r < l || r > c) continue;
                    let h = o.dataset.lazySrc;
                    if (!h || !h.length) continue;
                    if (delete o.dataset.lazySrc, o.src = h, o.complete) continue;
                    P(t, this.cn("isLoading"));
                    const d = s(x);
                    t.appendChild(d), o.addEventListener("load", (() => {
                        t.offsetParent && (t.classList.remove(this.cn("isLoading")), d.remove())
                    }), !1)
                }
        }
        resizeModernSlide(t) {
            if ("modern" !== this.type) return;
            if (!t.thumbSlideEl) return;
            const e = t.thumbClipWidth && t.thumbHeight ? Math.round(this.thumbHeight * (t.thumbClipWidth / t.thumbHeight)) : this.thumbWidth;
            t.thumbWidth = e
        }
        getModernThumbPos(t) {
            const i = this.instance.slides[t],
                n = this.panzoom;
            if (!n || !n.contentRect.fitWidth) return 0;
            let s = n.containerRect.innerWidth,
                o = n.contentRect.width;
            2 === this.instance.slides.length && (t -= 1, o = 2 * this.thumbClipWidth);
            let a = t * (this.thumbClipWidth + this.thumbGap) + this.thumbExtraGap + .5 * (i.thumbWidth || 0);
            return a -= o > s ? .5 * s : .5 * o, e(a || 0, 1)
        }
        build() {
            const t = this.instance,
                e = t.container,
                i = this.option("minCount") || 0;
            if (i) {
                let e = 0;
                for (const i of t.slides || []) i.thumbSrc && e++;
                if (e < i) return this.cleanup(), void(this.state = mt.Disabled)
            }
            const n = this.option("type");
            if (["modern", "classic"].indexOf(n) < 0) return void(this.state = mt.Disabled);
            this.type = n;
            const s = document.createElement("div");
            P(s, this.cn("container")), P(s, `is-${n}`);
            const o = this.option("parentEl");
            o ? o.appendChild(s) : e.after(s), this.container = s, P(e, this.cn("hasThumbs"));
            const a = document.createElement("div");
            P(a, this.cn("track")), s.appendChild(a), this.track = a, "classic" === n ? this.buildClassic() : this.buildModern(), this.state = mt.Ready, s.addEventListener("click", (e => {
                setTimeout((() => {
                    var e;
                    null === (e = null == s ? void 0 : s.querySelector(`[data-carousel-index="${t.page}"]`)) || void 0 === e || e.focus()
                }), 100)
            }))
        }
        cleanup() {
            this.carousel && this.carousel.destroy(), this.carousel = null, this.panzoom && this.panzoom.destroy(), this.panzoom = null, this.container && this.container.remove(), this.container = null, this.track = null, this.state = mt.Init, S(this.instance.container, this.cn("hasThumbs"))
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("initSlide", t.onInitSlide), e.state === j.Init ? e.on("initSlides", t.onInitSlides) : t.onInitSlides(), e.on("Panzoom.afterTransform", t.onTransformM), e.on("Panzoom.refresh", t.onRefreshM), e.on("change", t.onChangeM)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("initSlide", t.onInitSlide), e.off("initSlides", t.onInitSlides), e.off("Panzoom.afterTransform", t.onTransformM), e.off("Panzoom.refresh", t.onRefreshM), e.off("change", t.onChangeM), t.cleanup()
        }
    };
    Object.defineProperty(gt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: ft
    });
    const bt = Object.assign(Object.assign({}, ft), {
        key: "t",
        showOnStart: !0,
        parentEl: null
    });
    class vt extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "ref", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "hidden", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            })
        }
        get isEnabled() {
            const t = this.ref;
            return t && t.state !== mt.Disabled
        }
        get isHidden() {
            return this.hidden
        }
        onInit() {
            const t = this.instance,
                e = t.carousel;
            if (this.ref || !e) return;
            const i = this.option("parentEl") || t.footer || t.container;
            i && (e.options.Thumbs = p({}, this.options, {
                parentEl: i,
                classes: {
                    container: "f-thumbs fancybox__thumbs"
                },
                Carousel: {
                    Sync: {
                        friction: t.option("Carousel.friction")
                    },
                    on: {
                        click: (t, e) => {
                            e.stopPropagation()
                        }
                    }
                },
                on: {
                    ready: t => {
                        const e = t.container;
                        e && this.hidden && (this.refresh(), e.style.transition = "none", this.hide(), e.offsetHeight, queueMicrotask((() => {
                            e.style.transition = "", this.show()
                        })))
                    }
                }
            }), e.attachPlugins({
                Thumbs: gt
            }), this.ref = e.plugins.Thumbs, this.option("showOnStart") || (this.ref.state = mt.Hidden, this.hidden = !0))
        }
        onResize() {
            var t;
            const e = null === (t = this.ref) || void 0 === t ? void 0 : t.container;
            e && (e.style.maxHeight = "")
        }
        onKeydown(t, e) {
            const i = this.option("key");
            i && i === e && this.toggle()
        }
        toggle() {
            const t = this.ref;
            t && t.state !== mt.Disabled && (t.state !== mt.Hidden ? this.hidden ? this.show() : this.hide() : t.build())
        }
        show() {
            const t = this.ref,
                e = t && t.state !== mt.Disabled && t.container;
            e && (this.refresh(), e.offsetHeight, e.removeAttribute("aria-hidden"), e.classList.remove("is-hidden"), this.hidden = !1)
        }
        hide() {
            const t = this.ref,
                e = t && t.container;
            e && (this.refresh(), e.offsetHeight, e.classList.add("is-hidden"), e.setAttribute("aria-hidden", "true")), this.hidden = !0
        }
        refresh() {
            const t = this.ref;
            if (!t || t.state === mt.Disabled) return;
            const e = t.container,
                i = (null == e ? void 0 : e.firstChild) || null;
            e && i && i.childNodes.length && (e.style.maxHeight = `${i.getBoundingClientRect().height}px`)
        }
        attach() {
            const t = this,
                e = t.instance;
            e.state === it.Init ? e.on("Carousel.init", t.onInit) : t.onInit(), e.on("resize", t.onResize), e.on("keydown", t.onKeydown)
        }
        detach() {
            var t;
            const e = this,
                i = e.instance;
            i.off("Carousel.init", e.onInit), i.off("resize", e.onResize), i.off("keydown", e.onKeydown), null === (t = i.carousel) || void 0 === t || t.detachPlugins(["Thumbs"]), e.ref = null
        }
    }
    Object.defineProperty(vt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: bt
    });
    const yt = {
        panLeft: {
            icon: '<svg><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg>',
            change: {
                panX: -100
            }
        },
        panRight: {
            icon: '<svg><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>',
            change: {
                panX: 100
            }
        },
        panUp: {
            icon: '<svg><path d="M12 5v14M18 11l-6-6M6 11l6-6"/></svg>',
            change: {
                panY: -100
            }
        },
        panDown: {
            icon: '<svg><path d="M12 5v14M18 13l-6 6M6 13l6 6"/></svg>',
            change: {
                panY: 100
            }
        },
        zoomIn: {
            icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>',
            action: "zoomIn"
        },
        zoomOut: {
            icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
            action: "zoomOut"
        },
        toggle1to1: {
            icon: '<svg><path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/></svg>',
            action: "toggleZoom"
        },
        toggleZoom: {
            icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
            action: "toggleZoom"
        },
        iterateZoom: {
            icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
            action: "iterateZoom"
        },
        rotateCCW: {
            icon: '<svg><path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/></svg>',
            action: "rotateCCW"
        },
        rotateCW: {
            icon: '<svg><path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/></svg>',
            action: "rotateCW"
        },
        flipX: {
            icon: '<svg style="stroke-width: 1.3"><path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/></svg>',
            action: "flipX"
        },
        flipY: {
            icon: '<svg style="stroke-width: 1.3"><path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/></svg>',
            action: "flipY"
        },
        fitX: {
            icon: '<svg><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M10 18H3M21 18h-7M6 15l-3 3 3 3M18 15l3 3-3 3"/></svg>',
            action: "fitX"
        },
        fitY: {
            icon: '<svg><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M18 14v7M18 3v7M15 18l3 3 3-3M15 6l3-3 3 3"/></svg>',
            action: "fitY"
        },
        reset: {
            icon: '<svg><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>',
            action: "reset"
        },
        toggleFS: {
            icon: '<svg><g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g></svg>',
            action: "toggleFS"
        }
    };
    var wt;
    ! function (t) {
        t[t.Init = 0] = "Init", t[t.Ready = 1] = "Ready", t[t.Disabled = 2] = "Disabled"
    }(wt || (wt = {}));
    const xt = {
            absolute: "auto",
            display: {
                left: ["infobar"],
                middle: [],
                right: ["iterateZoom", "slideshow", "fullscreen", "thumbs", "close"]
            },
            enabled: "auto",
            items: {
                infobar: {
                    tpl: '<div class="fancybox__infobar" tabindex="-1"><span data-fancybox-current-index></span>/<span data-fancybox-count></span></div>'
                },
                download: {
                    tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>'
                },
                prev: {
                    tpl: '<button class="f-button" title="{{PREV}}" data-fancybox-prev><svg><path d="m15 6-6 6 6 6"/></svg></button>'
                },
                next: {
                    tpl: '<button class="f-button" title="{{NEXT}}" data-fancybox-next><svg><path d="m9 6 6 6-6 6"/></svg></button>'
                },
                slideshow: {
                    tpl: '<button class="f-button" title="{{TOGGLE_SLIDESHOW}}" data-fancybox-toggle-slideshow><svg><g><path d="M8 4v16l13 -8z"></path></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>'
                },
                fullscreen: {
                    tpl: '<button class="f-button" title="{{TOGGLE_FULLSCREEN}}" data-fancybox-toggle-fullscreen><svg><g><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>'
                },
                thumbs: {
                    tpl: '<button class="f-button" title="{{TOGGLE_THUMBS}}" data-fancybox-toggle-thumbs><svg><circle cx="5.5" cy="5.5" r="1"/><circle cx="12" cy="5.5" r="1"/><circle cx="18.5" cy="5.5" r="1"/><circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/><circle cx="5.5" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="18.5" cy="18.5" r="1"/></svg></button>'
                },
                close: {
                    tpl: '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg><path d="m19.5 4.5-15 15M4.5 4.5l15 15"/></svg></button>'
                }
            },
            parentEl: null
        },
        Et = {
            tabindex: "-1",
            width: "24",
            height: "24",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg"
        };
    class St extends N {
        constructor() {
            super(...arguments), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: wt.Init
            }), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            })
        }
        onReady(t) {
            var e;
            if (!t.carousel) return;
            let i = this.option("display"),
                n = this.option("absolute"),
                s = this.option("enabled");
            if ("auto" === s) {
                const t = this.instance.carousel;
                let e = 0;
                if (t)
                    for (const i of t.slides)(i.panzoom || "image" === i.type) && e++;
                e || (s = !1)
            }
            s || (i = void 0);
            let o = 0;
            const a = {
                left: [],
                middle: [],
                right: []
            };
            if (i)
                for (const t of ["left", "middle", "right"])
                    for (const n of i[t]) {
                        const i = this.createEl(n);
                        i && (null === (e = a[t]) || void 0 === e || e.push(i), o++)
                    }
            let r = null;
            if (o && (r = this.createContainer()), r) {
                for (const [t, e] of Object.entries(a)) {
                    const i = document.createElement("div");
                    P(i, "fancybox__toolbar__column is-" + t);
                    for (const t of e) i.appendChild(t);
                    "auto" !== n || "middle" !== t || e.length || (n = !0), r.appendChild(i)
                }!0 === n && P(r, "is-absolute"), this.state = wt.Ready, this.onRefresh()
            } else this.state = wt.Disabled
        }
        onClick(t) {
            var e, i;
            const n = this.instance,
                s = n.getSlide(),
                o = null == s ? void 0 : s.panzoom,
                a = t.target,
                r = a && E(a) ? a.dataset : null;
            if (!r) return;
            if (void 0 !== r.fancyboxToggleThumbs) return t.preventDefault(), t.stopPropagation(), void(null === (e = n.plugins.Thumbs) || void 0 === e || e.toggle());
            if (void 0 !== r.fancyboxToggleFullscreen) return t.preventDefault(), t.stopPropagation(), void this.instance.toggleFullscreen();
            if (void 0 !== r.fancyboxToggleSlideshow) {
                t.preventDefault(), t.stopPropagation();
                const e = null === (i = n.carousel) || void 0 === i ? void 0 : i.plugins.Autoplay;
                let s = e.isActive;
                return o && "mousemove" === o.panMode && !s && o.reset(), void(s ? e.stop() : e.start())
            }
            const l = r.panzoomAction,
                c = r.panzoomChange;
            if ((c || l) && (t.preventDefault(), t.stopPropagation()), c) {
                let t = {};
                try {
                    t = JSON.parse(c)
                } catch (t) {}
                o && o.applyChange(t)
            } else l && o && o[l] && o[l]()
        }
        onChange() {
            this.onRefresh()
        }
        onRefresh() {
            if (this.instance.isClosing()) return;
            const t = this.container;
            if (!t) return;
            const e = this.instance.getSlide();
            if (!e || e.state !== nt.Ready) return;
            const i = e && !e.error && e.panzoom;
            for (const e of t.querySelectorAll("[data-panzoom-action]")) i ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
            let n = i && i.canZoomIn(),
                s = i && i.canZoomOut();
            for (const e of t.querySelectorAll('[data-panzoom-action="zoomIn"]')) n ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
            for (const e of t.querySelectorAll('[data-panzoom-action="zoomOut"]')) s ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
            for (const e of t.querySelectorAll('[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]')) {
                s || n ? (e.removeAttribute("disabled"), e.removeAttribute("tabindex")) : (e.setAttribute("disabled", ""), e.setAttribute("tabindex", "-1"));
                const t = e.querySelector("g");
                t && (t.style.display = n ? "" : "none")
            }
        }
        onDone(t, e) {
            var i;
            null === (i = e.panzoom) || void 0 === i || i.on("afterTransform", (() => {
                this.instance.isCurrentSlide(e) && this.onRefresh()
            })), this.instance.isCurrentSlide(e) && this.onRefresh()
        }
        createContainer() {
            const t = this.instance.container;
            if (!t) return null;
            const e = this.option("parentEl") || t,
                i = document.createElement("div");
            return P(i, "fancybox__toolbar"), e.prepend(i), i.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !0
            }), t && P(t, "has-toolbar"), this.container = i, i
        }
        createEl(t) {
            var e;
            const i = this.instance.carousel;
            if (!i) return null;
            if ("toggleFS" === t) return null;
            if ("fullscreen" === t && !this.instance.fsAPI) return null;
            let n = null;
            const o = i.slides.length || 0;
            let a = 0,
                r = 0;
            for (const t of i.slides)(t.panzoom || "image" === t.type) && a++, ("image" === t.type || t.downloadSrc) && r++;
            if (o < 2 && ["infobar", "prev", "next"].includes(t)) return n;
            if (void 0 !== yt[t] && !a) return null;
            if ("download" === t && !r) return null;
            if ("thumbs" === t) {
                const t = this.instance.plugins.Thumbs;
                if (!t || !t.isEnabled) return null
            }
            if ("slideshow" === t) {
                if (!(null === (e = this.instance.carousel) || void 0 === e ? void 0 : e.plugins.Autoplay) || o < 2) return null
            }
            if (void 0 !== yt[t]) {
                const e = yt[t];
                n = document.createElement("button"), n.setAttribute("title", this.instance.localize(`{{${t.toUpperCase()}}}`)), P(n, "f-button"), e.action && (n.dataset.panzoomAction = e.action), e.change && (n.dataset.panzoomChange = JSON.stringify(e.change)), n.appendChild(s(this.instance.localize(e.icon)))
            } else {
                const e = (this.option("items") || [])[t];
                e && (n = s(this.instance.localize(e.tpl)), "function" == typeof e.click && n.addEventListener("click", (t => {
                    t.preventDefault(), t.stopPropagation(), "function" == typeof e.click && e.click.call(this, this, t)
                })))
            }
            const l = null == n ? void 0 : n.querySelector("svg");
            if (l)
                for (const [t, e] of Object.entries(Et)) l.getAttribute(t) || l.setAttribute(t, String(e));
            return n
        }
        removeContainer() {
            const t = this.container;
            t && t.remove(), this.container = null, this.state = wt.Disabled;
            const e = this.instance.container;
            e && S(e, "has-toolbar")
        }
        attach() {
            const t = this,
                e = t.instance;
            e.on("Carousel.initSlides", t.onReady), e.on("done", t.onDone), e.on("reveal", t.onChange), e.on("Carousel.change", t.onChange), t.onReady(t.instance)
        }
        detach() {
            const t = this,
                e = t.instance;
            e.off("Carousel.initSlides", t.onReady), e.off("done", t.onDone), e.off("reveal", t.onChange), e.off("Carousel.change", t.onChange), t.removeContainer()
        }
    }
    Object.defineProperty(St, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: xt
    });
    const Pt = {
            Hash: ot,
            Html: dt,
            Images: rt,
            Slideshow: pt,
            Thumbs: vt,
            Toolbar: St
        },
        Ct = "with-fancybox",
        Mt = "hide-scrollbar",
        Tt = "--fancybox-scrollbar-compensate",
        Ot = "--fancybox-body-margin",
        At = "is-animated",
        zt = "is-compact",
        Lt = "is-loading",
        Rt = function () {
            var t = window.getSelection();
            return t && "Range" === t.type
        };
    let kt = null,
        It = null;
    const Dt = new Map;
    let Ft = 0;
    class jt extends g {
        get isIdle() {
            return this.idle
        }
        get isCompact() {
            return this.option("compact")
        }
        constructor(t = [], e = {}, i = {}) {
            super(e), Object.defineProperty(this, "userSlides", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: []
            }), Object.defineProperty(this, "userPlugins", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: {}
            }), Object.defineProperty(this, "idle", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "idleTimer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "clickTimer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "pwt", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "ignoreFocusChange", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: !1
            }), Object.defineProperty(this, "state", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: it.Init
            }), Object.defineProperty(this, "id", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: 0
            }), Object.defineProperty(this, "container", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "footer", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "caption", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "carousel", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "lastFocus", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: null
            }), Object.defineProperty(this, "prevMouseMoveEvent", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), Object.defineProperty(this, "fsAPI", {
                enumerable: !0,
                configurable: !0,
                writable: !0,
                value: void 0
            }), this.fsAPI = (() => {
                let t, e = "",
                    i = "",
                    n = "";
                return document.fullscreenEnabled ? (e = "requestFullscreen", i = "exitFullscreen", n = "fullscreenElement") : document.webkitFullscreenEnabled && (e = "webkitRequestFullscreen", i = "webkitExitFullscreen", n = "webkitFullscreenElement"), e && (t = {
                    request: function (t) {
                        return "webkitRequestFullscreen" === e ? t[e](Element.ALLOW_KEYBOARD_INPUT) : t[e]()
                    },
                    exit: function () {
                        return document[n] && document[i]()
                    },
                    isFullscreen: function () {
                        return document[n]
                    }
                }), t
            })(), this.id = e.id || ++Ft, Dt.set(this.id, this), this.userSlides = t, this.userPlugins = i, queueMicrotask((() => {
                this.init()
            }))
        }
        init() {
            if (this.state === it.Destroy) return;
            this.state = it.Init, this.attachPlugins(Object.assign(Object.assign({}, jt.Plugins), this.userPlugins)), this.emit("init"), !0 === this.option("hideScrollbar") && (() => {
                if (!K) return;
                const t = document.body;
                if (t.classList.contains(Mt)) return;
                let e = window.innerWidth - document.documentElement.getBoundingClientRect().width;
                e < 0 && (e = 0);
                const i = t.currentStyle || window.getComputedStyle(t),
                    n = parseFloat(i.marginRight);
                document.documentElement.style.setProperty(Tt, `${e}px`), n && t.style.setProperty(Ot, `${n}px`), t.classList.add(Mt)
            })(), this.initLayout(), this.scale();
            const t = () => {
                    this.initCarousel(this.userSlides), this.state = it.Ready, this.attachEvents(), this.emit("ready"), setTimeout((() => {
                        this.container && this.container.setAttribute("aria-hidden", "false")
                    }), 16)
                },
                e = this.fsAPI;
            this.option("Fullscreen.autoStart") && e && !e.isFullscreen() ? e.request(this.container).then((() => t())).catch((() => t())) : t()
        }
        initLayout() {
            var t, e;
            const i = this.option("parentEl") || document.body,
                n = s(this.localize(this.option("tpl.main") || ""));
            n && (n.setAttribute("id", `fancybox-${this.id}`), n.setAttribute("aria-label", this.localize("{{MODAL}}")), n.classList.toggle(zt, this.isCompact), P(n, this.option("mainClass") || ""), this.container = n, this.footer = n.querySelector(".fancybox__footer"), i.appendChild(n), P(document.documentElement, Ct), kt && It || (kt = document.createElement("span"), P(kt, "fancybox-focus-guard"), kt.setAttribute("tabindex", "0"), kt.setAttribute("aria-hidden", "true"), kt.setAttribute("aria-label", "Focus guard"), It = kt.cloneNode(), null === (t = n.parentElement) || void 0 === t || t.insertBefore(kt, n), null === (e = n.parentElement) || void 0 === e || e.append(It)), this.option("animated") && (P(n, At), setTimeout((() => {
                this.isClosing() || S(n, At)
            }), 350)), this.emit("initLayout"))
        }
        initCarousel(t) {
            const e = this.container;
            if (!e) return;
            const n = e.querySelector(".fancybox__carousel");
            if (!n) return;
            const s = this.carousel = new G(n, p({}, {
                slides: t,
                transition: "fade",
                Panzoom: {
                    lockAxis: this.option("dragToClose") ? "xy" : "x",
                    infinite: !!this.option("dragToClose") && "y"
                },
                Dots: !1,
                Navigation: {
                    classes: {
                        container: "fancybox__nav",
                        button: "f-button",
                        isNext: "is-next",
                        isPrev: "is-prev"
                    }
                },
                initialPage: this.option("startIndex"),
                l10n: this.option("l10n")
            }, this.option("Carousel") || {}));
            s.on("*", ((t, e, ...i) => {
                this.emit(`Carousel.${e}`, t, ...i)
            })), s.on(["ready", "change"], (() => {
                var t;
                const e = this.getSlide();
                e && (null === (t = e.panzoom) || void 0 === t || t.updateControls()), this.manageCaption(e)
            })), s.on("removeSlide", ((t, e) => {
                e.closeBtnEl && e.closeBtnEl.remove(), e.closeBtnEl = void 0, e.captionEl && e.captionEl.remove(), e.captionEl = void 0, e.spinnerEl && e.spinnerEl.remove(), e.spinnerEl = void 0, e.state = void 0
            })), s.on("Panzoom.touchStart", (() => {
                this.isCompact || this.endIdle()
            })), s.on("settle", (() => {
                this.idleTimer || this.isCompact || !this.option("idle") || this.setIdle(), this.option("autoFocus") && this.checkFocus()
            })), this.option("dragToClose") && (s.on("Panzoom.afterTransform", ((t, e) => {
                const n = this.getSlide();
                if (n && i(n.el)) return;
                const s = this.container;
                if (s) {
                    const t = Math.abs(e.current.f),
                        i = t < 1 ? "" : Math.max(.5, Math.min(1, 1 - t / e.contentRect.fitHeight * 1.5));
                    s.style.setProperty("--fancybox-ts", i ? "0s" : ""), s.style.setProperty("--fancybox-opacity", i + "")
                }
            })), s.on("Panzoom.touchEnd", ((t, e, n) => {
                var s;
                const o = this.getSlide();
                if (o && i(o.el)) return;
                if (e.isMobile && document.activeElement && -1 !== ["TEXTAREA", "INPUT"].indexOf(null === (s = document.activeElement) || void 0 === s ? void 0 : s.nodeName)) return;
                const a = Math.abs(e.dragOffset.y);
                "y" === e.lockedAxis && (a >= 200 || a >= 50 && e.dragOffset.time < 300) && (n && n.cancelable && n.preventDefault(), this.close(n, "f-throwOut" + (e.current.f < 0 ? "Up" : "Down")))
            }))), s.on(["change"], (t => {
                var e;
                let i = null === (e = this.getSlide()) || void 0 === e ? void 0 : e.triggerEl;
                if (i) {
                    const e = new CustomEvent("slideTo", {
                        bubbles: !0,
                        cancelable: !0,
                        detail: t.page
                    });
                    i.dispatchEvent(e)
                }
            })), s.on(["refresh", "change"], (t => {
                const e = this.container;
                if (!e) return;
                for (const i of e.querySelectorAll("[data-fancybox-current-index]")) i.innerHTML = t.page + 1;
                for (const i of e.querySelectorAll("[data-fancybox-count]")) i.innerHTML = t.pages.length;
                if (!t.isInfinite) {
                    for (const i of e.querySelectorAll("[data-fancybox-next]")) t.page < t.pages.length - 1 ? (i.removeAttribute("disabled"), i.removeAttribute("tabindex")) : (i.setAttribute("disabled", ""), i.setAttribute("tabindex", "-1"));
                    for (const i of e.querySelectorAll("[data-fancybox-prev]")) t.page > 0 ? (i.removeAttribute("disabled"), i.removeAttribute("tabindex")) : (i.setAttribute("disabled", ""), i.setAttribute("tabindex", "-1"))
                }
                const i = this.getSlide();
                if (!i) return;
                let n = i.downloadSrc || "";
                n || "image" !== i.type || i.error || "string" != typeof i.src || (n = i.src);
                for (const t of e.querySelectorAll("[data-fancybox-download]")) {
                    const e = i.downloadFilename;
                    n ? (t.removeAttribute("disabled"), t.removeAttribute("tabindex"), t.setAttribute("href", n), t.setAttribute("download", e || n), t.setAttribute("target", "_blank")) : (t.setAttribute("disabled", ""), t.setAttribute("tabindex", "-1"), t.removeAttribute("href"), t.removeAttribute("download"))
                }
            })), this.emit("initCarousel")
        }
        attachEvents() {
            const t = this.container;
            if (!t) return;
            t.addEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), t.addEventListener("wheel", this.onWheel, {
                passive: !1,
                capture: !1
            }), document.addEventListener("keydown", this.onKeydown, {
                passive: !1,
                capture: !0
            }), document.addEventListener("visibilitychange", this.onVisibilityChange, !1), document.addEventListener("mousemove", this.onMousemove), this.option("trapFocus") && document.addEventListener("focus", this.onFocus, !0), window.addEventListener("resize", this.onResize);
            const e = window.visualViewport;
            e && (e.addEventListener("scroll", this.onResize), e.addEventListener("resize", this.onResize))
        }
        detachEvents() {
            const t = this.container;
            if (!t) return;
            document.removeEventListener("keydown", this.onKeydown, {
                passive: !1,
                capture: !0
            }), t.removeEventListener("wheel", this.onWheel, {
                passive: !1,
                capture: !1
            }), t.removeEventListener("click", this.onClick, {
                passive: !1,
                capture: !1
            }), document.removeEventListener("mousemove", this.onMousemove), window.removeEventListener("resize", this.onResize);
            const e = window.visualViewport;
            e && (e.removeEventListener("resize", this.onResize), e.removeEventListener("scroll", this.onResize)), document.removeEventListener("visibilitychange", this.onVisibilityChange, !1), document.removeEventListener("focus", this.onFocus, !0)
        }
        scale() {
            const t = this.container;
            if (!t) return;
            const e = window.visualViewport,
                i = Math.max(1, (null == e ? void 0 : e.scale) || 1);
            let n = "",
                s = "",
                o = "";
            if (e && i > 1) {
                let t = `${e.offsetLeft}px`,
                    a = `${e.offsetTop}px`;
                n = e.width * i + "px", s = e.height * i + "px", o = `translate3d(${t}, ${a}, 0) scale(${1/i})`
            }
            t.style.transform = o, t.style.width = n, t.style.height = s
        }
        onClick(t) {
            var e, i;
            const {
                container: n,
                isCompact: s
            } = this;
            if (!n || this.isClosing()) return;
            !s && this.option("idle") && this.resetIdle();
            const o = document.activeElement;
            if (Rt() && o && n.contains(o)) return;
            const a = t.composedPath()[0];
            if (a === (null === (e = this.carousel) || void 0 === e ? void 0 : e.container)) return;
            if (a.closest(".f-spinner") || a.closest("[data-fancybox-close]")) return t.preventDefault(), void this.close(t);
            if (a.closest("[data-fancybox-prev]")) return t.preventDefault(), void this.prev();
            if (a.closest("[data-fancybox-next]")) return t.preventDefault(), void this.next();
            if (s && "image" === (null === (i = this.getSlide()) || void 0 === i ? void 0 : i.type)) return void(this.clickTimer ? (clearTimeout(this.clickTimer), this.clickTimer = null) : this.clickTimer = setTimeout((() => {
                this.toggleIdle(), this.clickTimer = null
            }), 350));
            if (this.emit("click", t), t.defaultPrevented) return;
            let r = !1;
            if (a.closest(".fancybox__content")) {
                if (o) {
                    if (o.closest("[contenteditable]")) return;
                    a.matches(Q) || o.blur()
                }
                if (Rt()) return;
                r = this.option("contentClick")
            } else a.closest(".fancybox__carousel") && !a.matches(Q) && (r = this.option("backdropClick"));
            "close" === r ? (t.preventDefault(), this.close(t)) : "next" === r ? (t.preventDefault(), this.next()) : "prev" === r && (t.preventDefault(), this.prev())
        }
        onWheel(t) {
            const e = this.option("wheel", t),
                i = "slide" === e,
                n = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce((function (t, e) {
                    return Math.abs(e) > Math.abs(t) ? e : t
                })),
                s = Math.max(-1, Math.min(1, n)),
                o = Date.now();
            this.pwt && o - this.pwt < 300 ? i && t.preventDefault() : (this.pwt = o, this.emit("wheel", t), t.defaultPrevented || ("close" === e ? (t.preventDefault(), this.close(t)) : "slide" === e && (t.preventDefault(), this[s > 0 ? "prev" : "next"]())))
        }
        onKeydown(t) {
            if (!this.isTopmost()) return;
            this.isCompact || !this.option("idle") || this.isClosing() || this.resetIdle();
            const e = t.key,
                i = this.option("keyboard");
            if (!i || t.ctrlKey || t.altKey || t.shiftKey) return;
            const n = t.composedPath()[0],
                s = document.activeElement && document.activeElement.classList,
                o = s && s.contains("f-button") || n.dataset.carouselPage || n.dataset.carouselIndex;
            if ("Escape" !== e && !o && E(n)) {
                if (n.isContentEditable || -1 !== ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(n.nodeName)) return
            }
            this.emit("keydown", e, t);
            const a = i[e];
            "function" == typeof this[a] && (t.preventDefault(), this[a]())
        }
        onResize() {
            const t = this.container;
            if (!t) return;
            const e = this.isCompact;
            t.classList.toggle("is-compact", e), this.manageCaption(this.getSlide()), this.isCompact ? this.clearIdle() : this.endIdle(), this.scale(), this.emit("resize")
        }
        onFocus(t) {
            this.isTopmost() && this.checkFocus(t)
        }
        onMousemove(t) {
            this.prevMouseMoveEvent = t, !this.isCompact && this.option("idle") && this.resetIdle()
        }
        onVisibilityChange() {
            "visible" === document.visibilityState ? this.checkFocus() : this.endIdle()
        }
        manageCloseBtn(t) {
            const e = this.optionFor(t, "closeButton") || !1;
            if ("auto" === e) {
                const t = this.plugins.Toolbar;
                if (t && t.state === wt.Ready) return
            }
            if (!e) return;
            if (!t.contentEl || t.closeBtnEl) return;
            const i = this.option("tpl.closeButton");
            if (i) {
                const e = s(this.localize(i));
                t.closeBtnEl = t.contentEl.appendChild(e), t.el && P(t.el, "has-close-btn")
            }
        }
        manageCaption(t) {
            var e, i;
            const n = "fancybox__caption",
                s = "has-caption",
                o = this.container;
            if (!o) return;
            const a = this.isCompact || this.option("commonCaption"),
                r = !a;
            if (this.caption && this.stop(this.caption), r && this.caption && (this.caption.remove(), this.caption = null), a && !this.caption)
                for (const t of (null === (e = this.carousel) || void 0 === e ? void 0 : e.slides) || []) t.captionEl && (t.captionEl.remove(), t.captionEl = void 0, S(t.el, s), null === (i = t.el) || void 0 === i || i.removeAttribute("aria-labelledby"));
            if (t || (t = this.getSlide()), !t || a && !this.isCurrentSlide(t)) return;
            const l = t.el;
            let c = this.optionFor(t, "caption", "");
            if ("string" != typeof c || !c.length) return void(a && this.caption && this.animate(this.caption, "f-fadeOut", (() => {
                var t;
                null === (t = this.caption) || void 0 === t || t.remove(), this.caption = null
            })));
            let h = null;
            if (r) {
                if (h = t.captionEl || null, l && !h) {
                    const e = `fancybox__caption_${this.id}_${t.index}`;
                    h = document.createElement("div"), P(h, n), h.setAttribute("id", e), t.captionEl = l.appendChild(h), P(l, s), l.setAttribute("aria-labelledby", e)
                }
            } else {
                if (h = this.caption, h || (h = o.querySelector("." + n)), !h) {
                    h = document.createElement("div"), h.dataset.fancyboxCaption = "", P(h, n), h.innerHTML = c;
                    (this.footer || o).prepend(h)
                }
                P(o, s), this.caption = h
            }
            h && (h.innerHTML = c)
        }
        checkFocus(t) {
            var e;
            const i = document.activeElement || null;
            i && (null === (e = this.container) || void 0 === e ? void 0 : e.contains(i)) || this.focus(t)
        }
        focus(t) {
            var e;
            if (this.ignoreFocusChange) return;
            const i = document.activeElement || null,
                n = (null == t ? void 0 : t.target) || null,
                s = this.container,
                o = this.getSlide();
            if (!s || !(null === (e = this.carousel) || void 0 === e ? void 0 : e.viewport)) return;
            if (!t && i && s.contains(i)) return;
            const a = o && o.state === nt.Ready ? o.el : null;
            if (!a || a.contains(i) || s === i) return;
            t && t.cancelable && t.preventDefault(), this.ignoreFocusChange = !0;
            const r = Array.from(s.querySelectorAll(Q));
            let l = [],
                c = null;
            for (let t of r) {
                const e = !t.offsetParent || t.closest('[aria-hidden="true"]'),
                    i = a && a.contains(t),
                    n = !this.carousel.viewport.contains(t);
                t === s || (i || n) && !e ? (l.push(t), void 0 !== t.dataset.origTabindex && (t.tabIndex = parseFloat(t.dataset.origTabindex)), t.removeAttribute("data-orig-tabindex"), !t.hasAttribute("autoFocus") && c || (c = t)) : (t.dataset.origTabindex = void 0 === t.dataset.origTabindex ? t.getAttribute("tabindex") || void 0 : t.dataset.origTabindex, t.tabIndex = -1)
            }
            let h = null;
            t ? (!n || l.indexOf(n) < 0) && (h = c || s, l.length && (i === It ? h = l[0] : this.lastFocus !== s && i !== kt || (h = l[l.length - 1]))) : h = o && "image" === o.type ? s : c || s, h && tt(h), this.lastFocus = document.activeElement, this.ignoreFocusChange = !1
        }
        next() {
            const t = this.carousel;
            t && t.pages.length > 1 && t.slideNext()
        }
        prev() {
            const t = this.carousel;
            t && t.pages.length > 1 && t.slidePrev()
        }
        jumpTo(...t) {
            this.carousel && this.carousel.slideTo(...t)
        }
        isTopmost() {
            var t;
            return (null === (t = jt.getInstance()) || void 0 === t ? void 0 : t.id) == this.id
        }
        animate(t = null, e = "", i) {
            if (!t || !e) return void(i && i());
            this.stop(t);
            const n = s => {
                s.target === t && t.dataset.animationName && (t.removeEventListener("animationend", n), delete t.dataset.animationName, i && i(), S(t, e))
            };
            t.dataset.animationName = e, t.addEventListener("animationend", n), P(t, e)
        }
        stop(t) {
            t && t.dispatchEvent(new CustomEvent("animationend", {
                bubbles: !1,
                cancelable: !0,
                currentTarget: t
            }))
        }
        setContent(t, e = "", i = !0) {
            if (this.isClosing()) return;
            const n = t.el;
            if (!n) return;
            let o = null;
            if (E(e) ? o = e : (o = s(e + ""), E(o) || (o = document.createElement("div"), o.innerHTML = e + "")), ["img", "picture", "iframe", "video", "audio"].includes(o.nodeName.toLowerCase())) {
                const t = document.createElement("div");
                t.appendChild(o), o = t
            }
            E(o) && t.filter && !t.error && (o = o.querySelector(t.filter)), o && E(o) ? (P(o, "fancybox__content"), t.id && o.setAttribute("id", t.id), "none" !== o.style.display && "none" !== getComputedStyle(o).getPropertyValue("display") || (o.style.display = t.display || this.option("defaultDisplay") || "flex"), n.classList.add(`has-${t.error?"error":t.type||"unknown"}`), n.prepend(o), t.contentEl = o, i && this.revealContent(t), this.manageCloseBtn(t), this.manageCaption(t)) : this.setError(t, "{{ELEMENT_NOT_FOUND}}")
        }
        revealContent(t, e) {
            const i = t.el,
                n = t.contentEl;
            i && n && (this.emit("reveal", t), this.hideLoading(t), t.state = nt.Opening, (e = this.isOpeningSlide(t) ? void 0 === e ? this.optionFor(t, "showClass") : e : "f-fadeIn") ? this.animate(n, e, (() => {
                this.done(t)
            })) : this.done(t))
        }
        done(t) {
            this.isClosing() || (t.state = nt.Ready, this.emit("done", t), P(t.el, "is-done"), this.isCurrentSlide(t) && this.option("autoFocus") && queueMicrotask((() => {
                this.option("autoFocus") && (this.option("autoFocus") ? this.focus() : this.checkFocus())
            })), this.isOpeningSlide(t) && !this.isCompact && this.option("idle") && this.setIdle())
        }
        isCurrentSlide(t) {
            const e = this.getSlide();
            return !(!t || !e) && e.index === t.index
        }
        isOpeningSlide(t) {
            var e, i;
            return null === (null === (e = this.carousel) || void 0 === e ? void 0 : e.prevPage) && t.index === (null === (i = this.getSlide()) || void 0 === i ? void 0 : i.index)
        }
        showLoading(t) {
            t.state = nt.Loading;
            const e = t.el;
            if (!e) return;
            P(e, Lt), this.emit("loading", t), t.spinnerEl || setTimeout((() => {
                if (!this.isClosing() && !t.spinnerEl && t.state === nt.Loading) {
                    let i = s(x);
                    t.spinnerEl = i, e.prepend(i), this.animate(i, "f-fadeIn")
                }
            }), 250)
        }
        hideLoading(t) {
            const e = t.el;
            if (!e) return;
            const i = t.spinnerEl;
            this.isClosing() ? null == i || i.remove() : (S(e, Lt), i && this.animate(i, "f-fadeOut", (() => {
                i.remove()
            })), t.state === nt.Loading && (this.emit("loaded", t), t.state = nt.Ready))
        }
        setError(t, e) {
            if (this.isClosing()) return;
            this.emit("error"), t.error = e, this.hideLoading(t), this.clearContent(t);
            const i = document.createElement("div");
            i.classList.add("fancybox-error"), i.innerHTML = this.localize(e || "<p>{{ERROR}}</p>"), this.setContent(t, i)
        }
        clearContent(t) {
            var e;
            null === (e = this.carousel) || void 0 === e || e.emit("removeSlide", t), t.contentEl && (t.contentEl.remove(), t.contentEl = void 0), t.closeBtnEl && (t.closeBtnEl.remove(), t.closeBtnEl = void 0);
            const i = t.el;
            i && (S(i, Lt), S(i, "has-error"), S(i, "has-unknown"), S(i, `has-${t.type||"unknown"}`))
        }
        getSlide() {
            var t;
            const e = this.carousel;
            return (null === (t = null == e ? void 0 : e.pages[null == e ? void 0 : e.page]) || void 0 === t ? void 0 : t.slides[0]) || void 0
        }
        close(t, e) {
            if (this.isClosing()) return;
            const i = new Event("shouldClose", {
                bubbles: !0,
                cancelable: !0
            });
            if (this.emit("shouldClose", i, t), i.defaultPrevented) return;
            t && t.cancelable && (t.preventDefault(), t.stopPropagation());
            const n = this.fsAPI,
                s = () => {
                    this.proceedClose(t, e)
                };
            n && n.isFullscreen() ? Promise.resolve(n.exit()).then((() => s())) : s()
        }
        clearIdle() {
            this.idleTimer && clearTimeout(this.idleTimer), this.idleTimer = null
        }
        setIdle(t = !1) {
            const e = () => {
                this.clearIdle(), this.idle = !0, P(this.container, "is-idle"), this.emit("setIdle")
            };
            if (this.clearIdle(), !this.isClosing())
                if (t) e();
                else {
                    const t = this.option("idle");
                    t && (this.idleTimer = setTimeout(e, t))
                }
        }
        endIdle() {
            this.clearIdle(), this.idle && !this.isClosing() && (this.idle = !1, S(this.container, "is-idle"), this.emit("endIdle"))
        }
        resetIdle() {
            this.endIdle(), this.setIdle()
        }
        toggleIdle() {
            this.idle ? this.endIdle() : this.setIdle(!0)
        }
        toggleFullscreen() {
            const t = this.fsAPI;
            t && (t.isFullscreen() ? t.exit() : this.container && t.request(this.container))
        }
        isClosing() {
            return [it.Closing, it.CustomClosing, it.Destroy].includes(this.state)
        }
        proceedClose(t, e) {
            var i, n;
            this.state = it.Closing, this.clearIdle(), this.detachEvents();
            const s = this.container,
                o = this.carousel,
                a = this.getSlide(),
                r = a && this.option("placeFocusBack") ? a.triggerEl || this.option("trigger") : null;
            if (r && (U(r) ? tt(r) : r.focus()), s && (P(s, "is-closing"), s.setAttribute("aria-hidden", "true"), this.option("animated") && P(s, At), s.style.pointerEvents = "none"), o) {
                o.clearTransitions(), null === (i = o.panzoom) || void 0 === i || i.destroy(), null === (n = o.plugins.Navigation) || void 0 === n || n.detach();
                for (const t of o.slides) {
                    t.state = nt.Closing, this.hideLoading(t);
                    const e = t.contentEl;
                    e && this.stop(e);
                    const i = null == t ? void 0 : t.panzoom;
                    i && (i.stop(), i.detachEvents(), i.detachObserver()), this.isCurrentSlide(t) || o.emit("removeSlide", t)
                }
            }
            this.emit("close", t), this.state !== it.CustomClosing ? (void 0 === e && a && (e = this.optionFor(a, "hideClass")), e && a ? (this.animate(a.contentEl, e, (() => {
                o && o.emit("removeSlide", a)
            })), setTimeout((() => {
                this.destroy()
            }), 500)) : this.destroy()) : setTimeout((() => {
                this.destroy()
            }), 500)
        }
        destroy() {
            var t;
            if (this.state === it.Destroy) return;
            this.state = it.Destroy, null === (t = this.carousel) || void 0 === t || t.destroy();
            const e = this.container;
            e && e.remove(), Dt.delete(this.id);
            const i = jt.getInstance();
            i ? i.focus() : (kt && (kt.remove(), kt = null), It && (It.remove(), It = null), S(document.documentElement, Ct), (() => {
                if (!K) return;
                const t = document,
                    e = t.body;
                e.classList.remove(Mt), e.style.setProperty(Ot, ""), t.documentElement.style.setProperty(Tt, "")
            })(), this.emit("destroy"))
        }
        static bind(t, e, i) {
            if (!K) return;
            let n, s = "",
                o = {};
            if (void 0 === t ? n = document.body : "string" == typeof t ? (n = document.body, s = t, "object" == typeof e && (o = e || {})) : (n = t, "string" == typeof e && (s = e), "object" == typeof i && (o = i || {})), !n || !E(n)) return;
            s = s || "[data-fancybox]";
            const a = jt.openers.get(n) || new Map;
            a.set(s, o), jt.openers.set(n, a), 1 === a.size && n.addEventListener("click", jt.fromEvent)
        }
        static unbind(t, e) {
            let i, n = "";
            if ("string" == typeof t ? (i = document.body, n = t) : (i = t, "string" == typeof e && (n = e)), !i) return;
            const s = jt.openers.get(i);
            s && n && s.delete(n), n && s || (jt.openers.delete(i), i.removeEventListener("click", jt.fromEvent))
        }
        static destroy() {
            let t;
            for (; t = jt.getInstance();) t.destroy();
            for (const t of jt.openers.keys()) t.removeEventListener("click", jt.fromEvent);
            jt.openers = new Map
        }
        static fromEvent(t) {
            if (t.defaultPrevented) return;
            if (t.button && 0 !== t.button) return;
            if (t.ctrlKey || t.metaKey || t.shiftKey) return;
            let e = t.composedPath()[0];
            const i = e.closest("[data-fancybox-trigger]");
            if (i) {
                const t = i.dataset.fancyboxTrigger || "",
                    n = document.querySelectorAll(`[data-fancybox="${t}"]`),
                    s = parseInt(i.dataset.fancyboxIndex || "", 10) || 0;
                e = n[s] || e
            }
            if (!(e && e instanceof Element)) return;
            let n, s, o, a;
            if ([...jt.openers].reverse().find((([t, i]) => !(!t.contains(e) || ![...i].reverse().find((([i, r]) => {
                    let l = e.closest(i);
                    return !!l && (n = t, s = i, o = l, a = r, !0)
                }))))), !n || !s || !o) return;
            a = a || {}, t.preventDefault(), e = o;
            let r = [],
                l = p({}, et, a);
            l.event = t, l.trigger = e, l.delegate = i;
            const c = l.groupAll,
                h = l.groupAttr,
                d = h && e ? e.getAttribute(`${h}`) : "";
            if ((!e || d || c) && (r = [].slice.call(n.querySelectorAll(s))), e && !c && (r = d ? r.filter((t => t.getAttribute(`${h}`) === d)) : [e]), !r.length) return;
            const u = jt.getInstance();
            return u && u.options.trigger && r.indexOf(u.options.trigger) > -1 ? void 0 : (e && (l.startIndex = r.indexOf(e)), jt.fromNodes(r, l))
        }
        static fromSelector(t, e) {
            let i = null,
                n = "";
            if ("string" == typeof t ? (i = document.body, n = t) : t instanceof HTMLElement && "string" == typeof e && (i = t, n = e), !i || !n) return !1;
            const s = jt.openers.get(i);
            if (!s) return !1;
            const o = s.get(n);
            return !!o && jt.fromNodes(Array.from(i.querySelectorAll(n)), o)
        }
        static fromNodes(t, e) {
            e = p({}, et, e || {});
            const i = [];
            for (const n of t) {
                const t = n.dataset || {},
                    s = t.src || n.getAttribute("href") || n.getAttribute("currentSrc") || n.getAttribute("src") || void 0;
                let o;
                const a = e.delegate;
                let r;
                a && i.length === e.startIndex && (o = a instanceof HTMLImageElement ? a : a.querySelector("img:not([aria-hidden])")), o || (o = n instanceof HTMLImageElement ? n : n.querySelector("img:not([aria-hidden])")), o && (r = o.currentSrc || o.src || void 0, !r && o.dataset && (r = o.dataset.lazySrc || o.dataset.src || void 0));
                const l = {
                    src: s,
                    triggerEl: n,
                    thumbEl: o,
                    thumbElSrc: r,
                    thumbSrc: r
                };
                for (const e in t) "fancybox" !== e && (l[e] = t[e] + "");
                i.push(l)
            }
            return new jt(i, e)
        }
        static getInstance(t) {
            if (t) return Dt.get(t);
            return Array.from(Dt.values()).reverse().find((t => !t.isClosing() && t)) || null
        }
        static getSlide() {
            var t;
            return (null === (t = jt.getInstance()) || void 0 === t ? void 0 : t.getSlide()) || null
        }
        static show(t = [], e = {}) {
            return new jt(t, e)
        }
        static next() {
            const t = jt.getInstance();
            t && t.next()
        }
        static prev() {
            const t = jt.getInstance();
            t && t.prev()
        }
        static close(t = !0, ...e) {
            if (t)
                for (const t of Dt.values()) t.close(...e);
            else {
                const t = jt.getInstance();
                t && t.close(...e)
            }
        }
    }
    Object.defineProperty(jt, "version", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: "5.0.17"
    }), Object.defineProperty(jt, "defaults", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: et
    }), Object.defineProperty(jt, "Plugins", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: Pt
    }), Object.defineProperty(jt, "openers", {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: new Map
    }), t.Carousel = G, t.Fancybox = jt, t.Panzoom = k
}));
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IMask = {}));
  })(this, (function (exports) { 'use strict';
  
    /** Checks if value is string */
    function isString(str) {
      return typeof str === 'string' || str instanceof String;
    }
  
    /** Checks if value is object */
    function isObject(obj) {
      return typeof obj === 'object' && obj != null && obj?.constructor?.name === 'Object';
    }
    function pick(obj, keys) {
      if (Array.isArray(keys)) return pick(obj, (_, k) => keys.includes(k));
      return Object.entries(obj).reduce((acc, _ref) => {
        let [k, v] = _ref;
        if (keys(v, k)) acc[k] = v;
        return acc;
      }, {});
    }
  
    /** Direction */
    const DIRECTION = {
      NONE: 'NONE',
      LEFT: 'LEFT',
      FORCE_LEFT: 'FORCE_LEFT',
      RIGHT: 'RIGHT',
      FORCE_RIGHT: 'FORCE_RIGHT'
    };
  
    /** Direction */
  
    function forceDirection(direction) {
      switch (direction) {
        case DIRECTION.LEFT:
          return DIRECTION.FORCE_LEFT;
        case DIRECTION.RIGHT:
          return DIRECTION.FORCE_RIGHT;
        default:
          return direction;
      }
    }
  
    /** Escapes regular expression control chars */
    function escapeRegExp(str) {
      return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
    }
  
    // cloned from https://github.com/epoberezkin/fast-deep-equal with small changes
    function objectIncludes(b, a) {
      if (a === b) return true;
      const arrA = Array.isArray(a),
        arrB = Array.isArray(b);
      let i;
      if (arrA && arrB) {
        if (a.length != b.length) return false;
        for (i = 0; i < a.length; i++) if (!objectIncludes(a[i], b[i])) return false;
        return true;
      }
      if (arrA != arrB) return false;
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        const dateA = a instanceof Date,
          dateB = b instanceof Date;
        if (dateA && dateB) return a.getTime() == b.getTime();
        if (dateA != dateB) return false;
        const regexpA = a instanceof RegExp,
          regexpB = b instanceof RegExp;
        if (regexpA && regexpB) return a.toString() == b.toString();
        if (regexpA != regexpB) return false;
        const keys = Object.keys(a);
        // if (keys.length !== Object.keys(b).length) return false;
  
        for (i = 0; i < keys.length; i++) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = 0; i < keys.length; i++) if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
        return true;
      } else if (a && b && typeof a === 'function' && typeof b === 'function') {
        return a.toString() === b.toString();
      }
      return false;
    }
  
    /** Selection range */
  
    /** Provides details of changing input */
    class ActionDetails {
      /** Current input value */
  
      /** Current cursor position */
  
      /** Old input value */
  
      /** Old selection */
  
      constructor(opts) {
        Object.assign(this, opts);
  
        // double check if left part was changed (autofilling, other non-standard input triggers)
        while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
          --this.oldSelection.start;
        }
  
        // double check right part
        while (this.value.slice(this.cursorPos) !== this.oldValue.slice(this.oldSelection.end)) {
          if (this.value.length - this.cursorPos < this.oldValue.length - this.oldSelection.end) ++this.oldSelection.end;else ++this.cursorPos;
        }
      }
  
      /** Start changing position */
      get startChangePos() {
        return Math.min(this.cursorPos, this.oldSelection.start);
      }
  
      /** Inserted symbols count */
      get insertedCount() {
        return this.cursorPos - this.startChangePos;
      }
  
      /** Inserted symbols */
      get inserted() {
        return this.value.substr(this.startChangePos, this.insertedCount);
      }
  
      /** Removed symbols count */
      get removedCount() {
        // Math.max for opposite operation
        return Math.max(this.oldSelection.end - this.startChangePos ||
        // for Delete
        this.oldValue.length - this.value.length, 0);
      }
  
      /** Removed symbols */
      get removed() {
        return this.oldValue.substr(this.startChangePos, this.removedCount);
      }
  
      /** Unchanged head symbols */
      get head() {
        return this.value.substring(0, this.startChangePos);
      }
  
      /** Unchanged tail symbols */
      get tail() {
        return this.value.substring(this.startChangePos + this.insertedCount);
      }
  
      /** Remove direction */
      get removeDirection() {
        if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
  
        // align right if delete at right
        return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) &&
        // if not range removed (event with backspace)
        this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
      }
    }
  
    /** Applies mask on element */
    function IMask(el, opts) {
      // currently available only for input-like elements
      return new IMask.InputMask(el, opts);
    }
  
    // TODO can't use overloads here because of https://github.com/microsoft/TypeScript/issues/50754
    // export function maskedClass(mask: string): typeof MaskedPattern;
    // export function maskedClass(mask: DateConstructor): typeof MaskedDate;
    // export function maskedClass(mask: NumberConstructor): typeof MaskedNumber;
    // export function maskedClass(mask: Array<any> | ArrayConstructor): typeof MaskedDynamic;
    // export function maskedClass(mask: MaskedDate): typeof MaskedDate;
    // export function maskedClass(mask: MaskedNumber): typeof MaskedNumber;
    // export function maskedClass(mask: MaskedEnum): typeof MaskedEnum;
    // export function maskedClass(mask: MaskedRange): typeof MaskedRange;
    // export function maskedClass(mask: MaskedRegExp): typeof MaskedRegExp;
    // export function maskedClass(mask: MaskedFunction): typeof MaskedFunction;
    // export function maskedClass(mask: MaskedPattern): typeof MaskedPattern;
    // export function maskedClass(mask: MaskedDynamic): typeof MaskedDynamic;
    // export function maskedClass(mask: Masked): typeof Masked;
    // export function maskedClass(mask: typeof Masked): typeof Masked;
    // export function maskedClass(mask: typeof MaskedDate): typeof MaskedDate;
    // export function maskedClass(mask: typeof MaskedNumber): typeof MaskedNumber;
    // export function maskedClass(mask: typeof MaskedEnum): typeof MaskedEnum;
    // export function maskedClass(mask: typeof MaskedRange): typeof MaskedRange;
    // export function maskedClass(mask: typeof MaskedRegExp): typeof MaskedRegExp;
    // export function maskedClass(mask: typeof MaskedFunction): typeof MaskedFunction;
    // export function maskedClass(mask: typeof MaskedPattern): typeof MaskedPattern;
    // export function maskedClass(mask: typeof MaskedDynamic): typeof MaskedDynamic;
    // export function maskedClass<Mask extends typeof Masked> (mask: Mask): Mask;
    // export function maskedClass(mask: RegExp): typeof MaskedRegExp;
    // export function maskedClass(mask: (value: string, ...args: any[]) => boolean): typeof MaskedFunction;
  
    /** Get Masked class by mask type */
    function maskedClass(mask) /* TODO */{
      if (mask == null) throw new Error('mask property should be defined');
      if (mask instanceof RegExp) return IMask.MaskedRegExp;
      if (isString(mask)) return IMask.MaskedPattern;
      if (mask === Date) return IMask.MaskedDate;
      if (mask === Number) return IMask.MaskedNumber;
      if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
      if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
      if (IMask.Masked && mask instanceof IMask.Masked) return mask.constructor;
      if (mask instanceof Function) return IMask.MaskedFunction;
      console.warn('Mask not found for mask', mask); // eslint-disable-line no-console
      return IMask.Masked;
    }
    function normalizeOpts(opts) {
      if (!opts) throw new Error('Options in not defined');
      if (IMask.Masked) {
        if (opts.prototype instanceof IMask.Masked) return {
          mask: opts
        };
  
        /*
          handle cases like:
          1) opts = Masked
          2) opts = { mask: Masked, ...instanceOpts }
        */
        const {
          mask = undefined,
          ...instanceOpts
        } = opts instanceof IMask.Masked ? {
          mask: opts
        } : isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {};
        if (mask) {
          const _mask = mask.mask;
          return {
            ...pick(mask, (_, k) => !k.startsWith('_')),
            mask: mask.constructor,
            _mask,
            ...instanceOpts
          };
        }
      }
      if (!isObject(opts)) return {
        mask: opts
      };
      return {
        ...opts
      };
    }
  
    // TODO can't use overloads here because of https://github.com/microsoft/TypeScript/issues/50754
  
    // From masked
    // export default function createMask<Opts extends Masked, ReturnMasked=Opts> (opts: Opts): ReturnMasked;
    // // From masked class
    // export default function createMask<Opts extends MaskedOptions<typeof Masked>, ReturnMasked extends Masked=InstanceType<Opts['mask']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedDate>, ReturnMasked extends MaskedDate=MaskedDate<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedNumber>, ReturnMasked extends MaskedNumber=MaskedNumber<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedEnum>, ReturnMasked extends MaskedEnum=MaskedEnum<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedRange>, ReturnMasked extends MaskedRange=MaskedRange<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedRegExp>, ReturnMasked extends MaskedRegExp=MaskedRegExp<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedFunction>, ReturnMasked extends MaskedFunction=MaskedFunction<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedPattern>, ReturnMasked extends MaskedPattern=MaskedPattern<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<typeof MaskedDynamic>, ReturnMasked extends MaskedDynamic=MaskedDynamic<Opts['parent']>> (opts: Opts): ReturnMasked;
    // // From mask opts
    // export default function createMask<Opts extends MaskedOptions<Masked>, ReturnMasked=Opts extends MaskedOptions<infer M> ? M : never> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedNumberOptions, ReturnMasked extends MaskedNumber=MaskedNumber<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedDateFactoryOptions, ReturnMasked extends MaskedDate=MaskedDate<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedEnumOptions, ReturnMasked extends MaskedEnum=MaskedEnum<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedRangeOptions, ReturnMasked extends MaskedRange=MaskedRange<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedPatternOptions, ReturnMasked extends MaskedPattern=MaskedPattern<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedDynamicOptions, ReturnMasked extends MaskedDynamic=MaskedDynamic<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<RegExp>, ReturnMasked extends MaskedRegExp=MaskedRegExp<Opts['parent']>> (opts: Opts): ReturnMasked;
    // export default function createMask<Opts extends MaskedOptions<Function>, ReturnMasked extends MaskedFunction=MaskedFunction<Opts['parent']>> (opts: Opts): ReturnMasked;
  
    /** Creates new {@link Masked} depending on mask type */
    function createMask(opts) {
      if (IMask.Masked && opts instanceof IMask.Masked) return opts;
      const nOpts = normalizeOpts(opts);
      const MaskedClass = maskedClass(nOpts.mask);
      if (!MaskedClass) throw new Error(`Masked class is not found for provided mask ${nOpts.mask}, appropriate module needs to be imported manually before creating mask.`);
      if (nOpts.mask === MaskedClass) delete nOpts.mask;
      if (nOpts._mask) {
        nOpts.mask = nOpts._mask;
        delete nOpts._mask;
      }
      return new MaskedClass(nOpts);
    }
    IMask.createMask = createMask;
  
    /**  Generic element API to use with mask */
    class MaskElement {
      /** */
  
      /** */
  
      /** */
  
      /** Safely returns selection start */
      get selectionStart() {
        let start;
        try {
          start = this._unsafeSelectionStart;
        } catch {}
        return start != null ? start : this.value.length;
      }
  
      /** Safely returns selection end */
      get selectionEnd() {
        let end;
        try {
          end = this._unsafeSelectionEnd;
        } catch {}
        return end != null ? end : this.value.length;
      }
  
      /** Safely sets element selection */
      select(start, end) {
        if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd) return;
        try {
          this._unsafeSelect(start, end);
        } catch {}
      }
  
      /** */
      get isActive() {
        return false;
      }
      /** */
  
      /** */
  
      /** */
    }
    IMask.MaskElement = MaskElement;
  
    /** Bridge between HTMLElement and {@link Masked} */
    class HTMLMaskElement extends MaskElement {
      /** Mapping between HTMLElement events and mask internal events */
      static EVENTS_MAP = {
        selectionChange: 'keydown',
        input: 'input',
        drop: 'drop',
        click: 'click',
        focus: 'focus',
        commit: 'blur'
      };
      /** HTMLElement to use mask on */
  
      constructor(input) {
        super();
        this.input = input;
        this._handlers = {};
      }
      get rootElement() {
        return this.input.getRootNode?.() ?? document;
      }
  
      /**
        Is element in focus
      */
      get isActive() {
        return this.input === this.rootElement.activeElement;
      }
  
      /**
        Binds HTMLElement events to mask internal events
      */
      bindEvents(handlers) {
        Object.keys(handlers).forEach(event => this._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]));
      }
  
      /**
        Unbinds HTMLElement events to mask internal events
      */
      unbindEvents() {
        Object.keys(this._handlers).forEach(event => this._toggleEventHandler(event));
      }
      _toggleEventHandler(event, handler) {
        if (this._handlers[event]) {
          this.input.removeEventListener(event, this._handlers[event]);
          delete this._handlers[event];
        }
        if (handler) {
          this.input.addEventListener(event, handler);
          this._handlers[event] = handler;
        }
      }
    }
    IMask.HTMLMaskElement = HTMLMaskElement;
  
    /** Bridge between InputElement and {@link Masked} */
    class HTMLInputMaskElement extends HTMLMaskElement {
      /** InputElement to use mask on */
  
      constructor(input) {
        super(input);
        this.input = input;
        this._handlers = {};
      }
  
      /** Returns InputElement selection start */
      get _unsafeSelectionStart() {
        return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
      }
  
      /** Returns InputElement selection end */
      get _unsafeSelectionEnd() {
        return this.input.selectionEnd;
      }
  
      /** Sets InputElement selection */
      _unsafeSelect(start, end) {
        this.input.setSelectionRange(start, end);
      }
      get value() {
        return this.input.value;
      }
      set value(value) {
        this.input.value = value;
      }
    }
    IMask.HTMLMaskElement = HTMLMaskElement;
  
    class HTMLContenteditableMaskElement extends HTMLMaskElement {
      /** Returns HTMLElement selection start */
      get _unsafeSelectionStart() {
        const root = this.rootElement;
        const selection = root.getSelection && root.getSelection();
        const anchorOffset = selection && selection.anchorOffset;
        const focusOffset = selection && selection.focusOffset;
        if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
          return anchorOffset;
        }
        return focusOffset;
      }
  
      /** Returns HTMLElement selection end */
      get _unsafeSelectionEnd() {
        const root = this.rootElement;
        const selection = root.getSelection && root.getSelection();
        const anchorOffset = selection && selection.anchorOffset;
        const focusOffset = selection && selection.focusOffset;
        if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
          return anchorOffset;
        }
        return focusOffset;
      }
  
      /** Sets HTMLElement selection */
      _unsafeSelect(start, end) {
        if (!this.rootElement.createRange) return;
        const range = this.rootElement.createRange();
        range.setStart(this.input.firstChild || this.input, start);
        range.setEnd(this.input.lastChild || this.input, end);
        const root = this.rootElement;
        const selection = root.getSelection && root.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
  
      /** HTMLElement value */
      get value() {
        return this.input.textContent || '';
      }
      set value(value) {
        this.input.textContent = value;
      }
    }
    IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
  
    /** Listens to element events and controls changes between element and {@link Masked} */
    class InputMask {
      /**
        View element
      */
  
      /** Internal {@link Masked} model */
  
      constructor(el, opts) {
        this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA' ? new HTMLContenteditableMaskElement(el) : new HTMLInputMaskElement(el);
        this.masked = createMask(opts);
        this._listeners = {};
        this._value = '';
        this._unmaskedValue = '';
        this._saveSelection = this._saveSelection.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onChange = this._onChange.bind(this);
        this._onDrop = this._onDrop.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onClick = this._onClick.bind(this);
        this.alignCursor = this.alignCursor.bind(this);
        this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
        this._bindEvents();
  
        // refresh
        this.updateValue();
        this._onChange();
      }
      maskEquals(mask) {
        return mask == null || this.masked?.maskEquals(mask);
      }
  
      /** Masked */
      get mask() {
        return this.masked.mask;
      }
      set mask(mask) {
        if (this.maskEquals(mask)) return;
        if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
          // TODO "any" no idea
          this.masked.updateOptions({
            mask
          });
          return;
        }
        const masked = mask instanceof IMask.Masked ? mask : createMask({
          mask
        });
        masked.unmaskedValue = this.masked.unmaskedValue;
        this.masked = masked;
      }
  
      /** Raw value */
      get value() {
        return this._value;
      }
      set value(str) {
        if (this.value === str) return;
        this.masked.value = str;
        this.updateControl();
        this.alignCursor();
      }
  
      /** Unmasked value */
      get unmaskedValue() {
        return this._unmaskedValue;
      }
      set unmaskedValue(str) {
        if (this.unmaskedValue === str) return;
        this.masked.unmaskedValue = str;
        this.updateControl();
        this.alignCursor();
      }
  
      /** Typed unmasked value */
      get typedValue() {
        return this.masked.typedValue;
      }
      set typedValue(val) {
        if (this.masked.typedValueEquals(val)) return;
        this.masked.typedValue = val;
        this.updateControl();
        this.alignCursor();
      }
  
      /** Display value */
      get displayValue() {
        return this.masked.displayValue;
      }
  
      /** Starts listening to element events */
      _bindEvents() {
        this.el.bindEvents({
          selectionChange: this._saveSelection,
          input: this._onInput,
          drop: this._onDrop,
          click: this._onClick,
          focus: this._onFocus,
          commit: this._onChange
        });
      }
  
      /** Stops listening to element events */
      _unbindEvents() {
        if (this.el) this.el.unbindEvents();
      }
  
      /** Fires custom event */
      _fireEvent(ev, e) {
        const listeners = this._listeners[ev];
        if (!listeners) return;
        listeners.forEach(l => l(e));
      }
  
      /** Current selection start */
      get selectionStart() {
        return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
      }
  
      /** Current cursor position */
      get cursorPos() {
        return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
      }
      set cursorPos(pos) {
        if (!this.el || !this.el.isActive) return;
        this.el.select(pos, pos);
        this._saveSelection();
      }
  
      /** Stores current selection */
      _saveSelection( /* ev */
      ) {
        if (this.displayValue !== this.el.value) {
          console.warn('Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.'); // eslint-disable-line no-console
        }
        this._selection = {
          start: this.selectionStart,
          end: this.cursorPos
        };
      }
  
      /** Syncronizes model value from view */
      updateValue() {
        this.masked.value = this.el.value;
        this._value = this.masked.value;
      }
  
      /** Syncronizes view from model value, fires change events */
      updateControl() {
        const newUnmaskedValue = this.masked.unmaskedValue;
        const newValue = this.masked.value;
        const newDisplayValue = this.displayValue;
        const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
        this._unmaskedValue = newUnmaskedValue;
        this._value = newValue;
        if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
        if (isChanged) this._fireChangeEvents();
      }
  
      /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
      updateOptions(opts) {
        const {
          mask,
          ...restOpts
        } = opts;
        const updateMask = !this.maskEquals(mask);
        const updateOpts = this.masked.optionsIsChanged(restOpts);
        if (updateMask) this.mask = mask;
        if (updateOpts) this.masked.updateOptions(restOpts); // TODO
  
        if (updateMask || updateOpts) this.updateControl();
      }
  
      /** Updates cursor */
      updateCursor(cursorPos) {
        if (cursorPos == null) return;
        this.cursorPos = cursorPos;
  
        // also queue change cursor for mobile browsers
        this._delayUpdateCursor(cursorPos);
      }
  
      /** Delays cursor update to support mobile browsers */
      _delayUpdateCursor(cursorPos) {
        this._abortUpdateCursor();
        this._changingCursorPos = cursorPos;
        this._cursorChanging = setTimeout(() => {
          if (!this.el) return; // if was destroyed
          this.cursorPos = this._changingCursorPos;
          this._abortUpdateCursor();
        }, 10);
      }
  
      /** Fires custom events */
      _fireChangeEvents() {
        this._fireEvent('accept', this._inputEvent);
        if (this.masked.isComplete) this._fireEvent('complete', this._inputEvent);
      }
  
      /** Aborts delayed cursor update */
      _abortUpdateCursor() {
        if (this._cursorChanging) {
          clearTimeout(this._cursorChanging);
          delete this._cursorChanging;
        }
      }
  
      /** Aligns cursor to nearest available position */
      alignCursor() {
        this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
      }
  
      /** Aligns cursor only if selection is empty */
      alignCursorFriendly() {
        if (this.selectionStart !== this.cursorPos) return; // skip if range is selected
        this.alignCursor();
      }
  
      /** Adds listener on custom event */
      on(ev, handler) {
        if (!this._listeners[ev]) this._listeners[ev] = [];
        this._listeners[ev].push(handler);
        return this;
      }
  
      /** Removes custom event listener */
      off(ev, handler) {
        if (!this._listeners[ev]) return this;
        if (!handler) {
          delete this._listeners[ev];
          return this;
        }
        const hIndex = this._listeners[ev].indexOf(handler);
        if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
        return this;
      }
  
      /** Handles view input event */
      _onInput(e) {
        this._inputEvent = e;
        this._abortUpdateCursor();
        const details = new ActionDetails({
          // new state
          value: this.el.value,
          cursorPos: this.cursorPos,
          // old state
          oldValue: this.displayValue,
          oldSelection: this._selection
        });
        const oldRawValue = this.masked.rawInputValue;
        const offset = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
          input: true,
          raw: true
        }).offset;
  
        // force align in remove direction only if no input chars were removed
        // otherwise we still need to align with NONE (to get out from fixed symbols for instance)
        const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
        let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset, removeDirection);
        if (removeDirection !== DIRECTION.NONE) cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
        this.updateControl();
        this.updateCursor(cursorPos);
        delete this._inputEvent;
      }
  
      /** Handles view change event and commits model value */
      _onChange() {
        if (this.displayValue !== this.el.value) {
          this.updateValue();
        }
        this.masked.doCommit();
        this.updateControl();
        this._saveSelection();
      }
  
      /** Handles view drop event, prevents by default */
      _onDrop(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      }
  
      /** Restore last selection on focus */
      _onFocus(ev) {
        this.alignCursorFriendly();
      }
  
      /** Restore last selection on focus */
      _onClick(ev) {
        this.alignCursorFriendly();
      }
  
      /** Unbind view events and removes element reference */
      destroy() {
        this._unbindEvents();
        this._listeners.length = 0;
        delete this.el;
      }
    }
    IMask.InputMask = InputMask;
  
    /** Provides details of changing model value */
    class ChangeDetails {
      /** Inserted symbols */
  
      /** Can skip chars */
  
      /** Additional offset if any changes occurred before tail */
  
      /** Raw inserted is used by dynamic mask */
  
      static normalize(prep) {
        return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
      }
      constructor(details) {
        Object.assign(this, {
          inserted: '',
          rawInserted: '',
          skip: false,
          tailShift: 0
        }, details);
      }
  
      /** Aggregate changes */
      aggregate(details) {
        this.rawInserted += details.rawInserted;
        this.skip = this.skip || details.skip;
        this.inserted += details.inserted;
        this.tailShift += details.tailShift;
        return this;
      }
  
      /** Total offset considering all changes */
      get offset() {
        return this.tailShift + this.inserted.length;
      }
    }
    IMask.ChangeDetails = ChangeDetails;
  
    /** Provides details of continuous extracted tail */
    class ContinuousTailDetails {
      /** Tail value as string */
  
      /** Tail start position */
  
      /** Start position */
  
      constructor(value, from, stop) {
        if (value === void 0) {
          value = '';
        }
        if (from === void 0) {
          from = 0;
        }
        this.value = value;
        this.from = from;
        this.stop = stop;
      }
      toString() {
        return this.value;
      }
      extend(tail) {
        this.value += String(tail);
      }
      appendTo(masked) {
        return masked.append(this.toString(), {
          tail: true
        }).aggregate(masked._appendPlaceholder());
      }
      get state() {
        return {
          value: this.value,
          from: this.from,
          stop: this.stop
        };
      }
      set state(state) {
        Object.assign(this, state);
      }
      unshift(beforePos) {
        if (!this.value.length || beforePos != null && this.from >= beforePos) return '';
        const shiftChar = this.value[0];
        this.value = this.value.slice(1);
        return shiftChar;
      }
      shift() {
        if (!this.value.length) return '';
        const shiftChar = this.value[this.value.length - 1];
        this.value = this.value.slice(0, -1);
        return shiftChar;
      }
    }
  
    /** Append flags */
  
    /** Extract flags */
  
    // see https://github.com/microsoft/TypeScript/issues/6223
  
    /** Provides common masking stuff */
    class Masked {
      static DEFAULTS = {
        skipInvalid: true
      };
      static EMPTY_VALUES = [undefined, null, ''];
  
      /** */
  
      /** */
  
      /** Transforms value before mask processing */
  
      /** Transforms each char before mask processing */
  
      /** Validates if value is acceptable */
  
      /** Does additional processing at the end of editing */
  
      /** Format typed value to string */
  
      /** Parse string to get typed value */
  
      /** Enable characters overwriting */
  
      /** */
  
      /** */
  
      /** */
  
      constructor(opts) {
        this._value = '';
        this._update({
          ...Masked.DEFAULTS,
          ...opts
        });
        this._initialized = true;
      }
  
      /** Sets and applies new options */
      updateOptions(opts) {
        if (!this.optionsIsChanged(opts)) return;
        this.withValueRefresh(this._update.bind(this, opts));
      }
  
      /** Sets new options */
      _update(opts) {
        Object.assign(this, opts);
      }
  
      /** Mask state */
      get state() {
        return {
          _value: this.value,
          _rawInputValue: this.rawInputValue
        };
      }
      set state(state) {
        this._value = state._value;
      }
  
      /** Resets value */
      reset() {
        this._value = '';
      }
      get value() {
        return this._value;
      }
      set value(value) {
        this.resolve(value, {
          input: true
        });
      }
  
      /** Resolve new value */
      resolve(value, flags) {
        if (flags === void 0) {
          flags = {
            input: true
          };
        }
        this.reset();
        this.append(value, flags, '');
        this.doCommit();
      }
      get unmaskedValue() {
        return this.value;
      }
      set unmaskedValue(value) {
        this.resolve(value, {});
      }
      get typedValue() {
        return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
      }
      set typedValue(value) {
        if (this.format) {
          this.value = this.format(value, this);
        } else {
          this.unmaskedValue = String(value);
        }
      }
  
      /** Value that includes raw user input */
      get rawInputValue() {
        return this.extractInput(0, this.displayValue.length, {
          raw: true
        });
      }
      set rawInputValue(value) {
        this.resolve(value, {
          raw: true
        });
      }
      get displayValue() {
        return this.value;
      }
      get isComplete() {
        return true;
      }
      get isFilled() {
        return this.isComplete;
      }
  
      /** Finds nearest input position in direction */
      nearestInputPos(cursorPos, direction) {
        return cursorPos;
      }
      totalInputPositions(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        return Math.min(this.displayValue.length, toPos - fromPos);
      }
  
      /** Extracts value in range considering flags */
      extractInput(fromPos, toPos, flags) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        return this.displayValue.slice(fromPos, toPos);
      }
  
      /** Extracts tail in range */
      extractTail(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
      }
  
      /** Appends tail */
      appendTail(tail) {
        if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
        return tail.appendTo(this);
      }
  
      /** Appends char */
      _appendCharRaw(ch, flags) {
        if (!ch) return new ChangeDetails();
        this._value += ch;
        return new ChangeDetails({
          inserted: ch,
          rawInserted: ch
        });
      }
  
      /** Appends char */
      _appendChar(ch, flags, checkTail) {
        if (flags === void 0) {
          flags = {};
        }
        const consistentState = this.state;
        let details;
        [ch, details] = this.doPrepareChar(ch, flags);
        if (ch) details = details.aggregate(this._appendCharRaw(ch, flags));
        if (details.inserted) {
          let consistentTail;
          let appended = this.doValidate(flags) !== false;
          if (appended && checkTail != null) {
            // validation ok, check tail
            const beforeTailState = this.state;
            if (this.overwrite === true) {
              consistentTail = checkTail.state;
              checkTail.unshift(this.displayValue.length - details.tailShift);
            }
            let tailDetails = this.appendTail(checkTail);
            appended = tailDetails.rawInserted === checkTail.toString();
  
            // not ok, try shift
            if (!(appended && tailDetails.inserted) && this.overwrite === 'shift') {
              this.state = beforeTailState;
              consistentTail = checkTail.state;
              checkTail.shift();
              tailDetails = this.appendTail(checkTail);
              appended = tailDetails.rawInserted === checkTail.toString();
            }
  
            // if ok, rollback state after tail
            if (appended && tailDetails.inserted) this.state = beforeTailState;
          }
  
          // revert all if something went wrong
          if (!appended) {
            details = new ChangeDetails();
            this.state = consistentState;
            if (checkTail && consistentTail) checkTail.state = consistentTail;
          }
        }
        return details;
      }
  
      /** Appends optional placeholder at the end */
      _appendPlaceholder() {
        return new ChangeDetails();
      }
  
      /** Appends optional eager placeholder at the end */
      _appendEager() {
        return new ChangeDetails();
      }
  
      /** Appends symbols considering flags */
      append(str, flags, tail) {
        if (!isString(str)) throw new Error('value should be string');
        const checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
        if (flags?.tail) flags._beforeTailState = this.state;
        let details;
        [str, details] = this.doPrepare(str, flags);
        for (let ci = 0; ci < str.length; ++ci) {
          const d = this._appendChar(str[ci], flags, checkTail);
          if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail)) break;
          details.aggregate(d);
        }
        if ((this.eager === true || this.eager === 'append') && flags?.input && str) {
          details.aggregate(this._appendEager());
        }
  
        // append tail but aggregate only tailShift
        if (checkTail != null) {
          details.tailShift += this.appendTail(checkTail).tailShift;
          // TODO it's a good idea to clear state after appending ends
          // but it causes bugs when one append calls another (when dynamic dispatch set rawInputValue)
          // this._resetBeforeTailState();
        }
        return details;
      }
      remove(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        this._value = this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
        return new ChangeDetails();
      }
  
      /** Calls function and reapplies current value */
      withValueRefresh(fn) {
        if (this._refreshing || !this._initialized) return fn();
        this._refreshing = true;
        const rawInput = this.rawInputValue;
        const value = this.value;
        const ret = fn();
        this.rawInputValue = rawInput;
        // append lost trailing chars at the end
        if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
          this.append(value.slice(this.displayValue.length), {}, '');
        }
        delete this._refreshing;
        return ret;
      }
      runIsolated(fn) {
        if (this._isolated || !this._initialized) return fn(this);
        this._isolated = true;
        const state = this.state;
        const ret = fn(this);
        this.state = state;
        delete this._isolated;
        return ret;
      }
      doSkipInvalid(ch, flags, checkTail) {
        return Boolean(this.skipInvalid);
      }
  
      /** Prepares string before mask processing */
      doPrepare(str, flags) {
        if (flags === void 0) {
          flags = {};
        }
        return ChangeDetails.normalize(this.prepare ? this.prepare(str, this, flags) : str);
      }
  
      /** Prepares each char before mask processing */
      doPrepareChar(str, flags) {
        if (flags === void 0) {
          flags = {};
        }
        return ChangeDetails.normalize(this.prepareChar ? this.prepareChar(str, this, flags) : str);
      }
  
      /** Validates if value is acceptable */
      doValidate(flags) {
        return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
      }
  
      /** Does additional processing at the end of editing */
      doCommit() {
        if (this.commit) this.commit(this.value, this);
      }
      splice(start, deleteCount, inserted, removeDirection, flags) {
        if (removeDirection === void 0) {
          removeDirection = DIRECTION.NONE;
        }
        if (flags === void 0) {
          flags = {
            input: true
          };
        }
        const tailPos = start + deleteCount;
        const tail = this.extractTail(tailPos);
        const eagerRemove = this.eager === true || this.eager === 'remove';
        let oldRawValue;
        if (eagerRemove) {
          removeDirection = forceDirection(removeDirection);
          oldRawValue = this.extractInput(0, tailPos, {
            raw: true
          });
        }
        let startChangePos = start;
        const details = new ChangeDetails();
  
        // if it is just deletion without insertion
        if (removeDirection !== DIRECTION.NONE) {
          startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);
  
          // adjust tailShift if start was aligned
          details.tailShift = startChangePos - start;
        }
        details.aggregate(this.remove(startChangePos));
        if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
          if (removeDirection === DIRECTION.FORCE_LEFT) {
            let valLength;
            while (oldRawValue === this.rawInputValue && (valLength = this.displayValue.length)) {
              details.aggregate(new ChangeDetails({
                tailShift: -1
              })).aggregate(this.remove(valLength - 1));
            }
          } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
            tail.unshift();
          }
        }
        return details.aggregate(this.append(inserted, flags, tail));
      }
      maskEquals(mask) {
        return this.mask === mask;
      }
      optionsIsChanged(opts) {
        return !objectIncludes(this, opts);
      }
      typedValueEquals(value) {
        const tval = this.typedValue;
        return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || (this.format ? this.format(value, this) === this.format(this.typedValue, this) : false);
      }
    }
    IMask.Masked = Masked;
  
    class ChunksTailDetails {
      /** */
  
      constructor(chunks, from) {
        if (chunks === void 0) {
          chunks = [];
        }
        if (from === void 0) {
          from = 0;
        }
        this.chunks = chunks;
        this.from = from;
      }
      toString() {
        return this.chunks.map(String).join('');
      }
      extend(tailChunk) {
        if (!String(tailChunk)) return;
        tailChunk = isString(tailChunk) ? new ContinuousTailDetails(String(tailChunk)) : tailChunk;
        const lastChunk = this.chunks[this.chunks.length - 1];
        const extendLast = lastChunk && (
        // if stops are same or tail has no stop
        lastChunk.stop === tailChunk.stop || tailChunk.stop == null) &&
        // if tail chunk goes just after last chunk
        tailChunk.from === lastChunk.from + lastChunk.toString().length;
        if (tailChunk instanceof ContinuousTailDetails) {
          // check the ability to extend previous chunk
          if (extendLast) {
            // extend previous chunk
            lastChunk.extend(tailChunk.toString());
          } else {
            // append new chunk
            this.chunks.push(tailChunk);
          }
        } else if (tailChunk instanceof ChunksTailDetails) {
          if (tailChunk.stop == null) {
            // unwrap floating chunks to parent, keeping `from` pos
            let firstTailChunk;
            while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
              firstTailChunk = tailChunk.chunks.shift(); // not possible to be `undefined` because length was checked above
              firstTailChunk.from += tailChunk.from;
              this.extend(firstTailChunk);
            }
          }
  
          // if tail chunk still has value
          if (tailChunk.toString()) {
            // if chunks contains stops, then popup stop to container
            tailChunk.stop = tailChunk.blockIndex;
            this.chunks.push(tailChunk);
          }
        }
      }
      appendTo(masked) {
        if (!(masked instanceof IMask.MaskedPattern)) {
          const tail = new ContinuousTailDetails(this.toString());
          return tail.appendTo(masked);
        }
        const details = new ChangeDetails();
        for (let ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
          const chunk = this.chunks[ci];
          const lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
          const stop = chunk.stop;
          let chunkBlock;
          if (stop != null && (
          // if block not found or stop is behind lastBlock
          !lastBlockIter || lastBlockIter.index <= stop)) {
            if (chunk instanceof ChunksTailDetails ||
            // for continuous block also check if stop is exist
            masked._stops.indexOf(stop) >= 0) {
              const phDetails = masked._appendPlaceholder(stop);
              details.aggregate(phDetails);
            }
            chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
          }
          if (chunkBlock) {
            const tailDetails = chunkBlock.appendTail(chunk);
            tailDetails.skip = false; // always ignore skip, it will be set on last
            details.aggregate(tailDetails);
            masked._value += tailDetails.inserted;
  
            // get not inserted chars
            const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
            if (remainChars) details.aggregate(masked.append(remainChars, {
              tail: true
            }));
          } else {
            details.aggregate(masked.append(chunk.toString(), {
              tail: true
            }));
          }
        }
        return details;
      }
      get state() {
        return {
          chunks: this.chunks.map(c => c.state),
          from: this.from,
          stop: this.stop,
          blockIndex: this.blockIndex
        };
      }
      set state(state) {
        const {
          chunks,
          ...props
        } = state;
        Object.assign(this, props);
        this.chunks = chunks.map(cstate => {
          const chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails();
          chunk.state = cstate;
          return chunk;
        });
      }
      unshift(beforePos) {
        if (!this.chunks.length || beforePos != null && this.from >= beforePos) return '';
        const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
        let ci = 0;
        while (ci < this.chunks.length) {
          const chunk = this.chunks[ci];
          const shiftChar = chunk.unshift(chunkShiftPos);
          if (chunk.toString()) {
            // chunk still contains value
            // but not shifted - means no more available chars to shift
            if (!shiftChar) break;
            ++ci;
          } else {
            // clean if chunk has no value
            this.chunks.splice(ci, 1);
          }
          if (shiftChar) return shiftChar;
        }
        return '';
      }
      shift() {
        if (!this.chunks.length) return '';
        let ci = this.chunks.length - 1;
        while (0 <= ci) {
          const chunk = this.chunks[ci];
          const shiftChar = chunk.shift();
          if (chunk.toString()) {
            // chunk still contains value
            // but not shifted - means no more available chars to shift
            if (!shiftChar) break;
            --ci;
          } else {
            // clean if chunk has no value
            this.chunks.splice(ci, 1);
          }
          if (shiftChar) return shiftChar;
        }
        return '';
      }
    }
  
    class PatternCursor {
      constructor(masked, pos) {
        this.masked = masked;
        this._log = [];
        const {
          offset,
          index
        } = masked._mapPosToBlock(pos) || (pos < 0 ?
        // first
        {
          index: 0,
          offset: 0
        } :
        // last
        {
          index: this.masked._blocks.length,
          offset: 0
        });
        this.offset = offset;
        this.index = index;
        this.ok = false;
      }
      get block() {
        return this.masked._blocks[this.index];
      }
      get pos() {
        return this.masked._blockStartPos(this.index) + this.offset;
      }
      get state() {
        return {
          index: this.index,
          offset: this.offset,
          ok: this.ok
        };
      }
      set state(s) {
        Object.assign(this, s);
      }
      pushState() {
        this._log.push(this.state);
      }
      popState() {
        const s = this._log.pop();
        if (s) this.state = s;
        return s;
      }
      bindBlock() {
        if (this.block) return;
        if (this.index < 0) {
          this.index = 0;
          this.offset = 0;
        }
        if (this.index >= this.masked._blocks.length) {
          this.index = this.masked._blocks.length - 1;
          this.offset = this.block.displayValue.length; // TODO this is stupid type error, `block` depends on index that was changed above
        }
      }
      _pushLeft(fn) {
        this.pushState();
        for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = this.block?.displayValue.length || 0) {
          if (fn()) return this.ok = true;
        }
        return this.ok = false;
      }
      _pushRight(fn) {
        this.pushState();
        for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
          if (fn()) return this.ok = true;
        }
        return this.ok = false;
      }
      pushLeftBeforeFilled() {
        return this._pushLeft(() => {
          if (this.block.isFixed || !this.block.value) return;
          this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_LEFT);
          if (this.offset !== 0) return true;
        });
      }
      pushLeftBeforeInput() {
        // cases:
        // filled input: 00|
        // optional empty input: 00[]|
        // nested block: XX<[]>|
        return this._pushLeft(() => {
          if (this.block.isFixed) return;
          this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
          return true;
        });
      }
      pushLeftBeforeRequired() {
        return this._pushLeft(() => {
          if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
          this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
          return true;
        });
      }
      pushRightBeforeFilled() {
        return this._pushRight(() => {
          if (this.block.isFixed || !this.block.value) return;
          this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_RIGHT);
          if (this.offset !== this.block.value.length) return true;
        });
      }
      pushRightBeforeInput() {
        return this._pushRight(() => {
          if (this.block.isFixed) return;
  
          // const o = this.offset;
          this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
          // HACK cases like (STILL DOES NOT WORK FOR NESTED)
          // aa|X
          // aa<X|[]>X_    - this will not work
          // if (o && o === this.offset && this.block instanceof PatternInputDefinition) continue;
          return true;
        });
      }
      pushRightBeforeRequired() {
        return this._pushRight(() => {
          if (this.block.isFixed || this.block.isOptional && !this.block.value) return;
  
          // TODO check |[*]XX_
          this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
          return true;
        });
      }
    }
  
    class PatternFixedDefinition {
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      constructor(opts) {
        Object.assign(this, opts);
        this._value = '';
        this.isFixed = true;
      }
      get value() {
        return this._value;
      }
      get unmaskedValue() {
        return this.isUnmasking ? this.value : '';
      }
      get rawInputValue() {
        return this._isRawInput ? this.value : '';
      }
      get displayValue() {
        return this.value;
      }
      reset() {
        this._isRawInput = false;
        this._value = '';
      }
      remove(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this._value.length;
        }
        this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
        if (!this._value) this._isRawInput = false;
        return new ChangeDetails();
      }
      nearestInputPos(cursorPos, direction) {
        if (direction === void 0) {
          direction = DIRECTION.NONE;
        }
        const minPos = 0;
        const maxPos = this._value.length;
        switch (direction) {
          case DIRECTION.LEFT:
          case DIRECTION.FORCE_LEFT:
            return minPos;
          case DIRECTION.NONE:
          case DIRECTION.RIGHT:
          case DIRECTION.FORCE_RIGHT:
          default:
            return maxPos;
        }
      }
      totalInputPositions(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this._value.length;
        }
        return this._isRawInput ? toPos - fromPos : 0;
      }
      extractInput(fromPos, toPos, flags) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this._value.length;
        }
        if (flags === void 0) {
          flags = {};
        }
        return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || '';
      }
      get isComplete() {
        return true;
      }
      get isFilled() {
        return Boolean(this._value);
      }
      _appendChar(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        const details = new ChangeDetails();
        if (this.isFilled) return details;
        const appendEager = this.eager === true || this.eager === 'append';
        const appended = this.char === ch;
        const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
        if (isResolved) details.rawInserted = this.char;
        this._value = details.inserted = this.char;
        this._isRawInput = isResolved && (flags.raw || flags.input);
        return details;
      }
      _appendEager() {
        return this._appendChar(this.char, {
          tail: true
        });
      }
      _appendPlaceholder() {
        const details = new ChangeDetails();
        if (this.isFilled) return details;
        this._value = details.inserted = this.char;
        return details;
      }
      extractTail() {
        return new ContinuousTailDetails('');
      }
      appendTail(tail) {
        if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
        return tail.appendTo(this);
      }
      append(str, flags, tail) {
        const details = this._appendChar(str[0], flags);
        if (tail != null) {
          details.tailShift += this.appendTail(tail).tailShift;
        }
        return details;
      }
      doCommit() {}
      get state() {
        return {
          _value: this._value,
          _rawInputValue: this.rawInputValue
        };
      }
      set state(state) {
        this._value = state._value;
        this._isRawInput = Boolean(state._rawInputValue);
      }
    }
  
    class PatternInputDefinition {
      static DEFAULT_DEFINITIONS = {
        '0': /\d/,
        'a': /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
        // http://stackoverflow.com/a/22075070
        '*': /./
      };
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      /** */
  
      constructor(opts) {
        const {
          parent,
          isOptional,
          placeholderChar,
          displayChar,
          lazy,
          eager,
          ...maskOpts
        } = opts;
        this.masked = createMask(maskOpts);
        Object.assign(this, {
          parent,
          isOptional,
          placeholderChar,
          displayChar,
          lazy,
          eager
        });
      }
      reset() {
        this.isFilled = false;
        this.masked.reset();
      }
      remove(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.value.length;
        }
        if (fromPos === 0 && toPos >= 1) {
          this.isFilled = false;
          return this.masked.remove(fromPos, toPos);
        }
        return new ChangeDetails();
      }
      get value() {
        return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : '');
      }
      get unmaskedValue() {
        return this.masked.unmaskedValue;
      }
      get rawInputValue() {
        return this.masked.rawInputValue;
      }
      get displayValue() {
        return this.masked.value && this.displayChar || this.value;
      }
      get isComplete() {
        return Boolean(this.masked.value) || this.isOptional;
      }
      _appendChar(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        if (this.isFilled) return new ChangeDetails();
        const state = this.masked.state;
        // simulate input
        const details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
        if (details.inserted && this.doValidate(flags) === false) {
          details.inserted = details.rawInserted = '';
          this.masked.state = state;
        }
        if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
          details.inserted = this.placeholderChar;
        }
        details.skip = !details.inserted && !this.isOptional;
        this.isFilled = Boolean(details.inserted);
        return details;
      }
      append(str, flags, tail) {
        // TODO probably should be done via _appendChar
        return this.masked.append(str, this.currentMaskFlags(flags), tail);
      }
      _appendPlaceholder() {
        const details = new ChangeDetails();
        if (this.isFilled || this.isOptional) return details;
        this.isFilled = true;
        details.inserted = this.placeholderChar;
        return details;
      }
      _appendEager() {
        return new ChangeDetails();
      }
      extractTail(fromPos, toPos) {
        return this.masked.extractTail(fromPos, toPos);
      }
      appendTail(tail) {
        return this.masked.appendTail(tail);
      }
      extractInput(fromPos, toPos, flags) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.value.length;
        }
        return this.masked.extractInput(fromPos, toPos, flags);
      }
      nearestInputPos(cursorPos, direction) {
        if (direction === void 0) {
          direction = DIRECTION.NONE;
        }
        const minPos = 0;
        const maxPos = this.value.length;
        const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
        switch (direction) {
          case DIRECTION.LEFT:
          case DIRECTION.FORCE_LEFT:
            return this.isComplete ? boundPos : minPos;
          case DIRECTION.RIGHT:
          case DIRECTION.FORCE_RIGHT:
            return this.isComplete ? boundPos : maxPos;
          case DIRECTION.NONE:
          default:
            return boundPos;
        }
      }
      totalInputPositions(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.value.length;
        }
        return this.value.slice(fromPos, toPos).length;
      }
      doValidate(flags) {
        return this.masked.doValidate(this.currentMaskFlags(flags)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)));
      }
      doCommit() {
        this.masked.doCommit();
      }
      get state() {
        return {
          _value: this.value,
          _rawInputValue: this.rawInputValue,
          masked: this.masked.state,
          isFilled: this.isFilled
        };
      }
      set state(state) {
        this.masked.state = state.masked;
        this.isFilled = state.isFilled;
      }
      currentMaskFlags(flags) {
        return {
          ...flags,
          _beforeTailState: flags?._beforeTailState?.masked || flags?._beforeTailState
        };
      }
    }
  
    /** Masking by RegExp */
    class MaskedRegExp extends Masked {
      /** */
  
      /** Enable characters overwriting */
  
      /** */
  
      /** */
  
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        const mask = opts.mask;
        if (mask) opts.validate = value => value.search(mask) >= 0;
        super._update(opts);
      }
    }
    IMask.MaskedRegExp = MaskedRegExp;
  
    /** Pattern mask */
    class MaskedPattern extends Masked {
      static DEFAULTS = {
        lazy: true,
        placeholderChar: '_'
      };
      static STOP_CHAR = '`';
      static ESCAPE_CHAR = '\\';
      static InputDefinition = PatternInputDefinition;
      static FixedDefinition = PatternFixedDefinition;
  
      /** */
  
      /** */
  
      /** Single char for empty input */
  
      /** Single char for filled input */
  
      /** Show placeholder only when needed */
  
      /** Enable characters overwriting */
  
      /** */
  
      /** */
  
      constructor(opts) {
        super({
          ...MaskedPattern.DEFAULTS,
          ...opts,
          definitions: Object.assign({}, PatternInputDefinition.DEFAULT_DEFINITIONS, opts?.definitions)
        });
      }
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        opts.definitions = Object.assign({}, this.definitions, opts.definitions);
        super._update(opts);
        this._rebuildMask();
      }
      _rebuildMask() {
        const defs = this.definitions;
        this._blocks = [];
        this.exposeBlock = undefined;
        this._stops = [];
        this._maskedBlocks = {};
        const pattern = this.mask;
        if (!pattern || !defs) return;
        let unmaskingBlock = false;
        let optionalBlock = false;
        for (let i = 0; i < pattern.length; ++i) {
          if (this.blocks) {
            const p = pattern.slice(i);
            const bNames = Object.keys(this.blocks).filter(bName => p.indexOf(bName) === 0);
            // order by key length
            bNames.sort((a, b) => b.length - a.length);
            // use block name with max length
            const bName = bNames[0];
            if (bName) {
              const {
                expose,
                ...blockOpts
              } = normalizeOpts(this.blocks[bName]);
              const maskedBlock = createMask({
                lazy: this.lazy,
                eager: this.eager,
                placeholderChar: this.placeholderChar,
                displayChar: this.displayChar,
                overwrite: this.overwrite,
                ...blockOpts,
                parent: this
              });
              if (maskedBlock) {
                this._blocks.push(maskedBlock);
                if (expose) this.exposeBlock = maskedBlock;
  
                // store block index
                if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
                this._maskedBlocks[bName].push(this._blocks.length - 1);
              }
              i += bName.length - 1;
              continue;
            }
          }
          let char = pattern[i];
          let isInput = (char in defs);
          if (char === MaskedPattern.STOP_CHAR) {
            this._stops.push(this._blocks.length);
            continue;
          }
          if (char === '{' || char === '}') {
            unmaskingBlock = !unmaskingBlock;
            continue;
          }
          if (char === '[' || char === ']') {
            optionalBlock = !optionalBlock;
            continue;
          }
          if (char === MaskedPattern.ESCAPE_CHAR) {
            ++i;
            char = pattern[i];
            if (!char) break;
            isInput = false;
          }
          const def = isInput ? new PatternInputDefinition({
            isOptional: optionalBlock,
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            ...normalizeOpts(defs[char]),
            parent: this
          }) : new PatternFixedDefinition({
            char,
            eager: this.eager,
            isUnmasking: unmaskingBlock
          });
          this._blocks.push(def);
        }
      }
      get state() {
        return {
          ...super.state,
          _blocks: this._blocks.map(b => b.state)
        };
      }
      set state(state) {
        const {
          _blocks,
          ...maskedState
        } = state;
        this._blocks.forEach((b, bi) => b.state = _blocks[bi]);
        super.state = maskedState;
      }
      reset() {
        super.reset();
        this._blocks.forEach(b => b.reset());
      }
      get isComplete() {
        return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every(b => b.isComplete);
      }
      get isFilled() {
        return this._blocks.every(b => b.isFilled);
      }
      get isFixed() {
        return this._blocks.every(b => b.isFixed);
      }
      get isOptional() {
        return this._blocks.every(b => b.isOptional);
      }
      doCommit() {
        this._blocks.forEach(b => b.doCommit());
        super.doCommit();
      }
      get unmaskedValue() {
        return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((str, b) => str += b.unmaskedValue, '');
      }
      set unmaskedValue(unmaskedValue) {
        if (this.exposeBlock) {
          const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
          this.exposeBlock.unmaskedValue = unmaskedValue;
          this.appendTail(tail);
          this.doCommit();
        } else super.unmaskedValue = unmaskedValue;
      }
      get value() {
        return this.exposeBlock ? this.exposeBlock.value :
        // TODO return _value when not in change?
        this._blocks.reduce((str, b) => str += b.value, '');
      }
      set value(value) {
        if (this.exposeBlock) {
          const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
          this.exposeBlock.value = value;
          this.appendTail(tail);
          this.doCommit();
        } else super.value = value;
      }
      get typedValue() {
        return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
      }
      set typedValue(value) {
        if (this.exposeBlock) {
          const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
          this.exposeBlock.typedValue = value;
          this.appendTail(tail);
          this.doCommit();
        } else super.typedValue = value;
      }
      get displayValue() {
        return this._blocks.reduce((str, b) => str += b.displayValue, '');
      }
      appendTail(tail) {
        return super.appendTail(tail).aggregate(this._appendPlaceholder());
      }
      _appendEager() {
        const details = new ChangeDetails();
        let startBlockIndex = this._mapPosToBlock(this.displayValue.length)?.index;
        if (startBlockIndex == null) return details;
  
        // TODO test if it works for nested pattern masks
        if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
        for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
          const d = this._blocks[bi]._appendEager();
          if (!d.inserted) break;
          details.aggregate(d);
        }
        return details;
      }
      _appendCharRaw(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        const blockIter = this._mapPosToBlock(this.displayValue.length);
        const details = new ChangeDetails();
        if (!blockIter) return details;
        for (let bi = blockIter.index;; ++bi) {
          const block = this._blocks[bi];
          if (!block) break;
          const blockDetails = block._appendChar(ch, {
            ...flags,
            _beforeTailState: flags._beforeTailState?._blocks?.[bi]
          });
          const skip = blockDetails.skip;
          details.aggregate(blockDetails);
          if (skip || blockDetails.rawInserted) break; // go next char
        }
        return details;
      }
      extractTail(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        const chunkTail = new ChunksTailDetails();
        if (fromPos === toPos) return chunkTail;
        this._forEachBlocksInRange(fromPos, toPos, (b, bi, bFromPos, bToPos) => {
          const blockChunk = b.extractTail(bFromPos, bToPos);
          blockChunk.stop = this._findStopBefore(bi);
          blockChunk.from = this._blockStartPos(bi);
          if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
          chunkTail.extend(blockChunk);
        });
        return chunkTail;
      }
      extractInput(fromPos, toPos, flags) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        if (flags === void 0) {
          flags = {};
        }
        if (fromPos === toPos) return '';
        let input = '';
        this._forEachBlocksInRange(fromPos, toPos, (b, _, fromPos, toPos) => {
          input += b.extractInput(fromPos, toPos, flags);
        });
        return input;
      }
      _findStopBefore(blockIndex) {
        let stopBefore;
        for (let si = 0; si < this._stops.length; ++si) {
          const stop = this._stops[si];
          if (stop <= blockIndex) stopBefore = stop;else break;
        }
        return stopBefore;
      }
  
      /** Appends placeholder depending on laziness */
      _appendPlaceholder(toBlockIndex) {
        const details = new ChangeDetails();
        if (this.lazy && toBlockIndex == null) return details;
        const startBlockIter = this._mapPosToBlock(this.displayValue.length);
        if (!startBlockIter) return details;
        const startBlockIndex = startBlockIter.index;
        const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
        this._blocks.slice(startBlockIndex, endBlockIndex).forEach(b => {
          if (!b.lazy || toBlockIndex != null) {
            const bDetails = b._appendPlaceholder(b._blocks?.length);
            this._value += bDetails.inserted;
            details.aggregate(bDetails);
          }
        });
        return details;
      }
  
      /** Finds block in pos */
      _mapPosToBlock(pos) {
        let accVal = '';
        for (let bi = 0; bi < this._blocks.length; ++bi) {
          const block = this._blocks[bi];
          const blockStartPos = accVal.length;
          accVal += block.displayValue;
          if (pos <= accVal.length) {
            return {
              index: bi,
              offset: pos - blockStartPos
            };
          }
        }
      }
      _blockStartPos(blockIndex) {
        return this._blocks.slice(0, blockIndex).reduce((pos, b) => pos += b.displayValue.length, 0);
      }
      _forEachBlocksInRange(fromPos, toPos, fn) {
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        const fromBlockIter = this._mapPosToBlock(fromPos);
        if (fromBlockIter) {
          const toBlockIter = this._mapPosToBlock(toPos);
          // process first block
          const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
          const fromBlockStartPos = fromBlockIter.offset;
          const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].displayValue.length;
          fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
          if (toBlockIter && !isSameBlock) {
            // process intermediate blocks
            for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
              fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
            }
  
            // process last block
            fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
          }
        }
      }
      remove(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        const removeDetails = super.remove(fromPos, toPos);
        this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
          removeDetails.aggregate(b.remove(bFromPos, bToPos));
        });
        return removeDetails;
      }
      nearestInputPos(cursorPos, direction) {
        if (direction === void 0) {
          direction = DIRECTION.NONE;
        }
        if (!this._blocks.length) return 0;
        const cursor = new PatternCursor(this, cursorPos);
        if (direction === DIRECTION.NONE) {
          // -------------------------------------------------
          // NONE should only go out from fixed to the right!
          // -------------------------------------------------
          if (cursor.pushRightBeforeInput()) return cursor.pos;
          cursor.popState();
          if (cursor.pushLeftBeforeInput()) return cursor.pos;
          return this.displayValue.length;
        }
  
        // FORCE is only about a|* otherwise is 0
        if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
          // try to break fast when *|a
          if (direction === DIRECTION.LEFT) {
            cursor.pushRightBeforeFilled();
            if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
            cursor.popState();
          }
  
          // forward flow
          cursor.pushLeftBeforeInput();
          cursor.pushLeftBeforeRequired();
          cursor.pushLeftBeforeFilled();
  
          // backward flow
          if (direction === DIRECTION.LEFT) {
            cursor.pushRightBeforeInput();
            cursor.pushRightBeforeRequired();
            if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
            cursor.popState();
            if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
            cursor.popState();
          }
          if (cursor.ok) return cursor.pos;
          if (direction === DIRECTION.FORCE_LEFT) return 0;
          cursor.popState();
          if (cursor.ok) return cursor.pos;
          cursor.popState();
          if (cursor.ok) return cursor.pos;
          return 0;
        }
        if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
          // forward flow
          cursor.pushRightBeforeInput();
          cursor.pushRightBeforeRequired();
          if (cursor.pushRightBeforeFilled()) return cursor.pos;
          if (direction === DIRECTION.FORCE_RIGHT) return this.displayValue.length;
  
          // backward flow
          cursor.popState();
          if (cursor.ok) return cursor.pos;
          cursor.popState();
          if (cursor.ok) return cursor.pos;
          return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
        }
        return cursorPos;
      }
      totalInputPositions(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        let total = 0;
        this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
          total += b.totalInputPositions(bFromPos, bToPos);
        });
        return total;
      }
  
      /** Get block by name */
      maskedBlock(name) {
        return this.maskedBlocks(name)[0];
      }
  
      /** Get all blocks by name */
      maskedBlocks(name) {
        const indices = this._maskedBlocks[name];
        if (!indices) return [];
        return indices.map(gi => this._blocks[gi]);
      }
    }
    IMask.MaskedPattern = MaskedPattern;
  
    /** Pattern which accepts ranges */
    class MaskedRange extends MaskedPattern {
      /**
        Optionally sets max length of pattern.
        Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
      */
  
      /** Min bound */
  
      /** Max bound */
  
      /** */
  
      get _matchFrom() {
        return this.maxLength - String(this.from).length;
      }
      constructor(opts) {
        super(opts); // mask will be created in _update
      }
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        const {
          to = this.to || 0,
          from = this.from || 0,
          maxLength = this.maxLength || 0,
          autofix = this.autofix,
          ...patternOpts
        } = opts;
        this.to = to;
        this.from = from;
        this.maxLength = Math.max(String(to).length, maxLength);
        this.autofix = autofix;
        const fromStr = String(this.from).padStart(this.maxLength, '0');
        const toStr = String(this.to).padStart(this.maxLength, '0');
        let sameCharsCount = 0;
        while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount]) ++sameCharsCount;
        patternOpts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, '\\0') + '0'.repeat(this.maxLength - sameCharsCount);
        super._update(patternOpts);
      }
      get isComplete() {
        return super.isComplete && Boolean(this.value);
      }
      boundaries(str) {
        let minstr = '';
        let maxstr = '';
        const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
        if (num) {
          minstr = '0'.repeat(placeholder.length) + num;
          maxstr = '9'.repeat(placeholder.length) + num;
        }
        minstr = minstr.padEnd(this.maxLength, '0');
        maxstr = maxstr.padEnd(this.maxLength, '9');
        return [minstr, maxstr];
      }
      doPrepareChar(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        let details;
        [ch, details] = super.doPrepareChar(ch.replace(/\D/g, ''), flags);
        if (!this.autofix || !ch) return [ch, details];
        const fromStr = String(this.from).padStart(this.maxLength, '0');
        const toStr = String(this.to).padStart(this.maxLength, '0');
        const nextVal = this.value + ch;
        if (nextVal.length > this.maxLength) return ['', details];
        const [minstr, maxstr] = this.boundaries(nextVal);
        if (Number(maxstr) < this.from) return [fromStr[nextVal.length - 1], details];
        if (Number(minstr) > this.to) {
          if (this.autofix === 'pad' && nextVal.length < this.maxLength) {
            return ['', details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags))];
          }
          return [toStr[nextVal.length - 1], details];
        }
        return [ch, details];
      }
      doValidate(flags) {
        const str = this.value;
        const firstNonZero = str.search(/[^0]/);
        if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
        const [minstr, maxstr] = this.boundaries(str);
        return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(flags);
      }
    }
    IMask.MaskedRange = MaskedRange;
  
    /** Date mask */
    class MaskedDate extends MaskedPattern {
      static GET_DEFAULT_BLOCKS = () => ({
        d: {
          mask: MaskedRange,
          from: 1,
          to: 31,
          maxLength: 2
        },
        m: {
          mask: MaskedRange,
          from: 1,
          to: 12,
          maxLength: 2
        },
        Y: {
          mask: MaskedRange,
          from: 1900,
          to: 9999
        }
      });
      static DEFAULTS = {
        mask: Date,
        pattern: 'd{.}`m{.}`Y',
        format: (date, masked) => {
          if (!date) return '';
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return [day, month, year].join('.');
        },
        parse: (str, masked) => {
          const [day, month, year] = str.split('.').map(Number);
          return new Date(year, month - 1, day);
        }
      };
      static extractPatternOptions(opts) {
        const {
          mask,
          pattern,
          ...patternOpts
        } = opts;
        return {
          ...patternOpts,
          mask: isString(mask) ? mask : pattern
        };
      }
  
      /** Pattern mask for date according to {@link MaskedDate#format} */
  
      /** Start date */
  
      /** End date */
  
      /** */
  
      /** Format typed value to string */
  
      /** Parse string to get typed value */
  
      constructor(opts) {
        super(MaskedDate.extractPatternOptions({
          ...MaskedDate.DEFAULTS,
          ...opts
        }));
      }
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        const {
          mask,
          pattern,
          blocks,
          ...patternOpts
        } = {
          ...MaskedDate.DEFAULTS,
          ...opts
        };
        const patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
        // adjust year block
        if (opts.min) patternBlocks.Y.from = opts.min.getFullYear();
        if (opts.max) patternBlocks.Y.to = opts.max.getFullYear();
        if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
          patternBlocks.m.from = opts.min.getMonth() + 1;
          patternBlocks.m.to = opts.max.getMonth() + 1;
          if (patternBlocks.m.from === patternBlocks.m.to) {
            patternBlocks.d.from = opts.min.getDate();
            patternBlocks.d.to = opts.max.getDate();
          }
        }
        Object.assign(patternBlocks, this.blocks, blocks);
  
        // add autofix
        Object.keys(patternBlocks).forEach(bk => {
          const b = patternBlocks[bk];
          if (!('autofix' in b) && 'autofix' in opts) b.autofix = opts.autofix;
        });
        super._update({
          ...patternOpts,
          mask: isString(mask) ? mask : pattern,
          blocks: patternBlocks
        });
      }
      doValidate(flags) {
        const date = this.date;
        return super.doValidate(flags) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
      }
  
      /** Checks if date is exists */
      isDateExist(str) {
        return this.format(this.parse(str, this), this).indexOf(str) >= 0;
      }
  
      /** Parsed Date */
      get date() {
        return this.typedValue;
      }
      set date(date) {
        this.typedValue = date;
      }
      get typedValue() {
        return this.isComplete ? super.typedValue : null;
      }
      set typedValue(value) {
        super.typedValue = value;
      }
      maskEquals(mask) {
        return mask === Date || super.maskEquals(mask);
      }
      optionsIsChanged(opts) {
        return super.optionsIsChanged(MaskedDate.extractPatternOptions(opts));
      }
    }
    IMask.MaskedDate = MaskedDate;
  
    /** Dynamic mask for choosing appropriate mask in run-time */
    class MaskedDynamic extends Masked {
      static DEFAULTS;
  
      /** Currently chosen mask */
  
      /** Currently chosen mask */
  
      /** Compliled {@link Masked} options */
  
      /** Chooses {@link Masked} depending on input value */
  
      constructor(opts) {
        super({
          ...MaskedDynamic.DEFAULTS,
          ...opts
        });
        this.currentMask = undefined;
      }
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        super._update(opts);
        if ('mask' in opts) {
          this.exposeMask = undefined;
          // mask could be totally dynamic with only `dispatch` option
          this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map(m => {
            const {
              expose,
              ...maskOpts
            } = normalizeOpts(m);
            const masked = createMask({
              overwrite: this._overwrite,
              eager: this._eager,
              skipInvalid: this._skipInvalid,
              ...maskOpts
            });
            if (expose) this.exposeMask = masked;
            return masked;
          }) : [];
  
          // this.currentMask = this.doDispatch(''); // probably not needed but lets see
        }
      }
      _appendCharRaw(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        const details = this._applyDispatch(ch, flags);
        if (this.currentMask) {
          details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
        }
        return details;
      }
      _applyDispatch(appended, flags, tail) {
        if (appended === void 0) {
          appended = '';
        }
        if (flags === void 0) {
          flags = {};
        }
        if (tail === void 0) {
          tail = '';
        }
        const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
        const inputValue = this.rawInputValue;
        const insertValue = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._rawInputValue : inputValue;
        const tailValue = inputValue.slice(insertValue.length);
        const prevMask = this.currentMask;
        const details = new ChangeDetails();
        const prevMaskState = prevMask?.state;
  
        // clone flags to prevent overwriting `_beforeTailState`
        this.currentMask = this.doDispatch(appended, {
          ...flags
        }, tail);
  
        // restore state after dispatch
        if (this.currentMask) {
          if (this.currentMask !== prevMask) {
            // if mask changed reapply input
            this.currentMask.reset();
            if (insertValue) {
              const d = this.currentMask.append(insertValue, {
                raw: true
              });
              details.tailShift = d.inserted.length - prevValueBeforeTail.length;
            }
            if (tailValue) {
              details.tailShift += this.currentMask.append(tailValue, {
                raw: true,
                tail: true
              }).tailShift;
            }
          } else if (prevMaskState) {
            // Dispatch can do something bad with state, so
            // restore prev mask state
            this.currentMask.state = prevMaskState;
          }
        }
        return details;
      }
      _appendPlaceholder() {
        const details = this._applyDispatch();
        if (this.currentMask) {
          details.aggregate(this.currentMask._appendPlaceholder());
        }
        return details;
      }
      _appendEager() {
        const details = this._applyDispatch();
        if (this.currentMask) {
          details.aggregate(this.currentMask._appendEager());
        }
        return details;
      }
      appendTail(tail) {
        const details = new ChangeDetails();
        if (tail) details.aggregate(this._applyDispatch('', {}, tail));
        return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
      }
      currentMaskFlags(flags) {
        return {
          ...flags,
          _beforeTailState: flags._beforeTailState?.currentMaskRef === this.currentMask && flags._beforeTailState?.currentMask || flags._beforeTailState
        };
      }
      doDispatch(appended, flags, tail) {
        if (flags === void 0) {
          flags = {};
        }
        if (tail === void 0) {
          tail = '';
        }
        return this.dispatch(appended, this, flags, tail);
      }
      doValidate(flags) {
        return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
      }
      doPrepare(str, flags) {
        if (flags === void 0) {
          flags = {};
        }
        let [s, details] = super.doPrepare(str, flags);
        if (this.currentMask) {
          let currentDetails;
          [s, currentDetails] = super.doPrepare(s, this.currentMaskFlags(flags));
          details = details.aggregate(currentDetails);
        }
        return [s, details];
      }
      doPrepareChar(str, flags) {
        if (flags === void 0) {
          flags = {};
        }
        let [s, details] = super.doPrepareChar(str, flags);
        if (this.currentMask) {
          let currentDetails;
          [s, currentDetails] = super.doPrepareChar(s, this.currentMaskFlags(flags));
          details = details.aggregate(currentDetails);
        }
        return [s, details];
      }
      reset() {
        this.currentMask?.reset();
        this.compiledMasks.forEach(m => m.reset());
      }
      get value() {
        return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : '';
      }
      set value(value) {
        if (this.exposeMask) {
          this.exposeMask.value = value;
          this.currentMask = this.exposeMask;
          this._applyDispatch();
        } else super.value = value;
      }
      get unmaskedValue() {
        return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : '';
      }
      set unmaskedValue(unmaskedValue) {
        if (this.exposeMask) {
          this.exposeMask.unmaskedValue = unmaskedValue;
          this.currentMask = this.exposeMask;
          this._applyDispatch();
        } else super.unmaskedValue = unmaskedValue;
      }
      get typedValue() {
        return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : '';
      }
      set typedValue(typedValue) {
        if (this.exposeMask) {
          this.exposeMask.typedValue = typedValue;
          this.currentMask = this.exposeMask;
          this._applyDispatch();
          return;
        }
        let unmaskedValue = String(typedValue);
  
        // double check it
        if (this.currentMask) {
          this.currentMask.typedValue = typedValue;
          unmaskedValue = this.currentMask.unmaskedValue;
        }
        this.unmaskedValue = unmaskedValue;
      }
      get displayValue() {
        return this.currentMask ? this.currentMask.displayValue : '';
      }
      get isComplete() {
        return Boolean(this.currentMask?.isComplete);
      }
      get isFilled() {
        return Boolean(this.currentMask?.isFilled);
      }
      remove(fromPos, toPos) {
        const details = new ChangeDetails();
        if (this.currentMask) {
          details.aggregate(this.currentMask.remove(fromPos, toPos))
          // update with dispatch
          .aggregate(this._applyDispatch());
        }
        return details;
      }
      get state() {
        return {
          ...super.state,
          _rawInputValue: this.rawInputValue,
          compiledMasks: this.compiledMasks.map(m => m.state),
          currentMaskRef: this.currentMask,
          currentMask: this.currentMask?.state
        };
      }
      set state(state) {
        const {
          compiledMasks,
          currentMaskRef,
          currentMask,
          ...maskedState
        } = state;
        if (compiledMasks) this.compiledMasks.forEach((m, mi) => m.state = compiledMasks[mi]);
        if (currentMaskRef != null) {
          this.currentMask = currentMaskRef;
          this.currentMask.state = currentMask;
        }
        super.state = maskedState;
      }
      extractInput(fromPos, toPos, flags) {
        return this.currentMask ? this.currentMask.extractInput(fromPos, toPos, flags) : '';
      }
      extractTail(fromPos, toPos) {
        return this.currentMask ? this.currentMask.extractTail(fromPos, toPos) : super.extractTail(fromPos, toPos);
      }
      doCommit() {
        if (this.currentMask) this.currentMask.doCommit();
        super.doCommit();
      }
      nearestInputPos(cursorPos, direction) {
        return this.currentMask ? this.currentMask.nearestInputPos(cursorPos, direction) : super.nearestInputPos(cursorPos, direction);
      }
      get overwrite() {
        return this.currentMask ? this.currentMask.overwrite : this._overwrite;
      }
      set overwrite(overwrite) {
        this._overwrite = overwrite;
      }
      get eager() {
        return this.currentMask ? this.currentMask.eager : this._eager;
      }
      set eager(eager) {
        this._eager = eager;
      }
      get skipInvalid() {
        return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
      }
      set skipInvalid(skipInvalid) {
        this._skipInvalid = skipInvalid;
      }
      maskEquals(mask) {
        return Array.isArray(mask) ? this.compiledMasks.every((m, mi) => {
          if (!mask[mi]) return;
          const {
            mask: oldMask,
            ...restOpts
          } = mask[mi];
          return objectIncludes(m, restOpts) && m.maskEquals(oldMask);
        }) : super.maskEquals(mask);
      }
      typedValueEquals(value) {
        return Boolean(this.currentMask?.typedValueEquals(value));
      }
    }
    MaskedDynamic.DEFAULTS = {
      dispatch: (appended, masked, flags, tail) => {
        if (!masked.compiledMasks.length) return;
        const inputValue = masked.rawInputValue;
  
        // simulate input
        const inputs = masked.compiledMasks.map((m, index) => {
          const isCurrent = masked.currentMask === m;
          const startInputPos = isCurrent ? m.displayValue.length : m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT);
          if (m.rawInputValue !== inputValue) {
            m.reset();
            m.append(inputValue, {
              raw: true
            });
          } else if (!isCurrent) {
            m.remove(startInputPos);
          }
          m.append(appended, masked.currentMaskFlags(flags));
          m.appendTail(tail);
          return {
            index,
            weight: m.rawInputValue.length,
            totalInputPositions: m.totalInputPositions(0, Math.max(startInputPos, m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT)))
          };
        });
  
        // pop masks with longer values first
        inputs.sort((i1, i2) => i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions);
        return masked.compiledMasks[inputs[0].index];
      }
    };
    IMask.MaskedDynamic = MaskedDynamic;
  
    /** Pattern which validates enum values */
    class MaskedEnum extends MaskedPattern {
      constructor(opts) {
        super(opts); // mask will be created in _update
      }
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        const {
          enum: _enum,
          ...eopts
        } = opts;
        if (_enum) {
          const lengths = _enum.map(e => e.length);
          const requiredLength = Math.min(...lengths);
          const optionalLength = Math.max(...lengths) - requiredLength;
          eopts.mask = '*'.repeat(requiredLength);
          if (optionalLength) eopts.mask += '[' + '*'.repeat(optionalLength) + ']';
          this.enum = _enum;
        }
        super._update(eopts);
      }
      doValidate(flags) {
        return this.enum.some(e => e.indexOf(this.unmaskedValue) === 0) && super.doValidate(flags);
      }
    }
    IMask.MaskedEnum = MaskedEnum;
  
    /** Masking by custom Function */
    class MaskedFunction extends Masked {
      /** */
  
      /** Enable characters overwriting */
  
      /** */
  
      /** */
  
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        super._update({
          ...opts,
          validate: opts.mask
        });
      }
    }
    IMask.MaskedFunction = MaskedFunction;
  
    /** Number mask */
    class MaskedNumber extends Masked {
      static UNMASKED_RADIX = '.';
      static EMPTY_VALUES = [...Masked.EMPTY_VALUES, 0];
      static DEFAULTS = {
        mask: Number,
        radix: ',',
        thousandsSeparator: '',
        mapToRadix: [MaskedNumber.UNMASKED_RADIX],
        min: Number.MIN_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER,
        scale: 2,
        normalizeZeros: true,
        padFractionalZeros: false,
        parse: Number,
        format: n => n.toLocaleString('en-US', {
          useGrouping: false,
          maximumFractionDigits: 20
        })
      };
  
      /** Single char */
  
      /** Single char */
  
      /** Array of single chars */
  
      /** */
  
      /** */
  
      /** Digits after point */
  
      /** Flag to remove leading and trailing zeros in the end of editing */
  
      /** Flag to pad trailing zeros after point in the end of editing */
  
      /** Enable characters overwriting */
  
      /** */
  
      /** */
  
      /** Format typed value to string */
  
      /** Parse string to get typed value */
  
      constructor(opts) {
        super({
          ...MaskedNumber.DEFAULTS,
          ...opts
        });
      }
      updateOptions(opts) {
        super.updateOptions(opts);
      }
      _update(opts) {
        super._update(opts);
        this._updateRegExps();
      }
      _updateRegExps() {
        const start = '^' + (this.allowNegative ? '[+|\\-]?' : '');
        const mid = '\\d*';
        const end = (this.scale ? `(${escapeRegExp(this.radix)}\\d{0,${this.scale}})?` : '') + '$';
        this._numberRegExp = new RegExp(start + mid + end);
        this._mapToRadixRegExp = new RegExp(`[${this.mapToRadix.map(escapeRegExp).join('')}]`, 'g');
        this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), 'g');
      }
      _removeThousandsSeparators(value) {
        return value.replace(this._thousandsSeparatorRegExp, '');
      }
      _insertThousandsSeparators(value) {
        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
        const parts = value.split(this.radix);
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
        return parts.join(this.radix);
      }
      doPrepareChar(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        const [prepCh, details] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && (
        /*
          radix should be mapped when
          1) input is done from keyboard = flags.input && flags.raw
          2) unmasked value is set = !flags.input && !flags.raw
          and should not be mapped when
          1) value is set = flags.input && !flags.raw
          2) raw value is set = !flags.input && flags.raw
        */
        flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch), flags);
        if (ch && !prepCh) details.skip = true;
        if (prepCh && !this.allowPositive && !this.value && prepCh !== '-') details.aggregate(this._appendChar('-'));
        return [prepCh, details];
      }
      _separatorsCount(to, extendOnSeparators) {
        if (extendOnSeparators === void 0) {
          extendOnSeparators = false;
        }
        let count = 0;
        for (let pos = 0; pos < to; ++pos) {
          if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
            ++count;
            if (extendOnSeparators) to += this.thousandsSeparator.length;
          }
        }
        return count;
      }
      _separatorsCountFromSlice(slice) {
        if (slice === void 0) {
          slice = this._value;
        }
        return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
      }
      extractInput(fromPos, toPos, flags) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
        return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
      }
      _appendCharRaw(ch, flags) {
        if (flags === void 0) {
          flags = {};
        }
        if (!this.thousandsSeparator) return super._appendCharRaw(ch, flags);
        const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
        const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
        this._value = this._removeThousandsSeparators(this.value);
        const appendDetails = super._appendCharRaw(ch, flags);
        this._value = this._insertThousandsSeparators(this._value);
        const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
        const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
        appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
        appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
        return appendDetails;
      }
      _findSeparatorAround(pos) {
        if (this.thousandsSeparator) {
          const searchFrom = pos - this.thousandsSeparator.length + 1;
          const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
          if (separatorPos <= pos) return separatorPos;
        }
        return -1;
      }
      _adjustRangeWithSeparators(from, to) {
        const separatorAroundFromPos = this._findSeparatorAround(from);
        if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
        const separatorAroundToPos = this._findSeparatorAround(to);
        if (separatorAroundToPos >= 0) to = separatorAroundToPos + this.thousandsSeparator.length;
        return [from, to];
      }
      remove(fromPos, toPos) {
        if (fromPos === void 0) {
          fromPos = 0;
        }
        if (toPos === void 0) {
          toPos = this.displayValue.length;
        }
        [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
        const valueBeforePos = this.value.slice(0, fromPos);
        const valueAfterPos = this.value.slice(toPos);
        const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
        this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
        const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
        return new ChangeDetails({
          tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
        });
      }
      nearestInputPos(cursorPos, direction) {
        if (!this.thousandsSeparator) return cursorPos;
        switch (direction) {
          case DIRECTION.NONE:
          case DIRECTION.LEFT:
          case DIRECTION.FORCE_LEFT:
            {
              const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
              if (separatorAtLeftPos >= 0) {
                const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
                if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
                  return separatorAtLeftPos;
                }
              }
              break;
            }
          case DIRECTION.RIGHT:
          case DIRECTION.FORCE_RIGHT:
            {
              const separatorAtRightPos = this._findSeparatorAround(cursorPos);
              if (separatorAtRightPos >= 0) {
                return separatorAtRightPos + this.thousandsSeparator.length;
              }
            }
        }
        return cursorPos;
      }
      doValidate(flags) {
        // validate as string
        let valid = Boolean(this._removeThousandsSeparators(this.value).match(this._numberRegExp));
        if (valid) {
          // validate as number
          const number = this.number;
          valid = valid && !isNaN(number) && (
          // check min bound for negative values
          this.min == null || this.min >= 0 || this.min <= this.number) && (
          // check max bound for positive values
          this.max == null || this.max <= 0 || this.number <= this.max);
        }
        return valid && super.doValidate(flags);
      }
      doCommit() {
        if (this.value) {
          const number = this.number;
          let validnum = number;
  
          // check bounds
          if (this.min != null) validnum = Math.max(validnum, this.min);
          if (this.max != null) validnum = Math.min(validnum, this.max);
          if (validnum !== number) this.unmaskedValue = this.format(validnum, this);
          let formatted = this.value;
          if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
          if (this.padFractionalZeros && this.scale > 0) formatted = this._padFractionalZeros(formatted);
          this._value = formatted;
        }
        super.doCommit();
      }
      _normalizeZeros(value) {
        const parts = this._removeThousandsSeparators(value).split(this.radix);
  
        // remove leading zeros
        parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (match, sign, zeros, num) => sign + num);
        // add leading zero
        if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + '0';
        if (parts.length > 1) {
          parts[1] = parts[1].replace(/0*$/, ''); // remove trailing zeros
          if (!parts[1].length) parts.length = 1; // remove fractional
        }
        return this._insertThousandsSeparators(parts.join(this.radix));
      }
      _padFractionalZeros(value) {
        if (!value) return value;
        const parts = value.split(this.radix);
        if (parts.length < 2) parts.push('');
        parts[1] = parts[1].padEnd(this.scale, '0');
        return parts.join(this.radix);
      }
      doSkipInvalid(ch, flags, checkTail) {
        if (flags === void 0) {
          flags = {};
        }
        const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
        return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
      }
      get unmaskedValue() {
        return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
      }
      set unmaskedValue(unmaskedValue) {
        super.unmaskedValue = unmaskedValue;
      }
      get typedValue() {
        return this.parse(this.unmaskedValue, this);
      }
      set typedValue(n) {
        this.rawInputValue = this.format(n, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
      }
  
      /** Parsed Number */
      get number() {
        return this.typedValue;
      }
      set number(number) {
        this.typedValue = number;
      }
  
      /**
        Is negative allowed
      */
      get allowNegative() {
        return this.min != null && this.min < 0 || this.max != null && this.max < 0;
      }
  
      /**
        Is positive allowed
      */
      get allowPositive() {
        return this.min != null && this.min > 0 || this.max != null && this.max > 0;
      }
      typedValueEquals(value) {
        // handle  0 -> '' case (typed = 0 even if value = '')
        // for details see https://github.com/uNmAnNeR/imaskjs/issues/134
        return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === '');
      }
    }
    IMask.MaskedNumber = MaskedNumber;
  
    /** Mask pipe source and destination types */
    const PIPE_TYPE = {
      MASKED: 'value',
      UNMASKED: 'unmaskedValue',
      TYPED: 'typedValue'
    };
    /** Creates new pipe function depending on mask type, source and destination options */
    function createPipe(arg, from, to) {
      if (from === void 0) {
        from = PIPE_TYPE.MASKED;
      }
      if (to === void 0) {
        to = PIPE_TYPE.MASKED;
      }
      const masked = createMask(arg);
      return value => masked.runIsolated(m => {
        m[from] = value;
        return m[to];
      });
    }
  
    /** Pipes value through mask depending on mask type, source and destination options */
    function pipe(value, mask, from, to) {
      return createPipe(mask, from, to)(value);
    }
    IMask.PIPE_TYPE = PIPE_TYPE;
    IMask.createPipe = createPipe;
    IMask.pipe = pipe;
  
    try {
      globalThis.IMask = IMask;
    } catch {}
  
    exports.ChangeDetails = ChangeDetails;
    exports.ChunksTailDetails = ChunksTailDetails;
    exports.DIRECTION = DIRECTION;
    exports.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
    exports.HTMLInputMaskElement = HTMLInputMaskElement;
    exports.HTMLMaskElement = HTMLMaskElement;
    exports.InputMask = InputMask;
    exports.MaskElement = MaskElement;
    exports.Masked = Masked;
    exports.MaskedDate = MaskedDate;
    exports.MaskedDynamic = MaskedDynamic;
    exports.MaskedEnum = MaskedEnum;
    exports.MaskedFunction = MaskedFunction;
    exports.MaskedNumber = MaskedNumber;
    exports.MaskedPattern = MaskedPattern;
    exports.MaskedRange = MaskedRange;
    exports.MaskedRegExp = MaskedRegExp;
    exports.PIPE_TYPE = PIPE_TYPE;
    exports.PatternFixedDefinition = PatternFixedDefinition;
    exports.PatternInputDefinition = PatternInputDefinition;
    exports.createMask = createMask;
    exports.createPipe = createPipe;
    exports.default = IMask;
    exports.forceDirection = forceDirection;
    exports.normalizeOpts = normalizeOpts;
    exports.pipe = pipe;
  
    Object.defineProperty(exports, '__esModule', { value: true });
  
  }));
/*!
 * Masonry PACKAGED v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function i(i,r,a){function h(t,e,n){var o,r="$()."+i+'("'+e+'")';return t.each(function(t,h){var u=a.data(h,i);if(!u)return void s(i+" not initialized. Cannot call methods, i.e. "+r);var d=u[e];if(!d||"_"==e.charAt(0))return void s(r+" is not a valid method");var l=d.apply(u,n);o=void 0===o?l:o}),void 0!==o?o:t}function u(t,e){t.each(function(t,n){var o=a.data(n,i);o?(o.option(e),o._init()):(o=new r(n,e),a.data(n,i,o))})}a=a||e||t.jQuery,a&&(r.prototype.option||(r.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[i]=function(t){if("string"==typeof t){var e=o.call(arguments,1);return h(this,t,e)}return u(this,t),this},n(a))}function n(t){!t||t&&t.bridget||(t.bridget=i)}var o=Array.prototype.slice,r=t.console,s="undefined"==typeof r?function(){}:function(t){r.error(t)};return n(e||t.jQuery),i}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var i=this._events=this._events||{},n=i[t]=i[t]||[];return-1==n.indexOf(e)&&n.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var i=this._onceEvents=this._onceEvents||{},n=i[t]=i[t]||{};return n[e]=!0,this}},e.off=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){var n=i.indexOf(e);return-1!=n&&i.splice(n,1),this}},e.emitEvent=function(t,e){var i=this._events&&this._events[t];if(i&&i.length){i=i.slice(0),e=e||[];for(var n=this._onceEvents&&this._onceEvents[t],o=0;o<i.length;o++){var r=i[o],s=n&&n[r];s&&(this.off(t,r),delete n[r]),r.apply(this,e)}return this}},e.allOff=function(){delete this._events,delete this._onceEvents},t}),function(t,e){"function"==typeof define&&define.amd?define("get-size/get-size",e):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t),i=-1==t.indexOf("%")&&!isNaN(e);return i&&e}function e(){}function i(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;u>e;e++){var i=h[e];t[i]=0}return t}function n(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}function o(){if(!d){d=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var i=document.body||document.documentElement;i.appendChild(e);var o=n(e);s=200==Math.round(t(o.width)),r.isBoxSizeOuter=s,i.removeChild(e)}}function r(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var r=n(e);if("none"==r.display)return i();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var d=a.isBorderBox="border-box"==r.boxSizing,l=0;u>l;l++){var c=h[l],f=r[c],m=parseFloat(f);a[c]=isNaN(m)?0:m}var p=a.paddingLeft+a.paddingRight,g=a.paddingTop+a.paddingBottom,y=a.marginLeft+a.marginRight,v=a.marginTop+a.marginBottom,_=a.borderLeftWidth+a.borderRightWidth,z=a.borderTopWidth+a.borderBottomWidth,E=d&&s,b=t(r.width);b!==!1&&(a.width=b+(E?0:p+_));var x=t(r.height);return x!==!1&&(a.height=x+(E?0:g+z)),a.innerWidth=a.width-(p+_),a.innerHeight=a.height-(g+z),a.outerWidth=a.width+y,a.outerHeight=a.height+v,a}}var s,a="undefined"==typeof console?e:function(t){console.error(t)},h=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],u=h.length,d=!1;return r}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=window.Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],i=0;i<e.length;i++){var n=e[i],o=n+"MatchesSelector";if(t[o])return o}}();return function(e,i){return e[t](i)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(i){return e(t,i)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var i={};i.extend=function(t,e){for(var i in e)t[i]=e[i];return t},i.modulo=function(t,e){return(t%e+e)%e};var n=Array.prototype.slice;i.makeArray=function(t){if(Array.isArray(t))return t;if(null===t||void 0===t)return[];var e="object"==typeof t&&"number"==typeof t.length;return e?n.call(t):[t]},i.removeFrom=function(t,e){var i=t.indexOf(e);-1!=i&&t.splice(i,1)},i.getParent=function(t,i){for(;t.parentNode&&t!=document.body;)if(t=t.parentNode,e(t,i))return t},i.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},i.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},i.filterFindElements=function(t,n){t=i.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!n)return void o.push(t);e(t,n)&&o.push(t);for(var i=t.querySelectorAll(n),r=0;r<i.length;r++)o.push(i[r])}}),o},i.debounceMethod=function(t,e,i){i=i||100;var n=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];clearTimeout(t);var e=arguments,r=this;this[o]=setTimeout(function(){n.apply(r,e),delete r[o]},i)}},i.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?setTimeout(t):document.addEventListener("DOMContentLoaded",t)},i.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,i){return e+"-"+i}).toLowerCase()};var o=t.console;return i.htmlInit=function(e,n){i.docReady(function(){var r=i.toDashed(n),s="data-"+r,a=document.querySelectorAll("["+s+"]"),h=document.querySelectorAll(".js-"+r),u=i.makeArray(a).concat(i.makeArray(h)),d=s+"-options",l=t.jQuery;u.forEach(function(t){var i,r=t.getAttribute(s)||t.getAttribute(d);try{i=r&&JSON.parse(r)}catch(a){return void(o&&o.error("Error parsing "+s+" on "+t.className+": "+a))}var h=new e(t,i);l&&l.data(t,n,h)})})},i}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function i(t){for(var e in t)return!1;return e=null,!0}function n(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}function o(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}var r=document.documentElement.style,s="string"==typeof r.transition?"transition":"WebkitTransition",a="string"==typeof r.transform?"transform":"WebkitTransform",h={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],u={transform:a,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},d=n.prototype=Object.create(t.prototype);d.constructor=n,d._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},d.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},d.getSize=function(){this.size=e(this.element)},d.css=function(t){var e=this.element.style;for(var i in t){var n=u[i]||i;e[n]=t[i]}},d.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),n=t[e?"left":"right"],o=t[i?"top":"bottom"],r=parseFloat(n),s=parseFloat(o),a=this.layout.size;-1!=n.indexOf("%")&&(r=r/100*a.width),-1!=o.indexOf("%")&&(s=s/100*a.height),r=isNaN(r)?0:r,s=isNaN(s)?0:s,r-=e?a.paddingLeft:a.paddingRight,s-=i?a.paddingTop:a.paddingBottom,this.position.x=r,this.position.y=s},d.layoutPosition=function(){var t=this.layout.size,e={},i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),o=i?"paddingLeft":"paddingRight",r=i?"left":"right",s=i?"right":"left",a=this.position.x+t[o];e[r]=this.getXValue(a),e[s]="";var h=n?"paddingTop":"paddingBottom",u=n?"top":"bottom",d=n?"bottom":"top",l=this.position.y+t[h];e[u]=this.getYValue(l),e[d]="",this.css(e),this.emitEvent("layout",[this])},d.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},d.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},d._transitionTo=function(t,e){this.getPosition();var i=this.position.x,n=this.position.y,o=t==this.position.x&&e==this.position.y;if(this.setPosition(t,e),o&&!this.isTransitioning)return void this.layoutPosition();var r=t-i,s=e-n,a={};a.transform=this.getTranslate(r,s),this.transition({to:a,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},d.getTranslate=function(t,e){var i=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop");return t=i?t:-t,e=n?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},d.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},d.moveTo=d._transitionTo,d.setPosition=function(t,e){this.position.x=parseFloat(t),this.position.y=parseFloat(e)},d._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},d.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var i in t.onTransitionEnd)e.onEnd[i]=t.onTransitionEnd[i];for(i in t.to)e.ingProperties[i]=!0,t.isCleaning&&(e.clean[i]=!0);if(t.from){this.css(t.from);var n=this.element.offsetHeight;n=null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var l="opacity,"+o(a);d.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:l,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(h,this,!1)}},d.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},d.onotransitionend=function(t){this.ontransitionend(t)};var c={"-webkit-transform":"transform"};d.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,n=c[t.propertyName]||t.propertyName;if(delete e.ingProperties[n],i(e.ingProperties)&&this.disableTransition(),n in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[n]),n in e.onEnd){var o=e.onEnd[n];o.call(this),delete e.onEnd[n]}this.emitEvent("transitionEnd",[this])}},d.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(h,this,!1),this.isTransitioning=!1},d._removeStyles=function(t){var e={};for(var i in t)e[i]="";this.css(e)};var f={transitionProperty:"",transitionDuration:"",transitionDelay:""};return d.removeTransitionStyles=function(){this.css(f)},d.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},d.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},d.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},d.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("visibleStyle");e[i]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},d.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},d.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var i in e)return i},d.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={},i=this.getHideRevealTransitionEndProperty("hiddenStyle");e[i]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},d.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},d.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},n}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(i,n,o,r){return e(t,i,n,o,r)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,i,n,o){"use strict";function r(t,e){var i=n.getQueryElement(t);if(!i)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(i||t)));this.element=i,u&&(this.$element=u(this.element)),this.options=n.extend({},this.constructor.defaults),this.option(e);var o=++l;this.element.outlayerGUID=o,c[o]=this,this._create();var r=this._getOption("initLayout");r&&this.layout()}function s(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),i=e&&e[1],n=e&&e[2];if(!i.length)return 0;i=parseFloat(i);var o=m[n]||1;return i*o}var h=t.console,u=t.jQuery,d=function(){},l=0,c={};r.namespace="outlayer",r.Item=o,r.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var f=r.prototype;n.extend(f,e.prototype),f.option=function(t){n.extend(this.options,t)},f._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},r.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},f._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),n.extend(this.element.style,this.options.containerStyle);var t=this._getOption("resize");t&&this.bindResize()},f.reloadItems=function(){this.items=this._itemize(this.element.children)},f._itemize=function(t){for(var e=this._filterFindItemElements(t),i=this.constructor.Item,n=[],o=0;o<e.length;o++){var r=e[o],s=new i(r,this);n.push(s)}return n},f._filterFindItemElements=function(t){return n.filterFindElements(t,this.options.itemSelector)},f.getItemElements=function(){return this.items.map(function(t){return t.element})},f.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},f._init=f.layout,f._resetLayout=function(){this.getSize()},f.getSize=function(){this.size=i(this.element)},f._getMeasurement=function(t,e){var n,o=this.options[t];o?("string"==typeof o?n=this.element.querySelector(o):o instanceof HTMLElement&&(n=o),this[t]=n?i(n)[e]:o):this[t]=0},f.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},f._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},f._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var i=[];t.forEach(function(t){var n=this._getItemLayoutPosition(t);n.item=t,n.isInstant=e||t.isLayoutInstant,i.push(n)},this),this._processLayoutQueue(i)}},f._getItemLayoutPosition=function(){return{x:0,y:0}},f._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},f.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},f._positionItem=function(t,e,i,n,o){n?t.goTo(e,i):(t.stagger(o*this.stagger),t.moveTo(e,i))},f._postLayout=function(){this.resizeContainer()},f.resizeContainer=function(){var t=this._getOption("resizeContainer");if(t){var e=this._getContainerSize();e&&(this._setContainerMeasure(e.width,!0),this._setContainerMeasure(e.height,!1))}},f._getContainerSize=d,f._setContainerMeasure=function(t,e){if(void 0!==t){var i=this.size;i.isBorderBox&&(t+=e?i.paddingLeft+i.paddingRight+i.borderLeftWidth+i.borderRightWidth:i.paddingBottom+i.paddingTop+i.borderTopWidth+i.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},f._emitCompleteOnItems=function(t,e){function i(){o.dispatchEvent(t+"Complete",null,[e])}function n(){s++,s==r&&i()}var o=this,r=e.length;if(!e||!r)return void i();var s=0;e.forEach(function(e){e.once(t,n)})},f.dispatchEvent=function(t,e,i){var n=e?[e].concat(i):i;if(this.emitEvent(t,n),u)if(this.$element=this.$element||u(this.element),e){var o=u.Event(e);o.type=t,this.$element.trigger(o,i)}else this.$element.trigger(t,i)},f.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},f.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},f.stamp=function(t){t=this._find(t),t&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},f.unstamp=function(t){t=this._find(t),t&&t.forEach(function(t){n.removeFrom(this.stamps,t),this.unignore(t)},this)},f._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=n.makeArray(t)):void 0},f._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},f._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},f._manageStamp=d,f._getElementOffset=function(t){var e=t.getBoundingClientRect(),n=this._boundingRect,o=i(t),r={left:e.left-n.left-o.marginLeft,top:e.top-n.top-o.marginTop,right:n.right-e.right-o.marginRight,bottom:n.bottom-e.bottom-o.marginBottom};return r},f.handleEvent=n.handleEvent,f.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},f.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},f.onresize=function(){this.resize()},n.debounceMethod(r,"onresize",100),f.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},f.needsResizeLayout=function(){var t=i(this.element),e=this.size&&t;return e&&t.innerWidth!==this.size.innerWidth},f.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},f.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},f.prepended=function(t){var e=this._itemize(t);if(e.length){var i=this.items.slice(0);this.items=e.concat(i),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(i)}},f.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.reveal()})}},f.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,i){t.stagger(i*e),t.hide()})}},f.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},f.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},f.getItem=function(t){for(var e=0;e<this.items.length;e++){var i=this.items[e];if(i.element==t)return i}},f.getItems=function(t){t=n.makeArray(t);var e=[];return t.forEach(function(t){var i=this.getItem(t);i&&e.push(i)},this),e},f.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),n.removeFrom(this.items,t)},this)},f.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete c[e],delete this.element.outlayerGUID,u&&u.removeData(this.element,this.constructor.namespace)},r.data=function(t){t=n.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&c[e]},r.create=function(t,e){var i=s(r);return i.defaults=n.extend({},r.defaults),n.extend(i.defaults,e),i.compatOptions=n.extend({},r.compatOptions),i.namespace=t,i.data=r.data,i.Item=s(o),n.htmlInit(i,t),u&&u.bridget&&u.bridget(t,i),i};var m={ms:1,s:1e3};return r.Item=o,r}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var i=t.create("masonry");i.compatOptions.fitWidth="isFitWidth";var n=i.prototype;return n._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0,this.horizontalColIndex=0},n.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],i=t&&t.element;this.columnWidth=i&&e(i).outerWidth||this.containerWidth}var n=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,r=o/n,s=n-o%n,a=s&&1>s?"round":"floor";r=Math[a](r),this.cols=Math.max(r,1)},n.getContainerWidth=function(){var t=this._getOption("fitWidth"),i=t?this.element.parentNode:this.element,n=e(i);this.containerWidth=n&&n.innerWidth},n._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,i=e&&1>e?"round":"ceil",n=Math[i](t.size.outerWidth/this.columnWidth);n=Math.min(n,this.cols);for(var o=this.options.horizontalOrder?"_getHorizontalColPosition":"_getTopColPosition",r=this[o](n,t),s={x:this.columnWidth*r.col,y:r.y},a=r.y+t.size.outerHeight,h=n+r.col,u=r.col;h>u;u++)this.colYs[u]=a;return s},n._getTopColPosition=function(t){var e=this._getTopColGroup(t),i=Math.min.apply(Math,e);return{col:e.indexOf(i),y:i}},n._getTopColGroup=function(t){if(2>t)return this.colYs;for(var e=[],i=this.cols+1-t,n=0;i>n;n++)e[n]=this._getColGroupY(n,t);return e},n._getColGroupY=function(t,e){if(2>e)return this.colYs[t];var i=this.colYs.slice(t,t+e);return Math.max.apply(Math,i)},n._getHorizontalColPosition=function(t,e){var i=this.horizontalColIndex%this.cols,n=t>1&&i+t>this.cols;i=n?0:i;var o=e.size.outerWidth&&e.size.outerHeight;return this.horizontalColIndex=o?i+t:this.horizontalColIndex,{col:i,y:this._getColGroupY(i,t)}},n._manageStamp=function(t){var i=e(t),n=this._getElementOffset(t),o=this._getOption("originLeft"),r=o?n.left:n.right,s=r+i.outerWidth,a=Math.floor(r/this.columnWidth);a=Math.max(0,a);var h=Math.floor(s/this.columnWidth);h-=s%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var u=this._getOption("originTop"),d=(u?n.top:n.bottom)+i.outerHeight,l=a;h>=l;l++)this.colYs[l]=Math.max(d,this.colYs[l])},n._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},i});
/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/? -backgroundblendmode-csstransforms-csstransitions-inlinesvg-multiplebgs-svg-svgasimg-touchevents-setclasses !*/
!function(e,n,t){function r(e,n){return typeof e===n}function o(){var e,n,t,o,s,i,a;for(var u in _)if(_.hasOwnProperty(u)){if(e=[],n=_[u],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(o=r(n.fn,"function")?n.fn():n.fn,s=0;s<e.length;s++)i=e[s],a=i.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),w.push((o?"":"no-")+a.join("-"))}}function s(e){var n=x.className,t=Modernizr._config.classPrefix||"";if(S&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),S?x.className.baseVal=n:x.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):S?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function a(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function u(e,n){if("object"==typeof e)for(var t in e)b(e,t)&&u(t,e[t]);else{e=e.toLowerCase();var r=e.split("."),o=Modernizr[r[0]];if(2==r.length&&(o=o[r[1]]),"undefined"!=typeof o)return Modernizr;n="function"==typeof n?n():n,1==r.length?Modernizr[r[0]]=n:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=n),s([(n&&0!=n?"":"no-")+r.join("-")]),Modernizr._trigger(e,n)}return Modernizr}function f(){var e=n.body;return e||(e=i(S?"svg":"body"),e.fake=!0),e}function l(e,t,r,o){var s,a,u,l,d="modernizr",c=i("div"),p=f();if(parseInt(r,10))for(;r--;)u=i("div"),u.id=o?o[r]:d+(r+1),c.appendChild(u);return s=i("style"),s.type="text/css",s.id="s"+d,(p.fake?p:c).appendChild(s),p.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(n.createTextNode(e)),c.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",l=x.style.overflow,x.style.overflow="hidden",x.appendChild(p)),a=t(c,e),p.fake?(p.parentNode.removeChild(p),x.style.overflow=l,x.offsetHeight):c.parentNode.removeChild(c),!!a}function d(e,n){return!!~(""+e).indexOf(n)}function c(e,n){return function(){return e.apply(n,arguments)}}function p(e,n,t){var o;for(var s in e)if(e[s]in n)return t===!1?e[s]:(o=n[e[s]],r(o,"function")?c(o,t||n):o);return!1}function h(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function m(n,r){var o=n.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(h(n[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+h(n[o])+":"+r+")");return s=s.join(" or "),l("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==getComputedStyle(e,null).position})}return t}function g(e,n,o,s){function u(){l&&(delete R.style,delete R.modElem)}if(s=r(s,"undefined")?!1:s,!r(o,"undefined")){var f=m(e,o);if(!r(f,"undefined"))return f}for(var l,c,p,h,g,v=["modernizr","tspan","samp"];!R.style&&v.length;)l=!0,R.modElem=i(v.shift()),R.style=R.modElem.style;for(p=e.length,c=0;p>c;c++)if(h=e[c],g=R.style[h],d(h,"-")&&(h=a(h)),R.style[h]!==t){if(s||r(o,"undefined"))return u(),"pfx"==n?h:!0;try{R.style[h]=o}catch(y){}if(R.style[h]!=g)return u(),"pfx"==n?h:!0}return u(),!1}function v(e,n,t,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+z.join(i+" ")+i).split(" ");return r(n,"string")||r(n,"undefined")?g(a,n,o,s):(a=(e+" "+k.join(i+" ")+i).split(" "),p(a,n,t))}function y(e,n,r){return v(e,t,t,n,r)}var w=[],_=[],C={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){_.push({name:e,fn:n,options:t})},addAsyncTest:function(e){_.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=C,Modernizr=new Modernizr,Modernizr.addTest("svg",!!n.createElementNS&&!!n.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect);var x=n.documentElement,S="svg"===x.nodeName.toLowerCase(),T=C._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];C._prefixes=T,Modernizr.addTest("multiplebgs",function(){var e=i("a").style;return e.cssText="background:url(https://),url(https://),red url(https://)",/(url\s*\(.*?){3}/.test(e.background)}),Modernizr.addTest("inlinesvg",function(){var e=i("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"==("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)});var b;!function(){var e={}.hasOwnProperty;b=r(e,"undefined")||r(e.call,"undefined")?function(e,n){return n in e&&r(e.constructor.prototype[n],"undefined")}:function(n,t){return e.call(n,t)}}(),C._l={},C.on=function(e,n){this._l[e]||(this._l[e]=[]),this._l[e].push(n),Modernizr.hasOwnProperty(e)&&setTimeout(function(){Modernizr._trigger(e,Modernizr[e])},0)},C._trigger=function(e,n){if(this._l[e]){var t=this._l[e];setTimeout(function(){var e,r;for(e=0;e<t.length;e++)(r=t[e])(n)},0),delete this._l[e]}},Modernizr._q.push(function(){C.addTest=u}),Modernizr.addTest("svgasimg",n.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"));var E=C.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var r=["@media (",T.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");E(r,function(e){t=9===e.offsetTop})}return t});var P="Moz O ms Webkit",z=C._config.usePrefixes?P.split(" "):[];C._cssomPrefixes=z;var j=function(n){var r,o=T.length,s=e.CSSRule;if("undefined"==typeof s)return t;if(!n)return!1;if(n=n.replace(/^@/,""),r=n.replace(/-/g,"_").toUpperCase()+"_RULE",r in s)return"@"+n;for(var i=0;o>i;i++){var a=T[i],u=a.toUpperCase()+"_"+r;if(u in s)return"@-"+a.toLowerCase()+"-"+n}return!1};C.atRule=j;var k=C._config.usePrefixes?P.toLowerCase().split(" "):[];C._domPrefixes=k;var N={elem:i("modernizr")};Modernizr._q.push(function(){delete N.elem});var R={style:N.elem.style};Modernizr._q.unshift(function(){delete R.style}),C.testAllProps=v;var L=C.prefixed=function(e,n,t){return 0===e.indexOf("@")?j(e):(-1!=e.indexOf("-")&&(e=a(e)),n?v(e,n,t):v(e,"pfx"))};Modernizr.addTest("backgroundblendmode",L("backgroundBlendMode","text")),C.testAllProps=y,Modernizr.addTest("csstransforms",function(){return-1===navigator.userAgent.indexOf("Android 2.")&&y("transform","scale(1)",!0)}),Modernizr.addTest("csstransitions",y("transition","all",!0)),o(),s(w),delete C.addTest,delete C.addAsyncTest;for(var O=0;O<Modernizr._q.length;O++)Modernizr._q[O]();e.Modernizr=Modernizr}(window,document);
(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else if(typeof exports!=="undefined"){module.exports=factory(require("jquery"))}else{factory(jQuery)}})(function($){"use strict";var Slick=window.Slick||{};Slick=function(){var instanceUid=0;function Slick(element,settings){var _=this,dataSettings;_.defaults={accessibility:true,adaptiveHeight:false,appendArrows:$(element),appendDots:$(element),arrows:true,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:false,autoplaySpeed:3e3,centerMode:false,centerPadding:"50px",cssEase:"ease",customPaging:function(slider,i){return $('<button type="button" />').text(i+1)},dots:false,dotsClass:"slick-dots",draggable:true,easing:"linear",edgeFriction:.35,fade:false,focusOnSelect:false,focusOnChange:false,infinite:true,initialSlide:0,lazyLoad:"ondemand",mobileFirst:false,pauseOnHover:true,pauseOnFocus:true,pauseOnDotsHover:false,respondTo:"window",responsive:null,rows:1,rtl:false,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:true,swipeToSlide:false,touchMove:true,touchThreshold:5,useCSS:true,useTransform:true,variableWidth:false,vertical:false,verticalSwiping:false,waitForAnimate:true,zIndex:1e3};_.initials={animating:false,dragging:false,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:false,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:false,slideOffset:0,swipeLeft:null,swiping:false,$list:null,touchObject:{},transformsEnabled:false,unslicked:false};$.extend(_,_.initials);_.activeBreakpoint=null;_.animType=null;_.animProp=null;_.breakpoints=[];_.breakpointSettings=[];_.cssTransitions=false;_.focussed=false;_.interrupted=false;_.hidden="hidden";_.paused=true;_.positionProp=null;_.respondTo=null;_.rowCount=1;_.shouldClick=true;_.$slider=$(element);_.$slidesCache=null;_.transformType=null;_.transitionType=null;_.visibilityChange="visibilitychange";_.windowWidth=0;_.windowTimer=null;dataSettings=$(element).data("slick")||{};_.options=$.extend({},_.defaults,settings,dataSettings);_.currentSlide=_.options.initialSlide;_.originalSettings=_.options;if(typeof document.mozHidden!=="undefined"){_.hidden="mozHidden";_.visibilityChange="mozvisibilitychange"}else if(typeof document.webkitHidden!=="undefined"){_.hidden="webkitHidden";_.visibilityChange="webkitvisibilitychange"}_.autoPlay=$.proxy(_.autoPlay,_);_.autoPlayClear=$.proxy(_.autoPlayClear,_);_.autoPlayIterator=$.proxy(_.autoPlayIterator,_);_.changeSlide=$.proxy(_.changeSlide,_);_.clickHandler=$.proxy(_.clickHandler,_);_.selectHandler=$.proxy(_.selectHandler,_);_.setPosition=$.proxy(_.setPosition,_);_.swipeHandler=$.proxy(_.swipeHandler,_);_.dragHandler=$.proxy(_.dragHandler,_);_.keyHandler=$.proxy(_.keyHandler,_);_.instanceUid=instanceUid++;_.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/;_.registerBreakpoints();_.init(true)}return Slick}();Slick.prototype.activateADA=function(){var _=this;_.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})};Slick.prototype.addSlide=Slick.prototype.slickAdd=function(markup,index,addBefore){var _=this;if(typeof index==="boolean"){addBefore=index;index=null}else if(index<0||index>=_.slideCount){return false}_.unload();if(typeof index==="number"){if(index===0&&_.$slides.length===0){$(markup).appendTo(_.$slideTrack)}else if(addBefore){$(markup).insertBefore(_.$slides.eq(index))}else{$(markup).insertAfter(_.$slides.eq(index))}}else{if(addBefore===true){$(markup).prependTo(_.$slideTrack)}else{$(markup).appendTo(_.$slideTrack)}}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slides.each(function(index,element){$(element).attr("data-slick-index",index)});_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.animateHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.animate({height:targetHeight},_.options.speed)}};Slick.prototype.animateSlide=function(targetLeft,callback){var animProps={},_=this;_.animateHeight();if(_.options.rtl===true&&_.options.vertical===false){targetLeft=-targetLeft}if(_.transformsEnabled===false){if(_.options.vertical===false){_.$slideTrack.animate({left:targetLeft},_.options.speed,_.options.easing,callback)}else{_.$slideTrack.animate({top:targetLeft},_.options.speed,_.options.easing,callback)}}else{if(_.cssTransitions===false){if(_.options.rtl===true){_.currentLeft=-_.currentLeft}$({animStart:_.currentLeft}).animate({animStart:targetLeft},{duration:_.options.speed,easing:_.options.easing,step:function(now){now=Math.ceil(now);if(_.options.vertical===false){animProps[_.animType]="translate("+now+"px, 0px)";_.$slideTrack.css(animProps)}else{animProps[_.animType]="translate(0px,"+now+"px)";_.$slideTrack.css(animProps)}},complete:function(){if(callback){callback.call()}}})}else{_.applyTransition();targetLeft=Math.ceil(targetLeft);if(_.options.vertical===false){animProps[_.animType]="translate3d("+targetLeft+"px, 0px, 0px)"}else{animProps[_.animType]="translate3d(0px,"+targetLeft+"px, 0px)"}_.$slideTrack.css(animProps);if(callback){setTimeout(function(){_.disableTransition();callback.call()},_.options.speed)}}}};Slick.prototype.getNavTarget=function(){var _=this,asNavFor=_.options.asNavFor;if(asNavFor&&asNavFor!==null){asNavFor=$(asNavFor).not(_.$slider)}return asNavFor};Slick.prototype.asNavFor=function(index){var _=this,asNavFor=_.getNavTarget();if(asNavFor!==null&&typeof asNavFor==="object"){asNavFor.each(function(){var target=$(this).slick("getSlick");if(!target.unslicked){target.slideHandler(index,true)}})}};Slick.prototype.applyTransition=function(slide){var _=this,transition={};if(_.options.fade===false){transition[_.transitionType]=_.transformType+" "+_.options.speed+"ms "+_.options.cssEase}else{transition[_.transitionType]="opacity "+_.options.speed+"ms "+_.options.cssEase}if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.autoPlay=function(){var _=this;_.autoPlayClear();if(_.slideCount>_.options.slidesToShow){_.autoPlayTimer=setInterval(_.autoPlayIterator,_.options.autoplaySpeed)}};Slick.prototype.autoPlayClear=function(){var _=this;if(_.autoPlayTimer){clearInterval(_.autoPlayTimer)}};Slick.prototype.autoPlayIterator=function(){var _=this,slideTo=_.currentSlide+_.options.slidesToScroll;if(!_.paused&&!_.interrupted&&!_.focussed){if(_.options.infinite===false){if(_.direction===1&&_.currentSlide+1===_.slideCount-1){_.direction=0}else if(_.direction===0){slideTo=_.currentSlide-_.options.slidesToScroll;if(_.currentSlide-1===0){_.direction=1}}}_.slideHandler(slideTo)}};Slick.prototype.buildArrows=function(){var _=this;if(_.options.arrows===true){_.$prevArrow=$(_.options.prevArrow).addClass("slick-arrow");_.$nextArrow=$(_.options.nextArrow).addClass("slick-arrow");if(_.slideCount>_.options.slidesToShow){_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");_.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.prependTo(_.options.appendArrows)}if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.appendTo(_.options.appendArrows)}if(_.options.infinite!==true){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")}}else{_.$prevArrow.add(_.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"})}}};Slick.prototype.buildDots=function(){var _=this,i,dot;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$slider.addClass("slick-dotted");dot=$("<ul />").addClass(_.options.dotsClass);for(i=0;i<=_.getDotCount();i+=1){dot.append($("<li />").append(_.options.customPaging.call(this,_,i)))}_.$dots=dot.appendTo(_.options.appendDots);_.$dots.find("li").first().addClass("slick-active")}};Slick.prototype.buildOut=function(){var _=this;_.$slides=_.$slider.children(_.options.slide+":not(.slick-cloned)").addClass("slick-slide");_.slideCount=_.$slides.length;_.$slides.each(function(index,element){$(element).attr("data-slick-index",index).data("originalStyling",$(element).attr("style")||"")});_.$slider.addClass("slick-slider");_.$slideTrack=_.slideCount===0?$('<div class="slick-track"/>').appendTo(_.$slider):_.$slides.wrapAll('<div class="slick-track"/>').parent();_.$list=_.$slideTrack.wrap('<div class="slick-list"/>').parent();_.$slideTrack.css("opacity",0);if(_.options.centerMode===true||_.options.swipeToSlide===true){_.options.slidesToScroll=1}$("img[data-lazy]",_.$slider).not("[src]").addClass("slick-loading");_.setupInfinite();_.buildArrows();_.buildDots();_.updateDots();_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);if(_.options.draggable===true){_.$list.addClass("draggable")}};Slick.prototype.buildRows=function(){var _=this,a,b,c,newSlides,numOfSlides,originalSlides,slidesPerSection;newSlides=document.createDocumentFragment();originalSlides=_.$slider.children();if(_.options.rows>0){slidesPerSection=_.options.slidesPerRow*_.options.rows;numOfSlides=Math.ceil(originalSlides.length/slidesPerSection);for(a=0;a<numOfSlides;a++){var slide=document.createElement("div");for(b=0;b<_.options.rows;b++){var row=document.createElement("div");for(c=0;c<_.options.slidesPerRow;c++){var target=a*slidesPerSection+(b*_.options.slidesPerRow+c);if(originalSlides.get(target)){row.appendChild(originalSlides.get(target))}}slide.appendChild(row)}newSlides.appendChild(slide)}_.$slider.empty().append(newSlides);_.$slider.children().children().children().css({width:100/_.options.slidesPerRow+"%",display:"inline-block"})}};Slick.prototype.checkResponsive=function(initial,forceUpdate){var _=this,breakpoint,targetBreakpoint,respondToWidth,triggerBreakpoint=false;var sliderWidth=_.$slider.width();var windowWidth=window.innerWidth||$(window).width();if(_.respondTo==="window"){respondToWidth=windowWidth}else if(_.respondTo==="slider"){respondToWidth=sliderWidth}else if(_.respondTo==="min"){respondToWidth=Math.min(windowWidth,sliderWidth)}if(_.options.responsive&&_.options.responsive.length&&_.options.responsive!==null){targetBreakpoint=null;for(breakpoint in _.breakpoints){if(_.breakpoints.hasOwnProperty(breakpoint)){if(_.originalSettings.mobileFirst===false){if(respondToWidth<_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}else{if(respondToWidth>_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}}}if(targetBreakpoint!==null){if(_.activeBreakpoint!==null){if(targetBreakpoint!==_.activeBreakpoint||forceUpdate){_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{if(_.activeBreakpoint!==null){_.activeBreakpoint=null;_.options=_.originalSettings;if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial);triggerBreakpoint=targetBreakpoint}}if(!initial&&triggerBreakpoint!==false){_.$slider.trigger("breakpoint",[_,triggerBreakpoint])}}};Slick.prototype.changeSlide=function(event,dontAnimate){var _=this,$target=$(event.currentTarget),indexOffset,slideOffset,unevenOffset;if($target.is("a")){event.preventDefault()}if(!$target.is("li")){$target=$target.closest("li")}unevenOffset=_.slideCount%_.options.slidesToScroll!==0;indexOffset=unevenOffset?0:(_.slideCount-_.currentSlide)%_.options.slidesToScroll;switch(event.data.message){case"previous":slideOffset=indexOffset===0?_.options.slidesToScroll:_.options.slidesToShow-indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide-slideOffset,false,dontAnimate)}break;case"next":slideOffset=indexOffset===0?_.options.slidesToScroll:indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide+slideOffset,false,dontAnimate)}break;case"index":var index=event.data.index===0?0:event.data.index||$target.index()*_.options.slidesToScroll;_.slideHandler(_.checkNavigable(index),false,dontAnimate);$target.children().trigger("focus");break;default:return}};Slick.prototype.checkNavigable=function(index){var _=this,navigables,prevNavigable;navigables=_.getNavigableIndexes();prevNavigable=0;if(index>navigables[navigables.length-1]){index=navigables[navigables.length-1]}else{for(var n in navigables){if(index<navigables[n]){index=prevNavigable;break}prevNavigable=navigables[n]}}return index};Slick.prototype.cleanUpEvents=function(){var _=this;if(_.options.dots&&_.$dots!==null){$("li",_.$dots).off("click.slick",_.changeSlide).off("mouseenter.slick",$.proxy(_.interrupt,_,true)).off("mouseleave.slick",$.proxy(_.interrupt,_,false));if(_.options.accessibility===true){_.$dots.off("keydown.slick",_.keyHandler)}}_.$slider.off("focus.slick blur.slick");if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow&&_.$prevArrow.off("click.slick",_.changeSlide);_.$nextArrow&&_.$nextArrow.off("click.slick",_.changeSlide);if(_.options.accessibility===true){_.$prevArrow&&_.$prevArrow.off("keydown.slick",_.keyHandler);_.$nextArrow&&_.$nextArrow.off("keydown.slick",_.keyHandler)}}_.$list.off("touchstart.slick mousedown.slick",_.swipeHandler);_.$list.off("touchmove.slick mousemove.slick",_.swipeHandler);_.$list.off("touchend.slick mouseup.slick",_.swipeHandler);_.$list.off("touchcancel.slick mouseleave.slick",_.swipeHandler);_.$list.off("click.slick",_.clickHandler);$(document).off(_.visibilityChange,_.visibility);_.cleanUpSlideEvents();if(_.options.accessibility===true){_.$list.off("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().off("click.slick",_.selectHandler)}$(window).off("orientationchange.slick.slick-"+_.instanceUid,_.orientationChange);$(window).off("resize.slick.slick-"+_.instanceUid,_.resize);$("[draggable!=true]",_.$slideTrack).off("dragstart",_.preventDefault);$(window).off("load.slick.slick-"+_.instanceUid,_.setPosition)};Slick.prototype.cleanUpSlideEvents=function(){var _=this;_.$list.off("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.off("mouseleave.slick",$.proxy(_.interrupt,_,false))};Slick.prototype.cleanUpRows=function(){var _=this,originalSlides;if(_.options.rows>0){originalSlides=_.$slides.children().children();originalSlides.removeAttr("style");_.$slider.empty().append(originalSlides)}};Slick.prototype.clickHandler=function(event){var _=this;if(_.shouldClick===false){event.stopImmediatePropagation();event.stopPropagation();event.preventDefault()}};Slick.prototype.destroy=function(refresh){var _=this;_.autoPlayClear();_.touchObject={};_.cleanUpEvents();$(".slick-cloned",_.$slider).detach();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.$prevArrow.length){_.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}}if(_.$nextArrow&&_.$nextArrow.length){_.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}}if(_.$slides){_.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){$(this).attr("style",$(this).data("originalStyling"))});_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.detach();_.$list.detach();_.$slider.append(_.$slides)}_.cleanUpRows();_.$slider.removeClass("slick-slider");_.$slider.removeClass("slick-initialized");_.$slider.removeClass("slick-dotted");_.unslicked=true;if(!refresh){_.$slider.trigger("destroy",[_])}};Slick.prototype.disableTransition=function(slide){var _=this,transition={};transition[_.transitionType]="";if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.fadeSlide=function(slideIndex,callback){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).css({zIndex:_.options.zIndex});_.$slides.eq(slideIndex).animate({opacity:1},_.options.speed,_.options.easing,callback)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:1,zIndex:_.options.zIndex});if(callback){setTimeout(function(){_.disableTransition(slideIndex);callback.call()},_.options.speed)}}};Slick.prototype.fadeSlideOut=function(slideIndex){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).animate({opacity:0,zIndex:_.options.zIndex-2},_.options.speed,_.options.easing)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:0,zIndex:_.options.zIndex-2})}};Slick.prototype.filterSlides=Slick.prototype.slickFilter=function(filter){var _=this;if(filter!==null){_.$slidesCache=_.$slides;_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.filter(filter).appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.focusHandler=function(){var _=this;_.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(event){event.stopImmediatePropagation();var $sf=$(this);setTimeout(function(){if(_.options.pauseOnFocus){_.focussed=$sf.is(":focus");_.autoPlay()}},0)})};Slick.prototype.getCurrent=Slick.prototype.slickCurrentSlide=function(){var _=this;return _.currentSlide};Slick.prototype.getDotCount=function(){var _=this;var breakPoint=0;var counter=0;var pagerQty=0;if(_.options.infinite===true){if(_.slideCount<=_.options.slidesToShow){++pagerQty}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}}else if(_.options.centerMode===true){pagerQty=_.slideCount}else if(!_.options.asNavFor){pagerQty=1+Math.ceil((_.slideCount-_.options.slidesToShow)/_.options.slidesToScroll)}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}return pagerQty-1};Slick.prototype.getLeft=function(slideIndex){var _=this,targetLeft,verticalHeight,verticalOffset=0,targetSlide,coef;_.slideOffset=0;verticalHeight=_.$slides.first().outerHeight(true);if(_.options.infinite===true){if(_.slideCount>_.options.slidesToShow){_.slideOffset=_.slideWidth*_.options.slidesToShow*-1;coef=-1;if(_.options.vertical===true&&_.options.centerMode===true){if(_.options.slidesToShow===2){coef=-1.5}else if(_.options.slidesToShow===1){coef=-2}}verticalOffset=verticalHeight*_.options.slidesToShow*coef}if(_.slideCount%_.options.slidesToScroll!==0){if(slideIndex+_.options.slidesToScroll>_.slideCount&&_.slideCount>_.options.slidesToShow){if(slideIndex>_.slideCount){_.slideOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*_.slideWidth*-1;verticalOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*verticalHeight*-1}else{_.slideOffset=_.slideCount%_.options.slidesToScroll*_.slideWidth*-1;verticalOffset=_.slideCount%_.options.slidesToScroll*verticalHeight*-1}}}}else{if(slideIndex+_.options.slidesToShow>_.slideCount){_.slideOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*_.slideWidth;verticalOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*verticalHeight}}if(_.slideCount<=_.options.slidesToShow){_.slideOffset=0;verticalOffset=0}if(_.options.centerMode===true&&_.slideCount<=_.options.slidesToShow){_.slideOffset=_.slideWidth*Math.floor(_.options.slidesToShow)/2-_.slideWidth*_.slideCount/2}else if(_.options.centerMode===true&&_.options.infinite===true){_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)-_.slideWidth}else if(_.options.centerMode===true){_.slideOffset=0;_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)}if(_.options.vertical===false){targetLeft=slideIndex*_.slideWidth*-1+_.slideOffset}else{targetLeft=slideIndex*verticalHeight*-1+verticalOffset}if(_.options.variableWidth===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}if(_.options.centerMode===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow+1)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}targetLeft+=(_.$list.width()-targetSlide.outerWidth())/2}}return targetLeft};Slick.prototype.getOption=Slick.prototype.slickGetOption=function(option){var _=this;return _.options[option]};Slick.prototype.getNavigableIndexes=function(){var _=this,breakPoint=0,counter=0,indexes=[],max;if(_.options.infinite===false){max=_.slideCount}else{breakPoint=_.options.slidesToScroll*-1;counter=_.options.slidesToScroll*-1;max=_.slideCount*2}while(breakPoint<max){indexes.push(breakPoint);breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}return indexes};Slick.prototype.getSlick=function(){return this};Slick.prototype.getSlideCount=function(){var _=this,slidesTraversed,swipedSlide,centerOffset;centerOffset=_.options.centerMode===true?_.slideWidth*Math.floor(_.options.slidesToShow/2):0;if(_.options.swipeToSlide===true){_.$slideTrack.find(".slick-slide").each(function(index,slide){var offsetPoint=slide.offsetLeft,outerSize=$(slide).outerWidth();if(_.options.vertical===true){offsetPoint=slide.offsetTop;outerSize=$(slide).outerHeight()}if(offsetPoint-centerOffset+outerSize/2>_.swipeLeft*-1){swipedSlide=slide;return false}});slidesTraversed=Math.abs($(swipedSlide).attr("data-slick-index")-_.currentSlide)||1;return slidesTraversed}else{return _.options.slidesToScroll}};Slick.prototype.goTo=Slick.prototype.slickGoTo=function(slide,dontAnimate){var _=this;_.changeSlide({data:{message:"index",index:parseInt(slide)}},dontAnimate)};Slick.prototype.init=function(creation){var _=this;if(!$(_.$slider).hasClass("slick-initialized")){$(_.$slider).addClass("slick-initialized");_.buildRows();_.buildOut();_.setProps();_.startLoad();_.loadSlider();_.initializeEvents();_.updateArrows();_.updateDots();_.checkResponsive(true);_.focusHandler()}if(creation){_.$slider.trigger("init",[_])}if(_.options.accessibility===true){_.initADA()}if(_.options.autoplay){_.paused=false;_.autoPlay()}};Slick.prototype.initADA=function(){var _=this,numDotGroups=Math.ceil(_.slideCount/_.options.slidesToShow),tabControlIndexes=_.getNavigableIndexes().filter(function(val){return val>=0&&val<_.slideCount});_.$slides.add(_.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"});if(_.$dots!==null){_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function(i){var slideControlIndex=tabControlIndexes.indexOf(i);$(this).attr({role:"tabpanel",id:"slick-slide"+_.instanceUid+i,tabindex:-1});if(slideControlIndex!==-1){var ariaButtonControl="slick-slide-control"+_.instanceUid+slideControlIndex;if($("#"+ariaButtonControl).length){$(this).attr({"aria-describedby":ariaButtonControl})}}});_.$dots.attr("role","tablist").find("li").each(function(i){var mappedSlideIndex=tabControlIndexes[i];$(this).attr({role:"presentation"});$(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+_.instanceUid+i,"aria-controls":"slick-slide"+_.instanceUid+mappedSlideIndex,"aria-label":i+1+" of "+numDotGroups,"aria-selected":null,tabindex:"-1"})}).eq(_.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end()}for(var i=_.currentSlide,max=i+_.options.slidesToShow;i<max;i++){if(_.options.focusOnChange){_.$slides.eq(i).attr({tabindex:"0"})}else{_.$slides.eq(i).removeAttr("tabindex")}}_.activateADA()};Slick.prototype.initArrowEvents=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},_.changeSlide);_.$nextArrow.off("click.slick").on("click.slick",{message:"next"},_.changeSlide);if(_.options.accessibility===true){_.$prevArrow.on("keydown.slick",_.keyHandler);_.$nextArrow.on("keydown.slick",_.keyHandler)}}};Slick.prototype.initDotEvents=function(){var _=this;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("click.slick",{message:"index"},_.changeSlide);if(_.options.accessibility===true){_.$dots.on("keydown.slick",_.keyHandler)}}if(_.options.dots===true&&_.options.pauseOnDotsHover===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("mouseenter.slick",$.proxy(_.interrupt,_,true)).on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initSlideEvents=function(){var _=this;if(_.options.pauseOnHover){_.$list.on("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initializeEvents=function(){var _=this;_.initArrowEvents();_.initDotEvents();_.initSlideEvents();_.$list.on("touchstart.slick mousedown.slick",{action:"start"},_.swipeHandler);_.$list.on("touchmove.slick mousemove.slick",{action:"move"},_.swipeHandler);_.$list.on("touchend.slick mouseup.slick",{action:"end"},_.swipeHandler);_.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},_.swipeHandler);_.$list.on("click.slick",_.clickHandler);$(document).on(_.visibilityChange,$.proxy(_.visibility,_));if(_.options.accessibility===true){_.$list.on("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}$(window).on("orientationchange.slick.slick-"+_.instanceUid,$.proxy(_.orientationChange,_));$(window).on("resize.slick.slick-"+_.instanceUid,$.proxy(_.resize,_));$("[draggable!=true]",_.$slideTrack).on("dragstart",_.preventDefault);$(window).on("load.slick.slick-"+_.instanceUid,_.setPosition);$(_.setPosition)};Slick.prototype.initUI=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.show();_.$nextArrow.show()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.show()}};Slick.prototype.keyHandler=function(event){var _=this;if(!event.target.tagName.match("TEXTAREA|INPUT|SELECT")){if(event.keyCode===37&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"next":"previous"}})}else if(event.keyCode===39&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"previous":"next"}})}}};Slick.prototype.lazyLoad=function(){var _=this,loadRange,cloneRange,rangeStart,rangeEnd;function loadImages(imagesScope){$("img[data-lazy]",imagesScope).each(function(){var image=$(this),imageSource=$(this).attr("data-lazy"),imageSrcSet=$(this).attr("data-srcset"),imageSizes=$(this).attr("data-sizes")||_.$slider.attr("data-sizes"),imageToLoad=document.createElement("img");imageToLoad.onload=function(){image.animate({opacity:0},100,function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).animate({opacity:1},200,function(){image.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")});_.$slider.trigger("lazyLoaded",[_,image,imageSource])})};imageToLoad.onerror=function(){image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource])};imageToLoad.src=imageSource})}if(_.options.centerMode===true){if(_.options.infinite===true){rangeStart=_.currentSlide+(_.options.slidesToShow/2+1);rangeEnd=rangeStart+_.options.slidesToShow+2}else{rangeStart=Math.max(0,_.currentSlide-(_.options.slidesToShow/2+1));rangeEnd=2+(_.options.slidesToShow/2+1)+_.currentSlide}}else{rangeStart=_.options.infinite?_.options.slidesToShow+_.currentSlide:_.currentSlide;rangeEnd=Math.ceil(rangeStart+_.options.slidesToShow);if(_.options.fade===true){if(rangeStart>0)rangeStart--;if(rangeEnd<=_.slideCount)rangeEnd++}}loadRange=_.$slider.find(".slick-slide").slice(rangeStart,rangeEnd);if(_.options.lazyLoad==="anticipated"){var prevSlide=rangeStart-1,nextSlide=rangeEnd,$slides=_.$slider.find(".slick-slide");for(var i=0;i<_.options.slidesToScroll;i++){if(prevSlide<0)prevSlide=_.slideCount-1;loadRange=loadRange.add($slides.eq(prevSlide));loadRange=loadRange.add($slides.eq(nextSlide));prevSlide--;nextSlide++}}loadImages(loadRange);if(_.slideCount<=_.options.slidesToShow){cloneRange=_.$slider.find(".slick-slide");loadImages(cloneRange)}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow){cloneRange=_.$slider.find(".slick-cloned").slice(0,_.options.slidesToShow);loadImages(cloneRange)}else if(_.currentSlide===0){cloneRange=_.$slider.find(".slick-cloned").slice(_.options.slidesToShow*-1);loadImages(cloneRange)}};Slick.prototype.loadSlider=function(){var _=this;_.setPosition();_.$slideTrack.css({opacity:1});_.$slider.removeClass("slick-loading");_.initUI();if(_.options.lazyLoad==="progressive"){_.progressiveLazyLoad()}};Slick.prototype.next=Slick.prototype.slickNext=function(){var _=this;_.changeSlide({data:{message:"next"}})};Slick.prototype.orientationChange=function(){var _=this;_.checkResponsive();_.setPosition()};Slick.prototype.pause=Slick.prototype.slickPause=function(){var _=this;_.autoPlayClear();_.paused=true};Slick.prototype.play=Slick.prototype.slickPlay=function(){var _=this;_.autoPlay();_.options.autoplay=true;_.paused=false;_.focussed=false;_.interrupted=false};Slick.prototype.postSlide=function(index){var _=this;if(!_.unslicked){_.$slider.trigger("afterChange",[_,index]);_.animating=false;if(_.slideCount>_.options.slidesToShow){_.setPosition()}_.swipeLeft=null;if(_.options.autoplay){_.autoPlay()}if(_.options.accessibility===true){_.initADA();if(_.options.focusOnChange){var $currentSlide=$(_.$slides.get(_.currentSlide));$currentSlide.attr("tabindex",0).focus()}}}};Slick.prototype.prev=Slick.prototype.slickPrev=function(){var _=this;_.changeSlide({data:{message:"previous"}})};Slick.prototype.preventDefault=function(event){event.preventDefault()};Slick.prototype.progressiveLazyLoad=function(tryCount){tryCount=tryCount||1;var _=this,$imgsToLoad=$("img[data-lazy]",_.$slider),image,imageSource,imageSrcSet,imageSizes,imageToLoad;if($imgsToLoad.length){image=$imgsToLoad.first();imageSource=image.attr("data-lazy");imageSrcSet=image.attr("data-srcset");imageSizes=image.attr("data-sizes")||_.$slider.attr("data-sizes");imageToLoad=document.createElement("img");imageToLoad.onload=function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");if(_.options.adaptiveHeight===true){_.setPosition()}_.$slider.trigger("lazyLoaded",[_,image,imageSource]);_.progressiveLazyLoad()};imageToLoad.onerror=function(){if(tryCount<3){setTimeout(function(){_.progressiveLazyLoad(tryCount+1)},500)}else{image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource]);_.progressiveLazyLoad()}};imageToLoad.src=imageSource}else{_.$slider.trigger("allImagesLoaded",[_])}};Slick.prototype.refresh=function(initializing){var _=this,currentSlide,lastVisibleIndex;lastVisibleIndex=_.slideCount-_.options.slidesToShow;if(!_.options.infinite&&_.currentSlide>lastVisibleIndex){_.currentSlide=lastVisibleIndex}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}currentSlide=_.currentSlide;_.destroy(true);$.extend(_,_.initials,{currentSlide:currentSlide});_.init();if(!initializing){_.changeSlide({data:{message:"index",index:currentSlide}},false)}};Slick.prototype.registerBreakpoints=function(){var _=this,breakpoint,currentBreakpoint,l,responsiveSettings=_.options.responsive||null;if($.type(responsiveSettings)==="array"&&responsiveSettings.length){_.respondTo=_.options.respondTo||"window";for(breakpoint in responsiveSettings){l=_.breakpoints.length-1;if(responsiveSettings.hasOwnProperty(breakpoint)){currentBreakpoint=responsiveSettings[breakpoint].breakpoint;while(l>=0){if(_.breakpoints[l]&&_.breakpoints[l]===currentBreakpoint){_.breakpoints.splice(l,1)}l--}_.breakpoints.push(currentBreakpoint);_.breakpointSettings[currentBreakpoint]=responsiveSettings[breakpoint].settings}}_.breakpoints.sort(function(a,b){return _.options.mobileFirst?a-b:b-a})}};Slick.prototype.reinit=function(){var _=this;_.$slides=_.$slideTrack.children(_.options.slide).addClass("slick-slide");_.slideCount=_.$slides.length;if(_.currentSlide>=_.slideCount&&_.currentSlide!==0){_.currentSlide=_.currentSlide-_.options.slidesToScroll}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}_.registerBreakpoints();_.setProps();_.setupInfinite();_.buildArrows();_.updateArrows();_.initArrowEvents();_.buildDots();_.updateDots();_.initDotEvents();_.cleanUpSlideEvents();_.initSlideEvents();_.checkResponsive(false,true);if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);_.setPosition();_.focusHandler();_.paused=!_.options.autoplay;_.autoPlay();_.$slider.trigger("reInit",[_])};Slick.prototype.resize=function(){var _=this;if($(window).width()!==_.windowWidth){clearTimeout(_.windowDelay);_.windowDelay=window.setTimeout(function(){_.windowWidth=$(window).width();_.checkResponsive();if(!_.unslicked){_.setPosition()}},50)}};Slick.prototype.removeSlide=Slick.prototype.slickRemove=function(index,removeBefore,removeAll){var _=this;if(typeof index==="boolean"){removeBefore=index;index=removeBefore===true?0:_.slideCount-1}else{index=removeBefore===true?--index:index}if(_.slideCount<1||index<0||index>_.slideCount-1){return false}_.unload();if(removeAll===true){_.$slideTrack.children().remove()}else{_.$slideTrack.children(this.options.slide).eq(index).remove()}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.setCSS=function(position){var _=this,positionProps={},x,y;if(_.options.rtl===true){position=-position}x=_.positionProp=="left"?Math.ceil(position)+"px":"0px";y=_.positionProp=="top"?Math.ceil(position)+"px":"0px";positionProps[_.positionProp]=position;if(_.transformsEnabled===false){_.$slideTrack.css(positionProps)}else{positionProps={};if(_.cssTransitions===false){positionProps[_.animType]="translate("+x+", "+y+")";_.$slideTrack.css(positionProps)}else{positionProps[_.animType]="translate3d("+x+", "+y+", 0px)";_.$slideTrack.css(positionProps)}}};Slick.prototype.setDimensions=function(){var _=this;if(_.options.vertical===false){if(_.options.centerMode===true){_.$list.css({padding:"0px "+_.options.centerPadding})}}else{_.$list.height(_.$slides.first().outerHeight(true)*_.options.slidesToShow);if(_.options.centerMode===true){_.$list.css({padding:_.options.centerPadding+" 0px"})}}_.listWidth=_.$list.width();_.listHeight=_.$list.height();if(_.options.vertical===false&&_.options.variableWidth===false){_.slideWidth=Math.ceil(_.listWidth/_.options.slidesToShow);_.$slideTrack.width(Math.ceil(_.slideWidth*_.$slideTrack.children(".slick-slide").length))}else if(_.options.variableWidth===true){_.$slideTrack.width(5e3*_.slideCount)}else{_.slideWidth=Math.ceil(_.listWidth);_.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true)*_.$slideTrack.children(".slick-slide").length))}var offset=_.$slides.first().outerWidth(true)-_.$slides.first().width();if(_.options.variableWidth===false)_.$slideTrack.children(".slick-slide").width(_.slideWidth-offset)};Slick.prototype.setFade=function(){var _=this,targetLeft;_.$slides.each(function(index,element){targetLeft=_.slideWidth*index*-1;if(_.options.rtl===true){$(element).css({position:"relative",right:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}else{$(element).css({position:"relative",left:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}});_.$slides.eq(_.currentSlide).css({zIndex:_.options.zIndex-1,opacity:1})};Slick.prototype.setHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.css("height",targetHeight)}};Slick.prototype.setOption=Slick.prototype.slickSetOption=function(){var _=this,l,item,option,value,refresh=false,type;if($.type(arguments[0])==="object"){option=arguments[0];refresh=arguments[1];type="multiple"}else if($.type(arguments[0])==="string"){option=arguments[0];value=arguments[1];refresh=arguments[2];if(arguments[0]==="responsive"&&$.type(arguments[1])==="array"){type="responsive"}else if(typeof arguments[1]!=="undefined"){type="single"}}if(type==="single"){_.options[option]=value}else if(type==="multiple"){$.each(option,function(opt,val){_.options[opt]=val})}else if(type==="responsive"){for(item in value){if($.type(_.options.responsive)!=="array"){_.options.responsive=[value[item]]}else{l=_.options.responsive.length-1;while(l>=0){if(_.options.responsive[l].breakpoint===value[item].breakpoint){_.options.responsive.splice(l,1)}l--}_.options.responsive.push(value[item])}}}if(refresh){_.unload();_.reinit()}};Slick.prototype.setPosition=function(){var _=this;_.setDimensions();_.setHeight();if(_.options.fade===false){_.setCSS(_.getLeft(_.currentSlide))}else{_.setFade()}_.$slider.trigger("setPosition",[_])};Slick.prototype.setProps=function(){var _=this,bodyStyle=document.body.style;_.positionProp=_.options.vertical===true?"top":"left";if(_.positionProp==="top"){_.$slider.addClass("slick-vertical")}else{_.$slider.removeClass("slick-vertical")}if(bodyStyle.WebkitTransition!==undefined||bodyStyle.MozTransition!==undefined||bodyStyle.msTransition!==undefined){if(_.options.useCSS===true){_.cssTransitions=true}}if(_.options.fade){if(typeof _.options.zIndex==="number"){if(_.options.zIndex<3){_.options.zIndex=3}}else{_.options.zIndex=_.defaults.zIndex}}if(bodyStyle.OTransform!==undefined){_.animType="OTransform";_.transformType="-o-transform";_.transitionType="OTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.MozTransform!==undefined){_.animType="MozTransform";_.transformType="-moz-transform";_.transitionType="MozTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.MozPerspective===undefined)_.animType=false}if(bodyStyle.webkitTransform!==undefined){_.animType="webkitTransform";_.transformType="-webkit-transform";_.transitionType="webkitTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.msTransform!==undefined){_.animType="msTransform";_.transformType="-ms-transform";_.transitionType="msTransition";if(bodyStyle.msTransform===undefined)_.animType=false}if(bodyStyle.transform!==undefined&&_.animType!==false){_.animType="transform";_.transformType="transform";_.transitionType="transition"}_.transformsEnabled=_.options.useTransform&&(_.animType!==null&&_.animType!==false)};Slick.prototype.setSlideClasses=function(index){var _=this,centerOffset,allSlides,indexOffset,remainder;allSlides=_.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true");_.$slides.eq(index).addClass("slick-current");if(_.options.centerMode===true){var evenCoef=_.options.slidesToShow%2===0?1:0;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.infinite===true){if(index>=centerOffset&&index<=_.slideCount-1-centerOffset){_.$slides.slice(index-centerOffset+evenCoef,index+centerOffset+1).addClass("slick-active").attr("aria-hidden","false")}else{indexOffset=_.options.slidesToShow+index;allSlides.slice(indexOffset-centerOffset+1+evenCoef,indexOffset+centerOffset+2).addClass("slick-active").attr("aria-hidden","false")}if(index===0){allSlides.eq(allSlides.length-1-_.options.slidesToShow).addClass("slick-center")}else if(index===_.slideCount-1){allSlides.eq(_.options.slidesToShow).addClass("slick-center")}}_.$slides.eq(index).addClass("slick-center")}else{if(index>=0&&index<=_.slideCount-_.options.slidesToShow){_.$slides.slice(index,index+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}else if(allSlides.length<=_.options.slidesToShow){allSlides.addClass("slick-active").attr("aria-hidden","false")}else{remainder=_.slideCount%_.options.slidesToShow;indexOffset=_.options.infinite===true?_.options.slidesToShow+index:index;if(_.options.slidesToShow==_.options.slidesToScroll&&_.slideCount-index<_.options.slidesToShow){allSlides.slice(indexOffset-(_.options.slidesToShow-remainder),indexOffset+remainder).addClass("slick-active").attr("aria-hidden","false")}else{allSlides.slice(indexOffset,indexOffset+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}}}if(_.options.lazyLoad==="ondemand"||_.options.lazyLoad==="anticipated"){_.lazyLoad()}};Slick.prototype.setupInfinite=function(){var _=this,i,slideIndex,infiniteCount;if(_.options.fade===true){_.options.centerMode=false}if(_.options.infinite===true&&_.options.fade===false){slideIndex=null;if(_.slideCount>_.options.slidesToShow){if(_.options.centerMode===true){infiniteCount=_.options.slidesToShow+1}else{infiniteCount=_.options.slidesToShow}for(i=_.slideCount;i>_.slideCount-infiniteCount;i-=1){slideIndex=i-1;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex-_.slideCount).prependTo(_.$slideTrack).addClass("slick-cloned")}for(i=0;i<infiniteCount+_.slideCount;i+=1){slideIndex=i;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex+_.slideCount).appendTo(_.$slideTrack).addClass("slick-cloned")}_.$slideTrack.find(".slick-cloned").find("[id]").each(function(){$(this).attr("id","")})}}};Slick.prototype.interrupt=function(toggle){var _=this;if(!toggle){_.autoPlay()}_.interrupted=toggle};Slick.prototype.selectHandler=function(event){var _=this;var targetElement=$(event.target).is(".slick-slide")?$(event.target):$(event.target).parents(".slick-slide");var index=parseInt(targetElement.attr("data-slick-index"));if(!index)index=0;if(_.slideCount<=_.options.slidesToShow){_.slideHandler(index,false,true);return}_.slideHandler(index)};Slick.prototype.slideHandler=function(index,sync,dontAnimate){var targetSlide,animSlide,oldSlide,slideLeft,targetLeft=null,_=this,navTarget;sync=sync||false;if(_.animating===true&&_.options.waitForAnimate===true){return}if(_.options.fade===true&&_.currentSlide===index){return}if(sync===false){_.asNavFor(index)}targetSlide=index;targetLeft=_.getLeft(targetSlide);slideLeft=_.getLeft(_.currentSlide);_.currentLeft=_.swipeLeft===null?slideLeft:_.swipeLeft;if(_.options.infinite===false&&_.options.centerMode===false&&(index<0||index>_.getDotCount()*_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}else if(_.options.infinite===false&&_.options.centerMode===true&&(index<0||index>_.slideCount-_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}if(_.options.autoplay){clearInterval(_.autoPlayTimer)}if(targetSlide<0){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=_.slideCount-_.slideCount%_.options.slidesToScroll}else{animSlide=_.slideCount+targetSlide}}else if(targetSlide>=_.slideCount){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=0}else{animSlide=targetSlide-_.slideCount}}else{animSlide=targetSlide}_.animating=true;_.$slider.trigger("beforeChange",[_,_.currentSlide,animSlide]);oldSlide=_.currentSlide;_.currentSlide=animSlide;_.setSlideClasses(_.currentSlide);if(_.options.asNavFor){navTarget=_.getNavTarget();navTarget=navTarget.slick("getSlick");if(navTarget.slideCount<=navTarget.options.slidesToShow){navTarget.setSlideClasses(_.currentSlide)}}_.updateDots();_.updateArrows();if(_.options.fade===true){if(dontAnimate!==true){_.fadeSlideOut(oldSlide);_.fadeSlide(animSlide,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}_.animateHeight();return}if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(targetLeft,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}};Slick.prototype.startLoad=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.hide();_.$nextArrow.hide()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.hide()}_.$slider.addClass("slick-loading")};Slick.prototype.swipeDirection=function(){var xDist,yDist,r,swipeAngle,_=this;xDist=_.touchObject.startX-_.touchObject.curX;yDist=_.touchObject.startY-_.touchObject.curY;r=Math.atan2(yDist,xDist);swipeAngle=Math.round(r*180/Math.PI);if(swipeAngle<0){swipeAngle=360-Math.abs(swipeAngle)}if(swipeAngle<=45&&swipeAngle>=0){return _.options.rtl===false?"left":"right"}if(swipeAngle<=360&&swipeAngle>=315){return _.options.rtl===false?"left":"right"}if(swipeAngle>=135&&swipeAngle<=225){return _.options.rtl===false?"right":"left"}if(_.options.verticalSwiping===true){if(swipeAngle>=35&&swipeAngle<=135){return"down"}else{return"up"}}return"vertical"};Slick.prototype.swipeEnd=function(event){var _=this,slideCount,direction;_.dragging=false;_.swiping=false;if(_.scrolling){_.scrolling=false;return false}_.interrupted=false;_.shouldClick=_.touchObject.swipeLength>10?false:true;if(_.touchObject.curX===undefined){return false}if(_.touchObject.edgeHit===true){_.$slider.trigger("edge",[_,_.swipeDirection()])}if(_.touchObject.swipeLength>=_.touchObject.minSwipe){direction=_.swipeDirection();switch(direction){case"left":case"down":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide+_.getSlideCount()):_.currentSlide+_.getSlideCount();_.currentDirection=0;break;case"right":case"up":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide-_.getSlideCount()):_.currentSlide-_.getSlideCount();_.currentDirection=1;break;default:}if(direction!="vertical"){_.slideHandler(slideCount);_.touchObject={};_.$slider.trigger("swipe",[_,direction])}}else{if(_.touchObject.startX!==_.touchObject.curX){_.slideHandler(_.currentSlide);_.touchObject={}}}};Slick.prototype.swipeHandler=function(event){var _=this;if(_.options.swipe===false||"ontouchend"in document&&_.options.swipe===false){return}else if(_.options.draggable===false&&event.type.indexOf("mouse")!==-1){return}_.touchObject.fingerCount=event.originalEvent&&event.originalEvent.touches!==undefined?event.originalEvent.touches.length:1;_.touchObject.minSwipe=_.listWidth/_.options.touchThreshold;if(_.options.verticalSwiping===true){_.touchObject.minSwipe=_.listHeight/_.options.touchThreshold}switch(event.data.action){case"start":_.swipeStart(event);break;case"move":_.swipeMove(event);break;case"end":_.swipeEnd(event);break}};Slick.prototype.swipeMove=function(event){var _=this,edgeWasHit=false,curLeft,swipeDirection,swipeLength,positionOffset,touches,verticalSwipeLength;touches=event.originalEvent!==undefined?event.originalEvent.touches:null;if(!_.dragging||_.scrolling||touches&&touches.length!==1){return false}curLeft=_.getLeft(_.currentSlide);_.touchObject.curX=touches!==undefined?touches[0].pageX:event.clientX;_.touchObject.curY=touches!==undefined?touches[0].pageY:event.clientY;_.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curX-_.touchObject.startX,2)));verticalSwipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curY-_.touchObject.startY,2)));if(!_.options.verticalSwiping&&!_.swiping&&verticalSwipeLength>4){_.scrolling=true;return false}if(_.options.verticalSwiping===true){_.touchObject.swipeLength=verticalSwipeLength}swipeDirection=_.swipeDirection();if(event.originalEvent!==undefined&&_.touchObject.swipeLength>4){_.swiping=true;event.preventDefault()}positionOffset=(_.options.rtl===false?1:-1)*(_.touchObject.curX>_.touchObject.startX?1:-1);if(_.options.verticalSwiping===true){positionOffset=_.touchObject.curY>_.touchObject.startY?1:-1}swipeLength=_.touchObject.swipeLength;_.touchObject.edgeHit=false;if(_.options.infinite===false){if(_.currentSlide===0&&swipeDirection==="right"||_.currentSlide>=_.getDotCount()&&swipeDirection==="left"){swipeLength=_.touchObject.swipeLength*_.options.edgeFriction;_.touchObject.edgeHit=true}}if(_.options.vertical===false){_.swipeLeft=curLeft+swipeLength*positionOffset}else{_.swipeLeft=curLeft+swipeLength*(_.$list.height()/_.listWidth)*positionOffset}if(_.options.verticalSwiping===true){_.swipeLeft=curLeft+swipeLength*positionOffset}if(_.options.fade===true||_.options.touchMove===false){return false}if(_.animating===true){_.swipeLeft=null;return false}_.setCSS(_.swipeLeft)};Slick.prototype.swipeStart=function(event){var _=this,touches;_.interrupted=true;if(_.touchObject.fingerCount!==1||_.slideCount<=_.options.slidesToShow){_.touchObject={};return false}if(event.originalEvent!==undefined&&event.originalEvent.touches!==undefined){touches=event.originalEvent.touches[0]}_.touchObject.startX=_.touchObject.curX=touches!==undefined?touches.pageX:event.clientX;_.touchObject.startY=_.touchObject.curY=touches!==undefined?touches.pageY:event.clientY;_.dragging=true};Slick.prototype.unfilterSlides=Slick.prototype.slickUnfilter=function(){var _=this;if(_.$slidesCache!==null){_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.unload=function(){var _=this;$(".slick-cloned",_.$slider).remove();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}if(_.$nextArrow&&_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}_.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")};Slick.prototype.unslick=function(fromBreakpoint){var _=this;_.$slider.trigger("unslick",[_,fromBreakpoint]);_.destroy()};Slick.prototype.updateArrows=function(){var _=this,centerOffset;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow&&!_.options.infinite){_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false");if(_.currentSlide===0){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow&&_.options.centerMode===false){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-1&&_.options.centerMode===true){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}}};Slick.prototype.updateDots=function(){var _=this;if(_.$dots!==null){_.$dots.find("li").removeClass("slick-active").end();_.$dots.find("li").eq(Math.floor(_.currentSlide/_.options.slidesToScroll)).addClass("slick-active")}};Slick.prototype.visibility=function(){var _=this;if(_.options.autoplay){if(document[_.hidden]){_.interrupted=true}else{_.interrupted=false}}};$.fn.slick=function(){var _=this,opt=arguments[0],args=Array.prototype.slice.call(arguments,1),l=_.length,i,ret;for(i=0;i<l;i++){if(typeof opt=="object"||typeof opt=="undefined")_[i].slick=new Slick(_[i],opt);else ret=_[i].slick[opt].apply(_[i].slick,args);if(typeof ret!="undefined")return ret}return _}});
/**
 * Swiper 11.0.5
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * https://swiperjs.com
 *
 * Copyright 2014-2023 Vladimir Kharlampidi
 *
 * Released under the MIT License
 *
 * Released on: November 22, 2023
 */

var Swiper = function () {
    "use strict";

    function e(e) {
        return null !== e && "object" == typeof e && "constructor" in e && e.constructor === Object
    }

    function t(s, a) {
        void 0 === s && (s = {}), void 0 === a && (a = {}), Object.keys(a).forEach((i => {
            void 0 === s[i] ? s[i] = a[i] : e(a[i]) && e(s[i]) && Object.keys(a[i]).length > 0 && t(s[i], a[i])
        }))
    }
    const s = {
        body: {},
        addEventListener() {},
        removeEventListener() {},
        activeElement: {
            blur() {},
            nodeName: ""
        },
        querySelector: () => null,
        querySelectorAll: () => [],
        getElementById: () => null,
        createEvent: () => ({
            initEvent() {}
        }),
        createElement: () => ({
            children: [],
            childNodes: [],
            style: {},
            setAttribute() {},
            getElementsByTagName: () => []
        }),
        createElementNS: () => ({}),
        importNode: () => null,
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        }
    };

    function a() {
        const e = "undefined" != typeof document ? document : {};
        return t(e, s), e
    }
    const i = {
        document: s,
        navigator: {
            userAgent: ""
        },
        location: {
            hash: "",
            host: "",
            hostname: "",
            href: "",
            origin: "",
            pathname: "",
            protocol: "",
            search: ""
        },
        history: {
            replaceState() {},
            pushState() {},
            go() {},
            back() {}
        },
        CustomEvent: function () {
            return this
        },
        addEventListener() {},
        removeEventListener() {},
        getComputedStyle: () => ({
            getPropertyValue: () => ""
        }),
        Image() {},
        Date() {},
        screen: {},
        setTimeout() {},
        clearTimeout() {},
        matchMedia: () => ({}),
        requestAnimationFrame: e => "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
        cancelAnimationFrame(e) {
            "undefined" != typeof setTimeout && clearTimeout(e)
        }
    };

    function r() {
        const e = "undefined" != typeof window ? window : {};
        return t(e, i), e
    }

    function n(e) {
        return void 0 === e && (e = ""), e.trim().split(" ").filter((e => !!e.trim()))
    }

    function l(e, t) {
        return void 0 === t && (t = 0), setTimeout(e, t)
    }

    function o() {
        return Date.now()
    }

    function d(e, t) {
        void 0 === t && (t = "x");
        const s = r();
        let a, i, n;
        const l = function (e) {
            const t = r();
            let s;
            return t.getComputedStyle && (s = t.getComputedStyle(e, null)), !s && e.currentStyle && (s = e.currentStyle), s || (s = e.style), s
        }(e);
        return s.WebKitCSSMatrix ? (i = l.transform || l.webkitTransform, i.split(",").length > 6 && (i = i.split(", ").map((e => e.replace(",", "."))).join(", ")), n = new s.WebKitCSSMatrix("none" === i ? "" : i)) : (n = l.MozTransform || l.OTransform || l.MsTransform || l.msTransform || l.transform || l.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), a = n.toString().split(",")), "x" === t && (i = s.WebKitCSSMatrix ? n.m41 : 16 === a.length ? parseFloat(a[12]) : parseFloat(a[4])), "y" === t && (i = s.WebKitCSSMatrix ? n.m42 : 16 === a.length ? parseFloat(a[13]) : parseFloat(a[5])), i || 0
    }

    function c(e) {
        return "object" == typeof e && null !== e && e.constructor && "Object" === Object.prototype.toString.call(e).slice(8, -1)
    }

    function p() {
        const e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
            t = ["__proto__", "constructor", "prototype"];
        for (let a = 1; a < arguments.length; a += 1) {
            const i = a < 0 || arguments.length <= a ? void 0 : arguments[a];
            if (null != i && (s = i, !("undefined" != typeof window && void 0 !== window.HTMLElement ? s instanceof HTMLElement : s && (1 === s.nodeType || 11 === s.nodeType)))) {
                const s = Object.keys(Object(i)).filter((e => t.indexOf(e) < 0));
                for (let t = 0, a = s.length; t < a; t += 1) {
                    const a = s[t],
                        r = Object.getOwnPropertyDescriptor(i, a);
                    void 0 !== r && r.enumerable && (c(e[a]) && c(i[a]) ? i[a].__swiper__ ? e[a] = i[a] : p(e[a], i[a]) : !c(e[a]) && c(i[a]) ? (e[a] = {}, i[a].__swiper__ ? e[a] = i[a] : p(e[a], i[a])) : e[a] = i[a])
                }
            }
        }
        var s;
        return e
    }

    function u(e, t, s) {
        e.style.setProperty(t, s)
    }

    function m(e) {
        let {
            swiper: t,
            targetPosition: s,
            side: a
        } = e;
        const i = r(),
            n = -t.translate;
        let l, o = null;
        const d = t.params.speed;
        t.wrapperEl.style.scrollSnapType = "none", i.cancelAnimationFrame(t.cssModeFrameID);
        const c = s > n ? "next" : "prev",
            p = (e, t) => "next" === c && e >= t || "prev" === c && e <= t,
            u = () => {
                l = (new Date).getTime(), null === o && (o = l);
                const e = Math.max(Math.min((l - o) / d, 1), 0),
                    r = .5 - Math.cos(e * Math.PI) / 2;
                let c = n + r * (s - n);
                if (p(c, s) && (c = s), t.wrapperEl.scrollTo({
                        [a]: c
                    }), p(c, s)) return t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.scrollSnapType = "", setTimeout((() => {
                    t.wrapperEl.style.overflow = "", t.wrapperEl.scrollTo({
                        [a]: c
                    })
                })), void i.cancelAnimationFrame(t.cssModeFrameID);
                t.cssModeFrameID = i.requestAnimationFrame(u)
            };
        u()
    }

    function h(e) {
        return e.querySelector(".swiper-slide-transform") || e.shadowRoot && e.shadowRoot.querySelector(".swiper-slide-transform") || e
    }

    function f(e, t) {
        return void 0 === t && (t = ""), [...e.children].filter((e => e.matches(t)))
    }

    function g(e) {
        try {
            return void console.warn(e)
        } catch (e) {}
    }

    function v(e, t) {
        void 0 === t && (t = []);
        const s = document.createElement(e);
        return s.classList.add(...Array.isArray(t) ? t : n(t)), s
    }

    function w(e) {
        const t = r(),
            s = a(),
            i = e.getBoundingClientRect(),
            n = s.body,
            l = e.clientTop || n.clientTop || 0,
            o = e.clientLeft || n.clientLeft || 0,
            d = e === t ? t.scrollY : e.scrollTop,
            c = e === t ? t.scrollX : e.scrollLeft;
        return {
            top: i.top + d - l,
            left: i.left + c - o
        }
    }

    function b(e, t) {
        return r().getComputedStyle(e, null).getPropertyValue(t)
    }

    function y(e) {
        let t, s = e;
        if (s) {
            for (t = 0; null !== (s = s.previousSibling);) 1 === s.nodeType && (t += 1);
            return t
        }
    }

    function E(e, t) {
        const s = [];
        let a = e.parentElement;
        for (; a;) t ? a.matches(t) && s.push(a) : s.push(a), a = a.parentElement;
        return s
    }

    function x(e, t) {
        t && e.addEventListener("transitionend", (function s(a) {
            a.target === e && (t.call(e, a), e.removeEventListener("transitionend", s))
        }))
    }

    function S(e, t, s) {
        const a = r();
        return s ? e["width" === t ? "offsetWidth" : "offsetHeight"] + parseFloat(a.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-right" : "margin-top")) + parseFloat(a.getComputedStyle(e, null).getPropertyValue("width" === t ? "margin-left" : "margin-bottom")) : e.offsetWidth
    }
    let T, M, C;

    function P() {
        return T || (T = function () {
            const e = r(),
                t = a();
            return {
                smoothScroll: t.documentElement && t.documentElement.style && "scrollBehavior" in t.documentElement.style,
                touch: !!("ontouchstart" in e || e.DocumentTouch && t instanceof e.DocumentTouch)
            }
        }()), T
    }

    function L(e) {
        return void 0 === e && (e = {}), M || (M = function (e) {
            let {
                userAgent: t
            } = void 0 === e ? {} : e;
            const s = P(),
                a = r(),
                i = a.navigator.platform,
                n = t || a.navigator.userAgent,
                l = {
                    ios: !1,
                    android: !1
                },
                o = a.screen.width,
                d = a.screen.height,
                c = n.match(/(Android);?[\s\/]+([\d.]+)?/);
            let p = n.match(/(iPad).*OS\s([\d_]+)/);
            const u = n.match(/(iPod)(.*OS\s([\d_]+))?/),
                m = !p && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
                h = "Win32" === i;
            let f = "MacIntel" === i;
            return !p && f && s.touch && ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"].indexOf(`${o}x${d}`) >= 0 && (p = n.match(/(Version)\/([\d.]+)/), p || (p = [0, 1, "13_0_0"]), f = !1), c && !h && (l.os = "android", l.android = !0), (p || m || u) && (l.os = "ios", l.ios = !0), l
        }(e)), M
    }

    function A() {
        return C || (C = function () {
            const e = r();
            let t = !1;

            function s() {
                const t = e.navigator.userAgent.toLowerCase();
                return t.indexOf("safari") >= 0 && t.indexOf("chrome") < 0 && t.indexOf("android") < 0
            }
            if (s()) {
                const s = String(e.navigator.userAgent);
                if (s.includes("Version/")) {
                    const [e, a] = s.split("Version/")[1].split(" ")[0].split(".").map((e => Number(e)));
                    t = e < 16 || 16 === e && a < 2
                }
            }
            return {
                isSafari: t || s(),
                needPerspectiveFix: t,
                isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent)
            }
        }()), C
    }
    var I = {
        on(e, t, s) {
            const a = this;
            if (!a.eventsListeners || a.destroyed) return a;
            if ("function" != typeof t) return a;
            const i = s ? "unshift" : "push";
            return e.split(" ").forEach((e => {
                a.eventsListeners[e] || (a.eventsListeners[e] = []), a.eventsListeners[e][i](t)
            })), a
        },
        once(e, t, s) {
            const a = this;
            if (!a.eventsListeners || a.destroyed) return a;
            if ("function" != typeof t) return a;

            function i() {
                a.off(e, i), i.__emitterProxy && delete i.__emitterProxy;
                for (var s = arguments.length, r = new Array(s), n = 0; n < s; n++) r[n] = arguments[n];
                t.apply(a, r)
            }
            return i.__emitterProxy = t, a.on(e, i, s)
        },
        onAny(e, t) {
            const s = this;
            if (!s.eventsListeners || s.destroyed) return s;
            if ("function" != typeof e) return s;
            const a = t ? "unshift" : "push";
            return s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[a](e), s
        },
        offAny(e) {
            const t = this;
            if (!t.eventsListeners || t.destroyed) return t;
            if (!t.eventsAnyListeners) return t;
            const s = t.eventsAnyListeners.indexOf(e);
            return s >= 0 && t.eventsAnyListeners.splice(s, 1), t
        },
        off(e, t) {
            const s = this;
            return !s.eventsListeners || s.destroyed ? s : s.eventsListeners ? (e.split(" ").forEach((e => {
                void 0 === t ? s.eventsListeners[e] = [] : s.eventsListeners[e] && s.eventsListeners[e].forEach(((a, i) => {
                    (a === t || a.__emitterProxy && a.__emitterProxy === t) && s.eventsListeners[e].splice(i, 1)
                }))
            })), s) : s
        },
        emit() {
            const e = this;
            if (!e.eventsListeners || e.destroyed) return e;
            if (!e.eventsListeners) return e;
            let t, s, a;
            for (var i = arguments.length, r = new Array(i), n = 0; n < i; n++) r[n] = arguments[n];
            "string" == typeof r[0] || Array.isArray(r[0]) ? (t = r[0], s = r.slice(1, r.length), a = e) : (t = r[0].events, s = r[0].data, a = r[0].context || e), s.unshift(a);
            return (Array.isArray(t) ? t : t.split(" ")).forEach((t => {
                e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((e => {
                    e.apply(a, [t, ...s])
                })), e.eventsListeners && e.eventsListeners[t] && e.eventsListeners[t].forEach((e => {
                    e.apply(a, s)
                }))
            })), e
        }
    };
    const z = (e, t) => {
            if (!e || e.destroyed || !e.params) return;
            const s = t.closest(e.isElement ? "swiper-slide" : `.${e.params.slideClass}`);
            if (s) {
                let t = s.querySelector(`.${e.params.lazyPreloaderClass}`);
                !t && e.isElement && (s.shadowRoot ? t = s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`) : requestAnimationFrame((() => {
                    s.shadowRoot && (t = s.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`), t && t.remove())
                }))), t && t.remove()
            }
        },
        $ = (e, t) => {
            if (!e.slides[t]) return;
            const s = e.slides[t].querySelector('[loading="lazy"]');
            s && s.removeAttribute("loading")
        },
        k = e => {
            if (!e || e.destroyed || !e.params) return;
            let t = e.params.lazyPreloadPrevNext;
            const s = e.slides.length;
            if (!s || !t || t < 0) return;
            t = Math.min(t, s);
            const a = "auto" === e.params.slidesPerView ? e.slidesPerViewDynamic() : Math.ceil(e.params.slidesPerView),
                i = e.activeIndex;
            if (e.params.grid && e.params.grid.rows > 1) {
                const s = i,
                    r = [s - t];
                return r.push(...Array.from({
                    length: t
                }).map(((e, t) => s + a + t))), void e.slides.forEach(((t, s) => {
                    r.includes(t.column) && $(e, s)
                }))
            }
            const r = i + a - 1;
            if (e.params.rewind || e.params.loop)
                for (let a = i - t; a <= r + t; a += 1) {
                    const t = (a % s + s) % s;
                    (t < i || t > r) && $(e, t)
                } else
                    for (let a = Math.max(i - t, 0); a <= Math.min(r + t, s - 1); a += 1) a !== i && (a > r || a < i) && $(e, a)
        };
    var O = {
        updateSize: function () {
            const e = this;
            let t, s;
            const a = e.el;
            t = void 0 !== e.params.width && null !== e.params.width ? e.params.width : a.clientWidth, s = void 0 !== e.params.height && null !== e.params.height ? e.params.height : a.clientHeight, 0 === t && e.isHorizontal() || 0 === s && e.isVertical() || (t = t - parseInt(b(a, "padding-left") || 0, 10) - parseInt(b(a, "padding-right") || 0, 10), s = s - parseInt(b(a, "padding-top") || 0, 10) - parseInt(b(a, "padding-bottom") || 0, 10), Number.isNaN(t) && (t = 0), Number.isNaN(s) && (s = 0), Object.assign(e, {
                width: t,
                height: s,
                size: e.isHorizontal() ? t : s
            }))
        },
        updateSlides: function () {
            const e = this;

            function t(t, s) {
                return parseFloat(t.getPropertyValue(e.getDirectionLabel(s)) || 0)
            }
            const s = e.params,
                {
                    wrapperEl: a,
                    slidesEl: i,
                    size: r,
                    rtlTranslate: n,
                    wrongRTL: l
                } = e,
                o = e.virtual && s.virtual.enabled,
                d = o ? e.virtual.slides.length : e.slides.length,
                c = f(i, `.${e.params.slideClass}, swiper-slide`),
                p = o ? e.virtual.slides.length : c.length;
            let m = [];
            const h = [],
                g = [];
            let v = s.slidesOffsetBefore;
            "function" == typeof v && (v = s.slidesOffsetBefore.call(e));
            let w = s.slidesOffsetAfter;
            "function" == typeof w && (w = s.slidesOffsetAfter.call(e));
            const y = e.snapGrid.length,
                E = e.slidesGrid.length;
            let x = s.spaceBetween,
                T = -v,
                M = 0,
                C = 0;
            if (void 0 === r) return;
            "string" == typeof x && x.indexOf("%") >= 0 ? x = parseFloat(x.replace("%", "")) / 100 * r : "string" == typeof x && (x = parseFloat(x)), e.virtualSize = -x, c.forEach((e => {
                n ? e.style.marginLeft = "" : e.style.marginRight = "", e.style.marginBottom = "", e.style.marginTop = ""
            })), s.centeredSlides && s.cssMode && (u(a, "--swiper-centered-offset-before", ""), u(a, "--swiper-centered-offset-after", ""));
            const P = s.grid && s.grid.rows > 1 && e.grid;
            let L;
            P ? e.grid.initSlides(c) : e.grid && e.grid.unsetSlides();
            const A = "auto" === s.slidesPerView && s.breakpoints && Object.keys(s.breakpoints).filter((e => void 0 !== s.breakpoints[e].slidesPerView)).length > 0;
            for (let a = 0; a < p; a += 1) {
                let i;
                if (L = 0, c[a] && (i = c[a]), P && e.grid.updateSlide(a, i, c), !c[a] || "none" !== b(i, "display")) {
                    if ("auto" === s.slidesPerView) {
                        A && (c[a].style[e.getDirectionLabel("width")] = "");
                        const r = getComputedStyle(i),
                            n = i.style.transform,
                            l = i.style.webkitTransform;
                        if (n && (i.style.transform = "none"), l && (i.style.webkitTransform = "none"), s.roundLengths) L = e.isHorizontal() ? S(i, "width", !0) : S(i, "height", !0);
                        else {
                            const e = t(r, "width"),
                                s = t(r, "padding-left"),
                                a = t(r, "padding-right"),
                                n = t(r, "margin-left"),
                                l = t(r, "margin-right"),
                                o = r.getPropertyValue("box-sizing");
                            if (o && "border-box" === o) L = e + n + l;
                            else {
                                const {
                                    clientWidth: t,
                                    offsetWidth: r
                                } = i;
                                L = e + s + a + n + l + (r - t)
                            }
                        }
                        n && (i.style.transform = n), l && (i.style.webkitTransform = l), s.roundLengths && (L = Math.floor(L))
                    } else L = (r - (s.slidesPerView - 1) * x) / s.slidesPerView, s.roundLengths && (L = Math.floor(L)), c[a] && (c[a].style[e.getDirectionLabel("width")] = `${L}px`);
                    c[a] && (c[a].swiperSlideSize = L), g.push(L), s.centeredSlides ? (T = T + L / 2 + M / 2 + x, 0 === M && 0 !== a && (T = T - r / 2 - x), 0 === a && (T = T - r / 2 - x), Math.abs(T) < .001 && (T = 0), s.roundLengths && (T = Math.floor(T)), C % s.slidesPerGroup == 0 && m.push(T), h.push(T)) : (s.roundLengths && (T = Math.floor(T)), (C - Math.min(e.params.slidesPerGroupSkip, C)) % e.params.slidesPerGroup == 0 && m.push(T), h.push(T), T = T + L + x), e.virtualSize += L + x, M = L, C += 1
                }
            }
            if (e.virtualSize = Math.max(e.virtualSize, r) + w, n && l && ("slide" === s.effect || "coverflow" === s.effect) && (a.style.width = `${e.virtualSize+x}px`), s.setWrapperSize && (a.style[e.getDirectionLabel("width")] = `${e.virtualSize+x}px`), P && e.grid.updateWrapperSize(L, m), !s.centeredSlides) {
                const t = [];
                for (let a = 0; a < m.length; a += 1) {
                    let i = m[a];
                    s.roundLengths && (i = Math.floor(i)), m[a] <= e.virtualSize - r && t.push(i)
                }
                m = t, Math.floor(e.virtualSize - r) - Math.floor(m[m.length - 1]) > 1 && m.push(e.virtualSize - r)
            }
            if (o && s.loop) {
                const t = g[0] + x;
                if (s.slidesPerGroup > 1) {
                    const a = Math.ceil((e.virtual.slidesBefore + e.virtual.slidesAfter) / s.slidesPerGroup),
                        i = t * s.slidesPerGroup;
                    for (let e = 0; e < a; e += 1) m.push(m[m.length - 1] + i)
                }
                for (let a = 0; a < e.virtual.slidesBefore + e.virtual.slidesAfter; a += 1) 1 === s.slidesPerGroup && m.push(m[m.length - 1] + t), h.push(h[h.length - 1] + t), e.virtualSize += t
            }
            if (0 === m.length && (m = [0]), 0 !== x) {
                const t = e.isHorizontal() && n ? "marginLeft" : e.getDirectionLabel("marginRight");
                c.filter(((e, t) => !(s.cssMode && !s.loop) || t !== c.length - 1)).forEach((e => {
                    e.style[t] = `${x}px`
                }))
            }
            if (s.centeredSlides && s.centeredSlidesBounds) {
                let e = 0;
                g.forEach((t => {
                    e += t + (x || 0)
                })), e -= x;
                const t = e - r;
                m = m.map((e => e <= 0 ? -v : e > t ? t + w : e))
            }
            if (s.centerInsufficientSlides) {
                let e = 0;
                if (g.forEach((t => {
                        e += t + (x || 0)
                    })), e -= x, e < r) {
                    const t = (r - e) / 2;
                    m.forEach(((e, s) => {
                        m[s] = e - t
                    })), h.forEach(((e, s) => {
                        h[s] = e + t
                    }))
                }
            }
            if (Object.assign(e, {
                    slides: c,
                    snapGrid: m,
                    slidesGrid: h,
                    slidesSizesGrid: g
                }), s.centeredSlides && s.cssMode && !s.centeredSlidesBounds) {
                u(a, "--swiper-centered-offset-before", -m[0] + "px"), u(a, "--swiper-centered-offset-after", e.size / 2 - g[g.length - 1] / 2 + "px");
                const t = -e.snapGrid[0],
                    s = -e.slidesGrid[0];
                e.snapGrid = e.snapGrid.map((e => e + t)), e.slidesGrid = e.slidesGrid.map((e => e + s))
            }
            if (p !== d && e.emit("slidesLengthChange"), m.length !== y && (e.params.watchOverflow && e.checkOverflow(), e.emit("snapGridLengthChange")), h.length !== E && e.emit("slidesGridLengthChange"), s.watchSlidesProgress && e.updateSlidesOffset(), e.emit("slidesUpdated"), !(o || s.cssMode || "slide" !== s.effect && "fade" !== s.effect)) {
                const t = `${s.containerModifierClass}backface-hidden`,
                    a = e.el.classList.contains(t);
                p <= s.maxBackfaceHiddenSlides ? a || e.el.classList.add(t) : a && e.el.classList.remove(t)
            }
        },
        updateAutoHeight: function (e) {
            const t = this,
                s = [],
                a = t.virtual && t.params.virtual.enabled;
            let i, r = 0;
            "number" == typeof e ? t.setTransition(e) : !0 === e && t.setTransition(t.params.speed);
            const n = e => a ? t.slides[t.getSlideIndexByData(e)] : t.slides[e];
            if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
                if (t.params.centeredSlides)(t.visibleSlides || []).forEach((e => {
                    s.push(e)
                }));
                else
                    for (i = 0; i < Math.ceil(t.params.slidesPerView); i += 1) {
                        const e = t.activeIndex + i;
                        if (e > t.slides.length && !a) break;
                        s.push(n(e))
                    } else s.push(n(t.activeIndex));
            for (i = 0; i < s.length; i += 1)
                if (void 0 !== s[i]) {
                    const e = s[i].offsetHeight;
                    r = e > r ? e : r
                }(r || 0 === r) && (t.wrapperEl.style.height = `${r}px`)
        },
        updateSlidesOffset: function () {
            const e = this,
                t = e.slides,
                s = e.isElement ? e.isHorizontal() ? e.wrapperEl.offsetLeft : e.wrapperEl.offsetTop : 0;
            for (let a = 0; a < t.length; a += 1) t[a].swiperSlideOffset = (e.isHorizontal() ? t[a].offsetLeft : t[a].offsetTop) - s - e.cssOverflowAdjustment()
        },
        updateSlidesProgress: function (e) {
            void 0 === e && (e = this && this.translate || 0);
            const t = this,
                s = t.params,
                {
                    slides: a,
                    rtlTranslate: i,
                    snapGrid: r
                } = t;
            if (0 === a.length) return;
            void 0 === a[0].swiperSlideOffset && t.updateSlidesOffset();
            let n = -e;
            i && (n = e), a.forEach((e => {
                e.classList.remove(s.slideVisibleClass, s.slideFullyVisibleClass)
            })), t.visibleSlidesIndexes = [], t.visibleSlides = [];
            let l = s.spaceBetween;
            "string" == typeof l && l.indexOf("%") >= 0 ? l = parseFloat(l.replace("%", "")) / 100 * t.size : "string" == typeof l && (l = parseFloat(l));
            for (let e = 0; e < a.length; e += 1) {
                const o = a[e];
                let d = o.swiperSlideOffset;
                s.cssMode && s.centeredSlides && (d -= a[0].swiperSlideOffset);
                const c = (n + (s.centeredSlides ? t.minTranslate() : 0) - d) / (o.swiperSlideSize + l),
                    p = (n - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - d) / (o.swiperSlideSize + l),
                    u = -(n - d),
                    m = u + t.slidesSizesGrid[e],
                    h = u >= 0 && u <= t.size - t.slidesSizesGrid[e];
                (u >= 0 && u < t.size - 1 || m > 1 && m <= t.size || u <= 0 && m >= t.size) && (t.visibleSlides.push(o), t.visibleSlidesIndexes.push(e), a[e].classList.add(s.slideVisibleClass)), h && a[e].classList.add(s.slideFullyVisibleClass), o.progress = i ? -c : c, o.originalProgress = i ? -p : p
            }
        },
        updateProgress: function (e) {
            const t = this;
            if (void 0 === e) {
                const s = t.rtlTranslate ? -1 : 1;
                e = t && t.translate && t.translate * s || 0
            }
            const s = t.params,
                a = t.maxTranslate() - t.minTranslate();
            let {
                progress: i,
                isBeginning: r,
                isEnd: n,
                progressLoop: l
            } = t;
            const o = r,
                d = n;
            if (0 === a) i = 0, r = !0, n = !0;
            else {
                i = (e - t.minTranslate()) / a;
                const s = Math.abs(e - t.minTranslate()) < 1,
                    l = Math.abs(e - t.maxTranslate()) < 1;
                r = s || i <= 0, n = l || i >= 1, s && (i = 0), l && (i = 1)
            }
            if (s.loop) {
                const s = t.getSlideIndexByData(0),
                    a = t.getSlideIndexByData(t.slides.length - 1),
                    i = t.slidesGrid[s],
                    r = t.slidesGrid[a],
                    n = t.slidesGrid[t.slidesGrid.length - 1],
                    o = Math.abs(e);
                l = o >= i ? (o - i) / n : (o + n - r) / n, l > 1 && (l -= 1)
            }
            Object.assign(t, {
                progress: i,
                progressLoop: l,
                isBeginning: r,
                isEnd: n
            }), (s.watchSlidesProgress || s.centeredSlides && s.autoHeight) && t.updateSlidesProgress(e), r && !o && t.emit("reachBeginning toEdge"), n && !d && t.emit("reachEnd toEdge"), (o && !r || d && !n) && t.emit("fromEdge"), t.emit("progress", i)
        },
        updateSlidesClasses: function () {
            const e = this,
                {
                    slides: t,
                    params: s,
                    slidesEl: a,
                    activeIndex: i
                } = e,
                r = e.virtual && s.virtual.enabled,
                n = e.grid && s.grid && s.grid.rows > 1,
                l = e => f(a, `.${s.slideClass}${e}, swiper-slide${e}`)[0];
            let o, d, c;
            if (t.forEach((e => {
                    e.classList.remove(s.slideActiveClass, s.slideNextClass, s.slidePrevClass)
                })), r)
                if (s.loop) {
                    let t = i - e.virtual.slidesBefore;
                    t < 0 && (t = e.virtual.slides.length + t), t >= e.virtual.slides.length && (t -= e.virtual.slides.length), o = l(`[data-swiper-slide-index="${t}"]`)
                } else o = l(`[data-swiper-slide-index="${i}"]`);
            else n ? (o = t.filter((e => e.column === i))[0], c = t.filter((e => e.column === i + 1))[0], d = t.filter((e => e.column === i - 1))[0]) : o = t[i];
            o && (o.classList.add(s.slideActiveClass), n ? (c && c.classList.add(s.slideNextClass), d && d.classList.add(s.slidePrevClass)) : (c = function (e, t) {
                const s = [];
                for (; e.nextElementSibling;) {
                    const a = e.nextElementSibling;
                    t ? a.matches(t) && s.push(a) : s.push(a), e = a
                }
                return s
            }(o, `.${s.slideClass}, swiper-slide`)[0], s.loop && !c && (c = t[0]), c && c.classList.add(s.slideNextClass), d = function (e, t) {
                const s = [];
                for (; e.previousElementSibling;) {
                    const a = e.previousElementSibling;
                    t ? a.matches(t) && s.push(a) : s.push(a), e = a
                }
                return s
            }(o, `.${s.slideClass}, swiper-slide`)[0], s.loop && 0 === !d && (d = t[t.length - 1]), d && d.classList.add(s.slidePrevClass))), e.emitSlidesClasses()
        },
        updateActiveIndex: function (e) {
            const t = this,
                s = t.rtlTranslate ? t.translate : -t.translate,
                {
                    snapGrid: a,
                    params: i,
                    activeIndex: r,
                    realIndex: n,
                    snapIndex: l
                } = t;
            let o, d = e;
            const c = e => {
                let s = e - t.virtual.slidesBefore;
                return s < 0 && (s = t.virtual.slides.length + s), s >= t.virtual.slides.length && (s -= t.virtual.slides.length), s
            };
            if (void 0 === d && (d = function (e) {
                    const {
                        slidesGrid: t,
                        params: s
                    } = e, a = e.rtlTranslate ? e.translate : -e.translate;
                    let i;
                    for (let e = 0; e < t.length; e += 1) void 0 !== t[e + 1] ? a >= t[e] && a < t[e + 1] - (t[e + 1] - t[e]) / 2 ? i = e : a >= t[e] && a < t[e + 1] && (i = e + 1) : a >= t[e] && (i = e);
                    return s.normalizeSlideIndex && (i < 0 || void 0 === i) && (i = 0), i
                }(t)), a.indexOf(s) >= 0) o = a.indexOf(s);
            else {
                const e = Math.min(i.slidesPerGroupSkip, d);
                o = e + Math.floor((d - e) / i.slidesPerGroup)
            }
            if (o >= a.length && (o = a.length - 1), d === r && !t.params.loop) return void(o !== l && (t.snapIndex = o, t.emit("snapIndexChange")));
            if (d === r && t.params.loop && t.virtual && t.params.virtual.enabled) return void(t.realIndex = c(d));
            const p = t.grid && i.grid && i.grid.rows > 1;
            let u;
            if (t.virtual && i.virtual.enabled && i.loop) u = c(d);
            else if (p) {
                const e = t.slides.filter((e => e.column === d))[0];
                let s = parseInt(e.getAttribute("data-swiper-slide-index"), 10);
                Number.isNaN(s) && (s = Math.max(t.slides.indexOf(e), 0)), u = Math.floor(s / i.grid.rows)
            } else if (t.slides[d]) {
                const e = t.slides[d].getAttribute("data-swiper-slide-index");
                u = e ? parseInt(e, 10) : d
            } else u = d;
            Object.assign(t, {
                previousSnapIndex: l,
                snapIndex: o,
                previousRealIndex: n,
                realIndex: u,
                previousIndex: r,
                activeIndex: d
            }), t.initialized && k(t), t.emit("activeIndexChange"), t.emit("snapIndexChange"), (t.initialized || t.params.runCallbacksOnInit) && (n !== u && t.emit("realIndexChange"), t.emit("slideChange"))
        },
        updateClickedSlide: function (e, t) {
            const s = this,
                a = s.params;
            let i = e.closest(`.${a.slideClass}, swiper-slide`);
            !i && s.isElement && t && t.length > 1 && t.includes(e) && [...t.slice(t.indexOf(e) + 1, t.length)].forEach((e => {
                !i && e.matches && e.matches(`.${a.slideClass}, swiper-slide`) && (i = e)
            }));
            let r, n = !1;
            if (i)
                for (let e = 0; e < s.slides.length; e += 1)
                    if (s.slides[e] === i) {
                        n = !0, r = e;
                        break
                    } if (!i || !n) return s.clickedSlide = void 0, void(s.clickedIndex = void 0);
            s.clickedSlide = i, s.virtual && s.params.virtual.enabled ? s.clickedIndex = parseInt(i.getAttribute("data-swiper-slide-index"), 10) : s.clickedIndex = r, a.slideToClickedSlide && void 0 !== s.clickedIndex && s.clickedIndex !== s.activeIndex && s.slideToClickedSlide()
        }
    };
    var D = {
        getTranslate: function (e) {
            void 0 === e && (e = this.isHorizontal() ? "x" : "y");
            const {
                params: t,
                rtlTranslate: s,
                translate: a,
                wrapperEl: i
            } = this;
            if (t.virtualTranslate) return s ? -a : a;
            if (t.cssMode) return a;
            let r = d(i, e);
            return r += this.cssOverflowAdjustment(), s && (r = -r), r || 0
        },
        setTranslate: function (e, t) {
            const s = this,
                {
                    rtlTranslate: a,
                    params: i,
                    wrapperEl: r,
                    progress: n
                } = s;
            let l, o = 0,
                d = 0;
            s.isHorizontal() ? o = a ? -e : e : d = e, i.roundLengths && (o = Math.floor(o), d = Math.floor(d)), s.previousTranslate = s.translate, s.translate = s.isHorizontal() ? o : d, i.cssMode ? r[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal() ? -o : -d : i.virtualTranslate || (s.isHorizontal() ? o -= s.cssOverflowAdjustment() : d -= s.cssOverflowAdjustment(), r.style.transform = `translate3d(${o}px, ${d}px, 0px)`);
            const c = s.maxTranslate() - s.minTranslate();
            l = 0 === c ? 0 : (e - s.minTranslate()) / c, l !== n && s.updateProgress(e), s.emit("setTranslate", s.translate, t)
        },
        minTranslate: function () {
            return -this.snapGrid[0]
        },
        maxTranslate: function () {
            return -this.snapGrid[this.snapGrid.length - 1]
        },
        translateTo: function (e, t, s, a, i) {
            void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), void 0 === a && (a = !0);
            const r = this,
                {
                    params: n,
                    wrapperEl: l
                } = r;
            if (r.animating && n.preventInteractionOnTransition) return !1;
            const o = r.minTranslate(),
                d = r.maxTranslate();
            let c;
            if (c = a && e > o ? o : a && e < d ? d : e, r.updateProgress(c), n.cssMode) {
                const e = r.isHorizontal();
                if (0 === t) l[e ? "scrollLeft" : "scrollTop"] = -c;
                else {
                    if (!r.support.smoothScroll) return m({
                        swiper: r,
                        targetPosition: -c,
                        side: e ? "left" : "top"
                    }), !0;
                    l.scrollTo({
                        [e ? "left" : "top"]: -c,
                        behavior: "smooth"
                    })
                }
                return !0
            }
            return 0 === t ? (r.setTransition(0), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i), r.emit("transitionEnd"))) : (r.setTransition(t), r.setTranslate(c), s && (r.emit("beforeTransitionStart", t, i), r.emit("transitionStart")), r.animating || (r.animating = !0, r.onTranslateToWrapperTransitionEnd || (r.onTranslateToWrapperTransitionEnd = function (e) {
                r && !r.destroyed && e.target === this && (r.wrapperEl.removeEventListener("transitionend", r.onTranslateToWrapperTransitionEnd), r.onTranslateToWrapperTransitionEnd = null, delete r.onTranslateToWrapperTransitionEnd, s && r.emit("transitionEnd"))
            }), r.wrapperEl.addEventListener("transitionend", r.onTranslateToWrapperTransitionEnd))), !0
        }
    };

    function G(e) {
        let {
            swiper: t,
            runCallbacks: s,
            direction: a,
            step: i
        } = e;
        const {
            activeIndex: r,
            previousIndex: n
        } = t;
        let l = a;
        if (l || (l = r > n ? "next" : r < n ? "prev" : "reset"), t.emit(`transition${i}`), s && r !== n) {
            if ("reset" === l) return void t.emit(`slideResetTransition${i}`);
            t.emit(`slideChangeTransition${i}`), "next" === l ? t.emit(`slideNextTransition${i}`) : t.emit(`slidePrevTransition${i}`)
        }
    }
    var X = {
        slideTo: function (e, t, s, a, i) {
            void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), "string" == typeof e && (e = parseInt(e, 10));
            const r = this;
            let n = e;
            n < 0 && (n = 0);
            const {
                params: l,
                snapGrid: o,
                slidesGrid: d,
                previousIndex: c,
                activeIndex: p,
                rtlTranslate: u,
                wrapperEl: h,
                enabled: f
            } = r;
            if (r.animating && l.preventInteractionOnTransition || !f && !a && !i) return !1;
            const g = Math.min(r.params.slidesPerGroupSkip, n);
            let v = g + Math.floor((n - g) / r.params.slidesPerGroup);
            v >= o.length && (v = o.length - 1);
            const w = -o[v];
            if (l.normalizeSlideIndex)
                for (let e = 0; e < d.length; e += 1) {
                    const t = -Math.floor(100 * w),
                        s = Math.floor(100 * d[e]),
                        a = Math.floor(100 * d[e + 1]);
                    void 0 !== d[e + 1] ? t >= s && t < a - (a - s) / 2 ? n = e : t >= s && t < a && (n = e + 1) : t >= s && (n = e)
                }
            if (r.initialized && n !== p) {
                if (!r.allowSlideNext && (u ? w > r.translate && w > r.minTranslate() : w < r.translate && w < r.minTranslate())) return !1;
                if (!r.allowSlidePrev && w > r.translate && w > r.maxTranslate() && (p || 0) !== n) return !1
            }
            let b;
            if (n !== (c || 0) && s && r.emit("beforeSlideChangeStart"), r.updateProgress(w), b = n > p ? "next" : n < p ? "prev" : "reset", u && -w === r.translate || !u && w === r.translate) return r.updateActiveIndex(n), l.autoHeight && r.updateAutoHeight(), r.updateSlidesClasses(), "slide" !== l.effect && r.setTranslate(w), "reset" !== b && (r.transitionStart(s, b), r.transitionEnd(s, b)), !1;
            if (l.cssMode) {
                const e = r.isHorizontal(),
                    s = u ? w : -w;
                if (0 === t) {
                    const t = r.virtual && r.params.virtual.enabled;
                    t && (r.wrapperEl.style.scrollSnapType = "none", r._immediateVirtual = !0), t && !r._cssModeVirtualInitialSet && r.params.initialSlide > 0 ? (r._cssModeVirtualInitialSet = !0, requestAnimationFrame((() => {
                        h[e ? "scrollLeft" : "scrollTop"] = s
                    }))) : h[e ? "scrollLeft" : "scrollTop"] = s, t && requestAnimationFrame((() => {
                        r.wrapperEl.style.scrollSnapType = "", r._immediateVirtual = !1
                    }))
                } else {
                    if (!r.support.smoothScroll) return m({
                        swiper: r,
                        targetPosition: s,
                        side: e ? "left" : "top"
                    }), !0;
                    h.scrollTo({
                        [e ? "left" : "top"]: s,
                        behavior: "smooth"
                    })
                }
                return !0
            }
            return r.setTransition(t), r.setTranslate(w), r.updateActiveIndex(n), r.updateSlidesClasses(), r.emit("beforeTransitionStart", t, a), r.transitionStart(s, b), 0 === t ? r.transitionEnd(s, b) : r.animating || (r.animating = !0, r.onSlideToWrapperTransitionEnd || (r.onSlideToWrapperTransitionEnd = function (e) {
                r && !r.destroyed && e.target === this && (r.wrapperEl.removeEventListener("transitionend", r.onSlideToWrapperTransitionEnd), r.onSlideToWrapperTransitionEnd = null, delete r.onSlideToWrapperTransitionEnd, r.transitionEnd(s, b))
            }), r.wrapperEl.addEventListener("transitionend", r.onSlideToWrapperTransitionEnd)), !0
        },
        slideToLoop: function (e, t, s, a) {
            if (void 0 === e && (e = 0), void 0 === t && (t = this.params.speed), void 0 === s && (s = !0), "string" == typeof e) {
                e = parseInt(e, 10)
            }
            const i = this,
                r = i.grid && i.params.grid && i.params.grid.rows > 1;
            let n = e;
            if (i.params.loop)
                if (i.virtual && i.params.virtual.enabled) n += i.virtual.slidesBefore;
                else {
                    let e;
                    if (r) {
                        const t = n * i.params.grid.rows;
                        e = i.slides.filter((e => 1 * e.getAttribute("data-swiper-slide-index") === t))[0].column
                    } else e = i.getSlideIndexByData(n);
                    const t = r ? Math.ceil(i.slides.length / i.params.grid.rows) : i.slides.length,
                        {
                            centeredSlides: s
                        } = i.params;
                    let a = i.params.slidesPerView;
                    "auto" === a ? a = i.slidesPerViewDynamic() : (a = Math.ceil(parseFloat(i.params.slidesPerView, 10)), s && a % 2 == 0 && (a += 1));
                    let l = t - e < a;
                    if (s && (l = l || e < Math.ceil(a / 2)), l) {
                        const a = s ? e < i.activeIndex ? "prev" : "next" : e - i.activeIndex - 1 < i.params.slidesPerView ? "next" : "prev";
                        i.loopFix({
                            direction: a,
                            slideTo: !0,
                            activeSlideIndex: "next" === a ? e + 1 : e - t + 1,
                            slideRealIndex: "next" === a ? i.realIndex : void 0
                        })
                    }
                    if (r) {
                        const e = n * i.params.grid.rows;
                        n = i.slides.filter((t => 1 * t.getAttribute("data-swiper-slide-index") === e))[0].column
                    } else n = i.getSlideIndexByData(n)
                } return requestAnimationFrame((() => {
                i.slideTo(n, t, s, a)
            })), i
        },
        slideNext: function (e, t, s) {
            void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
            const a = this,
                {
                    enabled: i,
                    params: r,
                    animating: n
                } = a;
            if (!i) return a;
            let l = r.slidesPerGroup;
            "auto" === r.slidesPerView && 1 === r.slidesPerGroup && r.slidesPerGroupAuto && (l = Math.max(a.slidesPerViewDynamic("current", !0), 1));
            const o = a.activeIndex < r.slidesPerGroupSkip ? 1 : l,
                d = a.virtual && r.virtual.enabled;
            if (r.loop) {
                if (n && !d && r.loopPreventsSliding) return !1;
                if (a.loopFix({
                        direction: "next"
                    }), a._clientLeft = a.wrapperEl.clientLeft, a.activeIndex === a.slides.length - 1 && r.cssMode) return requestAnimationFrame((() => {
                    a.slideTo(a.activeIndex + o, e, t, s)
                })), !0
            }
            return r.rewind && a.isEnd ? a.slideTo(0, e, t, s) : a.slideTo(a.activeIndex + o, e, t, s)
        },
        slidePrev: function (e, t, s) {
            void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
            const a = this,
                {
                    params: i,
                    snapGrid: r,
                    slidesGrid: n,
                    rtlTranslate: l,
                    enabled: o,
                    animating: d
                } = a;
            if (!o) return a;
            const c = a.virtual && i.virtual.enabled;
            if (i.loop) {
                if (d && !c && i.loopPreventsSliding) return !1;
                a.loopFix({
                    direction: "prev"
                }), a._clientLeft = a.wrapperEl.clientLeft
            }

            function p(e) {
                return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e)
            }
            const u = p(l ? a.translate : -a.translate),
                m = r.map((e => p(e)));
            let h = r[m.indexOf(u) - 1];
            if (void 0 === h && i.cssMode) {
                let e;
                r.forEach(((t, s) => {
                    u >= t && (e = s)
                })), void 0 !== e && (h = r[e > 0 ? e - 1 : e])
            }
            let f = 0;
            if (void 0 !== h && (f = n.indexOf(h), f < 0 && (f = a.activeIndex - 1), "auto" === i.slidesPerView && 1 === i.slidesPerGroup && i.slidesPerGroupAuto && (f = f - a.slidesPerViewDynamic("previous", !0) + 1, f = Math.max(f, 0))), i.rewind && a.isBeginning) {
                const i = a.params.virtual && a.params.virtual.enabled && a.virtual ? a.virtual.slides.length - 1 : a.slides.length - 1;
                return a.slideTo(i, e, t, s)
            }
            return i.loop && 0 === a.activeIndex && i.cssMode ? (requestAnimationFrame((() => {
                a.slideTo(f, e, t, s)
            })), !0) : a.slideTo(f, e, t, s)
        },
        slideReset: function (e, t, s) {
            return void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), this.slideTo(this.activeIndex, e, t, s)
        },
        slideToClosest: function (e, t, s, a) {
            void 0 === e && (e = this.params.speed), void 0 === t && (t = !0), void 0 === a && (a = .5);
            const i = this;
            let r = i.activeIndex;
            const n = Math.min(i.params.slidesPerGroupSkip, r),
                l = n + Math.floor((r - n) / i.params.slidesPerGroup),
                o = i.rtlTranslate ? i.translate : -i.translate;
            if (o >= i.snapGrid[l]) {
                const e = i.snapGrid[l];
                o - e > (i.snapGrid[l + 1] - e) * a && (r += i.params.slidesPerGroup)
            } else {
                const e = i.snapGrid[l - 1];
                o - e <= (i.snapGrid[l] - e) * a && (r -= i.params.slidesPerGroup)
            }
            return r = Math.max(r, 0), r = Math.min(r, i.slidesGrid.length - 1), i.slideTo(r, e, t, s)
        },
        slideToClickedSlide: function () {
            const e = this,
                {
                    params: t,
                    slidesEl: s
                } = e,
                a = "auto" === t.slidesPerView ? e.slidesPerViewDynamic() : t.slidesPerView;
            let i, r = e.clickedIndex;
            const n = e.isElement ? "swiper-slide" : `.${t.slideClass}`;
            if (t.loop) {
                if (e.animating) return;
                i = parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10), t.centeredSlides ? r < e.loopedSlides - a / 2 || r > e.slides.length - e.loopedSlides + a / 2 ? (e.loopFix(), r = e.getSlideIndex(f(s, `${n}[data-swiper-slide-index="${i}"]`)[0]), l((() => {
                    e.slideTo(r)
                }))) : e.slideTo(r) : r > e.slides.length - a ? (e.loopFix(), r = e.getSlideIndex(f(s, `${n}[data-swiper-slide-index="${i}"]`)[0]), l((() => {
                    e.slideTo(r)
                }))) : e.slideTo(r)
            } else e.slideTo(r)
        }
    };
    var H = {
        loopCreate: function (e) {
            const t = this,
                {
                    params: s,
                    slidesEl: a
                } = t;
            if (!s.loop || t.virtual && t.params.virtual.enabled) return;
            const i = () => {
                    f(a, `.${s.slideClass}, swiper-slide`).forEach(((e, t) => {
                        e.setAttribute("data-swiper-slide-index", t)
                    }))
                },
                r = t.grid && s.grid && s.grid.rows > 1,
                n = s.slidesPerGroup * (r ? s.grid.rows : 1),
                l = t.slides.length % n != 0,
                o = r && t.slides.length % s.grid.rows != 0,
                d = e => {
                    for (let a = 0; a < e; a += 1) {
                        const e = t.isElement ? v("swiper-slide", [s.slideBlankClass]) : v("div", [s.slideClass, s.slideBlankClass]);
                        t.slidesEl.append(e)
                    }
                };
            if (l) {
                if (s.loopAddBlankSlides) {
                    d(n - t.slides.length % n), t.recalcSlides(), t.updateSlides()
                } else g("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                i()
            } else if (o) {
                if (s.loopAddBlankSlides) {
                    d(s.grid.rows - t.slides.length % s.grid.rows), t.recalcSlides(), t.updateSlides()
                } else g("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");
                i()
            } else i();
            t.loopFix({
                slideRealIndex: e,
                direction: s.centeredSlides ? void 0 : "next"
            })
        },
        loopFix: function (e) {
            let {
                slideRealIndex: t,
                slideTo: s = !0,
                direction: a,
                setTranslate: i,
                activeSlideIndex: r,
                byController: n,
                byMousewheel: l
            } = void 0 === e ? {} : e;
            const o = this;
            if (!o.params.loop) return;
            o.emit("beforeLoopFix");
            const {
                slides: d,
                allowSlidePrev: c,
                allowSlideNext: p,
                slidesEl: u,
                params: m
            } = o, {
                centeredSlides: h
            } = m;
            if (o.allowSlidePrev = !0, o.allowSlideNext = !0, o.virtual && m.virtual.enabled) return s && (m.centeredSlides || 0 !== o.snapIndex ? m.centeredSlides && o.snapIndex < m.slidesPerView ? o.slideTo(o.virtual.slides.length + o.snapIndex, 0, !1, !0) : o.snapIndex === o.snapGrid.length - 1 && o.slideTo(o.virtual.slidesBefore, 0, !1, !0) : o.slideTo(o.virtual.slides.length, 0, !1, !0)), o.allowSlidePrev = c, o.allowSlideNext = p, void o.emit("loopFix");
            let f = m.slidesPerView;
            "auto" === f ? f = o.slidesPerViewDynamic() : (f = Math.ceil(parseFloat(m.slidesPerView, 10)), h && f % 2 == 0 && (f += 1));
            const v = m.slidesPerGroupAuto ? f : m.slidesPerGroup;
            let w = v;
            w % v != 0 && (w += v - w % v), w += m.loopAdditionalSlides, o.loopedSlides = w;
            const b = o.grid && m.grid && m.grid.rows > 1;
            d.length < f + w ? g("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters") : b && "row" === m.grid.fill && g("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");
            const y = [],
                E = [];
            let x = o.activeIndex;
            void 0 === r ? r = o.getSlideIndex(d.filter((e => e.classList.contains(m.slideActiveClass)))[0]) : x = r;
            const S = "next" === a || !a,
                T = "prev" === a || !a;
            let M = 0,
                C = 0;
            const P = b ? Math.ceil(d.length / m.grid.rows) : d.length,
                L = (b ? d[r].column : r) + (h && void 0 === i ? -f / 2 + .5 : 0);
            if (L < w) {
                M = Math.max(w - L, v);
                for (let e = 0; e < w - L; e += 1) {
                    const t = e - Math.floor(e / P) * P;
                    if (b) {
                        const e = P - t - 1;
                        for (let t = d.length - 1; t >= 0; t -= 1) d[t].column === e && y.push(t)
                    } else y.push(P - t - 1)
                }
            } else if (L + f > P - w) {
                C = Math.max(L - (P - 2 * w), v);
                for (let e = 0; e < C; e += 1) {
                    const t = e - Math.floor(e / P) * P;
                    b ? d.forEach(((e, s) => {
                        e.column === t && E.push(s)
                    })) : E.push(t)
                }
            }
            if (o.__preventObserver__ = !0, requestAnimationFrame((() => {
                    o.__preventObserver__ = !1
                })), T && y.forEach((e => {
                    d[e].swiperLoopMoveDOM = !0, u.prepend(d[e]), d[e].swiperLoopMoveDOM = !1
                })), S && E.forEach((e => {
                    d[e].swiperLoopMoveDOM = !0, u.append(d[e]), d[e].swiperLoopMoveDOM = !1
                })), o.recalcSlides(), "auto" === m.slidesPerView ? o.updateSlides() : b && (y.length > 0 && T || E.length > 0 && S) && o.slides.forEach(((e, t) => {
                    o.grid.updateSlide(t, e, o.slides)
                })), m.watchSlidesProgress && o.updateSlidesOffset(), s)
                if (y.length > 0 && T) {
                    if (void 0 === t) {
                        const e = o.slidesGrid[x],
                            t = o.slidesGrid[x + M] - e;
                        l ? o.setTranslate(o.translate - t) : (o.slideTo(x + M, 0, !1, !0), i && (o.touchEventsData.startTranslate = o.touchEventsData.startTranslate - t, o.touchEventsData.currentTranslate = o.touchEventsData.currentTranslate - t))
                    } else if (i) {
                        const e = b ? y.length / m.grid.rows : y.length;
                        o.slideTo(o.activeIndex + e, 0, !1, !0), o.touchEventsData.currentTranslate = o.translate
                    }
                } else if (E.length > 0 && S)
                if (void 0 === t) {
                    const e = o.slidesGrid[x],
                        t = o.slidesGrid[x - C] - e;
                    l ? o.setTranslate(o.translate - t) : (o.slideTo(x - C, 0, !1, !0), i && (o.touchEventsData.startTranslate = o.touchEventsData.startTranslate - t, o.touchEventsData.currentTranslate = o.touchEventsData.currentTranslate - t))
                } else {
                    const e = b ? E.length / m.grid.rows : E.length;
                    o.slideTo(o.activeIndex - e, 0, !1, !0)
                } if (o.allowSlidePrev = c, o.allowSlideNext = p, o.controller && o.controller.control && !n) {
                const e = {
                    slideRealIndex: t,
                    direction: a,
                    setTranslate: i,
                    activeSlideIndex: r,
                    byController: !0
                };
                Array.isArray(o.controller.control) ? o.controller.control.forEach((t => {
                    !t.destroyed && t.params.loop && t.loopFix({
                        ...e,
                        slideTo: t.params.slidesPerView === m.slidesPerView && s
                    })
                })) : o.controller.control instanceof o.constructor && o.controller.control.params.loop && o.controller.control.loopFix({
                    ...e,
                    slideTo: o.controller.control.params.slidesPerView === m.slidesPerView && s
                })
            }
            o.emit("loopFix")
        },
        loopDestroy: function () {
            const e = this,
                {
                    params: t,
                    slidesEl: s
                } = e;
            if (!t.loop || e.virtual && e.params.virtual.enabled) return;
            e.recalcSlides();
            const a = [];
            e.slides.forEach((e => {
                const t = void 0 === e.swiperSlideIndex ? 1 * e.getAttribute("data-swiper-slide-index") : e.swiperSlideIndex;
                a[t] = e
            })), e.slides.forEach((e => {
                e.removeAttribute("data-swiper-slide-index")
            })), a.forEach((e => {
                s.append(e)
            })), e.recalcSlides(), e.slideTo(e.realIndex, 0)
        }
    };

    function N(e, t, s) {
        const a = r(),
            {
                params: i
            } = e,
            n = i.edgeSwipeDetection,
            l = i.edgeSwipeThreshold;
        return !n || !(s <= l || s >= a.innerWidth - l) || "prevent" === n && (t.preventDefault(), !0)
    }

    function Y(e) {
        const t = this,
            s = a();
        let i = e;
        i.originalEvent && (i = i.originalEvent);
        const n = t.touchEventsData;
        if ("pointerdown" === i.type) {
            if (null !== n.pointerId && n.pointerId !== i.pointerId) return;
            n.pointerId = i.pointerId
        } else "touchstart" === i.type && 1 === i.targetTouches.length && (n.touchId = i.targetTouches[0].identifier);
        if ("touchstart" === i.type) return void N(t, i, i.targetTouches[0].pageX);
        const {
            params: l,
            touches: d,
            enabled: c
        } = t;
        if (!c) return;
        if (!l.simulateTouch && "mouse" === i.pointerType) return;
        if (t.animating && l.preventInteractionOnTransition) return;
        !t.animating && l.cssMode && l.loop && t.loopFix();
        let p = i.target;
        if ("wrapper" === l.touchEventsTarget && !t.wrapperEl.contains(p)) return;
        if ("which" in i && 3 === i.which) return;
        if ("button" in i && i.button > 0) return;
        if (n.isTouched && n.isMoved) return;
        const u = !!l.noSwipingClass && "" !== l.noSwipingClass,
            m = i.composedPath ? i.composedPath() : i.path;
        u && i.target && i.target.shadowRoot && m && (p = m[0]);
        const h = l.noSwipingSelector ? l.noSwipingSelector : `.${l.noSwipingClass}`,
            f = !(!i.target || !i.target.shadowRoot);
        if (l.noSwiping && (f ? function (e, t) {
                return void 0 === t && (t = this),
                    function t(s) {
                        if (!s || s === a() || s === r()) return null;
                        s.assignedSlot && (s = s.assignedSlot);
                        const i = s.closest(e);
                        return i || s.getRootNode ? i || t(s.getRootNode().host) : null
                    }(t)
            }(h, p) : p.closest(h))) return void(t.allowClick = !0);
        if (l.swipeHandler && !p.closest(l.swipeHandler)) return;
        d.currentX = i.pageX, d.currentY = i.pageY;
        const g = d.currentX,
            v = d.currentY;
        if (!N(t, i, g)) return;
        Object.assign(n, {
            isTouched: !0,
            isMoved: !1,
            allowTouchCallbacks: !0,
            isScrolling: void 0,
            startMoving: void 0
        }), d.startX = g, d.startY = v, n.touchStartTime = o(), t.allowClick = !0, t.updateSize(), t.swipeDirection = void 0, l.threshold > 0 && (n.allowThresholdMove = !1);
        let w = !0;
        p.matches(n.focusableElements) && (w = !1, "SELECT" === p.nodeName && (n.isTouched = !1)), s.activeElement && s.activeElement.matches(n.focusableElements) && s.activeElement !== p && s.activeElement.blur();
        const b = w && t.allowTouchMove && l.touchStartPreventDefault;
        !l.touchStartForcePreventDefault && !b || p.isContentEditable || i.preventDefault(), l.freeMode && l.freeMode.enabled && t.freeMode && t.animating && !l.cssMode && t.freeMode.onTouchStart(), t.emit("touchStart", i)
    }

    function B(e) {
        const t = a(),
            s = this,
            i = s.touchEventsData,
            {
                params: r,
                touches: n,
                rtlTranslate: l,
                enabled: d
            } = s;
        if (!d) return;
        if (!r.simulateTouch && "mouse" === e.pointerType) return;
        let c, p = e;
        if (p.originalEvent && (p = p.originalEvent), "pointermove" === p.type) {
            if (null !== i.touchId) return;
            if (p.pointerId !== i.pointerId) return
        }
        if ("touchmove" === p.type) {
            if (c = [...p.changedTouches].filter((e => e.identifier === i.touchId))[0], !c || c.identifier !== i.touchId) return
        } else c = p;
        if (!i.isTouched) return void(i.startMoving && i.isScrolling && s.emit("touchMoveOpposite", p));
        const u = c.pageX,
            m = c.pageY;
        if (p.preventedByNestedSwiper) return n.startX = u, void(n.startY = m);
        if (!s.allowTouchMove) return p.target.matches(i.focusableElements) || (s.allowClick = !1), void(i.isTouched && (Object.assign(n, {
            startX: u,
            startY: m,
            currentX: u,
            currentY: m
        }), i.touchStartTime = o()));
        if (r.touchReleaseOnEdges && !r.loop)
            if (s.isVertical()) {
                if (m < n.startY && s.translate <= s.maxTranslate() || m > n.startY && s.translate >= s.minTranslate()) return i.isTouched = !1, void(i.isMoved = !1)
            } else if (u < n.startX && s.translate <= s.maxTranslate() || u > n.startX && s.translate >= s.minTranslate()) return;
        if (t.activeElement && p.target === t.activeElement && p.target.matches(i.focusableElements)) return i.isMoved = !0, void(s.allowClick = !1);
        i.allowTouchCallbacks && s.emit("touchMove", p), n.previousX = n.currentX, n.previousY = n.currentY, n.currentX = u, n.currentY = m;
        const h = n.currentX - n.startX,
            f = n.currentY - n.startY;
        if (s.params.threshold && Math.sqrt(h ** 2 + f ** 2) < s.params.threshold) return;
        if (void 0 === i.isScrolling) {
            let e;
            s.isHorizontal() && n.currentY === n.startY || s.isVertical() && n.currentX === n.startX ? i.isScrolling = !1 : h * h + f * f >= 25 && (e = 180 * Math.atan2(Math.abs(f), Math.abs(h)) / Math.PI, i.isScrolling = s.isHorizontal() ? e > r.touchAngle : 90 - e > r.touchAngle)
        }
        if (i.isScrolling && s.emit("touchMoveOpposite", p), void 0 === i.startMoving && (n.currentX === n.startX && n.currentY === n.startY || (i.startMoving = !0)), i.isScrolling) return void(i.isTouched = !1);
        if (!i.startMoving) return;
        s.allowClick = !1, !r.cssMode && p.cancelable && p.preventDefault(), r.touchMoveStopPropagation && !r.nested && p.stopPropagation();
        let g = s.isHorizontal() ? h : f,
            v = s.isHorizontal() ? n.currentX - n.previousX : n.currentY - n.previousY;
        r.oneWayMovement && (g = Math.abs(g) * (l ? 1 : -1), v = Math.abs(v) * (l ? 1 : -1)), n.diff = g, g *= r.touchRatio, l && (g = -g, v = -v);
        const w = s.touchesDirection;
        s.swipeDirection = g > 0 ? "prev" : "next", s.touchesDirection = v > 0 ? "prev" : "next";
        const b = s.params.loop && !r.cssMode,
            y = "next" === s.touchesDirection && s.allowSlideNext || "prev" === s.touchesDirection && s.allowSlidePrev;
        if (!i.isMoved) {
            if (b && y && s.loopFix({
                    direction: s.swipeDirection
                }), i.startTranslate = s.getTranslate(), s.setTransition(0), s.animating) {
                const e = new window.CustomEvent("transitionend", {
                    bubbles: !0,
                    cancelable: !0
                });
                s.wrapperEl.dispatchEvent(e)
            }
            i.allowMomentumBounce = !1, !r.grabCursor || !0 !== s.allowSlideNext && !0 !== s.allowSlidePrev || s.setGrabCursor(!0), s.emit("sliderFirstMove", p)
        }
        if ((new Date).getTime(), i.isMoved && i.allowThresholdMove && w !== s.touchesDirection && b && y && Math.abs(g) >= 1) return Object.assign(n, {
            startX: u,
            startY: m,
            currentX: u,
            currentY: m,
            startTranslate: i.currentTranslate
        }), i.loopSwapReset = !0, void(i.startTranslate = i.currentTranslate);
        s.emit("sliderMove", p), i.isMoved = !0, i.currentTranslate = g + i.startTranslate;
        let E = !0,
            x = r.resistanceRatio;
        if (r.touchReleaseOnEdges && (x = 0), g > 0 ? (b && y && i.allowThresholdMove && i.currentTranslate > (r.centeredSlides ? s.minTranslate() - s.slidesSizesGrid[s.activeIndex + 1] : s.minTranslate()) && s.loopFix({
                direction: "prev",
                setTranslate: !0,
                activeSlideIndex: 0
            }), i.currentTranslate > s.minTranslate() && (E = !1, r.resistance && (i.currentTranslate = s.minTranslate() - 1 + (-s.minTranslate() + i.startTranslate + g) ** x))) : g < 0 && (b && y && i.allowThresholdMove && i.currentTranslate < (r.centeredSlides ? s.maxTranslate() + s.slidesSizesGrid[s.slidesSizesGrid.length - 1] : s.maxTranslate()) && s.loopFix({
                direction: "next",
                setTranslate: !0,
                activeSlideIndex: s.slides.length - ("auto" === r.slidesPerView ? s.slidesPerViewDynamic() : Math.ceil(parseFloat(r.slidesPerView, 10)))
            }), i.currentTranslate < s.maxTranslate() && (E = !1, r.resistance && (i.currentTranslate = s.maxTranslate() + 1 - (s.maxTranslate() - i.startTranslate - g) ** x))), E && (p.preventedByNestedSwiper = !0), !s.allowSlideNext && "next" === s.swipeDirection && i.currentTranslate < i.startTranslate && (i.currentTranslate = i.startTranslate), !s.allowSlidePrev && "prev" === s.swipeDirection && i.currentTranslate > i.startTranslate && (i.currentTranslate = i.startTranslate), s.allowSlidePrev || s.allowSlideNext || (i.currentTranslate = i.startTranslate), r.threshold > 0) {
            if (!(Math.abs(g) > r.threshold || i.allowThresholdMove)) return void(i.currentTranslate = i.startTranslate);
            if (!i.allowThresholdMove) return i.allowThresholdMove = !0, n.startX = n.currentX, n.startY = n.currentY, i.currentTranslate = i.startTranslate, void(n.diff = s.isHorizontal() ? n.currentX - n.startX : n.currentY - n.startY)
        }
        r.followFinger && !r.cssMode && ((r.freeMode && r.freeMode.enabled && s.freeMode || r.watchSlidesProgress) && (s.updateActiveIndex(), s.updateSlidesClasses()), r.freeMode && r.freeMode.enabled && s.freeMode && s.freeMode.onTouchMove(), s.updateProgress(i.currentTranslate), s.setTranslate(i.currentTranslate))
    }

    function R(e) {
        const t = this,
            s = t.touchEventsData;
        let a, i = e;
        i.originalEvent && (i = i.originalEvent);
        if ("touchend" === i.type || "touchcancel" === i.type) {
            if (a = [...i.changedTouches].filter((e => e.identifier === s.touchId))[0], !a || a.identifier !== s.touchId) return
        } else {
            if (null !== s.touchId) return;
            if (i.pointerId !== s.pointerId) return;
            a = i
        }
        if (["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(i.type)) {
            if (!(["pointercancel", "contextmenu"].includes(i.type) && (t.browser.isSafari || t.browser.isWebView))) return
        }
        s.pointerId = null, s.touchId = null;
        const {
            params: r,
            touches: n,
            rtlTranslate: d,
            slidesGrid: c,
            enabled: p
        } = t;
        if (!p) return;
        if (!r.simulateTouch && "mouse" === i.pointerType) return;
        if (s.allowTouchCallbacks && t.emit("touchEnd", i), s.allowTouchCallbacks = !1, !s.isTouched) return s.isMoved && r.grabCursor && t.setGrabCursor(!1), s.isMoved = !1, void(s.startMoving = !1);
        r.grabCursor && s.isMoved && s.isTouched && (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) && t.setGrabCursor(!1);
        const u = o(),
            m = u - s.touchStartTime;
        if (t.allowClick) {
            const e = i.path || i.composedPath && i.composedPath();
            t.updateClickedSlide(e && e[0] || i.target, e), t.emit("tap click", i), m < 300 && u - s.lastClickTime < 300 && t.emit("doubleTap doubleClick", i)
        }
        if (s.lastClickTime = o(), l((() => {
                t.destroyed || (t.allowClick = !0)
            })), !s.isTouched || !s.isMoved || !t.swipeDirection || 0 === n.diff && !s.loopSwapReset || s.currentTranslate === s.startTranslate && !s.loopSwapReset) return s.isTouched = !1, s.isMoved = !1, void(s.startMoving = !1);
        let h;
        if (s.isTouched = !1, s.isMoved = !1, s.startMoving = !1, h = r.followFinger ? d ? t.translate : -t.translate : -s.currentTranslate, r.cssMode) return;
        if (r.freeMode && r.freeMode.enabled) return void t.freeMode.onTouchEnd({
            currentPos: h
        });
        const f = h >= -t.maxTranslate() && !t.params.loop;
        let g = 0,
            v = t.slidesSizesGrid[0];
        for (let e = 0; e < c.length; e += e < r.slidesPerGroupSkip ? 1 : r.slidesPerGroup) {
            const t = e < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
            void 0 !== c[e + t] ? (f || h >= c[e] && h < c[e + t]) && (g = e, v = c[e + t] - c[e]) : (f || h >= c[e]) && (g = e, v = c[c.length - 1] - c[c.length - 2])
        }
        let w = null,
            b = null;
        r.rewind && (t.isBeginning ? b = r.virtual && r.virtual.enabled && t.virtual ? t.virtual.slides.length - 1 : t.slides.length - 1 : t.isEnd && (w = 0));
        const y = (h - c[g]) / v,
            E = g < r.slidesPerGroupSkip - 1 ? 1 : r.slidesPerGroup;
        if (m > r.longSwipesMs) {
            if (!r.longSwipes) return void t.slideTo(t.activeIndex);
            "next" === t.swipeDirection && (y >= r.longSwipesRatio ? t.slideTo(r.rewind && t.isEnd ? w : g + E) : t.slideTo(g)), "prev" === t.swipeDirection && (y > 1 - r.longSwipesRatio ? t.slideTo(g + E) : null !== b && y < 0 && Math.abs(y) > r.longSwipesRatio ? t.slideTo(b) : t.slideTo(g))
        } else {
            if (!r.shortSwipes) return void t.slideTo(t.activeIndex);
            t.navigation && (i.target === t.navigation.nextEl || i.target === t.navigation.prevEl) ? i.target === t.navigation.nextEl ? t.slideTo(g + E) : t.slideTo(g) : ("next" === t.swipeDirection && t.slideTo(null !== w ? w : g + E), "prev" === t.swipeDirection && t.slideTo(null !== b ? b : g))
        }
    }

    function q() {
        const e = this,
            {
                params: t,
                el: s
            } = e;
        if (s && 0 === s.offsetWidth) return;
        t.breakpoints && e.setBreakpoint();
        const {
            allowSlideNext: a,
            allowSlidePrev: i,
            snapGrid: r
        } = e, n = e.virtual && e.params.virtual.enabled;
        e.allowSlideNext = !0, e.allowSlidePrev = !0, e.updateSize(), e.updateSlides(), e.updateSlidesClasses();
        const l = n && t.loop;
        !("auto" === t.slidesPerView || t.slidesPerView > 1) || !e.isEnd || e.isBeginning || e.params.centeredSlides || l ? e.params.loop && !n ? e.slideToLoop(e.realIndex, 0, !1, !0) : e.slideTo(e.activeIndex, 0, !1, !0) : e.slideTo(e.slides.length - 1, 0, !1, !0), e.autoplay && e.autoplay.running && e.autoplay.paused && (clearTimeout(e.autoplay.resizeTimeout), e.autoplay.resizeTimeout = setTimeout((() => {
            e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.resume()
        }), 500)), e.allowSlidePrev = i, e.allowSlideNext = a, e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow()
    }

    function V(e) {
        const t = this;
        t.enabled && (t.allowClick || (t.params.preventClicks && e.preventDefault(), t.params.preventClicksPropagation && t.animating && (e.stopPropagation(), e.stopImmediatePropagation())))
    }

    function _() {
        const e = this,
            {
                wrapperEl: t,
                rtlTranslate: s,
                enabled: a
            } = e;
        if (!a) return;
        let i;
        e.previousTranslate = e.translate, e.isHorizontal() ? e.translate = -t.scrollLeft : e.translate = -t.scrollTop, 0 === e.translate && (e.translate = 0), e.updateActiveIndex(), e.updateSlidesClasses();
        const r = e.maxTranslate() - e.minTranslate();
        i = 0 === r ? 0 : (e.translate - e.minTranslate()) / r, i !== e.progress && e.updateProgress(s ? -e.translate : e.translate), e.emit("setTranslate", e.translate, !1)
    }

    function F(e) {
        const t = this;
        z(t, e.target), t.params.cssMode || "auto" !== t.params.slidesPerView && !t.params.autoHeight || t.update()
    }

    function j() {
        const e = this;
        e.documentTouchHandlerProceeded || (e.documentTouchHandlerProceeded = !0, e.params.touchReleaseOnEdges && (e.el.style.touchAction = "auto"))
    }
    const W = (e, t) => {
        const s = a(),
            {
                params: i,
                el: r,
                wrapperEl: n,
                device: l
            } = e,
            o = !!i.nested,
            d = "on" === t ? "addEventListener" : "removeEventListener",
            c = t;
        s[d]("touchstart", e.onDocumentTouchStart, {
            passive: !1,
            capture: o
        }), r[d]("touchstart", e.onTouchStart, {
            passive: !1
        }), r[d]("pointerdown", e.onTouchStart, {
            passive: !1
        }), s[d]("touchmove", e.onTouchMove, {
            passive: !1,
            capture: o
        }), s[d]("pointermove", e.onTouchMove, {
            passive: !1,
            capture: o
        }), s[d]("touchend", e.onTouchEnd, {
            passive: !0
        }), s[d]("pointerup", e.onTouchEnd, {
            passive: !0
        }), s[d]("pointercancel", e.onTouchEnd, {
            passive: !0
        }), s[d]("touchcancel", e.onTouchEnd, {
            passive: !0
        }), s[d]("pointerout", e.onTouchEnd, {
            passive: !0
        }), s[d]("pointerleave", e.onTouchEnd, {
            passive: !0
        }), s[d]("contextmenu", e.onTouchEnd, {
            passive: !0
        }), (i.preventClicks || i.preventClicksPropagation) && r[d]("click", e.onClick, !0), i.cssMode && n[d]("scroll", e.onScroll), i.updateOnWindowResize ? e[c](l.ios || l.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", q, !0) : e[c]("observerUpdate", q, !0), r[d]("load", e.onLoad, {
            capture: !0
        })
    };
    const U = (e, t) => e.grid && t.grid && t.grid.rows > 1;
    var K = {
        init: !0,
        direction: "horizontal",
        oneWayMovement: !1,
        touchEventsTarget: "wrapper",
        initialSlide: 0,
        speed: 300,
        cssMode: !1,
        updateOnWindowResize: !0,
        resizeObserver: !0,
        nested: !1,
        createElements: !1,
        eventsPrefix: "swiper",
        enabled: !0,
        focusableElements: "input, select, option, textarea, button, video, label",
        width: null,
        height: null,
        preventInteractionOnTransition: !1,
        userAgent: null,
        url: null,
        edgeSwipeDetection: !1,
        edgeSwipeThreshold: 20,
        autoHeight: !1,
        setWrapperSize: !1,
        virtualTranslate: !1,
        effect: "slide",
        breakpoints: void 0,
        breakpointsBase: "window",
        spaceBetween: 0,
        slidesPerView: 1,
        slidesPerGroup: 1,
        slidesPerGroupSkip: 0,
        slidesPerGroupAuto: !1,
        centeredSlides: !1,
        centeredSlidesBounds: !1,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        normalizeSlideIndex: !0,
        centerInsufficientSlides: !1,
        watchOverflow: !0,
        roundLengths: !1,
        touchRatio: 1,
        touchAngle: 45,
        simulateTouch: !0,
        shortSwipes: !0,
        longSwipes: !0,
        longSwipesRatio: .5,
        longSwipesMs: 300,
        followFinger: !0,
        allowTouchMove: !0,
        threshold: 5,
        touchMoveStopPropagation: !1,
        touchStartPreventDefault: !0,
        touchStartForcePreventDefault: !1,
        touchReleaseOnEdges: !1,
        uniqueNavElements: !0,
        resistance: !0,
        resistanceRatio: .85,
        watchSlidesProgress: !1,
        grabCursor: !1,
        preventClicks: !0,
        preventClicksPropagation: !0,
        slideToClickedSlide: !1,
        loop: !1,
        loopAddBlankSlides: !0,
        loopAdditionalSlides: 0,
        loopPreventsSliding: !0,
        rewind: !1,
        allowSlidePrev: !0,
        allowSlideNext: !0,
        swipeHandler: null,
        noSwiping: !0,
        noSwipingClass: "swiper-no-swiping",
        noSwipingSelector: null,
        passiveListeners: !0,
        maxBackfaceHiddenSlides: 10,
        containerModifierClass: "swiper-",
        slideClass: "swiper-slide",
        slideBlankClass: "swiper-slide-blank",
        slideActiveClass: "swiper-slide-active",
        slideVisibleClass: "swiper-slide-visible",
        slideFullyVisibleClass: "swiper-slide-fully-visible",
        slideNextClass: "swiper-slide-next",
        slidePrevClass: "swiper-slide-prev",
        wrapperClass: "swiper-wrapper",
        lazyPreloaderClass: "swiper-lazy-preloader",
        lazyPreloadPrevNext: 0,
        runCallbacksOnInit: !0,
        _emitClasses: !1
    };

    function Z(e, t) {
        return function (s) {
            void 0 === s && (s = {});
            const a = Object.keys(s)[0],
                i = s[a];
            "object" == typeof i && null !== i ? (!0 === e[a] && (e[a] = {
                enabled: !0
            }), "navigation" === a && e[a] && e[a].enabled && !e[a].prevEl && !e[a].nextEl && (e[a].auto = !0), ["pagination", "scrollbar"].indexOf(a) >= 0 && e[a] && e[a].enabled && !e[a].el && (e[a].auto = !0), a in e && "enabled" in i ? ("object" != typeof e[a] || "enabled" in e[a] || (e[a].enabled = !0), e[a] || (e[a] = {
                enabled: !1
            }), p(t, s)) : p(t, s)) : p(t, s)
        }
    }
    const Q = {
            eventsEmitter: I,
            update: O,
            translate: D,
            transition: {
                setTransition: function (e, t) {
                    const s = this;
                    s.params.cssMode || (s.wrapperEl.style.transitionDuration = `${e}ms`, s.wrapperEl.style.transitionDelay = 0 === e ? "0ms" : ""), s.emit("setTransition", e, t)
                },
                transitionStart: function (e, t) {
                    void 0 === e && (e = !0);
                    const s = this,
                        {
                            params: a
                        } = s;
                    a.cssMode || (a.autoHeight && s.updateAutoHeight(), G({
                        swiper: s,
                        runCallbacks: e,
                        direction: t,
                        step: "Start"
                    }))
                },
                transitionEnd: function (e, t) {
                    void 0 === e && (e = !0);
                    const s = this,
                        {
                            params: a
                        } = s;
                    s.animating = !1, a.cssMode || (s.setTransition(0), G({
                        swiper: s,
                        runCallbacks: e,
                        direction: t,
                        step: "End"
                    }))
                }
            },
            slide: X,
            loop: H,
            grabCursor: {
                setGrabCursor: function (e) {
                    const t = this;
                    if (!t.params.simulateTouch || t.params.watchOverflow && t.isLocked || t.params.cssMode) return;
                    const s = "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
                    t.isElement && (t.__preventObserver__ = !0), s.style.cursor = "move", s.style.cursor = e ? "grabbing" : "grab", t.isElement && requestAnimationFrame((() => {
                        t.__preventObserver__ = !1
                    }))
                },
                unsetGrabCursor: function () {
                    const e = this;
                    e.params.watchOverflow && e.isLocked || e.params.cssMode || (e.isElement && (e.__preventObserver__ = !0), e["container" === e.params.touchEventsTarget ? "el" : "wrapperEl"].style.cursor = "", e.isElement && requestAnimationFrame((() => {
                        e.__preventObserver__ = !1
                    })))
                }
            },
            events: {
                attachEvents: function () {
                    const e = this,
                        {
                            params: t
                        } = e;
                    e.onTouchStart = Y.bind(e), e.onTouchMove = B.bind(e), e.onTouchEnd = R.bind(e), e.onDocumentTouchStart = j.bind(e), t.cssMode && (e.onScroll = _.bind(e)), e.onClick = V.bind(e), e.onLoad = F.bind(e), W(e, "on")
                },
                detachEvents: function () {
                    W(this, "off")
                }
            },
            breakpoints: {
                setBreakpoint: function () {
                    const e = this,
                        {
                            realIndex: t,
                            initialized: s,
                            params: a,
                            el: i
                        } = e,
                        r = a.breakpoints;
                    if (!r || r && 0 === Object.keys(r).length) return;
                    const n = e.getBreakpoint(r, e.params.breakpointsBase, e.el);
                    if (!n || e.currentBreakpoint === n) return;
                    const l = (n in r ? r[n] : void 0) || e.originalParams,
                        o = U(e, a),
                        d = U(e, l),
                        c = a.enabled;
                    o && !d ? (i.classList.remove(`${a.containerModifierClass}grid`, `${a.containerModifierClass}grid-column`), e.emitContainerClasses()) : !o && d && (i.classList.add(`${a.containerModifierClass}grid`), (l.grid.fill && "column" === l.grid.fill || !l.grid.fill && "column" === a.grid.fill) && i.classList.add(`${a.containerModifierClass}grid-column`), e.emitContainerClasses()), ["navigation", "pagination", "scrollbar"].forEach((t => {
                        if (void 0 === l[t]) return;
                        const s = a[t] && a[t].enabled,
                            i = l[t] && l[t].enabled;
                        s && !i && e[t].disable(), !s && i && e[t].enable()
                    }));
                    const u = l.direction && l.direction !== a.direction,
                        m = a.loop && (l.slidesPerView !== a.slidesPerView || u),
                        h = a.loop;
                    u && s && e.changeDirection(), p(e.params, l);
                    const f = e.params.enabled,
                        g = e.params.loop;
                    Object.assign(e, {
                        allowTouchMove: e.params.allowTouchMove,
                        allowSlideNext: e.params.allowSlideNext,
                        allowSlidePrev: e.params.allowSlidePrev
                    }), c && !f ? e.disable() : !c && f && e.enable(), e.currentBreakpoint = n, e.emit("_beforeBreakpoint", l), s && (m ? (e.loopDestroy(), e.loopCreate(t), e.updateSlides()) : !h && g ? (e.loopCreate(t), e.updateSlides()) : h && !g && e.loopDestroy()), e.emit("breakpoint", l)
                },
                getBreakpoint: function (e, t, s) {
                    if (void 0 === t && (t = "window"), !e || "container" === t && !s) return;
                    let a = !1;
                    const i = r(),
                        n = "window" === t ? i.innerHeight : s.clientHeight,
                        l = Object.keys(e).map((e => {
                            if ("string" == typeof e && 0 === e.indexOf("@")) {
                                const t = parseFloat(e.substr(1));
                                return {
                                    value: n * t,
                                    point: e
                                }
                            }
                            return {
                                value: e,
                                point: e
                            }
                        }));
                    l.sort(((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10)));
                    for (let e = 0; e < l.length; e += 1) {
                        const {
                            point: r,
                            value: n
                        } = l[e];
                        "window" === t ? i.matchMedia(`(min-width: ${n}px)`).matches && (a = r) : n <= s.clientWidth && (a = r)
                    }
                    return a || "max"
                }
            },
            checkOverflow: {
                checkOverflow: function () {
                    const e = this,
                        {
                            isLocked: t,
                            params: s
                        } = e,
                        {
                            slidesOffsetBefore: a
                        } = s;
                    if (a) {
                        const t = e.slides.length - 1,
                            s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * a;
                        e.isLocked = e.size > s
                    } else e.isLocked = 1 === e.snapGrid.length;
                    !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked), !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked), t && t !== e.isLocked && (e.isEnd = !1), t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock")
                }
            },
            classes: {
                addClasses: function () {
                    const e = this,
                        {
                            classNames: t,
                            params: s,
                            rtl: a,
                            el: i,
                            device: r
                        } = e,
                        n = function (e, t) {
                            const s = [];
                            return e.forEach((e => {
                                "object" == typeof e ? Object.keys(e).forEach((a => {
                                    e[a] && s.push(t + a)
                                })) : "string" == typeof e && s.push(t + e)
                            })), s
                        }(["initialized", s.direction, {
                            "free-mode": e.params.freeMode && s.freeMode.enabled
                        }, {
                            autoheight: s.autoHeight
                        }, {
                            rtl: a
                        }, {
                            grid: s.grid && s.grid.rows > 1
                        }, {
                            "grid-column": s.grid && s.grid.rows > 1 && "column" === s.grid.fill
                        }, {
                            android: r.android
                        }, {
                            ios: r.ios
                        }, {
                            "css-mode": s.cssMode
                        }, {
                            centered: s.cssMode && s.centeredSlides
                        }, {
                            "watch-progress": s.watchSlidesProgress
                        }], s.containerModifierClass);
                    t.push(...n), i.classList.add(...t), e.emitContainerClasses()
                },
                removeClasses: function () {
                    const {
                        el: e,
                        classNames: t
                    } = this;
                    e.classList.remove(...t), this.emitContainerClasses()
                }
            }
        },
        J = {};
    class ee {
        constructor() {
            let e, t;
            for (var s = arguments.length, i = new Array(s), r = 0; r < s; r++) i[r] = arguments[r];
            1 === i.length && i[0].constructor && "Object" === Object.prototype.toString.call(i[0]).slice(8, -1) ? t = i[0] : [e, t] = i, t || (t = {}), t = p({}, t), e && !t.el && (t.el = e);
            const n = a();
            if (t.el && "string" == typeof t.el && n.querySelectorAll(t.el).length > 1) {
                const e = [];
                return n.querySelectorAll(t.el).forEach((s => {
                    const a = p({}, t, {
                        el: s
                    });
                    e.push(new ee(a))
                })), e
            }
            const l = this;
            l.__swiper__ = !0, l.support = P(), l.device = L({
                userAgent: t.userAgent
            }), l.browser = A(), l.eventsListeners = {}, l.eventsAnyListeners = [], l.modules = [...l.__modules__], t.modules && Array.isArray(t.modules) && l.modules.push(...t.modules);
            const o = {};
            l.modules.forEach((e => {
                e({
                    params: t,
                    swiper: l,
                    extendParams: Z(t, o),
                    on: l.on.bind(l),
                    once: l.once.bind(l),
                    off: l.off.bind(l),
                    emit: l.emit.bind(l)
                })
            }));
            const d = p({}, K, o);
            return l.params = p({}, d, J, t), l.originalParams = p({}, l.params), l.passedParams = p({}, t), l.params && l.params.on && Object.keys(l.params.on).forEach((e => {
                l.on(e, l.params.on[e])
            })), l.params && l.params.onAny && l.onAny(l.params.onAny), Object.assign(l, {
                enabled: l.params.enabled,
                el: e,
                classNames: [],
                slides: [],
                slidesGrid: [],
                snapGrid: [],
                slidesSizesGrid: [],
                isHorizontal: () => "horizontal" === l.params.direction,
                isVertical: () => "vertical" === l.params.direction,
                activeIndex: 0,
                realIndex: 0,
                isBeginning: !0,
                isEnd: !1,
                translate: 0,
                previousTranslate: 0,
                progress: 0,
                velocity: 0,
                animating: !1,
                cssOverflowAdjustment() {
                    return Math.trunc(this.translate / 2 ** 23) * 2 ** 23
                },
                allowSlideNext: l.params.allowSlideNext,
                allowSlidePrev: l.params.allowSlidePrev,
                touchEventsData: {
                    isTouched: void 0,
                    isMoved: void 0,
                    allowTouchCallbacks: void 0,
                    touchStartTime: void 0,
                    isScrolling: void 0,
                    currentTranslate: void 0,
                    startTranslate: void 0,
                    allowThresholdMove: void 0,
                    focusableElements: l.params.focusableElements,
                    lastClickTime: 0,
                    clickTimeout: void 0,
                    velocities: [],
                    allowMomentumBounce: void 0,
                    startMoving: void 0,
                    pointerId: null,
                    touchId: null
                },
                allowClick: !0,
                allowTouchMove: l.params.allowTouchMove,
                touches: {
                    startX: 0,
                    startY: 0,
                    currentX: 0,
                    currentY: 0,
                    diff: 0
                },
                imagesToLoad: [],
                imagesLoaded: 0
            }), l.emit("_swiper"), l.params.init && l.init(), l
        }
        getDirectionLabel(e) {
            return this.isHorizontal() ? e : {
                width: "height",
                "margin-top": "margin-left",
                "margin-bottom ": "margin-right",
                "margin-left": "margin-top",
                "margin-right": "margin-bottom",
                "padding-left": "padding-top",
                "padding-right": "padding-bottom",
                marginRight: "marginBottom"
            } [e]
        }
        getSlideIndex(e) {
            const {
                slidesEl: t,
                params: s
            } = this, a = y(f(t, `.${s.slideClass}, swiper-slide`)[0]);
            return y(e) - a
        }
        getSlideIndexByData(e) {
            return this.getSlideIndex(this.slides.filter((t => 1 * t.getAttribute("data-swiper-slide-index") === e))[0])
        }
        recalcSlides() {
            const {
                slidesEl: e,
                params: t
            } = this;
            this.slides = f(e, `.${t.slideClass}, swiper-slide`)
        }
        enable() {
            const e = this;
            e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"))
        }
        disable() {
            const e = this;
            e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"))
        }
        setProgress(e, t) {
            const s = this;
            e = Math.min(Math.max(e, 0), 1);
            const a = s.minTranslate(),
                i = (s.maxTranslate() - a) * e + a;
            s.translateTo(i, void 0 === t ? 0 : t), s.updateActiveIndex(), s.updateSlidesClasses()
        }
        emitContainerClasses() {
            const e = this;
            if (!e.params._emitClasses || !e.el) return;
            const t = e.el.className.split(" ").filter((t => 0 === t.indexOf("swiper") || 0 === t.indexOf(e.params.containerModifierClass)));
            e.emit("_containerClasses", t.join(" "))
        }
        getSlideClasses(e) {
            const t = this;
            return t.destroyed ? "" : e.className.split(" ").filter((e => 0 === e.indexOf("swiper-slide") || 0 === e.indexOf(t.params.slideClass))).join(" ")
        }
        emitSlidesClasses() {
            const e = this;
            if (!e.params._emitClasses || !e.el) return;
            const t = [];
            e.slides.forEach((s => {
                const a = e.getSlideClasses(s);
                t.push({
                    slideEl: s,
                    classNames: a
                }), e.emit("_slideClass", s, a)
            })), e.emit("_slideClasses", t)
        }
        slidesPerViewDynamic(e, t) {
            void 0 === e && (e = "current"), void 0 === t && (t = !1);
            const {
                params: s,
                slides: a,
                slidesGrid: i,
                slidesSizesGrid: r,
                size: n,
                activeIndex: l
            } = this;
            let o = 1;
            if ("number" == typeof s.slidesPerView) return s.slidesPerView;
            if (s.centeredSlides) {
                let e, t = a[l] ? a[l].swiperSlideSize : 0;
                for (let s = l + 1; s < a.length; s += 1) a[s] && !e && (t += a[s].swiperSlideSize, o += 1, t > n && (e = !0));
                for (let s = l - 1; s >= 0; s -= 1) a[s] && !e && (t += a[s].swiperSlideSize, o += 1, t > n && (e = !0))
            } else if ("current" === e)
                for (let e = l + 1; e < a.length; e += 1) {
                    (t ? i[e] + r[e] - i[l] < n : i[e] - i[l] < n) && (o += 1)
                } else
                    for (let e = l - 1; e >= 0; e -= 1) {
                        i[l] - i[e] < n && (o += 1)
                    }
            return o
        }
        update() {
            const e = this;
            if (!e || e.destroyed) return;
            const {
                snapGrid: t,
                params: s
            } = e;

            function a() {
                const t = e.rtlTranslate ? -1 * e.translate : e.translate,
                    s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
                e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses()
            }
            let i;
            if (s.breakpoints && e.setBreakpoint(), [...e.el.querySelectorAll('[loading="lazy"]')].forEach((t => {
                    t.complete && z(e, t)
                })), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses(), s.freeMode && s.freeMode.enabled && !s.cssMode) a(), s.autoHeight && e.updateAutoHeight();
            else {
                if (("auto" === s.slidesPerView || s.slidesPerView > 1) && e.isEnd && !s.centeredSlides) {
                    const t = e.virtual && s.virtual.enabled ? e.virtual.slides : e.slides;
                    i = e.slideTo(t.length - 1, 0, !1, !0)
                } else i = e.slideTo(e.activeIndex, 0, !1, !0);
                i || a()
            }
            s.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update")
        }
        changeDirection(e, t) {
            void 0 === t && (t = !0);
            const s = this,
                a = s.params.direction;
            return e || (e = "horizontal" === a ? "vertical" : "horizontal"), e === a || "horizontal" !== e && "vertical" !== e || (s.el.classList.remove(`${s.params.containerModifierClass}${a}`), s.el.classList.add(`${s.params.containerModifierClass}${e}`), s.emitContainerClasses(), s.params.direction = e, s.slides.forEach((t => {
                "vertical" === e ? t.style.width = "" : t.style.height = ""
            })), s.emit("changeDirection"), t && s.update()), s
        }
        changeLanguageDirection(e) {
            const t = this;
            t.rtl && "rtl" === e || !t.rtl && "ltr" === e || (t.rtl = "rtl" === e, t.rtlTranslate = "horizontal" === t.params.direction && t.rtl, t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`), t.el.dir = "rtl") : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`), t.el.dir = "ltr"), t.update())
        }
        mount(e) {
            const t = this;
            if (t.mounted) return !0;
            let s = e || t.params.el;
            if ("string" == typeof s && (s = document.querySelector(s)), !s) return !1;
            s.swiper = t, s.parentNode && s.parentNode.host && "SWIPER-CONTAINER" === s.parentNode.host.nodeName && (t.isElement = !0);
            const a = () => `.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;
            let i = (() => {
                if (s && s.shadowRoot && s.shadowRoot.querySelector) {
                    return s.shadowRoot.querySelector(a())
                }
                return f(s, a())[0]
            })();
            return !i && t.params.createElements && (i = v("div", t.params.wrapperClass), s.append(i), f(s, `.${t.params.slideClass}`).forEach((e => {
                i.append(e)
            }))), Object.assign(t, {
                el: s,
                wrapperEl: i,
                slidesEl: t.isElement && !s.parentNode.host.slideSlots ? s.parentNode.host : i,
                hostEl: t.isElement ? s.parentNode.host : s,
                mounted: !0,
                rtl: "rtl" === s.dir.toLowerCase() || "rtl" === b(s, "direction"),
                rtlTranslate: "horizontal" === t.params.direction && ("rtl" === s.dir.toLowerCase() || "rtl" === b(s, "direction")),
                wrongRTL: "-webkit-box" === b(i, "display")
            }), !0
        }
        init(e) {
            const t = this;
            if (t.initialized) return t;
            if (!1 === t.mount(e)) return t;
            t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), t.addClasses(), t.updateSize(), t.updateSlides(), t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.enabled && t.setGrabCursor(), t.params.loop && t.virtual && t.params.virtual.enabled ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0), t.params.loop && t.loopCreate(), t.attachEvents();
            const s = [...t.el.querySelectorAll('[loading="lazy"]')];
            return t.isElement && s.push(...t.hostEl.querySelectorAll('[loading="lazy"]')), s.forEach((e => {
                e.complete ? z(t, e) : e.addEventListener("load", (e => {
                    z(t, e.target)
                }))
            })), k(t), t.initialized = !0, k(t), t.emit("init"), t.emit("afterInit"), t
        }
        destroy(e, t) {
            void 0 === e && (e = !0), void 0 === t && (t = !0);
            const s = this,
                {
                    params: a,
                    el: i,
                    wrapperEl: r,
                    slides: n
                } = s;
            return void 0 === s.params || s.destroyed || (s.emit("beforeDestroy"), s.initialized = !1, s.detachEvents(), a.loop && s.loopDestroy(), t && (s.removeClasses(), i.removeAttribute("style"), r.removeAttribute("style"), n && n.length && n.forEach((e => {
                e.classList.remove(a.slideVisibleClass, a.slideFullyVisibleClass, a.slideActiveClass, a.slideNextClass, a.slidePrevClass), e.removeAttribute("style"), e.removeAttribute("data-swiper-slide-index")
            }))), s.emit("destroy"), Object.keys(s.eventsListeners).forEach((e => {
                s.off(e)
            })), !1 !== e && (s.el.swiper = null, function (e) {
                const t = e;
                Object.keys(t).forEach((e => {
                    try {
                        t[e] = null
                    } catch (e) {}
                    try {
                        delete t[e]
                    } catch (e) {}
                }))
            }(s)), s.destroyed = !0), null
        }
        static extendDefaults(e) {
            p(J, e)
        }
        static get extendedDefaults() {
            return J
        }
        static get defaults() {
            return K
        }
        static installModule(e) {
            ee.prototype.__modules__ || (ee.prototype.__modules__ = []);
            const t = ee.prototype.__modules__;
            "function" == typeof e && t.indexOf(e) < 0 && t.push(e)
        }
        static use(e) {
            return Array.isArray(e) ? (e.forEach((e => ee.installModule(e))), ee) : (ee.installModule(e), ee)
        }
    }

    function te(e, t, s, a) {
        return e.params.createElements && Object.keys(a).forEach((i => {
            if (!s[i] && !0 === s.auto) {
                let r = f(e.el, `.${a[i]}`)[0];
                r || (r = v("div", a[i]), r.className = a[i], e.el.append(r)), s[i] = r, t[i] = r
            }
        })), s
    }

    function se(e) {
        return void 0 === e && (e = ""), `.${e.trim().replace(/([\.:!+\/])/g,"\\$1").replace(/ /g,".")}`
    }

    function ae(e) {
        const t = this,
            {
                params: s,
                slidesEl: a
            } = t;
        s.loop && t.loopDestroy();
        const i = e => {
            if ("string" == typeof e) {
                const t = document.createElement("div");
                t.innerHTML = e, a.append(t.children[0]), t.innerHTML = ""
            } else a.append(e)
        };
        if ("object" == typeof e && "length" in e)
            for (let t = 0; t < e.length; t += 1) e[t] && i(e[t]);
        else i(e);
        t.recalcSlides(), s.loop && t.loopCreate(), s.observer && !t.isElement || t.update()
    }

    function ie(e) {
        const t = this,
            {
                params: s,
                activeIndex: a,
                slidesEl: i
            } = t;
        s.loop && t.loopDestroy();
        let r = a + 1;
        const n = e => {
            if ("string" == typeof e) {
                const t = document.createElement("div");
                t.innerHTML = e, i.prepend(t.children[0]), t.innerHTML = ""
            } else i.prepend(e)
        };
        if ("object" == typeof e && "length" in e) {
            for (let t = 0; t < e.length; t += 1) e[t] && n(e[t]);
            r = a + e.length
        } else n(e);
        t.recalcSlides(), s.loop && t.loopCreate(), s.observer && !t.isElement || t.update(), t.slideTo(r, 0, !1)
    }

    function re(e, t) {
        const s = this,
            {
                params: a,
                activeIndex: i,
                slidesEl: r
            } = s;
        let n = i;
        a.loop && (n -= s.loopedSlides, s.loopDestroy(), s.recalcSlides());
        const l = s.slides.length;
        if (e <= 0) return void s.prependSlide(t);
        if (e >= l) return void s.appendSlide(t);
        let o = n > e ? n + 1 : n;
        const d = [];
        for (let t = l - 1; t >= e; t -= 1) {
            const e = s.slides[t];
            e.remove(), d.unshift(e)
        }
        if ("object" == typeof t && "length" in t) {
            for (let e = 0; e < t.length; e += 1) t[e] && r.append(t[e]);
            o = n > e ? n + t.length : n
        } else r.append(t);
        for (let e = 0; e < d.length; e += 1) r.append(d[e]);
        s.recalcSlides(), a.loop && s.loopCreate(), a.observer && !s.isElement || s.update(), a.loop ? s.slideTo(o + s.loopedSlides, 0, !1) : s.slideTo(o, 0, !1)
    }

    function ne(e) {
        const t = this,
            {
                params: s,
                activeIndex: a
            } = t;
        let i = a;
        s.loop && (i -= t.loopedSlides, t.loopDestroy());
        let r, n = i;
        if ("object" == typeof e && "length" in e) {
            for (let s = 0; s < e.length; s += 1) r = e[s], t.slides[r] && t.slides[r].remove(), r < n && (n -= 1);
            n = Math.max(n, 0)
        } else r = e, t.slides[r] && t.slides[r].remove(), r < n && (n -= 1), n = Math.max(n, 0);
        t.recalcSlides(), s.loop && t.loopCreate(), s.observer && !t.isElement || t.update(), s.loop ? t.slideTo(n + t.loopedSlides, 0, !1) : t.slideTo(n, 0, !1)
    }

    function le() {
        const e = this,
            t = [];
        for (let s = 0; s < e.slides.length; s += 1) t.push(s);
        e.removeSlide(t)
    }

    function oe(e) {
        const {
            effect: t,
            swiper: s,
            on: a,
            setTranslate: i,
            setTransition: r,
            overwriteParams: n,
            perspective: l,
            recreateShadows: o,
            getEffectParams: d
        } = e;
        let c;
        a("beforeInit", (() => {
            if (s.params.effect !== t) return;
            s.classNames.push(`${s.params.containerModifierClass}${t}`), l && l() && s.classNames.push(`${s.params.containerModifierClass}3d`);
            const e = n ? n() : {};
            Object.assign(s.params, e), Object.assign(s.originalParams, e)
        })), a("setTranslate", (() => {
            s.params.effect === t && i()
        })), a("setTransition", ((e, a) => {
            s.params.effect === t && r(a)
        })), a("transitionEnd", (() => {
            if (s.params.effect === t && o) {
                if (!d || !d().slideShadows) return;
                s.slides.forEach((e => {
                    e.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((e => e.remove()))
                })), o()
            }
        })), a("virtualUpdate", (() => {
            s.params.effect === t && (s.slides.length || (c = !0), requestAnimationFrame((() => {
                c && s.slides && s.slides.length && (i(), c = !1)
            })))
        }))
    }

    function de(e, t) {
        const s = h(t);
        return s !== t && (s.style.backfaceVisibility = "hidden", s.style["-webkit-backface-visibility"] = "hidden"), s
    }

    function ce(e) {
        let {
            swiper: t,
            duration: s,
            transformElements: a,
            allSlides: i
        } = e;
        const {
            activeIndex: r
        } = t;
        if (t.params.virtualTranslate && 0 !== s) {
            let e, s = !1;
            e = i ? a : a.filter((e => {
                const s = e.classList.contains("swiper-slide-transform") ? (e => {
                    if (!e.parentElement) return t.slides.filter((t => t.shadowRoot && t.shadowRoot === e.parentNode))[0];
                    return e.parentElement
                })(e) : e;
                return t.getSlideIndex(s) === r
            })), e.forEach((e => {
                x(e, (() => {
                    if (s) return;
                    if (!t || t.destroyed) return;
                    s = !0, t.animating = !1;
                    const e = new window.CustomEvent("transitionend", {
                        bubbles: !0,
                        cancelable: !0
                    });
                    t.wrapperEl.dispatchEvent(e)
                }))
            }))
        }
    }

    function pe(e, t, s) {
        const a = `swiper-slide-shadow${s?`-${s}`:""}${e?` swiper-slide-shadow-${e}`:""}`,
            i = h(t);
        let r = i.querySelector(`.${a.split(" ").join(".")}`);
        return r || (r = v("div", a.split(" ")), i.append(r)), r
    }
    Object.keys(Q).forEach((e => {
        Object.keys(Q[e]).forEach((t => {
            ee.prototype[t] = Q[e][t]
        }))
    })), ee.use([function (e) {
        let {
            swiper: t,
            on: s,
            emit: a
        } = e;
        const i = r();
        let n = null,
            l = null;
        const o = () => {
                t && !t.destroyed && t.initialized && (a("beforeResize"), a("resize"))
            },
            d = () => {
                t && !t.destroyed && t.initialized && a("orientationchange")
            };
        s("init", (() => {
            t.params.resizeObserver && void 0 !== i.ResizeObserver ? t && !t.destroyed && t.initialized && (n = new ResizeObserver((e => {
                l = i.requestAnimationFrame((() => {
                    const {
                        width: s,
                        height: a
                    } = t;
                    let i = s,
                        r = a;
                    e.forEach((e => {
                        let {
                            contentBoxSize: s,
                            contentRect: a,
                            target: n
                        } = e;
                        n && n !== t.el || (i = a ? a.width : (s[0] || s).inlineSize, r = a ? a.height : (s[0] || s).blockSize)
                    })), i === s && r === a || o()
                }))
            })), n.observe(t.el)) : (i.addEventListener("resize", o), i.addEventListener("orientationchange", d))
        })), s("destroy", (() => {
            l && i.cancelAnimationFrame(l), n && n.unobserve && t.el && (n.unobserve(t.el), n = null), i.removeEventListener("resize", o), i.removeEventListener("orientationchange", d)
        }))
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a,
            emit: i
        } = e;
        const n = [],
            l = r(),
            o = function (e, s) {
                void 0 === s && (s = {});
                const a = new(l.MutationObserver || l.WebkitMutationObserver)((e => {
                    if (t.__preventObserver__) return;
                    if (1 === e.length) return void i("observerUpdate", e[0]);
                    const s = function () {
                        i("observerUpdate", e[0])
                    };
                    l.requestAnimationFrame ? l.requestAnimationFrame(s) : l.setTimeout(s, 0)
                }));
                a.observe(e, {
                    attributes: void 0 === s.attributes || s.attributes,
                    childList: void 0 === s.childList || s.childList,
                    characterData: void 0 === s.characterData || s.characterData
                }), n.push(a)
            };
        s({
            observer: !1,
            observeParents: !1,
            observeSlideChildren: !1
        }), a("init", (() => {
            if (t.params.observer) {
                if (t.params.observeParents) {
                    const e = E(t.hostEl);
                    for (let t = 0; t < e.length; t += 1) o(e[t])
                }
                o(t.hostEl, {
                    childList: t.params.observeSlideChildren
                }), o(t.wrapperEl, {
                    attributes: !1
                })
            }
        })), a("destroy", (() => {
            n.forEach((e => {
                e.disconnect()
            })), n.splice(0, n.length)
        }))
    }]);
    const ue = [function (e) {
        let t, {
            swiper: s,
            extendParams: i,
            on: r,
            emit: n
        } = e;
        i({
            virtual: {
                enabled: !1,
                slides: [],
                cache: !0,
                renderSlide: null,
                renderExternal: null,
                renderExternalUpdate: !0,
                addSlidesBefore: 0,
                addSlidesAfter: 0
            }
        });
        const l = a();
        s.virtual = {
            cache: {},
            from: void 0,
            to: void 0,
            slides: [],
            offset: 0,
            slidesGrid: []
        };
        const o = l.createElement("div");

        function d(e, t) {
            const a = s.params.virtual;
            if (a.cache && s.virtual.cache[t]) return s.virtual.cache[t];
            let i;
            return a.renderSlide ? (i = a.renderSlide.call(s, e, t), "string" == typeof i && (o.innerHTML = i, i = o.children[0])) : i = s.isElement ? v("swiper-slide") : v("div", s.params.slideClass), i.setAttribute("data-swiper-slide-index", t), a.renderSlide || (i.innerHTML = e), a.cache && (s.virtual.cache[t] = i), i
        }

        function c(e) {
            const {
                slidesPerView: t,
                slidesPerGroup: a,
                centeredSlides: i,
                loop: r
            } = s.params, {
                addSlidesBefore: l,
                addSlidesAfter: o
            } = s.params.virtual, {
                from: c,
                to: p,
                slides: u,
                slidesGrid: m,
                offset: h
            } = s.virtual;
            s.params.cssMode || s.updateActiveIndex();
            const g = s.activeIndex || 0;
            let v, w, b;
            v = s.rtlTranslate ? "right" : s.isHorizontal() ? "left" : "top", i ? (w = Math.floor(t / 2) + a + o, b = Math.floor(t / 2) + a + l) : (w = t + (a - 1) + o, b = (r ? t : a) + l);
            let y = g - b,
                E = g + w;
            r || (y = Math.max(y, 0), E = Math.min(E, u.length - 1));
            let x = (s.slidesGrid[y] || 0) - (s.slidesGrid[0] || 0);

            function S() {
                s.updateSlides(), s.updateProgress(), s.updateSlidesClasses(), n("virtualUpdate")
            }
            if (r && g >= b ? (y -= b, i || (x += s.slidesGrid[0])) : r && g < b && (y = -b, i && (x += s.slidesGrid[0])), Object.assign(s.virtual, {
                    from: y,
                    to: E,
                    offset: x,
                    slidesGrid: s.slidesGrid,
                    slidesBefore: b,
                    slidesAfter: w
                }), c === y && p === E && !e) return s.slidesGrid !== m && x !== h && s.slides.forEach((e => {
                e.style[v] = x - Math.abs(s.cssOverflowAdjustment()) + "px"
            })), s.updateProgress(), void n("virtualUpdate");
            if (s.params.virtual.renderExternal) return s.params.virtual.renderExternal.call(s, {
                offset: x,
                from: y,
                to: E,
                slides: function () {
                    const e = [];
                    for (let t = y; t <= E; t += 1) e.push(u[t]);
                    return e
                }()
            }), void(s.params.virtual.renderExternalUpdate ? S() : n("virtualUpdate"));
            const T = [],
                M = [],
                C = e => {
                    let t = e;
                    return e < 0 ? t = u.length + e : t >= u.length && (t -= u.length), t
                };
            if (e) s.slides.filter((e => e.matches(`.${s.params.slideClass}, swiper-slide`))).forEach((e => {
                e.remove()
            }));
            else
                for (let e = c; e <= p; e += 1)
                    if (e < y || e > E) {
                        const t = C(e);
                        s.slides.filter((e => e.matches(`.${s.params.slideClass}[data-swiper-slide-index="${t}"], swiper-slide[data-swiper-slide-index="${t}"]`))).forEach((e => {
                            e.remove()
                        }))
                    } const P = r ? -u.length : 0,
                L = r ? 2 * u.length : u.length;
            for (let t = P; t < L; t += 1)
                if (t >= y && t <= E) {
                    const s = C(t);
                    void 0 === p || e ? M.push(s) : (t > p && M.push(s), t < c && T.push(s))
                } if (M.forEach((e => {
                    s.slidesEl.append(d(u[e], e))
                })), r)
                for (let e = T.length - 1; e >= 0; e -= 1) {
                    const t = T[e];
                    s.slidesEl.prepend(d(u[t], t))
                } else T.sort(((e, t) => t - e)), T.forEach((e => {
                    s.slidesEl.prepend(d(u[e], e))
                }));
            f(s.slidesEl, ".swiper-slide, swiper-slide").forEach((e => {
                e.style[v] = x - Math.abs(s.cssOverflowAdjustment()) + "px"
            })), S()
        }
        r("beforeInit", (() => {
            if (!s.params.virtual.enabled) return;
            let e;
            if (void 0 === s.passedParams.virtual.slides) {
                const t = [...s.slidesEl.children].filter((e => e.matches(`.${s.params.slideClass}, swiper-slide`)));
                t && t.length && (s.virtual.slides = [...t], e = !0, t.forEach(((e, t) => {
                    e.setAttribute("data-swiper-slide-index", t), s.virtual.cache[t] = e, e.remove()
                })))
            }
            e || (s.virtual.slides = s.params.virtual.slides), s.classNames.push(`${s.params.containerModifierClass}virtual`), s.params.watchSlidesProgress = !0, s.originalParams.watchSlidesProgress = !0, c()
        })), r("setTranslate", (() => {
            s.params.virtual.enabled && (s.params.cssMode && !s._immediateVirtual ? (clearTimeout(t), t = setTimeout((() => {
                c()
            }), 100)) : c())
        })), r("init update resize", (() => {
            s.params.virtual.enabled && s.params.cssMode && u(s.wrapperEl, "--swiper-virtual-size", `${s.virtualSize}px`)
        })), Object.assign(s.virtual, {
            appendSlide: function (e) {
                if ("object" == typeof e && "length" in e)
                    for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.push(e[t]);
                else s.virtual.slides.push(e);
                c(!0)
            },
            prependSlide: function (e) {
                const t = s.activeIndex;
                let a = t + 1,
                    i = 1;
                if (Array.isArray(e)) {
                    for (let t = 0; t < e.length; t += 1) e[t] && s.virtual.slides.unshift(e[t]);
                    a = t + e.length, i = e.length
                } else s.virtual.slides.unshift(e);
                if (s.params.virtual.cache) {
                    const e = s.virtual.cache,
                        t = {};
                    Object.keys(e).forEach((s => {
                        const a = e[s],
                            r = a.getAttribute("data-swiper-slide-index");
                        r && a.setAttribute("data-swiper-slide-index", parseInt(r, 10) + i), t[parseInt(s, 10) + i] = a
                    })), s.virtual.cache = t
                }
                c(!0), s.slideTo(a, 0)
            },
            removeSlide: function (e) {
                if (null == e) return;
                let t = s.activeIndex;
                if (Array.isArray(e))
                    for (let a = e.length - 1; a >= 0; a -= 1) s.params.virtual.cache && (delete s.virtual.cache[e[a]], Object.keys(s.virtual.cache).forEach((t => {
                        t > e && (s.virtual.cache[t - 1] = s.virtual.cache[t], s.virtual.cache[t - 1].setAttribute("data-swiper-slide-index", t - 1), delete s.virtual.cache[t])
                    }))), s.virtual.slides.splice(e[a], 1), e[a] < t && (t -= 1), t = Math.max(t, 0);
                else s.params.virtual.cache && (delete s.virtual.cache[e], Object.keys(s.virtual.cache).forEach((t => {
                    t > e && (s.virtual.cache[t - 1] = s.virtual.cache[t], s.virtual.cache[t - 1].setAttribute("data-swiper-slide-index", t - 1), delete s.virtual.cache[t])
                }))), s.virtual.slides.splice(e, 1), e < t && (t -= 1), t = Math.max(t, 0);
                c(!0), s.slideTo(t, 0)
            },
            removeAllSlides: function () {
                s.virtual.slides = [], s.params.virtual.cache && (s.virtual.cache = {}), c(!0), s.slideTo(0, 0)
            },
            update: c
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: i,
            emit: n
        } = e;
        const l = a(),
            o = r();

        function d(e) {
            if (!t.enabled) return;
            const {
                rtlTranslate: s
            } = t;
            let a = e;
            a.originalEvent && (a = a.originalEvent);
            const i = a.keyCode || a.charCode,
                r = t.params.keyboard.pageUpDown,
                d = r && 33 === i,
                c = r && 34 === i,
                p = 37 === i,
                u = 39 === i,
                m = 38 === i,
                h = 40 === i;
            if (!t.allowSlideNext && (t.isHorizontal() && u || t.isVertical() && h || c)) return !1;
            if (!t.allowSlidePrev && (t.isHorizontal() && p || t.isVertical() && m || d)) return !1;
            if (!(a.shiftKey || a.altKey || a.ctrlKey || a.metaKey || l.activeElement && l.activeElement.nodeName && ("input" === l.activeElement.nodeName.toLowerCase() || "textarea" === l.activeElement.nodeName.toLowerCase()))) {
                if (t.params.keyboard.onlyInViewport && (d || c || p || u || m || h)) {
                    let e = !1;
                    if (E(t.el, `.${t.params.slideClass}, swiper-slide`).length > 0 && 0 === E(t.el, `.${t.params.slideActiveClass}`).length) return;
                    const a = t.el,
                        i = a.clientWidth,
                        r = a.clientHeight,
                        n = o.innerWidth,
                        l = o.innerHeight,
                        d = w(a);
                    s && (d.left -= a.scrollLeft);
                    const c = [
                        [d.left, d.top],
                        [d.left + i, d.top],
                        [d.left, d.top + r],
                        [d.left + i, d.top + r]
                    ];
                    for (let t = 0; t < c.length; t += 1) {
                        const s = c[t];
                        if (s[0] >= 0 && s[0] <= n && s[1] >= 0 && s[1] <= l) {
                            if (0 === s[0] && 0 === s[1]) continue;
                            e = !0
                        }
                    }
                    if (!e) return
                }
                t.isHorizontal() ? ((d || c || p || u) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1), ((c || u) && !s || (d || p) && s) && t.slideNext(), ((d || p) && !s || (c || u) && s) && t.slidePrev()) : ((d || c || m || h) && (a.preventDefault ? a.preventDefault() : a.returnValue = !1), (c || h) && t.slideNext(), (d || m) && t.slidePrev()), n("keyPress", i)
            }
        }

        function c() {
            t.keyboard.enabled || (l.addEventListener("keydown", d), t.keyboard.enabled = !0)
        }

        function p() {
            t.keyboard.enabled && (l.removeEventListener("keydown", d), t.keyboard.enabled = !1)
        }
        t.keyboard = {
            enabled: !1
        }, s({
            keyboard: {
                enabled: !1,
                onlyInViewport: !0,
                pageUpDown: !0
            }
        }), i("init", (() => {
            t.params.keyboard.enabled && c()
        })), i("destroy", (() => {
            t.keyboard.enabled && p()
        })), Object.assign(t.keyboard, {
            enable: c,
            disable: p
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a,
            emit: i
        } = e;
        const n = r();
        let d;
        s({
            mousewheel: {
                enabled: !1,
                releaseOnEdges: !1,
                invert: !1,
                forceToAxis: !1,
                sensitivity: 1,
                eventsTarget: "container",
                thresholdDelta: null,
                thresholdTime: null,
                noMousewheelClass: "swiper-no-mousewheel"
            }
        }), t.mousewheel = {
            enabled: !1
        };
        let c, p = o();
        const u = [];

        function m() {
            t.enabled && (t.mouseEntered = !0)
        }

        function h() {
            t.enabled && (t.mouseEntered = !1)
        }

        function f(e) {
            return !(t.params.mousewheel.thresholdDelta && e.delta < t.params.mousewheel.thresholdDelta) && (!(t.params.mousewheel.thresholdTime && o() - p < t.params.mousewheel.thresholdTime) && (e.delta >= 6 && o() - p < 60 || (e.direction < 0 ? t.isEnd && !t.params.loop || t.animating || (t.slideNext(), i("scroll", e.raw)) : t.isBeginning && !t.params.loop || t.animating || (t.slidePrev(), i("scroll", e.raw)), p = (new n.Date).getTime(), !1)))
        }

        function g(e) {
            let s = e,
                a = !0;
            if (!t.enabled) return;
            if (e.target.closest(`.${t.params.mousewheel.noMousewheelClass}`)) return;
            const r = t.params.mousewheel;
            t.params.cssMode && s.preventDefault();
            let n = t.el;
            "container" !== t.params.mousewheel.eventsTarget && (n = document.querySelector(t.params.mousewheel.eventsTarget));
            const p = n && n.contains(s.target);
            if (!t.mouseEntered && !p && !r.releaseOnEdges) return !0;
            s.originalEvent && (s = s.originalEvent);
            let m = 0;
            const h = t.rtlTranslate ? -1 : 1,
                g = function (e) {
                    let t = 0,
                        s = 0,
                        a = 0,
                        i = 0;
                    return "detail" in e && (s = e.detail), "wheelDelta" in e && (s = -e.wheelDelta / 120), "wheelDeltaY" in e && (s = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (t = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (t = s, s = 0), a = 10 * t, i = 10 * s, "deltaY" in e && (i = e.deltaY), "deltaX" in e && (a = e.deltaX), e.shiftKey && !a && (a = i, i = 0), (a || i) && e.deltaMode && (1 === e.deltaMode ? (a *= 40, i *= 40) : (a *= 800, i *= 800)), a && !t && (t = a < 1 ? -1 : 1), i && !s && (s = i < 1 ? -1 : 1), {
                        spinX: t,
                        spinY: s,
                        pixelX: a,
                        pixelY: i
                    }
                }(s);
            if (r.forceToAxis)
                if (t.isHorizontal()) {
                    if (!(Math.abs(g.pixelX) > Math.abs(g.pixelY))) return !0;
                    m = -g.pixelX * h
                } else {
                    if (!(Math.abs(g.pixelY) > Math.abs(g.pixelX))) return !0;
                    m = -g.pixelY
                }
            else m = Math.abs(g.pixelX) > Math.abs(g.pixelY) ? -g.pixelX * h : -g.pixelY;
            if (0 === m) return !0;
            r.invert && (m = -m);
            let v = t.getTranslate() + m * r.sensitivity;
            if (v >= t.minTranslate() && (v = t.minTranslate()), v <= t.maxTranslate() && (v = t.maxTranslate()), a = !!t.params.loop || !(v === t.minTranslate() || v === t.maxTranslate()), a && t.params.nested && s.stopPropagation(), t.params.freeMode && t.params.freeMode.enabled) {
                const e = {
                        time: o(),
                        delta: Math.abs(m),
                        direction: Math.sign(m)
                    },
                    a = c && e.time < c.time + 500 && e.delta <= c.delta && e.direction === c.direction;
                if (!a) {
                    c = void 0;
                    let n = t.getTranslate() + m * r.sensitivity;
                    const o = t.isBeginning,
                        p = t.isEnd;
                    if (n >= t.minTranslate() && (n = t.minTranslate()), n <= t.maxTranslate() && (n = t.maxTranslate()), t.setTransition(0), t.setTranslate(n), t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses(), (!o && t.isBeginning || !p && t.isEnd) && t.updateSlidesClasses(), t.params.loop && t.loopFix({
                            direction: e.direction < 0 ? "next" : "prev",
                            byMousewheel: !0
                        }), t.params.freeMode.sticky) {
                        clearTimeout(d), d = void 0, u.length >= 15 && u.shift();
                        const s = u.length ? u[u.length - 1] : void 0,
                            a = u[0];
                        if (u.push(e), s && (e.delta > s.delta || e.direction !== s.direction)) u.splice(0);
                        else if (u.length >= 15 && e.time - a.time < 500 && a.delta - e.delta >= 1 && e.delta <= 6) {
                            const s = m > 0 ? .8 : .2;
                            c = e, u.splice(0), d = l((() => {
                                t.slideToClosest(t.params.speed, !0, void 0, s)
                            }), 0)
                        }
                        d || (d = l((() => {
                            c = e, u.splice(0), t.slideToClosest(t.params.speed, !0, void 0, .5)
                        }), 500))
                    }
                    if (a || i("scroll", s), t.params.autoplay && t.params.autoplayDisableOnInteraction && t.autoplay.stop(), r.releaseOnEdges && (n === t.minTranslate() || n === t.maxTranslate())) return !0
                }
            } else {
                const s = {
                    time: o(),
                    delta: Math.abs(m),
                    direction: Math.sign(m),
                    raw: e
                };
                u.length >= 2 && u.shift();
                const a = u.length ? u[u.length - 1] : void 0;
                if (u.push(s), a ? (s.direction !== a.direction || s.delta > a.delta || s.time > a.time + 150) && f(s) : f(s), function (e) {
                        const s = t.params.mousewheel;
                        if (e.direction < 0) {
                            if (t.isEnd && !t.params.loop && s.releaseOnEdges) return !0
                        } else if (t.isBeginning && !t.params.loop && s.releaseOnEdges) return !0;
                        return !1
                    }(s)) return !0
            }
            return s.preventDefault ? s.preventDefault() : s.returnValue = !1, !1
        }

        function v(e) {
            let s = t.el;
            "container" !== t.params.mousewheel.eventsTarget && (s = document.querySelector(t.params.mousewheel.eventsTarget)), s[e]("mouseenter", m), s[e]("mouseleave", h), s[e]("wheel", g)
        }

        function w() {
            return t.params.cssMode ? (t.wrapperEl.removeEventListener("wheel", g), !0) : !t.mousewheel.enabled && (v("addEventListener"), t.mousewheel.enabled = !0, !0)
        }

        function b() {
            return t.params.cssMode ? (t.wrapperEl.addEventListener(event, g), !0) : !!t.mousewheel.enabled && (v("removeEventListener"), t.mousewheel.enabled = !1, !0)
        }
        a("init", (() => {
            !t.params.mousewheel.enabled && t.params.cssMode && b(), t.params.mousewheel.enabled && w()
        })), a("destroy", (() => {
            t.params.cssMode && w(), t.mousewheel.enabled && b()
        })), Object.assign(t.mousewheel, {
            enable: w,
            disable: b
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a,
            emit: i
        } = e;
        s({
            navigation: {
                nextEl: null,
                prevEl: null,
                hideOnClick: !1,
                disabledClass: "swiper-button-disabled",
                hiddenClass: "swiper-button-hidden",
                lockClass: "swiper-button-lock",
                navigationDisabledClass: "swiper-navigation-disabled"
            }
        }), t.navigation = {
            nextEl: null,
            prevEl: null
        };
        const r = e => (Array.isArray(e) ? e : [e]).filter((e => !!e));

        function n(e) {
            let s;
            return e && "string" == typeof e && t.isElement && (s = t.el.querySelector(e), s) ? s : (e && ("string" == typeof e && (s = [...document.querySelectorAll(e)]), t.params.uniqueNavElements && "string" == typeof e && s.length > 1 && 1 === t.el.querySelectorAll(e).length && (s = t.el.querySelector(e))), e && !s ? e : s)
        }

        function l(e, s) {
            const a = t.params.navigation;
            (e = r(e)).forEach((e => {
                e && (e.classList[s ? "add" : "remove"](...a.disabledClass.split(" ")), "BUTTON" === e.tagName && (e.disabled = s), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? "add" : "remove"](a.lockClass))
            }))
        }

        function o() {
            const {
                nextEl: e,
                prevEl: s
            } = t.navigation;
            if (t.params.loop) return l(s, !1), void l(e, !1);
            l(s, t.isBeginning && !t.params.rewind), l(e, t.isEnd && !t.params.rewind)
        }

        function d(e) {
            e.preventDefault(), (!t.isBeginning || t.params.loop || t.params.rewind) && (t.slidePrev(), i("navigationPrev"))
        }

        function c(e) {
            e.preventDefault(), (!t.isEnd || t.params.loop || t.params.rewind) && (t.slideNext(), i("navigationNext"))
        }

        function p() {
            const e = t.params.navigation;
            if (t.params.navigation = te(t, t.originalParams.navigation, t.params.navigation, {
                    nextEl: "swiper-button-next",
                    prevEl: "swiper-button-prev"
                }), !e.nextEl && !e.prevEl) return;
            let s = n(e.nextEl),
                a = n(e.prevEl);
            Object.assign(t.navigation, {
                nextEl: s,
                prevEl: a
            }), s = r(s), a = r(a);
            const i = (s, a) => {
                s && s.addEventListener("click", "next" === a ? c : d), !t.enabled && s && s.classList.add(...e.lockClass.split(" "))
            };
            s.forEach((e => i(e, "next"))), a.forEach((e => i(e, "prev")))
        }

        function u() {
            let {
                nextEl: e,
                prevEl: s
            } = t.navigation;
            e = r(e), s = r(s);
            const a = (e, s) => {
                e.removeEventListener("click", "next" === s ? c : d), e.classList.remove(...t.params.navigation.disabledClass.split(" "))
            };
            e.forEach((e => a(e, "next"))), s.forEach((e => a(e, "prev")))
        }
        a("init", (() => {
            !1 === t.params.navigation.enabled ? m() : (p(), o())
        })), a("toEdge fromEdge lock unlock", (() => {
            o()
        })), a("destroy", (() => {
            u()
        })), a("enable disable", (() => {
            let {
                nextEl: e,
                prevEl: s
            } = t.navigation;
            e = r(e), s = r(s), t.enabled ? o() : [...e, ...s].filter((e => !!e)).forEach((e => e.classList.add(t.params.navigation.lockClass)))
        })), a("click", ((e, s) => {
            let {
                nextEl: a,
                prevEl: n
            } = t.navigation;
            a = r(a), n = r(n);
            const l = s.target;
            if (t.params.navigation.hideOnClick && !n.includes(l) && !a.includes(l)) {
                if (t.pagination && t.params.pagination && t.params.pagination.clickable && (t.pagination.el === l || t.pagination.el.contains(l))) return;
                let e;
                a.length ? e = a[0].classList.contains(t.params.navigation.hiddenClass) : n.length && (e = n[0].classList.contains(t.params.navigation.hiddenClass)), i(!0 === e ? "navigationShow" : "navigationHide"), [...a, ...n].filter((e => !!e)).forEach((e => e.classList.toggle(t.params.navigation.hiddenClass)))
            }
        }));
        const m = () => {
            t.el.classList.add(...t.params.navigation.navigationDisabledClass.split(" ")), u()
        };
        Object.assign(t.navigation, {
            enable: () => {
                t.el.classList.remove(...t.params.navigation.navigationDisabledClass.split(" ")), p(), o()
            },
            disable: m,
            update: o,
            init: p,
            destroy: u
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a,
            emit: i
        } = e;
        const r = "swiper-pagination";
        let n;
        s({
            pagination: {
                el: null,
                bulletElement: "span",
                clickable: !1,
                hideOnClick: !1,
                renderBullet: null,
                renderProgressbar: null,
                renderFraction: null,
                renderCustom: null,
                progressbarOpposite: !1,
                type: "bullets",
                dynamicBullets: !1,
                dynamicMainBullets: 1,
                formatFractionCurrent: e => e,
                formatFractionTotal: e => e,
                bulletClass: `${r}-bullet`,
                bulletActiveClass: `${r}-bullet-active`,
                modifierClass: `${r}-`,
                currentClass: `${r}-current`,
                totalClass: `${r}-total`,
                hiddenClass: `${r}-hidden`,
                progressbarFillClass: `${r}-progressbar-fill`,
                progressbarOppositeClass: `${r}-progressbar-opposite`,
                clickableClass: `${r}-clickable`,
                lockClass: `${r}-lock`,
                horizontalClass: `${r}-horizontal`,
                verticalClass: `${r}-vertical`,
                paginationDisabledClass: `${r}-disabled`
            }
        }), t.pagination = {
            el: null,
            bullets: []
        };
        let l = 0;
        const o = e => (Array.isArray(e) ? e : [e]).filter((e => !!e));

        function d() {
            return !t.params.pagination.el || !t.pagination.el || Array.isArray(t.pagination.el) && 0 === t.pagination.el.length
        }

        function c(e, s) {
            const {
                bulletActiveClass: a
            } = t.params.pagination;
            e && (e = e[("prev" === s ? "previous" : "next") + "ElementSibling"]) && (e.classList.add(`${a}-${s}`), (e = e[("prev" === s ? "previous" : "next") + "ElementSibling"]) && e.classList.add(`${a}-${s}-${s}`))
        }

        function p(e) {
            const s = e.target.closest(se(t.params.pagination.bulletClass));
            if (!s) return;
            e.preventDefault();
            const a = y(s) * t.params.slidesPerGroup;
            if (t.params.loop) {
                if (t.realIndex === a) return;
                t.slideToLoop(a)
            } else t.slideTo(a)
        }

        function u() {
            const e = t.rtl,
                s = t.params.pagination;
            if (d()) return;
            let a, r, p = t.pagination.el;
            p = o(p);
            const u = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.slides.length,
                m = t.params.loop ? Math.ceil(u / t.params.slidesPerGroup) : t.snapGrid.length;
            if (t.params.loop ? (r = t.previousRealIndex || 0, a = t.params.slidesPerGroup > 1 ? Math.floor(t.realIndex / t.params.slidesPerGroup) : t.realIndex) : void 0 !== t.snapIndex ? (a = t.snapIndex, r = t.previousSnapIndex) : (r = t.previousIndex || 0, a = t.activeIndex || 0), "bullets" === s.type && t.pagination.bullets && t.pagination.bullets.length > 0) {
                const i = t.pagination.bullets;
                let o, d, u;
                if (s.dynamicBullets && (n = S(i[0], t.isHorizontal() ? "width" : "height", !0), p.forEach((e => {
                        e.style[t.isHorizontal() ? "width" : "height"] = n * (s.dynamicMainBullets + 4) + "px"
                    })), s.dynamicMainBullets > 1 && void 0 !== r && (l += a - (r || 0), l > s.dynamicMainBullets - 1 ? l = s.dynamicMainBullets - 1 : l < 0 && (l = 0)), o = Math.max(a - l, 0), d = o + (Math.min(i.length, s.dynamicMainBullets) - 1), u = (d + o) / 2), i.forEach((e => {
                        const t = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((e => `${s.bulletActiveClass}${e}`))].map((e => "string" == typeof e && e.includes(" ") ? e.split(" ") : e)).flat();
                        e.classList.remove(...t)
                    })), p.length > 1) i.forEach((e => {
                    const i = y(e);
                    i === a ? e.classList.add(...s.bulletActiveClass.split(" ")) : t.isElement && e.setAttribute("part", "bullet"), s.dynamicBullets && (i >= o && i <= d && e.classList.add(...`${s.bulletActiveClass}-main`.split(" ")), i === o && c(e, "prev"), i === d && c(e, "next"))
                }));
                else {
                    const e = i[a];
                    if (e && e.classList.add(...s.bulletActiveClass.split(" ")), t.isElement && i.forEach(((e, t) => {
                            e.setAttribute("part", t === a ? "bullet-active" : "bullet")
                        })), s.dynamicBullets) {
                        const e = i[o],
                            t = i[d];
                        for (let e = o; e <= d; e += 1) i[e] && i[e].classList.add(...`${s.bulletActiveClass}-main`.split(" "));
                        c(e, "prev"), c(t, "next")
                    }
                }
                if (s.dynamicBullets) {
                    const a = Math.min(i.length, s.dynamicMainBullets + 4),
                        r = (n * a - n) / 2 - u * n,
                        l = e ? "right" : "left";
                    i.forEach((e => {
                        e.style[t.isHorizontal() ? l : "top"] = `${r}px`
                    }))
                }
            }
            p.forEach(((e, r) => {
                if ("fraction" === s.type && (e.querySelectorAll(se(s.currentClass)).forEach((e => {
                        e.textContent = s.formatFractionCurrent(a + 1)
                    })), e.querySelectorAll(se(s.totalClass)).forEach((e => {
                        e.textContent = s.formatFractionTotal(m)
                    }))), "progressbar" === s.type) {
                    let i;
                    i = s.progressbarOpposite ? t.isHorizontal() ? "vertical" : "horizontal" : t.isHorizontal() ? "horizontal" : "vertical";
                    const r = (a + 1) / m;
                    let n = 1,
                        l = 1;
                    "horizontal" === i ? n = r : l = r, e.querySelectorAll(se(s.progressbarFillClass)).forEach((e => {
                        e.style.transform = `translate3d(0,0,0) scaleX(${n}) scaleY(${l})`, e.style.transitionDuration = `${t.params.speed}ms`
                    }))
                }
                "custom" === s.type && s.renderCustom ? (e.innerHTML = s.renderCustom(t, a + 1, m), 0 === r && i("paginationRender", e)) : (0 === r && i("paginationRender", e), i("paginationUpdate", e)), t.params.watchOverflow && t.enabled && e.classList[t.isLocked ? "add" : "remove"](s.lockClass)
            }))
        }

        function m() {
            const e = t.params.pagination;
            if (d()) return;
            const s = t.virtual && t.params.virtual.enabled ? t.virtual.slides.length : t.grid && t.params.grid.rows > 1 ? t.slides.length / Math.ceil(t.params.grid.rows) : t.slides.length;
            let a = t.pagination.el;
            a = o(a);
            let r = "";
            if ("bullets" === e.type) {
                let a = t.params.loop ? Math.ceil(s / t.params.slidesPerGroup) : t.snapGrid.length;
                t.params.freeMode && t.params.freeMode.enabled && a > s && (a = s);
                for (let s = 0; s < a; s += 1) e.renderBullet ? r += e.renderBullet.call(t, s, e.bulletClass) : r += `<${e.bulletElement} ${t.isElement?'part="bullet"':""} class="${e.bulletClass}"></${e.bulletElement}>`
            }
            "fraction" === e.type && (r = e.renderFraction ? e.renderFraction.call(t, e.currentClass, e.totalClass) : `<span class="${e.currentClass}"></span> / <span class="${e.totalClass}"></span>`), "progressbar" === e.type && (r = e.renderProgressbar ? e.renderProgressbar.call(t, e.progressbarFillClass) : `<span class="${e.progressbarFillClass}"></span>`), t.pagination.bullets = [], a.forEach((s => {
                "custom" !== e.type && (s.innerHTML = r || ""), "bullets" === e.type && t.pagination.bullets.push(...s.querySelectorAll(se(e.bulletClass)))
            })), "custom" !== e.type && i("paginationRender", a[0])
        }

        function h() {
            t.params.pagination = te(t, t.originalParams.pagination, t.params.pagination, {
                el: "swiper-pagination"
            });
            const e = t.params.pagination;
            if (!e.el) return;
            let s;
            "string" == typeof e.el && t.isElement && (s = t.el.querySelector(e.el)), s || "string" != typeof e.el || (s = [...document.querySelectorAll(e.el)]), s || (s = e.el), s && 0 !== s.length && (t.params.uniqueNavElements && "string" == typeof e.el && Array.isArray(s) && s.length > 1 && (s = [...t.el.querySelectorAll(e.el)], s.length > 1 && (s = s.filter((e => E(e, ".swiper")[0] === t.el))[0])), Array.isArray(s) && 1 === s.length && (s = s[0]), Object.assign(t.pagination, {
                el: s
            }), s = o(s), s.forEach((s => {
                "bullets" === e.type && e.clickable && s.classList.add(...(e.clickableClass || "").split(" ")), s.classList.add(e.modifierClass + e.type), s.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass), "bullets" === e.type && e.dynamicBullets && (s.classList.add(`${e.modifierClass}${e.type}-dynamic`), l = 0, e.dynamicMainBullets < 1 && (e.dynamicMainBullets = 1)), "progressbar" === e.type && e.progressbarOpposite && s.classList.add(e.progressbarOppositeClass), e.clickable && s.addEventListener("click", p), t.enabled || s.classList.add(e.lockClass)
            })))
        }

        function f() {
            const e = t.params.pagination;
            if (d()) return;
            let s = t.pagination.el;
            s && (s = o(s), s.forEach((s => {
                s.classList.remove(e.hiddenClass), s.classList.remove(e.modifierClass + e.type), s.classList.remove(t.isHorizontal() ? e.horizontalClass : e.verticalClass), e.clickable && (s.classList.remove(...(e.clickableClass || "").split(" ")), s.removeEventListener("click", p))
            }))), t.pagination.bullets && t.pagination.bullets.forEach((t => t.classList.remove(...e.bulletActiveClass.split(" "))))
        }
        a("changeDirection", (() => {
            if (!t.pagination || !t.pagination.el) return;
            const e = t.params.pagination;
            let {
                el: s
            } = t.pagination;
            s = o(s), s.forEach((s => {
                s.classList.remove(e.horizontalClass, e.verticalClass), s.classList.add(t.isHorizontal() ? e.horizontalClass : e.verticalClass)
            }))
        })), a("init", (() => {
            !1 === t.params.pagination.enabled ? g() : (h(), m(), u())
        })), a("activeIndexChange", (() => {
            void 0 === t.snapIndex && u()
        })), a("snapIndexChange", (() => {
            u()
        })), a("snapGridLengthChange", (() => {
            m(), u()
        })), a("destroy", (() => {
            f()
        })), a("enable disable", (() => {
            let {
                el: e
            } = t.pagination;
            e && (e = o(e), e.forEach((e => e.classList[t.enabled ? "remove" : "add"](t.params.pagination.lockClass))))
        })), a("lock unlock", (() => {
            u()
        })), a("click", ((e, s) => {
            const a = s.target,
                r = o(t.pagination.el);
            if (t.params.pagination.el && t.params.pagination.hideOnClick && r && r.length > 0 && !a.classList.contains(t.params.pagination.bulletClass)) {
                if (t.navigation && (t.navigation.nextEl && a === t.navigation.nextEl || t.navigation.prevEl && a === t.navigation.prevEl)) return;
                const e = r[0].classList.contains(t.params.pagination.hiddenClass);
                i(!0 === e ? "paginationShow" : "paginationHide"), r.forEach((e => e.classList.toggle(t.params.pagination.hiddenClass)))
            }
        }));
        const g = () => {
            t.el.classList.add(t.params.pagination.paginationDisabledClass);
            let {
                el: e
            } = t.pagination;
            e && (e = o(e), e.forEach((e => e.classList.add(t.params.pagination.paginationDisabledClass)))), f()
        };
        Object.assign(t.pagination, {
            enable: () => {
                t.el.classList.remove(t.params.pagination.paginationDisabledClass);
                let {
                    el: e
                } = t.pagination;
                e && (e = o(e), e.forEach((e => e.classList.remove(t.params.pagination.paginationDisabledClass)))), h(), m(), u()
            },
            disable: g,
            render: m,
            update: u,
            init: h,
            destroy: f
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: i,
            emit: r
        } = e;
        const o = a();
        let d, c, p, u, m = !1,
            h = null,
            f = null;

        function g() {
            if (!t.params.scrollbar.el || !t.scrollbar.el) return;
            const {
                scrollbar: e,
                rtlTranslate: s
            } = t, {
                dragEl: a,
                el: i
            } = e, r = t.params.scrollbar, n = t.params.loop ? t.progressLoop : t.progress;
            let l = c,
                o = (p - c) * n;
            s ? (o = -o, o > 0 ? (l = c - o, o = 0) : -o + c > p && (l = p + o)) : o < 0 ? (l = c + o, o = 0) : o + c > p && (l = p - o), t.isHorizontal() ? (a.style.transform = `translate3d(${o}px, 0, 0)`, a.style.width = `${l}px`) : (a.style.transform = `translate3d(0px, ${o}px, 0)`, a.style.height = `${l}px`), r.hide && (clearTimeout(h), i.style.opacity = 1, h = setTimeout((() => {
                i.style.opacity = 0, i.style.transitionDuration = "400ms"
            }), 1e3))
        }

        function b() {
            if (!t.params.scrollbar.el || !t.scrollbar.el) return;
            const {
                scrollbar: e
            } = t, {
                dragEl: s,
                el: a
            } = e;
            s.style.width = "", s.style.height = "", p = t.isHorizontal() ? a.offsetWidth : a.offsetHeight, u = t.size / (t.virtualSize + t.params.slidesOffsetBefore - (t.params.centeredSlides ? t.snapGrid[0] : 0)), c = "auto" === t.params.scrollbar.dragSize ? p * u : parseInt(t.params.scrollbar.dragSize, 10), t.isHorizontal() ? s.style.width = `${c}px` : s.style.height = `${c}px`, a.style.display = u >= 1 ? "none" : "", t.params.scrollbar.hide && (a.style.opacity = 0), t.params.watchOverflow && t.enabled && e.el.classList[t.isLocked ? "add" : "remove"](t.params.scrollbar.lockClass)
        }

        function y(e) {
            return t.isHorizontal() ? e.clientX : e.clientY
        }

        function E(e) {
            const {
                scrollbar: s,
                rtlTranslate: a
            } = t, {
                el: i
            } = s;
            let r;
            r = (y(e) - w(i)[t.isHorizontal() ? "left" : "top"] - (null !== d ? d : c / 2)) / (p - c), r = Math.max(Math.min(r, 1), 0), a && (r = 1 - r);
            const n = t.minTranslate() + (t.maxTranslate() - t.minTranslate()) * r;
            t.updateProgress(n), t.setTranslate(n), t.updateActiveIndex(), t.updateSlidesClasses()
        }

        function x(e) {
            const s = t.params.scrollbar,
                {
                    scrollbar: a,
                    wrapperEl: i
                } = t,
                {
                    el: n,
                    dragEl: l
                } = a;
            m = !0, d = e.target === l ? y(e) - e.target.getBoundingClientRect()[t.isHorizontal() ? "left" : "top"] : null, e.preventDefault(), e.stopPropagation(), i.style.transitionDuration = "100ms", l.style.transitionDuration = "100ms", E(e), clearTimeout(f), n.style.transitionDuration = "0ms", s.hide && (n.style.opacity = 1), t.params.cssMode && (t.wrapperEl.style["scroll-snap-type"] = "none"), r("scrollbarDragStart", e)
        }

        function S(e) {
            const {
                scrollbar: s,
                wrapperEl: a
            } = t, {
                el: i,
                dragEl: n
            } = s;
            m && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, E(e), a.style.transitionDuration = "0ms", i.style.transitionDuration = "0ms", n.style.transitionDuration = "0ms", r("scrollbarDragMove", e))
        }

        function T(e) {
            const s = t.params.scrollbar,
                {
                    scrollbar: a,
                    wrapperEl: i
                } = t,
                {
                    el: n
                } = a;
            m && (m = !1, t.params.cssMode && (t.wrapperEl.style["scroll-snap-type"] = "", i.style.transitionDuration = ""), s.hide && (clearTimeout(f), f = l((() => {
                n.style.opacity = 0, n.style.transitionDuration = "400ms"
            }), 1e3)), r("scrollbarDragEnd", e), s.snapOnRelease && t.slideToClosest())
        }

        function M(e) {
            const {
                scrollbar: s,
                params: a
            } = t, i = s.el;
            if (!i) return;
            const r = i,
                n = !!a.passiveListeners && {
                    passive: !1,
                    capture: !1
                },
                l = !!a.passiveListeners && {
                    passive: !0,
                    capture: !1
                };
            if (!r) return;
            const d = "on" === e ? "addEventListener" : "removeEventListener";
            r[d]("pointerdown", x, n), o[d]("pointermove", S, n), o[d]("pointerup", T, l)
        }

        function C() {
            const {
                scrollbar: e,
                el: s
            } = t;
            t.params.scrollbar = te(t, t.originalParams.scrollbar, t.params.scrollbar, {
                el: "swiper-scrollbar"
            });
            const a = t.params.scrollbar;
            if (!a.el) return;
            let i, r;
            if ("string" == typeof a.el && t.isElement && (i = t.el.querySelector(a.el)), i || "string" != typeof a.el) i || (i = a.el);
            else if (i = o.querySelectorAll(a.el), !i.length) return;
            t.params.uniqueNavElements && "string" == typeof a.el && i.length > 1 && 1 === s.querySelectorAll(a.el).length && (i = s.querySelector(a.el)), i.length > 0 && (i = i[0]), i.classList.add(t.isHorizontal() ? a.horizontalClass : a.verticalClass), i && (r = i.querySelector(se(t.params.scrollbar.dragClass)), r || (r = v("div", t.params.scrollbar.dragClass), i.append(r))), Object.assign(e, {
                el: i,
                dragEl: r
            }), a.draggable && t.params.scrollbar.el && t.scrollbar.el && M("on"), i && i.classList[t.enabled ? "remove" : "add"](...n(t.params.scrollbar.lockClass))
        }

        function P() {
            const e = t.params.scrollbar,
                s = t.scrollbar.el;
            s && s.classList.remove(...n(t.isHorizontal() ? e.horizontalClass : e.verticalClass)), t.params.scrollbar.el && t.scrollbar.el && M("off")
        }
        s({
            scrollbar: {
                el: null,
                dragSize: "auto",
                hide: !1,
                draggable: !1,
                snapOnRelease: !0,
                lockClass: "swiper-scrollbar-lock",
                dragClass: "swiper-scrollbar-drag",
                scrollbarDisabledClass: "swiper-scrollbar-disabled",
                horizontalClass: "swiper-scrollbar-horizontal",
                verticalClass: "swiper-scrollbar-vertical"
            }
        }), t.scrollbar = {
            el: null,
            dragEl: null
        }, i("init", (() => {
            !1 === t.params.scrollbar.enabled ? L() : (C(), b(), g())
        })), i("update resize observerUpdate lock unlock", (() => {
            b()
        })), i("setTranslate", (() => {
            g()
        })), i("setTransition", ((e, s) => {
            ! function (e) {
                t.params.scrollbar.el && t.scrollbar.el && (t.scrollbar.dragEl.style.transitionDuration = `${e}ms`)
            }(s)
        })), i("enable disable", (() => {
            const {
                el: e
            } = t.scrollbar;
            e && e.classList[t.enabled ? "remove" : "add"](...n(t.params.scrollbar.lockClass))
        })), i("destroy", (() => {
            P()
        }));
        const L = () => {
            t.el.classList.add(...n(t.params.scrollbar.scrollbarDisabledClass)), t.scrollbar.el && t.scrollbar.el.classList.add(...n(t.params.scrollbar.scrollbarDisabledClass)), P()
        };
        Object.assign(t.scrollbar, {
            enable: () => {
                t.el.classList.remove(...n(t.params.scrollbar.scrollbarDisabledClass)), t.scrollbar.el && t.scrollbar.el.classList.remove(...n(t.params.scrollbar.scrollbarDisabledClass)), C(), b(), g()
            },
            disable: L,
            updateSize: b,
            setTranslate: g,
            init: C,
            destroy: P
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            parallax: {
                enabled: !1
            }
        });
        const i = "[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]",
            r = (e, s) => {
                const {
                    rtl: a
                } = t, i = a ? -1 : 1, r = e.getAttribute("data-swiper-parallax") || "0";
                let n = e.getAttribute("data-swiper-parallax-x"),
                    l = e.getAttribute("data-swiper-parallax-y");
                const o = e.getAttribute("data-swiper-parallax-scale"),
                    d = e.getAttribute("data-swiper-parallax-opacity"),
                    c = e.getAttribute("data-swiper-parallax-rotate");
                if (n || l ? (n = n || "0", l = l || "0") : t.isHorizontal() ? (n = r, l = "0") : (l = r, n = "0"), n = n.indexOf("%") >= 0 ? parseInt(n, 10) * s * i + "%" : n * s * i + "px", l = l.indexOf("%") >= 0 ? parseInt(l, 10) * s + "%" : l * s + "px", null != d) {
                    const t = d - (d - 1) * (1 - Math.abs(s));
                    e.style.opacity = t
                }
                let p = `translate3d(${n}, ${l}, 0px)`;
                if (null != o) {
                    p += ` scale(${o-(o-1)*(1-Math.abs(s))})`
                }
                if (c && null != c) {
                    p += ` rotate(${c*s*-1}deg)`
                }
                e.style.transform = p
            },
            n = () => {
                const {
                    el: e,
                    slides: s,
                    progress: a,
                    snapGrid: n,
                    isElement: l
                } = t, o = f(e, i);
                t.isElement && o.push(...f(t.hostEl, i)), o.forEach((e => {
                    r(e, a)
                })), s.forEach(((e, s) => {
                    let l = e.progress;
                    t.params.slidesPerGroup > 1 && "auto" !== t.params.slidesPerView && (l += Math.ceil(s / 2) - a * (n.length - 1)), l = Math.min(Math.max(l, -1), 1), e.querySelectorAll(`${i}, [data-swiper-parallax-rotate]`).forEach((e => {
                        r(e, l)
                    }))
                }))
            };
        a("beforeInit", (() => {
            t.params.parallax.enabled && (t.params.watchSlidesProgress = !0, t.originalParams.watchSlidesProgress = !0)
        })), a("init", (() => {
            t.params.parallax.enabled && n()
        })), a("setTranslate", (() => {
            t.params.parallax.enabled && n()
        })), a("setTransition", ((e, s) => {
            t.params.parallax.enabled && function (e) {
                void 0 === e && (e = t.params.speed);
                const {
                    el: s,
                    hostEl: a
                } = t, r = [...s.querySelectorAll(i)];
                t.isElement && r.push(...a.querySelectorAll(i)), r.forEach((t => {
                    let s = parseInt(t.getAttribute("data-swiper-parallax-duration"), 10) || e;
                    0 === e && (s = 0), t.style.transitionDuration = `${s}ms`
                }))
            }(s)
        }))
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a,
            emit: i
        } = e;
        const n = r();
        s({
            zoom: {
                enabled: !1,
                maxRatio: 3,
                minRatio: 1,
                toggle: !0,
                containerClass: "swiper-zoom-container",
                zoomedSlideClass: "swiper-slide-zoomed"
            }
        }), t.zoom = {
            enabled: !1
        };
        let l, o, c = 1,
            p = !1;
        const u = [],
            m = {
                originX: 0,
                originY: 0,
                slideEl: void 0,
                slideWidth: void 0,
                slideHeight: void 0,
                imageEl: void 0,
                imageWrapEl: void 0,
                maxRatio: 3
            },
            h = {
                isTouched: void 0,
                isMoved: void 0,
                currentX: void 0,
                currentY: void 0,
                minX: void 0,
                minY: void 0,
                maxX: void 0,
                maxY: void 0,
                width: void 0,
                height: void 0,
                startX: void 0,
                startY: void 0,
                touchesStart: {},
                touchesCurrent: {}
            },
            g = {
                x: void 0,
                y: void 0,
                prevPositionX: void 0,
                prevPositionY: void 0,
                prevTime: void 0
            };
        let v = 1;

        function b() {
            if (u.length < 2) return 1;
            const e = u[0].pageX,
                t = u[0].pageY,
                s = u[1].pageX,
                a = u[1].pageY;
            return Math.sqrt((s - e) ** 2 + (a - t) ** 2)
        }

        function y(e) {
            const s = t.isElement ? "swiper-slide" : `.${t.params.slideClass}`;
            return !!e.target.matches(s) || t.slides.filter((t => t.contains(e.target))).length > 0
        }

        function x(e) {
            if ("mouse" === e.pointerType && u.splice(0, u.length), !y(e)) return;
            const s = t.params.zoom;
            if (l = !1, o = !1, u.push(e), !(u.length < 2)) {
                if (l = !0, m.scaleStart = b(), !m.slideEl) {
                    m.slideEl = e.target.closest(`.${t.params.slideClass}, swiper-slide`), m.slideEl || (m.slideEl = t.slides[t.activeIndex]);
                    let a = m.slideEl.querySelector(`.${s.containerClass}`);
                    if (a && (a = a.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]), m.imageEl = a, m.imageWrapEl = a ? E(m.imageEl, `.${s.containerClass}`)[0] : void 0, !m.imageWrapEl) return void(m.imageEl = void 0);
                    m.maxRatio = m.imageWrapEl.getAttribute("data-swiper-zoom") || s.maxRatio
                }
                if (m.imageEl) {
                    const [e, t] = function () {
                        if (u.length < 2) return {
                            x: null,
                            y: null
                        };
                        const e = m.imageEl.getBoundingClientRect();
                        return [(u[0].pageX + (u[1].pageX - u[0].pageX) / 2 - e.x - n.scrollX) / c, (u[0].pageY + (u[1].pageY - u[0].pageY) / 2 - e.y - n.scrollY) / c]
                    }();
                    m.originX = e, m.originY = t, m.imageEl.style.transitionDuration = "0ms"
                }
                p = !0
            }
        }

        function S(e) {
            if (!y(e)) return;
            const s = t.params.zoom,
                a = t.zoom,
                i = u.findIndex((t => t.pointerId === e.pointerId));
            i >= 0 && (u[i] = e), u.length < 2 || (o = !0, m.scaleMove = b(), m.imageEl && (a.scale = m.scaleMove / m.scaleStart * c, a.scale > m.maxRatio && (a.scale = m.maxRatio - 1 + (a.scale - m.maxRatio + 1) ** .5), a.scale < s.minRatio && (a.scale = s.minRatio + 1 - (s.minRatio - a.scale + 1) ** .5), m.imageEl.style.transform = `translate3d(0,0,0) scale(${a.scale})`))
        }

        function T(e) {
            if (!y(e)) return;
            if ("mouse" === e.pointerType && "pointerout" === e.type) return;
            const s = t.params.zoom,
                a = t.zoom,
                i = u.findIndex((t => t.pointerId === e.pointerId));
            i >= 0 && u.splice(i, 1), l && o && (l = !1, o = !1, m.imageEl && (a.scale = Math.max(Math.min(a.scale, m.maxRatio), s.minRatio), m.imageEl.style.transitionDuration = `${t.params.speed}ms`, m.imageEl.style.transform = `translate3d(0,0,0) scale(${a.scale})`, c = a.scale, p = !1, a.scale > 1 && m.slideEl ? m.slideEl.classList.add(`${s.zoomedSlideClass}`) : a.scale <= 1 && m.slideEl && m.slideEl.classList.remove(`${s.zoomedSlideClass}`), 1 === a.scale && (m.originX = 0, m.originY = 0, m.slideEl = void 0)))
        }

        function M(e) {
            if (!y(e) || ! function (e) {
                    const s = `.${t.params.zoom.containerClass}`;
                    return !!e.target.matches(s) || [...t.hostEl.querySelectorAll(s)].filter((t => t.contains(e.target))).length > 0
                }(e)) return;
            const s = t.zoom;
            if (!m.imageEl) return;
            if (!h.isTouched || !m.slideEl) return;
            h.isMoved || (h.width = m.imageEl.offsetWidth, h.height = m.imageEl.offsetHeight, h.startX = d(m.imageWrapEl, "x") || 0, h.startY = d(m.imageWrapEl, "y") || 0, m.slideWidth = m.slideEl.offsetWidth, m.slideHeight = m.slideEl.offsetHeight, m.imageWrapEl.style.transitionDuration = "0ms");
            const a = h.width * s.scale,
                i = h.height * s.scale;
            if (a < m.slideWidth && i < m.slideHeight) return;
            h.minX = Math.min(m.slideWidth / 2 - a / 2, 0), h.maxX = -h.minX, h.minY = Math.min(m.slideHeight / 2 - i / 2, 0), h.maxY = -h.minY, h.touchesCurrent.x = u.length > 0 ? u[0].pageX : e.pageX, h.touchesCurrent.y = u.length > 0 ? u[0].pageY : e.pageY;
            if (Math.max(Math.abs(h.touchesCurrent.x - h.touchesStart.x), Math.abs(h.touchesCurrent.y - h.touchesStart.y)) > 5 && (t.allowClick = !1), !h.isMoved && !p) {
                if (t.isHorizontal() && (Math.floor(h.minX) === Math.floor(h.startX) && h.touchesCurrent.x < h.touchesStart.x || Math.floor(h.maxX) === Math.floor(h.startX) && h.touchesCurrent.x > h.touchesStart.x)) return void(h.isTouched = !1);
                if (!t.isHorizontal() && (Math.floor(h.minY) === Math.floor(h.startY) && h.touchesCurrent.y < h.touchesStart.y || Math.floor(h.maxY) === Math.floor(h.startY) && h.touchesCurrent.y > h.touchesStart.y)) return void(h.isTouched = !1)
            }
            e.cancelable && e.preventDefault(), e.stopPropagation(), h.isMoved = !0;
            const r = (s.scale - c) / (m.maxRatio - t.params.zoom.minRatio),
                {
                    originX: n,
                    originY: l
                } = m;
            h.currentX = h.touchesCurrent.x - h.touchesStart.x + h.startX + r * (h.width - 2 * n), h.currentY = h.touchesCurrent.y - h.touchesStart.y + h.startY + r * (h.height - 2 * l), h.currentX < h.minX && (h.currentX = h.minX + 1 - (h.minX - h.currentX + 1) ** .8), h.currentX > h.maxX && (h.currentX = h.maxX - 1 + (h.currentX - h.maxX + 1) ** .8), h.currentY < h.minY && (h.currentY = h.minY + 1 - (h.minY - h.currentY + 1) ** .8), h.currentY > h.maxY && (h.currentY = h.maxY - 1 + (h.currentY - h.maxY + 1) ** .8), g.prevPositionX || (g.prevPositionX = h.touchesCurrent.x), g.prevPositionY || (g.prevPositionY = h.touchesCurrent.y), g.prevTime || (g.prevTime = Date.now()), g.x = (h.touchesCurrent.x - g.prevPositionX) / (Date.now() - g.prevTime) / 2, g.y = (h.touchesCurrent.y - g.prevPositionY) / (Date.now() - g.prevTime) / 2, Math.abs(h.touchesCurrent.x - g.prevPositionX) < 2 && (g.x = 0), Math.abs(h.touchesCurrent.y - g.prevPositionY) < 2 && (g.y = 0), g.prevPositionX = h.touchesCurrent.x, g.prevPositionY = h.touchesCurrent.y, g.prevTime = Date.now(), m.imageWrapEl.style.transform = `translate3d(${h.currentX}px, ${h.currentY}px,0)`
        }

        function C() {
            const e = t.zoom;
            m.slideEl && t.activeIndex !== t.slides.indexOf(m.slideEl) && (m.imageEl && (m.imageEl.style.transform = "translate3d(0,0,0) scale(1)"), m.imageWrapEl && (m.imageWrapEl.style.transform = "translate3d(0,0,0)"), m.slideEl.classList.remove(`${t.params.zoom.zoomedSlideClass}`), e.scale = 1, c = 1, m.slideEl = void 0, m.imageEl = void 0, m.imageWrapEl = void 0, m.originX = 0, m.originY = 0)
        }

        function P(e) {
            const s = t.zoom,
                a = t.params.zoom;
            if (!m.slideEl) {
                e && e.target && (m.slideEl = e.target.closest(`.${t.params.slideClass}, swiper-slide`)), m.slideEl || (t.params.virtual && t.params.virtual.enabled && t.virtual ? m.slideEl = f(t.slidesEl, `.${t.params.slideActiveClass}`)[0] : m.slideEl = t.slides[t.activeIndex]);
                let s = m.slideEl.querySelector(`.${a.containerClass}`);
                s && (s = s.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]), m.imageEl = s, m.imageWrapEl = s ? E(m.imageEl, `.${a.containerClass}`)[0] : void 0
            }
            if (!m.imageEl || !m.imageWrapEl) return;
            let i, r, l, o, d, p, u, g, v, b, y, x, S, T, M, C, P, L;
            t.params.cssMode && (t.wrapperEl.style.overflow = "hidden", t.wrapperEl.style.touchAction = "none"), m.slideEl.classList.add(`${a.zoomedSlideClass}`), void 0 === h.touchesStart.x && e ? (i = e.pageX, r = e.pageY) : (i = h.touchesStart.x, r = h.touchesStart.y);
            const A = "number" == typeof e ? e : null;
            1 === c && A && (i = void 0, r = void 0), s.scale = A || m.imageWrapEl.getAttribute("data-swiper-zoom") || a.maxRatio, c = A || m.imageWrapEl.getAttribute("data-swiper-zoom") || a.maxRatio, !e || 1 === c && A ? (u = 0, g = 0) : (P = m.slideEl.offsetWidth, L = m.slideEl.offsetHeight, l = w(m.slideEl).left + n.scrollX, o = w(m.slideEl).top + n.scrollY, d = l + P / 2 - i, p = o + L / 2 - r, v = m.imageEl.offsetWidth, b = m.imageEl.offsetHeight, y = v * s.scale, x = b * s.scale, S = Math.min(P / 2 - y / 2, 0), T = Math.min(L / 2 - x / 2, 0), M = -S, C = -T, u = d * s.scale, g = p * s.scale, u < S && (u = S), u > M && (u = M), g < T && (g = T), g > C && (g = C)), A && 1 === s.scale && (m.originX = 0, m.originY = 0), m.imageWrapEl.style.transitionDuration = "300ms", m.imageWrapEl.style.transform = `translate3d(${u}px, ${g}px,0)`, m.imageEl.style.transitionDuration = "300ms", m.imageEl.style.transform = `translate3d(0,0,0) scale(${s.scale})`
        }

        function L() {
            const e = t.zoom,
                s = t.params.zoom;
            if (!m.slideEl) {
                t.params.virtual && t.params.virtual.enabled && t.virtual ? m.slideEl = f(t.slidesEl, `.${t.params.slideActiveClass}`)[0] : m.slideEl = t.slides[t.activeIndex];
                let e = m.slideEl.querySelector(`.${s.containerClass}`);
                e && (e = e.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0]), m.imageEl = e, m.imageWrapEl = e ? E(m.imageEl, `.${s.containerClass}`)[0] : void 0
            }
            m.imageEl && m.imageWrapEl && (t.params.cssMode && (t.wrapperEl.style.overflow = "", t.wrapperEl.style.touchAction = ""), e.scale = 1, c = 1, m.imageWrapEl.style.transitionDuration = "300ms", m.imageWrapEl.style.transform = "translate3d(0,0,0)", m.imageEl.style.transitionDuration = "300ms", m.imageEl.style.transform = "translate3d(0,0,0) scale(1)", m.slideEl.classList.remove(`${s.zoomedSlideClass}`), m.slideEl = void 0, m.originX = 0, m.originY = 0)
        }

        function A(e) {
            const s = t.zoom;
            s.scale && 1 !== s.scale ? L() : P(e)
        }

        function I() {
            return {
                passiveListener: !!t.params.passiveListeners && {
                    passive: !0,
                    capture: !1
                },
                activeListenerWithCapture: !t.params.passiveListeners || {
                    passive: !1,
                    capture: !0
                }
            }
        }

        function z() {
            const e = t.zoom;
            if (e.enabled) return;
            e.enabled = !0;
            const {
                passiveListener: s,
                activeListenerWithCapture: a
            } = I();
            t.wrapperEl.addEventListener("pointerdown", x, s), t.wrapperEl.addEventListener("pointermove", S, a), ["pointerup", "pointercancel", "pointerout"].forEach((e => {
                t.wrapperEl.addEventListener(e, T, s)
            })), t.wrapperEl.addEventListener("pointermove", M, a)
        }

        function $() {
            const e = t.zoom;
            if (!e.enabled) return;
            e.enabled = !1;
            const {
                passiveListener: s,
                activeListenerWithCapture: a
            } = I();
            t.wrapperEl.removeEventListener("pointerdown", x, s), t.wrapperEl.removeEventListener("pointermove", S, a), ["pointerup", "pointercancel", "pointerout"].forEach((e => {
                t.wrapperEl.removeEventListener(e, T, s)
            })), t.wrapperEl.removeEventListener("pointermove", M, a)
        }
        Object.defineProperty(t.zoom, "scale", {
            get: () => v,
            set(e) {
                if (v !== e) {
                    const t = m.imageEl,
                        s = m.slideEl;
                    i("zoomChange", e, t, s)
                }
                v = e
            }
        }), a("init", (() => {
            t.params.zoom.enabled && z()
        })), a("destroy", (() => {
            $()
        })), a("touchStart", ((e, s) => {
            t.zoom.enabled && function (e) {
                const s = t.device;
                if (!m.imageEl) return;
                if (h.isTouched) return;
                s.android && e.cancelable && e.preventDefault(), h.isTouched = !0;
                const a = u.length > 0 ? u[0] : e;
                h.touchesStart.x = a.pageX, h.touchesStart.y = a.pageY
            }(s)
        })), a("touchEnd", ((e, s) => {
            t.zoom.enabled && function () {
                const e = t.zoom;
                if (!m.imageEl) return;
                if (!h.isTouched || !h.isMoved) return h.isTouched = !1, void(h.isMoved = !1);
                h.isTouched = !1, h.isMoved = !1;
                let s = 300,
                    a = 300;
                const i = g.x * s,
                    r = h.currentX + i,
                    n = g.y * a,
                    l = h.currentY + n;
                0 !== g.x && (s = Math.abs((r - h.currentX) / g.x)), 0 !== g.y && (a = Math.abs((l - h.currentY) / g.y));
                const o = Math.max(s, a);
                h.currentX = r, h.currentY = l;
                const d = h.width * e.scale,
                    c = h.height * e.scale;
                h.minX = Math.min(m.slideWidth / 2 - d / 2, 0), h.maxX = -h.minX, h.minY = Math.min(m.slideHeight / 2 - c / 2, 0), h.maxY = -h.minY, h.currentX = Math.max(Math.min(h.currentX, h.maxX), h.minX), h.currentY = Math.max(Math.min(h.currentY, h.maxY), h.minY), m.imageWrapEl.style.transitionDuration = `${o}ms`, m.imageWrapEl.style.transform = `translate3d(${h.currentX}px, ${h.currentY}px,0)`
            }()
        })), a("doubleTap", ((e, s) => {
            !t.animating && t.params.zoom.enabled && t.zoom.enabled && t.params.zoom.toggle && A(s)
        })), a("transitionEnd", (() => {
            t.zoom.enabled && t.params.zoom.enabled && C()
        })), a("slideChange", (() => {
            t.zoom.enabled && t.params.zoom.enabled && t.params.cssMode && C()
        })), Object.assign(t.zoom, {
            enable: z,
            disable: $,
            in: P,
            out: L,
            toggle: A
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;

        function i(e, t) {
            const s = function () {
                let e, t, s;
                return (a, i) => {
                    for (t = -1, e = a.length; e - t > 1;) s = e + t >> 1, a[s] <= i ? t = s : e = s;
                    return e
                }
            }();
            let a, i;
            return this.x = e, this.y = t, this.lastIndex = e.length - 1, this.interpolate = function (e) {
                return e ? (i = s(this.x, e), a = i - 1, (e - this.x[a]) * (this.y[i] - this.y[a]) / (this.x[i] - this.x[a]) + this.y[a]) : 0
            }, this
        }

        function r() {
            t.controller.control && t.controller.spline && (t.controller.spline = void 0, delete t.controller.spline)
        }
        s({
            controller: {
                control: void 0,
                inverse: !1,
                by: "slide"
            }
        }), t.controller = {
            control: void 0
        }, a("beforeInit", (() => {
            if ("undefined" != typeof window && ("string" == typeof t.params.controller.control || t.params.controller.control instanceof HTMLElement)) {
                const e = document.querySelector(t.params.controller.control);
                if (e && e.swiper) t.controller.control = e.swiper;
                else if (e) {
                    const s = a => {
                        t.controller.control = a.detail[0], t.update(), e.removeEventListener("init", s)
                    };
                    e.addEventListener("init", s)
                }
            } else t.controller.control = t.params.controller.control
        })), a("update", (() => {
            r()
        })), a("resize", (() => {
            r()
        })), a("observerUpdate", (() => {
            r()
        })), a("setTranslate", ((e, s, a) => {
            t.controller.control && !t.controller.control.destroyed && t.controller.setTranslate(s, a)
        })), a("setTransition", ((e, s, a) => {
            t.controller.control && !t.controller.control.destroyed && t.controller.setTransition(s, a)
        })), Object.assign(t.controller, {
            setTranslate: function (e, s) {
                const a = t.controller.control;
                let r, n;
                const l = t.constructor;

                function o(e) {
                    if (e.destroyed) return;
                    const s = t.rtlTranslate ? -t.translate : t.translate;
                    "slide" === t.params.controller.by && (! function (e) {
                        t.controller.spline = t.params.loop ? new i(t.slidesGrid, e.slidesGrid) : new i(t.snapGrid, e.snapGrid)
                    }(e), n = -t.controller.spline.interpolate(-s)), n && "container" !== t.params.controller.by || (r = (e.maxTranslate() - e.minTranslate()) / (t.maxTranslate() - t.minTranslate()), !Number.isNaN(r) && Number.isFinite(r) || (r = 1), n = (s - t.minTranslate()) * r + e.minTranslate()), t.params.controller.inverse && (n = e.maxTranslate() - n), e.updateProgress(n), e.setTranslate(n, t), e.updateActiveIndex(), e.updateSlidesClasses()
                }
                if (Array.isArray(a))
                    for (let e = 0; e < a.length; e += 1) a[e] !== s && a[e] instanceof l && o(a[e]);
                else a instanceof l && s !== a && o(a)
            },
            setTransition: function (e, s) {
                const a = t.constructor,
                    i = t.controller.control;
                let r;

                function n(s) {
                    s.destroyed || (s.setTransition(e, t), 0 !== e && (s.transitionStart(), s.params.autoHeight && l((() => {
                        s.updateAutoHeight()
                    })), x(s.wrapperEl, (() => {
                        i && s.transitionEnd()
                    }))))
                }
                if (Array.isArray(i))
                    for (r = 0; r < i.length; r += 1) i[r] !== s && i[r] instanceof a && n(i[r]);
                else i instanceof a && s !== i && n(i)
            }
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            a11y: {
                enabled: !0,
                notificationClass: "swiper-notification",
                prevSlideMessage: "Previous slide",
                nextSlideMessage: "Next slide",
                firstSlideMessage: "This is the first slide",
                lastSlideMessage: "This is the last slide",
                paginationBulletMessage: "Go to slide {{index}}",
                slideLabelMessage: "{{index}} / {{slidesLength}}",
                containerMessage: null,
                containerRoleDescriptionMessage: null,
                itemRoleDescriptionMessage: null,
                slideRole: "group",
                id: null
            }
        }), t.a11y = {
            clicked: !1
        };
        let i = null;

        function r(e) {
            const t = i;
            0 !== t.length && (t.innerHTML = "", t.innerHTML = e)
        }
        const n = e => (Array.isArray(e) ? e : [e]).filter((e => !!e));

        function l(e) {
            (e = n(e)).forEach((e => {
                e.setAttribute("tabIndex", "0")
            }))
        }

        function o(e) {
            (e = n(e)).forEach((e => {
                e.setAttribute("tabIndex", "-1")
            }))
        }

        function d(e, t) {
            (e = n(e)).forEach((e => {
                e.setAttribute("role", t)
            }))
        }

        function c(e, t) {
            (e = n(e)).forEach((e => {
                e.setAttribute("aria-roledescription", t)
            }))
        }

        function p(e, t) {
            (e = n(e)).forEach((e => {
                e.setAttribute("aria-label", t)
            }))
        }

        function u(e) {
            (e = n(e)).forEach((e => {
                e.setAttribute("aria-disabled", !0)
            }))
        }

        function m(e) {
            (e = n(e)).forEach((e => {
                e.setAttribute("aria-disabled", !1)
            }))
        }

        function h(e) {
            if (13 !== e.keyCode && 32 !== e.keyCode) return;
            const s = t.params.a11y,
                a = e.target;
            t.pagination && t.pagination.el && (a === t.pagination.el || t.pagination.el.contains(e.target)) && !e.target.matches(se(t.params.pagination.bulletClass)) || (t.navigation && t.navigation.nextEl && a === t.navigation.nextEl && (t.isEnd && !t.params.loop || t.slideNext(), t.isEnd ? r(s.lastSlideMessage) : r(s.nextSlideMessage)), t.navigation && t.navigation.prevEl && a === t.navigation.prevEl && (t.isBeginning && !t.params.loop || t.slidePrev(), t.isBeginning ? r(s.firstSlideMessage) : r(s.prevSlideMessage)), t.pagination && a.matches(se(t.params.pagination.bulletClass)) && a.click())
        }

        function f() {
            return t.pagination && t.pagination.bullets && t.pagination.bullets.length
        }

        function g() {
            return f() && t.params.pagination.clickable
        }
        const w = (e, t, s) => {
                l(e), "BUTTON" !== e.tagName && (d(e, "button"), e.addEventListener("keydown", h)), p(e, s),
                    function (e, t) {
                        (e = n(e)).forEach((e => {
                            e.setAttribute("aria-controls", t)
                        }))
                    }(e, t)
            },
            b = () => {
                t.a11y.clicked = !0
            },
            E = () => {
                requestAnimationFrame((() => {
                    requestAnimationFrame((() => {
                        t.destroyed || (t.a11y.clicked = !1)
                    }))
                }))
            },
            x = e => {
                if (t.a11y.clicked) return;
                const s = e.target.closest(`.${t.params.slideClass}, swiper-slide`);
                if (!s || !t.slides.includes(s)) return;
                const a = t.slides.indexOf(s) === t.activeIndex,
                    i = t.params.watchSlidesProgress && t.visibleSlides && t.visibleSlides.includes(s);
                a || i || e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents || (t.isHorizontal() ? t.el.scrollLeft = 0 : t.el.scrollTop = 0, t.slideTo(t.slides.indexOf(s), 0))
            },
            S = () => {
                const e = t.params.a11y;
                e.itemRoleDescriptionMessage && c(t.slides, e.itemRoleDescriptionMessage), e.slideRole && d(t.slides, e.slideRole);
                const s = t.slides.length;
                e.slideLabelMessage && t.slides.forEach(((a, i) => {
                    const r = t.params.loop ? parseInt(a.getAttribute("data-swiper-slide-index"), 10) : i;
                    p(a, e.slideLabelMessage.replace(/\{\{index\}\}/, r + 1).replace(/\{\{slidesLength\}\}/, s))
                }))
            },
            T = () => {
                const e = t.params.a11y;
                t.el.append(i);
                const s = t.el;
                e.containerRoleDescriptionMessage && c(s, e.containerRoleDescriptionMessage), e.containerMessage && p(s, e.containerMessage);
                const a = t.wrapperEl,
                    r = e.id || a.getAttribute("id") || `swiper-wrapper-${l=16,void 0===l&&(l=16),"x".repeat(l).replace(/x/g,(()=>Math.round(16*Math.random()).toString(16)))}`;
                var l;
                const o = t.params.autoplay && t.params.autoplay.enabled ? "off" : "polite";
                var d;
                d = r, n(a).forEach((e => {
                        e.setAttribute("id", d)
                    })),
                    function (e, t) {
                        (e = n(e)).forEach((e => {
                            e.setAttribute("aria-live", t)
                        }))
                    }(a, o), S();
                let {
                    nextEl: u,
                    prevEl: m
                } = t.navigation ? t.navigation : {};
                if (u = n(u), m = n(m), u && u.forEach((t => w(t, r, e.nextSlideMessage))), m && m.forEach((t => w(t, r, e.prevSlideMessage))), g()) {
                    n(t.pagination.el).forEach((e => {
                        e.addEventListener("keydown", h)
                    }))
                }
                t.el.addEventListener("focus", x, !0), t.el.addEventListener("pointerdown", b, !0), t.el.addEventListener("pointerup", E, !0)
            };
        a("beforeInit", (() => {
            i = v("span", t.params.a11y.notificationClass), i.setAttribute("aria-live", "assertive"), i.setAttribute("aria-atomic", "true")
        })), a("afterInit", (() => {
            t.params.a11y.enabled && T()
        })), a("slidesLengthChange snapGridLengthChange slidesGridLengthChange", (() => {
            t.params.a11y.enabled && S()
        })), a("fromEdge toEdge afterInit lock unlock", (() => {
            t.params.a11y.enabled && function () {
                if (t.params.loop || t.params.rewind || !t.navigation) return;
                const {
                    nextEl: e,
                    prevEl: s
                } = t.navigation;
                s && (t.isBeginning ? (u(s), o(s)) : (m(s), l(s))), e && (t.isEnd ? (u(e), o(e)) : (m(e), l(e)))
            }()
        })), a("paginationUpdate", (() => {
            t.params.a11y.enabled && function () {
                const e = t.params.a11y;
                f() && t.pagination.bullets.forEach((s => {
                    t.params.pagination.clickable && (l(s), t.params.pagination.renderBullet || (d(s, "button"), p(s, e.paginationBulletMessage.replace(/\{\{index\}\}/, y(s) + 1)))), s.matches(se(t.params.pagination.bulletActiveClass)) ? s.setAttribute("aria-current", "true") : s.removeAttribute("aria-current")
                }))
            }()
        })), a("destroy", (() => {
            t.params.a11y.enabled && function () {
                i && i.remove();
                let {
                    nextEl: e,
                    prevEl: s
                } = t.navigation ? t.navigation : {};
                e = n(e), s = n(s), e && e.forEach((e => e.removeEventListener("keydown", h))), s && s.forEach((e => e.removeEventListener("keydown", h))), g() && n(t.pagination.el).forEach((e => {
                    e.removeEventListener("keydown", h)
                }));
                t.el.removeEventListener("focus", x, !0), t.el.removeEventListener("pointerdown", b, !0), t.el.removeEventListener("pointerup", E, !0)
            }()
        }))
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            history: {
                enabled: !1,
                root: "",
                replaceState: !1,
                key: "slides",
                keepQuery: !1
            }
        });
        let i = !1,
            n = {};
        const l = e => e.toString().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, ""),
            o = e => {
                const t = r();
                let s;
                s = e ? new URL(e) : t.location;
                const a = s.pathname.slice(1).split("/").filter((e => "" !== e)),
                    i = a.length;
                return {
                    key: a[i - 2],
                    value: a[i - 1]
                }
            },
            d = (e, s) => {
                const a = r();
                if (!i || !t.params.history.enabled) return;
                let n;
                n = t.params.url ? new URL(t.params.url) : a.location;
                const o = t.slides[s];
                let d = l(o.getAttribute("data-history"));
                if (t.params.history.root.length > 0) {
                    let s = t.params.history.root;
                    "/" === s[s.length - 1] && (s = s.slice(0, s.length - 1)), d = `${s}/${e?`${e}/`:""}${d}`
                } else n.pathname.includes(e) || (d = `${e?`${e}/`:""}${d}`);
                t.params.history.keepQuery && (d += n.search);
                const c = a.history.state;
                c && c.value === d || (t.params.history.replaceState ? a.history.replaceState({
                    value: d
                }, null, d) : a.history.pushState({
                    value: d
                }, null, d))
            },
            c = (e, s, a) => {
                if (s)
                    for (let i = 0, r = t.slides.length; i < r; i += 1) {
                        const r = t.slides[i];
                        if (l(r.getAttribute("data-history")) === s) {
                            const s = t.getSlideIndex(r);
                            t.slideTo(s, e, a)
                        }
                    } else t.slideTo(0, e, a)
            },
            p = () => {
                n = o(t.params.url), c(t.params.speed, n.value, !1)
            };
        a("init", (() => {
            t.params.history.enabled && (() => {
                const e = r();
                if (t.params.history) {
                    if (!e.history || !e.history.pushState) return t.params.history.enabled = !1, void(t.params.hashNavigation.enabled = !0);
                    i = !0, n = o(t.params.url), n.key || n.value ? (c(0, n.value, t.params.runCallbacksOnInit), t.params.history.replaceState || e.addEventListener("popstate", p)) : t.params.history.replaceState || e.addEventListener("popstate", p)
                }
            })()
        })), a("destroy", (() => {
            t.params.history.enabled && (() => {
                const e = r();
                t.params.history.replaceState || e.removeEventListener("popstate", p)
            })()
        })), a("transitionEnd _freeModeNoMomentumRelease", (() => {
            i && d(t.params.history.key, t.activeIndex)
        })), a("slideChange", (() => {
            i && t.params.cssMode && d(t.params.history.key, t.activeIndex)
        }))
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            emit: i,
            on: n
        } = e, l = !1;
        const o = a(),
            d = r();
        s({
            hashNavigation: {
                enabled: !1,
                replaceState: !1,
                watchState: !1,
                getSlideIndex(e, s) {
                    if (t.virtual && t.params.virtual.enabled) {
                        const e = t.slides.filter((e => e.getAttribute("data-hash") === s))[0];
                        if (!e) return 0;
                        return parseInt(e.getAttribute("data-swiper-slide-index"), 10)
                    }
                    return t.getSlideIndex(f(t.slidesEl, `.${t.params.slideClass}[data-hash="${s}"], swiper-slide[data-hash="${s}"]`)[0])
                }
            }
        });
        const c = () => {
                i("hashChange");
                const e = o.location.hash.replace("#", ""),
                    s = t.virtual && t.params.virtual.enabled ? t.slidesEl.querySelector(`[data-swiper-slide-index="${t.activeIndex}"]`) : t.slides[t.activeIndex];
                if (e !== (s ? s.getAttribute("data-hash") : "")) {
                    const s = t.params.hashNavigation.getSlideIndex(t, e);
                    if (void 0 === s || Number.isNaN(s)) return;
                    t.slideTo(s)
                }
            },
            p = () => {
                if (!l || !t.params.hashNavigation.enabled) return;
                const e = t.virtual && t.params.virtual.enabled ? t.slidesEl.querySelector(`[data-swiper-slide-index="${t.activeIndex}"]`) : t.slides[t.activeIndex],
                    s = e ? e.getAttribute("data-hash") || e.getAttribute("data-history") : "";
                t.params.hashNavigation.replaceState && d.history && d.history.replaceState ? (d.history.replaceState(null, null, `#${s}` || ""), i("hashSet")) : (o.location.hash = s || "", i("hashSet"))
            };
        n("init", (() => {
            t.params.hashNavigation.enabled && (() => {
                if (!t.params.hashNavigation.enabled || t.params.history && t.params.history.enabled) return;
                l = !0;
                const e = o.location.hash.replace("#", "");
                if (e) {
                    const s = 0,
                        a = t.params.hashNavigation.getSlideIndex(t, e);
                    t.slideTo(a || 0, s, t.params.runCallbacksOnInit, !0)
                }
                t.params.hashNavigation.watchState && d.addEventListener("hashchange", c)
            })()
        })), n("destroy", (() => {
            t.params.hashNavigation.enabled && t.params.hashNavigation.watchState && d.removeEventListener("hashchange", c)
        })), n("transitionEnd _freeModeNoMomentumRelease", (() => {
            l && p()
        })), n("slideChange", (() => {
            l && t.params.cssMode && p()
        }))
    }, function (e) {
        let t, s, {
            swiper: i,
            extendParams: r,
            on: n,
            emit: l,
            params: o
        } = e;
        i.autoplay = {
            running: !1,
            paused: !1,
            timeLeft: 0
        }, r({
            autoplay: {
                enabled: !1,
                delay: 3e3,
                waitForTransition: !0,
                disableOnInteraction: !1,
                stopOnLastSlide: !1,
                reverseDirection: !1,
                pauseOnMouseEnter: !1
            }
        });
        let d, c, p, u, m, h, f, g, v = o && o.autoplay ? o.autoplay.delay : 3e3,
            w = o && o.autoplay ? o.autoplay.delay : 3e3,
            b = (new Date).getTime();

        function y(e) {
            i && !i.destroyed && i.wrapperEl && e.target === i.wrapperEl && (i.wrapperEl.removeEventListener("transitionend", y), g || C())
        }
        const E = () => {
                if (i.destroyed || !i.autoplay.running) return;
                i.autoplay.paused ? c = !0 : c && (w = d, c = !1);
                const e = i.autoplay.paused ? d : b + w - (new Date).getTime();
                i.autoplay.timeLeft = e, l("autoplayTimeLeft", e, e / v), s = requestAnimationFrame((() => {
                    E()
                }))
            },
            x = e => {
                if (i.destroyed || !i.autoplay.running) return;
                cancelAnimationFrame(s), E();
                let a = void 0 === e ? i.params.autoplay.delay : e;
                v = i.params.autoplay.delay, w = i.params.autoplay.delay;
                const r = (() => {
                    let e;
                    if (e = i.virtual && i.params.virtual.enabled ? i.slides.filter((e => e.classList.contains("swiper-slide-active")))[0] : i.slides[i.activeIndex], !e) return;
                    return parseInt(e.getAttribute("data-swiper-autoplay"), 10)
                })();
                !Number.isNaN(r) && r > 0 && void 0 === e && (a = r, v = r, w = r), d = a;
                const n = i.params.speed,
                    o = () => {
                        i && !i.destroyed && (i.params.autoplay.reverseDirection ? !i.isBeginning || i.params.loop || i.params.rewind ? (i.slidePrev(n, !0, !0), l("autoplay")) : i.params.autoplay.stopOnLastSlide || (i.slideTo(i.slides.length - 1, n, !0, !0), l("autoplay")) : !i.isEnd || i.params.loop || i.params.rewind ? (i.slideNext(n, !0, !0), l("autoplay")) : i.params.autoplay.stopOnLastSlide || (i.slideTo(0, n, !0, !0), l("autoplay")), i.params.cssMode && (b = (new Date).getTime(), requestAnimationFrame((() => {
                            x()
                        }))))
                    };
                return a > 0 ? (clearTimeout(t), t = setTimeout((() => {
                    o()
                }), a)) : requestAnimationFrame((() => {
                    o()
                })), a
            },
            S = () => {
                b = (new Date).getTime(), i.autoplay.running = !0, x(), l("autoplayStart")
            },
            T = () => {
                i.autoplay.running = !1, clearTimeout(t), cancelAnimationFrame(s), l("autoplayStop")
            },
            M = (e, s) => {
                if (i.destroyed || !i.autoplay.running) return;
                clearTimeout(t), e || (f = !0);
                const a = () => {
                    l("autoplayPause"), i.params.autoplay.waitForTransition ? i.wrapperEl.addEventListener("transitionend", y) : C()
                };
                if (i.autoplay.paused = !0, s) return h && (d = i.params.autoplay.delay), h = !1, void a();
                const r = d || i.params.autoplay.delay;
                d = r - ((new Date).getTime() - b), i.isEnd && d < 0 && !i.params.loop || (d < 0 && (d = 0), a())
            },
            C = () => {
                i.isEnd && d < 0 && !i.params.loop || i.destroyed || !i.autoplay.running || (b = (new Date).getTime(), f ? (f = !1, x(d)) : x(), i.autoplay.paused = !1, l("autoplayResume"))
            },
            P = () => {
                if (i.destroyed || !i.autoplay.running) return;
                const e = a();
                "hidden" === e.visibilityState && (f = !0, M(!0)), "visible" === e.visibilityState && C()
            },
            L = e => {
                "mouse" === e.pointerType && (f = !0, g = !0, i.animating || i.autoplay.paused || M(!0))
            },
            A = e => {
                "mouse" === e.pointerType && (g = !1, i.autoplay.paused && C())
            };
        n("init", (() => {
            i.params.autoplay.enabled && (i.params.autoplay.pauseOnMouseEnter && (i.el.addEventListener("pointerenter", L), i.el.addEventListener("pointerleave", A)), a().addEventListener("visibilitychange", P), S())
        })), n("destroy", (() => {
            i.el.removeEventListener("pointerenter", L), i.el.removeEventListener("pointerleave", A), a().removeEventListener("visibilitychange", P), i.autoplay.running && T()
        })), n("_freeModeStaticRelease", (() => {
            (u || f) && C()
        })), n("_freeModeNoMomentumRelease", (() => {
            i.params.autoplay.disableOnInteraction ? T() : M(!0, !0)
        })), n("beforeTransitionStart", ((e, t, s) => {
            !i.destroyed && i.autoplay.running && (s || !i.params.autoplay.disableOnInteraction ? M(!0, !0) : T())
        })), n("sliderFirstMove", (() => {
            !i.destroyed && i.autoplay.running && (i.params.autoplay.disableOnInteraction ? T() : (p = !0, u = !1, f = !1, m = setTimeout((() => {
                f = !0, u = !0, M(!0)
            }), 200)))
        })), n("touchEnd", (() => {
            if (!i.destroyed && i.autoplay.running && p) {
                if (clearTimeout(m), clearTimeout(t), i.params.autoplay.disableOnInteraction) return u = !1, void(p = !1);
                u && i.params.cssMode && C(), u = !1, p = !1
            }
        })), n("slideChange", (() => {
            !i.destroyed && i.autoplay.running && (h = !0)
        })), Object.assign(i.autoplay, {
            start: S,
            stop: T,
            pause: M,
            resume: C
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: i
        } = e;
        s({
            thumbs: {
                swiper: null,
                multipleActiveThumbs: !0,
                autoScrollOffset: 0,
                slideThumbActiveClass: "swiper-slide-thumb-active",
                thumbsContainerClass: "swiper-thumbs"
            }
        });
        let r = !1,
            n = !1;

        function l() {
            const e = t.thumbs.swiper;
            if (!e || e.destroyed) return;
            const s = e.clickedIndex,
                a = e.clickedSlide;
            if (a && a.classList.contains(t.params.thumbs.slideThumbActiveClass)) return;
            if (null == s) return;
            let i;
            i = e.params.loop ? parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"), 10) : s, t.params.loop ? t.slideToLoop(i) : t.slideTo(i)
        }

        function o() {
            const {
                thumbs: e
            } = t.params;
            if (r) return !1;
            r = !0;
            const s = t.constructor;
            if (e.swiper instanceof s) t.thumbs.swiper = e.swiper, Object.assign(t.thumbs.swiper.originalParams, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            }), Object.assign(t.thumbs.swiper.params, {
                watchSlidesProgress: !0,
                slideToClickedSlide: !1
            }), t.thumbs.swiper.update();
            else if (c(e.swiper)) {
                const a = Object.assign({}, e.swiper);
                Object.assign(a, {
                    watchSlidesProgress: !0,
                    slideToClickedSlide: !1
                }), t.thumbs.swiper = new s(a), n = !0
            }
            return t.thumbs.swiper.el.classList.add(t.params.thumbs.thumbsContainerClass), t.thumbs.swiper.on("tap", l), !0
        }

        function d(e) {
            const s = t.thumbs.swiper;
            if (!s || s.destroyed) return;
            const a = "auto" === s.params.slidesPerView ? s.slidesPerViewDynamic() : s.params.slidesPerView;
            let i = 1;
            const r = t.params.thumbs.slideThumbActiveClass;
            if (t.params.slidesPerView > 1 && !t.params.centeredSlides && (i = t.params.slidesPerView), t.params.thumbs.multipleActiveThumbs || (i = 1), i = Math.floor(i), s.slides.forEach((e => e.classList.remove(r))), s.params.loop || s.params.virtual && s.params.virtual.enabled)
                for (let e = 0; e < i; e += 1) f(s.slidesEl, `[data-swiper-slide-index="${t.realIndex+e}"]`).forEach((e => {
                    e.classList.add(r)
                }));
            else
                for (let e = 0; e < i; e += 1) s.slides[t.realIndex + e] && s.slides[t.realIndex + e].classList.add(r);
            const n = t.params.thumbs.autoScrollOffset,
                l = n && !s.params.loop;
            if (t.realIndex !== s.realIndex || l) {
                const i = s.activeIndex;
                let r, o;
                if (s.params.loop) {
                    const e = s.slides.filter((e => e.getAttribute("data-swiper-slide-index") === `${t.realIndex}`))[0];
                    r = s.slides.indexOf(e), o = t.activeIndex > t.previousIndex ? "next" : "prev"
                } else r = t.realIndex, o = r > t.previousIndex ? "next" : "prev";
                l && (r += "next" === o ? n : -1 * n), s.visibleSlidesIndexes && s.visibleSlidesIndexes.indexOf(r) < 0 && (s.params.centeredSlides ? r = r > i ? r - Math.floor(a / 2) + 1 : r + Math.floor(a / 2) - 1 : r > i && s.params.slidesPerGroup, s.slideTo(r, e ? 0 : void 0))
            }
        }
        t.thumbs = {
            swiper: null
        }, i("beforeInit", (() => {
            const {
                thumbs: e
            } = t.params;
            if (e && e.swiper)
                if ("string" == typeof e.swiper || e.swiper instanceof HTMLElement) {
                    const s = a(),
                        i = () => {
                            const a = "string" == typeof e.swiper ? s.querySelector(e.swiper) : e.swiper;
                            if (a && a.swiper) e.swiper = a.swiper, o(), d(!0);
                            else if (a) {
                                const s = i => {
                                    e.swiper = i.detail[0], a.removeEventListener("init", s), o(), d(!0), e.swiper.update(), t.update()
                                };
                                a.addEventListener("init", s)
                            }
                            return a
                        },
                        r = () => {
                            if (t.destroyed) return;
                            i() || requestAnimationFrame(r)
                        };
                    requestAnimationFrame(r)
                } else o(), d(!0)
        })), i("slideChange update resize observerUpdate", (() => {
            d()
        })), i("setTransition", ((e, s) => {
            const a = t.thumbs.swiper;
            a && !a.destroyed && a.setTransition(s)
        })), i("beforeDestroy", (() => {
            const e = t.thumbs.swiper;
            e && !e.destroyed && n && e.destroy()
        })), Object.assign(t.thumbs, {
            init: o,
            update: d
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            emit: a,
            once: i
        } = e;
        s({
            freeMode: {
                enabled: !1,
                momentum: !0,
                momentumRatio: 1,
                momentumBounce: !0,
                momentumBounceRatio: 1,
                momentumVelocityRatio: 1,
                sticky: !1,
                minimumVelocity: .02
            }
        }), Object.assign(t, {
            freeMode: {
                onTouchStart: function () {
                    if (t.params.cssMode) return;
                    const e = t.getTranslate();
                    t.setTranslate(e), t.setTransition(0), t.touchEventsData.velocities.length = 0, t.freeMode.onTouchEnd({
                        currentPos: t.rtl ? t.translate : -t.translate
                    })
                },
                onTouchMove: function () {
                    if (t.params.cssMode) return;
                    const {
                        touchEventsData: e,
                        touches: s
                    } = t;
                    0 === e.velocities.length && e.velocities.push({
                        position: s[t.isHorizontal() ? "startX" : "startY"],
                        time: e.touchStartTime
                    }), e.velocities.push({
                        position: s[t.isHorizontal() ? "currentX" : "currentY"],
                        time: o()
                    })
                },
                onTouchEnd: function (e) {
                    let {
                        currentPos: s
                    } = e;
                    if (t.params.cssMode) return;
                    const {
                        params: r,
                        wrapperEl: n,
                        rtlTranslate: l,
                        snapGrid: d,
                        touchEventsData: c
                    } = t, p = o() - c.touchStartTime;
                    if (s < -t.minTranslate()) t.slideTo(t.activeIndex);
                    else if (s > -t.maxTranslate()) t.slides.length < d.length ? t.slideTo(d.length - 1) : t.slideTo(t.slides.length - 1);
                    else {
                        if (r.freeMode.momentum) {
                            if (c.velocities.length > 1) {
                                const e = c.velocities.pop(),
                                    s = c.velocities.pop(),
                                    a = e.position - s.position,
                                    i = e.time - s.time;
                                t.velocity = a / i, t.velocity /= 2, Math.abs(t.velocity) < r.freeMode.minimumVelocity && (t.velocity = 0), (i > 150 || o() - e.time > 300) && (t.velocity = 0)
                            } else t.velocity = 0;
                            t.velocity *= r.freeMode.momentumVelocityRatio, c.velocities.length = 0;
                            let e = 1e3 * r.freeMode.momentumRatio;
                            const s = t.velocity * e;
                            let p = t.translate + s;
                            l && (p = -p);
                            let u, m = !1;
                            const h = 20 * Math.abs(t.velocity) * r.freeMode.momentumBounceRatio;
                            let f;
                            if (p < t.maxTranslate()) r.freeMode.momentumBounce ? (p + t.maxTranslate() < -h && (p = t.maxTranslate() - h), u = t.maxTranslate(), m = !0, c.allowMomentumBounce = !0) : p = t.maxTranslate(), r.loop && r.centeredSlides && (f = !0);
                            else if (p > t.minTranslate()) r.freeMode.momentumBounce ? (p - t.minTranslate() > h && (p = t.minTranslate() + h), u = t.minTranslate(), m = !0, c.allowMomentumBounce = !0) : p = t.minTranslate(), r.loop && r.centeredSlides && (f = !0);
                            else if (r.freeMode.sticky) {
                                let e;
                                for (let t = 0; t < d.length; t += 1)
                                    if (d[t] > -p) {
                                        e = t;
                                        break
                                    } p = Math.abs(d[e] - p) < Math.abs(d[e - 1] - p) || "next" === t.swipeDirection ? d[e] : d[e - 1], p = -p
                            }
                            if (f && i("transitionEnd", (() => {
                                    t.loopFix()
                                })), 0 !== t.velocity) {
                                if (e = l ? Math.abs((-p - t.translate) / t.velocity) : Math.abs((p - t.translate) / t.velocity), r.freeMode.sticky) {
                                    const s = Math.abs((l ? -p : p) - t.translate),
                                        a = t.slidesSizesGrid[t.activeIndex];
                                    e = s < a ? r.speed : s < 2 * a ? 1.5 * r.speed : 2.5 * r.speed
                                }
                            } else if (r.freeMode.sticky) return void t.slideToClosest();
                            r.freeMode.momentumBounce && m ? (t.updateProgress(u), t.setTransition(e), t.setTranslate(p), t.transitionStart(!0, t.swipeDirection), t.animating = !0, x(n, (() => {
                                t && !t.destroyed && c.allowMomentumBounce && (a("momentumBounce"), t.setTransition(r.speed), setTimeout((() => {
                                    t.setTranslate(u), x(n, (() => {
                                        t && !t.destroyed && t.transitionEnd()
                                    }))
                                }), 0))
                            }))) : t.velocity ? (a("_freeModeNoMomentumRelease"), t.updateProgress(p), t.setTransition(e), t.setTranslate(p), t.transitionStart(!0, t.swipeDirection), t.animating || (t.animating = !0, x(n, (() => {
                                t && !t.destroyed && t.transitionEnd()
                            })))) : t.updateProgress(p), t.updateActiveIndex(), t.updateSlidesClasses()
                        } else {
                            if (r.freeMode.sticky) return void t.slideToClosest();
                            r.freeMode && a("_freeModeNoMomentumRelease")
                        }(!r.freeMode.momentum || p >= r.longSwipesMs) && (a("_freeModeStaticRelease"), t.updateProgress(), t.updateActiveIndex(), t.updateSlidesClasses())
                    }
                }
            }
        })
    }, function (e) {
        let t, s, a, i, {
            swiper: r,
            extendParams: n,
            on: l
        } = e;
        n({
            grid: {
                rows: 1,
                fill: "column"
            }
        });
        const o = () => {
            let e = r.params.spaceBetween;
            return "string" == typeof e && e.indexOf("%") >= 0 ? e = parseFloat(e.replace("%", "")) / 100 * r.size : "string" == typeof e && (e = parseFloat(e)), e
        };
        l("init", (() => {
            i = r.params.grid && r.params.grid.rows > 1
        })), l("update", (() => {
            const {
                params: e,
                el: t
            } = r, s = e.grid && e.grid.rows > 1;
            i && !s ? (t.classList.remove(`${e.containerModifierClass}grid`, `${e.containerModifierClass}grid-column`), a = 1, r.emitContainerClasses()) : !i && s && (t.classList.add(`${e.containerModifierClass}grid`), "column" === e.grid.fill && t.classList.add(`${e.containerModifierClass}grid-column`), r.emitContainerClasses()), i = s
        })), r.grid = {
            initSlides: e => {
                const {
                    slidesPerView: i
                } = r.params, {
                    rows: n,
                    fill: l
                } = r.params.grid, o = r.virtual && r.params.virtual.enabled ? r.virtual.slides.length : e.length;
                a = Math.floor(o / n), t = Math.floor(o / n) === o / n ? o : Math.ceil(o / n) * n, "auto" !== i && "row" === l && (t = Math.max(t, i * n)), s = t / n
            },
            unsetSlides: () => {
                r.slides && r.slides.forEach((e => {
                    e.swiperSlideGridSet && (e.style.height = "", e.style[r.getDirectionLabel("margin-top")] = "")
                }))
            },
            updateSlide: (e, i, n) => {
                const {
                    slidesPerGroup: l
                } = r.params, d = o(), {
                    rows: c,
                    fill: p
                } = r.params.grid, u = r.virtual && r.params.virtual.enabled ? r.virtual.slides.length : n.length;
                let m, h, f;
                if ("row" === p && l > 1) {
                    const s = Math.floor(e / (l * c)),
                        a = e - c * l * s,
                        r = 0 === s ? l : Math.min(Math.ceil((u - s * c * l) / c), l);
                    f = Math.floor(a / r), h = a - f * r + s * l, m = h + f * t / c, i.style.order = m
                } else "column" === p ? (h = Math.floor(e / c), f = e - h * c, (h > a || h === a && f === c - 1) && (f += 1, f >= c && (f = 0, h += 1))) : (f = Math.floor(e / s), h = e - f * s);
                i.row = f, i.column = h, i.style.height = `calc((100% - ${(c-1)*d}px) / ${c})`, i.style[r.getDirectionLabel("margin-top")] = 0 !== f ? d && `${d}px` : "", i.swiperSlideGridSet = !0
            },
            updateWrapperSize: (e, s) => {
                const {
                    centeredSlides: a,
                    roundLengths: i
                } = r.params, n = o(), {
                    rows: l
                } = r.params.grid;
                if (r.virtualSize = (e + n) * t, r.virtualSize = Math.ceil(r.virtualSize / l) - n, r.params.cssMode || (r.wrapperEl.style[r.getDirectionLabel("width")] = `${r.virtualSize+n}px`), a) {
                    const e = [];
                    for (let t = 0; t < s.length; t += 1) {
                        let a = s[t];
                        i && (a = Math.floor(a)), s[t] < r.virtualSize + s[0] && e.push(a)
                    }
                    s.splice(0, s.length), s.push(...e)
                }
            }
        }
    }, function (e) {
        let {
            swiper: t
        } = e;
        Object.assign(t, {
            appendSlide: ae.bind(t),
            prependSlide: ie.bind(t),
            addSlide: re.bind(t),
            removeSlide: ne.bind(t),
            removeAllSlides: le.bind(t)
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            fadeEffect: {
                crossFade: !1
            }
        }), oe({
            effect: "fade",
            swiper: t,
            on: a,
            setTranslate: () => {
                const {
                    slides: e
                } = t;
                t.params.fadeEffect;
                for (let s = 0; s < e.length; s += 1) {
                    const e = t.slides[s];
                    let a = -e.swiperSlideOffset;
                    t.params.virtualTranslate || (a -= t.translate);
                    let i = 0;
                    t.isHorizontal() || (i = a, a = 0);
                    const r = t.params.fadeEffect.crossFade ? Math.max(1 - Math.abs(e.progress), 0) : 1 + Math.min(Math.max(e.progress, -1), 0),
                        n = de(0, e);
                    n.style.opacity = r, n.style.transform = `translate3d(${a}px, ${i}px, 0px)`
                }
            },
            setTransition: e => {
                const s = t.slides.map((e => h(e)));
                s.forEach((t => {
                    t.style.transitionDuration = `${e}ms`
                })), ce({
                    swiper: t,
                    duration: e,
                    transformElements: s,
                    allSlides: !0
                })
            },
            overwriteParams: () => ({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                spaceBetween: 0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            cubeEffect: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            }
        });
        const i = (e, t, s) => {
            let a = s ? e.querySelector(".swiper-slide-shadow-left") : e.querySelector(".swiper-slide-shadow-top"),
                i = s ? e.querySelector(".swiper-slide-shadow-right") : e.querySelector(".swiper-slide-shadow-bottom");
            a || (a = v("div", ("swiper-slide-shadow-cube swiper-slide-shadow-" + (s ? "left" : "top")).split(" ")), e.append(a)), i || (i = v("div", ("swiper-slide-shadow-cube swiper-slide-shadow-" + (s ? "right" : "bottom")).split(" ")), e.append(i)), a && (a.style.opacity = Math.max(-t, 0)), i && (i.style.opacity = Math.max(t, 0))
        };
        oe({
            effect: "cube",
            swiper: t,
            on: a,
            setTranslate: () => {
                const {
                    el: e,
                    wrapperEl: s,
                    slides: a,
                    width: r,
                    height: n,
                    rtlTranslate: l,
                    size: o,
                    browser: d
                } = t, c = t.params.cubeEffect, p = t.isHorizontal(), u = t.virtual && t.params.virtual.enabled;
                let m, h = 0;
                c.shadow && (p ? (m = t.wrapperEl.querySelector(".swiper-cube-shadow"), m || (m = v("div", "swiper-cube-shadow"), t.wrapperEl.append(m)), m.style.height = `${r}px`) : (m = e.querySelector(".swiper-cube-shadow"), m || (m = v("div", "swiper-cube-shadow"), e.append(m))));
                for (let e = 0; e < a.length; e += 1) {
                    const s = a[e];
                    let r = e;
                    u && (r = parseInt(s.getAttribute("data-swiper-slide-index"), 10));
                    let n = 90 * r,
                        d = Math.floor(n / 360);
                    l && (n = -n, d = Math.floor(-n / 360));
                    const m = Math.max(Math.min(s.progress, 1), -1);
                    let f = 0,
                        g = 0,
                        v = 0;
                    r % 4 == 0 ? (f = 4 * -d * o, v = 0) : (r - 1) % 4 == 0 ? (f = 0, v = 4 * -d * o) : (r - 2) % 4 == 0 ? (f = o + 4 * d * o, v = o) : (r - 3) % 4 == 0 && (f = -o, v = 3 * o + 4 * o * d), l && (f = -f), p || (g = f, f = 0);
                    const w = `rotateX(${p?0:-n}deg) rotateY(${p?n:0}deg) translate3d(${f}px, ${g}px, ${v}px)`;
                    m <= 1 && m > -1 && (h = 90 * r + 90 * m, l && (h = 90 * -r - 90 * m), t.browser && t.browser.isSafari && Math.abs(h) / 90 % 2 == 1 && (h += .001)), s.style.transform = w, c.slideShadows && i(s, m, p)
                }
                if (s.style.transformOrigin = `50% 50% -${o/2}px`, s.style["-webkit-transform-origin"] = `50% 50% -${o/2}px`, c.shadow)
                    if (p) m.style.transform = `translate3d(0px, ${r/2+c.shadowOffset}px, ${-r/2}px) rotateX(89.99deg) rotateZ(0deg) scale(${c.shadowScale})`;
                    else {
                        const e = Math.abs(h) - 90 * Math.floor(Math.abs(h) / 90),
                            t = 1.5 - (Math.sin(2 * e * Math.PI / 360) / 2 + Math.cos(2 * e * Math.PI / 360) / 2),
                            s = c.shadowScale,
                            a = c.shadowScale / t,
                            i = c.shadowOffset;
                        m.style.transform = `scale3d(${s}, 1, ${a}) translate3d(0px, ${n/2+i}px, ${-n/2/a}px) rotateX(-89.99deg)`
                    } const f = (d.isSafari || d.isWebView) && d.needPerspectiveFix ? -o / 2 : 0;
                s.style.transform = `translate3d(0px,0,${f}px) rotateX(${t.isHorizontal()?0:h}deg) rotateY(${t.isHorizontal()?-h:0}deg)`, s.style.setProperty("--swiper-cube-translate-z", `${f}px`)
            },
            setTransition: e => {
                const {
                    el: s,
                    slides: a
                } = t;
                if (a.forEach((t => {
                        t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t => {
                            t.style.transitionDuration = `${e}ms`
                        }))
                    })), t.params.cubeEffect.shadow && !t.isHorizontal()) {
                    const t = s.querySelector(".swiper-cube-shadow");
                    t && (t.style.transitionDuration = `${e}ms`)
                }
            },
            recreateShadows: () => {
                const e = t.isHorizontal();
                t.slides.forEach((t => {
                    const s = Math.max(Math.min(t.progress, 1), -1);
                    i(t, s, e)
                }))
            },
            getEffectParams: () => t.params.cubeEffect,
            perspective: () => !0,
            overwriteParams: () => ({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                resistanceRatio: 0,
                spaceBetween: 0,
                centeredSlides: !1,
                virtualTranslate: !0
            })
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            flipEffect: {
                slideShadows: !0,
                limitRotation: !0
            }
        });
        const i = (e, s) => {
            let a = t.isHorizontal() ? e.querySelector(".swiper-slide-shadow-left") : e.querySelector(".swiper-slide-shadow-top"),
                i = t.isHorizontal() ? e.querySelector(".swiper-slide-shadow-right") : e.querySelector(".swiper-slide-shadow-bottom");
            a || (a = pe("flip", e, t.isHorizontal() ? "left" : "top")), i || (i = pe("flip", e, t.isHorizontal() ? "right" : "bottom")), a && (a.style.opacity = Math.max(-s, 0)), i && (i.style.opacity = Math.max(s, 0))
        };
        oe({
            effect: "flip",
            swiper: t,
            on: a,
            setTranslate: () => {
                const {
                    slides: e,
                    rtlTranslate: s
                } = t, a = t.params.flipEffect;
                for (let r = 0; r < e.length; r += 1) {
                    const n = e[r];
                    let l = n.progress;
                    t.params.flipEffect.limitRotation && (l = Math.max(Math.min(n.progress, 1), -1));
                    const o = n.swiperSlideOffset;
                    let d = -180 * l,
                        c = 0,
                        p = t.params.cssMode ? -o - t.translate : -o,
                        u = 0;
                    t.isHorizontal() ? s && (d = -d) : (u = p, p = 0, c = -d, d = 0), t.browser && t.browser.isSafari && (Math.abs(d) / 90 % 2 == 1 && (d += .001), Math.abs(c) / 90 % 2 == 1 && (c += .001)), n.style.zIndex = -Math.abs(Math.round(l)) + e.length, a.slideShadows && i(n, l);
                    const m = `translate3d(${p}px, ${u}px, 0px) rotateX(${c}deg) rotateY(${d}deg)`;
                    de(0, n).style.transform = m
                }
            },
            setTransition: e => {
                const s = t.slides.map((e => h(e)));
                s.forEach((t => {
                    t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t => {
                        t.style.transitionDuration = `${e}ms`
                    }))
                })), ce({
                    swiper: t,
                    duration: e,
                    transformElements: s
                })
            },
            recreateShadows: () => {
                t.params.flipEffect, t.slides.forEach((e => {
                    let s = e.progress;
                    t.params.flipEffect.limitRotation && (s = Math.max(Math.min(e.progress, 1), -1)), i(e, s)
                }))
            },
            getEffectParams: () => t.params.flipEffect,
            perspective: () => !0,
            overwriteParams: () => ({
                slidesPerView: 1,
                slidesPerGroup: 1,
                watchSlidesProgress: !0,
                spaceBetween: 0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                scale: 1,
                modifier: 1,
                slideShadows: !0
            }
        }), oe({
            effect: "coverflow",
            swiper: t,
            on: a,
            setTranslate: () => {
                const {
                    width: e,
                    height: s,
                    slides: a,
                    slidesSizesGrid: i
                } = t, r = t.params.coverflowEffect, n = t.isHorizontal(), l = t.translate, o = n ? e / 2 - l : s / 2 - l, d = n ? r.rotate : -r.rotate, c = r.depth;
                for (let e = 0, s = a.length; e < s; e += 1) {
                    const s = a[e],
                        l = i[e],
                        p = (o - s.swiperSlideOffset - l / 2) / l,
                        u = "function" == typeof r.modifier ? r.modifier(p) : p * r.modifier;
                    let m = n ? d * u : 0,
                        h = n ? 0 : d * u,
                        f = -c * Math.abs(u),
                        g = r.stretch;
                    "string" == typeof g && -1 !== g.indexOf("%") && (g = parseFloat(r.stretch) / 100 * l);
                    let v = n ? 0 : g * u,
                        w = n ? g * u : 0,
                        b = 1 - (1 - r.scale) * Math.abs(u);
                    Math.abs(w) < .001 && (w = 0), Math.abs(v) < .001 && (v = 0), Math.abs(f) < .001 && (f = 0), Math.abs(m) < .001 && (m = 0), Math.abs(h) < .001 && (h = 0), Math.abs(b) < .001 && (b = 0), t.browser && t.browser.isSafari && (Math.abs(m) / 90 % 2 == 1 && (m += .001), Math.abs(h) / 90 % 2 == 1 && (h += .001));
                    const y = `translate3d(${w}px,${v}px,${f}px)  rotateX(${h}deg) rotateY(${m}deg) scale(${b})`;
                    if (de(0, s).style.transform = y, s.style.zIndex = 1 - Math.abs(Math.round(u)), r.slideShadows) {
                        let e = n ? s.querySelector(".swiper-slide-shadow-left") : s.querySelector(".swiper-slide-shadow-top"),
                            t = n ? s.querySelector(".swiper-slide-shadow-right") : s.querySelector(".swiper-slide-shadow-bottom");
                        e || (e = pe("coverflow", s, n ? "left" : "top")), t || (t = pe("coverflow", s, n ? "right" : "bottom")), e && (e.style.opacity = u > 0 ? u : 0), t && (t.style.opacity = -u > 0 ? -u : 0)
                    }
                }
            },
            setTransition: e => {
                t.slides.map((e => h(e))).forEach((t => {
                    t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").forEach((t => {
                        t.style.transitionDuration = `${e}ms`
                    }))
                }))
            },
            perspective: () => !0,
            overwriteParams: () => ({
                watchSlidesProgress: !0
            })
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            creativeEffect: {
                limitProgress: 1,
                shadowPerProgress: !1,
                progressMultiplier: 1,
                perspective: !0,
                prev: {
                    translate: [0, 0, 0],
                    rotate: [0, 0, 0],
                    opacity: 1,
                    scale: 1
                },
                next: {
                    translate: [0, 0, 0],
                    rotate: [0, 0, 0],
                    opacity: 1,
                    scale: 1
                }
            }
        });
        const i = e => "string" == typeof e ? e : `${e}px`;
        oe({
            effect: "creative",
            swiper: t,
            on: a,
            setTranslate: () => {
                const {
                    slides: e,
                    wrapperEl: s,
                    slidesSizesGrid: a
                } = t, r = t.params.creativeEffect, {
                    progressMultiplier: n
                } = r, l = t.params.centeredSlides;
                if (l) {
                    const e = a[0] / 2 - t.params.slidesOffsetBefore || 0;
                    s.style.transform = `translateX(calc(50% - ${e}px))`
                }
                for (let s = 0; s < e.length; s += 1) {
                    const a = e[s],
                        o = a.progress,
                        d = Math.min(Math.max(a.progress, -r.limitProgress), r.limitProgress);
                    let c = d;
                    l || (c = Math.min(Math.max(a.originalProgress, -r.limitProgress), r.limitProgress));
                    const p = a.swiperSlideOffset,
                        u = [t.params.cssMode ? -p - t.translate : -p, 0, 0],
                        m = [0, 0, 0];
                    let h = !1;
                    t.isHorizontal() || (u[1] = u[0], u[0] = 0);
                    let f = {
                        translate: [0, 0, 0],
                        rotate: [0, 0, 0],
                        scale: 1,
                        opacity: 1
                    };
                    d < 0 ? (f = r.next, h = !0) : d > 0 && (f = r.prev, h = !0), u.forEach(((e, t) => {
                        u[t] = `calc(${e}px + (${i(f.translate[t])} * ${Math.abs(d*n)}))`
                    })), m.forEach(((e, s) => {
                        let a = f.rotate[s] * Math.abs(d * n);
                        t.browser && t.browser.isSafari && Math.abs(a) / 90 % 2 == 1 && (a += .001), m[s] = a
                    })), a.style.zIndex = -Math.abs(Math.round(o)) + e.length;
                    const g = u.join(", "),
                        v = `rotateX(${m[0]}deg) rotateY(${m[1]}deg) rotateZ(${m[2]}deg)`,
                        w = c < 0 ? `scale(${1+(1-f.scale)*c*n})` : `scale(${1-(1-f.scale)*c*n})`,
                        b = c < 0 ? 1 + (1 - f.opacity) * c * n : 1 - (1 - f.opacity) * c * n,
                        y = `translate3d(${g}) ${v} ${w}`;
                    if (h && f.shadow || !h) {
                        let e = a.querySelector(".swiper-slide-shadow");
                        if (!e && f.shadow && (e = pe("creative", a)), e) {
                            const t = r.shadowPerProgress ? d * (1 / r.limitProgress) : d;
                            e.style.opacity = Math.min(Math.max(Math.abs(t), 0), 1)
                        }
                    }
                    const E = de(0, a);
                    E.style.transform = y, E.style.opacity = b, f.origin && (E.style.transformOrigin = f.origin)
                }
            },
            setTransition: e => {
                const s = t.slides.map((e => h(e)));
                s.forEach((t => {
                    t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow").forEach((t => {
                        t.style.transitionDuration = `${e}ms`
                    }))
                })), ce({
                    swiper: t,
                    duration: e,
                    transformElements: s,
                    allSlides: !0
                })
            },
            perspective: () => t.params.creativeEffect.perspective,
            overwriteParams: () => ({
                watchSlidesProgress: !0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }, function (e) {
        let {
            swiper: t,
            extendParams: s,
            on: a
        } = e;
        s({
            cardsEffect: {
                slideShadows: !0,
                rotate: !0,
                perSlideRotate: 2,
                perSlideOffset: 8
            }
        }), oe({
            effect: "cards",
            swiper: t,
            on: a,
            setTranslate: () => {
                const {
                    slides: e,
                    activeIndex: s,
                    rtlTranslate: a
                } = t, i = t.params.cardsEffect, {
                    startTranslate: r,
                    isTouched: n
                } = t.touchEventsData, l = a ? -t.translate : t.translate;
                for (let o = 0; o < e.length; o += 1) {
                    const d = e[o],
                        c = d.progress,
                        p = Math.min(Math.max(c, -4), 4);
                    let u = d.swiperSlideOffset;
                    t.params.centeredSlides && !t.params.cssMode && (t.wrapperEl.style.transform = `translateX(${t.minTranslate()}px)`), t.params.centeredSlides && t.params.cssMode && (u -= e[0].swiperSlideOffset);
                    let m = t.params.cssMode ? -u - t.translate : -u,
                        h = 0;
                    const f = -100 * Math.abs(p);
                    let g = 1,
                        v = -i.perSlideRotate * p,
                        w = i.perSlideOffset - .75 * Math.abs(p);
                    const b = t.virtual && t.params.virtual.enabled ? t.virtual.from + o : o,
                        y = (b === s || b === s - 1) && p > 0 && p < 1 && (n || t.params.cssMode) && l < r,
                        E = (b === s || b === s + 1) && p < 0 && p > -1 && (n || t.params.cssMode) && l > r;
                    if (y || E) {
                        const e = (1 - Math.abs((Math.abs(p) - .5) / .5)) ** .5;
                        v += -28 * p * e, g += -.5 * e, w += 96 * e, h = -25 * e * Math.abs(p) + "%"
                    }
                    if (m = p < 0 ? `calc(${m}px ${a?"-":"+"} (${w*Math.abs(p)}%))` : p > 0 ? `calc(${m}px ${a?"-":"+"} (-${w*Math.abs(p)}%))` : `${m}px`, !t.isHorizontal()) {
                        const e = h;
                        h = m, m = e
                    }
                    const x = p < 0 ? "" + (1 + (1 - g) * p) : "" + (1 - (1 - g) * p),
                        S = `\n        translate3d(${m}, ${h}, ${f}px)\n        rotateZ(${i.rotate?a?-v:v:0}deg)\n        scale(${x})\n      `;
                    if (i.slideShadows) {
                        let e = d.querySelector(".swiper-slide-shadow");
                        e || (e = pe("cards", d)), e && (e.style.opacity = Math.min(Math.max((Math.abs(p) - .5) / .5, 0), 1))
                    }
                    d.style.zIndex = -Math.abs(Math.round(c)) + e.length;
                    de(0, d).style.transform = S
                }
            },
            setTransition: e => {
                const s = t.slides.map((e => h(e)));
                s.forEach((t => {
                    t.style.transitionDuration = `${e}ms`, t.querySelectorAll(".swiper-slide-shadow").forEach((t => {
                        t.style.transitionDuration = `${e}ms`
                    }))
                })), ce({
                    swiper: t,
                    duration: e,
                    transformElements: s
                })
            },
            perspective: () => !0,
            overwriteParams: () => ({
                watchSlidesProgress: !0,
                virtualTranslate: !t.params.cssMode
            })
        })
    }];
    return ee.use(ue), ee
}();
//# sourceMappingURL=swiper-bundle.min.js.map
//https://via-profit.github.io/js-form-validator/
/**
* Simple Encapsulation Class template
*/
(function (root) {

	"use strict";

	/**
	 * Common object params
	 * @type {Object}
	 */
	var common = {
			publicMethods: ['validate', 'formatString', 'destroy', 'reload', 'getFormHandle', 'getFields', 'showErrors', 'hideErrors'],
			className: 'Validator'
		},

		// main constructor
		Protected = function (formHandle, submitCallback, settings) {

			formHandle.JsValidator = this;

			this.settings = {

				// Validation of a current field after the events of "change", "keyup", "blur"
			    onAir: true,

			    // Show validation errors
			    showErrors: true,

			    // Auto-hide the error messages
			    autoHideErrors: false,

			    // Timeout auto-hide error messages
			    autoHideErrorsTimeout: 2000,

			    // Language error messages
			    locale: 'en',

			    // Object for custom error messages
			    messages: {},

			    // Object for custom rules
			    rules: {},

			    // classname for error messages
			    errorClassName: 'error',

			    // remove spaces from validation field values
			    removeSpaces: false,

			    // tracking of new elements
			    autoTracking: true,

			    // events list for binding
			    eventsList: ['keyup', 'change', 'blur']
			};









			

			var self = this;

			// set handle
			this.formHandle = formHandle || null;

			// set callback
			this.submitCallback = submitCallback || null;

			// get fields and rules
			this.fields = this.getFields(this.formHandle.querySelectorAll('[data-rule]'));





			// apply custom settings
			this.applySettings(settings || {});






			this.submitCallback = this.submitCallback.bind(this);
			this._eventChangeWithDelay = this._eventChangeWithDelay.bind(this);
			this._eventChange = this._eventChange.bind(this);
			this._eventSubmit = this._eventSubmit.bind(this);



			// bind events
			this.submitCallback && this.eventsBuilder('addEventListener');



			


			
			// autotracking for new form elements
			this.settings.autoTracking && ('MutationObserver' in window) && new MutationObserver(function(mutationRecords) {

			    [].forEach.call(mutationRecords, function (mutation) {
			        switch (mutation.type) {
			            case 'subtree':
			            case 'childList':
			            	
			            	var reloadFlag = false,
			            		childsArray = [];

			                [].forEach.call(mutation.addedNodes, function (targetElem) {

			                	childsArray = targetElem.querySelectorAll ? targetElem.querySelectorAll('*') : [];

			                	if (['SELECT', 'INPUT', 'TEXTAREA', 'CHECKBOX', 'RADIOBUTTON'].indexOf(targetElem.tagName) !== -1) {
			                		reloadFlag = true;
			                	};

			                	!reloadFlag && [].forEach.call(childsArray, function (elem) {
			                		if (['SELECT', 'INPUT', 'TEXTAREA', 'CHECKBOX', 'RADIOBUTTON'].indexOf(elem.tagName) !== -1) {
			                			reloadFlag = true;
			                		}
			                	});

			                	
			                });
			                reloadFlag && self.reload();
			            break;
			        }
			    });

			}).observe(this.formHandle, {
			    childList: true,
			    subtree: true
			});

			

			return this;
		};


	/**
	 * Main prototype
	 * @type {Object}
	 */
	Protected.prototype = {



		messages: {
					    
			// English
		    en: {
		        required: {
		            empty: 'This field is required',
		            incorrect: 'Incorrect value'
		        },
		        notzero: {
		            empty: 'Please make a selection',
		            incorrect: 'Incorrect value'
		        },
		        integer: {
		            empty: 'Enter an integer value',
		            incorrect: 'Incorrect integer value'
		        },
		        float: {
		            empty: 'Enter an float number',
		            incorrect: 'Incorrect float'
		        },
		        min: {
		            empty: 'Enter more',
		            incorrect: 'Enter more'
		        },
		        max: {
		            empty: 'Enter less',
		            incorrect: 'Enter less'
		        },
		        between: {
		            empty: 'Enter the between {0}-{1}',
		            incorrect: 'Enter the between {0}-{1}'
		        },
		        name: {
		            empty: 'Please, enter your name',
		            incorrect: 'Incorrect name'
		        },
		        lastname: {
		            empty: 'Please, enter your lastname',
		            incorrect: 'Incorrect lastname'
		        },
		        phone: {
		            empty: 'Неправильный номер телефона',
		            incorrect: 'Неправильный номер телефона'
		        },
		        email: {
		            empty: 'Please, enter your email address',
		            incorrect: 'Incorrect email address'
		        },
		        length: {
		            empty: 'Please, Enter a minimum of {0} characters and a maximum of {1}',
		            incorrect: 'Incorrect. Enter a minimum of {0} characters and a maximum of {1}'
		        },
		        minlength: {
		            empty: 'Please, enter at least {0} characters',
		            incorrect: 'You have entered less than {0} characters'
		        },
		        maxlength: {
		            empty: 'Please, enter at maximum {0} characters',
		            incorrect: 'You have entered more than {0} characters'
		        },
		        maxfilesize: {
		            empty: 'The size of one or more selected files larger than {0} {1}',
		            incorrect: 'The size of one or more selected files larger than {0} {1}'
		        },
		        fileextension: {
		            empty: 'Select file',
		            incorrect: 'One or more files have an invalid type'
		        }
		    }
		},

		// rules
		rules: {
		    required: function (value) {
		        return '' !== value;
		    },
		    notzero: function (value) {
		        return parseInt(value, 10) > 0;
		    },
		    integer: function (value) {
		        return new RegExp(/^[0-9]+$/gi).test(value);
		    },
		    float: function (value) {
		        value = value.toString().replace(/\,/, '.');
		        return this.integer(value) || new RegExp(/^([0-9])+(\.)([0-9]+$)/gi).test(value);
		    },
		    min: function (value, params) {
		        if (this.float(value)) {
		            return parseFloat(value) >= parseFloat(params[0]);
		        }
		        return parseInt(value, 10) >= parseInt(params[0], 10);
		    },
		    max: function (value, params) {
		        if (this.float(value)) {
		            return parseFloat(value) <= parseFloat(params[0]);
		        }
		        return parseInt(value, 10) <= parseInt(params[0], 10);
		    },
		    between: function (value, params) {
		        
		        params[1] = params[1] || 999999;

		        if (this.float(value)) {
		            return parseFloat(value) >= parseFloat(params[0]) && parseFloat(value) <= parseFloat(params[1]);
		        }
		        if (this.integer(value)) {
		            return parseInt(value, 10) >= parseInt(params[0], 10) && parseInt(value, 10) <= parseInt(params[1], 10);
		        }
		        return false;
		    },
		    name: function (value) {
		        if (value.length > 0 && value.length < 2) {
		            return false;
		        }
		        return new RegExp(/^[a-zA-Z\sа-яА-ЯёЁ\-]+$/g).test(value);
		    },
		    lastname: function (value) {
		        return this.name(value);
		    },
		    phone: function (value) {
		        if (value.replace(/[^0-9]+/gi, '').match(/[0-9]+/gi) && value.replace(/[^0-9]+/gi, '').match(/[0-9]+/gi)[0].length < 6) {
		            return false;
		        }
		        return new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/g).test(value);
		    },
		    email: function (value) {
		        return new RegExp(/^(("[\w-\s]+")|([\w\-]+(?:\.[\w\-]+)*)|("[\w-\s]+")([\w\-]+(?:\.[\w\-]+)*))(@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value);
		    },
		    length: function (value, params) {
		        return this.between(value.replace(/\s{2,}/g, ' ').length, params);
		    },
		    maxlength: function (value, params) {
		        return this.max(value.replace(/\s{2,}/g, ' ').length, params);
		    },
		    minlength: function (value, params) {
		        return this.min(value.replace(/\s{2,}/g, ' ').length, params);
		    },
		    maxfilesize: function (value, params) {
		        var i,
		            l = value.length,
		            unitsOffset = 1;

		        switch (params[1].toLowerCase()) {
		        case 'b':
		            unitsOffset = 1;
		            break;

		        case 'kb':
		            unitsOffset = 1024;
		            break;

		        case 'mb':
		            unitsOffset = 1048576;
		            break;

		        case 'gb':
		            unitsOffset = 1073741824;
		            break;

		        case 'tb':
		            unitsOffset = 1099511627776;
		            break;
		        }

		        for (i = 0; i < l; i += 1) {
		            if (parseFloat(value[i]) > (parseFloat(params[0]) * unitsOffset)) {
		                return false;
		            }
		        }

		        return true;
		    },
		    fileextension: function (value, params) {
		        var i,
		            a,
		            l = params.length,
		            b = value.length,
		            cmpResC = 0;

		        for (i = 0; i < l; i += 1) {
		            for (a = 0; a < b; a += 1) {
		                if (params[i] === value[a].split('.').pop()) {
		                    cmpResC += 1;
		                }
		            }
		        }

		        return value.length === cmpResC ? true : false;
		    }
		},

		orderFields: function (attrName, attrValue) {

		    var self = this,
		    	retObj = {};

		    !!attrName && !!attrValue && Object.keys(this.fields).forEach(function (field) {
		    	if (self.fields[field].handle[attrName] && self.fields[field].handle[attrName] === attrValue) {
		    	    retObj[field] = self.fields[field];
		    	}
		    });

		    return retObj;
		},
		_eventSubmit: function (e) {

		    e.preventDefault();

		    //hide errors
		    this.hideErrors(false, true);

		    //show errors if validation failure
		    !this.validate() && this.showErrors();

		    //callback
		    (this.submitCallback(this.errors || null, this.errors ? false : true) === true) && this.formHandle.submit();
		},
		_eventChange: function (e) {

			var radioBtns,
				self = this;

			//remove spaces
			if (this.settings.removeSpaces && new RegExp(/\s{2,}/g).test(e.target.value)) {
			    e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
			}

			//if is radio buttons
			if (e.target.type === 'radio') {

			    //get radio groupe
			    radioBtns = this.orderFields('name', e.target.name);

			    Object.keys(radioBtns).forEach(function (btn) {
			    	self.hideErrors(radioBtns[btn].handle);
			    });

			} else {
			    //hide errors for this
			    this.hideErrors(e.target);
			}




			//validate and show errors for this
			if (!this.validate(e.target)) {

			    this.showErrors(e.target);
			    !this.settings.showErrors && this.submitCallback(this.errors, false);
			    
			}
		},
		_eventChangeWithDelay: function (e) {
			var self = this;

		    if (this.intervalID) {
		        clearTimeout(this.intervalID);
		    }

		    this.intervalID = setTimeout(function () {
		        self._eventChange.apply(self, [e]);
		    }, 400);
		},
		

		applySettings: function (settings) {

			var self = this;

			// apply rules
			settings.rules && Object.keys(settings.rules).forEach(function(ruleName) {
				self.rules[ruleName] = settings.rules[ruleName];
			});

			// apply messages
			settings.messages && Object.keys(settings.messages).forEach(function(locale) {
			    Object.keys(settings.messages[locale]).forEach(function (ruleName) {
			    	Object.keys(settings.messages[locale][ruleName]).forEach(function (param) {
			    		self.settings.messages[locale] = self.settings.messages[locale] || {};
			    		self.settings.messages[locale][ruleName] = self.settings.messages[locale][ruleName] || {};
			    		self.settings.messages[locale][ruleName][param] = settings.messages[locale][ruleName][param];
			    	});
			    });
			});

			// apply other settings
			Object.keys(settings).forEach(function (param) {
				self.settings[param] = settings[param];
			});

			return this;
		},


		getFields: function (fields) {

			var retData = {},
				rules = [],
				params = [];

			fields = fields || this.formHandle.querySelectorAll('[data-rule]');

			// each fields with data-rule attribute
			Object.keys(fields).forEach(function (fieldIndex) {

				rules = fields[fieldIndex].getAttribute('data-rule').split('|');

				Object.keys(rules).forEach(function (ruleIndex) {

					// parse rule
					if (rules[ruleIndex].match(/-/gi)) {

					    params = rules[ruleIndex].split('-');
					    rules[ruleIndex] = params[0];
					    params = params.splice(1);

					    rules[ruleIndex] = [rules[ruleIndex], params];
					} else {
					    rules[ruleIndex] = [rules[ruleIndex], []];
					}
				});

				retData[fieldIndex] = {
				    name: fields[fieldIndex].getAttribute('name'),
				    rules: rules,
				    defaultValue: fields[fieldIndex].getAttribute('data-default'),
				    handle: fields[fieldIndex],
				    intervalID: null
				};
			});

			return retData;
		},

		validate: function (validationField) {

			var self = this,
				fields = validationField ? this.getFields([validationField]) : this.fields,
				result,
				ruleName,
				params,
				defaultValue,
				value,
				message,
				messageType = null;

			this.errors = this.errors ? null : this.errors;

			Object.keys(fields).forEach(function (n) {
				
				result = true;

				// loop rules of this field
				fields[n].rules && Object.keys(fields[n].rules).forEach(function (ruleIndex) {
					
					// set rule data
					ruleName = fields[n].rules[ruleIndex][0];
					params = fields[n].rules[ruleIndex][1];
					defaultValue = fields[n].defaultValue;
					value = fields[n].handle.value;


					switch (fields[n].handle.type) {
						
						case 'checkbox':
							!fields[n].handle.checked && (value = '');
						break;

						case 'radio':
							// get radio groupe
							var radioBtns = self.orderFields('name', fields[n].handle.name),
								checked = false;

							Object.keys(radioBtns).forEach(function (i) {
								radioBtns[i].handle.checked && (checked = true);
							});

							if (!checked) {
							    
							    // add an error to one element
							    Object.keys(radioBtns).forEach(function (i) {
							    	try {
							    	    message = self.settings.messages[self.settings.locale][ruleName].empty;
							    	} catch (e) {
							    	    message = self.messages[self.settings.locale][ruleName].empty;
							    	}
							    });

							    // set value as for empty rules
							    value = '';
							}
						break;

						case 'file':

							// if the files were selected
							if (fields[n].handle.files && fields[n].handle.files.length) {

								value = [];

								Object.keys(fields[n].handle.files).forEach(function (fileIndex) {

									switch (ruleName) {
										case 'maxfilesize':
											value.push(fields[n].handle.files[fileIndex].size);
										break;

										case 'fileextension':
											value.push(fields[n].handle.files[fileIndex].name);
										break;
									}
								});

							}

						break;
					}


					if (result && !(value === '' && !fields[n].rules.join('|').match(/\|{0,1}required\|{0,1}/))) {

						// if exist default value and value is eq default
						if (result && defaultValue && value !== defaultValue) {

						    result = false;
						    messageType = 'incorrect';

						// if default value not exist
						} else if (result && self.rules[ruleName] && !self.rules[ruleName](value, params)) {

						    // set message to empty data
						    if ('' === value) {
						        result = false;
						        messageType = 'empty';

						    // set message to incorrect data
						    } else {
						        result = false;
						        messageType = 'incorrect';
						    }
						}

						if (result) {
						    self.hideErrors(fields[n].handle, true);
						
						} else {

						    // define errors stack if not exist
						    self.errors = self.errors || {};

						    // append error messages
						    if (ruleName === 'required' && fields[n].rules[1] && fields[n].rules[1][0]) {
						        ruleName = fields[n].rules[1][0];
						        messageType = 'empty';
						    }
						    
						    try {
						        try {
						            message = self.settings.messages[self.settings.locale][ruleName][messageType];
						        } catch (e) {
						            message = self.messages[self.settings.locale][ruleName][messageType];
						        }
						    } catch (e) {
						        ruleName = 'required';
						        message = self.messages[self.settings.locale][ruleName][messageType];
						    }

						    // push value into params if params is empty
						    !params.length && params.push(value);

						    // add errors
						    self.errors[n] = {
						        name: fields[n].name,
						        errorText: self.formatString(message, params)
						    };

						    // call callback if exist
						    if (!self.submitCallback) {
						        self.errors[n].handle = fields[n].handle;
						    }
						}
					}
				});
			});


			// run callback if callback is exists and not errors or return error data object
			if (this.submitCallback) {
			    return (this.errors) ? false : true;
			}

			return this.errors || true;

		},


		hideErrors: function (validationField, removeClass) {

		    var self = this,
		    	errorDiv;


			Object.keys(this.fields).forEach(function (n) {
		       	if ((validationField && validationField === self.fields[n].handle) || !validationField) {

		       		errorDiv = self.fields[n].handle.nextElementSibling;

		       		// remove class error
					removeClass && self.fields[n].handle.classList.remove(self.settings.errorClassName);

					// remove error element
		       		errorDiv && (errorDiv.getAttribute('data-type') === 'validator-error') && errorDiv.parentNode.removeChild(errorDiv);
		       	}
			});

		},

		showErrors: function (validationField) {

			var self = this,
				errorDiv,
				insertNodeError = function (refNode, errorObj) {

					// set error class
					refNode.classList.add(self.settings.errorClassName);

					// check to error div element exist
					if (refNode.nextElementSibling && refNode.nextElementSibling.getAttribute('data-type') === 'validator-error') {
						return;
					}

					// insert error element
					if (self.settings.showErrors) {
						errorDiv = document.createElement('div');
						errorDiv.setAttribute('class', self.settings.errorClassName);
						errorDiv.setAttribute('data-type', 'validator-error');
						errorDiv.innerHTML = errorObj.errorText;
						refNode.parentNode.insertBefore(errorDiv, refNode.nextSibling);
					}
				};




			Object.keys(this.errors).forEach(function (r) {
				
				// show error to specified field
				if (validationField) {

					Object.keys(self.fields).forEach(function (n) {
						(self.fields[n].handle.getAttribute('name') === validationField.getAttribute('name')) && insertNodeError(self.fields[n].handle, self.errors[r]);
					});

				// show error to all fields
				} else {
				    if (r === '0' || (r > 0 && self.fields[r].name !== self.fields[r - 1].name)) {
				        insertNodeError(self.fields[r].handle, self.errors[r]);
				    }
				}
			});





			// auto hide errors
			if (this.settings.autoHideErrors) {
				
				// for all fields
				if (!validationField) {

				    if (this.intervalID) {
				        clearTimeout(this.intervalID);
				    }

				    this.intervalID = setTimeout(function () {
				        self.intervalID = null;
				        self.hideErrors(false);
				    }, this.settings.autoHideErrorsTimeout);

				// for current field
				} else {

				    if (validationField.intervalID) {
				        clearTimeout(validationField.intervalID);
				    }

				    if (!this.intervalID) {
				        validationField.intervalID = setTimeout(function () {
				            validationField.intervalID = null;
				            self.hideErrors(validationField);
				        }, this.settings.autoHideErrorsTimeout);
				    }
				}
			}
		},


		/*
		* Get Form handle
		* @return {element} - Form handle
		*/
		getFormHandle: function () {
		    return this.formHandle;
		},

		/*
		* Formatting string. Replace string
		* @param {string} string - Source string. Example: "{0} age {1} years."
		* @param {array} params - An array of values​​, which will be replaced with markers. Example: ['Bob', 36]
		* @return {string} - Formatted string with replacing markers. Example "Bob age 36 years"
		*/
		formatString: function (string, params) {
		    return string.replace(/\{(\d+)\}/gi, function (match, number) {
		        return (match && params[number]) ? params[number] : '';
		    });
		},

		/*
		* Destroy validator
		*/
		destroy: function () {
		   
		    //hide errors
		    this.hideErrors(false, true);

		    // remove events
		    this.eventsBuilder('removeEventListener');

		},

		/*
		* Reload validator.
		* Example 1: reload(function (err, res) {...}, {autoHideErrors: false})
		* Example 2: reload({autoHideErrors: false})
		* @param {function} [submitCallback] - Submit callback function
		* @param {object} [settings] - Settings object
		*/
		reload: function (submitCallback, settings) {

			this.destroy();

		    //set variables
		    switch (arguments.length) {

		    case 2:
		        this.submitCallback = submitCallback;
		        this.settings = settings;
		       	break;

		    case 1:
		        this.settings = submitCallback;
		        break;
		    }

		    this.fields = this.getFields(this.formHandle.querySelectorAll('[data-rule]'));
		    this.submitCallback && this.eventsBuilder('addEventListener');
		    this.applySettings(settings || {});

		},
		eventsBuilder: function (actionName) {

			var self = this;


			this.formHandle[actionName]('submit', this._eventSubmit);

			// air mode
			this.settings.onAir && Object.keys(this.fields).forEach(function (field) {
				
				[].forEach.call(self.settings.eventsList, function (event) {

					if (event === 'keyup') {
					    self.fields[field].handle[actionName](event, self._eventChangeWithDelay);
					} else {
					    self.fields[field].handle[actionName](event, self._eventChange);
					}
				});
			});
			
			
		}
	};

	/**
	 * Encapsulation
	 * @return {Object} - this handle
	 */
	root[common.className] = function () {

		function construct(constructor, args) {

			function Class() {
				return constructor.apply(this, args);
			}
			Class.prototype = constructor.prototype;
			return new Class();
		}

		var original = construct(Protected, arguments),
			Publicly = function () {};

		Publicly.prototype = {};
		[].forEach.call(common.publicMethods, function (member) {
			Publicly.prototype[member] = function () {
				return original[member].apply(original, arguments);
			};
		});

		return new Publicly(arguments);
	};

}(this));