import { Button, Circle, Divider, ForEach, Grid, GridRow, Image, ShapeStyle, Spacer, Text, VStack, ZStack } from "scripting"
import { ClickIntent } from "./app_intents"
import { isShowCurrent } from "./data"

const weekendColor = "systemGray"
const calandarFont = { name: "Avenir-Medium", size: 10 }

export function TodayView({
  month,
  date,
}: {
  month: number,
  date: number,
}) {
  const monthTrans = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  return <VStack alignment="center">
    <Button
      buttonStyle={"plain"}
      intent={ClickIntent("up")}
    >
      <Image
        systemName="chevron.compact.up"
        imageScale="large"
        foregroundStyle="systemGray6"
        opacity={0.5}
      />
    </Button>
    <Spacer />
    <VStack>
      <Text
        font={14}
        fontWeight={"black"}
        foregroundStyle={"systemGray"}
      >
        {monthTrans[month]}
      </Text>
      <ZStack>
        <Button
          buttonStyle={"plain"}
          intent={ClickIntent("back")}
          hidden={!isShowCurrent()}
        >
          <Text
            font={18}
            fontWeight={"black"}
            fontDesign={"rounded"}
            monospacedDigit={true}
          >
            {date}
          </Text>
        </Button>
        <Button
          buttonStyle={"plain"}
          intent={ClickIntent("back")}
          hidden={isShowCurrent()}
        >
          <Image
            systemName="arrow.uturn.left.square.fill"
            imageScale="large"
          />
        </Button>
      </ZStack>
    </VStack>
    <Spacer />
    <Button
      buttonStyle={"plain"}
      intent={ClickIntent("down")}
    >
      <Image
        systemName="chevron.compact.down"
        imageScale="large"
        foregroundStyle="systemGray6"
        opacity={0.5}
      />
    </Button>
  </VStack>
}

function CalanderHeaderGridRow() {
  const header = ["日", "一", "二", "三", "四", "五", "六"]
  return <GridRow alignment="center">
    <ForEach
      count={7}
      itemBuilder={idx => {
        const day = header[idx]
        return <Text
          key={day}
          font={calandarFont}
          fontWeight={"black"}
          foregroundStyle={idx === 0 || idx === 6 ? weekendColor : "white"}
        >
          {day}
        </Text>
      }}
    />
  </GridRow>
}

function CalanderGridRow({
  dates,
  today,
  start,
}: {
  dates: number[],
  today: number,
  start: number,
}) {
  const showCircle = (idx: number) => {
    const date = dates[start + idx]
    if (date === today && isShowCurrent() === true) return true
    return false
  }
  return <GridRow alignment="center">
    <ForEach
      count={7}
      itemBuilder={idx => {
        let color: ShapeStyle = "white"
        if (idx === 0 || idx === 6) color = weekendColor
        if (showCircle(idx)) color = "black"
        return <ZStack key={idx} >
          <Circle
            fill="white"
            hidden={!showCircle(idx)}
          />
          <Text
            font={calandarFont}
            bold={true}
            monospacedDigit={true}
            foregroundStyle={color}
          >
            {dates[start + idx]}
          </Text>
        </ZStack>
      }}
    />
  </GridRow>
}

export function CalendarView({
  dates,
  today,
}: {
  dates: number[],
  today: number,
}) {
  return <Grid
    alignment="center"
    horizontalSpacing={3}
    verticalSpacing={0}
  >
    <CalanderHeaderGridRow />
    <Divider />
    <ForEach
      count={3}
      itemBuilder={idx => {
        return <CalanderGridRow
          key={idx}
          dates={dates}
          today={today}
          start={idx * 7}
        />
      }}
    />
  </Grid>
}