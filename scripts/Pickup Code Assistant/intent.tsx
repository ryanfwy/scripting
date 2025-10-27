import { Script, Navigation } from "scripting"
import { InfoView } from "./views/info_view"
import { remoteActivityInactive } from "./components/storage"
import { FromContext } from "./components/main"

async function run() {
  await remoteActivityInactive()
  await Navigation.present({
    element: <FromContext.Provider value={"intent"} >
      <InfoView />
    </FromContext.Provider>
  })
  Script.exit()
}

run()