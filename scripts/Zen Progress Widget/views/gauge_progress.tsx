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
        padding={{ top: 0 }}
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


const labels: Record<string, any> = {
  "zh": {
    "day": "日",
    "week": "周",
    "month": "月",
    "year": "年",
    "birth": "生日",
    "retire": "退休",
  },
  "en": {
    "day": "Day",
    "week": "Week",
    "month": "Month",
    "year": "Year",
    "birth": "Birth",
    "retire": "Retire",
  }
}

const l10n = getSetting("l10n")
const views = [
  GaugeProgressTemplate({ label: labels[l10n]["day"], getRatio: getDayRatio }),
  GaugeProgressTemplate({ label: labels[l10n]["week"], getRatio: getWeekRatio }),
  GaugeProgressTemplate({ label: labels[l10n]["month"], getRatio: getMonthRatio }),
  GaugeProgressTemplate({ label: labels[l10n]["year"], getRatio: getYearRatio }),
]
if (getSetting("isBirthday")) {
  views.push(GaugeProgressTemplate({ label: labels[l10n]["birth"], getRatio: getBirthRatio }))
  views.push(GaugeProgressTemplate({ label: labels[l10n]["retire"], getRatio: getRetireRatio }))
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