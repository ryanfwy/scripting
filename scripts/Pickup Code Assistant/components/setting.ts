import { ShapeStyle, DynamicShapeStyle } from "scripting"

const storageKey = "activity.settings"

const isDebug: boolean = false
const isRunWhenStarted: boolean = false
const runType: "latest" | "pick" = "latest"
const systemColor: ShapeStyle | DynamicShapeStyle = "systemPink"
const isModelDefault: boolean = true
const modelProvider: string = ""
const modelId: string = ""
const modelPrompt: string = `请从内容中精准提取两项关键信息：
1. 取餐或取件码：仅识别纯数字（含前导0，如0135、992）或「1个字母+数字」组合（如A022、B109）或「数字.短句」组合（如8.今日是好日）或「数字+横杠」组合（如1-2-1011）
2. 商家名称：需提取完整商家名称（如 麦当劳、喜茶、星巴克、菜鸟驿站）
3. 商品名称(仅可选)：仅返回实际订单的商品名称、快递地址，其他内容一律禁止返回，禁止返回推荐菜或广告商品等无关信息

以下为待提取内容：
`


const defaults = {
  isDebug,
  isRunWhenStarted,
  runType,
  systemColor,
  isModelDefault,
  modelProvider,
  modelId,
  modelPrompt,
}

export type SettingKey = keyof typeof defaults

export function getSetting(key: SettingKey) {
  const data = Storage.get<Record<string, any>>(storageKey) || {}
  // has storage
  if (data[key] != null) return data[key]
  // no storage then use default
  return defaults[key]
}

export function saveSetting(key: SettingKey, value: any) {
  let data = Storage.get<Record<string, any>>(storageKey) || {}
  data[key] = value
  Storage.set(storageKey, data)
}