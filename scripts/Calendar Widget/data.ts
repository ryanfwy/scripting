const expireTime = 300 * 1000
const pagingSize = 14
const storageKey = "widget.state.data"

function storageReadOffset() {
  let state = Storage.get<Record<string, any>>(storageKey)
  const currTimestamp = Date.now()
  let offset = 0
  let timestamp = 0
  if (state) {
    offset = state.offset
    timestamp = state.timestamp
  }
  if (currTimestamp - timestamp > expireTime) {
    offset = 0
  }
  return offset
}

function storageSaveOffset({
  offset
}: {
  offset: number
}) {
  Storage.set(storageKey, {
    offset: offset,
    timestamp: Date.now()
  })
}

function parseDate(now: Date) {
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()
  const day = now.getDay()
  return { year, month, date, day }
}

function calDate({
  offset
}: {
  offset: number
}) {
  let now = new Date()
  if (offset !== 0) {
    now.setDate(now.getDate() + offset)
  }
  const { year, month, date, day } = parseDate(now)
  const dates = []
  let start = -(day + 7)
  let end = (7 - day) + 7
  for (start; start < end; start++) {
    const tmp = new Date(year, month, date)
    tmp.setDate(date + start)
    // console.log(tmp)
    dates.push(tmp.getDate())
  }
  // console.log(dates)
  return { year, month, date, day, dates }
}

export function fetchData({
  type
}: {
  type?: string
}) {
  let offset = storageReadOffset()
  if (!type) {
    return calDate({ offset })
  }

  if (type === "up") {
    offset += -pagingSize
  }
  if (type === "down") {
    offset += pagingSize
  }
  if (type === "back") {
    offset = 0
  }
  storageSaveOffset({ offset })
  return calDate({ offset })
}

export function isShowCurrent() {
  const offset = storageReadOffset()
  return offset !== 0 ? false : true
}