import { HStack, Text, Widget } from "scripting"
import { TodayView, CalendarView } from "./widget_view"
import { fetchData } from "./data"

function WidgetView() {
  const data = fetchData({})
  return <HStack
    padding={{
      vertical: 10
    }}
    frame={Widget.displaySize}
    foregroundStyle="white"
  >
    <TodayView
      month={data.month}
      date={data.date}
    />
    <CalendarView
      dates={data.dates}
      today={data.date}
    />
  </HStack>
}


if (Widget.family === "accessoryRectangular") {
  Widget.present(<WidgetView />)
} else {
  Widget.present(<Text>只支持锁屏长方形小组件</Text>)
}