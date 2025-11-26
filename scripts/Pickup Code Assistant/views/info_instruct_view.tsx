import { Markdown, DisclosureGroup, Group } from "scripting"
import { infoInstrucionMain, infoInstructionStep, infoInstructionUsage } from "../components/constant"

export function InfoInstructionView() {
  return <Group>
    <Markdown
      content={infoInstrucionMain}
    />
    <DisclosureGroup
      title={"使用步骤"}
    >
      <Markdown
        content={infoInstructionStep}
        padding={{ leading: -10 }}
      />
    </DisclosureGroup>
    <DisclosureGroup
      title={"使用说明"}
    >
      <Markdown
        content={infoInstructionUsage}
        padding={{ leading: -10 }}
      />
    </DisclosureGroup>
  </Group>
}