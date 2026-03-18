import { observer } from "mobx-react-lite"
import { SectionTab } from "polotno/side-panel"
import { useState } from "react"

type ResourceType =
  | "lesson-outline"
  | "worksheet"
  | "quiz"
  | "objectives"
  | "activity"
  | "keyword-list"

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  title?: string
  body: string
  canvasText?: string
  error?: boolean
}

type TeacherRequest = {
  topic: string
  yearGroup: string
  resourceType: ResourceType
  objective: string
  notes: string
  chatPrompt: string
}

const resourceOptions: {
  value: ResourceType
  label: string
  description: string
}[] = [
  {
    value: "lesson-outline",
    label: "Lesson outline",
    description:
      "Build a structured lesson with objectives, flow, support, and plenary ideas.",
  },
  {
    value: "worksheet",
    label: "Worksheet questions",
    description:
      "Create a classroom-ready worksheet with short-answer prompts and extension tasks.",
  },
  {
    value: "quiz",
    label: "Quiz",
    description:
      "Generate a quick assessment with checks for understanding and answer guidance.",
  },
  {
    value: "objectives",
    label: "Learning objectives",
    description:
      "Draft clear learning objectives and success criteria for your lesson topic.",
  },
  {
    value: "activity",
    label: "Class activity",
    description:
      "Create an engaging classroom activity with setup, steps, and differentiation.",
  },
  {
    value: "keyword-list",
    label: "Keyword list",
    description:
      "Produce ten topic keywords with concise definitions for teaching and retrieval.",
  },
]

const starterPrompts = [
  "Create a 30 minute starter activity",
  "Turn this topic into a quick quiz",
  "Differentiate this for mixed ability learners",
]

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const getResourceMeta = (resourceType: ResourceType) =>
  resourceOptions.find((option) => option.value === resourceType) ??
  resourceOptions[0]

const buildAssistantIntro = (resourceType: ResourceType): ChatMessage => {
  const resource = getResourceMeta(resourceType)

  return {
    id: createId(),
    role: "assistant",
    title: resource.label,
    body: `You’re in ${resource.label.toLowerCase()} mode. Add a topic and I’ll generate content that matches this resource type for teachers.`,
  }
}

const cleanLine = (value: string) => value.trim().replace(/\s+/g, " ")

const buildAudienceLine = (yearGroup: string) =>
  yearGroup ? `Year group: ${yearGroup}` : "Year group: adaptable"

const buildObjectiveLine = (objective: string) =>
  objective ? `Learning goal: ${objective}` : ""

const buildNotesLine = (notes: string) =>
  notes ? `Teacher notes: ${notes}` : ""

