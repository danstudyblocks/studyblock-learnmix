import { NextRequest, NextResponse } from "next/server"

const DEFAULT_MODEL = process.env.OPENAI_TEACHER_MODEL || "gpt-5-nano"

type TextAiAction = "rewrite" | "translate" | "differentiate"

const baseInstructions = `You are an expert editing assistant for teacher-created learning resources.
Update the provided text according to the requested action.
Keep the result clean and ready to place directly onto a design canvas.
Return only the transformed text with no explanation, intro, or quotation marks unless the source text already requires them.`

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

const getActionInstructions = (
  action: TextAiAction,
  targetLanguage: string,
  rewriteAge: string,
  differentiateMode: string
): string => {
  switch (action) {
    case "rewrite":
      return `Rewrite the text for clarity and flow while preserving the original meaning and roughly the same length. Aim it at readers around age ${rewriteAge}.`
    case "translate":
      return `Translate the text into ${targetLanguage}. Preserve line breaks and structure where possible.`
    case "differentiate":
      return `Differentiate the text for mixed-ability learners. Keep the key meaning, but adapt it to feel ${differentiateMode}.`
    default:
      return "Rewrite the text clearly."
  }
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
    const text = String(body?.text || "").trim()
    const action = String(body?.action || "").trim() as TextAiAction
    const targetLanguage = String(body?.targetLanguage || "Spanish").trim()
    const rewriteAge = String(body?.rewriteAge || "10").trim()
    const differentiateMode = String(body?.differentiateMode || "easier").trim()

    if (!text) {
      return NextResponse.json(
        { error: "Selected text is required." },
        { status: 400 }
      )
    }

    if (!["rewrite", "translate", "differentiate"].includes(action)) {
      return NextResponse.json(
        { error: "Unsupported AI text action." },
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
        input: text,
        instructions: `${baseInstructions}\n${getActionInstructions(
          action,
          targetLanguage,
          rewriteAge,
          differentiateMode
        )}`,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      const errorMessage =
        payload?.error?.message ||
        "OpenAI request failed while transforming the selected text."

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
      content,
      model: DEFAULT_MODEL,
    })
  } catch (error) {
    console.error("Text transform API error:", error)

    return NextResponse.json(
      { error: "Unexpected server error while updating selected text." },
      { status: 500 }
    )
  }
}
