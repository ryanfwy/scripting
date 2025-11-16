import { Gauge, Text } from "scripting"
import { fontWidgetLabel, fontWidgetMain, keyProgressCnt } from "../components/constant"
import { getDayRatio, getWeekRatio, getMonthRatio, getYearRatio } from "../components/progress"
import { getBirthRatio, getRetireRatio, getCustomRatio } from "../components/progress"
import { getSetting } from "../components/setting"

function GaugeProgressTemplate({
  label,
  getRatio
}:{
  label: string,
  getRatio: () => number
}) {
  const ratio = getRatio()
  const ratioString = ratio.toFixed(0).toString() + "%"
  return <Gauge
    value={ratio}
    label={
      <Text
        font={fontWidgetLabel}
        fontWeight={"semibold"}
        fontDesign={"rounded"}
        monospaced={true}
        padding={{ top: 10 }}
      >
        {label}
      </Text>
    }
    min={0}
    max={100}
    currentValueLabel={
      <Text
        contentTransition={"numericTextCountsUp"}
        font={fontWidgetMain}
        fontDesign={"rounded"}
        monospaced={true}
      >
        {ratioString}
      </Text>
    }
    gaugeStyle="accessoryCircular"
  />
}


const views = [
  GaugeProgressTemplate({ label: "Day", getRatio: getDayRatio }),
  GaugeProgressTemplate({ label: "Week", getRatio: getWeekRatio }),
  GaugeProgressTemplate({ label: "Month", getRatio: getMonthRatio }),
  GaugeProgressTemplate({ label: "Year", getRatio: getYearRatio }),
]
if (getSetting("isBirthday")) {
  views.push(GaugeProgressTemplate({ label: "Birth", getRatio: getBirthRatio }))
  views.push(GaugeProgressTemplate({ label: "Retire", getRatio: getRetireRatio }))
}
if (getSetting("isCustom")) {
  views.push(GaugeProgressTemplate({ label: getSetting("customLabel"), getRatio: getCustomRatio }))
}

export function GaugeProgress() {
  let cnt = Storage.get<number>(keyProgressCnt) || 0
  if (cnt >= views.length) {
    cnt = 0
    Storage.set(keyProgressCnt, cnt)
  }
  return views[cnt]
}