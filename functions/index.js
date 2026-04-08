const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
res.send("Server is running");
});

function getFallbackReplies(message = "", context = "", previousReplies = []) {
const text = String(message).toLowerCase();
const lowerContext = String(context).toLowerCase();

const accusationTriggers = [
"you're cheating",
"you are cheating",
"you cheated",
"you lied",
"you're lying",
"you are lying"
];

const isAccusation = accusationTriggers.some((t) => text.includes(t));
const wantsClosure = lowerContext.includes("closure");

let pool = [];

if (isAccusation) {
if (wantsClosure) {
pool = [
"If that's what you think, then maybe there's nothing left to say.",
"You're making a serious accusation, and I'm not staying in something built on that.",
"If trust is already gone, I'm not going to force this.",
"I'm not doing this back and forth if you've already made up your mind."
];
} else {
pool = [
"That's a serious accusation, and it's not true.",
"If you're saying that, explain why.",
"You can't just throw that at me like it's fact.",
"Where is this even coming from?"
];
}
} else {
if (wantsClosure) {
pool = [
"I'm not going to keep dragging this out.",
"I'm leaving this where it is.",
"I don't think there's much left to say.",
"I'm choosing peace over this."
];
} else {
pool = [
"That doesn't sit right with me.",
"We need to talk about this properly.",
"Something feels off here.",
"I need more clarity on this."
];
}
}

const unique = pool.filter((r) => !previousReplies.includes(r));
const source = unique.length ? unique : pool;

return source.sort(() => Math.random() - 0.5).slice(0, 4);
}

app.post("/reply", async (req, res) => {
try {
const { message = "", context = "", previousReplies = [] } = req.body;

const trimmedMessage = String(message).trim();
const trimmedContext = String(context).trim();

if (!trimmedMessage) {
return res.json({ replies: [] });
}

const replies = getFallbackReplies(
trimmedMessage,
trimmedContext,
previousReplies
);

return res.json({ replies });
} catch (err) {
console.error(err);
return res.json({
replies: [
"That doesn't sit right with me.",
"We need to talk about this properly.",
"Something feels off here.",
"I need more clarity on this."
]
});
}
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});