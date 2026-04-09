const express = require("express");
const app = express();

app.use(express.json());

app.post("/reply", async (req, res) => {
const message = req.body.message || "";
const mode = req.body.mode || "flirty";

console.log("FULL BODY:", req.body);
console.log("MODE RECEIVED:", mode);

if (mode === "funny") {
return res.json({
replies: [
"FUNNY TEST 1",
"FUNNY TEST 2",
"FUNNY TEST 3"
]
});
}

if (!message.trim()) {
return res.json({ replies: [] });
}

return res.json({
replies: [
"NON-FUNNY TEST 1",
"NON-FUNNY TEST 2",
"NON-FUNNY TEST 3"
]
});
});

app.get("/", (req, res) => {
res.send("Server is running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("Server running on port " + PORT);
});