import { VStack, HStack, Text, Button, Image, Spacer, NavigationStack, Navigation, useContext, ShapeStyle, DynamicShapeStyle, useObservable } from "scripting"
import { shouldRunOnAppear, FromContext, StartFrom } from "../components/main"
import { getSetting } from "../components/setting"
import { TaskStatus, runTaskWithUI } from "../helper/task_runner"

// 启动立即执行状态，只执行一次
let hasRunOnAppear = false
const animate = Animation.linear(0.15)

const statusStyles: {
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

function PhotoView({
  photo
}: {
  photo: UIImage
}) {
  return <NavigationStack>
    <Image
      navigationTitle={("Preview Photo")}
      navigationBarTitleDisplayMode={"inline"}
      image={photo}
      scaleToFit={true}
      resizable={true}
    />
  </NavigationStack>
}

export function TaskList() {
  const from = useContext(FromContext)
  const { observes, runTasks } = runTaskWithUI(from)
  const {
    photo,
    tasks,
    isLatestRunning,
    isPickRunning
  } = observes
  const showToast = useObservable<boolean>(false)
  const toastMsg = useObservable<string>("")

  async function run(from: StartFrom) {
    const resp = await runTasks(from)
    if (resp?.status === false) {
      toastMsg.setValue(resp.message)
      showToast.setValue(true)
    }
  }

  async function runOnAppear(from: StartFrom) {
    if (hasRunOnAppear) return
    if (!shouldRunOnAppear(from)) return
    hasRunOnAppear = true
    await run(from)
  }

  // 启动立即执行
  return <VStack
    onAppear={() => { runOnAppear(from) }}
    toast={{
      isPresented: showToast,
      message: toastMsg.value,
      position: "center",
      duration: 5
    }}
  >
    <HStack
      padding={{ horizontal: 0 }}
      frame={{ height: 35 * tasks.value.length }}
    >
      <VStack alignment={"leading"} >
        {tasks.value.map(task => (
          <HStack key={task.id} alignment="center">
            {<Image
              systemName={statusStyles[task.status].systemName}
              frame={{ width: 30, height: 30 }}
              foregroundStyle={statusStyles[task.status].foregroundStyle}
              contentTransition="symbolEffectAutomatic"
              animation={{
                animation: animate,
                value: task.status
              }}
            />}
            {<Text
              foregroundStyle={statusStyles[task.status].foregroundStyle}
              animation={{
                animation: animate,
                value: task.status
              }}
            >
              {task.title + (task.status === "running" ? "..." : "")}
            </Text>}
          </HStack>
        ))}
      </VStack>
      <Spacer />
      <Image
        clipShape={{
          type: "rect",
          cornerRadius: 5,
          style: "continuous"
        }}
        image={photo.value}
        resizable={true}
        scaleToFit={true}
        frame={{ maxWidth: 80 }}
        onTapGesture={() => {
          Navigation.present({
            element: <PhotoView photo={photo.value} />
          })
        }}
      />
    </HStack>
    <HStack
      padding={{ top: 10 }}
    >
      <Button
        frame={{ maxWidth: "infinity" }}
        title={"最新"}
        systemImage={isLatestRunning.value ? "hourglass" : "photo"}
        buttonStyle={"bordered"}
        buttonBorderShape={"capsule"}
        foregroundStyle={getSetting("systemColor")}
        controlSize={"large"}
        action={() => run("latest")}
        disabled={isLatestRunning.value || isPickRunning.value}
        tint={getSetting("systemColor")}
        fontWeight={"semibold"}
        font={"subheadline"}
      />
      <Button
        frame={{ maxWidth: "infinity" }}
        title={"挑选"}
        systemImage={isPickRunning.value ? "hourglass" : "photo.on.rectangle"}
        buttonStyle={"bordered"}
        buttonBorderShape={"capsule"}
        foregroundStyle={getSetting("systemColor")}
        controlSize={"large"}
        action={() => run("pick")}
        disabled={isLatestRunning.value || isPickRunning.value}
        tint={getSetting("systemColor")}
        fontWeight={"semibold"}
        font={"subheadline"}
      />
    </HStack>
  </VStack>
}