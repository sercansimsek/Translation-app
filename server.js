import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_URL,
});

const messages = [
  {
    role: "system",
    content: "You are a translator, translate the given sentence to turkish.",
  },
];

app.post("/api/translate", async (req, res) => {
  const { userPrompt } = req.body;

  messages.push({
    role: "user",
    content: userPrompt,
  });

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AI_MODEL,
      messages,
    });

    const translation = response.choices[0].message.content;
    response.json({ translation });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Its not you, its us.Something went wrong on the server",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
