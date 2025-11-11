import { getSetting } from "../components/setting"

const schema: JSONSchemaObject = {
  type: "object",
  properties: {
    code: {
      type: "string",
      required: true,
      description: "取餐码、取件码"
    },
    seller: {
      type: "string",
      required: false,
      description: "商家名称、商店名称、服务商或产品名称"
    },
  },
  description: ""
}

function validateAssistantResp(
  data: Record<string, any>
) {
  if (typeof data !== "object" || data == null) {
    throw Error(`validateAssistantResp: Invalid value type, ${typeof data}`)
  }

  for (const [sk, sv] of Object.entries(schema.properties)) {
    const val = data[sk]
    if (sv.required && (val == null || val === "")) {
      throw Error(`validateAssistantResp: Missing required value, ${JSON.stringify(data)}`)
    }
  }
}

export async function requestAssistant(input: string | UIImage) {
  let data: Record<string, any>
  const prompt = getSetting("modelPrompt")
  if (typeof input === "string") {
    data = await Assistant.requestStructuredData(
      `${prompt}\n${input}`,
      schema
    )
  } else {
    const base64Data = input.toJPEGBase64String(0.5)
    const base64Image = `data:image/jpeg;base64,${base64Data}`
    data = await Assistant.requestStructuredData(
      prompt,
      [base64Image],
      schema
    )
  }
  validateAssistantResp(data)
  return data
}