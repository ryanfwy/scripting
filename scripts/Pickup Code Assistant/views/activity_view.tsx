import { Button, HStack, Image, Spacer, Text, VStack, ZStack, Capsule } from "scripting"
import { ActivityFinishIntent } from "../app_intents"
import { getSetting } from "../components/setting"

const timestamp2time = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

export function LargeActivityView({
  code,
  seller,
  timestamp,
  isPadding = true
}: {
  code: string,
  seller: string,
  timestamp: number,
  isPadding?: boolean
}) {
  return <HStack
    padding={isPadding ? {
      horizontal: 15,
      vertical: 20
    } : {
      horizontal: 0,
      vertical: 20
    }}
    frame={{ height: 100 }}
    alignment="center"
  >
    <ZStack>
      <Capsule
        fill={getSetting("systemColor")}
        frame={{
          width: 40
        }}
      />
      <Image
        systemName={"rosette"}
        imageScale={"large"}
        fontWeight={"bold"}
      />
    </ZStack>
    <VStack
      alignment="leading"
    >
      <Text
        font={"largeTitle"}
        fontDesign={"rounded"}
        fontWeight={"bold"}
        foregroundStyle={getSetting("systemColor")}
        allowsTightening={true}
      >
        {code}
      </Text>
      <Text
        font={"body"}
        padding={{
          bottom: 5
        }}
      >
        {seller}
      </Text>
    </VStack>
    <Spacer />
    <VStack
      alignment="trailing"
    >
      <Text
        font={"footnote"}
        foregroundStyle={"systemGray"}
      >
        {timestamp2time(timestamp)}
      </Text>
      <Spacer />
      <Button
        intent={ActivityFinishIntent(timestamp)}
        controlSize={"mini"}
        buttonBorderShape={"capsule"}
        foregroundStyle={getSetting("systemColor")}
        tint={getSetting("systemColor")}
      >
        <Image
          systemName={"checkmark"}
          imageScale={"large"}
          fontWeight={"bold"}
        />
      </Button>
    </VStack>
  </HStack>
}

export function MiniActivityViewLeading() {
  return <Image
    systemName={"rosette"}
    foregroundStyle={getSetting("systemColor")}
  />
}

export function MiniActivityViewTrailing({
  code
}: {
  code: string
}) {
  return <Text
    foregroundStyle={getSetting("systemColor")}
  >
    {code}
  </Text>
}