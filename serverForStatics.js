import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'images'),
});

// Подключаем middleware и статику
server.use(middlewares);
server.use(jsonServer.bodyParser);

// 👇 Весь JSON при заходе на /
server.get('/', (req, res) => {
  const db = router.db;
  res.status(200).json(db.getState());
});

// 👇 JSON API (после кастомных маршрутов)
server.use(router);

// Старт
const port = process.env.PORT || 10000;
server.listen(port, '0.0.0.0', () => {
  console.log(`✅ JSON Server running on port ${port}`);
});
