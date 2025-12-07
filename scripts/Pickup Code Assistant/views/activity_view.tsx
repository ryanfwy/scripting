import { Button, HStack, Image, Spacer, Text, VStack, ZStack, Link, Script, RoundedRectangle, Circle, ShapeStyle, LiveActivityState, Capsule, Color } from "scripting"
import { ActivityFinishIntent } from "../app_intents"
import { genThumbnailPath } from "../components/storage"
import { getSetting } from "../components/setting"
import { scriptName } from "../components/constant"

const timestamp2time = (
  timestamp: number,
  style: "time" | "date" | "dateTime" | "dateYear" | "all"
) => {
  const date = new Date(timestamp)
  if (style === "time") return date.toLocaleTimeString()
  if (style === "date") return date.toLocaleDateString().match(/\d+\/\d+$/)
  if (style === "dateTime") return date.toLocaleString().match(/\d+\/\d+ \d+:\d+/)
  if (style === "dateYear") return date.toLocaleDateString()
  return date.toLocaleString()
}

const sizeLogo = 16
const offsetLogo = 3
const heightView = 90
const heightViewMax = 115
const widthImg = 40
const heightImg = 70
const stylePrimary: ShapeStyle = "label"
const styleSecondary: ShapeStyle = "secondaryLabel"
const styleBackground: Color | { light: Color, dark: Color } = Device.systemVersion.match("26") ? "clear" : {
  light: "rgba(255,255,255,0.5)",
  dark: "rgba(0,0,0,0.5)"
}
const styleInactive = "systemGray"

export function LargeActivityView({
  content,
  timestamp,
  state = "active",
  isPadding = true,
  isShowInApp = false
}: {
  content: Record<string, any>,
  timestamp: number,
  state?: LiveActivityState | null,
  isPadding?: boolean,
  isShowInApp?: boolean
}) {
  const { code, seller, items } = content
  const height = Object.keys(content).length <= 2 ? heightView : heightViewMax
  return <HStack
    padding={isPadding ? {
      horizontal: 15,
      vertical: 10
    } : {
      horizontal: 0,
      vertical: 10
    }}
    frame={{ height: height }}
    alignment="center"
    activityBackgroundTint={styleBackground}
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
                fill={state === "active" ? getSetting("systemColor") : styleInactive}
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
                foregroundStyle={state === "active" ? getSetting("systemColor") : styleInactive}
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
        foregroundStyle={stylePrimary}
        padding={{ top: -5 }}
      >
        {code}
      </Text>
      {seller != null &&
        <Text
          font={"body"}
          foregroundStyle={stylePrimary}
          lineLimit={1}
        >
          {seller}
        </Text>
      }
      {items != null &&
        <Text
          font={"footnote"}
          foregroundStyle={styleSecondary}
          lineLimit={1}
        >
          {Array.isArray(items) ? items.join(" | ") : String(items)}
        </Text>
      }
    </VStack>
    <Spacer />
    <VStack
      alignment="trailing"
      padding={{ vertical: 5 }}
    >
      <Text
        font={"footnote"}
        foregroundStyle={styleSecondary}
      >
        {timestamp2time(timestamp, "dateTime")}
      </Text>
      <Spacer />
      {!isShowInApp ? (
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
      ) : (
        <ZStack
          frame={{ width: 50, height: 30 }}
        >
          <Capsule
            fill={state === "active" ? getSetting("systemColor") : styleInactive}
            opacity={0.2}
          />
          <Image
            systemName={"flag.fill"}
            foregroundStyle={state === "active" ? getSetting("systemColor") : styleInactive}
          />
        </ZStack>
      )}
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