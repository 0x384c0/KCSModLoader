class CustomSoundManager{
	constructor(soundManager,extensionUrl){
		this.soundManager = soundManager
		this.extensionUrl = extensionUrl
		this.sfx_meta = {
			"boom_big1_g":4,
			"boom_big1_w":3,
			"fire_gun4":2
		}
	}
	se_play(name){
		let randId = "_" + this.getRandomInt(1,this.sfx_meta[name]).toString()
		this.soundManager.se.play(this.extensionUrl + "resources/default_effects/resources/se/" + name + randId + ".wav")
	}

	getRandomInt(min, max) {
	    min = Math.ceil(min);
	    max = Math.floor(max);
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}