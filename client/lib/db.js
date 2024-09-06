// lib/db.js
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'chatlist.db'));

export function createTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS chats (
      charName TEXT UNIQUE,
      chatId INTEGER PRIMARY KEY
    )
  `).run();
}

export function getAllChats() {
  return db.prepare('SELECT * FROM chats').all();
}

export function addChat(name, chatId) {
  return db.prepare('INSERT INTO chats (charName, chatId) VALUES (?, ?)').run(name, chatId);
}
export function deleteChat(chatId) {
  return db.prepare('DELETE FROM chats WHERE chatId = ?').run(chatId);
}
