import { LiveActivity, LiveActivityUIBuilder, LiveActivityUI, LiveActivityUIExpandedCenter } from "scripting"
import { saveActivity, getActivityWithTs, removeActivityWithTs, removeThumbnailWithTs } from "./components/storage"
import { LargeActivityView, MiniActivityViewLeading, MiniActivityViewTrailing } from "./views/activity_view"
import { debugWithStorage } from "./helper/debug"

const activityName = "PickupCodeAssistantActivity"
export type State = {
  content: Record<string, any>,
  timestamp: number
}

function buildActivity() {
  const builder: LiveActivityUIBuilder<State> = (state: State) => {
    return <LiveActivityUI
      content={
        <LargeActivityView
          content={state.content}
          timestamp={state.timestamp} 
        />
      }
      compactLeading={
        <MiniActivityViewLeading />
      }
      compactTrailing={
        <MiniActivityViewTrailing
          code={state.content.code}
        />
      }
      minimal={
        <MiniActivityViewLeading />
      }
    >
      <LiveActivityUIExpandedCenter>
        <LargeActivityView
          content={state.content}
          timestamp={state.timestamp} 
          isPadding={false}
        />
      </LiveActivityUIExpandedCenter>
    </LiveActivityUI>
  }
  return builder
}

const PickupCodeActivity = LiveActivity.register(activityName, buildActivity())

export class ActivityBuilder {
  /* 静态方法 */
  static async endActivityWithTs(timestamp: number) {
    const data = getActivityWithTs(timestamp)
    if (data == null) return

    const activity = await LiveActivity.from(
      data.activityId,
      activityName
    )

    if (activity == null) {
      removeActivityWithTs(timestamp)
      removeThumbnailWithTs(timestamp)
      return
    }
    try {
      activity.end(
        {},
        { dismissTimeInterval: 0 }
      )
      removeActivityWithTs(timestamp)
      removeThumbnailWithTs(timestamp)
    }
    catch (e) {
      debugWithStorage("endActivityWithTs: " + String(e))
    }
  }

  /* 实例方法 */
  // 生成时间戳传递intent
  timestamp: number
  activity: LiveActivity<State>

  constructor(
    timestamp?: number
  ) {
    this.timestamp = timestamp || Date.now()
    this.activity = PickupCodeActivity()
  }

  async startActivity(content: Record<string, any>) {
    let status = false
    if (this.activity == null) return status
    status = await this.activity.start({
      content,
      timestamp: this.timestamp
    }, {
      relevanceScore: Date.now()
    })
    if (status === false) {
      throw("startActivity: status false")
    }
    // save activity
    const timestamp = this.timestamp
    const activityId = this.activity.activityId
    if (activityId) {
      saveActivity({
        activityId,
        timestamp,
        content
      })
    }
    return timestamp
  }
}