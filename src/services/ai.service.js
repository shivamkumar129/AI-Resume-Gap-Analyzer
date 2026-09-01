const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeResume = async (resumeText, jobDescription) => {

    const prompt = `
You are an expert ATS resume analyzer and career advisor.

Analyze the following resume against the job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY valid JSON.

Use exactly this structure:

{
    "atsScore": 0,
    "compatibilityScore": 0,
    "matchedSkills": [],
    "missingSkills": [],
    "resumeSummary": "",
    "strengths": [],
    "weaknesses": [],
    "roadmap": [
        {
            "skill": "",
            "reason": "",
            "resources": [],
            "priority": "High"
        }
    ]
}

Rules:
- atsScore must be between 0 and 100.
- compatibilityScore must be between 0 and 100.
- matchedSkills must contain skills found in both the resume and job description.
- missingSkills must contain important skills required by the job but missing from the resume.
- Do not invent skills that are not supported by the resume or job description.
- strengths must be based on the actual resume.
- weaknesses must identify genuine gaps.
- roadmap must prioritize the most important missing skills.
- Return JSON only.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    const text = response.text;

    // Remove markdown code fences if Gemini adds them
    const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let result;

try {
    result = JSON.parse(cleanText);
} catch (error) {
    throw new Error("AI returned invalid JSON");
}

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

if (!Array.isArray(result.roadmap)) {
    result.roadmap = [];
}

return result;
};

module.exports = {
    analyzeResume
};