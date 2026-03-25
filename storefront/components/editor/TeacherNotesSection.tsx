"use client"

import { observer } from "mobx-react-lite"
import { useState } from "react"

// ---------------------------------------------------------------------------
// Content extraction
// ---------------------------------------------------------------------------

type TemplateContent = {
  name: string
  texts: string[]
  pageCount: number
}

const extractTemplateContent = (store: any): TemplateContent => {
  const name = (store.name || "Untitled template").trim()
  const texts: string[] = []

  store.pages?.forEach((page: any) => {
    page.children?.forEach((child: any) => {
      if (child.type === "text" && typeof child.text === "string") {
        const cleaned = child.text.replace(/\s+/g, " ").trim()
        if (cleaned.length > 0) texts.push(cleaned)
      }
    })
  })

  return { name, texts, pageCount: store.pages?.length ?? 1 }
}

// ---------------------------------------------------------------------------
// Teacher Notes types & prompts
// ---------------------------------------------------------------------------

type Timing = { activity: string; duration: string }

type NotesData = {
  subject: string
  topic: string
  keyTeachingPoints: string[]
  commonPitfalls: string[]
  suggestedTimings: Timing[]
  extensionIdeas: string[]
}

const buildNotesPrompt = ({ name, texts, pageCount }: TemplateContent): string => {
  const contentLines =
    texts.length > 0
      ? texts.slice(0, 20).map((t, i) => `${i + 1}. ${t}`).join("\n")
      : "(no text content detected on canvas)"

  return [
    `You are an expert teaching assistant. A teacher has a classroom resource open in an editor.`,
    `Analyse the content below, infer what subject and topic it covers, then generate structured teacher notes.`,
    ``,
    `Template name: ${name}`,
    `Pages: ${pageCount}`,
    `Text found on the template:`,
    contentLines,
    ``,
    `Return your response in EXACTLY this format (no extra text outside the sections):`,
    ``,
    `SUBJECT: <subject area e.g. Mathematics, English, Science>`,
    `TOPIC: <specific topic in one short phrase>`,
    ``,
    `KEY TEACHING POINTS:`,
    `- <point directly related to the template content>`,
    `- <point>`,
    `- <point>`,
    `- <point>`,
    ``,
    `COMMON PITFALLS:`,
    `- <pitfall specific to this topic>`,
    `- <pitfall>`,
    `- <pitfall>`,
    ``,
    `SUGGESTED TIMINGS:`,
    `- <activity name> | <duration e.g. 5 mins>`,
    `- <activity name> | <duration>`,
    `- <activity name> | <duration>`,
    `- <activity name> | <duration>`,
    ``,
    `EXTENSION IDEAS:`,
    `- <extension idea that goes beyond this resource>`,
    `- <idea>`,
    `- <idea>`,
    `- <idea>`,
  ].join("\n")
}

// ---------------------------------------------------------------------------
// Worksheet Improvement types & prompts
// ---------------------------------------------------------------------------

type ImprovementData = {
  overallAssessment: string
  spellingIssues: string[]
  punctuationIssues: string[]
  grammarIssues: string[]
  clarityImprovements: string[]
  contentSuggestions: string[]
}

