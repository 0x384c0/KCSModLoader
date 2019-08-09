//utils
const storage = new Storage()
const detector = new KCSDetector()

//UI Bindings
Vue.use(VueMaterial.default)
var settings = null

//Others
async function init() {
    const isResourceOverrideEnabled = await storage.getIsResourceOverrideEnabled()
    const isCustomEffectEnabledd = await storage.getIsCustomEffectEnabled()
    const resourcePath = await storage.getResourcePath()
    console.log(resourcePath)
    settings = new Vue({
        el: '#settings',
        data: { 
            isResourceOverrideEnabled: isResourceOverrideEnabled,
            isCustomEffectEnabled: isCustomEffectEnabledd,
            resourcePath: resourcePath
        },
        methods: {
            isResourceOverrideEnabledChange: () => { storage.setIsResourceOverrideEnabled(settings.isResourceOverrideEnabled) },
            isCustomEffectEnabledChange: () => { storage.setIsCustomEffectEnabled(settings.isCustomEffectEnabled) },
            resourcePathChange: () => { storage.setResourcePath(settings.resourcePath) },
            reset: () => { storage.resetResourcePath(); storage.getResourcePath().then(value => settings.resourcePath = value)}
        }
    })
}
init()