const buildUserPrompt = ({
  topic,
  yearGroup,
  resourceType,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const resourceLabel =
    resourceOptions.find((option) => option.value === resourceType)?.label ??
    "Learning content"

  return [
    `Topic: ${topic}`,
    `Requested: ${resourceLabel}`,
    buildAudienceLine(yearGroup),
    buildObjectiveLine(objective),
    buildNotesLine(notes),
    chatPrompt ? `Extra instruction: ${chatPrompt}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

const buildLessonOutline = ({
  topic,
  yearGroup,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const goal = objective || `Build confident understanding of ${topic}`

  return {
    title: "Lesson Outline",
    body: [
      `Focus: ${topic}`,
      buildAudienceLine(yearGroup),
      "",
      "Learning objectives",
      `- Understand the key ideas behind ${topic}`,
      `- Explain or demonstrate ${goal.toLowerCase()}`,
      `- Apply learning through a short independent task`,
      "",
      "Lesson flow",
      `1. Starter: ask learners to share what they already know about ${topic}.`,
      `2. Teach: model the key vocabulary, examples, and misconceptions around ${topic}.`,
      `3. Guided practice: complete one example together, then let pairs try a similar task.`,
      `4. Independent task: students create a short response, diagram, or explanation showing what they have learned.`,
      `5. Plenary: end with one retrieval question and one confidence check.`,
      "",
      "Support and stretch",
      `- Support: provide sentence starters and a worked example for ${topic}.`,
      `- Stretch: ask learners to compare ${topic} with a related concept or real-world example.`,
      notes ? `- Teacher note: ${notes}` : "",
      chatPrompt ? `- Additional instruction applied: ${chatPrompt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

const buildWorksheet = ({
  topic,
  yearGroup,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const goal = objective || `secure understanding of ${topic}`

  return {
    title: "Worksheet Questions",
    body: [
      `Topic: ${topic}`,
      buildAudienceLine(yearGroup),
      "",
      "Instructions",
      `Complete the questions below to show your understanding of ${topic}.`,
      "",
      "Questions",
      `1. In your own words, what is ${topic}?`,
      `2. List three important facts or features of ${topic}.`,
      `3. Explain why ${topic} matters in this lesson or subject.`,
      `4. Give one example of ${topic} in action.`,
      `5. What is a common misunderstanding about ${topic}?`,
      `6. How does ${topic} connect to earlier learning?`,
      `7. Write a short paragraph that shows you can ${goal.toLowerCase()}.`,
      `8. Extension: create your own challenge question about ${topic}.`,
      notes ? `Teacher note: ${notes}` : "",
      chatPrompt ? `Adaptation request: ${chatPrompt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

const buildQuiz = ({
  topic,
  yearGroup,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const goal = objective || `check learning on ${topic}`

  return {
    title: "Quick Quiz",
    body: [
      `Topic: ${topic}`,
      buildAudienceLine(yearGroup),
      "",
      "Quiz questions",
      `1. What is the best definition of ${topic}?`,
      `2. Name one important fact about ${topic}.`,
      `3. True or false: a common misconception about ${topic} is always correct.`,
      `4. Give one real example linked to ${topic}.`,
      `5. Which keyword should students remember most when learning ${topic}?`,
      `6. What is one cause, step, or feature connected to ${topic}?`,
      `7. What is one effect, outcome, or result linked to ${topic}?`,
      `8. Short answer: explain ${topic} in one or two sentences.`,
      "",
      "Answer guide",
      `- Answers should show accurate vocabulary, a correct example, and clear explanation to ${goal.toLowerCase()}.`,
      notes ? `- Teacher note: ${notes}` : "",
      chatPrompt ? `- Extra instruction applied: ${chatPrompt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

const buildObjectives = ({
  topic,
  yearGroup,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const goal = objective || `develop understanding of ${topic}`

  return {
    title: "Learning Objectives",
    body: [
      `Topic: ${topic}`,
      buildAudienceLine(yearGroup),
      "",
      "Objectives",
      `- To identify the core ideas and vocabulary linked to ${topic}`,
      `- To explain ${topic} using clear subject language`,
      `- To apply knowledge of ${topic} in an example or task`,
      "",
      "Success criteria",
      `- I can describe ${topic} accurately`,
      `- I can give at least one relevant example of ${topic}`,
      `- I can use what I know to ${goal.toLowerCase()}`,
      notes ? `Teacher note: ${notes}` : "",
      chatPrompt ? `Additional request: ${chatPrompt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

const buildActivity = ({
  topic,
  yearGroup,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const goal = objective || `explore ${topic} collaboratively`

  return {
    title: "Class Activity",
    body: [
      `Focus: ${topic}`,
      buildAudienceLine(yearGroup),
      "",
      "Activity setup",
      `Set learners a collaborative challenge where they must investigate, discuss, or demonstrate ${topic}.`,
      "",
      "Steps",
      `1. Introduce the challenge and success criteria.`,
      `2. Give pairs or groups a prompt card linked to ${topic}.`,
      `3. Ask groups to produce a short explanation, poster, or example.`,
      `4. Share outcomes with the class and compare answers.`,
      "",
      "Teacher guidance",
      `- Aim: ${goal}`,
      `- Support: provide scaffolded prompts or key vocabulary.`,
      `- Stretch: ask students to justify their reasoning or teach another group.`,
      notes ? `- Teacher note: ${notes}` : "",
      chatPrompt ? `- Additional instruction applied: ${chatPrompt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

const buildKeywordList = ({
  topic,
  yearGroup,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const topicWords = topic
    .split(/\s+/)
    .map((word) => word.replace(/[^a-zA-Z0-9-]/g, ""))
    .filter(Boolean)
  const root = topicWords[0] || "Topic"

  const keywords = [
    {
      term: topic,
      definition: `The main idea or subject students are exploring in this lesson.`,
    },
    {
      term: `${root} concept`,
      definition: `A core idea that helps learners explain how ${topic} works.`,
    },
    {
      term: `${root} example`,
      definition: `A real or model example that shows ${topic} in context.`,
    },
    {
      term: `${root} feature`,
      definition: `An important characteristic students should notice about ${topic}.`,
    },
    {
      term: `${root} process`,
      definition: `The steps, sequence, or method involved in understanding ${topic}.`,
    },
    {
      term: `${root} evidence`,
      definition: `Facts, observations, or information that support learning about ${topic}.`,
    },
    {
      term: `${root} cause`,
      definition: `A reason or trigger linked to how ${topic} begins or changes.`,
    },
    {
      term: `${root} effect`,
      definition: `A result, outcome, or consequence connected to ${topic}.`,
    },
    {
      term: `${root} vocabulary`,
      definition: `Key subject language students should use when discussing ${topic}.`,
    },
    {
      term: `${root} misconception`,
      definition: `A common mistake or confusion students may have about ${topic}.`,
    },
  ]

  return {
    title: "Keyword List",
    body: [
      `Topic: ${topic}`,
      buildAudienceLine(yearGroup),
      objective ? `Learning goal: ${objective}` : "",
      "",
      "Keywords and definitions",
      ...keywords.map(
        (keyword, index) =>
          `${index + 1}. ${keyword.term}: ${keyword.definition}`
      ),
      notes ? "" : "",
      notes ? `Teacher note: ${notes}` : "",
      chatPrompt ? `Additional instruction applied: ${chatPrompt}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  }
}

const generateLearningContent = (request: TeacherRequest) => {
  switch (request.resourceType) {
    case "worksheet":
      return buildWorksheet(request)
    case "quiz":
      return buildQuiz(request)
    case "objectives":
      return buildObjectives(request)
    case "activity":
      return buildActivity(request)
    case "keyword-list":
      return buildKeywordList(request)
    case "lesson-outline":
    default:
      return buildLessonOutline(request)
  }
}

const buildApiPrompt = ({
  topic,
  yearGroup,
  resourceType,
  objective,
  notes,
  chatPrompt,
}: TeacherRequest) => {
  const resource = getResourceMeta(resourceType)

  return [
    `Create a ${resource.label.toLowerCase()} for teachers.`,
    `Topic: ${topic}`,
    buildAudienceLine(yearGroup),
    objective ? `Learning goal: ${objective}` : "",
    notes ? `Teacher notes: ${notes}` : "",
    chatPrompt ? `Additional instruction: ${chatPrompt}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

const generateTeacherContent = async (request: TeacherRequest) => {
  const response = await fetch("/api/ai/teacher-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resourceType: request.resourceType,
      title: getResourceMeta(request.resourceType).label,
      prompt: buildApiPrompt(request),
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(
      data?.error || "Unable to generate content from the AI service right now."
    )
  }

  return {
    title: data?.title || getResourceMeta(request.resourceType).label,
    body: data?.content || "",
  }
}

const addContentToCanvas = (store: any, message: ChatMessage) => {
  if (!message.canvasText) return

  store.activePage?.addElement({
    type: "text",
    text: message.canvasText,
    x: 60,
    y: 60,
    width: 560,
    fontSize: 22,
    fontFamily: "Roboto",
    fill: "#111111",
  })
}

export const AiSection = {
  name: "ai",
  Tab: (props: any) => (
    <SectionTab name="AI Tools" {...props}>
      <i className="fas fa-robot" />
    </SectionTab>
  ),
  Panel: observer(({ store }: { store: any }) => {
    const [topic, setTopic] = useState("")
    const [yearGroup, setYearGroup] = useState("")
    const [resourceType, setResourceType] = useState<ResourceType | null>(null)
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])

    const selectTool = (nextResourceType: ResourceType) => {
      setResourceType(nextResourceType)
      setMessages([buildAssistantIntro(nextResourceType)])
    }

    const goBackToMenu = () => {
      setResourceType(null)
      setMessages([])
      setLoading(false)
    }

    const generateResponse = async (promptOverride?: string) => {
      if (!resourceType) return

      const normalizedTopic = cleanLine(topic)
      const normalizedPrompt = cleanLine(promptOverride ?? "")

      if (!normalizedTopic) return

      const request: TeacherRequest = {
        topic: normalizedTopic,
        yearGroup: cleanLine(yearGroup),
        resourceType,
        objective: "",
        notes: "",
        chatPrompt: normalizedPrompt,
      }

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        body: buildUserPrompt(request),
      }

      setLoading(true)
      setMessages((current) => [...current, userMessage])

      try {
        const response = await generateTeacherContent(request)
        const assistantMessage: ChatMessage = {
          id: createId(),
          role: "assistant",
          title: response.title,
          body: response.body,
          canvasText: response.body,
        }

        setMessages((current) => [...current, assistantMessage])
      } catch (error) {
        console.error("Error generating learning content:", error)
        const fallback = generateLearningContent(request)
        const message =
          error instanceof Error
            ? error.message
            : "The AI request failed, so a local draft was generated instead."

        setMessages((current) => [
          ...current,
          {
            id: createId(),
            role: "assistant",
            title: `${fallback.title} (local fallback)`,
            body: `${message}\n\n${fallback.body}`,
            canvasText: fallback.body,
            error: true,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    if (!resourceType) {
      return (
        <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
          <div className="border-b border-[#d8d2c8] px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
              AI tools for teachers
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">
              Choose a content generator
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d5549]">
              Start with a tool below, then we’ll build tailored learning content
              from your topic and classroom goals.
            </p>
          </div>

          <div className="grid gap-4 p-6 md:grid-cols-2">
            {resourceOptions.map((resource, index) => (
              <button
                key={resource.value}
                type="button"
                onClick={() => selectTool(resource.value)}
                className="group rounded-[24px] border border-[#ded7cb] bg-white px-5 py-5 text-left transition hover:border-[#171717] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#d8d2c8] bg-[#fcfaf8] text-sm font-semibold text-[#171717]">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-[#171717]">
                      {resource.label}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#5d5549]">
                      {resource.description}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#8a7f71] transition group-hover:text-[#171717]">
                      Open tool
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    }

    const activeResource = getResourceMeta(resourceType)

    return (
      <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
        <div className="border-b border-[#d8d2c8] px-6 py-5">
          <button
            type="button"
            onClick={goBackToMenu}
            className="rounded-full border border-[#d8d2c8] bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#5d5549] transition hover:border-[#171717] hover:text-[#171717]"
          >
            Back to tools
          </button>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
            AI chat for teachers
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">
            {activeResource.label}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d5549]">
            {activeResource.description}
          </p>
        </div>

        <div className="space-y-3 border-b border-[#d8d2c8] px-6 py-5">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#7f7668]">
              Topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="For example: the water cycle"
              className="w-full rounded-xl border border-[#d4ccbf] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition focus:border-[#7b5cff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.16em] text-[#7f7668]">
                Year group
              </label>
              <input
                value={yearGroup}
                onChange={(e) => setYearGroup(e.target.value)}
                placeholder="Year 5"
                className="w-full rounded-xl border border-[#d4ccbf] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none transition focus:border-[#7b5cff]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => generateResponse(prompt)}
                disabled={loading || !cleanLine(topic)}
                className="rounded-full border border-[#d4ccbf] bg-white px-3 py-1.5 text-xs font-medium text-[#3d352c] transition hover:border-[#171717] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          <button
            className="w-full rounded-xl bg-[#171717] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2620] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => generateResponse()}
            disabled={loading || !cleanLine(topic)}
          >
            {loading ? "Generating content..." : "Generate learning content"}
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-2xl border p-4 ${
                message.role === "assistant"
                  ? message.error
                    ? "border-[#d9c1bf] bg-[#fff7f6]"
                    : "border-[#d8d2c8] bg-white"
                  : "border-[#d8d2c8] bg-[#f3ede3]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f7668]">
                    {message.role === "assistant" ? "AI chat" : "You"}
                  </p>
                  {message.title ? (
                    <h3 className="mt-2 text-sm font-semibold text-[#171717]">
                      {message.title}
                    </h3>
                  ) : null}
                </div>

                {message.role === "assistant" && message.canvasText ? (
                  <button
                    type="button"
                    onClick={() => addContentToCanvas(store, message)}
                    className="shrink-0 rounded-full border border-[#d4ccbf] bg-[#fcfaf8] px-3 py-1.5 text-xs font-medium text-[#171717] transition hover:border-[#171717]"
                  >
                    Add to canvas
                  </button>
                ) : null}
              </div>

              <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#2f2a24]">
                {message.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }),
}
