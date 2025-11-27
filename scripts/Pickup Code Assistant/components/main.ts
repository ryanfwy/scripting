import { LiveActivityState, createContext } from "scripting"
import { getLatestPhoto, pickPhoto, intentPhoto } from "./photo"
import { getAllActivitys, getActityState } from "./storage"
import { getSetting } from "./setting"

export type StartFromType = "latest" | "pick" | "intent" | undefined
export type ActivityDataType = {
  id: string,
  activity: Record<string, any>,
  state: LiveActivityState | null
}[]
export type RunState = {
  from: StartFromType,
  activitys: Observable<ActivityDataType | undefined>
}
export const RunContext = createContext<RunState>()

export async function getActivitysList() {
  let data = []
  const activitys = getAllActivitys() ?? []
  for (const activity of activitys.reverse()) {
    data.push({
      id: activity.activityId,
      activity: activity,
      state: await getActityState(activity.activityId)
    })
  }
  return data
}

export async function updateActivityValue(activitys: Observable<ActivityDataType | undefined>) {
  const data = await getActivitysList()
  if (data == null) return
  withAnimation(Animation.easeOut(0.25), () => {
    activitys.setValue(data)
  })
}

export function shouldRunOnAppear(from: StartFromType) {
  // intent
  if (from && from === "intent") return true

  // 主应用、小组件：settings 配置了启动后立即执行
  return getSetting("isRunWhenStarted")
}

export function runTypeOnAppear() {
  return getSetting("runType")
}

export async function getPhoto(from: StartFromType) {
  switch (from) {
    case "latest":
      return await getLatestPhoto()
    case "pick":
      return await pickPhoto()
    case "intent":
      return await intentPhoto()
    default:
      throw Error(`getPhoto gets invalid arg "from"=${from}`)
  }
}