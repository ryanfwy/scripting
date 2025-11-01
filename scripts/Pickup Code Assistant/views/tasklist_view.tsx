import { VStack, HStack, Text, Button, Image, Spacer, NavigationStack, Navigation, useContext } from "scripting"
import { shouldRunOnAppear, FromContext } from "../components/main"
import { getSetting } from "../components/setting"
import { useTaskRunner } from "../helper/task_runner"

// 启动立即执行状态，只执行一次
let hasRunOnAppear = false

function PhotoView({
  photo
}: {
  photo: UIImage
}) {
  return <NavigationStack>
    <Image
      image={photo}
      scaleToFit={true}
      resizable={true}
    />
  </NavigationStack>
}

export function TaskList() {
  const from = useContext(FromContext)
  const {
    tasks,
    cfgStatusStyle,
    isLatestRunning,
    isPickRunning,
    photo,
    runTasks
  } = useTaskRunner(from)

  // 启动立即执行
  return <VStack
    onAppear={() => {
      if (!hasRunOnAppear && shouldRunOnAppear(from)) {
        runTasks(from)
        hasRunOnAppear = true
      }
    }}
  >
    <HStack
      padding={{ horizontal: 0 }}
      frame={{ height: 35 * tasks.length }}
    >
      <VStack alignment={"leading"} >
        {tasks.map(task => (
          <HStack key={task.id} alignment="center">
            {<Image
              systemName={cfgStatusStyle[task.status].systemName}
              frame={{ width: 30, height: 30 }}
              foregroundStyle={cfgStatusStyle[task.status].foregroundStyle}
              contentTransition="symbolEffectAutomatic"
            />}
            {<Text
              foregroundStyle={cfgStatusStyle[task.status].foregroundStyle}
              contentTransition="interpolate"
            >
              {task.title + (task.status === "running" ? "..." : "")}
            </Text>}
          </HStack>
        ))}
      </VStack>
      <Spacer />
      <Image
        image={photo}
        resizable={true}
        scaleToFit={true}
        frame={{ maxWidth: 80 }}
        onTapGesture={() => {
          Navigation.present({
            element: <PhotoView photo={photo} />
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
        systemImage={isLatestRunning ? "hourglass" : "photo"}
        buttonStyle={"bordered"}
        buttonBorderShape={"capsule"}
        foregroundStyle={getSetting("systemColor")}
        controlSize={"large"}
        action={() => runTasks("latest")}
        disabled={isLatestRunning || isPickRunning}
        tint={getSetting("systemColor")}
        fontWeight={"semibold"}
        font={"subheadline"}
      />
      <Button
        frame={{ maxWidth: "infinity" }}
        title={"挑选"}
        systemImage={isPickRunning ? "hourglass" : "photo.on.rectangle"}
        buttonStyle={"bordered"}
        buttonBorderShape={"capsule"}
        foregroundStyle={getSetting("systemColor")}
        controlSize={"large"}
        action={() => runTasks("pick")}
        disabled={isLatestRunning || isPickRunning}
        tint={getSetting("systemColor")}
        fontWeight={"semibold"}
        font={"subheadline"}
      />
    </HStack>
  </VStack>
}