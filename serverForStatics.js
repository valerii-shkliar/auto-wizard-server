import express from 'express';
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const dbPath = path.join(__dirname, 'db.json');
const dbRaw = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

function generateId(db) {
  if (Array.isArray(db) || (typeof db === 'object' && db !== null)) {
    for (const key in db) {
      const item = db[key];

      if (Array.isArray(item)) {
        generateId(item);
        continue;
      }
      if (typeof item === 'object') {
        item.id = uuidv4();
        generateId(item);
      }
    }
  }
}
generateId(dbRaw);

const tempDbPath = path.join(__dirname, 'db-with-ids.json');
fs.writeFileSync(tempDbPath, JSON.stringify(dbRaw, null, 2), 'utf-8');

const router = jsonServer.router('db-with-ids.json');
const middlewares = jsonServer.defaults();

// Раздача статики из папки public по пути /static
app.use('/static', express.static(path.join(__dirname, 'static')));

// Подключение middleware json-server
app.use(middlewares);
app.use('/api', router);

// Запуск сервера
// const PORT = 4000;
// app.listen(PORT, () => {
//   console.log(`✅ JSON Server is running at http://localhost:${PORT}`);
//   console.log(`📁 Static files available at http://localhost:${PORT}/static`);
// });
