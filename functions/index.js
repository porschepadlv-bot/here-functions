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

const completion = await openai.chat.completions.create({
model: "gpt-4.1-mini",
temperature: 1.1,
messages: [
{
role: "system",
content: `You write text-message replies.

STRICT RULES:
- Match the tone EXACTLY
- DO NOT sound polite or emotional unless tone says so
- Funny = witty, playful, slightly sarcastic, confident
- Flirty = bold, playful, attraction-building
- Direct = blunt, confident, short
- Polite = calm, respectful, emotionally mature
- Keep replies SHORT (1–2 lines max)
- Exactly 3 replies
- Each reply on its own line
- No numbering
- No quotes
- Sound like real texting, not therapy`
},
{
role: "user",
content: `Tone: ${mode}

Message:
${message}

Write 3 replies now.`
}
]
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