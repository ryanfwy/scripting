import { Script, Navigation } from "scripting"
import { SettingView } from "./views/setting_view"

async function run() { 
  await Navigation.present({
    element: <SettingView />
  })
  Script.exit()
}

run()