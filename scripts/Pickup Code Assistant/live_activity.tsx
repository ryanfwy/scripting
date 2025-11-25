import { LiveActivity, LiveActivityUIBuilder, LiveActivityUI, LiveActivityUIExpandedCenter } from "scripting"
import { saveActivity, getActivityWithTimestamp, removeActivityWithTimestamp, removeThumbnailWithTimestamp } from "./components/storage"
import { LargeActivityView, MiniActivityViewLeading, MiniActivityViewTrailing } from "./views/activity_view"
import { debugWithStorage } from "./helper/debug"

const activityName = "PickupCodeAssistantActivity"
export type State = {
  code: string,
  seller: string,
  timestamp: number
}

function buildActivity() {
  const builder: LiveActivityUIBuilder<State> = (state: State) => {
    return <LiveActivityUI
      content={
        <LargeActivityView
          code={state.code}
          seller={state.seller}
          timestamp={state.timestamp} 
        />
      }
      compactLeading={
        <MiniActivityViewLeading />
      }
      compactTrailing={
        <MiniActivityViewTrailing code={state.code} />
      }
      minimal={
        <MiniActivityViewLeading />
      }
    >
      <LiveActivityUIExpandedCenter>
        <LargeActivityView
          code={state.code}
          seller={state.seller}
          timestamp={state.timestamp} 
          isPadding={false}
        />
      </LiveActivityUIExpandedCenter>
    </LiveActivityUI>
  }
  return builder
}

const PickupCodeAssistantActivity = LiveActivity.register(activityName, buildActivity())

export class ActivityBuilder {
  /* 静态方法 */
  static async endActivityWithTimestamp(timestamp: number) {
    const data = getActivityWithTimestamp(timestamp)
    if (data == null) return

    const activity = await LiveActivity.from(
      data.activityId,
      activityName
    )

    if (activity == null) return
    try {
      activity.end(
        {},
        { dismissTimeInterval: 0 }
      )
      removeActivityWithTimestamp(timestamp)
      removeThumbnailWithTimestamp(timestamp)
    }
    catch (e) {
      debugWithStorage("endActivityWithTimestamp: " + String(e))
    }
  }

  /* 实例方法 */
  // 生成时间戳传递intent
  timestamp: number
  activity: LiveActivity<State>

  constructor() {
    this.timestamp = Date.now()
    this.activity = PickupCodeAssistantActivity()
  }

  async startActivity({
    code,
    seller
  }: {
    code: string,
    seller: string
  }) {
    let status = false
    if (this.activity == null) return status
    status = await this.activity.start({
      code, seller,
      timestamp: this.timestamp
    }, {
      relevanceScore: this.timestamp
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
        content: { code, seller }
      })
    }
    return timestamp
  }
}