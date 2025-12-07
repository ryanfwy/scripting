import { AppEvents, Button, ContentUnavailableView, ForEach, Group, ScenePhase, useContext, useEffect } from "scripting"
import { LargeActivityView } from "./activity_view"
import { ActivityBuilder } from "../live_activity"
import { ActivityDataType, RunContext, updateActivityValue } from "../components/main"
import { getActityState, removeActivityWithId } from "../components/storage"
import { haptic } from "../helper/haptic"

export function HistoryList() {
  // activitys: context as history list setter
  const { activitys } = useContext(RunContext)

  async function actionFlag(activity: Record<string, any>) {
    const timestamp = activity.timestamp
    const activityId = activity.activityId
    // chceck status
    const state = await getActityState(activityId)
    if (state === "active") return
    // start new activity
    const act = new ActivityBuilder(timestamp)
    const resp = await act.startActivity(activity.content)
    if (resp === false) return
    // remove old activity
    removeActivityWithId(activityId)
    // update view
    updateActivityValue(activitys)
    haptic("success")
  }

  async function actionDone(activity: Record<string, any>) {
    await ActivityBuilder.endActivityWithTs(activity.timestamp)
    // update view
    updateActivityValue(activitys)
    haptic("success")
  }

  // init once && inactive -> active
  useEffect(() => {
    updateActivityValue(activitys)
    const listener = (scene: ScenePhase) => {
      if (scene === "active") {
        updateActivityValue(activitys)
      }
    }
    AppEvents.scenePhase.addListener(listener)
    return () => AppEvents.scenePhase.removeListener(listener)
  }, [])

  return <Group>
    {activitys.value && activitys.value.length > 0 ? (
      <ForEach
        data={activitys as Observable<ActivityDataType>}
        builder={(item) => (
          <LargeActivityView
            key={item.id}
            contextMenu={{
              menuItems: <Group>
              <Button
                  systemImage={"checkmark.circle.fill"}
                  title={"完成提醒"}
                  action={() => actionDone(item.activity)}
                />
                {item.state !== "active" &&
                  <Button
                    systemImage={"flag.fill"}
                    title={"重新上岛"}
                    action={() => actionFlag(item.activity)}
                  />
                }
              </Group>
            }}
            transition={Transition.move("trailing").combined(Transition.opacity())}
            content={item.activity.content}
            timestamp={item.activity.timestamp}
            state={item.state}
            isShowInApp={true}
            isPadding={false}
          />
        )}
      />
      ) : (
      <ContentUnavailableView
        title={"暂无记录"}
        systemImage={"tray.fill"}
      />
    )}
  </Group>
}