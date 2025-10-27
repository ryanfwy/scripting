import { useState, ShapeStyle, DynamicShapeStyle, Script } from "scripting"
import { StartFrom, getPhoto } from "../components/main"
import { parseTextFromImage } from "../components/ocr"
import { requestAssistant } from "../components/assistant"
import { ActivityBuilder } from "../components/activity"
import { getSetting } from "../components/setting"
import { haptic } from "../helper/haptic"
import { debugWithStorage } from "../helper/debug"

type TaskStatus = "idle" | "running" | "success" | "failed"

type TaskItem = {
  id: number,
  title: string,
  status: TaskStatus,
  func: (arg?: any) => Promise<any>
}

const photoBlank = UIImage.fromFile(`${Script.directory}/blank.png`) as UIImage

const cfgTaskList: TaskItem[] = [
  {
    id: 1,
    title: "读取图片文件",
    status: "idle",
    func: async (from?: StartFrom) => {
      return await getPhoto(from)
    }
  },
  {
    id: 2,
    title: "OCR 解析图片内容",
    status: "idle",
    func: async (image: UIImage) => {
      return await parseTextFromImage(image)
    }
  },
  {
    id: 3,
    title: "大模型解析返回结果",
    status: "idle",
    func: async (text: string) => {
      return await requestAssistant(text)
    }
  },
  {
    id: 4,
    title: "启动 LiveActivity",
    status: "idle",
    func: async ({ code, seller }: { code: string, seller: string }) => {
      const builder = new ActivityBuilder()
      builder.buildAndStartActivity({ code, seller })
    }
  },
]

const cfgStatusStyle: {
  [key in TaskStatus]: {
    systemName: string,
    foregroundStyle: ShapeStyle | DynamicShapeStyle
  }
} = {
    running: {
      systemName: "play.circle.fill",
      foregroundStyle: {
        light: "black",
        dark: "white",
      }
    },
    success: {
      systemName: "checkmark.circle.fill",
      foregroundStyle: "systemGreen"
    },
    failed: {
      systemName: "xmark.circle.fill",
      foregroundStyle: "systemRed"
    },
    idle: {
      systemName: "info.circle.fill",
      foregroundStyle: "secondaryLabel"
    }
  }

export function useTaskRunner(startFrom?: StartFrom) {
  const [tasks, setTasks] = useState<TaskItem[]>(cfgTaskList)
  const [isLatestRunning, setIsLatestRunning] = useState(false)
  const [isPickRunning, setPickIsRunning] = useState(false)
  const [photo, setPhoto] = useState<UIImage>(photoBlank)

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

  function debugIfNeeded(text: string) {
    if (getSetting("isDebug") === false) return
    debugWithStorage(text)
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
    tasks,
    cfgStatusStyle,
    isLatestRunning,
    isPickRunning,
    photo,
    runTasks
  }
}