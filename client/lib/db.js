// lib/db.js
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'chatlist.db'));

export function createTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS chats (      
      chatId INTEGER PRIMARY KEY,
      charName TEXT UNIQUE,
      charImageUrl TEXT
    )
  `).run();
}

export function getAllChats() {
  return db.prepare('SELECT * FROM chats').all();
}

export function addChat(name, chatId, imageUrl) {
  return db.prepare('INSERT INTO chats (chatId, charName, charImageUrl) VALUES (?, ?, ?)').run(name, chatId, imageUrl);
}
export function deleteChat(chatId) {
  return db.prepare('DELETE FROM chats WHERE chatId = ?').run(chatId);
}
