import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// використовуємо bodyParser для прийому JSON
app.use(bodyParser.json());

// 🚨 Сюди вставляється ваш ключ або краще зберегти в Render як ENV
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";

// головний webhook
app.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message || "Привіт";

    // запит до OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();

    // дістаємо текст відповіді
    const reply = data.choices?.[0]?.message?.content || "Вибачте, сталася помилка";

    res.json({ reply });
  } catch (error) {
    console.error("Помилка:", error);
    res.json({ reply: "Сталася внутрішня помилка сервера" });
  }
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Сервер запущено на порту ${PORT}`);
});
