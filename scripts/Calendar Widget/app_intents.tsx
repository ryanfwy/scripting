import { AppIntentManager, AppIntentProtocol, Widget, } from "scripting"
import { fetchData } from "./data"

export const ClickIntent = AppIntentManager.register({
  name: "ClickPlaylistIntent",
  protocol: AppIntentProtocol.AppIntent,
  perform: async (type: string) => {
    // Storage.set("widget.state.type", type)
    fetchData({type})
    Widget.reloadAll()
  }
})