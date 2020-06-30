export default class SoundManagerWrapper {
	constructor(soundManager, extensionUrl) {
		this.soundManager = soundManager
		this.extensionUrl = extensionUrl
	}
	se_play(name) {
		this.soundManager.se.play(this.extensionUrl + "resources/default_effects/resources/se/" + name) //TODO: store full filename in config
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}