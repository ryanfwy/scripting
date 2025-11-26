import { AppIntentManager, AppIntentProtocol, ControlWidget, Script } from "scripting"
import { scriptName } from "./components/constant"
import { debugWithStorage } from "./helper/debug"

const storageKeyWidgetError = "activity.intent.error"

export const ActivityFinishIntent = AppIntentManager.register({
  name: "ActivityFinishIntent",
  protocol: AppIntentProtocol.LiveActivityIntent,
  perform: async (timestamp: number) => {
    // lazy import
    try {
      const { ActivityBuilder } = await import("./live_activity")
      await ActivityBuilder.endActivityWithTs(timestamp)
    }
    catch (e) {
      debugWithStorage("ActivityFinishIntent: " + String(e), storageKeyWidgetError)
    }
  }
})

export const OpenAppAndRunIntent = AppIntentManager.register({
  name: "OpenAppAndRunIntent",
  protocol: AppIntentProtocol.AppIntent,
  perform: async () => {
    try {
      const scriptUrl = Script.createRunURLScheme(scriptName)
      await Safari.openURL(scriptUrl)
      // ControlWidget.reloadButtons()
    }
    catch (e) {
      debugWithStorage("OpenAppAndRunIntent: " + String(e), storageKeyWidgetError)
    }
  }
})