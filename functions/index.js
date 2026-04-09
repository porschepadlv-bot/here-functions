const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

app.post("/reply", async (req, res) => {
try {
const { message = "", mode = "flirty" } = req.body;

if (!message.trim()) {
return res.json({ replies: [] });
}

const tonePrompt = {
flirty: "confident, playful, slightly teasing, attraction-building",
funny: "witty, playful, slightly sarcastic, light humor, not emotional",
polite: "calm, respectful, emotionally mature",
direct: "confident, bold, straightforward, no fluff"
};

const prompt = `
You are generating text message replies.

STRICT RULES:
- Match the tone EXACTLY
- Do NOT default to polite or emotional unless told
- Keep replies SHORT (1–2 lines max)
- Make them sound like real texting
- No explanations

User message:
"${message}"

Tone:
${tonePrompt[mode] || tonePrompt.flirty}

Give EXACTLY 3 replies.
Each reply on a new line.
`;
const completion = await openai.chat.completions.create({
model: "gpt-4.1-mini",
messages: [{ role: "user", content: prompt }],
temperature: 0.9,
});

const text = completion.choices[0].message.content;

const replies = text
.split("\n")
.map(r => r.replace(/^[0-9.\-\)\s]+/, "").trim())
.filter(r => r.length > 0)
.slice(0, 3);

res.json({ replies });

} catch (err) {
console.error(err);
res.status(500).json({ replies: [] });
}
});

app.get("/", (req, res) => {
res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});