const buildImprovementPrompt = ({ name, texts, pageCount }: TemplateContent): string => {
  const contentLines =
    texts.length > 0
      ? texts.slice(0, 30).map((t, i) => `${i + 1}. ${t}`).join("\n")
      : "(no text content detected on canvas)"

  return [
    `You are an expert proofreader and educational content specialist.`,
    `A teacher has a classroom worksheet open. Carefully review the text for errors and improvements.`,
    ``,
    `Template name: ${name}`,
    `Pages: ${pageCount}`,
    `Text found on the worksheet:`,
    contentLines,
    ``,
    `Check for:`,
    `1. Spelling mistakes`,
    `2. Punctuation errors (missing full stops, incorrect apostrophes, comma splices, etc.)`,
    `3. Grammar issues (subject-verb agreement, tense consistency, sentence fragments, etc.)`,
    `4. Clarity and readability for students`,
    `5. Content gaps, confusing instructions, or areas that could be improved`,
    ``,
    `Return your response in EXACTLY this format (no extra text outside the sections):`,
    ``,
    `OVERALL ASSESSMENT: <one sentence summary of the quality e.g. "Well written with a few minor spelling errors">`,
    ``,
    `SPELLING ISSUES:`,
    `- <"incorrect word" → "correct word" and which item it appears in>`,
    `- <or write "None found" if no issues>`,
    ``,
    `PUNCTUATION ISSUES:`,
    `- <description of issue and suggested correction>`,
    `- <or write "None found" if no issues>`,
    ``,
    `GRAMMAR ISSUES:`,
    `- <description of issue and suggested correction>`,
    `- <or write "None found" if no issues>`,
    ``,
    `CLARITY IMPROVEMENTS:`,
    `- <specific suggestion to improve readability or student understanding>`,
    `- <suggestion>`,
    ``,
    `CONTENT SUGGESTIONS:`,
    `- <suggestion for missing content, better instructions, added scaffolding, etc.>`,
    `- <suggestion>`,
  ].join("\n")
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const parseSection = (raw: string, header: string): string[] => {
  const pattern = new RegExp(`${header}:\\s*\\n([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`, "i")
  const match = raw.match(pattern)
  if (!match) return []
  return match[1]
    .split("\n")
    .map((l) => l.replace(/^[-•*\d.]+\s*/, "").trim())
    .filter(Boolean)
}

const parseField = (raw: string, field: string): string => {
  const match = raw.match(new RegExp(`^${field}:\\s*(.+)$`, "im"))
  return match ? match[1].trim() : ""
}

const callAi = async (prompt: string, resourceType: string): Promise<string | null> => {
  const res = await fetch("/api/ai/teacher-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceType, title: "Teacher Tool", prompt }),
  })
  if (!res.ok) return null
  const data = await res.json().catch(() => null)
  return data?.content || null
}

// ---------------------------------------------------------------------------
// Notes AI + local fallback
// ---------------------------------------------------------------------------

type SubjectProfile = {
  label: string
  teachingPoints: string[]
  pitfalls: string[]
  timings: Timing[]
  extensions: string[]
}

const detectSubject = (texts: string[]): string => {
  const joined = texts.join(" ").toLowerCase()
  if (/\b(equation|fraction|algebra|geometry|multiply|divide|percent|decimal|angle|prime|integer|graph|co-ordinate|coordinate|numeracy|maths|mathematics)\b/.test(joined)) return "mathematics"
  if (/\b(phonics|grammar|punctuation|noun|verb|adjective|adverb|clause|metaphor|simile|comprehension|writing|literacy|english|reading|spelling)\b/.test(joined)) return "english"
  if (/\b(cell|organism|photosynthesis|ecosystem|forces|electricity|circuit|atom|chemical|reaction|biology|physics|chemistry|experiment|hypothesis|evolution|gravity|energy)\b/.test(joined)) return "science"
  if (/\b(continent|country|climate|weather|map|river|mountain|population|migration|urbanisation|geography|biome|earthquake|volcano)\b/.test(joined)) return "geography"
  if (/\b(century|war|empire|parliament|revolution|monarchy|treaty|civilisation|history|ancient|medieval|victorian|timeline|source|evidence)\b/.test(joined)) return "history"
  if (/\b(religion|belief|worship|faith|church|mosque|temple|prayer|festival|sacred|bible|quran|torah|ethics|moral)\b/.test(joined)) return "religious education"
  if (/\b(algorithm|coding|program|loop|variable|sequence|debug|function|data|binary|computational|computer|digital)\b/.test(joined)) return "computing"
  if (/\b(colour|sketch|shade|texture|artist|painting|sculpture|design|composition|pattern|art)\b/.test(joined)) return "art and design"
  return "general"
}

