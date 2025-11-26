import { Script, Navigation, Image, NavigationStack, useObservable, Intent } from "scripting"
import { genThumbnailPath } from "./components/storage"
import { runTaskWithoutUI } from "./components/task"
import { shouldRunOnAppear, runTypeOnAppear, StartFromType, RunContext, ActivityDataType } from "./components/main"
import { InfoView } from "./views/info_view"

export function InfoViewProvider({
  from
}: {
  from: StartFromType
}) {
  // activitys: context as history list setter
  const activitys = useObservable<ActivityDataType>()
  return <RunContext.Provider
    value={{ from, activitys }}
  >
    <InfoView />
  </RunContext.Provider>
}

async function presentApp() {
  const from = shouldRunOnAppear(undefined) ? runTypeOnAppear() : undefined
  await Navigation.present({
    element: <InfoViewProvider from={from} />
  })
  Script.exit()
}

async function presentAppFromIntent() {
  await Navigation.present({
    element: <InfoViewProvider from={"intent"} />
  })
  Script.exit()
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
  Script.exit()
}

async function runBackground() {
  const resp = await runTaskWithoutUI("intent")
  Script.exit(
    Intent.json(resp)
  )
}

async function run() {
  const env = Script.env
  const paramIntent = Intent.shortcutParameter?.value as Record<string, string>
  // intent
  if (env === "intent") {
    if (paramIntent?.run === "background") {
      // Shortcuts Run Script 携带参数
      // {"run": "background"}
      await runBackground()
    } else {
      // Shortcuts Run in App 携带参数
      // {"run": "app"}
      await presentAppFromIntent()
    }
  }

  // index
  const paramScript = Script.queryParameters
  if (paramScript && paramScript.activity === "true") {
    // Live Activity 点击后 URL Scheme 携带参数
    // { activity, timestamp }
    const timestamp = Number(paramScript.timestamp)
    await presentImage(timestamp)
  } else {
    await presentApp()
  }
}

run()