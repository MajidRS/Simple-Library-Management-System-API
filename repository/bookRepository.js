import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const filePath = path.join(dirName, "..", "dev-data", "books.json");

let books;

async function readData() {
  books = JSON.parse(await fs.readFile(filePath, "utf-8"));
  return books;
}

const updateOne = async (currentBook, updatedBook) => {
  books = await readData();
  const bookIndex = books.findIndex((book) => book.id === currentBook.id);
  updatedBook = Object.assign(books[bookIndex], updatedBook);
  books[bookIndex] = updatedBook;
  await writeData(books);
  return updatedBook;
};

const createOne = async (newBook) => {
  books = await readData();
  books.push(newBook);
  await writeData(books);
};

const deleteOne = async (currentBook) => {
  books = await readData();
  const bookIndex = books.findIndex((book) => book.id === currentBook.id);
  books.splice(bookIndex, 1);
  await writeData(books);
};

async function writeData(books) {
  await fs.writeFile(filePath, JSON.stringify(books, null, 2), "utf-8");
}

export { readData, writeData, updateOne, createOne, deleteOne };
