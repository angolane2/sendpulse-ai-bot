import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// Webhook для SendPulse
app.post("/webhook", async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Запит до OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ви юридичний асистент. Відповідайте стисло та по суті." },
          { role: "user", content: userMessage }
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Вибачте, сталася помилка.";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Помилка на сервері." });
  }
});

// 🔹 Додаємо перевірку для головної сторінки
app.get("/", (req, res) => {
  res.send("✅ Сервер працює. Використовуйте /webhook для SendPulse.");
});

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
