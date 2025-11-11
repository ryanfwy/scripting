import { Script, Navigation, Intent } from "scripting"
import { InfoView } from "./views/info_view"
import { remoteActivityInactive } from "./components/storage"
import { FromContext } from "./components/main"
import { runTaskWithoutUI } from "./helper/task_runner"

async function runInApp() {
  await remoteActivityInactive()
  await Navigation.present({
    element: <FromContext.Provider value={"intent"} >
      <InfoView />
    </FromContext.Provider>
  })
  Script.exit()
}

async function runBackground() {
  await remoteActivityInactive()
  const resp = await runTaskWithoutUI("intent")
  Script.exit(
    Intent.json(resp)
  )
}

// Shortcuts 里配置 {"run": "app"}
const param = Intent.shortcutParameter?.value as Record<string, string>
if (param && param?.run === "app") {
  runInApp()
} else {
  runBackground()
}