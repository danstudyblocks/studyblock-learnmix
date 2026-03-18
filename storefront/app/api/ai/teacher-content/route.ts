import { NextRequest, NextResponse } from "next/server"

const DEFAULT_MODEL = process.env.OPENAI_TEACHER_MODEL || "gpt-5-nano"

const systemPrompt = `You are an expert teaching assistant for classroom educators.
Generate practical, classroom-ready learning content in plain text.
Use clear headings, short bullet points, and concise explanations.
Tailor the answer to the requested teaching resource type.
Do not mention that you are an AI.
Return only the requested educational content.`

const extractOutputText = (payload: any): string => {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim()
  }

  const segments =
    payload?.output
      ?.flatMap((item: any) => item?.content || [])
      ?.filter((item: any) => item?.type === "output_text")
      ?.map((item: any) => item?.text || "") || []

  return segments.join("\n").trim()
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing OPENAI_API_KEY. Add your OpenAI API key to storefront/.env.local.",
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const prompt = String(body?.prompt || "").trim()
    const title = String(body?.title || "Teacher content").trim()
    const resourceType = String(body?.resourceType || "resource").trim()

    if (!prompt) {
      return NextResponse.json(
        { error: "A topic and prompt are required." },
        { status: 400 }
      )
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        input: prompt,
        instructions: `${systemPrompt}\nRequested resource type: ${resourceType}.`,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      const errorMessage =
        payload?.error?.message || "OpenAI request failed while generating content."

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const content = extractOutputText(payload)

    if (!content) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      )
    }

    return NextResponse.json({
      title,
      content,
      model: DEFAULT_MODEL,
    })
  } catch (error) {
    console.error("Teacher content API error:", error)

    return NextResponse.json(
      { error: "Unexpected server error while generating teacher content." },
      { status: 500 }
    )
  }
}
