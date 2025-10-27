import { Notification } from "scripting"

const maxDebugLines = 1000

export async function debugWithNotify(text: string) {
  await Notification.schedule({
    title: "Debug",
    body: text,
    trigger: new TimeIntervalNotificationTrigger({
      timeInterval: 1,
      repeats: false
    }),
    customUI: false
  })
}

export function debugWithStorage(
  text: string,
  key: string = "activity.log"
) {
  let data = Storage.get<string>(key) || ""
  const now = (new Date()).toLocaleString()
  const dataList = data.split("\n")
  // 截断
  if (dataList.length > maxDebugLines) {
    data = dataList.slice(0, maxDebugLines).join("\n")
  }
  Storage.set(key, `${now} ${text}\n${data}`)
  console.log(text)
}

export function removeDebugStorage(
  key: string = "activity.info"
) {
  Storage.remove(key)
}