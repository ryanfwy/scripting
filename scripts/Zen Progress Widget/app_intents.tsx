import { AppIntentManager, AppIntentProtocol, Widget } from "scripting"
import { keyZenCnt, keyZenTs, keyProgressCnt } from "./components/constant"
import { getSetting } from "./components/setting"

export const WidgetButtonIntent = AppIntentManager.register({
  name: "WidgetButtonIntent",
  protocol: AppIntentProtocol.AppIntent,
  perform: async (viewType: string) => {
    switch (viewType) {
      case "zen":
        const zenCnt = Storage.get<number>(keyZenCnt) || 0
        const zenCntNew = zenCnt + 1
        Storage.set(keyZenCnt, zenCntNew)
        // zen fullfill
        const zenRoundMaxCnt = getSetting("zenRoundMaxCnt")
        if (zenCntNew % zenRoundMaxCnt === 0) {
          Storage.set(keyZenTs, Date.now())
        }
        break
      case "progress":
        const cntProgress = Storage.get<number>(keyProgressCnt) || 0
        Storage.set(keyProgressCnt, cntProgress + 1)
        break
    }
    Widget.reloadAll()
  }
})
