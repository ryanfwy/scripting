import { Button, Text, Widget, ZStack } from "scripting"
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
  const ProgressView = viewType === "zen" ? GaugeZen : GaugeProgress

  return <ZStack
    frame={Widget.displaySize}
  >
    <Button
      buttonStyle={"plain"}
      intent={WidgetButtonIntent(viewType)}
    >
      <ProgressView />
    </Button>
    {viewType === "zen" ?
      <Text
        font={6}
        fontDesign={"rounded"}
        fontWeight={"black"}
        offset={{ x: 3, y: -6 }}
        rotationEffect={{ degrees: -10, anchor: "center" }}
      >
        {"+1"}
      </Text> : undefined
    }
  </ZStack>
}

if (Widget.family === "accessoryCircular") {
  Widget.present(<WidgetView />)
} else {
  Widget.present(<Text>只支持锁屏圆形小组件</Text>)
}