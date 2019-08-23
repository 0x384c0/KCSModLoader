//utils
const storage = new Storage()
const detector = new KCSDetector(willLoadKCS, willUnoadKCS)
let resourceOverride = null
let localResources = null

detector.startListen()

function willLoadKCS() {
    init()
        .then(() => {
            if (resourceOverride != null) resourceOverride.start(localResources)
        })
}

function willUnoadKCS() {
    resourceOverride.stop()
}

async function init() {
    if (resourceOverride != null) resourceOverride.stop()
    resourceOverride = null
    const isResourceOverrideEnabled = await storage.getIsResourceOverrideEnabled()
    if (isResourceOverrideEnabled) {
        const resourcePath = await storage.getResourcePath()
        localResources = await getLocalResources()
        resourceOverride = new KCSResourceOverride(resourcePath, localResources)
    }
}

//File System
function getDirectoryEntry(path) {
    return new Promise((resolve, reject) => {
        chrome.runtime.getPackageDirectoryEntry(function (directoryEntry) {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError)
            else
                directoryEntry.getDirectory(path, {}, function (subDirectoryEntry) {
                    if (chrome.runtime.lastError)
                        reject(chrome.runtime.lastError)
                    else
                        resolve(subDirectoryEntry)
                })
        });
    })
}

function getEntriesFromDirectoryEntry(directoryEntry) {
    return new Promise((resolve, reject) => {
        directoryEntry.getDirectory(directoryEntry.fullPath, {}, function (subDirectoryEntry) {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError)

            var directoryReader = subDirectoryEntry.createReader();
            // List of DirectoryEntry and/or FileEntry objects.
            var fileEntries = [];
            (function readNext() {
                directoryReader.readEntries(function (entries) {
                    if (entries.length) {
                        for (entry of entries) {
                            fileEntries.push(entry);
                        }
                        readNext();
                    } else {
                        resolve(fileEntries);
                    }
                });
            })();
        });
    })
}

async function getAllEntries(directoryEntry) {
    let entries = await getEntriesFromDirectoryEntry(directoryEntry)
    let result = entries
    for (entry of entries) {
        if (entry.isDirectory) {
            let dirEndtries = await getAllEntries(entry)
            result = result.concat(dirEndtries)
        }
    }
    return result
}

async function getLocalResources() {
    let directoryEntry = await getDirectoryEntry('resources/default')
    let entries = await getAllEntries(directoryEntry)
    let files = entries
        .filter(entry => entry.isFile)
        .map(entry => entry.fullPath)
        .filter(path => path.includes("default/kcs2"))
        .map(path => path.replace("/crxfs/resources/default/", ""))
    return files
}