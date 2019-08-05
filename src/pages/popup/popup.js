document.getElementById("toggle_button").addEventListener("click", toggle_intercept);
function toggle_intercept() {
    chrome.runtime.sendMessage({ command: "toggle_intercept" }, function (response) {
        console.log("Interseption started");
    })
}