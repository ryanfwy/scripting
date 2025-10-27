import { Markdown, Button, NavigationStack, Text, List, Section, Navigation } from "scripting"
import { infoRunFooter, infoInstrucion, headerStyle, scriptName } from "../components/constant"
import { getSetting } from "../components/setting"
import { TaskList } from "./tasklist_view"
import { SettingView } from "./setting_view"

export function InfoView() {
  return <NavigationStack>
    <List
      navigationTitle={scriptName}
      navigationBarTitleDisplayMode={"automatic"}
      toolbar={{
        topBarTrailing: [<Button
          systemImage={"gear"}
          title={""}
          tint={getSetting("systemColor")}
          action={() => {
            Navigation.present({
              element: <SettingView />
            })
          }}
        />]
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
            {"使用说明"}
          </Text>
        }
      >
        <Markdown
          content={infoInstrucion}
        />
      </Section>
    </List>
  </NavigationStack>
}