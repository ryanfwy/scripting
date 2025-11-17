const storageKey = "widget.settings"

// const
const footerZen = "禅模式帮助你赛博静心，开启新的人生进程。「禅定次数」指每轮敲木鱼进入禅定状态的次数，「贤者时间」指禅定后进入贤者状态的时间。贤者状态下你将可以随意游览人生进程而无惧时间焦虑。如果你真的很急，虽然我劝你先别急，但你还是可以强制关闭"
const footerBirthday = "人生模式根据出生日期游览人生进程，包括距离下一次生日和退休的进度"
const footerCustom = "自定义模式根据自定义时间范围和标签显示进度"

// defaults
const defaults = {
  l10n: "zh",
  isZen: true,
  zenMaxCnt: 999,
  zenRoundMaxCnt: 20,
  zenRoundDurationTs: 30 * 60 * 1000, // 30mins
  isBirthday: false,
  birthdayTs: new Date().getTime(),
  retireAge: 65,
  isCustom: false,
  customLabel: "",
  customStartTs: new Date().getTime(),
  customEndTs: new Date().getTime(),
}

type SettingKeys = keyof typeof defaults

export function getSetting(key: SettingKeys) {
  const data = Storage.get<Record<string, any>>(storageKey) || {}
  // has storage
  if (data[key] != null) return data[key]
  // no storage then use default
  return defaults[key]
}

export function saveSetting(key: SettingKeys, value: any) {
  let data = Storage.get<Record<string, any>>(storageKey) || {}
  data[key] = value
  Storage.set(storageKey, data)
}

export {
  footerZen,
  footerBirthday,
  footerCustom,
}
