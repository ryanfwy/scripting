import { NavigationStack, Text, List, Section, Stepper, TextField, Toggle, DatePicker, useObservable, HStack, Spacer, Picker, Markdown } from "scripting"
import { getSetting, saveSetting, footerZen, footerBirthday, footerCustom } from "../components/setting"
import { keyZenTs, infoInstrucion } from "../components/constant"

const l10nOptions = [
  { tag: "zh", text: "Zh (日,月,年...)" },
  { tag: "en", text: "En (Day,Week,Month...)" },
]

export function SettingView() {
  const l10n = useObservable<string>(getSetting("l10n"))
  const isZen = useObservable<boolean>(getSetting("isZen"))
  const zenRoundMaxCnt = useObservable<number>(getSetting("zenRoundMaxCnt"))
  const zenRoundDurationTs = useObservable<number>(getSetting("zenRoundDurationTs") / 1000)
  const isBirthday = useObservable<boolean>(getSetting("isBirthday"))
  const birthdayTs = useObservable<number>(getSetting("birthdayTs"))
  const retireAge = useObservable<number>(getSetting("retireAge"))
  const isCustom = useObservable<boolean>(getSetting("isCustom"))
  const customLabel = useObservable<string>(getSetting("customLabel"))
  const customStartTs = useObservable<number>(getSetting("customStartTs"))
  const customEndTs = useObservable<number>(getSetting("customEndTs"))

  function updateL10n(value: string) {
    l10n.setValue(value)
    saveSetting("l10n", value)
  }

  function updateIsZen(value: boolean) {
    isZen.setValue(value)
    saveSetting("isZen", value)
    // reset
    if (value === false) {
      saveSetting("zenRoundMaxCnt", null)
      saveSetting("zenRoundDurationTs", null)
      Storage.set(keyZenTs, 0) // reset zen ts
      zenRoundMaxCnt.setValue(getSetting("zenRoundMaxCnt"))
      zenRoundDurationTs.setValue(getSetting("zenRoundDurationTs") / 1000)
    }
  }

  function updateZenRoundMaxCnt(type: "inc" | "dec") {
    const step = 5
    let value = zenRoundMaxCnt.value + (type === "inc" ? step : -step)
    value = Math.max(value, step)
    zenRoundMaxCnt.setValue(value)
    saveSetting("zenRoundMaxCnt", value)
  }

  function updateZenRoundDurationTs(value: string) {
    const valueNum = Number(value)
    zenRoundDurationTs.setValue(valueNum)
    saveSetting("zenRoundDurationTs", valueNum * 1000)
  }

  function updateIsBirthday(value: boolean) {
    isBirthday.setValue(value)
    saveSetting("isBirthday", value)
    // reset
    if (value === false) {
      saveSetting("birthdayTs", null)
      saveSetting("retireAge", null)
      birthdayTs.setValue(getSetting("birthdayTs"))
      retireAge.setValue(getSetting("retireAge"))
    }
  }

  function updateBirthdayTs(value: number) {
    birthdayTs.setValue(value)
    saveSetting("birthdayTs", value)
  }

  function updateRetireAge(type: "inc" | "dec") {
    const step = 1
    let value = retireAge.value + (type === "inc" ? step : -step)
    value = Math.max(value, step)
    retireAge.setValue(value)
    saveSetting("retireAge", value)
  }

  function updateIsCustom(value: boolean) {
    isCustom.setValue(value)
    saveSetting("isCustom", value)
    // reset
    if (value === false) {
      saveSetting("customLabel", null)
      saveSetting("customStartTs", null)
      saveSetting("customEndTs", null)
      customLabel.setValue(getSetting("customLabel"))
      customStartTs.setValue(getSetting("customStartTs"))
      customEndTs.setValue(getSetting("customEndTs"))
    }
  }

  function updateCustomLabel(value: string) {
    customLabel.setValue(value)
    saveSetting("customLabel", value)
  }

  function updateCustomStartTs(value: number) {
    customStartTs.setValue(value)
    saveSetting("customStartTs", value)
  }

  function updateCustomEndTs(value: number) {
    customEndTs.setValue(value)
    saveSetting("customEndTs", value)
  }

  return <NavigationStack>
    <List
      navigationTitle={"Settings"}
      navigationBarTitleDisplayMode={"automatic"}
      scrollDismissesKeyboard={"immediately"}
    >
      <Section
        header={
          <Text>{"使用说明"}</Text>
        }
      >
        <Markdown
          content={infoInstrucion}
        />
      </Section>
      <Section
        header={
          <Text>{"通用配置"}</Text>
        }
      >
        <Picker
          value={l10n.value}
          onChanged={updateL10n}
          pickerStyle={"menu"}
          title={"标签语言"}
        >
          {l10nOptions.map(l => (
            <Text tag={l.tag}>
              {l.text}
            </Text>
          ))}
        </Picker>
      </Section>
      <Section
        header={
          <Text>{"禅模式"}</Text>
        }
        footer={
          <Text>{footerZen}</Text>
        }
      >
        <Toggle
          title={"开启禅模式"}
          value={isZen.value}
          onChanged={updateIsZen}
        />
        {isZen.value &&
          <Stepper
            onIncrement={() => updateZenRoundMaxCnt("inc")}
            onDecrement={() => updateZenRoundMaxCnt("dec")}
            onEditingChanged={() => {}}
          >
            <HStack>
              <Text>{"禅定次数"}</Text>
              <Spacer />
              <Text monospaced={true}>{zenRoundMaxCnt.value}</Text>
            </HStack>
          </Stepper>
        }
        {isZen.value &&
          <HStack>
            <Text>{"贤者时间(秒)"}</Text>
            <TextField
              multilineTextAlignment={"trailing"}
              title={"秒"}
              value={zenRoundDurationTs.value.toString()}
              onChanged={updateZenRoundDurationTs}
              keyboardType={"numberPad"}
            />
          </HStack>
        }
      </Section>
      <Section
        header={
          <Text>{"人生模式"}</Text>
        }
        footer={
          <Text>{footerBirthday}</Text>
        }
      >
        <Toggle
          title={"开启人生模式"}
          value={isBirthday.value}
          onChanged={updateIsBirthday}
        />
        {isBirthday.value &&
          <DatePicker
            title="出生日期"
            value={birthdayTs.value}
            onChanged={updateBirthdayTs}
            displayedComponents={['date']}
            datePickerStyle={"compact"}
          />
        }
        {isBirthday.value &&
          <Stepper
            onIncrement={() => updateRetireAge("inc")}
            onDecrement={() => updateRetireAge("dec")}
            onEditingChanged={() => {}}
          >
            <HStack>
              <Text>{"退休年龄"}</Text>
              <Spacer />
              <Text monospaced={true}>{retireAge.value}</Text>
            </HStack>
          </Stepper>
        }
      </Section>
      <Section
        header={
          <Text>{"自定义模式"}</Text>
        }
        footer={
          <Text>{footerCustom}</Text>
        }
      >
        <Toggle
          title={"开启自定义模式"}
          value={isCustom.value}
          onChanged={updateIsCustom}
        />
        {isCustom.value &&
          <HStack>
            <Text>{"展示标签"}</Text>
            <TextField
              multilineTextAlignment={"trailing"}
              title={"建议不超过5个字母或2个汉字"}
              value={customLabel.value}
              onChanged={updateCustomLabel}
            />
          </HStack>
        }
        {isCustom.value &&
          <DatePicker
            title="起始日期"
            value={customStartTs.value}
            onChanged={updateCustomStartTs}
            displayedComponents={['date']}
            datePickerStyle={"compact"}
          />
        }
        {isCustom.value &&
          <DatePicker
            title="结束日期"
            value={customEndTs.value}
            onChanged={updateCustomEndTs}
            displayedComponents={['date']}
            datePickerStyle={"compact"}
          />
        }
      </Section>
    </List>
  </NavigationStack>
}