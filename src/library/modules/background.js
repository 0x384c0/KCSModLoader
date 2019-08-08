//utils
const detector = new KCSDetector(willLoadKCS, willUnoadKCS)
const resourceOverride = new KCSResourceOverride("/resources/default")

detector.startListen()

function willLoadKCS() {
    resourceOverride.start()
}

function willUnoadKCS() {
    resourceOverride.stop()
}