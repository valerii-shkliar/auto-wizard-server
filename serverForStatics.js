import express from 'express';
import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import generateIdForDB from './utilities/generateIdForDB.js';
import generateOrderNumber from './utilities/generateOrderNumber.js';
import JSON5 from 'json5';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const dbPath = path.join(__dirname, 'db.json5');
const dbRaw = JSON5.parse(fs.readFileSync(dbPath, 'utf-8'));

generateIdForDB(dbRaw);

const tempDbPath = path.join(__dirname, 'db-with-ids.json');
fs.writeFileSync(tempDbPath, JSON.stringify(dbRaw, null, 2), 'utf-8');

const router = jsonServer.router(tempDbPath);
const middlewares = jsonServer.defaults();

// Подключение middleware json-server
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(middlewares);
app.use(jsonServer.bodyParser);

app.use((req, _res, next) => {
  if (req.method === 'POST' && req.path === '/api/appointments') {
    req.body.orderNumber = generateOrderNumber();
  }
  next();
});
app.use('/api', router);

// Запуск сервера
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ JSON Server is running at http://localhost:${PORT}`);
  console.log(`📁 Static files available at http://localhost:${PORT}/static`);
});
