import gsap, { TimelineMax } from "gsap";
import CustomWiggle from "../gsap/bonus_plugins/CustomWiggle.js";
import CustomEase from "../gsap/bonus_plugins/CustomEase.js";

export default class CameraEffects {
    constructor(getRootView) {
        this._getRootView = getRootView
    }

    //.shakeCamera(0.004,0.6,6)
    //.shakeCamera(0.002,0.2,3)
    shakeCamera(magnitude, duration, wiggles) {
        this.interruptShake()
        let rootView = undefined
        try { rootView = this._getRootView() }
        catch (e) { console.log(`Inable to get root view:\n${e}`) }
        if (rootView == undefined)
            console.e('CameraEffects.shakeCamera\nrootView is undefined')
        else {
            CustomWiggle.create("_taskShake.Wiggle", { wiggles: wiggles, type: "easeOut" });
            CustomEase.create("_taskShake.Ease", "M0,0,C0,0.33,0.036,1,0.3,1,0.558,1,0.894,0.31,1,-0.056")
            let random = Math.round(Math.random()) * 2 - 1
            let phase = duration / wiggles
            let magnitudeAbsHeigh = Math.floor(rootView.height * magnitude)
            let magnitudeAbsWidth = Math.floor(rootView.width * magnitude)
            let yStartOffset = phase / 2


            // rootView.scale.set(scale, scale)
            let rootViewWrapper = new RootViewWrapper(rootView)

            let tl = new TimelineMax();
            this._taskShake = tl
                .to(rootViewWrapper, duration, {
                    x: random * magnitudeAbsWidth,
                    ease: "_taskShake.Wiggle"
                })
                .to(rootViewWrapper, duration, {
                    y: random * magnitudeAbsHeigh,
                    ease: "_taskShake.Wiggle"
                }, yStartOffset)
                .to(rootViewWrapper, duration + yStartOffset + duration * 0.05, {
                    magnitude: magnitude,
                    ease: "_taskShake.Ease",
                    onComplete: () => { rootViewWrapper.magnitude = 0 }
                }, 0)
        }
    }

    interruptShake() {
        try {
            this._taskShake.kill()
        } catch{ }
    }
}

class RootViewWrapper {
    constructor(rootView) {
        this._rootView = rootView
        this._magnitude = 0
        this._x = 0
        this._y = 0
        this._scale = 1
    }

    /**
     * @param {number} magnitude
     */
    set magnitude(magnitude) {
        this._magnitude = magnitude
        let magnitudeLarge = magnitude * 1.1
        let scale = 1 + magnitudeLarge * 2
        let rootView = this._rootView
        let magnitudeAbsWidth = Math.floor(rootView.width * magnitudeLarge)
        let magnitudeAbsHeigh = Math.floor(rootView.height * magnitudeLarge)
        rootView.scale.set(scale, scale)
        rootView.x = -magnitudeAbsWidth - this._x
        rootView.y = -magnitudeAbsHeigh - this._y
    }

    get magnitude() {
        return this._magnitude
    }

    set x(x){
        this._x = x
    }
    get x(){
        return this._x
    }

    set y(y){
        this._y = y
    }
    get y(){
        return this._y
    }
}