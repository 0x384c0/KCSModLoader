//PIXI
class CustomLoader extends PIXI.loaders.Loader {
    add(name, url, options, cb) {
        console.log("CustomLoader.add\n\tname: " + name + "\n\turl: " + url)
        if (
            Object.prototype.toString.call(name) === "[object String]" &&
            name.includes(".png") &&
            url == null &&
            options == null &&
            cb == null
        ) {
            return super.add(name, { crossOrigin: true })
        } else {
            if (options != null)
                options.crossOrigin = true
            return super.add(name, url, options, cb)
        }
    }
}
function injectPixiLoader() {
    PIXI.loaders.Loader = CustomLoader
}
injectPixiLoader()