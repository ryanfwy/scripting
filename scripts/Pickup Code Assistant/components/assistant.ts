import { getSetting } from "../components/setting"

const prompt = (text: string) => {
  const promptTpl = getSetting("modelPrompt")
  return `${promptTpl}\n${text}`
}

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

export async function requestAssistant(text: string) {
  const data: Record<string, any> = await Assistant.requestStructuredData(
    prompt(text),
    schema
  )
  validateAssistantResp(data)
  return data
}