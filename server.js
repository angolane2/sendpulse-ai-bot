import express from "express";

const app = express();

// Middleware (щоб парсити JSON)
app.use(express.json());

// Тестовий маршрут (щоб перевірити роботу сервера)
app.get("/", (req, res) => {
  res.send("✅ Сервер працює на Render!");
});

// Render обов'язково підставляє свій порт у process.env.PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
});
