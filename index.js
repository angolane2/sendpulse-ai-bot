import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// Перевірка, що сервер працює
app.get("/", (req, res) => {
  res.send("✅ Сервер працює на Render!");
});

// Основний webhook для SendPulse
app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.message || "Немає повідомлення";

    // Виклик OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Вибачте, сталася помилка при генерації відповіді.";

    // Повертаємо результат у SendPulse
    res.json({ reply });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    res.status(500).json({ error: "Помилка на сервері" });
  }
});

// Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
