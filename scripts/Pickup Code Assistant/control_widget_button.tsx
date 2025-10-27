import { ControlWidget, ControlWidgetButton } from "scripting"
import { OpenAppAndRunIntent } from "./app_intents"

async function runControlWidget() {
  ControlWidget.present(
    <ControlWidgetButton
      intent={OpenAppAndRunIntent(undefined)}
      label={{
        title: "Run pickup code",
        systemImage: "rosette"
      }}
    />
  )
}

runControlWidget()