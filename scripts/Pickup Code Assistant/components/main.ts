import { createContext } from "scripting"
import { getLatestPhoto, pickPhoto, intentPhoto } from "./photo"
import { getSetting } from "./setting"

export type StartFrom = "latest" | "pick" | "intent" | undefined

export const FromContext = createContext<StartFrom>()

export function shouldRunOnAppear(from: StartFrom) {
  // intent
  if (from && from === "intent") return true

  // 主应用、小组件：settings 配置了启动后立即执行
  return getSetting("isRunWhenStarted")
}

export function runTypeOnAppear() {
  return getSetting("runType")
}

export async function getPhoto(from: StartFrom) {
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