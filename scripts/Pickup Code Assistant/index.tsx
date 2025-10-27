import { Script, Navigation } from "scripting"
import { InfoView } from "./views/info_view"
import { remoteActivityInactive } from "./components/storage"
import { shouldRunOnAppear, runTypeOnAppear, FromContext } from "./components/main"

async function run() {
  await remoteActivityInactive()
  const from = shouldRunOnAppear(undefined) ? runTypeOnAppear() : undefined
  await Navigation.present({
    element: <FromContext.Provider value={from}>
      <InfoView />
    </FromContext.Provider>
  })
  Script.exit()
}

run()