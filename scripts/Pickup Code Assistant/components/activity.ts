import { LiveActivity } from "scripting"
import { saveActivity, getActivityWithTimestamp, removeActivityWithTimestamp } from "../components/storage"
import { LargeActivityView, MiniActivityViewLeading, MiniActivityViewTrailing } from "../views/activity_view"
import { debugWithStorage } from "../helper/debug"

export class ActivityBuilder {
  /* 静态方法 */
  static async endActivityWithTimestamp(timestamp: number) {
    const data = getActivityWithTimestamp(timestamp)
    if (data == null) return

    const activity = await LiveActivity.from(
      data.activityId,
      () => {
        return {
          content: MiniActivityViewLeading(),
          compactLeading: MiniActivityViewLeading(),
          compactTrailing: MiniActivityViewLeading(),
          minimal: MiniActivityViewLeading(),
          expanded: {
            center: MiniActivityViewLeading(),
          }
        }
      }
    )

    if (activity == null) return
    try {
      activity.end(
        {},
        { dismissTimeInterval: 0 }
      )
      removeActivityWithTimestamp(timestamp)
    }
    catch (e) {
      debugWithStorage("endActivityWithTimestamp: " + String(e))
    }
  }

  /* 实例方法 */
  // 生成时间戳传递intent
  timestamp: number
  activity: LiveActivity<any> | undefined

  constructor() {
    this.timestamp = Date.now()
  }

  buildActivity() {
    const timestamp = this.timestamp
    this.activity = new LiveActivity(({
      code,
      seller
    }: {
      code: string,
      seller: string
    }) => {
      return {
        content: LargeActivityView({ code, seller, timestamp }),
        compactLeading: MiniActivityViewLeading(),
        compactTrailing: MiniActivityViewTrailing({ code }),
        minimal: MiniActivityViewLeading(),
        expanded: {
          center: LargeActivityView({ code, seller, timestamp, isPadding: false }),
        }
      }
    })
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
    status = await this.activity.start({ code, seller })
    if (status === false) {
      throw("startActivity: status false")
    }
    // save activity
    const timestamp = this.timestamp
    const activityId = this.activity.activityId
    if (activityId) {
      saveActivity({ activityId, timestamp, content: { code, seller } })
    }
    return status
  }

  async buildAndStartActivity({
    code,
    seller
  }: {
    code: string,
    seller: string
  }) {
    this.buildActivity()
    return await this.startActivity({ code, seller })
  }
}