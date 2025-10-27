import { LiveActivity } from "scripting"

const storageKeyIds = "activity.ids"

export function getAllActivitys() {
    return Storage.get<Record<string, any>[]>(storageKeyIds)
}

export function getActivityWithTimestamp(timestamp: number) {
    const data = getAllActivitys()
    for (const d of data ?? []) {
        if (d.timestamp === timestamp) {
            return d
        }
    }
}

export function saveActivity({
    activityId,
    timestamp,
    content
}: {
    activityId: string,
    timestamp: number,
    content: Record<string, any>
}) {
    const data = getAllActivitys()
    if (data == null || data.length === 0) {
        Storage.set(storageKeyIds, [{ activityId, timestamp, content }])
    } else {
        data.push({ activityId, timestamp, content })
        Storage.set(storageKeyIds, data)
    }
}

export function removeActivityWithTimestamp(timestamp: number) {
    const data = getAllActivitys()
    if (data) {
        const newData = data.filter(d => d.timestamp !== timestamp)
        Storage.set(storageKeyIds, newData)
    }
}

export async function remoteActivityInactive() {
    const activityIdsSystem = await LiveActivity.getAllActivitiesIds()
    if(activityIdsSystem == null || activityIdsSystem.length === 0) {
        Storage.set(storageKeyIds, [])
        return
    }

    const data = getAllActivitys()
    if (data == null || data.length === 0) return
    const newData = data.filter(d => activityIdsSystem.includes(d.activityId))
    Storage.set(storageKeyIds, newData)
}