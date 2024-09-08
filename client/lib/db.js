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
export function getChatImageUrlByName(charName) {
  return db.prepare('SELECT charImageUrl FROM chats WHERE charName = ?').get(charName);
}
export function getChatImageUrlByChatId(chatId) {
  return db.prepare('SELECT charImageUrl FROM chats WHERE chatId = ?').get(chatId);
}
// Function to create 'posts' table if it doesn't exist
export function createPostsTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      chatId INTEGER,
      url_1 TEXT,
      url_2 TEXT,
      url_3 TEXT,
      url_4 TEXT,
      url_5 TEXT
    )
  `).run();
}


export function addPost(chatId, url_1, url_2, url_3, url_4, url_5) {
  return db.prepare('INSERT INTO posts (chatId, url_1, url_2, url_3, url_4, url_5) VALUES (?, ?, ?, ?, ?, ?)').run(chatId, url_1, url_2, url_3, url_4, url_5);
}

export function getAllPosts() {
  return db.prepare('SELECT * FROM posts').all();
}

export function deletePost(id) {
  return db.prepare('DELETE FROM posts WHERE id = ?').run(id);
}
