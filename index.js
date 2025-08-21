import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// 🔹 Ваш текст (база знаний)
const companyInfo = `
Я адвокат Скрябін Олексій Миколайович, доктор юридичних наук, професор. Досвід роботи з 2007 року.
Мої послуги: 
- Розлучення
- Аліменти
- Отримання повторних документів ДРАЦС
- Отримання довідок про сімейний стан та довідок про несудимість
- Судові спори за кордоном

Ціни: 
- Консультація — від 1000 грн 
- Представництво в суді — від 5000 грн 
- Пакет документів для розлучення — від 3000 грн

Контакти:
📞 +380667773733 
✉️ skriabinadvokat@gmail.com  
🌐 https://advokat-skriabin.com
`;

// 🔹 Webhook для SendPulse
app.post("/webhook", async (req, res) => {
  try {
    const userMessage = (req.body.message || "").toLowerCase();

    // Запит до OpenAI з вашим текстом
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ти юридичний асистент. Відповідай виключно на основі цього тексту:\n" + companyInfo },
          { role: "user", content: userMessage }
        ],
      }),
    });



    const data = await response.json();

    // Беремо тільки текст відповіді
    const reply = data?.choices?.[0]?.message?.content || "Вибачте, сталася помилка.";

    // ✅ Відповідь у форматі, який чекає SendPulse
    res.json({ reply });

  } catch (error) {
    console.error("Помилка вебхука:", error);
    res.json({ reply: "Сталася технічна помилка. Спробуйте пізніше." });
  }
});

// 🔹 Головна сторінка для перевірки
app.get("/", (req, res) => {
  res.send("✅ Сервер працює. Використовуйте /webhook для SendPulse.");
});

// 🔹 Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
