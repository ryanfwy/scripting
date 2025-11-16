import { getSetting } from "./setting"

function getDayRatio() {
  const today = new Date()
  // cal start
  const start = new Date(today)
  start.setHours(0, 0, 0, 0)
  // cal end
  const end = new Date(today)
  end.setHours(23, 59, 59, 999)
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}

function getWeekRatio() {
  const today = new Date()
  const week = today.getDay() || 7 // 周一为1，周日为7
  const daysToStart = week - 1
  const daysToEnd = 7 - week
  // cal start
  const start = new Date(today)
  start.setDate(today.getDate() - daysToStart)
  start.setHours(0, 0, 0, 0)
  // cal end
  const end = new Date(today)
  end.setDate(today.getDate() + daysToEnd)
  end.setHours(23, 59, 59, 999)
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}

function getMonthRatio() {
  const today = new Date()
  const month = today.getMonth()
  // cal start
  const start = new Date(today)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  // cal end
  const end = new Date(today)
  end.setMonth(month + 1)
  end.setDate(0)
  end.setHours(23, 59, 59, 999)
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}

function getYearRatio() {
  const today = new Date()
  const year = today.getFullYear()
  // cal start
  const start = new Date(today)
  start.setMonth(0)
  start.setDate(1)
  start.setHours(0, 0, 0, 0)
  // cal end
  const end = new Date(today)
  end.setFullYear(year + 1)
  end.setMonth(0)
  end.setDate(0)
  end.setHours(23, 59, 59, 999)
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}


function getBirthRatio() {
  const birthdayTs = getSetting("birthdayTs")
  const today = new Date()
  const year = new Date().getFullYear()
  // cal start
  const start = new Date(birthdayTs)
  start.setFullYear(year)
  const isBirthdayEnds = today.getTime() > start.getTime()
  if (!isBirthdayEnds) {
    start.setFullYear(year - 1)
  }
  // cal end
  const end = new Date(birthdayTs)
  if (isBirthdayEnds) {
    end.setFullYear(year + 1)
  } else {
    end.setFullYear(year)
  }
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}

function getRetireRatio() {
  const birthdayTs = getSetting("birthdayTs")
  const retireAge = getSetting("retireAge")
  const today = new Date()
  // cal start
  const start = new Date(birthdayTs)
  // cal end
  const end = new Date(birthdayTs)
  end.setFullYear(start.getFullYear() + retireAge)
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}

function getCustomRatio() {
  const customStartTs = getSetting("customStartTs")
  const customEndTs = getSetting("customEndTs")
  const today = new Date()
  // cal start
  const start = new Date(customStartTs)
  // cal end
  const end = new Date(customEndTs)
  // console.log("start", start.toLocaleString())
  // console.log("end", end.toLocaleString())
  // cal ratio
  return (today.getTime() - start.getTime()) / (end.getTime() - start.getTime()) * 100
}

export {
  getDayRatio,
  getWeekRatio,
  getMonthRatio,
  getYearRatio,
  getBirthRatio,
  getRetireRatio,
  getCustomRatio,
}