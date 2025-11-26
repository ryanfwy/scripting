import { Font, FontWeight, ShapeStyle, DynamicShapeStyle, Script } from "scripting"

/* Info Page */
const headerStyle: {
  font: Font,
  fontWeight: FontWeight,
  foregroundStyle: ShapeStyle | DynamicShapeStyle
} = {
  font: "body",
  fontWeight: "semibold",
  foregroundStyle: {
    light: "black",
    dark: "white"
  }
}

const scriptName = Script.metadata.localizedNames?.en || Script.metadata.localizedName
const infoRunFooter = `如执行失败请在设置页开启 Debug 模式，根据日志信息进行分析排查`
const infoHistoryFooter = `• 历史记录可用于延迟提醒重新上岛，如果需要保留历史记录，请通过锁屏界面左滑关闭实时活动，若点击完成按钮将会清除相应记录和缓存
• 点击进行图片预览，长按可以执行重新上岛等操作`
const infoInstrucionMain = `
我们在线下点餐的时候常常需要凭取餐码取餐，但是这些码嵌得很深，比如各家的点餐小程序，需要频繁切换来查看取餐码，十分繁琐。
相似的场景还可能包括线下排队取号、取快递等。

所以这个脚本使用大模型来充当【**取码器小助手**】，通过截图或照片来解析取餐信息，再通过【**实时活动**】常驻来展示取餐码，方便随时查看。

更多详细的使用说明和相关问题，请前往 [Github](https://github.com/ryanfwy/scripting/tree/master?tab=readme-ov-file#pickup-code-assistant) 查看。`
const infoInstructionStep = `
#### 前序准备
❶ 确保拥有 Pro 付费功能并在「智能助手」完成相关 API 设置，建议模型性能不低于 gemini-2.0-flash  
❷ 脚本提供了默认 Prompt，特殊场景如需优化请在设置页进行修改

#### 脚本执行
❶ 截图或拍照包含取码的图片  
❷ 运行脚本获取图片并执行  
❸ 执行成功后返回主页查看实时活动  
❹ 如执行失败请打开日志进行排查`
const infoInstructionUsage = `
#### 执行入口
❶ 联动 Shortcuts 全自动截屏并执行 [后台版](https://www.icloud.com/shortcuts/10c0a273b7db46c2800d6377f7cf9fbe) or [前台版](https://www.icloud.com/shortcuts/83029b5e256449d5a7ff6dac27d97fb4) ⭐️  
❷ 也可以在控制中心设置脚本为启动按钮，手动截图，点击快速跳转执行  
❸ 更可以手动启动 App 执行  

#### 实时活动管理  
❶ 【完成提醒】点击界面配置的完成按钮进行关闭，历史记录将一并清除，App 内不再保留  
❷ 【延迟提醒】实时活动左滑进行关闭，历史记录将会保留，App 内可以重新管理和上岛`
const settingModelFooter = "「使用 App 默认设置」将使用当前 App 选定的提供商和模型。如有特殊需要可手工输入，务必先在「智能助手」中完成相应 API 设置"
const settingPromptFooter = "如需要请自行修改 Prompt 以优化个别场景的取码效果"
const settingDebugFooter = "需要时开启 Debug 模式记录日志信息，主应用执行可以前往「控制台」查看，Shortcuts 等后台执行入口需要前往「存储管理器」查看"

export {
  headerStyle,
  scriptName,
  infoRunFooter,
  infoHistoryFooter,
  infoInstrucionMain,
  infoInstructionStep,
  infoInstructionUsage,
  settingModelFooter,
  settingPromptFooter,
  settingDebugFooter,
}