const LOCAL_PROFILES: Record<string, SubjectProfile> = {
  mathematics: {
    label: "Mathematics",
    teachingPoints: [
      "Model the method step-by-step using worked examples before students attempt independently.",
      "Emphasise correct mathematical vocabulary and notation throughout.",
      "Connect the concept to prior learning and real-world contexts to build meaning.",
      "Check procedural understanding before moving to reasoning or problem-solving tasks.",
    ],
    pitfalls: [
      "Students may apply a procedure without understanding why — probe with 'why' questions.",
      "Careless errors with negative numbers, place value, or order of operations are common.",
      "Rushing to answers without showing working prevents feedback and misconception spotting.",
    ],
    timings: [
      { activity: "Starter: mental warm-up or retrieval", duration: "5 mins" },
      { activity: "Teacher modelling with worked examples", duration: "10 mins" },
      { activity: "Guided and independent practice", duration: "15 mins" },
      { activity: "Marking, discussion, and plenary", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to create their own example and explain why it works.",
      "Introduce a problem requiring the concept in an unfamiliar context.",
      "Have students mark and correct 'student work' containing deliberate errors.",
      "Link the topic to a real-world dataset or scenario for analysis.",
    ],
  },
  english: {
    label: "English",
    teachingPoints: [
      "Read any text aloud together first before analysis begins.",
      "Model annotation or response technique explicitly before students attempt independently.",
      "Build subject-specific vocabulary and expect students to use it in responses.",
      "Demonstrate the difference between a weak and a strong response using live examples.",
    ],
    pitfalls: [
      "Students retell rather than analyse — redirect with 'what effect does this create for the reader?'",
      "Vague evidence selections weaken written responses — insist on accurate quotation.",
      "Students rush writing tasks without planning — build planning time explicitly into the session.",
    ],
    timings: [
      { activity: "Reading and shared discussion", duration: "5 mins" },
      { activity: "Teacher modelling of analysis or writing", duration: "10 mins" },
      { activity: "Student writing or annotation task", duration: "15 mins" },
      { activity: "Peer feedback and class sharing", duration: "5 mins" },
    ],
    extensions: [
      "Challenge students to write a paragraph using a different form, audience, or purpose.",
      "Ask students to compare two texts or techniques and evaluate which is more effective.",
      "Have students re-draft a paragraph to improve their use of literary techniques.",
      "Ask students to write from an alternative perspective or voice.",
    ],
  },
  science: {
    label: "Science",
    teachingPoints: [
      "Distinguish clearly between scientific fact, theory, and evidence at the start.",
      "Introduce key vocabulary before the activity and display it throughout.",
      "Link the concept to everyday phenomena students have observed.",
      "Reinforce scientific method — hypothesis, observation, conclusion — even in short tasks.",
    ],
    pitfalls: [
      "Students confuse correlation with causation — address this directly with examples.",
      "Common misconceptions (e.g. weight vs mass, heat vs temperature) must be named and challenged.",
      "Students describe observations without explaining the underlying science — push for explanation.",
    ],
    timings: [
      { activity: "Hook: real-world question or demonstration", duration: "5 mins" },
      { activity: "Teaching and vocabulary input", duration: "10 mins" },
      { activity: "Practical, diagram, or analysis task", duration: "15 mins" },
      { activity: "Explanation writing and review", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to design an experiment to test a related hypothesis.",
      "Have students research a real scientist or discovery connected to this topic.",
      "Introduce conflicting data and ask students to evaluate which source is more reliable.",
      "Ask students to write a scientific explanation for a non-scientist audience.",
    ],
  },
  geography: {
    label: "Geography",
    teachingPoints: [
      "Anchor the lesson geographically — locate the focus area on a map at the start.",
      "Reinforce correct use of geographical terminology throughout.",
      "Encourage students to consider multiple perspectives: environmental, economic, social.",
      "Connect case studies to broader patterns rather than treating them in isolation.",
    ],
    pitfalls: [
      "Students describe rather than explain geographical processes — push for cause and effect.",
      "Over-reliance on one case study without broader application of concepts.",
      "Students mix up physical and human geography concepts — draw distinctions clearly.",
    ],
    timings: [
      { activity: "Locate and contextualise on a map", duration: "5 mins" },
      { activity: "Teach the key concept or process", duration: "10 mins" },
      { activity: "Case study or data analysis task", duration: "15 mins" },
      { activity: "Discussion and evaluation of impacts", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to compare this location or phenomenon with one at a different scale.",
      "Have students evaluate the reliability of the data or map source used.",
      "Challenge students to propose a solution to a geographical issue and justify it.",
      "Ask students to predict how this topic might change over the next 50 years and why.",
    ],
  },
  history: {
    label: "History",
    teachingPoints: [
      "Establish chronological context before exploring causes, events, or consequences.",
      "Teach students to interrogate sources — who created it, why, and what it omits.",
      "Distinguish clearly between cause, consequence, change, and continuity.",
      "Model historical argument structure: claim, evidence, explanation.",
    ],
    pitfalls: [
      "Students narrate events rather than argue or explain — redirect with analytical prompts.",
      "Over-reliance on one source — introduce counter-evidence or alternative interpretations.",
      "Anachronistic thinking — students judge historical figures by modern standards without context.",
    ],
    timings: [
      { activity: "Timeline or context-setting activity", duration: "5 mins" },
      { activity: "Source analysis or teaching input", duration: "10 mins" },
      { activity: "Written response or inquiry task", duration: "15 mins" },
      { activity: "Debate or evaluation discussion", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to write a counter-argument to the main interpretation studied.",
      "Have students rank causes or consequences and justify their order.",
      "Challenge students to write a source a historian in 100 years might analyse.",
      "Compare this event to a similar one in a different period and discuss similarities.",
    ],
  },
  "religious education": {
    label: "Religious Education",
    teachingPoints: [
      "Establish ground rules for respectful discussion of belief and personal faith.",
      "Distinguish between describing a belief and evaluating it — model both approaches.",
      "Use accurate religious terminology and expect students to do the same.",
      "Connect beliefs and practices to the lives of real believers, not just abstract doctrine.",
    ],
    pitfalls: [
      "Students may conflate their personal views with objective description — address early.",
      "Overgeneralising about a religion based on one tradition or text.",
      "Students may avoid engagement with sensitive topics — create a safe and structured space.",
    ],
    timings: [
      { activity: "Establishing context and key vocabulary", duration: "5 mins" },
      { activity: "Exploring beliefs, practices, or texts", duration: "10 mins" },
      { activity: "Analysis, discussion, or written task", duration: "15 mins" },
      { activity: "Reflection and sharing of perspectives", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to compare this belief or practice across two different traditions.",
      "Have students write a response from the perspective of a believer and a non-believer.",
      "Challenge students to evaluate whether a religious teaching is relevant in modern life.",
      "Ask students to research how this topic is practised differently around the world.",
    ],
  },
  computing: {
    label: "Computing",
    teachingPoints: [
      "Decompose the problem or concept clearly before asking students to attempt it.",
      "Use unplugged activities to build conceptual understanding before moving to screens.",
      "Reinforce computational thinking vocabulary: algorithm, sequence, loop, condition.",
      "Encourage testing and debugging as a normal part of the process, not a sign of failure.",
    ],
    pitfalls: [
      "Students copy code without understanding — require explanation or annotation.",
      "Syntax errors frustrate learners — teach them to read error messages systematically.",
      "Students focus on output without understanding the underlying logic.",
    ],
    timings: [
      { activity: "Unplugged or conceptual introduction", duration: "5 mins" },
      { activity: "Teacher demonstration with live code", duration: "10 mins" },
      { activity: "Guided coding or problem-solving task", duration: "15 mins" },
      { activity: "Testing, debugging, and reflection", duration: "5 mins" },
    ],
    extensions: [
      "Challenge students to modify the solution to handle an edge case.",
      "Ask students to optimise their code and explain the improvement.",
      "Have students write a step-by-step algorithm for a non-computing task.",
      "Ask students to peer-review code and suggest improvements with justification.",
    ],
  },
  "art and design": {
    label: "Art and Design",
    teachingPoints: [
      "Provide visual exemplars and artist references to anchor the task before students begin.",
      "Teach technique explicitly — demonstrate before students experiment independently.",
      "Encourage purposeful decision-making: ask 'why did you choose this?' at each stage.",
      "Connect the task to an artist, movement, or cultural context to build critical vocabulary.",
    ],
    pitfalls: [
      "Students rush to finished outcomes — emphasise the value of the process and experimentation.",
      "Descriptive annotations lack analysis — model how to evaluate and explain artistic choices.",
      "Students replicate rather than respond creatively — provide open-ended starting points.",
    ],
    timings: [
      { activity: "Artist or context introduction", duration: "5 mins" },
      { activity: "Technique demonstration", duration: "10 mins" },
      { activity: "Practical exploration or making task", duration: "20 mins" },
      { activity: "Evaluation and peer discussion", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to produce a second response using a contrasting technique or medium.",
      "Have students annotate their work explaining how it connects to the artist studied.",
      "Challenge students to curate a mini portfolio with written evaluations.",
      "Ask students to research how this technique is used differently across cultures.",
    ],
  },
  general: {
    label: "General",
    teachingPoints: [
      "Introduce the key vocabulary on this resource before students begin the task.",
      "Check prior knowledge with a brief question before working through the material.",
      "Model any expected responses or processes explicitly before students work independently.",
      "Use targeted questioning throughout to check understanding and address gaps.",
    ],
    pitfalls: [
      "Students may engage superficially — slow the pace and prompt deeper thinking.",
      "Watch for misconceptions carried over from previous learning.",
      "Allow adequate processing time before expecting written or verbal responses.",
    ],
    timings: [
      { activity: "Warm-up and prior knowledge check", duration: "5 mins" },
      { activity: "Guided walkthrough with teacher input", duration: "10 mins" },
      { activity: "Independent or paired student task", duration: "10 mins" },
      { activity: "Class discussion and plenary review", duration: "5 mins" },
    ],
    extensions: [
      "Ask students to recreate this resource from memory using only key headings.",
      "Connect the content to a real-world scenario or current event.",
      "Have students quiz a partner using the information from this resource.",
      "Ask students to write a one-paragraph summary without referring to the page.",
    ],
  },
}

const buildLocalNotes = ({ name, texts }: TemplateContent): NotesData => {
  const subjectKey = detectSubject(texts)
  const profile = LOCAL_PROFILES[subjectKey] ?? LOCAL_PROFILES.general
  const topic = texts.find((t) => t.length > 3 && t.length < 80) || name
  return {
    subject: profile.label,
    topic,
    keyTeachingPoints: profile.teachingPoints,
    commonPitfalls: profile.pitfalls,
    suggestedTimings: profile.timings,
    extensionIdeas: profile.extensions,
  }
}

const generateNotes = async (content: TemplateContent): Promise<{ data: NotesData; source: "ai" | "local" }> => {
  try {
    const raw = await callAi(buildNotesPrompt(content), "teacher-notes")
    if (raw) {
      const subject = parseField(raw, "SUBJECT")
      const topic = parseField(raw, "TOPIC")
      const keyTeachingPoints = parseSection(raw, "KEY TEACHING POINTS")
      const commonPitfalls = parseSection(raw, "COMMON PITFALLS")
      const extensionIdeas = parseSection(raw, "EXTENSION IDEAS")
      const timingLines = parseSection(raw, "SUGGESTED TIMINGS")
      const suggestedTimings: Timing[] = timingLines.map((line) => {
        const [activity, duration] = line.split("|").map((s) => s.trim())
        return { activity: activity || line, duration: duration || "~10 mins" }
      })
      if (keyTeachingPoints.length > 0 || extensionIdeas.length > 0) {
        return {
          data: {
            subject: subject || "General",
            topic: topic || content.name,
            keyTeachingPoints,
            commonPitfalls,
            suggestedTimings,
            extensionIdeas,
          },
          source: "ai",
        }
      }
    }
  } catch {}
  return { data: buildLocalNotes(content), source: "local" }
}

const generateImprovement = async (content: TemplateContent): Promise<ImprovementData> => {
  const raw = await callAi(buildImprovementPrompt(content), "worksheet-improvement")
  if (!raw) throw new Error("No response from AI")
  return {
    overallAssessment: parseField(raw, "OVERALL ASSESSMENT"),
    spellingIssues: parseSection(raw, "SPELLING ISSUES"),
    punctuationIssues: parseSection(raw, "PUNCTUATION ISSUES"),
    grammarIssues: parseSection(raw, "GRAMMAR ISSUES"),
    clarityImprovements: parseSection(raw, "CLARITY IMPROVEMENTS"),
    contentSuggestions: parseSection(raw, "CONTENT SUGGESTIONS"),
  }
}

// ---------------------------------------------------------------------------
// UI helpers
// ---------------------------------------------------------------------------

const SectionCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="rounded-2xl border border-[#d8d2c8] bg-white p-4">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base leading-none">{icon}</span>
      <h3 className="text-sm font-semibold text-[#171717]">{title}</h3>
    </div>
    {children}
  </div>
)

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm leading-5 text-[#2f2a24]">
        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#7b5cff]" />
        {item}
      </li>
    ))}
  </ul>
)

const NoneFound = () => (
  <p className="text-sm text-[#a39b8e] italic">None found ✓</p>
)

const IssueList = ({ items }: { items: string[] }) => {
  const cleaned = items.filter((i) => !/^none found$/i.test(i.trim()))
  if (cleaned.length === 0) return <NoneFound />
  return (
    <ul className="space-y-2">
      {cleaned.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm leading-5 text-[#2f2a24]">
          <span className="mt-[3px] text-amber-500 shrink-0">→</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Mode-select screen
// ---------------------------------------------------------------------------

const ModeCard = ({
  icon, title, description, onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group w-full rounded-2xl border border-[#d8d2c8] bg-white p-5 text-left transition hover:border-[#7b5cff] hover:shadow-[0_4px_20px_rgba(123,92,255,0.10)]"
  >
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ede3] text-[#7b5cff] transition group-hover:bg-[#ede8ff]">
      {icon}
    </div>
    <h3 className="text-sm font-semibold text-[#171717] mb-1">{title}</h3>
    <p className="text-xs leading-5 text-[#5d5549]">{description}</p>
    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#7b5cff]">
      Run analysis
      <svg className="h-3.5 w-3.5 translate-x-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
)

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type Mode = "select" | "notes" | "improve"

export const TeacherNotesSection = observer(({ store }: { store: any }) => {
  const [mode, setMode] = useState<Mode>("select")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [notesData, setNotesData] = useState<NotesData | null>(null)
  const [notesSource, setNotesSource] = useState<"ai" | "local" | null>(null)

  const [improvementData, setImprovementData] = useState<ImprovementData | null>(null)

  const runNotes = async () => {
    setLoading(true)
    setError(null)
    const content = extractTemplateContent(store)
    try {
      const { data, source } = await generateNotes(content)
      setNotesData(data)
      setNotesSource(source)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const runImprovement = async () => {
    setLoading(true)
    setError(null)
    const content = extractTemplateContent(store)
    try {
      const data = await generateImprovement(content)
      setImprovementData(data)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const selectMode = (selected: Mode) => {
    setMode(selected)
    setError(null)
    if (selected === "notes" && !notesData) runNotes()
    if (selected === "improve" && !improvementData) runImprovement()
  }

  const back = () => {
    setMode("select")
    setError(null)
  }

  // ── Shared header ──────────────────────────────────────────────────────────
  const renderHeader = () => {
    if (mode === "select") {
      return (
        <div className="border-b border-[#d8d2c8] px-6 py-6 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
            Behind the lesson
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">Teacher Tools</h2>
          <p className="mt-3 text-sm leading-6 text-[#5d5549]">
            Choose a tool to run on your current worksheet.
          </p>
        </div>
      )
    }

    if (mode === "notes") {
      return (
        <div className="border-b border-[#d8d2c8] px-6 py-5 flex-shrink-0">
          <button type="button" onClick={back} className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#7f7668] hover:text-[#171717] transition">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to tools
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
            Behind the lesson
          </p>
          <h2 className="mt-1.5 text-xl font-semibold leading-tight">Teacher Notes</h2>
          {notesData && (
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-[#f3ede3] px-3 py-1 text-xs font-semibold text-[#5d5549]">
                {notesData.subject}
              </span>
              <span className="text-xs text-[#5d5549] truncate max-w-[180px]">
                {notesData.topic}
              </span>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="border-b border-[#d8d2c8] px-6 py-5 flex-shrink-0">
        <button type="button" onClick={back} className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#7f7668] hover:text-[#171717] transition">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to tools
        </button>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7f7668]">
          Quality check
        </p>
        <h2 className="mt-1.5 text-xl font-semibold leading-tight">Improve the Worksheet</h2>
        {improvementData?.overallAssessment && (
          <p className="mt-2 text-xs leading-5 text-[#5d5549]">
            {improvementData.overallAssessment}
          </p>
        )}
      </div>
    )
  }

  // ── Body ──────────────────────────────────────────────────────────────────
  const renderBody = () => {
    // Mode select
    if (mode === "select") {
      return (
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
          <ModeCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            }
            title="Teacher Notes & Behind the Lesson"
            description="AI analyses your template and generates key teaching points, common pitfalls, suggested lesson timings, and extension ideas."
            onClick={() => selectMode("notes")}
          />
          <ModeCard
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
            title="Improve the Worksheet"
            description="Checks your worksheet for spelling, punctuation and grammar errors, then suggests improvements to content, clarity and instructions."
            onClick={() => selectMode("improve")}
          />
        </div>
      )
    }

    // Loading state
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d8d2c8] border-t-[#7b5cff]" />
          <p className="text-sm text-[#5d5549]">
            {mode === "notes" ? "Analysing your template…" : "Checking your worksheet…"}
          </p>
        </div>
      )
    }

    // Error state
    if (error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
          <button
            type="button"
            onClick={mode === "notes" ? runNotes : runImprovement}
            className="rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2b2620] transition"
          >
            Try again
          </button>
        </div>
      )
    }

    // Notes results
    if (mode === "notes" && notesData) {
      return (
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-3">
            <SectionCard icon="🎯" title="Key Teaching Points">
              <BulletList items={notesData.keyTeachingPoints} />
            </SectionCard>
            <SectionCard icon="⚠️" title="Common Pitfalls">
              <BulletList items={notesData.commonPitfalls} />
            </SectionCard>
            <SectionCard icon="⏱️" title="Suggested Timings">
              <div className="space-y-2">
                {notesData.suggestedTimings.map((t, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[#2f2a24] leading-5">{t.activity}</span>
                    <span className="shrink-0 rounded-full bg-[#f3ede3] px-2.5 py-0.5 text-xs font-semibold text-[#5d5549]">
                      {t.duration}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard icon="💡" title="Extension Ideas">
              <BulletList items={notesData.extensionIdeas} />
            </SectionCard>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#a39b8e]">
                {notesSource === "ai" ? "AI generated" : "Generated from template"}
              </span>
              <button
                type="button"
                onClick={() => { setNotesData(null); runNotes() }}
                disabled={loading}
                className="rounded-full border border-[#d4ccbf] bg-white px-3 py-1.5 text-xs font-semibold text-[#3d352c] transition hover:border-[#171717] disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Improvement results
    if (mode === "improve" && improvementData) {
      const {
        spellingIssues, punctuationIssues, grammarIssues,
        clarityImprovements, contentSuggestions,
      } = improvementData

      const errorCount = [
        ...spellingIssues.filter((i) => !/^none found$/i.test(i)),
        ...punctuationIssues.filter((i) => !/^none found$/i.test(i)),
        ...grammarIssues.filter((i) => !/^none found$/i.test(i)),
      ].length

      return (
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="space-y-3">
            {/* Summary badge */}
            <div className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${errorCount === 0 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
              <span className="text-lg">{errorCount === 0 ? "✅" : "📝"}</span>
              <div>
                <p className={`text-sm font-semibold ${errorCount === 0 ? "text-green-800" : "text-amber-800"}`}>
                  {errorCount === 0 ? "No errors found" : `${errorCount} issue${errorCount === 1 ? "" : "s"} found`}
                </p>
                <p className={`text-xs mt-0.5 ${errorCount === 0 ? "text-green-700" : "text-amber-700"}`}>
                  {improvementData.overallAssessment}
                </p>
              </div>
            </div>

            <SectionCard icon="🔤" title="Spelling">
              <IssueList items={spellingIssues} />
            </SectionCard>

            <SectionCard icon="✏️" title="Punctuation">
              <IssueList items={punctuationIssues} />
            </SectionCard>

            <SectionCard icon="📖" title="Grammar">
              <IssueList items={grammarIssues} />
            </SectionCard>

            <SectionCard icon="💬" title="Clarity Improvements">
              <BulletList items={clarityImprovements} />
            </SectionCard>

            <SectionCard icon="📋" title="Content Suggestions">
              <BulletList items={contentSuggestions} />
            </SectionCard>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#a39b8e]">AI generated</span>
              <button
                type="button"
                onClick={() => { setImprovementData(null); runImprovement() }}
                disabled={loading}
                className="rounded-full border border-[#d4ccbf] bg-white px-3 py-1.5 text-xs font-semibold text-[#3d352c] transition hover:border-[#171717] disabled:opacity-50"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Fallback (no content + not loading)
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-[#5d5549]">Add some text to your canvas and try again.</p>
        <button
          type="button"
          onClick={mode === "notes" ? runNotes : runImprovement}
          className="rounded-xl bg-[#171717] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2b2620] transition"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-[#fcfaf8] text-[#171717]">
      {renderHeader()}
      {renderBody()}
    </div>
  )
})
