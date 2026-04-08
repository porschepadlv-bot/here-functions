const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
res.send("Server is running 🚀");
});

// ---------- FALLBACK (same idea, slightly improved) ----------
function getFallbackReplies(message = "", context = "", previousReplies = []) {
const text = message.toLowerCase();
const wantsClosure = context.toLowerCase().includes("closure");

let pool = [
"That doesn’t sit right with me.",
"I’m not sure I agree with that.",
"We need to actually talk about this.",
"Something feels off here."
];

if (wantsClosure) {
pool = [
"I’m not going to keep dragging this out.",
"I hear you, but I’m stepping back from this.",
"I don’t think there’s anything left to say here.",
"I’m choosing to leave this where it is."
];
}

const unique = pool.filter((r) => !previousReplies.includes(r));
const source = unique.length ? unique : pool;

return source.sort(() => Math.random() - 0.5).slice(0, 4);
}

// ---------- MAIN ROUTE ----------
app.post("/reply", async (req, res) => {
try {
const { message = "", context = "", previousReplies = [] } = req.body;

if (!message.trim()) {
return res.json({ replies: [] });
}

const prompt = `
You generate realistic iPhone text replies.

Situation:
${context}

Message:
${message}

Rules:
- exactly 4 replies
- each reply on new line
- no emojis
- no quotes
- no numbering
- 1–2 sentences max
- very natural texting tone
- each reply must feel DIFFERENT
- no therapy talk
- no generic filler

Tone variety:
1. calm
2. firm
3. honest/hurt
4. questioning

Avoid:
- "I understand"
- robotic phrasing
- generic advice

Make replies feel like real people texting.
`;

const response = await client.chat.completions.create({
model: "gpt-4o-mini",
messages: [{ role: "user", content: prompt }],
temperature: 0.9
});

let text = response.choices?.[0]?.message?.content || "";

let replies = text
.split("\n")
.map((r) => r.trim())
.filter(Boolean);

// remove duplicates + previous
replies = replies.filter((r) => !previousReplies.includes(r));
replies = replies.slice(0, 4);

// fallback if AI fails quality
if (replies.length < 4) {
return res.json({
replies: getFallbackReplies(message, context, previousReplies)
});
}

return res.json({ replies });

} catch (err) {
console.error("AI ERROR:", err);

return res.json({
replies: getFallbackReplies(
req.body.message,
req.body.context,
req.body.previousReplies
)
});
}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});