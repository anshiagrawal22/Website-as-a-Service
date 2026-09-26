import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db_store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Fallback JSON persistence engine
class LocalJSONStore {
  constructor() {
    this.data = {
      users: [],
      businesses: [],
      products: [],
      websites: [],
      inquiries: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading JSON DB:', err.message);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving JSON DB:', err.message);
    }
  }

  getCollection(name) {
    if (!this.data[name]) this.data[name] = [];
    return this.data[name];
  }
}

export const jsonDb = new LocalJSONStore();

export let isMongoConnected = false;

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/waas_platform';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection skipped (${err.message}). Using local persisted JSON DB fallback store.`);
  }
};
