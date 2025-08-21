const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 10000;

// Щоб парсити JSON у запитах
app.use(bodyParser.json());

// ✅ Тестовий маршрут для перевірки роботи
app.get("/", (req, res) => {
  res.send("✅ Бот працює! Сервер запущений на Render.");
});

// Тут ви зможете додати webhook для SendPulse
app.post("/webhook", (req, res) => {
  console.log("📩 Новий webhook:", req.body);

  // Відповідь на webhook
  res.json({ reply: "Відповідь від AI-бота" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/sendpulse-webhook", async (req, res) => {
  try {
    const userMessage = req.body.text;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: userMessage }]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    res.json({ text: reply });
  } catch (err) {
    console.error(err);
    res.json({ text: "Вибачте, сталася помилка 😔" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
