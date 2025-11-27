import { LiveActivity, LiveActivityUIBuilder, LiveActivityUI, LiveActivityUIExpandedCenter } from "scripting"
import { saveActivity, getActivityWithTs, removeActivityWithTs, removeThumbnailWithTs } from "./components/storage"
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
        content: { code, seller }
      })
    }
    return timestamp
  }
}