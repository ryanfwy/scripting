import { Button, NavigationStack, Text, List, Section, TextField, useState, Toggle, Picker, ColorPicker, HStack } from "scripting"
import { headerStyle, settingPromptFooter, settingDebugFooter } from "../components/constant"
import { getSetting, saveSetting } from "../components/setting"
import { removeDebugStorage } from "../helper/debug"
import { haptic } from "../helper/haptic"

export function SettingView() {
  const [isDebugEnabled, setIsDebugEnabled] = useState(getSetting("isDebug"))
  const [isRunWhenStartedEnabled, setIsRunWhenStartedEnabled] = useState(getSetting("isRunWhenStarted"))
  const [runTypeValue, setRunTypeValue] = useState(getSetting("runType"))
  const [systemColorValue, setSystemColorValue] = useState<any>(getSetting("systemColor"))
  const [modelPromptValue, setModelPromptValue] = useState<string>(getSetting("modelPrompt"))
  const [showToast, setShowToast] = useState<boolean>(false)

  const colorOptions = [
    { tag: "systemGray", text: "systemGray" },
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

  function updateIsDebug(value: boolean) {
    saveSetting("isDebug", value)
    setIsDebugEnabled(value)
    if (value === false) {
      // 清除历史日志
      removeDebugStorage()
    }
  }

  function updateIsRunWhenStarted(value: boolean) {
    saveSetting("isRunWhenStarted", value)
    setIsRunWhenStartedEnabled(value)
  }

  function updateRunType(value: string) {
    saveSetting("runType", value)
    setRunTypeValue(value)
    haptic("select")
  }

  function updateSystemColor(value: string) {
    setSystemColorValue(value)
    if (value && value !== "custom") {
      saveSetting("systemColor", value)
      haptic("select")
    }
  }

  function updateModelPrompt(value: string) {
    saveSetting("modelPrompt", value)
    setModelPromptValue(value)
    setShowToast(true)
    haptic("select")
  }

  function resetModelPrompt() {
    saveSetting("modelPrompt", null)
    const value = getSetting("modelPrompt")
    setModelPromptValue(value)
    setShowToast(true)
    haptic("select")
  }

  return <NavigationStack>
    <List
      navigationTitle={"Settings"}
      navigationBarTitleDisplayMode={"automatic"}
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
          value={isRunWhenStartedEnabled}
          onChanged={newValue => updateIsRunWhenStarted(newValue)}
          title={"启动后立即执行"}
          tint={systemColorValue}
        />
        {isRunWhenStartedEnabled ? (
          <Picker
            value={runTypeValue}
            onChanged={(newValue: string) => updateRunType(newValue)}
            pickerStyle={"menu"}
            title={"默认执行方式"}
            tint={systemColorValue}
          >
            {runTypeOptions.map(type => (
              <Text tag={type.tag}>{type.text}</Text>
            ))}
          </Picker>) : null}
        <Picker
          value={systemColorValue}
          onChanged={(newValue: string) => updateSystemColor(newValue)}
          pickerStyle={"menu"}
          title={"主题色"}
          tint={systemColorValue}
        >
          {colorOptions.map(color => (
            <Text tag={color.tag}>{color.text}</Text>
          ))}
        </Picker>
        {systemColorValue === 'custom' || systemColorValue.includes("rgb") ? (
          <ColorPicker
            title="自定义"
            value={systemColorValue.includes("rgb") ? systemColorValue : "#000000"}
            onChanged={updateSystemColor}
            supportsOpacity={false}
          />
        ) : null}
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
          value={modelPromptValue}
          onChanged={setModelPromptValue}
          axis={"vertical"}
          lineLimit={{ min: 8, max: 50 }}
          toast={{
            isPresented: showToast,
            onChanged: setShowToast,
            message: "已完成",
            position: "center",
          }}
        />
        <Button
          title={"确认修改"}
          tint={systemColorValue}
          action={() => { updateModelPrompt(modelPromptValue) }}
        />
        <Button
          title={"恢复默认"}
          tint={systemColorValue}
          action={() => { resetModelPrompt() }}
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
          value={isDebugEnabled}
          onChanged={newValue => updateIsDebug(newValue)}
          title={"开启 Debug"}
          tint={systemColorValue}
        />
      </Section>
    </List>
  </NavigationStack>
}