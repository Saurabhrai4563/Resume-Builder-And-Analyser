const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's resume and self-description match the job description."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be aksed in the the interview along with the intention."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with the intention."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("List of skill gaps that the candidate has along with the severity of the gap."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day of the week"),
        focus: z.string().describe("The focus area for the day"),
        tasks: z.array(z.string()).describe("The tasks to be completed on the day")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview.")
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    console.log("Inside generateInterviewReport");
    const prompt = `
Generate an interview report.

Return ONLY valid JSON.

The JSON MUST exactly match:

{
  "matchScore": number,
  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],
  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],
  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "tasks": string[]
    }
  ]
}

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            //responseSchema: zodToJsonSchema(interviewReportSchema)

        }
    })
    console.log(response.text)


}

module.exports = generateInterviewReport
