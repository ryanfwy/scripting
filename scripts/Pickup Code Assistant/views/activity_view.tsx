import { Button, HStack, Image, Spacer, Text, VStack, ZStack, Link, Script, RoundedRectangle, Circle } from "scripting"
import { ActivityFinishIntent } from "../app_intents"
import { genThumbnailPath } from "../components/storage"
import { getSetting } from "../components/setting"
import { scriptName } from "../components/constant"

const timestamp2time = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

const sizeLogo = 16
const offsetLogo = 3
const heightView = 100
const widthImg = 40
const heightImg = 70

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
    frame={{ height: heightView }}
    alignment="center"
    activityBackgroundTint={"clear"}
  >
    <Link
      // activity 点击后启动 app 携带参数
      // { activity, timestamp }
      url={Script.createRunURLScheme(scriptName, {
        activity: "true",
        timestamp: String(timestamp)
      })}
    >
      <ZStack
        frame={{
          width: widthImg,
          maxHeight: heightImg,
        }}
        overlay={{
          alignment: "bottomTrailing",
          content:
            <ZStack
              frame={{
                width: sizeLogo,
                height: sizeLogo
              }}
              offset={{
                x: 0,
                y: offsetLogo
              }}
            >
              <RoundedRectangle
                fill={getSetting("systemColor")}
                cornerRadius={sizeLogo * 0.25}
                style={"continuous"}
              />
              <Circle
                fill={"white"}
                padding={sizeLogo * 0.1}
              />
              <Image
                font={sizeLogo * 0.65}
                systemName={"rosette"}
                imageScale={"small"}
                fontWeight={"bold"}
                foregroundStyle={getSetting("systemColor")}
              />
            </ZStack>
        }}
      >
        <ZStack
          frame={{
            width: widthImg - offsetLogo * 2
          }}
        >
          <Image
            filePath={genThumbnailPath(timestamp).pathResized}
            resizable={true}
            scaleToFit={true}
            clipShape={{
              type: "rect",
              cornerRadius: 3,
              style: "continuous"
            }}
          />
        </ZStack>
      </ZStack>
    </Link>
    <VStack
      alignment="leading"
    >
      <Text
        font={"largeTitle"}
        fontDesign={"rounded"}
        fontWeight={"semibold"}
        foregroundStyle={"label"}
        allowsTightening={true}
      >
        {code}
      </Text>
      <Text
        font={"body"}
        foregroundStyle={"lightText"}
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
        foregroundStyle={"lightText"}
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