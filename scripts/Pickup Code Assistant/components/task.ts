import { useObservable, Script } from "scripting"
import { StartFromType, getPhoto } from "../components/main"
import { parseTextFromImage } from "../components/ocr"
import { requestAssistant } from "../components/assistant"
import { ActivityBuilder } from "../live_activity"
import { getSetting } from "../components/setting"
import { saveThumbnail } from "../components/storage"
import { haptic } from "../helper/haptic"
import { debugWithStorage } from "../helper/debug"

export type TaskStatus = "idle" | "running" | "success" | "failed"
export type TaskItem = {
  id: number,
  title: string,
  status: TaskStatus,
  func: (arg?: any) => Promise<any>
}

let photoGlobal: UIImage
const photoBlank = UIImage.fromFile(`${Script.directory}/blank.png`) as UIImage

const cfgTasks: TaskItem[] = [
  {
    id: 1,
    title: "读取图片文件",
    status: "idle",
    func: async (from?: StartFromType) => {
      photoGlobal = await getPhoto(from)
      return photoGlobal
    }
  },
  {
    id: 2,
    title: "大模型解析结果",
    status: "idle",
    func: async (input: string | UIImage) => {
      return await requestAssistant(input)
      // return { code: "A888", seller: "test" }
    }
  },
  {
    id: 3,
    title: "启动 LiveActivity",
    status: "idle",
    func: async (content: Record<string, any>) => {
      const activity = new ActivityBuilder()
      const timestamp = activity.timestamp
      await saveThumbnail(timestamp, photoGlobal)
      return await activity.startActivity(content)
    }
  },
]

function debugIfNeeded(text: string) {
  if (getSetting("isDebug") === false) return
  debugWithStorage(text)
}

export function runTaskWithUI(startFrom?: StartFromType) {
  const photo = useObservable<UIImage>(photoBlank)
  const tasks = useObservable<TaskItem[]>(cfgTasks)
  const isLatestRunning = useObservable<boolean>(false)
  const isPickRunning = useObservable<boolean>(false)

  function updateTask(
    id: number,
    status: TaskStatus
  ) {
    tasks.setValue(tasks.value.map(t => (t.id === id ? { ...t, status } : t)))
  }

  function updateRunning(
    from: StartFromType,
    status: boolean
  ) {
    switch (from) {
      case "latest":
        isLatestRunning.setValue(status)
        break
      case "pick":
        isPickRunning.setValue(status)
        break
      case "intent":
        isLatestRunning.setValue(status)
        isPickRunning.setValue(status)
        break
    }
  }

  async function runTasks(from: StartFromType = startFrom) {
    // init
    if (isLatestRunning.value) return
    if (isPickRunning.value) return
    updateRunning(from, true)
    tasks.setValue(tasks.value.map(t => ({ ...t, status: "idle" })))

    // main run
    let status = true
    let message = ""
    let respPrev: any = from
    for (const task of tasks.value) {
      debugIfNeeded(`执行任务: ${task.id}. ${task.title}`)
      updateTask(task.id, "running")
      try {
        if (respPrev) {
          respPrev = await task.func(respPrev)
        } else {
          respPrev = await task.func()
        }
        // set image
        if (task.id === 1) {
          photo.setValue(respPrev)
        }
        const resp = typeof respPrev === "object" ? JSON.stringify(respPrev) : respPrev
        debugIfNeeded(`执行结果: ${resp}`)
        updateTask(task.id, "success")
      }
      catch (e) {
        status = false
        message = String(e)
        debugIfNeeded(`执行出错: ${e}`)
        updateTask(task.id, "failed")
        break
      }
    }

    // finish
    if (status) {
      haptic("success")
    } else {
      haptic("failed")
    }
    updateRunning(from, false)
    return { status, message }
  }

  return {
    observes: {
      photo,
      tasks,
      isLatestRunning,
      isPickRunning
    },
    runTasks
  }
}

export async function runTaskWithoutUI(startFrom?: StartFromType) {
  let status = true
  let message = ""
  let respPrev: any = startFrom
  for (const task of cfgTasks) {
    debugIfNeeded(`执行任务: ${task.id}. ${task.title}`)
    try {
      if (respPrev) {
        respPrev = await task.func(respPrev)
      } else {
        respPrev = await task.func()
      }
      const resp = typeof respPrev === "object" ? JSON.stringify(respPrev) : respPrev
      debugIfNeeded(`执行结果: ${resp}`)
    }
    catch (e) {
      status = false
      message = String(e)
      debugIfNeeded(`执行出错: ${e}`)
      break
    }
  }

  return { status, message }
}