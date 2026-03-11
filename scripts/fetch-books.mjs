#!/usr/bin/env node
/**
 * Fetches books from Goodreads public RSS feeds
 * and writes them to src/data/books.json.
 *
 * Run: node scripts/fetch-books.mjs
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const USER_ID = '38544146';
const OUTPUT = 'src/data/books.json';
const SHELVES = ['read', 'currently-reading', 'want-to-read'];
const PER_PAGE = 30; // Goodreads RSS hard limit

mkdirSync(dirname(OUTPUT), { recursive: true });

function getTextContent(item, tag) {
  const match = item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`));
  return match ? match[1].trim() : '';
}

function getNumPages(item) {
  const match = item.match(/<book[^>]*>[\s\S]*?<num_pages>(\d+)<\/num_pages>[\s\S]*?<\/book>/);
  return match ? parseInt(match[1], 10) : null;
}

async function fetchShelf(shelf) {
  const books = [];
  let page = 1;

  while (true) {
    const url = `https://www.goodreads.com/review/list_rss/${USER_ID}?shelf=${shelf}&page=${page}`;
    console.log(`  Fetching ${shelf} page ${page}...`);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);

    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g);

    if (!items || items.length === 0) break;

    for (const item of items) {
      books.push({
        title: getTextContent(item, 'title'),
        author: getTextContent(item, 'author_name'),
        book_id: getTextContent(item, 'book_id'),
        isbn: getTextContent(item, 'isbn') || null,
        cover: getTextContent(item, 'book_large_image_url') || getTextContent(item, 'book_image_url'),
        num_pages: getNumPages(item),
        user_rating: parseInt(getTextContent(item, 'user_rating'), 10) || 0,
        average_rating: parseFloat(getTextContent(item, 'average_rating')) || 0,
        date_added: getTextContent(item, 'user_date_added') || null,
        date_read: getTextContent(item, 'user_read_at') || null,
        book_published: getTextContent(item, 'book_published') || null,
        link: getTextContent(item, 'link'),
        shelf,
      });
    }

    if (items.length < PER_PAGE) break;
    page++;
  }

  return books;
}

console.log('📚 Fetching books from Goodreads...');

const allBooks = [];
for (const shelf of SHELVES) {
  const books = await fetchShelf(shelf);
  allBooks.push(...books);
  console.log(`  ✓ ${shelf}: ${books.length} books`);
}

writeFileSync(OUTPUT, JSON.stringify(allBooks, null, 2));
console.log(`✓ Wrote ${allBooks.length} books to ${OUTPUT}`);
