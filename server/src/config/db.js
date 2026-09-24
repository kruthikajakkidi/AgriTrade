import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialUsers,
  initialLots,
  initialOrders,
  initialWarehouse,
  initialShipments,
  initialSettlements,
  initialDisputes,
  initialAuditLogs,
  initialNotifications
} from '../data/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../../agritrade_store.json');

class DataStore {
  constructor() {
    this.data = {
      users: [...initialUsers],
      lots: [...initialLots],
      orders: [...initialOrders],
      warehouse: JSON.parse(JSON.stringify(initialWarehouse)),
      shipments: [...initialShipments],
      settlements: [...initialSettlements],
      disputes: [...initialDisputes],
      auditLogs: [...initialAuditLogs],
      notifications: [...initialNotifications]
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
        console.log('📦 DataStore loaded from local cache:', DB_FILE);
      } else {
        this.saveToFile();
      }
    } catch (err) {
      console.warn('⚠️ Could not read cache file, using fresh seed data:', err.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('⚠️ Could not save cache file:', err.message);
    }
  }

  // Generic helpers
  get(collection) {
    return this.data[collection] || [];
  }

  find(collection, predicate) {
    const list = this.get(collection);
    return list.filter(predicate);
  }

  findById(collection, id) {
    const list = this.get(collection);
    return list.find(item => item.id === id);
  }

  create(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].unshift(item);
    this.saveToFile();
    return item;
  }

  update(collection, id, updates) {
    const list = this.get(collection);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveToFile();
    return list[index];
  }

  delete(collection, id) {
    const list = this.get(collection);
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    this.saveToFile();
    return true;
  }

  // Reset to initial seed state
  reset() {
    this.data = {
      users: [...initialUsers],
      lots: [...initialLots],
      orders: [...initialOrders],
      warehouse: JSON.parse(JSON.stringify(initialWarehouse)),
      shipments: [...initialShipments],
      settlements: [...initialSettlements],
      disputes: [...initialDisputes],
      auditLogs: [...initialAuditLogs],
      notifications: [...initialNotifications]
    };
    this.saveToFile();
  }
}

export const db = new DataStore();
