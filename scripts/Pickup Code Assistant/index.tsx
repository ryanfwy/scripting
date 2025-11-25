import { Script, Navigation, Image, NavigationStack } from "scripting"
import { InfoView } from "./views/info_view"
import { genThumbnailPath, remoteActivityInactive, removeThumbnailInactive } from "./components/storage"
import { shouldRunOnAppear, runTypeOnAppear, FromContext } from "./components/main"

async function presentInfo() {
  const from = shouldRunOnAppear(undefined) ? runTypeOnAppear() : undefined
  await Navigation.present({
    element: <FromContext.Provider value={from}>
      <InfoView />
    </FromContext.Provider>
  })
}

async function presentImage(timestamp: number) {
  await Navigation.present({
    element: <NavigationStack>
      <Image
        navigationTitle={"Preview Photo"}
        navigationBarTitleDisplayMode={"inline"}
        filePath={genThumbnailPath(timestamp).pathOrigin}
        scaleToFit={true}
        resizable={true}
      />
    </NavigationStack>
  })
}

async function run() {
  await remoteActivityInactive()
  await removeThumbnailInactive()
  // activity 点击后启动 app 携带参数
  // { activity, timestamp }
  const param = Script.queryParameters
  if (param && param.activity === "true") {
    const timestamp = Number(param.timestamp)
    await presentImage(timestamp)
  }
  else {
    await presentInfo()
  }
  Script.exit()
}

run()