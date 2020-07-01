function getResourcesFromSpriteSheet(resourceName) {
    let resource = document.loaderInstance.resources[document.kcs_extensionUrl + "resources/default_effects/img/battle/" + resourceName + ".json"]
    return Object.keys(resource.data.frames)
}


function frac(x) {
    return x - Math.floor(x, 1);
}

export default {
    getResourcesFromSpriteSheet,
    frac
}