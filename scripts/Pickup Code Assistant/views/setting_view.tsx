import { Button, NavigationStack, Text, List, Section, TextField, Toggle, Picker, ColorPicker, useObservable, HStack, useContext } from "scripting"
import { headerStyle, settingModelFooter, settingPromptFooter, settingDebugFooter } from "../components/constant"
import { clearHistoryFully, clearHistoryInactive } from "../components/storage"
import { RunContext, updateActivityValue } from "../components/main"
import { getSetting, saveSetting } from "../components/setting"
import { removeDebugStorage } from "../helper/debug"
import { haptic } from "../helper/haptic"

export function SettingView() {
  const isRunWhenStarted = useObservable<boolean>(getSetting("isRunWhenStarted"))
  const runType = useObservable<string>(getSetting("runType"))
  const systemColor = useObservable<any>(getSetting("systemColor"))
  const isModelDefault = useObservable<boolean>(getSetting("isModelDefault"))
  const modelProvider = useObservable<any>(getSetting("modelProvider"))
  const modelID = useObservable<string>(getSetting("modelId"))
  const modelCheck = useObservable<boolean>(true)
  const modelPrompt = useObservable<string>(getSetting("modelPrompt"))
  const isDebug = useObservable<boolean>(getSetting("isDebug"))
  const showToast = useObservable<boolean>(false)
  const toastMsg = useObservable<string>("")

  // activitys: context as history list setter
  const { activitys } = useContext(RunContext)

  const colorOptions = [
    { tag: "systemPink", text: "systemPink" },
    { tag: "systemRed", text: "systemRed" },
    { tag: "systemBlue", text: "systemBlue" },
    { tag: "systemYellow", text: "systemYellow" },
    { tag: "systemOrange", text: "systemOrange" },
    { tag: "systemPurple", text: "systemPurple" },
    { tag: "systemBrown", text: "systemBrown" },
    { tag: "systemCyan", text: "systemCyan" },
    { tag: "systemGreen", text: "systemGreen" },
    { tag: "systemIndigo", text: "systemIndigo" },
    { tag: "systemMint", text: "systemMint" },
    { tag: "systemTeal", text: "systemTeal" },
    { tag: "custom", text: "自定义" },
  ]

  const runTypeOptions = [
    { tag: "latest", text: "最新照片" },
    { tag: "pick", text: "相册挑选" }
  ]

  const modelProviderOptions = [
    { tag: "openai", text: "OpenAI" },
    { tag: "gemini", text: "Google Gemini" },
    { tag: "deepseek", text: "DeepSeek" },
    { tag: "anthropic", text: "Anthropic" }
  ]

  function updateIsDebug(value: boolean) {
    saveSetting("isDebug", value)
    isDebug.setValue(value)
    if (value === false) {
      // 清除历史日志
      removeDebugStorage()
    }
  }

  function updateIsRunWhenStarted(value: boolean) {
    saveSetting("isRunWhenStarted", value)
    isRunWhenStarted.setValue(value)
  }

  function updateRunType(value: string) {
    saveSetting("runType", value)
    runType.setValue(value)
    haptic("select")
  }

  function updateSystemColor(value: string) {
    if (value === "custom") value = "rgba(0, 0, 0, 1.00)"
    systemColor.setValue(value)
    saveSetting("systemColor", value)
    haptic("select")
  }

  function updateModelDefault(value: boolean) {
    isModelDefault.setValue(value)
    saveSetting("isModelDefault", value)
  }

  function updateModelProvider(value: string) {
    modelProvider.setValue(value)
    saveSetting("modelProvider", value)
  }

  function updateModelId(value: string) {
    modelID.setValue(value)
    saveSetting("modelId", value)
  }

  async function checkModelAvailable() {
    const schema: JSONSchemaObject = {
      type: "object",
      properties: {
        text: {
          type: "string",
          required: true,
          description: ""
        }
      },
      description: ""
    }
    modelCheck.setValue(false)
    const options = !isModelDefault.value ? {
      provider: modelProvider.value,
      modelId: modelID.value
    } : undefined
    let message = ""
    try {
      const resp = await Assistant.requestStructuredData(
        "请返回「检查成功！」并随机附上一段很美的句子",
        schema,
        options
      ) as Record<string, string>
      message = resp?.text
    }
    catch (e) {
      message = String(e)
    }
    toastMsg.setValue(message)
    showToast.setValue(true)
    modelCheck.setValue(true)
    haptic("select")
  }

  function updateModelPrompt() {
    const value = modelPrompt.value
    saveSetting("modelPrompt", value)
    toastMsg.setValue("已完成")
    showToast.setValue(true)
    haptic("select")
  }

  function resetModelPrompt() {
    saveSetting("modelPrompt", null)
    const value = getSetting("modelPrompt")
    modelPrompt.setValue(value)
    toastMsg.setValue("已完成")
    showToast.setValue(true)
    haptic("select")
  }

  async function clearHistoryLight() {
    await clearHistoryInactive()
    updateActivityValue(activitys)
    toastMsg.setValue("已清除")
    showToast.setValue(true)
    haptic("select")
  }

  async function clearHistoryDeep() {
    await clearHistoryFully()
    updateActivityValue(activitys)
    toastMsg.setValue("已清除")
    showToast.setValue(true)
    haptic("select")
  }

  return <NavigationStack
    toast={{
      isPresented: showToast,
      message: toastMsg.value,
      position: "center",
    }}
  >
    <List
      navigationTitle={"Settings"}
      navigationBarTitleDisplayMode={"inline"}
      scrollDismissesKeyboard={"immediately"}
    >
      <Section
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"通用配置"}
          </Text>
        }
      >
        <Toggle
          value={isRunWhenStarted.value}
          onChanged={updateIsRunWhenStarted}
          title={"启动后立即执行"}
          tint={systemColor.value}
        />
        {isRunWhenStarted.value && (
          <Picker
            value={runType.value}
            onChanged={updateRunType}
            pickerStyle={"menu"}
            title={"默认执行方式"}
            tint={systemColor.value}
          >
            {runTypeOptions.map(type => (
              <Text tag={type.tag}>
                {type.text}
              </Text>
            ))}
          </Picker>)}
        <Picker
          value={systemColor.value}
          onChanged={updateSystemColor}
          pickerStyle={"menu"}
          title={"主题色"}
          tint={systemColor.value}
        >
          {colorOptions.map(color => (
            <Text tag={color.tag}>
              {color.text}
            </Text>
          ))}
        </Picker>
        {systemColor.value.includes("rgb") && (
          <ColorPicker
            title="自定义"
            value={systemColor.value}
            onChanged={updateSystemColor}
            supportsOpacity={false}
          />
        )}
      </Section>
      <Section
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"模型配置"}
          </Text>
        }
        footer={
          <Text>
            {settingModelFooter}
          </Text>
        }
      >
        <Toggle
          value={isModelDefault.value}
          onChanged={updateModelDefault}
          title={"使用 App 默认设置"}
          tint={systemColor.value}
        />
        {!isModelDefault.value && (
          <Picker
            value={modelProvider.value}
            onChanged={updateModelProvider}
            pickerStyle={"menu"}
            title={"提供商"}
            tint={systemColor.value}
          >
            {modelProviderOptions.map(opt => (
              <Text tag={opt.tag}>
                {opt.text}
              </Text>
            ))}
          </Picker>
        )}
        {!isModelDefault.value && (
          <HStack>
            <Text>{"模型"}</Text>
            <TextField
              multilineTextAlignment={"trailing"}
              title={"如 gemini-2.0-flash"}
              value={modelID.value}
              onChanged={updateModelId}
            />
          </HStack>
        )}
        <Button
          title={"检查模型可用性"}
          tint={systemColor.value}
          disabled={!modelCheck.value}
          action={checkModelAvailable}
        />
      </Section>
      <Section
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"Prompt 提示词"}
          </Text>
        }
        footer={
          <Text>
            {settingPromptFooter}
          </Text>
        }
      >
        <TextField
          title={"Prompt"}
          value={modelPrompt.value}
          onChanged={val => { modelPrompt.setValue(val) }}
          axis={"vertical"}
          lineLimit={{ min: 8, max: 50 }}
        />
        <Button
          title={"确认修改"}
          tint={systemColor.value}
          action={updateModelPrompt}
        />
        <Button
          title={"恢复默认"}
          tint={systemColor.value}
          action={resetModelPrompt}
        />
      </Section>
      <Section
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"调试"}
          </Text>
        }
        footer={
          <Text>
            {settingDebugFooter}
          </Text>
        }
      >
        <Toggle
          value={isDebug.value}
          onChanged={updateIsDebug}
          title={"开启 Debug"}
          tint={systemColor.value}
        />
        <Button
          title={"清除不活跃缓存"}
          tint={systemColor.value}
          action={clearHistoryLight}
        />
        <Button
          title={"清除所有历史缓存"}
          tint={systemColor.value}
          action={clearHistoryDeep}
        />
      </Section>
    </List>
  </NavigationStack>
}