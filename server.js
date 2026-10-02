require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5-mini",
      instructions:
        "You are a friendly personal AI calling assistant. Reply naturally and briefly, like a real human phone assistant. Ask useful follow-up questions when needed.",
      input: userMessage
    });

    res.json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI response failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 AI Calling Agent running at http://localhost:${PORT}`);
});