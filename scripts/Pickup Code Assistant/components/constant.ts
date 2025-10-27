import { Font, FontWeight, ShapeStyle, DynamicShapeStyle, Script } from "scripting"

/* Info Page */
export const headerStyle: {
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

export const scriptName = Script.metadata.localizedNames?.en || Script.metadata.localizedName
export const infoRunFooter = `如执行失败请在设置页开启 Debug 模式，根据日志信息进行分析排查`
export const infoInstrucion = `
### 介绍
我们在线下点餐的时候常常需要凭取餐码取餐，但是这些码嵌得很深，比如各家的点餐小程序，需要频繁切换来查看取餐码，十分繁琐。
相似的场景还可能包括线下排队取号、取快递等。

所以这个脚本使用大模型来充当【**取码器小助手**】，通过截图或照片来解析取餐信息，再通过【**实时活动**】常驻来展示取餐码，方便随时查看。

### 使用步骤
#### 前序准备
❶ 确保拥有 Pro 付费功能并在「智能助手」完成相关 API 设置  
❷ 脚本提供了默认 Prompt，如需优化请在设置页进行修改

#### 脚本执行
❶ 截图或拍照包含取餐码的图片  
❷ 运行脚本获取图片并执行  
❸ 执行成功后返回主页查看实时活动  
❹ 可以关闭脚本但建议保持应用后台常驻  
❺ 如执行失败请打开日志进行排查  

### 使用说明
#### 执行入口
❶ 联动 [Run Pickup Code](https://www.icloud.com/shortcuts/71ee7994d9d14293932a0c9fc7942494) 配套 Shortcuts 全自动截屏并跳转执行 ⭐️  
❷ 也可以在控制中心设置为启动按钮，手动截图，点击快速跳转执行  
❸ 更可以手动启动 App 执行  

#### 实时活动管理
实时活动可以通过以下方式关闭：  
❶ 实时活动界面配置了完成按钮，点击后即可关闭活动 ⭐️  
❷ 系统也提供直接在锁屏界面左滑进行关闭，操作没那么便捷   

由于系统限制方式❶依赖应用后台常驻，因此建议执行完成后不要退出主应用。
如果意外退出了应用后台，实时活动按钮可能会失效，此时需要通过方式❷进行关闭。

### 更多
更多详细的使用说明和相关问题，请前往 [Github](https://github.com/ryanfwy/scripting/tree/master?tab=readme-ov-file#pickup-code-assistant) 查看。
`
export const settingPromptFooter = "如需要请自行修改 Prompt 以优化个别场景的取码效果"
export const settingDebugFooter = "需要时开启 Debug 模式记录日志信息，主应用执行可以前往「控制台」查看，小组件等执行入口需要前往「存储管理器」查看"