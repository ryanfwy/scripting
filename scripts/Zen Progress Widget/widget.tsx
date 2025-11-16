import { Button, Image, Text, Widget, ZStack } from "scripting"
import { GaugeZen } from "./views/gauge_zen"
import { GaugeProgress } from "./views/gauge_progress"
import { keyZenTs } from "./components/constant"
import { getSetting } from "./components/setting"
import { WidgetButtonIntent } from "./app_intents"

function isZenEnds() {
  const ts = Storage.get<number>(keyZenTs) || 0
  const duration = getSetting("zenRoundDurationTs")
  const now = Date.now()
  if (now - ts > duration) return true
  return false
}

function WidgetView() {
  let viewType = "zen"
  const isZen = getSetting("isZen")
  if (isZen === false) {
    viewType = "progress"
  }
  if (isZenEnds() === false) {
    viewType = "progress"
  }

  return <ZStack
    frame={Widget.displaySize}
  >
    {viewType === "zen" ? <GaugeZen /> : null}
    {viewType === "progress" ? <GaugeProgress /> : null}
    <Button
      frame={{ maxWidth: "infinity", maxHeight: "infinity" }}
      buttonStyle={"plain"}
      intent={WidgetButtonIntent(viewType)}
    >
      <Image
        frame={{ maxWidth: "infinity", maxHeight: "infinity" }}
        systemName={""}
        background="rgba(0,0,0,0.00001)"
      />
    </Button>
  </ZStack>
}

if (Widget.family === "accessoryCircular") {
  Widget.present(<WidgetView />)
} else {
  Widget.present(<Text>只支持锁屏圆形小组件</Text>)
}