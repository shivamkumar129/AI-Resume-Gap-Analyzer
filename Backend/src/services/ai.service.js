const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const analyzeResume = async (resumeText, jobDescription) => {
    const prompt = `
You are an expert ATS resume analyzer, technical recruiter, and career advisor.

Your task is to analyze a candidate's resume against a specific job description.

IMPORTANT:
- Base every conclusion only on information present in the resume and job description.
- Do not invent experience, skills, certifications, projects, or achievements.
- Be strict and realistic.
- Return ONLY valid JSON.
- Do not use markdown.
- Do not include explanations outside the JSON.

========================
RESUME
========================

${resumeText}

========================
JOB DESCRIPTION
========================

${jobDescription}

========================
SCORING
========================

Calculate two scores:

1. atsScore
Evaluate:
- relevant keywords
- technical skills
- job terminology
- experience relevance
- education/certifications where applicable
- resume clarity and structure

2. compatibilityScore
Evaluate:
- technical skill match
- responsibilities match
- experience relevance
- project relevance
- qualifications
- overall suitability for the role

Both scores must be integers from 0 to 100.

Do not give artificially high scores.

========================
SKILL ANALYSIS
========================

matchedSkills:
Skills that are clearly present in BOTH the resume and job description.

missingSkills:
Important skills explicitly required by the job description but not demonstrated in the resume.

Only include meaningful technical/professional skills.

========================
RESUME SUMMARY
========================

Write a concise professional summary of the candidate based ONLY on the resume.

========================
STRENGTHS
========================

Identify 3-5 genuine strengths that are supported by the resume and relevant to the job.

========================
WEAKNESSES
========================

Identify 3-5 genuine weaknesses or gaps when compared with the job description.
========================
IMPROVEMENT ACTIONS
========================
RESUME IMPROVEMENTS

Identify 3 to 5 specific ways the actual resume can be improved for this job.

Each improvement must:
- Be based only on information actually present in the resume and job description.
- Never invent experience, projects, achievements, metrics, technologies, or qualifications.
- Identify weak, vague, incomplete, or poorly presented resume content.
- Give a practical and specific improvement.
- Provide an example rewrite only when it can be safely supported by the existing resume.
- If a safe rewrite is not possible, provide a useful example structure without inventing facts.

Each item must contain:
- section: Resume section such as Summary, Skills, Projects, Experience, Education, etc.
- issue: What is weak or missing.
- suggestion: Exactly how the candidate should improve it.
- example: A possible improved version based only on available information.
Provide the top 3 most impactful actions the candidate should take to improve their resume for this specific job.

Prioritize actions that can realistically improve:
- ATS keyword matching
- Technical skill alignment
- Job responsibility alignment
- Resume clarity
- Evidence of relevant experience/projects

For every action provide:

action:
A specific action the candidate should take.

reason:
Explain why this action would improve their application for this job.

impact:
Must be exactly one of:
"High"
"Medium"
"Low"

Do not recommend adding a skill if the job description does not require or value it.
Do not invent experience or achievements.

Return exactly 3 actions when enough information is available.
========================
LEARNING ROADMAP
========================

Create a prioritized roadmap based primarily on missingSkills.

For every roadmap item provide:

skill:
The missing skill.

reason:
Why this skill matters for the target job.

resources:
Provide 2-3 useful learning resource names or URLs.

priority:
Must be exactly one of:
"High"
"Medium"
"Low"

Prioritize:
High = essential job requirement
Medium = useful/important
Low = nice to have

========================
OUTPUT FORMAT
========================

{
    "atsScore": 0,
    "compatibilityScore": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "resumeSummary": "",
    "strengths": [],
    "weaknesses": [],
    "improvementActions": [
        {
            "action": "",
            "reason": "",
            "impact": "High"
        }
    ],
    "resumeImprovements": [
  {
    "section": "",
    "issue": "",
    "suggestion": "",
    "example": ""
  }
],
    "roadmap": [
        {
            "skill": "",
            "reason": "",
            "resources": [],
            "priority": "High"
        }
    ]
}

Return ONLY the JSON object.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    const text = response.text;

    const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let result;

    try {
        result = JSON.parse(cleanText);
    } catch (error) {
        console.error("Invalid Gemini JSON:", cleanText);
        throw new Error("AI returned invalid JSON");
    }

    // Validate scores
    if (
        typeof result.atsScore !== "number" ||
        typeof result.compatibilityScore !== "number"
    ) {
        throw new Error("AI returned invalid scores");
    }

    if (
        result.atsScore < 0 ||
        result.atsScore > 100 ||
        result.compatibilityScore < 0 ||
        result.compatibilityScore > 100
    ) {
        throw new Error("AI returned scores outside valid range");
    }

    // Validate arrays
    if (!Array.isArray(result.matchedSkills)) {
        result.matchedSkills = [];
    }

    if (!Array.isArray(result.missingSkills)) {
        result.missingSkills = [];
    }

    if (!Array.isArray(result.strengths)) {
        result.strengths = [];
    }

    if (!Array.isArray(result.weaknesses)) {
    result.weaknesses = [];
}

if (!Array.isArray(result.improvementActions)) {
    result.improvementActions = [];
}
if (!Array.isArray(result.resumeImprovements)) {
    result.resumeImprovements = [];
}
if (!Array.isArray(result.roadmap)) {
    result.roadmap = [];
}
// Validate improvement actions

result.improvementActions = result.improvementActions
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
        action: String(item.action || ""),
        reason: String(item.reason || ""),
        impact: ["High", "Medium", "Low"].includes(item.impact)
            ? item.impact
            : "Medium",
    }))
    .filter((item) => item.action)
    .slice(0, 3);
    // Validate resume improvements

result.resumeImprovements = result.resumeImprovements
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
        section: String(item.section || ""),
        issue: String(item.issue || ""),
        suggestion: String(item.suggestion || ""),
        example: String(item.example || ""),
    }))
    .filter((item) => item.section && item.suggestion)
    .slice(0, 5);
    // Validate roadmap items
    result.roadmap = result.roadmap
        .filter((item) => item && typeof item === "object")
        .map((item) => ({
            skill: String(item.skill || ""),
            reason: String(item.reason || ""),
            resources: Array.isArray(item.resources)
                ? item.resources.map(String)
                : [],
            priority: ["High", "Medium", "Low"].includes(item.priority)
                ? item.priority
                : "Medium",
        }))
        .filter((item) => item.skill);

    return result;
};

module.exports = {
    analyzeResume,
};