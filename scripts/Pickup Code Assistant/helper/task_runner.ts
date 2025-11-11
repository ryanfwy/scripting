import { useState, Script } from "scripting"
import { StartFrom, getPhoto } from "../components/main"
import { parseTextFromImage } from "../components/ocr"
import { requestAssistant } from "../components/assistant"
import { ActivityBuilder } from "../components/activity"
import { getSetting } from "../components/setting"
import { haptic } from "../helper/haptic"
import { debugWithStorage } from "../helper/debug"

export type TaskStatus = "idle" | "running" | "success" | "failed"
export type TaskItem = {
  id: number,
  title: string,
  status: TaskStatus,
  func: (arg?: any) => Promise<any>
}

const photoBlank = UIImage.fromFile(`${Script.directory}/blank.png`) as UIImage

const cfgTasks: TaskItem[] = [
  {
    id: 1,
    title: "读取图片文件",
    status: "idle",
    func: async (from?: StartFrom) => {
      return await getPhoto(from)
    }
  },
  // {
  //   id: 2,
  //   title: "OCR 解析图片内容",
  //   status: "idle",
  //   func: async (image: UIImage) => {
  //     return await parseTextFromImage(image)
  //   }
  // },
  {
    id: 3,
    title: "大模型解析结果",
    status: "idle",
    func: async (input: string | UIImage) => {
      return await requestAssistant(input)
    }
  },
  {
    id: 4,
    title: "启动 LiveActivity",
    status: "idle",
    func: async ({ code, seller }: { code: string, seller: string }) => {
      const builder = new ActivityBuilder()
      await builder.buildAndStartActivity({ code, seller })
    }
  },
]

function debugIfNeeded(text: string) {
  if (getSetting("isDebug") === false) return
  debugWithStorage(text)
}

export function runTaskWithUI(startFrom?: StartFrom) {
  const [photo, setPhoto] = useState<UIImage>(photoBlank)
  const [tasks, setTasks] = useState<TaskItem[]>(cfgTasks)
  const [isLatestRunning, setIsLatestRunning] = useState(false)
  const [isPickRunning, setPickIsRunning] = useState(false)

  function updateTask(
    id: number,
    status: TaskStatus
  ) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)))
  }

  function updateRunning(
    from: StartFrom,
    status: boolean
  ) {
    switch (from) {
      case "latest":
        setIsLatestRunning(status)
        break
      case "pick":
        setPickIsRunning(status)
        break
      case "intent":
        setIsLatestRunning(status)
        setPickIsRunning(status)
        break
    }
  }

  async function runTasks(from: StartFrom = startFrom) {
    // init
    if (isLatestRunning || isPickRunning) return
    updateRunning(from, true)
    for (const task of tasks) {
      updateTask(task.id, "idle")
    }

    // main run
    let respPrev: any = from
    for (const task of tasks) {
      debugIfNeeded(`执行任务: ${task.id}. ${task.title}`)
      updateTask(task.id, "running")
      try {
        if (respPrev) {
          respPrev = await task.func(respPrev)
        } else {
          respPrev = await task.func()
        }
        if (task.id === 1) {
          setPhoto(respPrev)
        }
        const resp = typeof respPrev === "object" ? JSON.stringify(respPrev) : respPrev
        debugIfNeeded(`执行结果: ${resp}`)
        updateTask(task.id, "success")
      }
      catch (e) {
        debugIfNeeded(`执行出错: ${e}`)
        haptic("failed")
        updateTask(task.id, "failed")
        break
      }
    }

    // finish
    haptic("success")
    updateRunning(from, false)
  }

  return {
    states: { photo, tasks, isLatestRunning, isPickRunning },
    runTasks
  }
}

export async function runTaskWithoutUI(startFrom?: StartFrom) {
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