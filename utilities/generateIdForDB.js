import { v4 as uuidv4 } from 'uuid';

export default function generateIdForDB(db) {
  if (Array.isArray(db) || (typeof db === 'object' && db !== null)) {
    for (const key in db) {
      const item = db[key];

      if (Array.isArray(item)) {
        generateIdForDB(item);
        continue;
      }
      if (typeof item === 'object') {
        item.id = uuidv4();
        generateIdForDB(item);
      }
    }
  }
}
