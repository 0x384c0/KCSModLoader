document.getElementById("will_load_kcs").addEventListener("click", will_load_kcs);
function will_load_kcs() {
    chrome.runtime.sendMessage({ command: "will_load_kcs" }, function (response) {
        console.log("started");
    })
}
document.getElementById("will_stop_kcs").addEventListener("click", will_stop_kcs);
function will_stop_kcs() {
    chrome.runtime.sendMessage({ command: "will_stop_kcs" }, function (response) {
        console.log("stopped");
    })
}