import { Button, NavigationStack, Text, List, Section, useObservable } from "scripting"
import { infoRunFooter, infoHistoryFooter, headerStyle, scriptName } from "../components/constant"
import { getSetting } from "../components/setting"
import { TaskList } from "./info_task_view"
import { HistoryList } from "./info_history_view"
import { InfoInstructionView } from "./info_instruct_view"
import { SettingView } from "./setting_view"

export function InfoView() {
  const showSetting = useObservable<boolean>(false)

  return <NavigationStack>
    <List
      navigationTitle={scriptName}
      navigationBarTitleDisplayMode={"inline"}
      toolbar={{
        topBarTrailing: [<Button
          systemImage={"gear"}
          title={""}
          tint={getSetting("systemColor")}
          action={() => showSetting.setValue(true)}
        />]
      }}
      sheet={{
        isPresented: showSetting.value,
        onChanged: (value) => showSetting.setValue(value),
        content: <SettingView />
      }}
    >
      <Section
        listRowSeparator={"automatic"}
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"运行详情"}
          </Text>
        }
        footer={
          <Text attributedString={infoRunFooter} />
        }
      >
        <TaskList />
      </Section>
      <Section
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"历史记录"}
          </Text>
        }
        footer={
          <Text>
            {infoHistoryFooter}
          </Text>
        }
      >
        <HistoryList />
      </Section>
      <Section
        header={
          <Text
            font={headerStyle.font}
            fontWeight={headerStyle.fontWeight}
            foregroundStyle={headerStyle.foregroundStyle}
          >
            {"使用介绍"}
          </Text>
        }
      >
        <InfoInstructionView  />
      </Section>
    </List>
  </NavigationStack>
}