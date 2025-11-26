import { LiveActivity, Path } from "scripting"

const keyIds = "activity.ids"
const keyImgs = "activity.imgs"

/* Activity */

export function getAllActivitys() {
  return Storage.get<Record<string, any>[]>(keyIds)
}

export function getActivityWithTs(timestamp: number) {
  const data = getAllActivitys()
  for (const d of data ?? []) {
    if (d.timestamp === timestamp) {
      return d
    }
  }
}

export function getActityState(activityId: string) {
  return LiveActivity.getActivityState(activityId)
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
    Storage.set(keyIds, [{ activityId, timestamp, content }])
  } else {
    data.push({ activityId, timestamp, content })
    Storage.set(keyIds, data)
  }
}

export function removeActivityWithTs(timestamp: number) {
  const data = getAllActivitys()
  if (data) {
    const newData = data.filter(d => d.timestamp !== timestamp)
    Storage.set(keyIds, newData)
  }
}

export function removeActivityWithId(activityId: string) {
  const data = getAllActivitys()
  if (data) {
    const newData = data.filter(d => d.activityId !== activityId)
    Storage.set(keyIds, newData)
  }
}

export async function removeActivityInactive() {
  const activityIds = await LiveActivity.getAllActivitiesIds()
  if (activityIds == null || activityIds.length === 0) {
    Storage.set(keyIds, [])
    return
  }

  const data = getAllActivitys()
  if (data == null || data.length === 0) return
  const newData = data.filter(d => activityIds.includes(d.activityId))
  Storage.set(keyIds, newData)
}


/* Thumbnail */

function resizeThumbnail(
  image: UIImage,
  maxWidth: number = 100,
  maxHeight: number = 100
) {
  let newWidth = image.width
  let newHeight = image.height
  if (image.width > image.height) {
    newWidth = maxWidth
    newHeight = (image.height / image.width) * maxWidth
  } else {
    newHeight = maxHeight
    newWidth = (image.width / image.height) * maxHeight
  }

  return image.renderedIn({
    width: newWidth,
    height: newHeight
  })
}

export function genThumbnailPath(timestamp: number) {
  const prefix = "pickup-code-activity"
  const fileOrigin = `${prefix}-${timestamp}.jpeg`
  const fileResized = `${prefix}-${timestamp}-resized.jpeg`
  const dir = FileManager.appGroupDocumentsDirectory
  return {
    pathOrigin: Path.join(dir, fileOrigin),
    pathResized: Path.join(dir, fileResized)
  }
}

export async function saveThumbnail(timestamp: number, photo: UIImage) {
  const photoData = photo.toJPEGData(0.001) as Data
  const { pathOrigin, pathResized } = genThumbnailPath(timestamp)
  await FileManager.writeAsData(pathOrigin, photoData)
  const photoDataResized = resizeThumbnail(photo)?.toJPEGData(0.001) as Data
  await FileManager.writeAsData(pathResized, photoDataResized)

  const imgIds = Storage.get<number[]>(keyImgs) || []
  imgIds.push(timestamp)
  Storage.set(keyImgs, imgIds)
}

export async function removeThumbnailInactive() {
  const imgIds = Storage.get<number[]>(keyImgs) || []
  const data = getAllActivitys()?.map(d => d.timestamp)
  const newImgs = imgIds.filter(id => {
    const has = data?.includes(id)
    if (!has) {
      const { pathOrigin, pathResized } = genThumbnailPath(id)
      FileManager.removeSync(pathOrigin)
      FileManager.removeSync(pathResized)
    }
    return has
  })
  Storage.set(keyImgs, newImgs)
}

export async function removeThumbnailWithTs(timestamp: number) {
  const { pathOrigin, pathResized } = genThumbnailPath(timestamp)
  FileManager.remove(pathOrigin)
  FileManager.remove(pathResized)

  const imgIds = Storage.get<number[]>(keyImgs)
  if (imgIds) {
    const newImgs = imgIds.filter(id => id !== timestamp)
    Storage.set(keyImgs, newImgs)
  }
}

/* History */

export async function clearHistoryInactive() {
  await removeActivityInactive()
  await removeThumbnailInactive()
}

export async function clearHistoryFully() {
  const dir = FileManager.appGroupDocumentsDirectory
  const files = FileManager.readDirectorySync(dir)
  const filesThumb = files.filter(f => f.match(/^pickup-code-activity-.+\.jpeg$/))
  // console.log(filesThumb)
  for (const file of filesThumb) {
    FileManager.removeSync(Path.join(dir, file))
  }
  Storage.set(keyIds, [])
  Storage.set(keyImgs, [])
}