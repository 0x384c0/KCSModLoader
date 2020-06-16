export default (BattleScene) => {
    return class CustomBattleScene extends BattleScene {
        constructor() {
            super()
            let thisRef = this
            document.kcs_getBattleSceneView = () => { return thisRef._view }
        }
    }
}