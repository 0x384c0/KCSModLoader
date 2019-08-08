const detector = new KCSDetector()
document.getElementById("will_load_kcs").addEventListener("click", will_load_kcs);
function will_load_kcs() {
    detector.notifyStart()
}
document.getElementById("will_stop_kcs").addEventListener("click", will_stop_kcs);
function will_stop_kcs() {
    detector.notifyStop()
}