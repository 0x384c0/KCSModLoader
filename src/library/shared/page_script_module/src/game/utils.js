function getFramesForBattleSprite(resourceName) {
    let resource = document.loaderInstance.resources[document.kcs_extensionUrl + "resources/default_effects/img/battle/" + resourceName + ".json"]
    return Object.keys(resource.data.frames)
}

export default {
    getFramesForBattleSprite
}