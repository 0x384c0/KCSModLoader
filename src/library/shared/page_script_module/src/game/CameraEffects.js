import gsap from "gsap";
import CustomWiggle from "../gsap/bonus_plugins/CustomWiggle.js";

export default class CameraEffects {
    constructor(getRootView) {
        this._getRootView = getRootView
    }

    //shake
    shakeCamera(magnitude, duration, wiggles) {
        this.interruptShake()
        let rootView = undefined
        try { rootView = this._getRootView() }
        catch (e) { console.log(`Inable to get root view:\n${e}`) }
        if (rootView == undefined)
            console.e('CameraEffects.shakeCamera\nrootView is undefined')
        else {
            CustomWiggle.create("_taskShake.Wiggle", { wiggles: wiggles, type: "easeOut" });
            let random = Math.round(Math.random()) * 2 - 1
            this._taskShake = gsap.to(rootView, duration, { 
                x: random * magnitude,
                y: -1 * random * magnitude,
                ease: "_taskShake.Wiggle" 
            })
            this._taskShake.play()
            // this._taskShakeX = gsap.to(rootView, duration, { x: random * magnitude,        ease: "_taskShake.Wiggle" })
            // this._taskShakeY = gsap.to(rootView, duration, { y: -1 * random * magnitude,   ease: "_taskShake.Wiggle" })
            // this._taskShakeX.play()
            // this._taskShakeY.play()
        }
    }

    interruptShake() {
        try {
            this._taskShake.kill()
            // this._taskShakeX.kill()
            // this._taskShakeY.kill()
        } catch{ }
    }
}