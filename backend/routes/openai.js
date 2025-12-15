const { OpenAI } = require("openai");
const { Router } = require("express");

const router = Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStructuredContent(userPrompt) {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a JSON-only API.

You must ALWAYS return valid JSON that matches this TypeScript shape:

type Segment = {
  segment_name: string;
  content_block: string;
  example_code?: string; // include if the user asks for code
};

type Dataset = {
  columns: string[];                // e.g. ["continent", "year", "poverty_rate_percent"]
  rows: (string | number)[][];      // each row aligns to columns
};

type ChartSpec = {
  chart_id: string;                 // e.g. "poverty_by_continent"
  chart_type: "bar" | "line" | "scatter" | "pie";
  title: string;
  description: string;
  x_field?: string;                 // column name from dataset.columns
  y_field?: string;                 // column name from dataset.columns
  group_by?: string | null;         // optional, for grouping/series
};

type GeneratorResponse = {
  title: string;
  main_topic: string;
  segments: Segment[];

  // Only when relevant:
  dataset?: Dataset;
  charts?: ChartSpec[];
};

General rules:
- Always fill "title", "main_topic", and "segments".
- Segments should contain clear, helpful explanatory content related to the user's request.
- If the user requests code, put any code inside the "example_code" field of the relevant segments.

If the user's request involves:
- data analysis
- analytics
- dashboards
- visualization
- charts
- statistics
- EDA (exploratory data analysis)
- datasets

then you MUST also include:
- "dataset": a small, realistic synthetic dataset appropriate to the request.
- "charts": 2–4 chart specifications describing how to visualize the dataset.

If the user's request does NOT involve data or visualization, do NOT include dataset or charts.

Important:
- Output ONLY valid JSON, no prose outside the JSON
          `,
      },
      {
        role: "user",
        content: `Generate structured content for this request: "${userPrompt}"`,
      },
    ],
    response_format: {
      type: "json_object",
    },
    temperature: 0.5,
  });
  return JSON.parse(response?.choices[0].message?.content);
}
async function explainAndSegment(structuredContent) {
  const contentToExplain = JSON.stringify(structuredContent, null, 2);

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are an explainer that takes the output of GeneratorResponse and returns an enriched view.

The input JSON has this shape (simplified):

type Segment = {
  segment_name: string;
  content_block: string;
  example_code?: string;
};

type Dataset = {
  columns: string[];
  rows: (string | number)[][];
};

type ChartSpec = {
  chart_id: string;
  chart_type: "bar" | "line" | "scatter" | "pie";
  title: string;
  description: string;
  x_field?: string;
  y_field?: string;
  group_by?: string | null;
};

type GeneratorResponse = {
  title: string;
  main_topic: string;
  segments: Segment[];
  dataset?: Dataset;
  charts?: ChartSpec[];
};

You must output ONLY valid JSON matching:

type AnalysisBlock = {
  name: string;          // e.g. "Segment 1: Overview"
  raw_content: string;   // original segment.content_block
  explanation: string;   // an easy-to-understand explanation
  general_tips: string[];// 3–5 short tips, pitfalls, or best practices
  example_code?: string; // if the original segment had example_code, copy it here
};

type ExplainerResponse = {
  final_title: string;
  analysis_blocks: AnalysisBlock[];

  // IMPORTANT:
  // If the input contained dataset or charts,
  // you MUST copy them through unchanged to the output.
  dataset?: Dataset;
  charts?: ChartSpec[];
};

Rules:
- For each input segment, create one AnalysisBlock.
- "name" should be human-friendly, like "Segment 1: <segment_name>".
- "raw_content" MUST be the original segment.content_block, unchanged.
- If segment.example_code exists, copy it into example_code.
- "explanation" should be a clearer, possibly more detailed, rewriting for a general audience.
- "general_tips" must contain 3–5 short, concrete tips.

- If input has "dataset" or "charts", copy them exactly to the output.
- Do NOT invent new dataset or charts here; just pass them through.

Tone:
- professional
- neutral
- concise
- no marketing language, no fluff.

Important:
- Output ONLY valid JSON, no prose outside the JSON.`,
      },
      {
        role: "user",
        content: `Analyze and enrich the following structured content. Base your response title on the original 'title'.\n\n${contentToExplain}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });
  const jsonText = response?.choices[0].message.content;
  return JSON.parse(jsonText);
}

router.post("/create", async (req, res, next) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const structuredContent = await generateStructuredContent(prompt);

    const finalOutput = await explainAndSegment(structuredContent);

    console.log(finalOutput, "finalOutput");
    return res.json({
      response: { data: finalOutput },
    });
  } catch (error) {
    res.status(500).json({ error: " Internal server error during generation" });
    return next(error);
  }
});

module.exports = router;
