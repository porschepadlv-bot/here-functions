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
flirty: "Respond in a confident, smooth, very flirty tone.",
funny: "Respond in a witty, clever, funny way (not corny).",
polite: "Respond respectfully, calm, emotionally mature.",
direct: "Respond confidently, bold, straight to the point."
};

const prompt = `
User said: "${message}"

Give 3 short replies.

Tone: ${tonePrompt[mode] || tonePrompt.flirty}

Keep responses natural, human, and text-message style.
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