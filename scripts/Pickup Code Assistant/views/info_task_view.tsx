import { VStack, HStack, Text, Button, Image, Spacer, NavigationStack, Navigation, useContext, ShapeStyle, DynamicShapeStyle, useObservable, useEffect } from "scripting"
import { shouldRunOnAppear, StartFromType, RunContext, updateActivityValue } from "../components/main"
import { TaskStatus, runTaskWithUI } from "../components/task"
import { getSetting } from "../components/setting"

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
  // activitys: context as history list setter
  const { from, activitys } = useContext(RunContext)
  const { observes, runTasks } = runTaskWithUI(from)
  const { photo, tasks, isLatestRunning, isPickRunning } = observes
  const showToast = useObservable<boolean>(false)
  const toastMsg = useObservable<string>("")

  async function run(from: StartFromType) {
    const resp = await runTasks(from)
    updateActivityValue(activitys)
    if (resp?.status === false) {
      toastMsg.setValue(resp.message)
      showToast.setValue(true)
      return
    }
  }

  // init once
  useEffect(() => {
    if (!shouldRunOnAppear(from)) return
    run(from)
  }, [])

  return <VStack
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