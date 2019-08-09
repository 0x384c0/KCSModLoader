//utils
const storage = new Storage()
const detector = new KCSDetector(willLoadKCS, willUnoadKCS)
let resourceOverride = null

detector.startListen()

function willLoadKCS() {
    init()
    .then(() => {
        if (resourceOverride != null) resourceOverride.start()
    })
}

function willUnoadKCS() {
    resourceOverride.stop()
}

async function init(){
    if (resourceOverride != null ) resourceOverride.stop()
   	resourceOverride = null
    const isResourceOverrideEnabled = await storage.getIsResourceOverrideEnabled()
    if (isResourceOverrideEnabled) {
    	const resourcePath = await storage.getResourcePath()
        resourceOverride = new KCSResourceOverride(resourcePath)
    }
}