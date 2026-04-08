const express = require("express"); 
const app = express(); 
app.use(express.json()); 
// Dating tones 
const datingModes = ["flirty", "funny", "polite", "direct"]; 
function getDatingReplies(message, mode, previousReplies = []) {  const pools = { 
 flirty: [ 
 "Careful… you keep talking like that and I might start liking you more.",  "So when are you taking me out then?", 
 "You’re kinda making this easy for me ■", 
 "I feel like you’re trouble… but the good kind." 
 ], 
 funny: [ 
 "Wait… is this your official way of flirting or should I be concerned?",  "I’m trying to decide if this is cute or chaotic ■", 
 "You really said that with confidence huh", 
 "I’m gonna need a little more effort than that lol" 
 ], 
 polite: [ 
 "Hey, I like where this is going ■", 
 "That’s nice of you to say, I appreciate it", 
 "I’m enjoying talking to you so far", 
 "You seem really easy to talk to" 
 ], 
 direct: [ 
 "I like you. I’m not gonna overcomplicate it.", 
 "I’m interested, just keeping it simple", 
 "Let’s not play games, I’m into you", 
 "I’m seeing potential here, not gonna lie" 
 ] 
 }; 
 let pool = pools[mode] || pools["flirty"]; 
 const unique = pool.filter(r => !previousReplies.includes(r));  const source = unique.length ? unique : pool; 
 return source.sort(() => Math.random() - 0.5).slice(0, 4); } 
app.post("/reply", (req, res) => { 
 const { message = "", mode = "flirty", previousReplies = [] } = req.body; 
 if (!message.trim()) { 
 return res.json({ replies: [] }); 
 } 
 const replies = getDatingReplies(message, mode, previousReplies);  res.json({ replies }); 
}); 
app.get("/", (req, res) => { 
 res.send("Server running"); 
}); 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
 console.log("Server running on port " + PORT); 
});
